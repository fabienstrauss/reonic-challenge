/*
  Warnings:

  - You are about to drop the `SimulationRun` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SimulationRun";

-- CreateTable
CREATE TABLE "simulation_runs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numChargepoints" INTEGER NOT NULL,
    "arrivalMultiplier" DOUBLE PRECISION NOT NULL,
    "consumptionKWh" DOUBLE PRECISION NOT NULL,
    "chargingPowerKW" DOUBLE PRECISION NOT NULL,
    "totalEnergyKWh" DOUBLE PRECISION NOT NULL,
    "theoreticalMaxPowerKW" DOUBLE PRECISION NOT NULL,
    "actualMaxPowerKW" DOUBLE PRECISION NOT NULL,
    "concurrencyFactor" DOUBLE PRECISION NOT NULL,
    "chargepointTicks" JSONB NOT NULL,

    CONSTRAINT "simulation_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "simulation_runs_createdAt_idx" ON "simulation_runs"("createdAt");
