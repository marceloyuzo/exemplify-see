/*
  Warnings:

  - A unique constraint covering the columns `[user_id,lesson_plan_id]` on the table `ratings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `modality` to the `lesson_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workload` to the `lesson_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `lesson_plans` table without a default value. This is not possible if the table is not empty.
  - Made the column `subject_id` on table `lesson_plans` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `lesson_plan_id` to the `ratings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ModatilyType" AS ENUM ('inPerson', 'hybrid', 'remote');

-- AlterEnum
ALTER TYPE "public"."ExampleType" ADD VALUE 'both';

-- DropForeignKey
ALTER TABLE "public"."lesson_plans" DROP CONSTRAINT "lesson_plans_subject_id_fkey";

-- AlterTable
ALTER TABLE "public"."lesson_plans" ADD COLUMN     "contents" TEXT[],
ADD COLUMN     "materials" TEXT[],
ADD COLUMN     "modality" "public"."ModatilyType" NOT NULL,
ADD COLUMN     "prior_knowledge" TEXT,
ADD COLUMN     "workload" TEXT NOT NULL,
ADD COLUMN     "year" TEXT NOT NULL,
ALTER COLUMN "subject_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."ratings" ADD COLUMN     "lesson_plan_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ratings_user_id_lesson_plan_id_key" ON "public"."ratings"("user_id", "lesson_plan_id");

-- AddForeignKey
ALTER TABLE "public"."lesson_plans" ADD CONSTRAINT "lesson_plans_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ratings" ADD CONSTRAINT "ratings_lesson_plan_id_fkey" FOREIGN KEY ("lesson_plan_id") REFERENCES "public"."lesson_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
