-- DropForeignKey
ALTER TABLE "public"."ratings" DROP CONSTRAINT "ratings_example_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ratings" DROP CONSTRAINT "ratings_lesson_plan_id_fkey";

-- AlterTable
ALTER TABLE "public"."ratings" ALTER COLUMN "example_id" DROP NOT NULL,
ALTER COLUMN "lesson_plan_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."ratings" ADD CONSTRAINT "ratings_example_id_fkey" FOREIGN KEY ("example_id") REFERENCES "public"."examples"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ratings" ADD CONSTRAINT "ratings_lesson_plan_id_fkey" FOREIGN KEY ("lesson_plan_id") REFERENCES "public"."lesson_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
