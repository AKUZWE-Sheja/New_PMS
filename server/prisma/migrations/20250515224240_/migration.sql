/*
  Warnings:

  - You are about to drop the `Logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParkingSlots` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SlotRequests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "SlotRequests" DROP CONSTRAINT "SlotRequests_slotId_fkey";

-- DropForeignKey
ALTER TABLE "SlotRequests" DROP CONSTRAINT "SlotRequests_userId_fkey";

-- DropForeignKey
ALTER TABLE "SlotRequests" DROP CONSTRAINT "SlotRequests_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_userId_fkey";

-- DropTable
DROP TABLE "Logs";

-- DropTable
DROP TABLE "ParkingSlots";

-- DropTable
DROP TABLE "SlotRequests";

-- DropTable
DROP TABLE "Users";

-- DropTable
DROP TABLE "Vehicles";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "otp" TEXT,
    "otpExpiresAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "otherAttributes" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParkingSlot" (
    "id" SERIAL NOT NULL,
    "slotNumber" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "location" TEXT NOT NULL,

    CONSTRAINT "ParkingSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlotRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "slotId" INTEGER,
    "slotNumber" TEXT,
    "requestStatus" TEXT NOT NULL DEFAULT 'pending',
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "SlotRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plateNumber_key" ON "Vehicle"("plateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ParkingSlot_slotNumber_key" ON "ParkingSlot"("slotNumber");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotRequest" ADD CONSTRAINT "SlotRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotRequest" ADD CONSTRAINT "SlotRequest_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotRequest" ADD CONSTRAINT "SlotRequest_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "ParkingSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
