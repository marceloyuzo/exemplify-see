-- DropForeignKey
ALTER TABLE "public"."questions" DROP CONSTRAINT "questions_axis_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."steps" DROP CONSTRAINT "steps_answerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."transitions" DROP CONSTRAINT "transitions_answer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."transitions" DROP CONSTRAINT "transitions_from_question_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."transitions" DROP CONSTRAINT "transitions_to_question_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."questions" ADD CONSTRAINT "questions_axis_id_fkey" FOREIGN KEY ("axis_id") REFERENCES "public"."axis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transitions" ADD CONSTRAINT "transitions_from_question_id_fkey" FOREIGN KEY ("from_question_id") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transitions" ADD CONSTRAINT "transitions_to_question_id_fkey" FOREIGN KEY ("to_question_id") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transitions" ADD CONSTRAINT "transitions_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "public"."answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."steps" ADD CONSTRAINT "steps_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "public"."answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
