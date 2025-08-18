/*
  Warnings:

  - Added the required column `order` to the `steps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."steps" ADD COLUMN     "order" INTEGER NOT NULL;
