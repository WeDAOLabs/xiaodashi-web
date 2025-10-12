import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCaptchaSessionsTable1760237952422
  implements MigrationInterface
{
  name = 'CreateCaptchaSessionsTable1760237952422';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e7bb9f9695020551fa790a1243"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1bea11800ce8fa0bb25a0a32f6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fc8386c69567dc41e62a30c151"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_54d4fa50c599813635f911ad15"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_35a3bd6a08f0e01ab545702e08"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c1b2cbcf0dbe85cdd23a89f3a7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dd4abf537220694b92cd3963d1"`,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "captcha_sessions" IS '验证码会话表，用于管理登录验证码的生命周期和验证状态'`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."captcha_sessions_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "sliderData"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "attemptCount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "maxAttempts"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "generatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "usedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "invalidatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "deviceFingerprint"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "email"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "invalidateReason"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "country"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "difficultyLevel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "imageData"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "audioData"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "city"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "captchaData" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."captchaData" IS '验证码文本或滑动位置信息，使用bcrypt加密存储以防止泄露'`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "attempts" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."attempts" IS '验证尝试次数，用于防止暴力破解验证码'`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "isVerified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."isVerified" IS '验证码是否已验证成功，成功的验证码会被标记防止重复使用'`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "isUsed" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."isUsed" IS '验证码是否已使用，用于防止验证码重复攻击'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."id" IS '验证码会话唯一标识符，用于数据库主键'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."sessionId" IS '前端会话标识符，用于关联验证码生成和验证请求'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."captcha_sessions_captchatype_enum" RENAME TO "captcha_sessions_captchatype_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."captcha_sessions_captchatype_enum" AS ENUM('image', 'slider')`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ALTER COLUMN "captchaType" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ALTER COLUMN "captchaType" TYPE "public"."captcha_sessions_captchatype_enum" USING "captchaType"::"text"::"public"."captcha_sessions_captchatype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ALTER COLUMN "captchaType" SET DEFAULT 'image'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."captcha_sessions_captchatype_enum_old"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."captchaType" IS '验证码类型：image-图形验证码，slider-滑动验证码'`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ALTER COLUMN "expiresAt" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."expiresAt" IS '验证码过期时间，超过此时间验证码将失效'`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ALTER COLUMN "ipAddress" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."ipAddress" IS '客户端IP地址，用于安全审计和异常检测'`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ALTER COLUMN "userAgent" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."userAgent" IS '客户端User-Agent字符串，用于设备识别和风险分析'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."createdAt" IS '验证码创建时间，用于审计和分析'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."createdAt" IS '创建时间'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."userAgent" IS '用户代理信息'`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ALTER COLUMN "userAgent" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."ipAddress" IS '生成验证码的IP地址'`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ALTER COLUMN "ipAddress" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."expiresAt" IS '验证码过期时间'`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ALTER COLUMN "expiresAt" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."captchaType" IS '验证码类型：image-图片验证码，audio-音频验证码，slider-滑动验证码'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."captcha_sessions_captchatype_enum_old" AS ENUM('image', 'audio', 'slider')`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ALTER COLUMN "captchaType" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ALTER COLUMN "captchaType" TYPE "public"."captcha_sessions_captchatype_enum_old" USING "captchaType"::"text"::"public"."captcha_sessions_captchatype_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ALTER COLUMN "captchaType" SET DEFAULT 'image'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."captcha_sessions_captchatype_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."captcha_sessions_captchatype_enum_old" RENAME TO "captcha_sessions_captchatype_enum"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."sessionId" IS '会话ID，用于客户端识别'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."id" IS '验证码会话唯一标识符'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."isUsed" IS '验证码是否已使用，用于防止验证码重复攻击'`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "isUsed"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."isVerified" IS '验证码是否已验证成功，成功的验证码会被标记防止重复使用'`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "isVerified"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."attempts" IS '验证尝试次数，用于防止暴力破解验证码'`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "attempts"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "captcha_sessions"."captchaData" IS '验证码文本或滑动位置信息，使用bcrypt加密存储以防止泄露'`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" DROP COLUMN "captchaData"`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "city" character varying(45)`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "audioData" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "imageData" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "difficultyLevel" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "country" character varying(45)`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "invalidateReason" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "code" character varying(10) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "email" character varying(45)`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "userId" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "deviceFingerprint" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "invalidatedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "usedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "generatedAt" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "maxAttempts" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "attemptCount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "sliderData" jsonb`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."captcha_sessions_status_enum" AS ENUM('active', 'used', 'expired')`,
    );
    await queryRunner.query(
      `ALTER TABLE "captcha_sessions" ADD "status" "public"."captcha_sessions_status_enum" NOT NULL DEFAULT 'active'`,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "captcha_sessions" IS '验证码会话表，管理验证码生成和验证'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dd4abf537220694b92cd3963d1" ON "captcha_sessions" ("sessionId", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c1b2cbcf0dbe85cdd23a89f3a7" ON "captcha_sessions" ("generatedAt", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_35a3bd6a08f0e01ab545702e08" ON "captcha_sessions" ("generatedAt", "ipAddress") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_54d4fa50c599813635f911ad15" ON "captcha_sessions" ("generatedAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fc8386c69567dc41e62a30c151" ON "captcha_sessions" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1bea11800ce8fa0bb25a0a32f6" ON "captcha_sessions" ("ipAddress") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e7bb9f9695020551fa790a1243" ON "captcha_sessions" ("status") `,
    );
  }
}
