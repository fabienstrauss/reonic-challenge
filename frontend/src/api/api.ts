import type { SimulationMetadata, SimulationDetails } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const api = {
  async getSimulations(signal?: AbortSignal): Promise<SimulationMetadata[]> {
    const res = await fetch(`${API_BASE}/simulations`, { signal });
    if (!res.ok) throw new Error('Failed to fetch simulations');
    return res.json();
  },

  async getSimulationDetails(id: string, signal?: AbortSignal): Promise<SimulationDetails> {
    const res = await fetch(`${API_BASE}/simulations/${id}`, { signal });
    if (!res.ok) throw new Error('Failed to load simulation details');
    return res.json();
  },

  async createSimulation(data: { numChargepoints: number; arrivalMultiplier: number }): Promise<SimulationMetadata> {
    const res = await fetch(`${API_BASE}/simulations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create simulation');
    return res.json();
  },

  async updateSimulation(id: string, data: { numChargepoints: number; arrivalMultiplier: number }): Promise<SimulationMetadata> {
    const res = await fetch(`${API_BASE}/simulations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update simulation');
    return res.json();
  },

  async deleteSimulation(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/simulations/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete simulation');
  }
};