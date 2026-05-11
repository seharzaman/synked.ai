-- AlterTable
ALTER TABLE "client" ADD COLUMN     "budgetRange" TEXT,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "qualificationScore" INTEGER,
ADD COLUMN     "serviceInterest" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "config" JSONB,
ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "project_userId_idx" ON "project"("userId");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
