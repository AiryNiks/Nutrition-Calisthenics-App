/// src/components/nutrition/RecipeBuilder.tsx
import { useMemo, useState } from 'react';
import { ChefHat, Plus, Trash2 } from 'lucide-react';
import { getFoodById, scaleMacros, searchFoods } from '../../data/nutritionDb';
import { haptic } from '../../lib/haptics';
import {
  computePer100,
  computeRecipeTotals,
  createRecipe,
  rawMassG,
} from '../../lib/recipeBuilder';
import { uid } from '../../lib/uid';
import { todayISO, useAppStore } from '../../store/appStore';
import type { RecipeIngredient } from '../../types';

const MAX_PICKER_RESULTS = 6;

export function RecipeBuilder() {
  const customRecipes = useAppStore((s) => s.customRecipes);
  const addRecipe = useAppStore((s) => s.addRecipe);
  const removeRecipe = useAppStore((s) => s.removeRecipe);
  const addLog = useAppStore((s) => s.addLog);

  const [name, setName] = useState('');
  const [yieldG, setYieldG] = useState('');
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [pickQuery, setPickQuery] = useState('');
  const [pickQty, setPickQty] = useState('100');
  const [logQty, setLogQty] = useState<Record<string, string>>({});

  const pickerResults = useMemo(
    () =>
      pickQuery.trim().length > 0
        ? searchFoods(pickQuery).slice(0, MAX_PICKER_RESULTS)
        : [],
    [pickQuery],
  );

  const totals = useMemo(() => computeRecipeTotals(ingredients), [ingredients]);
  const rawMass = rawMassG(ingredients);
  const yieldNum = parseFloat(yieldG);
  const effectiveYield =
    Number.isFinite(yieldNum) && yieldNum > 0 ? yieldNum : rawMass;
  const per100 = computePer100(totals, effectiveYield);

  const addIngredient = (foodId: string) => {
    const qty = parseFloat(pickQty);
    if (!Number.isFinite(qty) || qty <= 0) {
      haptic('warning');
      return;
    }
    haptic('tap');
    setIngredients((prev) => {
      const existing = prev.find((ing) => ing.foodId === foodId);
      if (existing) {
        return prev.map((ing) =>
          ing.foodId === foodId
            ? { ...ing, quantity: ing.quantity + qty }
            : ing,
        );
      }
      return [...prev, { foodId, quantity: qty }];
    });
    setPickQuery('');
  };

  const removeIngredient = (foodId: string) => {
    haptic('tap');
    setIngredients((prev) => prev.filter((ing) => ing.foodId !== foodId));
  };

  const saveRecipe = () => {
    if (name.trim().length === 0 || ingredients.length === 0) {
      haptic('warning');
      return;
    }
    const recipe = createRecipe(
      name,
      ingredients,
      Number.isFinite(yieldNum) && yieldNum > 0 ? yieldNum : undefined,
    );
    addRecipe(recipe);
    haptic('success');
    setName('');
    setYieldG('');
    setIngredients([]);
  };

  const logRecipe = (recipeId: string) => {
    const recipe = customRecipes.find((r) => r.id === recipeId);
    if (!recipe) return;
    const grams = parseFloat(logQty[recipeId] ?? '100');
    if (!Number.isFinite(grams) || grams <= 0) {
      haptic('warning');
      return;
    }
    addLog({
      id: uid('log'),
      dateISO: todayISO(),
      foodId: null,
      foodName: recipe.name,
      quantity: grams,
      unit: 'g',
      macros: scaleMacros(recipe.per100, grams),
      mealSlot: 'dinner',
      loggedVia: 'recipe',
      createdAt: Date.now(),
    });
    haptic('success');
  };

  return (
    <div className="animate-slide-up rounded-sm border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-1.5 border-b border-slate-200 px-3 py-2 dark:border-slate-800">
        <ChefHat
          size={12}
          strokeWidth={1.75}
          className="text-slate-500 dark:text-slate-400"
        />
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Custom Recipe Bases
        </h3>
      </div>

      <div className="space-y-2 px-3 py-2.5">
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Recipe name — e.g. Weeknight Makhani Gravy"
            className="min-w-0 flex-1 rounded-sm border border-slate-200 bg-transparent px-2 py-1 text-xs text-slate-700 placeholder:text-slate-400 dark:border-slate-800 dark:text-slate-200 dark:placeholder:text-slate-600"
          />
          <input
            type="number"
            value={yieldG}
            onChange={(e) => setYieldG(e.target.value)}
            placeholder={`Yield g (${rawMass || '—'})`}
            title="Cooked yield in grams — gravies reduce below raw mass"
            className="w-28 rounded-sm border border-slate-200 bg-transparent px-2 py-1 font-mono text-xs text-slate-700 placeholder:text-slate-400 dark:border-slate-800 dark:text-slate-200 dark:placeholder:text-slate-600"
          />
        </div>

        <div className="flex gap-2">
          <input
            value={pickQuery}
            onChange={(e) => setPickQuery(e.target.value)}
            placeholder="Add ingredient — search DB…"
            className="min-w-0 flex-1 rounded-sm border border-slate-200 bg-transparent px-2 py-1 text-xs text-slate-700 placeholder:text-slate-400 dark:border-slate-800 dark:text-slate-200 dark:placeholder:text-slate-600"
          />
          <input
            type="number"
            value={pickQty}
            onChange={(e) => setPickQty(e.target.value)}
            min={1}
            title="Quantity (g/ml) of the next ingredient added"
            className="w-20 rounded-sm border border-slate-200 bg-transparent px-2 py-1 font-mono text-xs text-slate-700 dark:border-slate-800 dark:text-slate-200"
          />
        </div>

        {pickerResults.length > 0 && (
          <div className="animate-scale-in rounded-sm border border-slate-200 dark:border-slate-800">
            {pickerResults.map((food) => (
              <button
                key={food.id}
                type="button"
                onClick={() => addIngredient(food.id)}
                className="flex w-full items-center justify-between border-t border-slate-100 px-2 py-1 text-left text-xs text-slate-600 transition-colors duration-200 ease-ios first:border-t-0 hover:bg-slate-50 dark:border-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800/40"
              >
                <span className="truncate">{food.name}</span>
                <Plus
                  size={11}
                  strokeWidth={2}
                  className="shrink-0 text-emerald-500 dark:text-emerald-400"
                />
              </button>
            ))}
          </div>
        )}

        {ingredients.length > 0 && (
          <div className="rounded-sm border border-slate-200 dark:border-slate-800">
            {ingredients.map((ing) => {
              const food = getFoodById(ing.foodId);
              return (
                <div
                  key={ing.foodId}
                  className="flex items-center gap-2 border-t border-slate-100 px-2 py-1 text-xs first:border-t-0 dark:border-slate-800/60"
                >
                  <span className="min-w-0 flex-1 truncate text-slate-700 dark:text-slate-300">
                    {food?.name ?? ing.foodId}
                  </span>
                  <span className="font-mono text-slate-400 dark:text-slate-500">
                    {ing.quantity} {food?.unit ?? 'g'}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeIngredient(ing.foodId)}
                    title="Remove ingredient"
                    className="pressable p-0.5 text-slate-300 transition-colors duration-200 ease-ios hover:text-rose-400 dark:text-slate-600 dark:hover:text-rose-400"
                  >
                    <Trash2 size={11} strokeWidth={1.75} />
                  </button>
                </div>
              );
            })}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-2 py-1.5 font-mono text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <span>
                per 100 g: {per100.kcal} kc · {per100.proteinG}P ·{' '}
                {per100.carbsG}C · {per100.fatG}F
              </span>
              <button
                type="button"
                onClick={saveRecipe}
                className="pressable rounded-sm border border-emerald-400/70 bg-emerald-50 px-2 py-0.5 font-sans text-[11px] font-medium text-emerald-700 transition-colors duration-200 ease-ios hover:bg-emerald-100 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
              >
                Save Recipe
              </button>
            </div>
          </div>
        )}
      </div>

      {customRecipes.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-800">
          <div className="bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-800/50 dark:text-slate-500">
            Saved Recipes
          </div>
          {customRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center gap-2 border-t border-slate-100 px-3 py-1.5 text-xs first:border-t-0 dark:border-slate-800/60"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-700 dark:text-slate-200">
                  {recipe.name}
                </p>
                <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                  {recipe.per100.kcal} kc · {recipe.per100.proteinG}P per 100 g
                  · yield {recipe.yieldG} g
                </p>
              </div>
              <input
                type="number"
                value={logQty[recipe.id] ?? '100'}
                onChange={(e) =>
                  setLogQty((prev) => ({ ...prev, [recipe.id]: e.target.value }))
                }
                min={1}
                className="w-16 rounded-sm border border-slate-200 bg-transparent px-1.5 py-0.5 font-mono text-[11px] text-slate-600 dark:border-slate-800 dark:text-slate-300"
              />
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                g
              </span>
              <button
                type="button"
                onClick={() => logRecipe(recipe.id)}
                className="pressable rounded-sm border border-emerald-400/70 px-2 py-0.5 text-[11px] font-medium text-emerald-700 transition-colors duration-200 ease-ios hover:bg-emerald-50 dark:border-emerald-500/50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
              >
                Log
              </button>
              <button
                type="button"
                onClick={() => {
                  haptic('warning');
                  removeRecipe(recipe.id);
                }}
                title="Delete recipe"
                className="pressable p-0.5 text-slate-300 transition-colors duration-200 ease-ios hover:text-rose-400 dark:text-slate-600 dark:hover:text-rose-400"
              >
                <Trash2 size={11} strokeWidth={1.75} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
