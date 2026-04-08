import { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { Simulation } from './logic';
import { CONSUMPTION_KWH, CHARGING_POWER_KW} from './data';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// POST /api/simulations
export const createSimulation = async (req: Request, res: Response) => {
    try {
        const { numChargepoints, arrivalMultiplier } = req.body;

        const config = {
            numChargepoints: numChargepoints || 20,
            arrivalMultiplier: arrivalMultiplier || 1.0,
            consumptionKWh: CONSUMPTION_KWH,
            chargingPowerKW: CHARGING_POWER_KW
        }

        const sim = new Simulation(config);
        const result = sim.run();

        const savedRun = await prisma.simulationRun.create({
            data: {
                numChargepoints: config.numChargepoints,
                arrivalMultiplier: config.arrivalMultiplier,
                consumptionKWh: config.consumptionKWh,
                chargingPowerKW: config.chargingPowerKW,
                totalEnergyKWh: result.totalEnergyKWh,
                theoreticalMaxPowerKW: result.theoreticalMaxPowerKW,
                actualMaxPowerKW: result.actualMaxPowerKW,
                concurrencyFactor: result.concurrencyFactor,
                numChargingEvents: 0,
                chargepointTicks: result.chargepointTicks as any
            }
        });

        res.status(201).json(savedRun);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Simulation failed.' });
    }
}

// GET /api/simulations
export const getSimulations = async (req: Request, res: Response)=> {
    try {
        const runs = await prisma.simulationRun.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                createdAt: true,
                numChargepoints: true,
                arrivalMultiplier: true,
                consumptionKWh: true,
                chargingPowerKW: true,
                totalEnergyKWh: true,
                actualMaxPowerKW: true,
                concurrencyFactor: true
            }
        });
        res.json(runs);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ error: 'Failed to fetch simulations.' });
    }
}

// GET /api/simulations/:id
export const getSimulationById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const run = await prisma.simulationRun.findUnique({
            where: { id }
        });

        if (!run) return res.status(404).json({ error: 'Simulation not found.' });

        res.json(run);
    } catch (error) {
        console.error("Fetch Detail Error:", error);
        res.status(500).json({ error: 'Failed to fetch simulation details.' });
    }
}

// PUT /api/simulations/:id
export const updateSimulation = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { numChargepoints, arrivalMultiplier, consumptionKWh, chargingPowerKW } = req.body;

        const existingRun = await prisma.simulationRun.findUnique({ where: { id } });
        if (!existingRun) return res.status(404).json({ error: 'Simulation not found.' });

        const config = {
            numChargepoints: numChargepoints ?? existingRun.numChargepoints,
            arrivalMultiplier: arrivalMultiplier ?? existingRun.arrivalMultiplier,
            consumptionKWh: consumptionKWh ?? existingRun.consumptionKWh,
            chargingPowerKW: chargingPowerKW ?? existingRun.chargingPowerKW
        };

        const sim = new Simulation(config);
        const result = sim.run();

        const updatedRun = await prisma.simulationRun.update({
            where: { id },
            data: {
                numChargepoints: config.numChargepoints,
                arrivalMultiplier: config.arrivalMultiplier,
                consumptionKWh: config.consumptionKWh,
                chargingPowerKW: config.chargingPowerKW,
                totalEnergyKWh: result.totalEnergyKWh,
                theoreticalMaxPowerKW: result.theoreticalMaxPowerKW,
                actualMaxPowerKW: result.actualMaxPowerKW,
                concurrencyFactor: result.concurrencyFactor,
                chargepointTicks: result.chargepointTicks as any
            }
        });

        res.json(updatedRun);
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ error: 'Failed to update simulation.' });
    }
}

// DELETE /api/simulations/:id
export const deleteSimulation = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const existingRun = await prisma.simulationRun.findUnique({ where: { id } });
        if (!existingRun) return res.status(404).json({ error: 'Simulation not found.' });

        await prisma.simulationRun.delete({
            where: { id }
        });

        res.status(204).send();
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ error: 'Failed to delete simulation.' });
    }
}