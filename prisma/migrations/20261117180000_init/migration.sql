-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "CharacterClass" AS ENUM ('WARRIOR', 'PALADIN', 'HUNTER', 'ROGUE', 'PRIEST', 'SHAMAN', 'MAGE', 'WARLOCK', 'DRUID');

-- CreateEnum
CREATE TYPE "Faction" AS ENUM ('HORDE', 'ALLIANCE');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('LEVELING', 'DUNGEONS', 'QUESTS', 'WORLD_PVP', 'BATTLEGROUNDS', 'DUELS', 'RAIDS', 'OTHER');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('LOOKING', 'FULL', 'FINISHED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('NOW', 'AFTERNOON', 'NIGHT', 'FLEXIBLE');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REVIEWED', 'DISMISSED');

-- CreateTable
CREATE TABLE "GroupPost" (
    "id" UUID NOT NULL,
    "characterName" VARCHAR(24) NOT NULL,
    "level" INTEGER NOT NULL,
    "characterClass" "CharacterClass" NOT NULL,
    "faction" "Faction" NOT NULL,
    "activity" "ActivityType" NOT NULL,
    "zone" VARCHAR(80) NOT NULL,
    "recommendedLevel" INTEGER NOT NULL,
    "schedule" VARCHAR(100) NOT NULL,
    "availability" "Availability" NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "playersNeeded" INTEGER NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'LOOKING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "managerTokenHash" CHAR(64) NOT NULL,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GroupPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostReport" (
    "id" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "reason" VARCHAR(500) NOT NULL,
    "reporterHash" CHAR(64) NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimitBucket" (
    "key" VARCHAR(100) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "resetAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "GroupPost_status_expiresAt_createdAt_idx" ON "GroupPost"("status", "expiresAt", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "GroupPost_activity_status_idx" ON "GroupPost"("activity", "status");

-- CreateIndex
CREATE INDEX "GroupPost_faction_characterClass_level_idx" ON "GroupPost"("faction", "characterClass", "level");

-- CreateIndex
CREATE INDEX "GroupPost_availability_idx" ON "GroupPost"("availability");

-- CreateIndex
CREATE INDEX "GroupPost_createdAt_idx" ON "GroupPost"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "PostReport_status_createdAt_idx" ON "PostReport"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PostReport_postId_reporterHash_key" ON "PostReport"("postId", "reporterHash");

-- CreateIndex
CREATE INDEX "RateLimitBucket_resetAt_idx" ON "RateLimitBucket"("resetAt");

-- AddForeignKey
ALTER TABLE "PostReport" ADD CONSTRAINT "PostReport_postId_fkey" FOREIGN KEY ("postId") REFERENCES "GroupPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
