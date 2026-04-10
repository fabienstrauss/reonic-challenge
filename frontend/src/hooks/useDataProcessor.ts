import { useMemo, useCallback } from 'react';
import type { SimulationDetails } from '../types';

interface ProcessOptions {
  details: SimulationDetails | null;
  comparisonDetails: SimulationDetails | null;
  period: string;
  offset: number;
  selectedChargepoints: number[];
}

export function useDataProcessor({ 
  details, 
  comparisonDetails, 
  period, 
  offset, 
  selectedChargepoints 
}: ProcessOptions) {
  
  const getAggregatedPower = useCallback((ticks: any[], start: number, window: number, factor: number, cpoints: number[]) => {
    const rawSubset = ticks.slice(start, start + window);
    const aggregated = [];
    for (let i = 0; i < rawSubset.length; i += factor) {
      const chunk = rawSubset.slice(i, i + factor);
      if (chunk.length === 0) continue;
      let sumPower = 0;
      chunk.forEach((tickData: any) => {
        const v = tickData?.v || tickData?.values || (Array.isArray(tickData) ? tickData : []);
        sumPower += v
          .filter((_: any, idx: number) => cpoints.includes(idx))
          .reduce((s: number, val: any) => s + (Number(val) || 0), 0);
      });
      aggregated.push(parseFloat((sumPower / chunk.length).toFixed(2)));
    }
    return aggregated;
  }, []);

  const calculateKPIs = useCallback((dataPoints: number[]) => {
    if (dataPoints.length === 0) return { energy: 0, peak: 0, avg: 0 };
    const totalPowerSum = dataPoints.reduce((acc, curr) => acc + curr, 0);
    const factor = period === '1d' ? 1 : period === '1w' ? 4 : period === '1m' ? 96 : 2920;
    const energy = (totalPowerSum * factor) * 0.25;
    return {
      energy,
      peak: Math.max(...dataPoints),
      avg: energy / (dataPoints.length * factor * 0.25)
    };
  }, [period]);

  const processedData = useMemo(() => {
    if (!details || !details.chargepointTicks || selectedChargepoints.length === 0) return [];
    
    let windowSize = period === '1d' ? 96 : period === '1w' ? 96 * 7 : period === '1m' ? 96 * 30 : 35040;
    let factor = period === '1d' ? 1 : period === '1w' ? 4 : period === '1m' ? 96 : 2920;
    
    const activeLine = getAggregatedPower(details.chargepointTicks, period === '1y' ? 0 : offset, windowSize, factor, selectedChargepoints);
    const comparisonLine = comparisonDetails 
      ? getAggregatedPower(comparisonDetails.chargepointTicks, period === '1y' ? 0 : offset, windowSize, factor, Array.from({ length: comparisonDetails.numChargepoints }, (_, i) => i)) 
      : [];

    return activeLine.map((p, i) => {
      const currentTickIndex = (period === '1y' ? 0 : offset) + i * factor;
      let label = "";
      if (period === '1d') {
        const min = (currentTickIndex % 96) * 15;
        label = `${Math.floor(min/60).toString().padStart(2,'0')}:${(min%60).toString().padStart(2,'0')}`;
      } else if (period === '1y') label = `Month ${Math.floor(currentTickIndex / 2920) + 1}`;
      else label = `Day ${Math.floor(currentTickIndex / 96) + 1}`;

      return { label, power: p, comparisonPower: comparisonLine[i] };
    });
  }, [details, comparisonDetails, period, offset, selectedChargepoints, getAggregatedPower]);

  const activeKPIs = useMemo(() => calculateKPIs(processedData.map(d => d.power)), [processedData, calculateKPIs]);
  const compKPIs = useMemo(() => comparisonDetails ? calculateKPIs(processedData.map(d => d.comparisonPower)) : null, [processedData, comparisonDetails, calculateKPIs]);

  return { processedData, activeKPIs, compKPIs };
}