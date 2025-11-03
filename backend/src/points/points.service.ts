import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConsumePointsRequest,
  CreateTransactionResponse,
  GetPointHistoryResponse,
  GetTeamPointsResponse,
  PointHistoryQueryParams,
  PointStatus,
  PointTransactionType,
  RechargePointsRequest,
} from '@xiaodashi/shared';
import type { Repository } from 'typeorm';
import { PointTransaction } from '../database/entities/points/point-transaction.entity';
import { TeamPoint } from '../database/entities/points/team-point.entity';

/**
 * 积分服务类
 *
 * 提供积分管理的核心功能：
 * - 积分余额查询
 * - 积分交易历史查询
 * - 积分消耗和充值（事务保证原子性）
 * - 初始积分发放
 */
@Injectable()
export class PointsService {
  private readonly logger = new Logger(PointsService.name);

  constructor(
    @InjectRepository(TeamPoint)
    private readonly teamPointRepository: Repository<TeamPoint>,
    @InjectRepository(PointTransaction)
    private readonly pointTransactionRepository: Repository<PointTransaction>,
  ) {}

  /**
   * 获取团队积分余额
   *
   * @param teamId - 团队ID
   * @returns Promise<GetTeamPointsResponse> - 团队积分信息
   */
  async getBalance(teamId: string): Promise<GetTeamPointsResponse> {
    const teamPoint = await this.teamPointRepository.findOne({
      where: { teamId },
      order: { createdAt: 'DESC' },
    });

    if (!teamPoint) {
      // 如果团队积分记录不存在，返回0余额
      return {
        teamId,
        balance: 0,
        status: PointStatus.ACTIVE,
      };
    }

    // 查询最后一次交易时间
    const lastTransaction = await this.pointTransactionRepository.findOne({
      where: { teamId },
      order: { createdAt: 'DESC' },
    });

    return {
      teamId,
      balance: Number(teamPoint.balance),
      status: teamPoint.status,
      expiresAt: teamPoint.expiresAt?.toISOString(),
      lastTransactionAt: lastTransaction?.createdAt.toISOString(),
    };
  }

  /**
   * 获取团队积分交易历史
   *
   * @param teamId - 团队ID
   * @param pagination - 分页和筛选参数
   * @returns Promise<GetPointHistoryResponse> - 积分交易历史
   */
  async getHistory(
    teamId: string,
    pagination: PointHistoryQueryParams = {},
  ): Promise<GetPointHistoryResponse> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    // 构建查询条件
    const queryBuilder = this.pointTransactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.teamId = :teamId', { teamId })
      .orderBy('transaction.createdAt', 'DESC');

    // 添加筛选条件
    if (pagination.type) {
      queryBuilder.andWhere('transaction.type = :type', {
        type: pagination.type,
      });
    }

    if (pagination.startDate) {
      queryBuilder.andWhere('transaction.createdAt >= :startDate', {
        startDate: pagination.startDate,
      });
    }

    if (pagination.endDate) {
      queryBuilder.andWhere('transaction.createdAt <= :endDate', {
        endDate: pagination.endDate,
      });
    }

    if (pagination.businessType) {
      queryBuilder.andWhere('transaction.businessType = :businessType', {
        businessType: pagination.businessType,
      });
    }

