/*
  Warnings:

  - You are about to drop the `Transition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Transition" DROP CONSTRAINT "Transition_nextQuestionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transition" DROP CONSTRAINT "Transition_questionId_fkey";

-- DropTable
DROP TABLE "public"."Transition";

-- CreateTable
CREATE TABLE "public"."transitions" (
    "id" TEXT NOT NULL,
    "from_question_id" TEXT NOT NULL,
    "option_value" TEXT NOT NULL,
    "to_question_id" TEXT,

    CONSTRAINT "transitions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transitions_to_question_id_key" ON "public"."transitions"("to_question_id");

-- CreateIndex
CREATE UNIQUE INDEX "transitions_from_question_id_option_value_key" ON "public"."transitions"("from_question_id", "option_value");

-- AddForeignKey
ALTER TABLE "public"."transitions" ADD CONSTRAINT "transitions_from_question_id_fkey" FOREIGN KEY ("from_question_id") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transitions" ADD CONSTRAINT "transitions_to_question_id_fkey" FOREIGN KEY ("to_question_id") REFERENCES "public"."Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
