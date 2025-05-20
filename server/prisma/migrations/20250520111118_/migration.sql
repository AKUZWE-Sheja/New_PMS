/*
  Warnings:

  - Added the required column `costPerHour` to the `ParkingSlot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ParkingSlot" ADD COLUMN     "costPerHour" DOUBLE PRECISION NOT NULL;
