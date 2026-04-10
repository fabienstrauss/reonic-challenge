import { useState, useEffect, useCallback } from 'react';
import type { SimulationMetadata } from '../types';
import { api } from '../api/api';

export function useSimulations() {
  const [simulations, setSimulations] = useState<SimulationMetadata[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSimulations = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await api.getSimulations(signal);
      setSimulations(data);
    } catch (err: any) {
      if (err.name !== 'AbortError') console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSimulation = useCallback(async (id: string) => {
    try {
      await api.deleteSimulation(id);
      setSimulations(prev => prev.filter(s => s.id !== id));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  const addSimulation = useCallback((sim: SimulationMetadata) => {
    setSimulations(prev => [sim, ...prev]);
  }, []);

  const updateSimulationInList = useCallback((sim: SimulationMetadata) => {
    setSimulations(prev => prev.map(s => s.id === sim.id ? sim : s));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchSimulations(controller.signal);
    return () => controller.abort();
  }, [fetchSimulations]);

  return { simulations, loading, deleteSimulation, addSimulation, updateSimulationInList, refresh: fetchSimulations };
}