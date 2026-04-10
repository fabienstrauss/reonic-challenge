import type { MouseEvent } from 'react';
import { PanelLeftClose, Plus, Trash2, GitCompare } from 'lucide-react';
import type { SimulationMetadata } from '../../types';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  simulations: SimulationMetadata[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  comparisonId: string | null;
  setComparisonId: (id: string | null) => void;
  handleDelete: (e: MouseEvent, id: string) => void;
  openCreateModal: () => void;
}

export function Sidebar({
  isSidebarOpen, setIsSidebarOpen, theme, setTheme,
  simulations, selectedId, setSelectedId, comparisonId, setComparisonId,
  handleDelete, openCreateModal
}: SidebarProps) {
  const isDark = theme === 'dark';

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-[70] w-72 transform transition-transform duration-300 ease-in-out border-r
      ${isDark ? 'bg-[#121214] border-zinc-800' : 'bg-white border-zinc-200'}
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex flex-col h-full overflow-hidden w-72">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8 px-1">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Simulations</span>
            <button onClick={() => setIsSidebarOpen(false)} className={`p-1 rounded-md transition-all ${isDark ? 'hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300' : 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600'}`}>
              <PanelLeftClose size={18} />
            </button>
          </div>
          <button 
            onClick={openCreateModal}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition-all shadow-sm ${
              isDark ? 'bg-zinc-100 text-zinc-900 hover:bg-white' : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
          >
            <Plus size={18} />
            <span>New Simulation</span>
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
          {simulations.map(sim => (
            <div 
              key={sim.id}
              onClick={() => { setSelectedId(sim.id); setComparisonId(null); setIsSidebarOpen(false); }}
              className={`group flex flex-col p-3.5 rounded-xl cursor-pointer transition-all border ${
                selectedId === sim.id 
                  ? (isDark ? 'bg-zinc-800/50 border-zinc-700 shadow-sm' : 'bg-zinc-100 border-zinc-200 shadow-sm')
                  : (isDark ? 'border-transparent hover:bg-zinc-800/30' : 'border-transparent hover:bg-zinc-50')
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold ${selectedId === sim.id ? (isDark ? 'text-white' : 'text-zinc-900') : (isDark ? 'text-zinc-400' : 'text-zinc-600')}`}>
                  ID: {sim.id.slice(0, 6)}
                </span>
                <div className="flex items-center gap-1">
                  {selectedId !== sim.id && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setComparisonId(sim.id); setIsSidebarOpen(false); }} 
                      className={`p-1 rounded transition-all ${comparisonId === sim.id ? 'text-emerald-500 bg-emerald-500/10' : 'text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10'}`}
                    >
                      <GitCompare size={14}/>
                    </button>
                  )}
                  <button onClick={(e) => handleDelete(e, sim.id)} className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${isDark ? 'bg-zinc-700/50 text-zinc-400' : 'bg-zinc-200/50 text-zinc-500'}`}>
                  {sim.numChargepoints} CPs
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${isDark ? 'bg-zinc-700/50 text-zinc-400' : 'bg-zinc-200/50 text-zinc-500'}`}>
                  {sim.arrivalMultiplier}x
                </span>
              </div>
            </div>
          ))}
        </nav>

        <div className={`p-6 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </aside>
  );
}