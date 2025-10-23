import { MigrationInterface, QueryRunner } from 'typeorm';

export class BackfillDefaultTeamsForExistingUsers1761126028612
  implements MigrationInterface
{
  name = 'BackfillDefaultTeamsForExistingUsers1761126028612';

  /**
   * 批处理大小 - 每次处理100个用户，避免对数据库造成过大压力
   */
  private readonly BATCH_SIZE = 100;

  /**
   * 为所有存量用户（无团队关联）自动创建默认个人团队
   *
   * 处理逻辑：
   * 1. 查询所有在 team_members 表中没有记录的用户
   * 2. 为每个用户创建一个默认团队（tier: 'free'）
   * 3. 为每个用户创建对应的团队成员记录（role: 'owner'）
   * 4. 分批处理，避免一次性处理大量数据
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('🚀 开始为存量用户创建默认团队...');

    // 记录迁移开始时间
    const startTime = new Date();
    let totalUsersProcessed = 0;
    let totalTeamsCreated = 0;
    let totalMembersCreated = 0;
    let batchCount = 0;

    try {
      // 查询没有团队关联的用户总数
      const totalUsersQuery = `
                SELECT COUNT(*) as "count"
                FROM users u
                LEFT JOIN team_members tm ON u."id" = tm."userId"
                WHERE tm."userId" IS NULL
            `;

      const totalCountResult = await queryRunner.query(totalUsersQuery);
      const totalUsersToProcess = parseInt(
        (totalCountResult[0] as { count: string })?.count || '0',
        10,
      );

      console.log(`📊 发现 ${totalUsersToProcess} 个存量用户需要创建默认团队`);

      if (totalUsersToProcess === 0) {
        console.log('✅ 没有需要处理的存量用户，迁移完成');
        return;
      }

      // 分批处理用户
      let offset = 0;
      let hasMoreUsers = true;

      while (hasMoreUsers) {
        batchCount++;
        console.log(`\n🔄 开始处理第 ${batchCount} 批数据...`);

        // 查询当前批次的用户
        const usersQuery = `
                    SELECT u."id", u."email", u."name", u."createdAt"
                    FROM users u
                    LEFT JOIN team_members tm ON u."id" = tm."userId"
                    WHERE tm."userId" IS NULL
                    ORDER BY u."createdAt" ASC
                    LIMIT ${this.BATCH_SIZE} OFFSET ${offset}
                `;

        const users = await queryRunner.query(usersQuery);

        if (users.length === 0) {
          hasMoreUsers = false;
          break;
        }

        console.log(`📦 第 ${batchCount} 批包含 ${users.length} 个用户`);

        // 开始事务处理当前批次
        await queryRunner.startTransaction();

        try {
          const batchTeamsCreated: string[] = [];
          const batchMembersCreated: string[] = [];

          // 为每个用户创建团队和成员记录
          for (const user of users) {
            const userData = user as {
              id: string;
              email: string;
              name: string;
            };
            console.log(`  👤 处理用户: ${userData.email} (${userData.name})`);

            // 创建团队记录
            const createTeamQuery = `
                            INSERT INTO teams ("id", "name", "ownerId", "tier", "createdAt", "updatedAt")
                            VALUES (uuid_generate_v4(), $1, $2, 'free', NOW(), NOW())
                            RETURNING "id"
                        `;
            const teamName = `${userData.name}的默认团队`;
            const teamResult = await queryRunner.query(createTeamQuery, [
              teamName,
              userData.id,
            ]);
            const newTeamId = (teamResult[0] as { id: string })?.id;

            if (newTeamId) {
              batchTeamsCreated.push(newTeamId);
              console.log(
                `    ✅ 创建团队成功: ${teamName} (ID: ${newTeamId})`,
              );

              // 创建团队成员记录（所有者角色）
              const createMemberQuery = `
                                INSERT INTO team_members ("id", "teamId", "userId", "role", "displayName", "createdAt", "updatedAt")
                                VALUES (uuid_generate_v4(), $1, $2, 'owner', $3, NOW(), NOW())
                                RETURNING "id"
                            `;
              const memberResult = await queryRunner.query(createMemberQuery, [
                newTeamId,
                userData.id,
                userData.name,
              ]);
              const newMemberId = (memberResult[0] as { id: string })?.id;

              if (newMemberId) {
                batchMembersCreated.push(newMemberId);
                console.log(
                  `    ✅ 创建团队成员成功: ${userData.name} (ID: ${newMemberId})`,
                );
              } else {
                throw new Error(`创建团队成员失败: 用户 ${userData.email}`);
              }
            } else {
              throw new Error(`创建团队失败: 用户 ${userData.email}`);
            }
          }

          // 提交当前批次事务
          await queryRunner.commitTransaction();

          // 更新计数器
          totalUsersProcessed += users.length;
          totalTeamsCreated += batchTeamsCreated.length;
          totalMembersCreated += batchMembersCreated.length;

          console.log(
            `  ✅ 第 ${batchCount} 批处理完成: 创建 ${batchTeamsCreated.length} 个团队, ${batchMembersCreated.length} 个成员`,
          );

          // 更新偏移量
          offset += this.BATCH_SIZE;

          // 如果当前批次处理数量小于批次大小，说明已经是最后一批
          if (users.length < this.BATCH_SIZE) {
            hasMoreUsers = false;
          }
        } catch (error) {
          // 回滚当前批次事务
          await queryRunner.rollbackTransaction();
          console.error(`  ❌ 第 ${batchCount} 批处理失败:`, error);
          throw error;
        }
      }

      // 输出最终统计结果
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      console.log('\n🎉 历史数据迁移完成！');
      console.log('📊 最终统计:');
      console.log(`  • 总处理用户数: ${totalUsersProcessed}`);
      console.log(`  • 创建团队数: ${totalTeamsCreated}`);
      console.log(`  • 创建成员数: ${totalMembersCreated}`);
      console.log(`  • 批次数量: ${batchCount}`);
      console.log(`  • 执行时间: ${duration}ms`);
    } catch (error) {
      console.error('❌ 迁移执行失败:', error);
      throw error;
    }
  }

  /**
   * 回滚迁移 - 删除由此脚本创建的所有团队和成员记录
   *
   * 处理逻辑：
   * 1. 查找所有 tier = 'free' 且只包含一个所有者成员的团队
   * 2. 删除对应的团队成员记录
   * 3. 删除团队记录
   * 4. 分批处理，确保安全性
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('🔄 开始回滚历史数据迁移...');

    // 记录回滚开始时间
    const startTime = new Date();
    let totalTeamsDeleted = 0;
    let totalMembersDeleted = 0;
    let batchCount = 0;

    try {
      // 查询需要删除的团队总数
      // 条件：tier = 'free' 且只有1个成员（所有者）
      const totalTeamsQuery = `
                SELECT COUNT(*) as "count"
                FROM teams t
                WHERE t."tier" = 'free'
                AND (
                    SELECT COUNT(*)
                    FROM team_members tm
                    WHERE tm."teamId" = t."id"
                ) = 1
            `;

      const totalCountResult = await queryRunner.query(totalTeamsQuery);
      const totalTeamsToDelete = parseInt(
        (totalCountResult[0] as { count: string })?.count || '0',
        10,
      );

      console.log(`📊 发现 ${totalTeamsToDelete} 个团队需要回滚删除`);

      if (totalTeamsToDelete === 0) {
        console.log('✅ 没有需要回滚的团队，回滚完成');
        return;
      }

      // 分批处理团队删除
      let offset = 0;
      let hasMoreTeams = true;

      while (hasMoreTeams) {
        batchCount++;
        console.log(`\n🔄 开始处理第 ${batchCount} 批回滚数据...`);

        // 查询当前批次的团队
        const teamsQuery = `
                    SELECT t."id", t."name", t."ownerId", t."createdAt",
                           u."email", u."name" as "userName"
                    FROM teams t
                    JOIN users u ON t."ownerId" = u."id"
                    WHERE t."tier" = 'free'
                    AND (
                        SELECT COUNT(*)
                        FROM team_members tm
                        WHERE tm."teamId" = t."id"
                    ) = 1
                    ORDER BY t."createdAt" ASC
                    LIMIT ${this.BATCH_SIZE} OFFSET ${offset}
                `;

        const teams = await queryRunner.query(teamsQuery);

        if (teams.length === 0) {
          hasMoreTeams = false;
          break;
        }

        console.log(`📦 第 ${batchCount} 批包含 ${teams.length} 个团队`);

        // 开始事务处理当前批次
        await queryRunner.startTransaction();

        try {
          const batchTeamsDeleted: string[] = [];
          const batchMembersDeleted: string[] = [];

          // 删除每个团队及其成员记录
          for (const team of teams) {
            const teamData = team as {
              id: string;
              name: string;
              ownerId: string;
              createdAt: Date;
              userName: string;
              email: string;
            };
            console.log(`  🏢 处理团队: ${teamData.name} (ID: ${teamData.id})`);
            console.log(
              `    👤 所有者: ${teamData.userName} (${teamData.email})`,
            );

            // 先删除团队成员记录
            const deleteMembersQuery = `
                            DELETE FROM team_members
                            WHERE "teamId" = $1
                            RETURNING "id"
                        `;
            const deletedMembersResult = await queryRunner.query(
              deleteMembersQuery,
              [teamData.id],
            );

            if (deletedMembersResult.length > 0) {
              deletedMembersResult.forEach((member: { id: string }) => {
                batchMembersDeleted.push(member.id);
              });
              console.log(
                `    ✅ 删除 ${deletedMembersResult.length} 个团队成员记录`,
              );
            }

            // 再删除团队记录
            const deleteTeamQuery = `
                            DELETE FROM teams
                            WHERE "id" = $1
                            RETURNING "id"
                        `;
            const deletedTeamResult = await queryRunner.query(deleteTeamQuery, [
              teamData.id,
            ]);

            if (deletedTeamResult.length > 0) {
              batchTeamsDeleted.push(teamData.id);
              console.log(`    ✅ 删除团队成功: ${teamData.name}`);
            } else {
              throw new Error(
                `删除团队失败: 团队 ${teamData.name} (ID: ${teamData.id})`,
              );
            }
          }

          // 提交当前批次事务
          await queryRunner.commitTransaction();

          // 更新计数器
          totalTeamsDeleted += batchTeamsDeleted.length;
          totalMembersDeleted += batchMembersDeleted.length;

          console.log(
            `  ✅ 第 ${batchCount} 批回滚完成: 删除 ${batchTeamsDeleted.length} 个团队, ${batchMembersDeleted.length} 个成员`,
          );

          // 更新偏移量
          offset += this.BATCH_SIZE;

          // 如果当前批次处理数量小于批次大小，说明已经是最后一批
          if (teams.length < this.BATCH_SIZE) {
            hasMoreTeams = false;
          }
        } catch (error) {
          // 回滚当前批次事务
          await queryRunner.rollbackTransaction();
          console.error(`  ❌ 第 ${batchCount} 批回滚失败:`, error);
          throw error;
        }
      }

      // 输出最终统计结果
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      console.log('\n🎉 历史数据回滚完成！');
      console.log('📊 最终统计:');
      console.log(`  • 删除团队数: ${totalTeamsDeleted}`);
      console.log(`  • 删除成员数: ${totalMembersDeleted}`);
      console.log(`  • 批次数量: ${batchCount}`);
      console.log(`  • 执行时间: ${duration}ms`);
    } catch (error) {
      console.error('❌ 回滚执行失败:', error);
      throw error;
    }
  }
}
