/// src/components/workout/SessionLogger.tsx
import { useState } from 'react';
import { Dumbbell, Plus, Save, Trash2 } from 'lucide-react';
import { haptic } from '../../lib/haptics';
import {
  EXERCISE_IDS,
  EXERCISE_LABELS,
  EXERCISE_VARIATIONS,
  setVolumeKg,
} from '../../lib/strengthMetrics';
import { uid } from '../../lib/uid';
import {
  latestBodyweight,
  todayISO,
  useAppStore,
} from '../../store/appStore';
import type { ExerciseId, ExerciseSet, ExerciseVariation } from '../../types';

export function SessionLogger() {
  const addSession = useAppStore((s) => s.addSession);
  const logBodyweight = useAppStore((s) => s.logBodyweight);
  const bodyweightLog = useAppStore((s) => s.bodyweightLog);

  const [bodyweight, setBodyweight] = useState(
    () => String(latestBodyweight(bodyweightLog) ?? 70),
  );
  const [drafts, setDrafts] = useState<ExerciseSet[]>([]);
  const [exerciseId, setExerciseId] = useState<ExerciseId>('pull-up');
  const [variation, setVariation] = useState<ExerciseVariation>('strict');
  const [reps, setReps] = useState('');
  const [addedWeight, setAddedWeight] = useState('');
  const [holdSeconds, setHoldSeconds] = useState('');
  const [rpe, setRpe] = useState('');

  const bw = parseFloat(bodyweight);
  const isHandstand = exerciseId === 'handstand';

  const changeExercise = (next: ExerciseId) => {
    setExerciseId(next);
    setVariation(EXERCISE_VARIATIONS[next][0]);
  };

  const addSet = () => {
    const repsNum = parseInt(reps, 10) || 0;
    const holdNum = parseInt(holdSeconds, 10) || 0;
    const addedNum = parseFloat(addedWeight) || 0;
    const rpeNum = parseFloat(rpe);

    if (repsNum <= 0 && holdNum <= 0) {
      haptic('warning');
      return;
    }

    haptic('tap');
    setDrafts((prev) => [
      ...prev,
      {
        id: uid('set'),
        exerciseId,
        variation,
        reps: repsNum,
        addedWeightKg: addedNum,
        holdSeconds: holdNum,
        rpe: Number.isFinite(rpeNum) ? rpeNum : null,
      },
    ]);
    setReps('');
    setHoldSeconds('');
  };

  const removeDraft = (id: string) => {
    haptic('tap');
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  const saveSession = () => {
    if (drafts.length === 0 || !Number.isFinite(bw) || bw < 30) {
      haptic('warning');
      return;
    }
    const date = todayISO();
    addSession({
      id: uid('session'),
      dateISO: date,
      bodyweightKg: bw,
      sets: drafts,
      notes: '',
      createdAt: Date.now(),
    });
    logBodyweight({ dateISO: date, weightKg: bw });
    haptic('success');
    setDrafts([]);
  };

  const inputClass =
    'rounded-sm border border-slate-200 bg-transparent px-2 py-1 font-mono text-xs text-slate-700 placeholder:text-slate-400 dark:border-slate-800 dark:text-slate-200 dark:placeholder:text-slate-600';

  return (
    <div className="animate-slide-up rounded-sm border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800">
        <h3 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Dumbbell size={12} strokeWidth={1.75} />
          Session Logger
        </h3>
        <label className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
          BW
          <input
            type="number"
            value={bodyweight}
            onChange={(e) => setBodyweight(e.target.value)}
            step={0.1}
            className="w-16 rounded-sm border border-slate-200 bg-transparent px-1.5 py-0.5 text-right font-mono text-xs text-slate-700 dark:border-slate-800 dark:text-slate-200"
          />
          kg
        </label>
      </div>

      <div className="space-y-2 px-3 py-2.5">
        <div className="flex flex-wrap gap-1">
          {EXERCISE_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                haptic('tap');
                changeExercise(id);
              }}
              className={`pressable rounded-sm border px-2 py-0.5 text-[11px] font-medium transition-colors duration-200 ease-ios ${
                exerciseId === id
                  ? 'border-emerald-400/70 bg-emerald-50 text-emerald-700 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-400'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700'
              }`}
            >
              {EXERCISE_LABELS[id]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <select
            value={variation}
            onChange={(e) => setVariation(e.target.value as ExerciseVariation)}
            className="rounded-sm border border-slate-200 bg-white px-1.5 py-1 text-xs capitalize text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            {EXERCISE_VARIATIONS[exerciseId].map((v) => (
              <option key={v} value={v} className="capitalize">
                {v}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="Reps"
            min={0}
            className={inputClass}
          />
          <input
            type="number"
            value={holdSeconds}
            onChange={(e) => setHoldSeconds(e.target.value)}
            placeholder={isHandstand ? 'Hold s' : 'Hold s (opt)'}
            min={0}
            className={inputClass}
          />
          <input
            type="number"
            value={addedWeight}
            onChange={(e) => setAddedWeight(e.target.value)}
            placeholder="+kg"
            min={0}
            step={0.5}
            className={inputClass}
          />
          <div className="flex gap-1">
            <input
              type="number"
              value={rpe}
              onChange={(e) => setRpe(e.target.value)}
              placeholder="RPE"
              min={1}
              max={10}
              step={0.5}
              className={`${inputClass} min-w-0 flex-1`}
            />
            <button
              type="button"
              onClick={addSet}
              title="Add set"
              className="pressable flex shrink-0 items-center justify-center rounded-sm border border-emerald-400/70 bg-emerald-50 px-2 text-emerald-700 transition-colors duration-200 ease-ios hover:bg-emerald-100 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
            >
              <Plus size={13} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {drafts.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-800">
          {drafts.map((d) => (
            <div
              key={d.id}
              className="flex animate-fade-in items-center gap-2 border-t border-slate-100 px-3 py-1.5 text-xs first:border-t-0 dark:border-slate-800/60"
            >
              <span className="min-w-0 flex-1 truncate text-slate-700 dark:text-slate-300">
                {EXERCISE_LABELS[d.exerciseId]}
                <span className="ml-1 text-[10px] capitalize text-slate-400 dark:text-slate-500">
                  {d.variation}
                </span>
              </span>
              <span className="font-mono text-slate-500 dark:text-slate-400">
                {d.reps > 0 ? `${d.reps} reps` : `${d.holdSeconds}s hold`}
                {d.addedWeightKg > 0 && ` +${d.addedWeightKg}kg`}
              </span>
              <span className="w-16 text-right font-mono text-[10px] text-slate-400 dark:text-slate-500">
                {Number.isFinite(bw) ? `${Math.round(setVolumeKg(d, bw))} kg·v` : '—'}
              </span>
              <button
                type="button"
                onClick={() => removeDraft(d.id)}
                title="Remove set"
                className="pressable p-0.5 text-slate-300 transition-colors duration-200 ease-ios hover:text-rose-400 dark:text-slate-600 dark:hover:text-rose-400"
              >
                <Trash2 size={11} strokeWidth={1.75} />
              </button>
            </div>
          ))}
          <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/40">
            <button
              type="button"
              onClick={saveSession}
              className="pressable flex items-center gap-1.5 rounded-sm border border-emerald-400/70 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 transition-colors duration-200 ease-ios hover:bg-emerald-100 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
            >
              <Save size={12} strokeWidth={2} />
              Save Session ({drafts.length} set{drafts.length === 1 ? '' : 's'})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
