import { Simulation } from "./logic";
import { CONSUMPTION_KWH, CHARGING_POWER_KW } from "./data";

// Read CLI arguments
const args = process.argv.slice(2);

if (args.length > 3) {
    console.log("Too many arguments. Expected: [chargepoints] [multiplier] [runAll]");
    process.exit(1);
}

let chargepoints : number | undefined;
let multiplier: number | undefined;
let runAll  : boolean | undefined;

// Parse arguments regardless of their order
for (const arg of args) {

    // Boolean (runAll)
    if (arg == 'true' || arg == 'false') {
        if (runAll !== undefined) {
            console.error("Boolean flag (true/false) can only be passed once.");
            process.exit(1);
        }
        runAll = arg === 'true';

    // Decimal Number (multiplier)
    } else if (arg.includes(".") || arg.includes(",")) {
        if (multiplier !== undefined) {
            console.error("Multiplier can only be passed once.");
            process.exit(1);
        }

        const normalizeArg = arg.replace(",", ".");
        const num = parseFloat(normalizeArg);

        if (isNaN(num) || num < 0.2 || num > 2.0) {
            console.error(`Invalid multiplier ${arg}. Allowed values are between 0.2 and 2.0.`);
            process.exit(1);
        }

        multiplier = Math.round(num * 100) / 100;

    // Integer (chargepoints)
    } else {
        if (chargepoints !== undefined) {
            console.error("Chargepoints argument can only be passed once.");
            process.exit(1);
        }

        const num = parseInt(arg, 10);

        if (isNaN(num) || num < 1 || num > 100) {
            console.error(`Invalid chargepoints '${arg}'. Allowed values are integers between 1 and 100.`);
            process.exit(1);
        }

        chargepoints = num;
    }
}

// Fallback for missing parameters
if (chargepoints === undefined) chargepoints = 20;
if (multiplier === undefined) multiplier = 1.0;
if (runAll === undefined) runAll = false;


// Prepare base config
const baseConfig = {
    numChargepoints: chargepoints,
    chargingPowerKW: CHARGING_POWER_KW,
    arrivalMultiplier: multiplier,
    consumptionKWh: CONSUMPTION_KWH
}

// Run simulation
if (!runAll) {
    // Single run with exact number of chargepoints
    const config = { ...baseConfig, numChargepoints: chargepoints };
    const sim = new Simulation(config);
    const results = sim.run();

    console.log(`Total Energy: ${results.totalEnergyKWh.toFixed(2)} kWh`);
    console.log(`Theoretical MaxPower: ${results.theoreticalMaxPowerKW.toFixed(2)} kW`);
    console.log(`Actual Max Power: ${results.actualMaxPowerKW} kW`);
    console.log(`Concurrency Factor: ${(results.concurrencyFactor * 100).toFixed(2)}`);
} else {
    // Batch run (1 to n chargepoints)
    for (let i = 1; i <= chargepoints; i++) {
        const config = { ...baseConfig, numChargepoints: i };
        const sim = new Simulation(config);
        const results = sim.run();

        console.log(`\nRun: ${i}:`)
        console.log(`Total Energy: ${results.totalEnergyKWh.toFixed(2)} kWh`);
        console.log(`Theoretical MaxPower: ${results.theoreticalMaxPowerKW.toFixed(2)} kW`);
        console.log(`Actual Max Power: ${results.actualMaxPowerKW} kW`);
        console.log(`Concurrency Factor: ${(results.concurrencyFactor * 100).toFixed(2)}`);
    }
}