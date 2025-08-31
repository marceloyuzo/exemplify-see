-- CreateTable
CREATE TABLE "public"."attachments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "size" INTEGER,
    "example_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attachments_key_key" ON "public"."attachments"("key");

-- AddForeignKey
ALTER TABLE "public"."attachments" ADD CONSTRAINT "attachments_example_id_fkey" FOREIGN KEY ("example_id") REFERENCES "public"."examples"("id") ON DELETE SET NULL ON UPDATE CASCADE;
