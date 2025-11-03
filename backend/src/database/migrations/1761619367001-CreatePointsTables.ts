import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePointsTables1761619367001 implements MigrationInterface {
  name = 'CreatePointsTables1761619367001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "team_points" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teamId" uuid NOT NULL, "balance" numeric(19,4) NOT NULL DEFAULT '0', "status" character varying(20) NOT NULL DEFAULT 'active', "expiresAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_6231cd375bb483e4f71e2a141d9" PRIMARY KEY ("id")); COMMENT ON COLUMN "team_points"."id" IS '团队积分记录唯一标识符'; COMMENT ON COLUMN "team_points"."teamId" IS '团队ID，关联到团队表'; COMMENT ON COLUMN "team_points"."balance" IS '当前积分余额，支持4位小数精度，范围-999999999999.9999到999999999999.9999'; COMMENT ON COLUMN "team_points"."status" IS '积分状态：active-激活状态，frozen-冻结状态，expired-过期状态，默认激活状态'; COMMENT ON COLUMN "team_points"."expiresAt" IS '积分过期时间，为空表示永不过期'; COMMENT ON COLUMN "team_points"."createdAt" IS '积分记录创建时间'; COMMENT ON COLUMN "team_points"."updatedAt" IS '积分记录更新时间'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9293c109fd1473a8345537c918" ON "team_points" ("teamId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9e6f26b41912f6a8c745f6f037" ON "team_points" ("balance") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d23cb5bc0834f970e41a025d7d" ON "team_points" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b510051cf0a06ec6adb436edb1" ON "team_points" ("expiresAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_22be5d371a7309d83430cc5f34" ON "team_points" ("createdAt") `,
    );
    await queryRunner.query(`COMMENT ON TABLE "team_points" IS '团队积分表'`);
    await queryRunner.query(
      `CREATE TABLE "point_transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teamId" uuid NOT NULL, "userId" uuid NOT NULL, "type" character varying(50) NOT NULL, "amount" numeric(19,4) NOT NULL, "balanceAfter" numeric(19,4) NOT NULL, "description" text NOT NULL, "businessId" uuid, "businessType" character varying(50), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ceb5185b63f070e23d65509b0a7" PRIMARY KEY ("id")); COMMENT ON COLUMN "point_transactions"."id" IS '积分交易记录唯一标识符'; COMMENT ON COLUMN "point_transactions"."teamId" IS '团队ID，关联到团队表'; COMMENT ON COLUMN "point_transactions"."userId" IS '操作用户ID，关联到用户表'; COMMENT ON COLUMN "point_transactions"."type" IS '交易类型：consumption-积分消耗，recharge-积分充值，initial_grant-初始积分发放，adjustment-积分调整'; COMMENT ON COLUMN "point_transactions"."amount" IS '交易积分数量，正数为充值，负数为消耗，支持4位小数精度'; COMMENT ON COLUMN "point_transactions"."balanceAfter" IS '交易后积分余额，支持4位小数精度'; COMMENT ON COLUMN "point_transactions"."description" IS '交易描述和备注信息，详细说明交易原因和背景'; COMMENT ON COLUMN "point_transactions"."businessId" IS '关联业务ID，如订单ID、任务ID等外部系统标识符'; COMMENT ON COLUMN "point_transactions"."businessType" IS '业务类型，如payment、recharge、task_completion等'; COMMENT ON COLUMN "point_transactions"."createdAt" IS '交易发生时间，自动记录交易的时间戳'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0b5b27077b4dc2565154b9b1d3" ON "point_transactions" ("teamId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_557e0c8c5a7a1a449723de7682" ON "point_transactions" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d05a7bc4069bf74495a9ff262b" ON "point_transactions" ("type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3635a20ce11396e5f94341f282" ON "point_transactions" ("businessId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f4469102f01e9ebedf1cfde3a4" ON "point_transactions" ("businessType") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a64e7f36517eb2fd30404180f7" ON "point_transactions" ("createdAt") `,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "point_transactions" IS '积分交易记录表'`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_points" ADD CONSTRAINT "FK_9293c109fd1473a8345537c918a" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "point_transactions" ADD CONSTRAINT "FK_0b5b27077b4dc2565154b9b1d3d" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "point_transactions" DROP CONSTRAINT "FK_0b5b27077b4dc2565154b9b1d3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_points" DROP CONSTRAINT "FK_9293c109fd1473a8345537c918a"`,
    );
    await queryRunner.query(`COMMENT ON TABLE "point_transactions" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a64e7f36517eb2fd30404180f7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f4469102f01e9ebedf1cfde3a4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3635a20ce11396e5f94341f282"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d05a7bc4069bf74495a9ff262b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_557e0c8c5a7a1a449723de7682"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0b5b27077b4dc2565154b9b1d3"`,
    );
    await queryRunner.query(`DROP TABLE "point_transactions"`);
    await queryRunner.query(`COMMENT ON TABLE "team_points" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_22be5d371a7309d83430cc5f34"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b510051cf0a06ec6adb436edb1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d23cb5bc0834f970e41a025d7d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9e6f26b41912f6a8c745f6f037"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9293c109fd1473a8345537c918"`,
    );
    await queryRunner.query(`DROP TABLE "team_points"`);
  }
}
