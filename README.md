# Reonic take-home assignment

A full-stack web application designed to simulate, persist, and visualize the energy demands of EV charging stations over a full year (35,040 ticks/year).

## A Personal Note

Hi Reonic Team! 👋

While my primary tech stack is slightly different, I actively chose to use your stack (TypeScript, Node.js, React) for this challenge to push myself and learn something new.

I focused on **Task 1 (Logic)** and **Task 2b (Backend)**. However, I couldn't just leave those beautiful 35k data points sitting in a database. I *had* to see them in action. Therefore, I also tackled **Task 2a (Frontend)**. Due to the time constraints of this challenge, I leveraged AI to help speed up the frontend development. The core simulation engine, API, and database structure, however, are entirely my own work.

---

## Quick Start

You can run this project in two ways: test the raw mathematical engine directly via the CLI, or launch the complete full-stack dashboard.

## Option A: Standalone CLI Simulation
If you just want to test the core logic without spinning up the database or UI, you can run the simulation script directly from your terminal.

Navigate to the backend/simulation folder and run the script:
```bash
cd backend
npx ts-node src/index.ts
```

### Customizing the Simulation (CLI Arguments):
You can append parameters directly to the command. The script is smart enough to accept them in any order:
- **Chargepoints:** `0` to `100` (Default: `20`)
- **Arrival Multiplier:** `0.2` to `2.0` (Default: `1.0`)
- **Run All:** `true` or `false` (Default: `false`). If `true`, the script will sequentially simulate from 1 up to the given number of chargepoints.

*Example command (30 chargepoints, 1.5x multiplier, run all):*
```bash
npx ts-node src/index.ts 30 1.5 true
```

## Option B: Full-Stack Dashboard
To experience the complete application with the UI visualization and database persistence, I've set up a monorepo structure.

### Prerequisites
- Node.js (v18+)
- A running PostgreSQL instance (Local or via Docker)
  Example Docker command: `docker run --name ev-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`

### 1. Environment Configuration
Navigate to the `backend` folder, duplicate the example env file, and add your Postgres URL:
```bash
cd backend
cp .env.example .env
# Edit .env and set DATABASE_URL="postgresql://user:password@localhost:5432/ev_sim?schema=public"
```

### 2. Setup & Run
Return to the root directory of the project. Run the setup script and start the dev servers:
```bash
npm run setup
npm run dev
```
- **Frontend Dashboard:** `http://localhost:5173`
- **Backend API:** `http://localhost:3001`

---

## Architecture & Features

This project is divided into three main pillars:

### 1. Core Simulation Engine (`logic.ts`)
It simulates a full year (35,040 intervals of 15 minutes) of EV charging events.
- **Dynamic Inputs:** Accepts variables for the number of charge points (0-100) and an arrival multiplier (0.2x - 2.0x).

### 2. Backend API (Express + Prisma + PostgreSQL)
A robust REST API to persist and manage simulation runs.
- **Data Persistence Strategy:** Since storing 35k+ data points per charge point per simulation as individual rows would bloat the DB, the heavy `chargepointTicks` are stored efficiently as a JSON structure. This keeps the database lean (1-2MB per simulation).
- **Zod Validation:** All incoming API requests are strictly validated using Zod to ensure type safety.
- **Jest Testing:** The core mathematical logic is covered by Jest unit tests to ensure accuracy.
- **Endpoints:**
  - `POST /api/simulations` - Create and run a new simulation.
  - `GET /api/simulations` - List all simulations.
  - `GET /api/simulations/:id` - Get specific simulation details.
  - `UPDATE /api/simulations/:id` - Updates a specific simulation details and reruns simulation.
  - `DELETE /api/simulations/:id` - Delete a simulation.

### 3. Frontend Visualization (React + Tailwind CSS)
A minimal, custom-styled dashboard to interact with the backend.
- **Interactive Chart:** Visualizes the energy demand. Includes timeframe filtering (1 Day, 1 Week, 1 Month, 1 Year).
- **Live Playback:** An interactive feature that allows you to "playback" a specific day, visualizing exactly which charge points are active and drawing power in real-time.
- **Compare:** xxx ghost graph oder so
- **KPI Dashboards:** Displays aggregated metrics like Total Energy and Max Power.

---

## Database Schema

Here is a simplified view of the Prisma Database structure:

```mermaid
erDiagram
    SimulationRun {
        String id "UUID"
        Int numChargepoints "1-100"
        Float arrivalMultiplier "0.2 - 2.0"
        Float totalEnergyConsumed "Total kWh"
        Float theoreticalMaxPower "Max possible kW"
        Float actualMaxPower "Peak kW reached"
        Float concurrencyFactor "Calculated factor"
        Json chargepointTicks "35,040 points x N chargepoints"
        DateTime createdAt "Indexed for fast sorting"
    }
```

---

## Screenshots

|                              Dashboard Overview                              |                          Live Playback Simulation                          |
|:----------------------------------------------------------------------------:|:--------------------------------------------------------------------------:|
| <img src="./docs/screenshot_dashboard.jpg" width="400" alt="Dashboard View"> | <img src="./docs/screenshot_playback.jpg" width="400" alt="Live Playback"> |

---

## Project Structure

```text
.
├── backend/                         # Node.js API & Simulation Engine
│   ├── prisma/
│   │   ├── migrations/              # Database migration history
│   │   └── schema.prisma            # Database schema definition
│   ├── src/
│   │   ├── logic.ts                 # Core mathematical simulation engine
│   │   ├── logic.test.ts            # Jest test suite for the engine
│   │   ├── server.ts                # Express server entry point
│   │   ├── simulation.controller.ts # API route handlers
│   │   ├── data.ts                  # Static data and constants
│   │   └── types.ts                 # Shared TypeScript interfaces
│   ├── jest.config.js               # Test configuration
│   ├── tsconfig.json
│   └── package.json
├── frontend/                        # React Vite Application
│   ├── src/                         # UI Components, State & API Fetching
│   ├── index.html
│   ├── eslint.config.js
│   └── package.json        
├── package.json
└── README.md

___

## Running Tests
To execute the Jest test suite for the core logic:
```bash
npm run test
```