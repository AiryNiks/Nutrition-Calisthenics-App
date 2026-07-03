/// src/lib/recipeBuilder.ts
import type {
  CustomRecipe,
  FoodItem,
  MacroProfile,
  RecipeIngredient,
} from '../types';
import { getFoodById, scaleMacros, sumMacros } from '../data/nutritionDb';
import { uid } from './uid';

const ZERO: MacroProfile = {
  kcal: 0,
  proteinG: 0,
  carbsG: 0,
  fatG: 0,
  fiberG: 0,
};

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Total macros of all raw ingredients combined. Unknown foodIds contribute zero. */
export function computeRecipeTotals(
  ingredients: RecipeIngredient[],
): MacroProfile {
  const profiles = ingredients.map((ing) => {
    const food = getFoodById(ing.foodId);
    return food ? scaleMacros(food.per100, ing.quantity) : ZERO;
  });
  return sumMacros(profiles);
}

/** Sum of raw ingredient masses in grams/ml. */
export function rawMassG(ingredients: RecipeIngredient[]): number {
  return ingredients.reduce((acc, ing) => acc + ing.quantity, 0);
}

/**
 * Macros per 100 g of the finished dish. Gravies cook down, so yieldG is
 * usually below raw mass — caller supplies the measured cooked yield.
 */
export function computePer100(
  totals: MacroProfile,
  yieldG: number,
): MacroProfile {
  if (yieldG <= 0) return ZERO;
  const f = 100 / yieldG;
  return {
    kcal: Math.round(totals.kcal * f),
    proteinG: round1(totals.proteinG * f),
    carbsG: round1(totals.carbsG * f),
    fatG: round1(totals.fatG * f),
    fiberG: round1(totals.fiberG * f),
  };
}

/** Build a persistable CustomRecipe. yieldG defaults to raw ingredient mass. */
export function createRecipe(
  name: string,
  ingredients: RecipeIngredient[],
  yieldG?: number,
): CustomRecipe {
  const finalYield =
    yieldG !== undefined && yieldG > 0 ? yieldG : rawMassG(ingredients);
  return {
    id: uid('recipe'),
    name: name.trim(),
    ingredients: ingredients.map((ing) => ({ ...ing })),
    yieldG: finalYield,
    per100: computePer100(computeRecipeTotals(ingredients), finalYield),
    createdAtISO: new Date().toISOString(),
  };
}

/** Adapts a saved recipe into the FoodItem shape so it can flow through search/logging. */
export function recipeToFoodItem(recipe: CustomRecipe): FoodItem {
  return {
    id: recipe.id,
    name: recipe.name,
    brand: null,
    source: 'custom-recipe',
    platform: 'none',
    category: 'recipe-base',
    per100: recipe.per100,
    unit: 'g',
    servingLabel: '100 g',
    servingSize: 100,
    priceINR: null,
    packLabel: null,
    tags: ['custom', 'recipe'],
  };
}
