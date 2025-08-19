-- CreateTable
CREATE TABLE "public"."lesson_plans" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "user_id" TEXT NOT NULL,
    "approach_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "lesson_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lesson_plan_axes" (
    "id" TEXT NOT NULL,
    "lesson_plan_id" TEXT NOT NULL,
    "axis_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "lesson_plan_axes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lesson_plan_answers" (
    "id" TEXT NOT NULL,
    "lesson_plan_axis_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "answer_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "lesson_plan_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lesson_plan_steps" (
    "id" TEXT NOT NULL,
    "lesson_plan_answer_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "lesson_plan_steps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lesson_plan_axes_lesson_plan_id_axis_id_key" ON "public"."lesson_plan_axes"("lesson_plan_id", "axis_id");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_plan_answers_lesson_plan_axis_id_question_id_key" ON "public"."lesson_plan_answers"("lesson_plan_axis_id", "question_id");

-- AddForeignKey
ALTER TABLE "public"."lesson_plans" ADD CONSTRAINT "lesson_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson_plans" ADD CONSTRAINT "lesson_plans_approach_id_fkey" FOREIGN KEY ("approach_id") REFERENCES "public"."approaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson_plan_axes" ADD CONSTRAINT "lesson_plan_axes_lesson_plan_id_fkey" FOREIGN KEY ("lesson_plan_id") REFERENCES "public"."lesson_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson_plan_axes" ADD CONSTRAINT "lesson_plan_axes_axis_id_fkey" FOREIGN KEY ("axis_id") REFERENCES "public"."axis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson_plan_answers" ADD CONSTRAINT "lesson_plan_answers_lesson_plan_axis_id_fkey" FOREIGN KEY ("lesson_plan_axis_id") REFERENCES "public"."lesson_plan_axes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson_plan_answers" ADD CONSTRAINT "lesson_plan_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson_plan_answers" ADD CONSTRAINT "lesson_plan_answers_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "public"."answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson_plan_steps" ADD CONSTRAINT "lesson_plan_steps_lesson_plan_answer_id_fkey" FOREIGN KEY ("lesson_plan_answer_id") REFERENCES "public"."lesson_plan_answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
