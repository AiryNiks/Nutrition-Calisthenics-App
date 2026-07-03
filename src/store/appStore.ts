/// src/store/appStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  BodyweightEntry,
  CustomRecipe,
  LogEntry,
  MacroTargets,
  WorkoutSession,
} from '../types';

interface AppState {
  logs: LogEntry[];
  sessions: WorkoutSession[];
  bodyweightLog: BodyweightEntry[];
  customRecipes: CustomRecipe[];
  targets: MacroTargets;

  addLog: (entry: LogEntry) => void;
  addLogs: (entries: LogEntry[]) => void;
  removeLog: (id: string) => void;

  addSession: (session: WorkoutSession) => void;
  removeSession: (id: string) => void;

  logBodyweight: (entry: BodyweightEntry) => void;

  addRecipe: (recipe: CustomRecipe) => void;
  removeRecipe: (id: string) => void;

  setTargets: (targets: MacroTargets) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      logs: [],
      sessions: [],
      bodyweightLog: [],
      customRecipes: [],
      targets: { kcal: 2400, proteinG: 150, carbsG: 260, fatG: 75 },

      addLog: (entry) => set((st) => ({ logs: [...st.logs, entry] })),
      addLogs: (entries) => set((st) => ({ logs: [...st.logs, ...entries] })),
      removeLog: (id) =>
        set((st) => ({ logs: st.logs.filter((l) => l.id !== id) })),

      addSession: (session) =>
        set((st) => ({ sessions: [...st.sessions, session] })),
      removeSession: (id) =>
        set((st) => ({ sessions: st.sessions.filter((s) => s.id !== id) })),

      logBodyweight: (entry) =>
        set((st) => ({
          bodyweightLog: [
            ...st.bodyweightLog.filter((b) => b.dateISO !== entry.dateISO),
            entry,
          ].sort((a, b) => a.dateISO.localeCompare(b.dateISO)),
        })),

      addRecipe: (recipe) =>
        set((st) => ({ customRecipes: [...st.customRecipes, recipe] })),
      removeRecipe: (id) =>
        set((st) => ({
          customRecipes: st.customRecipes.filter((r) => r.id !== id),
        })),

      setTargets: (targets) => set({ targets }),
    }),
    { name: 'nc-store', version: 1 },
  ),
);

// ---------------------------------------------------------------------------
// Date + selector helpers
// ---------------------------------------------------------------------------

export function todayISO(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function latestBodyweight(log: BodyweightEntry[]): number | null {
  return log.length > 0 ? log[log.length - 1].weightKg : null;
}
