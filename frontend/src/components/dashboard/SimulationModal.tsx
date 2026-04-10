import React from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  mode: 'create' | 'update';
  numCP: number;
  setNumCP: (val: number) => void;
  multiplier: number;
  setMultiplier: (val: number) => void;
  isProcessing: boolean;
  error: string | null;
  theme: 'light' | 'dark';
}

export function SimulationModal({
  isOpen, onClose, onSubmit, mode, numCP, setNumCP, multiplier, setMultiplier, isProcessing, error, theme
}: SimulationModalProps) {
  if (!isOpen) return null;
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className={`w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 ${isDark ? 'bg-[#121214] border border-zinc-800' : 'bg-white'}`}>
        <div className={`p-8 border-b flex items-center justify-between ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
          <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {mode === 'create' ? 'Init Engine' : 'Update Config'}
            </h2>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mt-1">Simulation parameters</p>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-zinc-800 text-zinc-500 hover:text-white' : 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900'}`}><X size={18} /></button>
        </div>
        
        <form onSubmit={onSubmit} className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-bold">
              <AlertCircle size={16} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Node Density</label>
              <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{numCP} CPs</span>
            </div>
            <input type="range" min="1" max="100" value={numCP} onChange={e => setNumCP(parseInt(e.target.value))} className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-white ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-1">Arrival Multiplier</label>
            <div className="relative">
              <input 
                type="number" step="0.1" min="0.2" max="2.0" value={multiplier} 
                onChange={e => setMultiplier(parseFloat(e.target.value))} 
                className={`w-full p-3.5 border-2 border-transparent rounded-xl transition-all font-bold text-base outline-none pr-10 ${
                  isDark ? 'bg-zinc-800 text-white focus:border-white' : 'bg-zinc-50 text-zinc-900 focus:border-zinc-900'
                }`} 
              />
            </div>
          </div>

          <button 
            type="submit" disabled={isProcessing} 
            className={`w-full py-4 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 ${isDark ? 'bg-white text-zinc-900 hover:bg-zinc-100' : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/10'}`}
          >
            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : (mode === 'create' ? 'Launch Sequence' : 'Update Node Protocol')}
          </button>
        </form>
      </div>
    </div>
  );
}