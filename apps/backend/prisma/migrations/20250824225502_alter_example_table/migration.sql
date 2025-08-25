/*
  Warnings:

  - Added the required column `author_id` to the `examples` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."examples" ADD COLUMN     "author_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."examples" ADD CONSTRAINT "examples_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
