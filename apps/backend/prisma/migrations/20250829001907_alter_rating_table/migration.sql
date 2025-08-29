/*
  Warnings:

  - A unique constraint covering the columns `[user_id,example_id]` on the table `ratings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ratings_user_id_example_id_key" ON "public"."ratings"("user_id", "example_id");
