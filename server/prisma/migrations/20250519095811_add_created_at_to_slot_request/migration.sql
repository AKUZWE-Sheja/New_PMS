/*
  Warnings:

  - You are about to drop the column `preferredSize` on the `SlotRequest` table. All the data in the column will be lost.
  - You are about to drop the column `preferredSlotNumber` on the `SlotRequest` table. All the data in the column will be lost.
  - You are about to drop the column `preferredVehicleType` on the `SlotRequest` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SlotRequest" DROP CONSTRAINT "SlotRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "SlotRequest" DROP CONSTRAINT "SlotRequest_vehicleId_fkey";

-- AlterTable
ALTER TABLE "SlotRequest" DROP COLUMN "preferredSize",
DROP COLUMN "preferredSlotNumber",
DROP COLUMN "preferredVehicleType";

-- AddForeignKey
ALTER TABLE "SlotRequest" ADD CONSTRAINT "SlotRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotRequest" ADD CONSTRAINT "SlotRequest_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
