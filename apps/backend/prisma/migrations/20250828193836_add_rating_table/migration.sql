-- CreateTable
CREATE TABLE "public"."ratings" (
    "id" TEXT NOT NULL,
    "comment" TEXT,
    "rate" INTEGER NOT NULL,
    "example_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ratings" ADD CONSTRAINT "ratings_example_id_fkey" FOREIGN KEY ("example_id") REFERENCES "public"."examples"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ratings" ADD CONSTRAINT "ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
