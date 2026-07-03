/// src/lib/strengthMetrics.ts
import type {
  ExerciseId,
  ExerciseMetrics,
  ExerciseProgress,
  ExerciseSet,
  ExerciseVariation,
  ProgressPoint,
  SessionMetrics,
  WorkoutSession,
} from '../types';

// ---------------------------------------------------------------------------
// Exercise metadata
// ---------------------------------------------------------------------------

export const EXERCISE_IDS: ExerciseId[] = [
  'pull-up',
  'dip',
  'push-up',
  'handstand',
];

export const EXERCISE_LABELS: Record<ExerciseId, string> = {
  'pull-up': 'Pull-ups',
  dip: 'Dips',
  'push-up': 'Push-ups',
  handstand: 'Handstand',
};

export const EXERCISE_VARIATIONS: Record<ExerciseId, ExerciseVariation[]> = {
  'pull-up': ['strict', 'weighted', 'archer', 'assisted'],
  dip: ['strict', 'weighted', 'assisted'],
  'push-up': ['strict', 'weighted', 'archer'],
  handstand: ['wall', 'freestanding', 'press'],
};

/**
 * Fraction of bodyweight actually moved per rep (biomechanical load factors,
 * standard estimates from force-plate studies).
 */
export const LOAD_FACTORS: Record<ExerciseId, number> = {
  'pull-up': 0.95,
  dip: 0.95,
  'push-up': 0.64,
  handstand: 0.9,
};

/** 5 s of isometric hold counts as one rep-equivalent. */
export const ISOMETRIC_SECONDS_PER_REP = 5;

/** Rolling window (# of prior sessions) for the volume baseline. */
export const BASELINE_WINDOW = 5;

// ---------------------------------------------------------------------------
// Per-set math
// ---------------------------------------------------------------------------

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function repEquivalents(s: ExerciseSet): number {
  return s.reps > 0 ? s.reps : s.holdSeconds / ISOMETRIC_SECONDS_PER_REP;
}

/** Absolute mechanical volume of one set, in kg moved. */
export function setVolumeKg(s: ExerciseSet, bodyweightKg: number): number {
  const load = LOAD_FACTORS[s.exerciseId] * bodyweightKg + s.addedWeightKg;
  return load * repEquivalents(s);
}

// ---------------------------------------------------------------------------
// Session metrics
//
// strengthToWeight = ((bodyweight + maxAddedWeight) / bodyweight) * volumeRatio
//
// volumeRatio is computed on rep-equivalents (bodyweight-independent), so a
// falling bodyweight with flat rep performance keeps volumeRatio ~1 while the
// intensity term (BW + added)/BW rises — the relative score correctly climbs
// as the athlete gets lighter at the same absolute output.
// ---------------------------------------------------------------------------

function sessionRepEquivalents(session: WorkoutSession): number {
  return session.sets.reduce((acc, s) => acc + repEquivalents(s), 0);
}

