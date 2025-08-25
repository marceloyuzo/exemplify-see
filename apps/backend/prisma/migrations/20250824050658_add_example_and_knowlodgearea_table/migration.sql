/*
  Warnings:

  - The `example` column on the `lesson_plans` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."ExampleType" AS ENUM ('correct', 'erroneous');

-- AlterTable
ALTER TABLE "public"."lesson_plans" DROP COLUMN "example",
ADD COLUMN     "example" "public"."ExampleType";

-- DropEnum
DROP TYPE "public"."Example";

-- CreateTable
CREATE TABLE "public"."Example" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "public"."ExampleType",
    "knodloge_area_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."knowlodge_areas" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "knowlodge_areas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Example" ADD CONSTRAINT "Example_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Example" ADD CONSTRAINT "Example_knodloge_area_id_fkey" FOREIGN KEY ("knodloge_area_id") REFERENCES "public"."knowlodge_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
