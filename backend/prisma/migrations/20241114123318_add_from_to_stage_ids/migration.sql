/*
  Warnings:

  - You are about to drop the column `activity` on the `Log` table. All the data in the column will be lost.
  - Added the required column `fromStageId` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toStageId` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" DROP COLUMN "activity",
ADD COLUMN     "fromStageId" INTEGER NOT NULL,
ADD COLUMN     "toStageId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_fromStageId_fkey" FOREIGN KEY ("fromStageId") REFERENCES "FunnelStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_toStageId_fkey" FOREIGN KEY ("toStageId") REFERENCES "FunnelStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
