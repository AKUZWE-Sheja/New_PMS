/*
  Warnings:

  - You are about to drop the `Log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParkingSlot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SlotRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_userId_fkey";

-- DropForeignKey
ALTER TABLE "SlotRequest" DROP CONSTRAINT "SlotRequest_slotId_fkey";

-- DropForeignKey
ALTER TABLE "SlotRequest" DROP CONSTRAINT "SlotRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "SlotRequest" DROP CONSTRAINT "SlotRequest_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_userId_fkey";

-- DropTable
DROP TABLE "Log";

-- DropTable
DROP TABLE "ParkingSlot";

-- DropTable
DROP TABLE "SlotRequest";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Vehicle";

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "otp" TEXT,
    "otpExpiresAt" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicles" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "otherAttributes" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParkingSlots" (
    "id" SERIAL NOT NULL,
    "slotNumber" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "location" TEXT NOT NULL,

    CONSTRAINT "ParkingSlots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlotRequests" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "slotId" INTEGER,
    "slotNumber" TEXT,
    "requestStatus" TEXT NOT NULL DEFAULT 'pending',
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "SlotRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_plateNumber_key" ON "Vehicles"("plateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ParkingSlots_slotNumber_key" ON "ParkingSlots"("slotNumber");

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotRequests" ADD CONSTRAINT "SlotRequests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotRequests" ADD CONSTRAINT "SlotRequests_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotRequests" ADD CONSTRAINT "SlotRequests_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "ParkingSlots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
