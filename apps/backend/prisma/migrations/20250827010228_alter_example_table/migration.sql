/*
  Warnings:

  - You are about to drop the column `reference` on the `examples` table. All the data in the column will be lost.
  - Added the required column `is_approve` to the `examples` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."examples" DROP CONSTRAINT "examples_topic_id_fkey";

-- AlterTable
ALTER TABLE "public"."examples" DROP COLUMN "reference",
ADD COLUMN     "is_approve" BOOLEAN NOT NULL,
ADD COLUMN     "references" TEXT[],
ALTER COLUMN "topic_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."examples" ADD CONSTRAINT "examples_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
