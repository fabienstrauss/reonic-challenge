import { Activity, Play, Pause } from 'lucide-react';

interface NodeGridProps {
  playbackData: number[];
  playbackTick: number;
  setPlaybackTick: (tick: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  playSpeed: number;
  setPlaybackSpeed: (speed: any) => void;
  playbackTimeLabel: string;
  currentTimeDisplay: string;
  theme: 'light' | 'dark';
}

export function NodeGrid({ 
  playbackData, 
  playbackTick, 
  setPlaybackTick, 
  isPlaying, 
  setIsPlaying, 
  playSpeed, 
  setPlaybackSpeed, 
  playbackTimeLabel, 
  currentTimeDisplay,
  theme 
}: NodeGridProps) {
  const isDark = theme === 'dark';

  return (
    <div className={`p-8 rounded-3xl border transition-all ${
      isDark ? 'bg-[#121214] border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 px-2">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
            <Activity className="text-emerald-500" size={24}/>
          </div>
          <div>
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Node Grid</h3>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Active Engine Playback</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
            <span className="text-xs font-bold text-zinc-400 uppercase">Load</span>
            <span className="text-lg font-black text-emerald-500">
              {playbackData.reduce((a, b) => a + b, 0).toFixed(1)} <small className="text-[10px]">kW</small>
            </span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
            <span className="text-xs font-bold text-zinc-400 uppercase">Active</span>
            <span className="text-lg font-black text-blue-500">{playbackData.filter(v => v > 0).length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-3 mb-12">
        {playbackData.map((p, idx) => (
          <div key={idx} className="group relative flex flex-col items-center gap-2">
            <div className={`w-full aspect-square rounded-xl border-2 transition-all duration-500 flex items-center justify-center relative overflow-hidden ${p > 0 ? (isDark ? 'border-emerald-500 bg-emerald-500/10' : 'border-emerald-500 bg-emerald-50') : (isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-200 bg-zinc-100')}`}>
              {p > 0 && <div className="absolute inset-0 bg-emerald-500 animate-pulse opacity-20" />}
              <span className={`text-[10px] font-black z-10 ${p > 0 ? 'text-emerald-500' : (isDark ? 'text-zinc-600' : 'text-zinc-400')}`}>{idx + 1}</span>
            </div>
            <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform z-20 bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap">{p.toFixed(1)} kW</div>
          </div>
        ))}
      </div>

      <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)} 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isDark ? 'bg-zinc-100 text-zinc-900 hover:bg-white' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
              >
                {isPlaying ? <Pause size={20} fill="currentColor"/> : <Play size={20} fill="currentColor" className="ml-1"/>}
              </button>
              <div className={`flex p-1 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                {[1, 4, 16].map(s => (
                  <button 
                    key={s} 
                    onClick={() => setPlaybackSpeed(s)} 
                    className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${playSpeed === s ? (isDark ? 'bg-zinc-700 text-white' : 'bg-white text-zinc-900 shadow-sm') : 'text-zinc-500 hover:text-zinc-700'}`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-2xl font-black tabular-nums tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>{playbackTimeLabel}</span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{currentTimeDisplay}</span>
            </div>
          </div>
          <input 
            type="range" min="0" max="95" value={playbackTick} 
            onChange={e => { setPlaybackTick(parseInt(e.target.value)); setIsPlaying(false); }} 
            className={`w-full h-2 rounded-full appearance-none cursor-pointer accent-emerald-500 ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} 
          />
        </div>
      </div>
    </div>
  );
}
