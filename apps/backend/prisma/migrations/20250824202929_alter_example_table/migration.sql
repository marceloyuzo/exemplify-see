/*
  Warnings:

  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `knowlodge_areas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Example" DROP CONSTRAINT "Example_knodloge_area_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Example" DROP CONSTRAINT "Example_subject_id_fkey";

-- DropTable
DROP TABLE "public"."Example";

-- DropTable
DROP TABLE "public"."knowlodge_areas";

-- CreateTable
CREATE TABLE "public"."examples" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reference" TEXT[],
    "type" "public"."ExampleType",
    "model_id" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "examples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."models" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."examples" ADD CONSTRAINT "examples_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."examples" ADD CONSTRAINT "examples_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
