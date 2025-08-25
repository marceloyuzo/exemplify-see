/*
  Warnings:

  - You are about to drop the column `model_id` on the `examples` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."examples" DROP CONSTRAINT "examples_model_id_fkey";

-- AlterTable
ALTER TABLE "public"."examples" DROP COLUMN "model_id";

-- CreateTable
CREATE TABLE "public"."example_models" (
    "example_id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "example_models_pkey" PRIMARY KEY ("example_id","model_id")
);

-- AddForeignKey
ALTER TABLE "public"."example_models" ADD CONSTRAINT "example_models_example_id_fkey" FOREIGN KEY ("example_id") REFERENCES "public"."examples"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."example_models" ADD CONSTRAINT "example_models_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
