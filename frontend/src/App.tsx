import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSimulations } from './hooks/useSimulations';
import { usePlayback } from './hooks/usePlayback';
import { useDataProcessor } from './hooks/useDataProcessor';
import { api } from './api/api';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { KPIGrid } from './components/dashboard/KPIGrid';
import { PowerChart } from './components/dashboard/PowerChart';
import { NodeGrid } from './components/dashboard/NodeGrid';
import { SimulationModal } from './components/dashboard/SimulationModal';
import type { SimulationDetails } from './types';
import { Loader2, Activity } from 'lucide-react';

export default function App() {
  const getStored = (key: string, fallback: any) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch (e) {
      console.error('Storage parse failed', e);
      return fallback;
    }
  };

  console.log('App Rendering...');

  // Logic Hooks
  const { simulations, loading: simulationsLoading, deleteSimulation, addSimulation, updateSimulationInList } = useSimulations();
  const { isPlaying, setIsPlaying, playbackTick, setPlaybackTick, playSpeed, setPlaybackSpeed, resetPlayback } = usePlayback();

  // Selected Simulation State
  const [selectedId, setSelectedId] = useState<string | null>(getStored('selectedId', null));
  const [details, setDetails] = useState<SimulationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Comparison State
  const [comparisonId, setComparisonId] = useState<string | null>(null);
  const [comparisonDetails, setComparisonDetails] = useState<SimulationDetails | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(getStored('isSidebarOpen', true));
  const [theme, setTheme] = useState<'light' | 'dark'>(getStored('theme', 'light'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [period, setPeriod] = useState('1d');
  const [offset, setOffset] = useState(0);
  const [selectedChargepoints, setSelectedChargepoints] = useState<number[]>([]);
  const [isCPDropdownOpen, setIsCPDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form State
  const [numCP, setNumCP] = useState(20);
  const [multiplier, setMultiplier] = useState(1.0);
  const [isProcessing, setIsProcessing] = useState(false);

  const resetModalState = () => {
    setError(null);
    setIsProcessing(false);
  };

  const openCreateModal = () => {
    resetModalState();
    setModalMode('create');
    setNumCP(20);
    setMultiplier(1.0);
    setIsModalOpen(true);
  };

  const openUpdateModal = () => {
    if (!selectedId || !details) {
      openCreateModal();
      return;
    }

    resetModalState();
    setModalMode('update');
    setNumCP(details.numChargepoints);
    setMultiplier(details.arrivalMultiplier);
    setIsModalOpen(true);
  };

  // Persistence
  useEffect(() => { localStorage.setItem('theme', JSON.stringify(theme)); }, [theme]);
  useEffect(() => { localStorage.setItem('isSidebarOpen', JSON.stringify(isSidebarOpen)); }, [isSidebarOpen]);
  useEffect(() => { localStorage.setItem('selectedId', JSON.stringify(selectedId)); }, [selectedId]);

  useEffect(() => {
    if (simulationsLoading) return;
    if (!selectedId) return;
    const selectedStillExists = simulations.some((simulation) => simulation.id === selectedId);
    if (selectedStillExists) return;

    setSelectedId(null);
    setDetails(null);
    setComparisonId((current) => (current === selectedId ? null : current));
    setError(null);
  }, [selectedId, simulations, simulationsLoading]);

  // Data Fetching
  useEffect(() => {
    if (selectedId) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const data = await api.getSimulationDetails(selectedId);
          setSelectedChargepoints(Array.from({ length: data.numChargepoints }, (_, i) => i));
          setDetails(data);
          resetPlayback();
          setOffset(0);
          setError(null);
        } catch (err) {
          setDetails(null);
          setSelectedId(null);
          setError('Failed to load simulation');
        } finally { setLoading(false); }
      };
      fetchDetails();
    } else {
      setDetails(null);
    }
  }, [selectedId, resetPlayback]);

  useEffect(() => {
    if (comparisonId) {
      const fetchComp = async () => {
        setIsComparing(true);
        try {
          const data = await api.getSimulationDetails(comparisonId);
          setComparisonDetails(data);
        } catch (err) { setComparisonId(null); } finally { setIsComparing(false); }
      };
      fetchComp();
    } else {
      setComparisonDetails(null);
    }
  }, [comparisonId]);

  // Use Data Processor Hook
  const { processedData, activeKPIs, compKPIs } = useDataProcessor({
    details,
    comparisonDetails,
    period,
    offset,
    selectedChargepoints
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (multiplier < 0.2 || multiplier > 2.0) return setError('Multiplier 0.2-2.0');
    setError(null);
    setIsProcessing(true);
    try {
      if (modalMode === 'create') {
        const result = await api.createSimulation({ numChargepoints: numCP, arrivalMultiplier: multiplier });
        addSimulation(result);
        setSelectedId(result.id);
      } else if (selectedId) {
        const result = await api.updateSimulation(selectedId, { numChargepoints: numCP, arrivalMultiplier: multiplier });
        updateSimulationInList(result);
        const freshDetails = await api.getSimulationDetails(result.id);
        setDetails(freshDetails);
      } else {
        setError('Select a simulation before updating');
        return;
      }
      setIsModalOpen(false);
    } catch (err) { setError('Operation failed'); } finally { setIsProcessing(false); }
  };

  const handleDelete = async (_: React.MouseEvent, id: string) => {
    const confirmed = window.confirm('Delete this simulation?');
    if (!confirmed) return;

    const deleted = await deleteSimulation(id);
    if (!deleted) {
      setError('Failed to delete simulation');
      return;
    }

    if (selectedId === id) {
      setSelectedId(null);
      setDetails(null);
    }

    if (comparisonId === id) {
      setComparisonId(null);
    }
  };

  const moveTimeline = (direction: 'prev' | 'next') => {
    if (period === '1y') return;
    const step = period === '1d' ? 96 : period === '1w' ? 96 * 7 : 96 * 30;
    const windowSize = period === '1d' ? 96 : period === '1w' ? 96 * 7 : 96 * 30;
    let newOffset = direction === 'next' ? offset + step : offset - step;
    if (newOffset < 0) newOffset = 0;
    if (newOffset + windowSize > 35040) newOffset = 35040 - windowSize;
    setOffset(newOffset);
  };

  const playbackTimeLabel = useMemo(() => {
    const minutes = playbackTick * 15;
    return `${Math.floor(minutes/60).toString().padStart(2,'0')}:${(minutes%60).toString().padStart(2,'0')}`;
  }, [playbackTick]);

  const currentTimeDisplay = useMemo(() => {
    const startDay = Math.floor(offset / 96) + 1;
    if (period === '1d') return `Day ${startDay}`;
    if (period === '1w') return `Days ${startDay} - ${Math.min(365, startDay + 6)}`;
    if (period === '1m') return `Days ${startDay} - ${Math.min(365, startDay + 29)}`;
    return "Full Year";
  }, [offset, period]);

  const activePlaybackData = useMemo(() => {
    if (!details) return [];
    const dayStart = Math.floor(offset / 96) * 96;
    const tickData = details.chargepointTicks[dayStart + playbackTick] as any;
    const v = tickData?.v || tickData?.values || (Array.isArray(tickData) ? tickData : []);
    return v.map((val: any) => Number(val) || 0);
  }, [details, offset, playbackTick]);

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 font-sans ${theme === 'dark' ? 'bg-[#09090b] text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-[60] bg-transparent"
        />
      )}

      <Sidebar 
        isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}
        theme={theme} setTheme={setTheme}
        simulations={simulations} selectedId={selectedId} setSelectedId={setSelectedId}
        comparisonId={comparisonId} setComparisonId={setComparisonId}
        handleDelete={handleDelete}
        openCreateModal={openCreateModal}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Header 
          isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}
          theme={theme} period={period} setPeriod={setPeriod} setOffset={setOffset}
          isCPDropdownOpen={isCPDropdownOpen} setIsCPDropdownOpen={setIsCPDropdownOpen}
          selectedChargepoints={selectedChargepoints} setSelectedChargepoints={setSelectedChargepoints}
          numCP={details?.numChargepoints || 0} moveTimeline={moveTimeline}
          currentTimeDisplay={currentTimeDisplay} openUpdateModal={openUpdateModal} canUpdate={Boolean(selectedId && details)}
          comparisonId={comparisonId} setComparisonId={setComparisonId} dropdownRef={dropdownRef}
        />

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar pb-32">
          {!details ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-4 opacity-60">
              {loading ? <Loader2 size={48} className="animate-spin" /> : <Activity size={48} strokeWidth={1.5} />}
              <p className="font-medium text-sm text-center">
                {loading ? 'Initializing Core...' : 'Engine protocol inactive. Select simulation.'}
              </p>
            </div>
          ) : (
            <>
              <KPIGrid 
                activeKPIs={activeKPIs} compKPIs={compKPIs} 
                numChargepoints={details.numChargepoints} 
                compChargepoints={comparisonDetails?.numChargepoints} 
                theme={theme}
              />

              <PowerChart 
                data={processedData} theme={theme} 
                loading={loading} isComparing={isComparing} period={period} 
              />

              <NodeGrid 
                playbackData={activePlaybackData} playbackTick={playbackTick} setPlaybackTick={setPlaybackTick}
                isPlaying={isPlaying} setIsPlaying={setIsPlaying} playSpeed={playSpeed} setPlaybackSpeed={setPlaybackSpeed}
                playbackTimeLabel={playbackTimeLabel} currentTimeDisplay={currentTimeDisplay} theme={theme}
              />
            </>
          )}
        </div>
      </main>

      <SimulationModal 
        isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetModalState(); }}
        onSubmit={handleSubmit} mode={modalMode} numCP={numCP} setNumCP={setNumCP}
        multiplier={multiplier} setMultiplier={setMultiplier}
        isProcessing={isProcessing} error={error} theme={theme}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; }
        input[type=\"range\"]::-webkit-slider-thumb { -webkit-appearance: none; height: 16px; width: 16px; border-radius: 50%; background: #18181b; cursor: pointer; border: 2px solid #fff; }
        .dark input[type=\"range\"]::-webkit-slider-thumb { background: #fff; border: 2px solid #18181b; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}
