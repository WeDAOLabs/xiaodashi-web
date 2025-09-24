import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1758700277932 implements MigrationInterface {
    name = 'InitialSchema1758700277932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "refreshTokenHash" character varying(255) NOT NULL, "deviceId" character varying(100), "deviceName" character varying(100), "deviceType" character varying(20), "ipAddress" inet, "userAgent" text, "location" character varying(100), "isActive" boolean NOT NULL DEFAULT true, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastActiveAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "CHK_13b1c9fea2562acc4db7a080ad" CHECK ("expiresAt" > "createdAt"), CONSTRAINT "PK_e93e031a5fed190d4789b6bfd83" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_55fa4db8406ed66bc704432842" ON "user_sessions" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ed9d6042a764c80befeeacc595" ON "user_sessions" ("refreshTokenHash") `);
        await queryRunner.query(`CREATE INDEX "IDX_10c813f98c21cd7b6a5e59f757" ON "user_sessions" ("deviceId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2904024eefc78b5832daff179b" ON "user_sessions" ("ipAddress") `);
        await queryRunner.query(`CREATE INDEX "IDX_8da92f9b10e513921836cab2ce" ON "user_sessions" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_a5f2c875043dcf84df7b73ed73" ON "user_sessions" ("expiresAt") `);
        await queryRunner.query(`CREATE TABLE "user_login_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "email" character varying(320) NOT NULL, "ipAddress" inet, "userAgent" text, "location" character varying(100), "success" boolean NOT NULL, "failureReason" character varying(100), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bcad8136a91a5fdba07ea1284f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5178ad2692da19409114900270" ON "user_login_logs" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_657f75c65a23bfc752b69df10b" ON "user_login_logs" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_8b586014863f7d7d2d1af215a0" ON "user_login_logs" ("ipAddress") `);
        await queryRunner.query(`CREATE INDEX "IDX_5fb50882e8ac0cd140b71bbfa8" ON "user_login_logs" ("success") `);
        await queryRunner.query(`CREATE INDEX "IDX_d484976a9516925744d741d237" ON "user_login_logs" ("createdAt") `);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'premium', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive', 'suspended')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(320) NOT NULL, "name" character varying(100) NOT NULL, "passwordHash" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "status" "public"."users_status_enum" NOT NULL DEFAULT 'active', "avatar" text, "emailVerified" boolean NOT NULL DEFAULT false, "emailVerificationToken" character varying(255), "emailVerificationExpiresAt" TIMESTAMP WITH TIME ZONE, "passwordResetToken" character varying(255), "passwordResetExpiresAt" TIMESTAMP WITH TIME ZONE, "lastLoginAt" TIMESTAMP WITH TIME ZONE, "loginAttempts" integer NOT NULL DEFAULT '0', "lockedUntil" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_ace513fa30d485cfd25c11a9e4" ON "users" ("role") `);
        await queryRunner.query(`CREATE INDEX "IDX_3676155292d72c67cd4e090514" ON "users" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_7ad75a333a7bcf6a2b5d3517ca" ON "users" ("emailVerificationToken") `);
        await queryRunner.query(`CREATE INDEX "IDX_bffe933a388d6bde48891ff95a" ON "users" ("passwordResetToken") `);
        await queryRunner.query(`CREATE INDEX "IDX_c0f30dcc205fa03b0d77e95118" ON "users" ("lastLoginAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_204e9b624861ff4a5b26819210" ON "users" ("createdAt") `);
        await queryRunner.query(`CREATE TABLE "user_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "phone" character varying(20), "company" character varying(100), "position" character varying(100), "bio" text, "location" character varying(100), "website" text, "preferences" jsonb NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_8481388d6325e752cd4d7e26c6" UNIQUE ("userId"), CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8481388d6325e752cd4d7e26c6" ON "user_profiles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_464d6ab6f131b990d6cf139488" ON "user_profiles" ("company") `);
        await queryRunner.query(`CREATE TYPE "public"."permissions_action_enum" AS ENUM('create', 'read', 'update', 'delete', 'manage')`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "resource" character varying(50) NOT NULL, "action" "public"."permissions_action_enum" NOT NULL, "description" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_48ce552495d14eae9b187bb671" ON "permissions" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_89456a09b598ce8915c702c528" ON "permissions" ("resource") `);
        await queryRunner.query(`CREATE INDEX "IDX_1c1e0637ecf1f6401beb9a68ab" ON "permissions" ("action") `);
        await queryRunner.query(`CREATE TYPE "public"."role_permissions_role_enum" AS ENUM('user', 'premium', 'admin')`);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."role_permissions_role_enum" NOT NULL, "permissionId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_960cb22301f2d35aac0448d6683" UNIQUE ("role", "permissionId"), CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5d5086bd299f773d403574cf1c" ON "role_permissions" ("role") `);
        await queryRunner.query(`CREATE INDEX "IDX_06792d0c62ce6b0203c03643cd" ON "role_permissions" ("permissionId") `);
        await queryRunner.query(`ALTER TABLE "user_sessions" ADD CONSTRAINT "FK_55fa4db8406ed66bc7044328427" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_login_logs" ADD CONSTRAINT "FK_5178ad2692da194091149002702" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_8481388d6325e752cd4d7e26c6d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_8481388d6325e752cd4d7e26c6d"`);
        await queryRunner.query(`ALTER TABLE "user_login_logs" DROP CONSTRAINT "FK_5178ad2692da194091149002702"`);
        await queryRunner.query(`ALTER TABLE "user_sessions" DROP CONSTRAINT "FK_55fa4db8406ed66bc7044328427"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_06792d0c62ce6b0203c03643cd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5d5086bd299f773d403574cf1c"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TYPE "public"."role_permissions_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1c1e0637ecf1f6401beb9a68ab"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_89456a09b598ce8915c702c528"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48ce552495d14eae9b187bb671"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TYPE "public"."permissions_action_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_464d6ab6f131b990d6cf139488"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8481388d6325e752cd4d7e26c6"`);
        await queryRunner.query(`DROP TABLE "user_profiles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_204e9b624861ff4a5b26819210"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c0f30dcc205fa03b0d77e95118"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bffe933a388d6bde48891ff95a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7ad75a333a7bcf6a2b5d3517ca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3676155292d72c67cd4e090514"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ace513fa30d485cfd25c11a9e4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d484976a9516925744d741d237"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5fb50882e8ac0cd140b71bbfa8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8b586014863f7d7d2d1af215a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_657f75c65a23bfc752b69df10b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5178ad2692da19409114900270"`);
        await queryRunner.query(`DROP TABLE "user_login_logs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a5f2c875043dcf84df7b73ed73"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8da92f9b10e513921836cab2ce"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2904024eefc78b5832daff179b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_10c813f98c21cd7b6a5e59f757"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ed9d6042a764c80befeeacc595"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_55fa4db8406ed66bc704432842"`);
        await queryRunner.query(`DROP TABLE "user_sessions"`);
    }

}
