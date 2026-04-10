export interface ChargepointTick {
  values: number[];
}

export interface SimulationMetadata {
  id: string;
  name?: string;
  createdAt: string;
  numChargepoints: number;
  arrivalMultiplier: number;
}

export interface SimulationDetails extends SimulationMetadata {
  chargepointTicks: number[][];
}