/// src/components/nutrition/MacroPanel.tsx
import { X } from 'lucide-react';
import { sumMacros } from '../../data/nutritionDb';
import { haptic } from '../../lib/haptics';
import { todayISO, useAppStore } from '../../store/appStore';
import type { LogEntry, MacroTargets, MealSlot } from '../../types';
import { MEAL_SLOTS } from '../../types';

type BarKey = keyof MacroTargets;

const BARS: { key: BarKey; label: string; unit: string; barClass: string }[] = [
  {
    key: 'kcal',
    label: 'Energy',
    unit: 'kcal',
    barClass: 'bg-emerald-400/90 dark:bg-emerald-500/70',
  },
  {
    key: 'proteinG',
    label: 'Protein',
    unit: 'g',
    barClass: 'bg-rose-300 dark:bg-rose-400/70',
  },
  {
    key: 'carbsG',
    label: 'Carbs',
    unit: 'g',
    barClass: 'bg-orange-300 dark:bg-orange-400/70',
  },
  {
    key: 'fatG',
    label: 'Fat',
    unit: 'g',
    barClass: 'bg-violet-300 dark:bg-violet-400/70',
  },
];

export function MacroPanel() {
  const logs = useAppStore((s) => s.logs);
  const targets = useAppStore((s) => s.targets);
  const setTargets = useAppStore((s) => s.setTargets);
  const removeLog = useAppStore((s) => s.removeLog);

  const date = todayISO();
  const dayLogs = logs.filter((l) => l.dateISO === date);
  const totals = sumMacros(dayLogs.map((l) => l.macros));

  const totalsByKey: Record<BarKey, number> = {
    kcal: totals.kcal,
    proteinG: totals.proteinG,
    carbsG: totals.carbsG,
    fatG: totals.fatG,
  };

  const bySlot = new Map<MealSlot, LogEntry[]>();
  for (const slot of MEAL_SLOTS) {
    const entries = dayLogs.filter((l) => l.mealSlot === slot);
    if (entries.length > 0) bySlot.set(slot, entries);
  }

  const updateTarget = (key: BarKey, raw: string) => {
    const value = parseInt(raw, 10);
    setTargets({ ...targets, [key]: Number.isFinite(value) ? value : 0 });
  };

  return (
    <div className="animate-slide-up rounded-sm border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Today&apos;s Macros
        </h3>
        <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
          {date}
        </span>
      </div>

      <div className="space-y-2.5 px-3 py-3">
        {BARS.map(({ key, label, unit, barClass }) => {
          const value = totalsByKey[key];
          const target = targets[key];
          const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
          return (
            <div key={key}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  {label}
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400">
                  {key === 'kcal' ? Math.round(value) : value}
                  <span className="text-slate-400 dark:text-slate-600"> / </span>
                  <input
                    type="number"
                    value={target}
                    onChange={(e) => updateTarget(key, e.target.value)}
                    className="w-14 rounded-sm border border-transparent bg-transparent text-right font-mono text-xs text-slate-500 transition-colors duration-200 ease-ios hover:border-slate-200 focus:border-slate-300 dark:text-slate-400 dark:hover:border-slate-800 dark:focus:border-slate-700"
                  />
                  <span className="ml-0.5 text-slate-400 dark:text-slate-600">
                    {unit}
                  </span>
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-sm bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full origin-left rounded-sm transition-transform duration-500 ease-ios ${barClass}`}
                  style={{ transform: `scaleX(${pct / 100})` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {bySlot.size > 0 && (
        <div className="max-h-56 overflow-y-auto border-t border-slate-200 scroll-thin dark:border-slate-800">
          {[...bySlot.entries()].map(([slot, entries]) => (
            <div key={slot}>
              <div className="bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-800/50 dark:text-slate-500">
                {slot}
              </div>
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-2 border-t border-slate-100 px-3 py-1.5 text-xs first:border-t-0 dark:border-slate-800/60"
                >
                  <span className="min-w-0 flex-1 truncate text-slate-700 dark:text-slate-300">
                    {entry.foodName}
                  </span>
                  <span className="font-mono text-slate-400 dark:text-slate-500">
                    {Math.round(entry.quantity)}
                    {entry.unit === 'serving' ? ' sv' : entry.unit}
                  </span>
                  <span className="w-14 text-right font-mono text-slate-600 dark:text-slate-400">
                    {entry.macros.kcal} kc
                  </span>
                  <span className="w-12 text-right font-mono text-rose-400 dark:text-rose-400/80">
                    {entry.macros.proteinG}P
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      haptic('warning');
                      removeLog(entry.id);
                    }}
                    title="Remove entry"
                    className="pressable rounded-sm p-0.5 text-slate-300 transition-colors duration-200 ease-ios hover:text-rose-400 dark:text-slate-600 dark:hover:text-rose-400"
                  >
                    <X size={12} strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {dayLogs.length === 0 && (
        <div className="border-t border-slate-200 px-3 py-4 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          Nothing logged today — search the database or paste an invoice below.
        </div>
      )}
    </div>
  );
}
