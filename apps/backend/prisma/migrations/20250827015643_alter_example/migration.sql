/*
  Warnings:

  - Made the column `type` on table `examples` required. This step will fail if there are existing NULL values in that column.
  - Made the column `topic_id` on table `examples` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."examples" DROP CONSTRAINT "examples_topic_id_fkey";

-- AlterTable
ALTER TABLE "public"."examples" ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "topic_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."examples" ADD CONSTRAINT "examples_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
