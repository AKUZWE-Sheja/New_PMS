/*
  Warnings:

  - The `status` column on the `ParkingSlot` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `requestStatus` column on the `SlotRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `size` on the `ParkingSlot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vehicleType` on the `ParkingSlot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `endTime` to the `SlotRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `SlotRequest` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `vehicleType` on the `Vehicle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `size` on the `Vehicle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('CAR', 'TRUCK', 'MOTORBIKE', 'VAN');

-- CreateEnum
CREATE TYPE "VehicleSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "SlotStatus" AS ENUM ('available', 'occupied', 'reserved');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "ParkingSlot" DROP COLUMN "size",
ADD COLUMN     "size" "VehicleSize" NOT NULL,
DROP COLUMN "vehicleType",
ADD COLUMN     "vehicleType" "VehicleType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "SlotStatus" NOT NULL DEFAULT 'available';

-- AlterTable
ALTER TABLE "SlotRequest" ADD COLUMN     "cost" DOUBLE PRECISION,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "requestStatus",
ADD COLUMN     "requestStatus" "RequestStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "vehicleType",
ADD COLUMN     "vehicleType" "VehicleType" NOT NULL,
DROP COLUMN "size",
ADD COLUMN     "size" "VehicleSize" NOT NULL;
