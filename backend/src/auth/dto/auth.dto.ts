import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsBoolean,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';
import { Match } from '../validators/match.validator';

/**
 * 验证码信息DTO
 */
export class CaptchaDto {
  @ApiProperty({
    description: '会话ID',
    example: 'captcha_1k2j3h4g5f6d7s8a9b0c',
  })
  @IsString({ message: '会话ID必须是字符串' })
  @Matches(/^captcha_[a-z0-9]+_[a-z0-9]+$/, { message: '会话ID格式不正确' })
  sessionId!: string;

  @ApiProperty({
    description: '验证码内容',
    example: '1234',
  })
  @IsString({ message: '验证码必须是字符串' })
  code!: string;
}

/**
 * 登录请求DTO
 */
export class LoginDto {
  @ApiProperty({
    description: '用户邮箱',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email!: string;

  @ApiProperty({
    description: '密码',
    example: 'password123',
  })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(8, { message: '密码至少8个字符' })
  password!: string;

  @ApiProperty({
    description: '是否记住登录状态',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: '记住登录状态必须是布尔值' })
  rememberMe?: boolean;

  @ApiProperty({
    description: '验证码信息',
    required: false,
    example: {
      sessionId: 'captcha_1k2j3h4g5f6d7s8a9b0c',
      code: '1234',
    },
  })
  @IsOptional()
  captcha?: CaptchaDto;
}

/**
 * 注册请求DTO
 */
export class RegisterDto {
  @ApiProperty({
    description: '用户邮箱',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email!: string;

  @ApiProperty({
    description: '用户姓名',
    example: '张三',
  })
  @IsString({ message: '用户姓名必须是字符串' })
  @MinLength(2, { message: '用户姓名至少2个字符' })
  @MaxLength(50, { message: '用户姓名最多50个字符' })
  name!: string;

  @ApiProperty({
    description: '密码（至少8位，包含字母和数字）',
    example: 'password123',
  })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(8, { message: '密码至少8个字符' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, {
    message: '密码必须包含字母和数字',
  })
  password!: string;

  @ApiProperty({
    description: '确认密码',
    example: 'password123',
  })
  @IsString({ message: '确认密码必须是字符串' })
  @Match('password', { message: '确认密码必须与密码一致' })
  confirmPassword!: string;

  @ApiProperty({
    description: '是否同意服务条款',
    example: true,
  })
  @IsBoolean({ message: '同意服务条款必须是布尔值' })
  agreeToTerms!: boolean;

  @ApiProperty({
    description: '邀请码',
    example: 'INVITE123',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '邀请码必须是字符串' })
  inviteCode?: string;

  @ApiProperty({
    description: '验证码信息',
    required: false,
    example: {
      sessionId: 'captcha_1k2j3h4g5f6d7s8a9b0c',
      code: '1234',
    },
  })
  @IsOptional()
  captcha?: CaptchaDto;
}

/**
 * 刷新令牌请求DTO
 */
export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString({ message: 'Refresh token必须是字符串' })
  refreshToken!: string;
}

/**
 * 忘记密码请求DTO
 */
export class ForgotPasswordDto {
  @ApiProperty({
    description: '用户邮箱',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email!: string;

  @ApiProperty({
    description: '验证码信息',
    required: false,
    example: {
      sessionId: 'captcha_1k2j3h4g5f6d7s8a9b0c',
      code: '1234',
    },
  })
  @IsOptional()
  captcha?: CaptchaDto;
}

/**
 * 重置密码请求DTO
 */
export class ResetPasswordDto {
  @ApiProperty({
    description: '密码重置令牌',
    example: 'reset_token_here',
  })
  @IsString({ message: '重置令牌必须是字符串' })
  resetToken!: string;

  @ApiProperty({
    description: '新密码（至少8位，包含字母和数字）',
    example: 'newpassword123',
  })
  @IsString({ message: '新密码必须是字符串' })
  @MinLength(8, { message: '密码至少8个字符' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, {
    message: '密码必须包含字母和数字',
  })
  newPassword!: string;

  @ApiProperty({
    description: '确认新密码',
    example: 'newpassword123',
  })
  @IsString({ message: '确认密码必须是字符串' })
  @Match('newPassword', { message: '确认新密码必须与新密码一致' })
  confirmPassword!: string;
}

/**
 * 修改密码请求DTO
 */
export class ChangePasswordDto {
  @ApiProperty({
    description: '当前密码',
    example: 'oldpassword123',
  })
  @IsString({ message: '当前密码必须是字符串' })
  currentPassword!: string;

  @ApiProperty({
    description: '新密码（至少8位，包含字母和数字）',
    example: 'newpassword123',
  })
  @IsString({ message: '新密码必须是字符串' })
  @MinLength(8, { message: '密码至少8个字符' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, {
    message: '密码必须包含字母和数字',
  })
  newPassword!: string;

  @ApiProperty({
    description: '确认新密码',
    example: 'newpassword123',
  })
  @IsString({ message: '确认密码必须是字符串' })
  @Match('newPassword', { message: '确认新密码必须与新密码一致' })
  confirmPassword!: string;
}

/**
 * 邮箱验证请求DTO
 */
export class VerifyEmailDto {
  @ApiProperty({
    description: '邮箱验证令牌',
    example: 'verification_token_here',
  })
  @IsString({ message: '验证令牌必须是字符串' })
  verificationToken!: string;
}

/**
 * 登出请求DTO
 */
export class LogoutDto {
  @ApiProperty({
    description: 'Refresh Token（可选，用于撤销刷新令牌）',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Refresh token必须是字符串' })
  refreshToken?: string;

  @ApiProperty({
    description: '是否登出所有设备',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: '登出所有设备必须是布尔值' })
  allDevices?: boolean;
}
