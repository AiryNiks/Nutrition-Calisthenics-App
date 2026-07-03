/// src/components/ui/ThemeToggle.tsx
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { haptic } from '../../lib/haptics';
import type { Theme } from '../../types';

const ORDER: Theme[] = ['light', 'dark', 'system'];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <button
      type="button"
      onClick={() => {
        haptic('tap');
        setTheme(next);
      }}
      title={`Theme: ${theme} — click for ${next}`}
      className="pressable flex items-center gap-1.5 rounded-sm border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors duration-200 ease-ios hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700"
    >
      <Icon size={14} strokeWidth={1.75} />
      <span className="capitalize">{theme}</span>
    </button>
  );
}
