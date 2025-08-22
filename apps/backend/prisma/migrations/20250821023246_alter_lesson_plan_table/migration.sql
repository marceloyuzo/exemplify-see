-- AlterTable
ALTER TABLE "public"."lesson_plans" ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "subject" TEXT,
ADD COLUMN     "topic" TEXT;