export function computeSessionMetrics(
  session: WorkoutSession,
  priorSessions: WorkoutSession[],
): SessionMetrics {
  const totalVolumeKg = session.sets.reduce(
    (acc, s) => acc + setVolumeKg(s, session.bodyweightKg),
    0,
  );

  const sessionReps = sessionRepEquivalents(session);
  const window = priorSessions.slice(-BASELINE_WINDOW);
  const baselineReps =
    window.length > 0
      ? window.reduce((acc, ps) => acc + sessionRepEquivalents(ps), 0) /
        window.length
      : 0;
  const volumeRatio = baselineReps > 0 ? sessionReps / baselineReps : 1;

  const maxAdded = session.sets.reduce(
    (m, s) => Math.max(m, s.addedWeightKg),
    0,
  );
  const strengthToWeight =
    ((session.bodyweightKg + maxAdded) / session.bodyweightKg) * volumeRatio;

  const perExercise: Partial<Record<ExerciseId, ExerciseMetrics>> = {};
  for (const s of session.sets) {
    const current: ExerciseMetrics = perExercise[s.exerciseId] ?? {
      exerciseId: s.exerciseId,
      volumeKg: 0,
      bestSet: null,
      peakRelativeIntensity: 0,
    };

    current.volumeKg = round1(
      current.volumeKg + setVolumeKg(s, session.bodyweightKg),
    );

    const rel =
      (session.bodyweightKg + s.addedWeightKg) / session.bodyweightKg;
    if (rel > current.peakRelativeIntensity) {
      current.peakRelativeIntensity = round2(rel);
    }

    const best = current.bestSet;
    if (
      best === null ||
      s.addedWeightKg > best.addedWeightKg ||
      (s.addedWeightKg === best.addedWeightKg &&
        repEquivalents(s) > repEquivalents(best))
    ) {
      current.bestSet = s;
    }

    perExercise[s.exerciseId] = current;
  }

  return {
    sessionId: session.id,
    dateISO: session.dateISO,
    bodyweightKg: session.bodyweightKg,
    totalVolumeKg: round1(totalVolumeKg),
    volumeRatio: round2(volumeRatio),
    strengthToWeight: round2(strengthToWeight),
    perExercise,
  };
}

// ---------------------------------------------------------------------------
// Series builders
// ---------------------------------------------------------------------------

function sortSessions(sessions: WorkoutSession[]): WorkoutSession[] {
  return [...sessions].sort(
    (a, b) => a.dateISO.localeCompare(b.dateISO) || a.createdAt - b.createdAt,
  );
}

/** Chronological SessionMetrics, each computed against its true prior baseline. */
export function buildSessionSeries(
  sessions: WorkoutSession[],
): SessionMetrics[] {
  const sorted = sortSessions(sessions);
  return sorted.map((session, i) =>
    computeSessionMetrics(session, sorted.slice(0, i)),
  );
}

/** Per-exercise progress points against a shifting bodyweight baseline. */
export function buildExerciseProgress(
  sessions: WorkoutSession[],
): ExerciseProgress[] {
  const sorted = sortSessions(sessions);
  const byExercise = new Map<ExerciseId, ProgressPoint[]>();
  const repHistory = new Map<ExerciseId, number[]>();

  for (const session of sorted) {
    const setsByExercise = new Map<ExerciseId, ExerciseSet[]>();
    for (const s of session.sets) {
      const arr = setsByExercise.get(s.exerciseId) ?? [];
      arr.push(s);
      setsByExercise.set(s.exerciseId, arr);
    }

    for (const [exerciseId, sets] of setsByExercise) {
      const reps = sets.reduce((acc, s) => acc + repEquivalents(s), 0);
      const history = repHistory.get(exerciseId) ?? [];
      const window = history.slice(-BASELINE_WINDOW);
      const baseline =
        window.length > 0
          ? window.reduce((a, b) => a + b, 0) / window.length
          : 0;
      const volumeRatio = baseline > 0 ? reps / baseline : 1;

      const maxAdded = sets.reduce((m, s) => Math.max(m, s.addedWeightKg), 0);
      const strengthToWeight = round2(
        ((session.bodyweightKg + maxAdded) / session.bodyweightKg) *
          volumeRatio,
      );
      const volumeKg = round1(
        sets.reduce((acc, s) => acc + setVolumeKg(s, session.bodyweightKg), 0),
      );
      const peakRelativeIntensity = round2(
        (session.bodyweightKg + maxAdded) / session.bodyweightKg,
      );

      const points = byExercise.get(exerciseId) ?? [];
      points.push({
        dateISO: session.dateISO,
        bodyweightKg: session.bodyweightKg,
        strengthToWeight,
        volumeKg,
        peakRelativeIntensity,
      });
      byExercise.set(exerciseId, points);

      history.push(reps);
      repHistory.set(exerciseId, history);
    }
  }

  return [...byExercise.entries()].map(([exerciseId, points]) => ({
    exerciseId,
    points,
  }));
}