    // 执行分页查询
    const [transactions, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // 转换为响应格式
    const transactionItems = transactions.map((transaction) => ({
      id: transaction.id,
      teamId: transaction.teamId,
      userId: transaction.userId,
      type: transaction.type,
      amount: Number(transaction.amount),
      balanceAfter: Number(transaction.balanceAfter),
      description: transaction.description,
      businessId: transaction.businessId ?? undefined,
      businessType: transaction.businessType ?? undefined,
      createdAt: transaction.createdAt.toISOString(),
    }));

    return {
      transactions: transactionItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 消耗积分（原子性操作）
   *
   * @param dto - 消耗积分请求
   * @returns Promise<CreateTransactionResponse> - 交易结果
   * @throws ForbiddenException - 积分不足时抛出
   */
  async consume(dto: ConsumePointsRequest): Promise<CreateTransactionResponse> {
    const queryRunner =
      this.teamPointRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 锁定并查询团队积分记录（使用 SELECT FOR UPDATE）
      const teamPoint = await queryRunner.manager.findOne(TeamPoint, {
        where: { teamId: dto.teamId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!teamPoint) {
        throw new NotFoundException(`团队 ID ${dto.teamId} 的积分记录不存在`);
      }

      // 检查积分状态
      if (teamPoint.status !== PointStatus.ACTIVE) {
        throw new ForbiddenException(
          `团队积分状态为 ${teamPoint.status}，无法消耗积分`,
        );
      }

      const currentBalance = Number(teamPoint.balance);
      const consumeAmount = Math.abs(dto.amount); // 确保为正数

      // 检查积分是否足够
      if (currentBalance < consumeAmount) {
        this.logger.warn(
          `积分不足: teamId=${dto.teamId}, currentBalance=${currentBalance}, consumeAmount=${consumeAmount}`,
        );
        throw new ForbiddenException(
          `积分不足，当前余额: ${currentBalance}，需要: ${consumeAmount}`,
        );
      }

      // 计算新余额
      const newBalance = currentBalance - consumeAmount;

      // 更新积分余额
      teamPoint.balance = newBalance;
      teamPoint.updatedAt = new Date();
      await queryRunner.manager.save(TeamPoint, teamPoint);

      // 创建交易记录（消耗金额为负数）
      const transaction = queryRunner.manager.create(PointTransaction, {
        teamId: dto.teamId,
        userId: dto.userId,
        type: PointTransactionType.CONSUMPTION,
        amount: -consumeAmount, // 消耗记录为负数
        balanceAfter: newBalance,
        description: dto.description,
        businessId: dto.businessId ?? null,
        businessType: dto.businessType ?? null,
      });

      const savedTransaction = await queryRunner.manager.save(
        PointTransaction,
        transaction,
      );

      await queryRunner.commitTransaction();

      this.logger.log(
        `积分消耗成功: teamId=${dto.teamId}, userId=${dto.userId}, amount=${consumeAmount}, newBalance=${newBalance}`,
      );

      return {
        transaction: {
          id: savedTransaction.id,
          teamId: savedTransaction.teamId,
          userId: savedTransaction.userId,
          type: savedTransaction.type,
          amount: Number(savedTransaction.amount),
          balanceAfter: Number(savedTransaction.balanceAfter),
          description: savedTransaction.description,
          businessId: savedTransaction.businessId ?? undefined,
          businessType: savedTransaction.businessType ?? undefined,
          createdAt: savedTransaction.createdAt.toISOString(),
        },
        newBalance,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 充值积分（原子性操作）
   *
   * @param dto - 充值积分请求
   * @returns Promise<CreateTransactionResponse> - 交易结果
   */
  async recharge(
    dto: RechargePointsRequest,
  ): Promise<CreateTransactionResponse> {
    const queryRunner =
      this.teamPointRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 锁定并查询团队积分记录（使用 SELECT FOR UPDATE）
      let teamPoint = await queryRunner.manager.findOne(TeamPoint, {
        where: { teamId: dto.teamId },
        lock: { mode: 'pessimistic_write' },
      });

      // 如果积分记录不存在，创建新记录
      if (!teamPoint) {
        teamPoint = queryRunner.manager.create(TeamPoint, {
          teamId: dto.teamId,
          balance: 0,
          status: PointStatus.ACTIVE,
        });
        await queryRunner.manager.save(TeamPoint, teamPoint);
      }

      const currentBalance = Number(teamPoint.balance);
      const rechargeAmount = Math.abs(dto.amount); // 确保为正数

      // 计算新余额
      const newBalance = currentBalance + rechargeAmount;

      // 更新积分余额
      teamPoint.balance = newBalance;
      teamPoint.updatedAt = new Date();
      await queryRunner.manager.save(TeamPoint, teamPoint);

      // 创建交易记录
      const transaction = queryRunner.manager.create(PointTransaction, {
        teamId: dto.teamId,
        userId: dto.userId,
        type: PointTransactionType.RECHARGE,
        amount: rechargeAmount,
        balanceAfter: newBalance,
        description: dto.description,
        businessId: dto.businessId ?? null,
        businessType: dto.businessType ?? null,
      });

      const savedTransaction = await queryRunner.manager.save(
        PointTransaction,
        transaction,
      );

      await queryRunner.commitTransaction();

      this.logger.log(
        `积分充值成功: teamId=${dto.teamId}, userId=${dto.userId}, amount=${rechargeAmount}, newBalance=${newBalance}`,
      );

      return {
        transaction: {
          id: savedTransaction.id,
          teamId: savedTransaction.teamId,
          userId: savedTransaction.userId,
          type: savedTransaction.type,
          amount: Number(savedTransaction.amount),
          balanceAfter: Number(savedTransaction.balanceAfter),
          description: savedTransaction.description,
          businessId: savedTransaction.businessId ?? undefined,
          businessType: savedTransaction.businessType ?? undefined,
          createdAt: savedTransaction.createdAt.toISOString(),
        },
        newBalance,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 为新团队创建初始积分记录
   *
   * @param teamId - 团队ID
   * @param initialAmount - 初始积分数量，默认为0
   * @param userId - 操作者ID，用于记录交易
   * @returns Promise<TeamPoint> - 创建的积分记录
   */
  async createInitialBalance(
    teamId: string,
    initialAmount: number = 0,
    userId?: string,
  ): Promise<TeamPoint> {
    // 检查是否已存在积分记录
    const existing = await this.teamPointRepository.findOne({
      where: { teamId },
    });

    if (existing) {
      // 如果已存在，直接返回
      return existing;
    }

    // 创建新的积分记录
    const teamPoint = this.teamPointRepository.create({
      teamId,
      balance: initialAmount,
      status: PointStatus.ACTIVE,
    });

    const savedTeamPoint = await this.teamPointRepository.save(teamPoint);

    // 如果有初始积分且提供了用户ID，记录交易
    if (initialAmount > 0 && userId) {
      const transaction = this.pointTransactionRepository.create({
        teamId,
        userId,
        type: PointTransactionType.INITIAL_GRANT,
        amount: initialAmount,
        balanceAfter: initialAmount,
        description: '团队初始积分发放',
      });

      await this.pointTransactionRepository.save(transaction);
    }

    this.logger.log(
      `创建初始积分记录: teamId=${teamId}, initialAmount=${initialAmount}`,
    );

    return savedTeamPoint;
  }
}
