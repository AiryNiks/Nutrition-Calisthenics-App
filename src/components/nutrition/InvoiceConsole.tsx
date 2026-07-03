/// src/components/nutrition/InvoiceConsole.tsx
import { useState } from 'react';
import { Receipt, ScanLine } from 'lucide-react';
import { haptic } from '../../lib/haptics';
import {
  invoiceLinesToLogEntries,
  parseInvoice,
} from '../../lib/invoiceParser';
import { todayISO, useAppStore } from '../../store/appStore';
import type { MealSlot, ParsedInvoice } from '../../types';
import { MEAL_SLOTS } from '../../types';

const CONFIDENCE_THRESHOLD = 0.3;

const PLACEHOLDER = `Paste a Blinkit / Zepto invoice or receipt text…

Example:
Blinkit order #12345
Gokul Full Cream Milk 500 ml x 1  ₹34
Blinkit Rolled Oats 1 kg  ₹120
Farmers Market Spinach 250 g  ₹30
Delivery charge ₹0
Total ₹184

JSON also works: {"items":[{"name":"Paneer","quantity":150,"unit":"g"}]}`;

export function InvoiceConsole() {
  const addLogs = useAppStore((s) => s.addLogs);

  const [raw, setRaw] = useState('');
  const [parsed, setParsed] = useState<ParsedInvoice | null>(null);
  const [included, setIncluded] = useState<Record<number, boolean>>({});
  const [slot, setSlot] = useState<MealSlot>('lunch');

  const runParse = () => {
    haptic('tap');
    if (raw.trim().length === 0) {
      haptic('warning');
      return;
    }
    const result = parseInvoice(raw);
    const initial: Record<number, boolean> = {};
    result.lines.forEach((line, i) => {
      initial[i] =
        line.matchedFoodId !== null && line.confidence >= CONFIDENCE_THRESHOLD;
    });
    setParsed(result);
    setIncluded(initial);
  };

  const logSelected = () => {
    if (!parsed) return;
    const lines = parsed.lines.filter((_, i) => included[i]);
    const entries = invoiceLinesToLogEntries(lines, todayISO(), slot);
    if (entries.length === 0) {
      haptic('warning');
      return;
    }
    addLogs(entries);
    haptic('success');
    setRaw('');
    setParsed(null);
    setIncluded({});
  };

  const selectedCount = parsed
    ? parsed.lines.filter((_, i) => included[i]).length
    : 0;

  return (
    <div className="animate-slide-up rounded-sm border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800">
        <h3 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Receipt size={12} strokeWidth={1.75} />
          Invoice Parsing Console
        </h3>
        {parsed && (
          <span className="font-mono text-[10px] uppercase text-slate-400 dark:text-slate-500">
            src: {parsed.platform}
          </span>
        )}
      </div>

      <div className="space-y-2 px-3 py-2.5">
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={5}
          className="w-full resize-y rounded-sm border border-slate-200 bg-slate-50/50 px-2 py-1.5 font-mono text-[11px] leading-relaxed text-slate-700 placeholder:text-slate-400 scroll-thin dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-300 dark:placeholder:text-slate-600"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={runParse}
            className="pressable flex items-center gap-1.5 rounded-sm border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors duration-200 ease-ios hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <ScanLine size={12} strokeWidth={2} />
            Parse
          </button>
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
          {parsed && (
            <button
              type="button"
              onClick={logSelected}
              disabled={selectedCount === 0}
              className="pressable ml-auto rounded-sm border border-emerald-400/70 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 transition-colors duration-200 ease-ios hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
            >
              Log {selectedCount} item{selectedCount === 1 ? '' : 's'}
            </button>
          )}
        </div>
      </div>

      {parsed && (
        <div className="max-h-56 overflow-y-auto border-t border-slate-200 scroll-thin dark:border-slate-800">
          {parsed.lines.length === 0 && (
            <div className="px-3 py-4 text-center text-xs text-slate-400 dark:text-slate-500">
              No line items detected in the pasted text.
            </div>
          )}
          {parsed.lines.map((line, i) => {
            const matched = line.matchedFoodId !== null;
            return (
              <label
                key={`${i}-${line.rawText}`}
                className={`flex animate-fade-in cursor-pointer items-center gap-2 border-t border-slate-100 px-3 py-1.5 text-xs transition-colors duration-200 ease-ios first:border-t-0 hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/40 ${
                  matched ? '' : 'opacity-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={included[i] ?? false}
                  disabled={!matched}
                  onChange={(e) => {
                    haptic('tap');
                    setIncluded((prev) => ({ ...prev, [i]: e.target.checked }));
                  }}
                  className="h-3 w-3 accent-emerald-500"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-slate-700 dark:text-slate-300">
                    {matched ? line.matchedFoodName : line.rawText}
                  </p>
                  {matched && (
                    <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">
                      from: {line.rawText}
                    </p>
                  )}
                </div>
                <span className="shrink-0 font-mono text-slate-500 dark:text-slate-400">
                  {line.quantity}
                  {line.unit === 'serving' ? ' sv' : ` ${line.unit}`}
                </span>
                <span
                  className={`w-10 shrink-0 text-right font-mono text-[10px] ${
                    line.confidence >= 0.6
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : line.confidence >= CONFIDENCE_THRESHOLD
                        ? 'text-amber-500 dark:text-amber-400'
                        : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {Math.round(line.confidence * 100)}%
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
