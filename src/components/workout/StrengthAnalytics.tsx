/// src/components/workout/StrengthAnalytics.tsx
import { useMemo } from 'react';
import { Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { haptic } from '../../lib/haptics';
import {
  EXERCISE_LABELS,
  buildExerciseProgress,
  buildSessionSeries,
} from '../../lib/strengthMetrics';
import { useAppStore } from '../../store/appStore';
import { Sparkline } from '../ui/Sparkline';

export function StrengthAnalytics() {
  const sessions = useAppStore((s) => s.sessions);
  const removeSession = useAppStore((s) => s.removeSession);

  const series = useMemo(() => buildSessionSeries(sessions), [sessions]);
  const exerciseProgress = useMemo(
    () => buildExerciseProgress(sessions),
    [sessions],
  );

  const latest = series.length > 0 ? series[series.length - 1] : null;
  const previous = series.length > 1 ? series[series.length - 2] : null;

  if (!latest) {
    return (
      <div className="animate-slide-up rounded-sm border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-3 py-2 dark:border-slate-800">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Relative Strength Telemetry
          </h3>
        </div>
        <div className="px-3 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
          Log your first session above — the strength-to-weight engine starts
          tracking from session one.
        </div>
      </div>
    );
  }

  const delta = previous
    ? latest.strengthToWeight - previous.strengthToWeight
    : 0;
  const deltaPct =
    previous && previous.strengthToWeight > 0
      ? (delta / previous.strengthToWeight) * 100
      : 0;
  const DeltaIcon = delta >= 0 ? TrendingUp : TrendingDown;

  const sparkGroups: { label: string; data: number[]; colorClass: string }[] = [
    {
      label: 'S2W Score',
      data: series.map((m) => m.strengthToWeight),
      colorClass: 'text-emerald-500 dark:text-emerald-400',
    },
    {
      label: 'Volume (kg)',
      data: series.map((m) => m.totalVolumeKg),
      colorClass: 'text-orange-400 dark:text-orange-300',
    },
    {
      label: 'Bodyweight',
      data: series.map((m) => m.bodyweightKg),
      colorClass: 'text-slate-400 dark:text-slate-500',
    },
  ];

  return (
    <div className="animate-slide-up rounded-sm border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Relative Strength Telemetry
        </h3>
        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
          {series.length} session{series.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 sm:grid-cols-4">
        <div className="bg-white px-3 py-2 dark:bg-slate-900">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            S2W Score
          </p>
          <p className="font-mono text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            {latest.strengthToWeight.toFixed(2)}
          </p>
          {previous && (
            <p
              className={`flex items-center gap-0.5 font-mono text-[10px] ${
                delta >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              <DeltaIcon size={10} strokeWidth={2} />
              {deltaPct >= 0 ? '+' : ''}
              {deltaPct.toFixed(1)}%
            </p>
          )}
        </div>
        <div className="bg-white px-3 py-2 dark:bg-slate-900">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Volume
          </p>
          <p className="font-mono text-lg font-semibold text-slate-700 dark:text-slate-200">
            {Math.round(latest.totalVolumeKg)}
          </p>
          <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
            kg moved
          </p>
        </div>
        <div className="bg-white px-3 py-2 dark:bg-slate-900">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Vol. Ratio
          </p>
          <p className="font-mono text-lg font-semibold text-slate-700 dark:text-slate-200">
            {latest.volumeRatio.toFixed(2)}
          </p>
          <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
            vs baseline
          </p>
        </div>
        <div className="bg-white px-3 py-2 dark:bg-slate-900">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Bodyweight
          </p>
          <p className="font-mono text-lg font-semibold text-slate-700 dark:text-slate-200">
            {latest.bodyweightKg}
          </p>
          <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
            kg baseline
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-px border-t border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800">
        {sparkGroups.map(({ label, data, colorClass }) => (
          <div key={label} className="bg-white px-3 py-2 dark:bg-slate-900">
            <p className="mb-1 text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {label}
            </p>
            <Sparkline data={data} width={110} height={28} className={colorClass} />
          </div>
        ))}
      </div>

      {exerciseProgress.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-800/50 dark:text-slate-500">
            <span>Exercise</span>
            <span className="text-right">Vol kg</span>
            <span className="text-right">Peak ×BW</span>
            <span className="text-right">S2W Trend</span>
          </div>
          {exerciseProgress.map(({ exerciseId, points }) => {
            const last = points[points.length - 1];
            return (
              <div
                key={exerciseId}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 border-t border-slate-100 px-3 py-1.5 text-xs dark:border-slate-800/60"
              >
                <span className="truncate text-slate-700 dark:text-slate-300">
                  {EXERCISE_LABELS[exerciseId]}
                </span>
                <span className="text-right font-mono text-slate-500 dark:text-slate-400">
                  {Math.round(last.volumeKg)}
                </span>
                <span className="text-right font-mono text-rose-400 dark:text-rose-400/80">
                  {last.peakRelativeIntensity.toFixed(2)}
                </span>
                <Sparkline
                  data={points.map((p) => p.strengthToWeight)}
                  width={72}
                  height={20}
                  className="justify-self-end text-emerald-500 dark:text-emerald-400"
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="max-h-40 overflow-y-auto border-t border-slate-200 scroll-thin dark:border-slate-800">
        <div className="bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-800/50 dark:text-slate-500">
          Session History
        </div>
        {[...series].reverse().map((m) => (
          <div
            key={m.sessionId}
            className="flex items-center gap-2 border-t border-slate-100 px-3 py-1.5 text-xs first:border-t-0 dark:border-slate-800/60"
          >
            <span className="font-mono text-slate-400 dark:text-slate-500">
              {m.dateISO}
            </span>
            <span className="ml-auto font-mono text-emerald-600 dark:text-emerald-400">
              S2W {m.strengthToWeight.toFixed(2)}
            </span>
            <span className="font-mono text-slate-500 dark:text-slate-400">
              {Math.round(m.totalVolumeKg)} kg
            </span>
            <button
              type="button"
              onClick={() => {
                haptic('warning');
                removeSession(m.sessionId);
              }}
              title="Delete session"
              className="pressable p-0.5 text-slate-300 transition-colors duration-200 ease-ios hover:text-rose-400 dark:text-slate-600 dark:hover:text-rose-400"
            >
              <Trash2 size={11} strokeWidth={1.75} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
