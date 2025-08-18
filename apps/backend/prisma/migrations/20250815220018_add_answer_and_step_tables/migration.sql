/*
  Warnings:

  - You are about to drop the column `option_value` on the `transitions` table. All the data in the column will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[from_question_id,answer_id]` on the table `transitions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `answer_id` to the `transitions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_axis_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."transitions" DROP CONSTRAINT "transitions_from_question_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."transitions" DROP CONSTRAINT "transitions_to_question_id_fkey";

-- DropIndex
DROP INDEX "public"."transitions_from_question_id_option_value_key";

-- AlterTable
ALTER TABLE "public"."transitions" DROP COLUMN "option_value",
ADD COLUMN     "answer_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Question";

-- CreateTable
CREATE TABLE "public"."questions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "axis_id" TEXT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."answers" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."steps" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "steps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transitions_from_question_id_answer_id_key" ON "public"."transitions"("from_question_id", "answer_id");

-- AddForeignKey
ALTER TABLE "public"."questions" ADD CONSTRAINT "questions_axis_id_fkey" FOREIGN KEY ("axis_id") REFERENCES "public"."axis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transitions" ADD CONSTRAINT "transitions_from_question_id_fkey" FOREIGN KEY ("from_question_id") REFERENCES "public"."questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transitions" ADD CONSTRAINT "transitions_to_question_id_fkey" FOREIGN KEY ("to_question_id") REFERENCES "public"."questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transitions" ADD CONSTRAINT "transitions_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "public"."answers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."steps" ADD CONSTRAINT "steps_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "public"."answers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
