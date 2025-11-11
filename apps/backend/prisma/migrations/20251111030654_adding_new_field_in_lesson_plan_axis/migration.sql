-- AlterTable
ALTER TABLE "public"."lesson_plan_axes" ADD COLUMN     "last_question_id" TEXT;

-- AddForeignKey
ALTER TABLE "public"."lesson_plan_axes" ADD CONSTRAINT "lesson_plan_axes_last_question_id_fkey" FOREIGN KEY ("last_question_id") REFERENCES "public"."questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
