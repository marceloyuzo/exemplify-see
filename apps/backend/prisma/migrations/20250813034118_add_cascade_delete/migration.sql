-- DropForeignKey
ALTER TABLE "public"."axis" DROP CONSTRAINT "axis_approachesId_fkey";

-- AddForeignKey
ALTER TABLE "public"."axis" ADD CONSTRAINT "axis_approachesId_fkey" FOREIGN KEY ("approachesId") REFERENCES "public"."approaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
