/*
  Warnings:

  - You are about to drop the column `subject` on the `lesson_plans` table. All the data in the column will be lost.
  - You are about to drop the column `topic` on the `lesson_plans` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Complexity" AS ENUM ('beginner', 'intermediate');

-- CreateEnum
CREATE TYPE "public"."Example" AS ENUM ('correct', 'erroneous');

-- AlterTable
ALTER TABLE "public"."lesson_plans" DROP COLUMN "subject",
DROP COLUMN "topic",
ADD COLUMN     "complexity" "public"."Complexity",
ADD COLUMN     "example" "public"."Example",
ADD COLUMN     "subject_id" TEXT,
ADD COLUMN     "topic_id" TEXT;

-- CreateTable
CREATE TABLE "public"."subjects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."topics" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."lesson_plans" ADD CONSTRAINT "lesson_plans_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson_plans" ADD CONSTRAINT "lesson_plans_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
