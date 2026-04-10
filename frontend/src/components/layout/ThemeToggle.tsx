import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  return (
    <button 
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all ${
        theme === 'dark' ? 'bg-zinc-800 text-zinc-400 hover:text-zinc-300' : 'bg-zinc-100 text-zinc-500 hover:text-zinc-700'
      }`}
    >
      <div className="flex items-center gap-2.5 font-medium text-xs">
        {theme === 'light' ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-blue-400" />}
        <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
      </div>
      <div className={`w-7 h-4 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-emerald-500' : 'bg-zinc-300'}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${theme === 'dark' ? 'left-3.5' : 'left-0.5'}`} />
      </div>
    </button>
  );
}