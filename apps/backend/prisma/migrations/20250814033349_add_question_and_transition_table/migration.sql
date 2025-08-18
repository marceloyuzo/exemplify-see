/*
  Warnings:

  - You are about to drop the column `approachesId` on the `axis` table. All the data in the column will be lost.
  - Added the required column `approaches_id` to the `axis` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."axis" DROP CONSTRAINT "axis_approachesId_fkey";

-- AlterTable
ALTER TABLE "public"."axis" DROP COLUMN "approachesId",
ADD COLUMN     "approaches_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Question" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "axis_id" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transition" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionValue" TEXT NOT NULL,
    "nextQuestionId" TEXT,

    CONSTRAINT "Transition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transition_nextQuestionId_key" ON "public"."Transition"("nextQuestionId");

-- CreateIndex
CREATE UNIQUE INDEX "Transition_questionId_optionValue_key" ON "public"."Transition"("questionId", "optionValue");

-- AddForeignKey
ALTER TABLE "public"."axis" ADD CONSTRAINT "axis_approaches_id_fkey" FOREIGN KEY ("approaches_id") REFERENCES "public"."approaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_axis_id_fkey" FOREIGN KEY ("axis_id") REFERENCES "public"."axis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transition" ADD CONSTRAINT "Transition_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transition" ADD CONSTRAINT "Transition_nextQuestionId_fkey" FOREIGN KEY ("nextQuestionId") REFERENCES "public"."Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
