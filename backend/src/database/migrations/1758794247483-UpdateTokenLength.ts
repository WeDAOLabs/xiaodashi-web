import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTokenLength1758794247483 implements MigrationInterface {
  name = 'UpdateTokenLength1758794247483';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7ad75a333a7bcf6a2b5d3517ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "emailVerificationToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "emailVerificationToken" character varying(1024)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."emailVerificationToken" IS '邮箱验证令牌'`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bffe933a388d6bde48891ff95a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "passwordResetToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "passwordResetToken" character varying(1024)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."passwordResetToken" IS '密码重置令牌'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7ad75a333a7bcf6a2b5d3517ca" ON "users" ("emailVerificationToken") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bffe933a388d6bde48891ff95a" ON "users" ("passwordResetToken") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bffe933a388d6bde48891ff95a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7ad75a333a7bcf6a2b5d3517ca"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."passwordResetToken" IS '密码重置令牌'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "passwordResetToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "passwordResetToken" character varying(255)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bffe933a388d6bde48891ff95a" ON "users" ("passwordResetToken") `,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."emailVerificationToken" IS '邮箱验证令牌'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "emailVerificationToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "emailVerificationToken" character varying(255)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7ad75a333a7bcf6a2b5d3517ca" ON "users" ("emailVerificationToken") `,
    );
  }
}
