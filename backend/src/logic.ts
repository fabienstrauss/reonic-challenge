import { ARRIVAL_PROBS, CHARGING_PROBS} from "./data";
import { SimulationConfig, SimulationResult } from "./types";

export class Simulation {

    private config: SimulationConfig;
    private chargepoints: number[];
    private ticks = 35040; // 1 year = 365 days * 24 hours * 4 ticks/h

    constructor(config: SimulationConfig) {
        this.config = config;
        this.chargepoints = new Array(config.numChargepoints).fill(0);
    }

    /*
    Determines if a car arrives at a specific time given hourly probabilities.
     */
    private checkIfArrives(tick: number): boolean {
        // Calculate current hour of the day
        const hour = Math.floor((tick % 96) / 4);
        const hourlyProb = ARRIVAL_PROBS[hour];

        // Divide hourly probability to get tick probability
        const tickProb = hourlyProb / 4;

        // Probability with traffic multiplier
        return Math.random() < tickProb * this.config.arrivalMultiplier;
    }

    /*
    Determines required energy (kWh) for an arriving car on given probabilities.
     */
    private getRandomChargingDemand(): number {
        const rand = Math.random();
        let totalProb = 0;

        for (const item of CHARGING_PROBS) {
            totalProb += item.prob;
            if (rand < totalProb) {
                // Convert km to required kWh
                return (item.km / 100) * this.config.consumptionKWh;
            }
        }
        return 0;
    }

    /*
    Runs full year simulation and returns aggregated metrics.
     */
    public run(): SimulationResult {
        let totalEnergyKWh = 0;
        let actualMaxPowerKW = 0;

        for (let t = 0; t < this.ticks; t++) {
            let currTickPower = 0;
            let tickEnergyConsumed = 0;

            for (let i = 0; i < this.chargepoints.length; i++) {

                // If chargepoint is available, check if car arrives
                if (this.chargepoints[i] === 0) {
                    if (this.checkIfArrives(t)) {
                        this.chargepoints[i] = this.getRandomChargingDemand();
                    }
                }

                // If car is connected and need energy, charge it
                if (this.chargepoints[i] > 0) {
                    // Max energy that can be delivered in one tick/15min
                    const energyPerTick = this.config.chargingPowerKW / 4;

                    // Do not deliver more energy than the car actually needs
                    const actualEnergy = Math.min(energyPerTick, this.chargepoints[i]);

                    // Update rest amount of energy needed
                    this.chargepoints[i] -= actualEnergy;

                    // Accumulate metrics for this tick
                    tickEnergyConsumed += actualEnergy;
                    currTickPower += this.config.chargingPowerKW;
                }
            }

            // Add ticks energy to yearly total and update max power peak
            totalEnergyKWh += tickEnergyConsumed;
            actualMaxPowerKW = Math.max(actualMaxPowerKW, currTickPower);
        }

        // Calculate theoretical limits and final results
        const theoreticalMaxPowerKW = this.chargepoints.length * this.config.chargingPowerKW;

        return {
            totalEnergyKWh,
            theoreticalMaxPowerKW,
            actualMaxPowerKW,
            concurrencyFactor: actualMaxPowerKW / (this.chargepoints.length * this.config.chargingPowerKW)
        };
    }
}