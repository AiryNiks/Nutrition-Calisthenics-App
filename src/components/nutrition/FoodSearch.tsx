/// src/components/nutrition/FoodSearch.tsx
import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import {
  PLATFORM_LABELS,
  SOURCE_LABELS,
  getFoodById,
  scaleMacros,
  searchFoods,
} from '../../data/nutritionDb';
import { haptic } from '../../lib/haptics';
import { uid } from '../../lib/uid';
import { todayISO, useAppStore } from '../../store/appStore';
import type { FoodSource, MealSlot } from '../../types';
import { MEAL_SLOTS } from '../../types';

const SOURCE_FILTERS: (FoodSource | 'all')[] = [
  'all',
  'standard',
  'quick-commerce',
  'restaurant-base',
];

const MAX_RESULTS = 12;

export function FoodSearch() {
  const addLog = useAppStore((s) => s.addLog);

  const [query, setQuery] = useState('');
  const [source, setSource] = useState<FoodSource | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [qty, setQty] = useState('');
  const [slot, setSlot] = useState<MealSlot>('lunch');

  const results = useMemo(
    () => searchFoods(query, { source }).slice(0, MAX_RESULTS),
    [query, source],
  );

  const selectRow = (id: string) => {
    haptic('tap');
    if (selectedId === id) {
      setSelectedId(null);
      return;
    }
    const food = getFoodById(id);
    setSelectedId(id);
    setQty(food ? String(food.servingSize) : '100');
  };

  const logSelected = () => {
    if (!selectedId) return;
    const food = getFoodById(selectedId);
    if (!food) return;
    const quantity = parseFloat(qty);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      haptic('warning');
      return;
    }
    addLog({
      id: uid('log'),
      dateISO: todayISO(),
      foodId: food.id,
      foodName: food.name,
      quantity,
      unit: food.unit,
      macros: scaleMacros(food.per100, quantity),
      mealSlot: slot,
      loggedVia: 'search',
      createdAt: Date.now(),
    });
    haptic('success');
    setSelectedId(null);
  };

  return (
    <div className="animate-slide-up rounded-sm border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 px-3 py-2 dark:border-slate-800">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Food Database
        </h3>
      </div>

      <div className="space-y-2 px-3 py-2.5">
        <div className="flex items-center gap-2 rounded-sm border border-slate-200 px-2 py-1.5 transition-colors duration-200 ease-ios focus-within:border-emerald-400/70 dark:border-slate-800 dark:focus-within:border-emerald-500/50">
          <Search
            size={13}
            strokeWidth={1.75}
            className="shrink-0 text-slate-400 dark:text-slate-500"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: gokul, paneer, ragi, oats…"
            className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-600"
          />
        </div>

        <div className="flex flex-wrap gap-1">
          {SOURCE_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                haptic('tap');
                setSource(f);
              }}
              className={`pressable rounded-sm border px-2 py-0.5 text-[11px] font-medium transition-colors duration-200 ease-ios ${
                source === f
                  ? 'border-emerald-400/70 bg-emerald-50 text-emerald-700 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-400'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700'
              }`}
            >
              {f === 'all' ? 'All Sources' : SOURCE_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto border-t border-slate-200 scroll-thin dark:border-slate-800">
        {results.length === 0 && (
          <div className="px-3 py-4 text-center text-xs text-slate-400 dark:text-slate-500">
            No items match &ldquo;{query}&rdquo;.
          </div>
        )}
        {results.map((food) => (
          <div
            key={food.id}
            className="border-t border-slate-100 first:border-t-0 dark:border-slate-800/60"
          >
            <button
              type="button"
              onClick={() => selectRow(food.id)}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors duration-200 ease-ios hover:bg-slate-50 dark:hover:bg-slate-800/40"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">
                  {food.name}
                </p>
                <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">
                  {food.brand ?? 'Unbranded'}
                  {food.platform !== 'none' &&
                    ` · ${PLATFORM_LABELS[food.platform]}`}
                  {' · '}
                  {food.servingLabel}
                </p>
              </div>
              <div className="shrink-0 text-right font-mono text-[11px] text-slate-500 dark:text-slate-400">
                <span className="text-emerald-600 dark:text-emerald-400">
                  {scaleMacros(food.per100, food.servingSize).kcal} kc
                </span>
                <span className="mx-1 text-slate-300 dark:text-slate-700">|</span>
                <span className="text-rose-400 dark:text-rose-400/80">
                  {scaleMacros(food.per100, food.servingSize).proteinG}P
                </span>
              </div>
            </button>

            {selectedId === food.id && (
              <div className="flex animate-scale-in items-center gap-2 border-t border-dashed border-slate-200 bg-slate-50/60 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/30">
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  min={1}
                  className="w-20 rounded-sm border border-slate-200 bg-white px-2 py-1 font-mono text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {food.unit}
                </span>
                <select
                  value={slot}
                  onChange={(e) => setSlot(e.target.value as MealSlot)}
                  className="rounded-sm border border-slate-200 bg-white px-1.5 py-1 text-xs capitalize text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  {MEAL_SLOTS.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={logSelected}
                  className="pressable ml-auto flex items-center gap-1 rounded-sm border border-emerald-400/70 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 transition-colors duration-200 ease-ios hover:bg-emerald-100 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                >
                  <Plus size={12} strokeWidth={2} />
                  Log
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
