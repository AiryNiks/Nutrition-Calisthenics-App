/// src/components/workout/BodyweightTracker.tsx
import { useState } from 'react';
import { Scale } from 'lucide-react';
import { haptic } from '../../lib/haptics';
import {
  latestBodyweight,
  todayISO,
  useAppStore,
} from '../../store/appStore';
import { Sparkline } from '../ui/Sparkline';

export function BodyweightTracker() {
  const bodyweightLog = useAppStore((s) => s.bodyweightLog);
  const logBodyweight = useAppStore((s) => s.logBodyweight);

  const [input, setInput] = useState('');

  const latest = latestBodyweight(bodyweightLog);
  const recent = bodyweightLog.slice(-6).reverse();

  const save = () => {
    const weight = parseFloat(input);
    if (!Number.isFinite(weight) || weight < 30 || weight > 250) {
      haptic('warning');
      return;
    }
    logBodyweight({ dateISO: todayISO(), weightKg: weight });
    haptic('success');
    setInput('');
  };

  return (
    <div className="animate-slide-up rounded-sm border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800">
        <h3 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Scale size={12} strokeWidth={1.75} />
          Bodyweight Baseline
        </h3>
        {latest !== null && (
          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
            {latest} kg
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 px-3 py-2.5">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save();
          }}
          placeholder={latest !== null ? `Today (last: ${latest})` : 'kg today'}
          step={0.1}
          min={30}
          className="w-36 rounded-sm border border-slate-200 bg-transparent px-2 py-1 font-mono text-xs text-slate-700 placeholder:text-slate-400 dark:border-slate-800 dark:text-slate-200 dark:placeholder:text-slate-600"
        />
        <button
          type="button"
          onClick={save}
          className="pressable rounded-sm border border-emerald-400/70 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 transition-colors duration-200 ease-ios hover:bg-emerald-100 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
        >
          Log
        </button>
        <div className="ml-auto text-slate-400 dark:text-slate-500">
          <Sparkline
            data={bodyweightLog.map((b) => b.weightKg)}
            width={100}
            height={26}
            className="text-slate-400 dark:text-slate-500"
          />
        </div>
      </div>

      {recent.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-800">
          {recent.map((entry, i) => {
            const olderIndex = bodyweightLog.length - 1 - i - 1;
            const older =
              olderIndex >= 0 ? bodyweightLog[olderIndex] : undefined;
            const diff = older ? entry.weightKg - older.weightKg : null;
            return (
              <div
                key={entry.dateISO}
                className="flex items-center justify-between border-t border-slate-100 px-3 py-1 text-xs first:border-t-0 dark:border-slate-800/60"
              >
                <span className="font-mono text-slate-400 dark:text-slate-500">
                  {entry.dateISO}
                </span>
                <span className="font-mono text-slate-600 dark:text-slate-300">
                  {entry.weightKg} kg
                  {diff !== null && diff !== 0 && (
                    <span
                      className={`ml-2 ${
                        diff < 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {diff > 0 ? '+' : ''}
                      {diff.toFixed(1)}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
