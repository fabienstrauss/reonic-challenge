-- CreateTable
CREATE TABLE "SimulationRun" (
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
    "numChargingEvents" INTEGER NOT NULL,
    "chargepointTicks" JSONB NOT NULL,

    CONSTRAINT "SimulationRun_pkey" PRIMARY KEY ("id")
);
