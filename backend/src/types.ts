export interface SimulationConfig {
    numChargepoints: number,
    chargingPowerKW: number,
    arrivalMultiplier: number,
    consumptionKWh: number
}

export interface TickData {
    t: number,
    v: number[]
}

export interface SimulationResult {
    totalEnergyKWh: number;
    theoreticalMaxPowerKW: number;
    actualMaxPowerKW: number;
    concurrencyFactor: number;
    chargepointTicks: TickData[];
}