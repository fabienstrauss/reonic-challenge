import { Zap, Activity, Calendar, Cpu } from 'lucide-react';
import { KPICard } from './KPICard';

interface KPIGridProps {
  activeKPIs: { energy: number; peak: number; avg: number };
  compKPIs: { energy: number; peak: number; avg: number } | null;
  numChargepoints: number;
  compChargepoints?: number;
  theme: 'light' | 'dark';
}

export function KPIGrid({ activeKPIs, compKPIs, numChargepoints, compChargepoints, theme }: KPIGridProps) {
  const kpis = [
    { label: 'Total Energy', value: activeKPIs.energy, comp: compKPIs?.energy, unit: 'kWh', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Peak Power', value: activeKPIs.peak, comp: compKPIs?.peak, unit: 'kW', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Avg. Load', value: activeKPIs.avg, comp: compKPIs?.avg, unit: 'kW', icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Active CPs', value: numChargepoints, comp: compChargepoints, unit: '', icon: Cpu, color: 'text-zinc-500', bg: 'bg-zinc-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {kpis.map((kpi, i) => (
        <KPICard key={i} {...kpi} comparisonValue={kpi.comp} theme={theme} />
      ))}
    </div>
  );
}