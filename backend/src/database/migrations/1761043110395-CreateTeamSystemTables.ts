import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTeamSystemTables1761043110395 implements MigrationInterface {
  name = 'CreateTeamSystemTables1761043110395';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."team_members_role_enum" AS ENUM('owner', 'admin', 'member')`,
    );
    await queryRunner.query(
      `CREATE TABLE "team_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teamId" uuid NOT NULL, "userId" uuid NOT NULL, "role" "public"."team_members_role_enum" NOT NULL DEFAULT 'member', "displayName" character varying(100) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_b2f17b533905e0a94390c5e2208" UNIQUE ("teamId", "userId"), CONSTRAINT "PK_ca3eae89dcf20c9fd95bf7460aa" PRIMARY KEY ("id")); COMMENT ON COLUMN "team_members"."id" IS '团队成员关系唯一标识符'; COMMENT ON COLUMN "team_members"."teamId" IS '团队ID，关联到团队表'; COMMENT ON COLUMN "team_members"."userId" IS '用户ID，关联到用户表'; COMMENT ON COLUMN "team_members"."role" IS '成员角色：owner-团队所有者，admin-管理员，member-普通成员，默认普通成员'; COMMENT ON COLUMN "team_members"."displayName" IS '成员在团队中的显示名称，最大100个字符'; COMMENT ON COLUMN "team_members"."createdAt" IS '成员加入团队的时间'; COMMENT ON COLUMN "team_members"."updatedAt" IS '成员信息更新时间'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6d1c8c7f705803f0711336a5c3" ON "team_members" ("teamId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0a72b849753a046462b4c5a8ec" ON "team_members" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5171a2f3a4aa87d63ae6bd1ca0" ON "team_members" ("role") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_33692aeb17710f5c6c8d58ee73" ON "team_members" ("createdAt") `,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "team_members" IS '团队成员关系表，作为用户表和团队表的多对多关系链接表，支持一个用户属于多个团队'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."team_invitations_status_enum" AS ENUM('pending', 'accepted', 'expired', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "team_invitations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teamId" uuid NOT NULL, "inviterId" uuid NOT NULL, "email" character varying(320) NOT NULL, "token" character varying(1024) NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."team_invitations_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_760191b7c119337743fb95b471b" UNIQUE ("token"), CONSTRAINT "UQ_760191b7c119337743fb95b471b" UNIQUE ("token"), CONSTRAINT "PK_c14b443d431077f89344a3fd262" PRIMARY KEY ("id")); COMMENT ON COLUMN "team_invitations"."id" IS '邀请记录唯一标识符'; COMMENT ON COLUMN "team_invitations"."teamId" IS '团队ID，关联到团队表'; COMMENT ON COLUMN "team_invitations"."inviterId" IS '邀请者用户ID，关联到用户表'; COMMENT ON COLUMN "team_invitations"."email" IS '被邀请者邮箱地址，作为登录用户名'; COMMENT ON COLUMN "team_invitations"."token" IS '邀请令牌，用于验证邀请链接的有效性，长度1024字符，唯一索引'; COMMENT ON COLUMN "team_invitations"."expiresAt" IS '邀请过期时间，过期后邀请自动失效'; COMMENT ON COLUMN "team_invitations"."status" IS '邀请状态：pending-待处理，accepted-已接受，expired-已过期，cancelled-已取消，默认待处理'; COMMENT ON COLUMN "team_invitations"."createdAt" IS '邀请创建时间'; COMMENT ON COLUMN "team_invitations"."updatedAt" IS '邀请状态更新时间'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_51467b016e4b6bc51f2d2f080a" ON "team_invitations" ("teamId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_37ab0591f414697320ed921915" ON "team_invitations" ("inviterId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5770b0bcbfb2c879088aea1f91" ON "team_invitations" ("email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_760191b7c119337743fb95b471" ON "team_invitations" ("token") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2ba4e4d7c61533540da334cdb1" ON "team_invitations" ("expiresAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8e22bf9e590df393d366be2277" ON "team_invitations" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_86488cf3179d9b0492b4ec2181" ON "team_invitations" ("createdAt") `,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "team_invitations" IS '团队邀请记录表，管理团队成员邀请流程'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."teams_tier_enum" AS ENUM('free', 'pro', 'plus', 'ultra')`,
    );
    await queryRunner.query(
      `CREATE TABLE "teams" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "ownerId" uuid NOT NULL, "tier" "public"."teams_tier_enum" NOT NULL DEFAULT 'free', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id")); COMMENT ON COLUMN "teams"."id" IS '团队唯一标识符'; COMMENT ON COLUMN "teams"."name" IS '团队名称，最大100个字符'; COMMENT ON COLUMN "teams"."ownerId" IS '团队所有者用户ID，关联到用户表'; COMMENT ON COLUMN "teams"."tier" IS '团队等级：free-免费版，pro-专业版，plus-增强版，ultra-旗舰版，默认免费版'; COMMENT ON COLUMN "teams"."createdAt" IS '团队创建时间'; COMMENT ON COLUMN "teams"."updatedAt" IS '团队信息更新时间'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b5ebe13256317503931ecabb55" ON "teams" ("ownerId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0bad1e2d1d5a402f83ef39cbdc" ON "teams" ("tier") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a9ff9afa3a94c4032985300b9f" ON "teams" ("createdAt") `,
    );
    await queryRunner.query(`COMMENT ON TABLE "teams" IS '团队基础信息表'`);
    await queryRunner.query(
      `CREATE TABLE "team_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "permissions" jsonb NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_d7f3996c5e3566750bce2d5f1d7" UNIQUE ("name"), CONSTRAINT "PK_4d682873a391d93b0e5fe2f082f" PRIMARY KEY ("id")); COMMENT ON COLUMN "team_roles"."id" IS '角色唯一标识符'; COMMENT ON COLUMN "team_roles"."name" IS '角色名称，最大50个字符，唯一索引'; COMMENT ON COLUMN "team_roles"."permissions" IS '权限配置，JSONB格式存储各种权限键值对，如 {"canInvite": true, "canManageMembers": false}'; COMMENT ON COLUMN "team_roles"."createdAt" IS '角色创建时间'; COMMENT ON COLUMN "team_roles"."updatedAt" IS '角色权限更新时间'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d7f3996c5e3566750bce2d5f1d" ON "team_roles" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ad84539fbaf22a4948290aa7b3" ON "team_roles" ("createdAt") `,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "team_roles" IS '团队角色定义表，为未来复杂权限系统预留扩展'`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD CONSTRAINT "FK_6d1c8c7f705803f0711336a5c33" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD CONSTRAINT "FK_0a72b849753a046462b4c5a8ec2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_invitations" ADD CONSTRAINT "FK_51467b016e4b6bc51f2d2f080a8" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_invitations" ADD CONSTRAINT "FK_37ab0591f414697320ed921915c" FOREIGN KEY ("inviterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_invitations" DROP CONSTRAINT "FK_37ab0591f414697320ed921915c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_invitations" DROP CONSTRAINT "FK_51467b016e4b6bc51f2d2f080a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP CONSTRAINT "FK_0a72b849753a046462b4c5a8ec2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP CONSTRAINT "FK_6d1c8c7f705803f0711336a5c33"`,
    );
    await queryRunner.query(`COMMENT ON TABLE "team_roles" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ad84539fbaf22a4948290aa7b3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d7f3996c5e3566750bce2d5f1d"`,
    );
    await queryRunner.query(`DROP TABLE "team_roles"`);
    await queryRunner.query(`COMMENT ON TABLE "teams" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a9ff9afa3a94c4032985300b9f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0bad1e2d1d5a402f83ef39cbdc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b5ebe13256317503931ecabb55"`,
    );
    await queryRunner.query(`DROP TABLE "teams"`);
    await queryRunner.query(`DROP TYPE "public"."teams_tier_enum"`);
    await queryRunner.query(`COMMENT ON TABLE "team_invitations" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_86488cf3179d9b0492b4ec2181"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8e22bf9e590df393d366be2277"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2ba4e4d7c61533540da334cdb1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_760191b7c119337743fb95b471"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5770b0bcbfb2c879088aea1f91"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_37ab0591f414697320ed921915"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_51467b016e4b6bc51f2d2f080a"`,
    );
    await queryRunner.query(`DROP TABLE "team_invitations"`);
    await queryRunner.query(
      `DROP TYPE "public"."team_invitations_status_enum"`,
    );
    await queryRunner.query(`COMMENT ON TABLE "team_members" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_33692aeb17710f5c6c8d58ee73"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5171a2f3a4aa87d63ae6bd1ca0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0a72b849753a046462b4c5a8ec"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6d1c8c7f705803f0711336a5c3"`,
    );
    await queryRunner.query(`DROP TABLE "team_members"`);
    await queryRunner.query(`DROP TYPE "public"."team_members_role_enum"`);
  }
}
