import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '../ui/Card';

interface KPICardProps {
  label: string;
  value: number | string;
  comparisonValue?: number;
  unit?: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  theme: 'light' | 'dark';
}

export function KPICard({ label, value, comparisonValue, unit, icon: Icon, color, bg, theme }: KPICardProps) {
  const isDark = theme === 'dark';
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]+/g, ""));
  const diff = comparisonValue ? numericValue - comparisonValue : 0;

  return (
    <Card className={`${
      isDark 
        ? 'bg-[#121214] border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.3)]' 
        : 'bg-white border-zinc-200 shadow-sm'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${bg} ${color}`}>
          <Icon size={18} />
        </div>
        <p className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</p>
      </div>
      <div className="flex items-baseline gap-2">
        <p className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          {typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 1 }) : value}
          {unit && <small className="ml-1 text-[10px] font-medium text-zinc-400">{unit}</small>}
        </p>
        {comparisonValue !== undefined && (
          <div className={`flex items-center text-[10px] font-bold ${diff > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
            {diff > 0 ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
            {Math.abs(diff).toLocaleString(undefined, { maximumFractionDigits: 1 })}
          </div>
        )}
      </div>
    </Card>
  );
}
