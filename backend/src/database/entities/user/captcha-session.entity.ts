import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * 验证码会话实体
 *
 * 用于管理登录验证码的生命周期和验证状态，包括图形验证码和滑动验证码。
 * 验证码数据使用bcrypt加密存储，确保安全性。
 */
@Entity('captcha_sessions', {
  comment: '验证码会话表，用于管理登录验证码的生命周期和验证状态',
})
export class CaptchaSession {
  /**
   * 验证码会话唯一标识符，用于数据库主键
   */
  @PrimaryGeneratedColumn('uuid', {
    comment: '验证码会话唯一标识符，用于数据库主键',
  })
  id: string;

  /**
   * 前端会话标识符，用于关联验证码生成和验证请求
   */
  @Column({
    type: 'varchar',
    length: 64,
    unique: true,
    comment: '前端会话标识符，用于关联验证码生成和验证请求',
  })
  @Index() // 添加索引优化查询性能
  sessionId: string;

  /**
   * 验证码文本或滑动位置信息，使用bcrypt加密存储以防止泄露
   */
  @Column({
    type: 'varchar',
    length: 255,
    comment: '验证码文本或滑动位置信息，使用bcrypt加密存储以防止泄露',
  })
  captchaData: string; // 加密存储的验证码数据

  /**
   * 验证码类型：image-图形验证码，slider-滑动验证码
   */
  @Column({
    type: 'enum',
    enum: ['image', 'slider'],
    default: 'image',
    comment: '验证码类型：image-图形验证码，slider-滑动验证码',
  })
  captchaType: 'image' | 'slider';

  /**
   * 验证码过期时间，超过此时间验证码将失效
   */
  @Column({
    type: 'timestamptz',
    comment: '验证码过期时间，超过此时间验证码将失效',
  })
  @Index() // 添加索引用于定时清理过期数据
  expiresAt: Date;

  /**
   * 客户端IP地址，用于安全审计和异常检测
   */
  @Column({
    type: 'varchar',
    length: 45,
    nullable: true,
    comment: '客户端IP地址，用于安全审计和异常检测',
  })
  ipAddress?: string;

  /**
   * 客户端User-Agent字符串，用于设备识别和风险分析
   */
  @Column({
    type: 'text',
    nullable: true,
    comment: '客户端User-Agent字符串，用于设备识别和风险分析',
  })
  userAgent?: string;

  /**
   * 验证尝试次数，用于防止暴力破解验证码
   */
  @Column({
    type: 'int',
    default: 0,
    comment: '验证尝试次数，用于防止暴力破解验证码',
  })
  attempts: number;

  /**
   * 验证码是否已验证成功，成功的验证码会被标记防止重复使用
   */
  @Column({
    type: 'boolean',
    default: false,
    comment: '验证码是否已验证成功，成功的验证码会被标记防止重复使用',
  })
  isVerified: boolean;

  /**
   * 验证码是否已使用，用于防止验证码重复攻击
   */
  @Column({
    type: 'boolean',
    default: false,
    comment: '验证码是否已使用，用于防止验证码重复攻击',
  })
  isUsed: boolean;

  /**
   * 验证码创建时间，用于审计和分析
   */
  @CreateDateColumn({
    type: 'timestamptz',
    comment: '验证码创建时间，用于审计和分析',
  })
  createdAt: Date;
}
