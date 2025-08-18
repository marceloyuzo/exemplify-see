-- CreateTable
CREATE TABLE "public"."approaches" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "approaches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."axis" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "approachesId" TEXT NOT NULL,

    CONSTRAINT "axis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."axis" ADD CONSTRAINT "axis_approachesId_fkey" FOREIGN KEY ("approachesId") REFERENCES "public"."approaches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
