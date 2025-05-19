-- DropForeignKey
ALTER TABLE "SlotRequest" DROP CONSTRAINT "SlotRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "SlotRequest" DROP CONSTRAINT "SlotRequest_vehicleId_fkey";

-- AlterTable
ALTER TABLE "SlotRequest" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "SlotRequest" ADD CONSTRAINT "SlotRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotRequest" ADD CONSTRAINT "SlotRequest_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
