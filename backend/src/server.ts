import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {
    createSimulation,
    getSimulations,
    getSimulationById,
    updateSimulation,
    deleteSimulation
} from "./simulation.controller";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// API endpoints
app.post('/api/simulations', createSimulation);
app.get('/api/simulations', getSimulations);
app.get('/api/simulations/:id', getSimulationById);
app.put('/api/simulations/:id', updateSimulation);
app.delete('/api/simulations/:id', deleteSimulation);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});