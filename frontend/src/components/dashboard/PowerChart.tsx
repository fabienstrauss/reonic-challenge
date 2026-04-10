import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { RefreshCw } from 'lucide-react';

interface PowerChartProps {
  data: any[];
  theme: 'light' | 'dark';
  loading: boolean;
  isComparing: boolean;
  period: string;
}

export function PowerChart({ data, theme, loading, isComparing, period }: PowerChartProps) {
  const isDark = theme === 'dark';

  return (
    <div className={`p-6 md:p-8 rounded-3xl border relative overflow-hidden transition-all ${
      isDark ? 'bg-[#121214] border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
    }`}>
      {(loading || isComparing) && (
        <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px] ${isDark ? 'bg-[#09090b]/60' : 'bg-white/60'}`}>
          <RefreshCw className={`w-8 h-8 animate-spin ${isDark ? 'text-white' : 'text-zinc-900'}`} />
          <p className={`text-[11px] font-semibold uppercase tracking-widest ${isDark ? 'text-white' : 'text-zinc-900'}`}>Processing Data...</p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 px-2">
        <div>
          <h3 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>Load Distribution</h3>
          <p className={`text-xs font-medium ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {isComparing ? 'Comparing power trends' : 'Time-series analysis of consumption'}
          </p>
        </div>
      </div>

      <div className="w-full h-[350px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDark ? '#fff' : '#18181b'} stopOpacity={0.15}/>
                <stop offset="95%" stopColor={isDark ? '#fff' : '#18181b'} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorC" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#27272a' : '#f4f4f5'} />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#71717a', fontSize: 10}} 
              minTickGap={40} 
              interval={period === '1y' ? 0 : 'preserveStartEnd'}
            />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10}} unit=" kW" />
            <Tooltip 
              contentStyle={{backgroundColor: isDark ? '#18181b' : '#fff', borderRadius: '12px', border: 'none'}} 
              itemStyle={{fontWeight: 700, fontSize: '13px', color: isDark ? '#fff' : '#18181b'}} 
              labelStyle={{fontSize: '10px', color: '#71717a', textTransform: 'uppercase'}} 
            />
            <Area 
              type="monotone" 
              dataKey="power" 
              name="Active" 
              stroke={isDark ? '#fff' : '#18181b'} 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorP)" 
              animationDuration={800} 
            />
            {data.some(d => d.comparisonPower !== undefined) && (
              <Area 
                type="monotone" 
                dataKey="comparisonPower" 
                name="Reference" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                fillOpacity={1} 
                fill="url(#colorC)" 
                animationDuration={800} 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
