import { Simulation } from './logic';

describe('Simulation Core Logic', () => {
    it('should never exceed theoretical max power limit', () => {
        const config = {
            numChargepoints: 5,
            arrivalMultiplier: 1.0,
            consumptionKWh: 18,
            chargingPowerKW: 11
        };

        const sim = new Simulation(config);
        const result = sim.run();

        const theoreticalMax = 5 * 11;

        expect(result.theoreticalMaxPowerKW).toBe(theoreticalMax);
        expect(result.actualMaxPowerKW).toBeLessThanOrEqual(theoreticalMax);
        expect(result.concurrencyFactor).toBeLessThanOrEqual(1);
    });

    it('should return zero energy and zero power for 0 chargepoints', () => {
        const config = {
            numChargepoints: 0,
            arrivalMultiplier: 1.0,
            consumptionKWh: 18,
            chargingPowerKW: 11
        };

        const sim = new Simulation(config);
        const result = sim.run();

        expect(result.actualMaxPowerKW).toBe(0);
        expect(result.totalEnergyKWh).toBe(0);
        expect(result.concurrencyFactor).toBeNaN();
    });
});