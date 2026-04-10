import type { RefObject } from 'react';
import { PanelLeft, Filter, Hash, ChevronLeft, ChevronRight, Settings2, X, GitCompare } from 'lucide-react';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  theme: 'light' | 'dark';
  period: string;
  setPeriod: (p: string) => void;
  setOffset: (o: number) => void;
  isCPDropdownOpen: boolean;
  setIsCPDropdownOpen: (open: boolean) => void;
  selectedChargepoints: number[];
  setSelectedChargepoints: (cp: number[]) => void;
  numCP: number;
  moveTimeline: (dir: 'prev' | 'next') => void;
  currentTimeDisplay: string;
  openUpdateModal: () => void;
  canUpdate: boolean;
  comparisonId: string | null;
  setComparisonId: (id: string | null) => void;
  dropdownRef: RefObject<HTMLDivElement | null>;
}

export function Header({
  isSidebarOpen, setIsSidebarOpen, theme, period, setPeriod, setOffset,
  isCPDropdownOpen, setIsCPDropdownOpen, selectedChargepoints, setSelectedChargepoints,
  numCP, moveTimeline, currentTimeDisplay, openUpdateModal, canUpdate, comparisonId, setComparisonId,
  dropdownRef
}: HeaderProps) {
  const isDark = theme === 'dark';

  return (
    <header className={`min-h-16 border-b flex flex-wrap items-center justify-between px-4 py-2 md:px-6 shrink-0 transition-colors gap-x-4 gap-y-2 ${isDark ? 'bg-[#121214] border-zinc-800' : 'bg-white border-zinc-200'}`}>
      <div className="flex items-center gap-3 flex-1 min-w-[280px]">
        {!isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(true)} className={`p-1.5 rounded-md transition-all flex-shrink-0 ${isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}>
            <PanelLeft size={20} />
          </button>
        )}
        
        <div className={`flex p-0.5 rounded-lg flex-shrink-0 ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
          {['1d', '1w', '1m', '1y'].map(p => (
            <button 
              key={p} 
              onClick={() => { setPeriod(p); setOffset(0); }} 
              className={`px-3 py-1 text-[10px] md:text-[11px] font-medium rounded-md transition-all ${
                period === p 
                  ? (isDark ? 'bg-zinc-700 text-white shadow-sm' : 'bg-white shadow-sm text-zinc-900') 
                  : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-700')
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsCPDropdownOpen(!isCPDropdownOpen)} 
            className={`flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-lg text-[10px] md:text-[11px] font-semibold border transition-all ${
              isDark 
                ? 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800' 
                : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <Filter size={14} className={isDark ? 'text-zinc-500' : 'text-zinc-400'}/>
            <span className="whitespace-nowrap">CPs: {selectedChargepoints.length}</span>
          </button>
          
          {isCPDropdownOpen && (
            <div className={`absolute top-10 left-0 w-64 border rounded-xl shadow-xl z-[100] p-2 max-h-80 overflow-y-auto ${isDark ? 'bg-[#121214] border-zinc-800' : 'bg-white border-zinc-200'}`}>
              <div className={`flex items-center justify-between p-2 mb-2 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                <button onClick={() => setSelectedChargepoints(Array.from({ length: numCP }, (_, i) => i))} className={`text-[10px] font-semibold uppercase ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}>All</button>
                <button onClick={() => setSelectedChargepoints([])} className={`text-[10px] font-semibold uppercase ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}>Clear</button>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {Array.from({ length: numCP }).map((_, i) => (
                  <label key={i} className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all ${selectedChargepoints.includes(i) ? (isDark ? 'bg-zinc-800' : 'bg-zinc-100') : (isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-zinc-50')}`}>
                    <input type="checkbox" checked={selectedChargepoints.includes(i)} onChange={(e) => e.target.checked ? setSelectedChargepoints([...selectedChargepoints, i]) : setSelectedChargepoints(selectedChargepoints.filter(x => x !== i))} className="hidden" />
                    <div className={`w-3.5 h-3.5 rounded border-2 transition-all ${selectedChargepoints.includes(i) ? (isDark ? 'bg-white border-transparent' : 'bg-zinc-900 border-transparent') : (isDark ? 'border-zinc-700' : 'border-zinc-300')}`} />
                    <span className={`text-[11px] font-medium ${selectedChargepoints.includes(i) ? (isDark ? 'text-white' : 'text-zinc-900') : 'text-zinc-500'}`}>Node {i + 1}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {comparisonId && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-lg text-[10px] font-bold animate-in fade-in slide-in-from-left-2">
            <GitCompare size={12}/>
            <span>Comparing with SIM_{comparisonId.slice(0,6)}</span>
            <button onClick={() => setComparisonId(null)} className="ml-1 hover:text-blue-700"><X size={12}/></button>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3 flex-shrink-0">
         <div className={`flex items-center gap-1.5 p-0.5 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
            <button onClick={() => moveTimeline('prev')} className={`p-1 rounded-md transition-all ${isDark ? 'hover:bg-zinc-700 text-zinc-400 hover:text-white' : 'hover:bg-white text-zinc-500 hover:text-zinc-900'}`}><ChevronLeft size={16}/></button>
            <span className={`text-[10px] md:text-[11px] font-semibold px-1 md:px-2 min-w-[70px] md:min-w-[90px] text-center ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{currentTimeDisplay}</span>
            <button onClick={() => moveTimeline('next')} className={`p-1 rounded-md transition-all ${isDark ? 'hover:bg-zinc-700 text-zinc-400 hover:text-white' : 'hover:bg-white text-zinc-500 hover:text-zinc-900'}`}><ChevronRight size={16}/></button>
         </div>
         <div className={`flex items-center gap-1 pl-2 border-l ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}>
            <Hash size={12} className={isDark ? 'text-zinc-500' : 'text-zinc-400'} />
            <input 
              type="number" min="1" max="365" placeholder="Day" 
              className={`bg-transparent text-[10px] md:text-[11px] font-semibold focus:outline-none w-16 pr-4 text-center appearance-none ${isDark ? 'text-zinc-300 placeholder-zinc-600' : 'text-zinc-700 placeholder-zinc-400'}`} 
              onChange={(e) => { const day = parseInt(e.target.value); if (day >= 1 && day <= 365) { setOffset((day - 1) * 96); setPeriod('1d'); } }} 
            />
          </div>
         <button
            onClick={openUpdateModal}
            disabled={!canUpdate}
            className={`p-1.5 rounded-lg transition-all disabled:cursor-not-allowed disabled:opacity-40 ${isDark ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`}
         ><Settings2 size={18}/></button>
      </div>
    </header>
  );
}
