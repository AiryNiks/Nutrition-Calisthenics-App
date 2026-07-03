/// src/components/Dashboard.tsx
import { Activity, UtensilsCrossed } from 'lucide-react';
import { FoodSearch } from './nutrition/FoodSearch';
import { InvoiceConsole } from './nutrition/InvoiceConsole';
import { MacroPanel } from './nutrition/MacroPanel';
import { RecipeBuilder } from './nutrition/RecipeBuilder';
import { ThemeToggle } from './ui/ThemeToggle';
import { BodyweightTracker } from './workout/BodyweightTracker';
import { SessionLogger } from './workout/SessionLogger';
import { StrengthAnalytics } from './workout/StrengthAnalytics';

export function Dashboard() {
  return (
    <div className="mx-auto min-h-screen max-w-7xl px-3 py-4 sm:px-5">
      <header className="mb-4 flex animate-fade-in items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
            Mumbai · Local-first · Quick-commerce aware
          </p>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Nutrition &amp; Calisthenics Console
          </h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <section className="min-w-0 space-y-3">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <UtensilsCrossed size={13} strokeWidth={1.75} />
            <h2 className="text-[11px] font-semibold uppercase tracking-wider">
              Nutrition
            </h2>
          </div>
          <MacroPanel />
          <FoodSearch />
          <InvoiceConsole />
          <RecipeBuilder />
        </section>

        <section className="min-w-0 space-y-3">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Activity size={13} strokeWidth={1.75} />
            <h2 className="text-[11px] font-semibold uppercase tracking-wider">
              Calisthenics
            </h2>
          </div>
          <SessionLogger />
          <StrengthAnalytics />
          <BodyweightTracker />
        </section>
      </main>

      <footer className="mt-6 border-t border-slate-200 pt-3 text-center text-[10px] text-slate-400 dark:border-slate-800 dark:text-slate-600">
        All data lives in your browser (localStorage) — nothing leaves this
        device.
      </footer>
    </div>
  );
}
