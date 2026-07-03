/// src/types.ts

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

// ---------------------------------------------------------------------------
// Nutrition
// ---------------------------------------------------------------------------

/** All macro values are grams except kcal. */
export interface MacroProfile {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
}

export type FoodSource =
  | 'standard' // generic/loose market items, IFCT-style baseline data
  | 'quick-commerce' // Blinkit / Zepto / Instamart SKUs
  | 'restaurant-base' // prep bases: gravies, marinades, chutneys
  | 'custom-recipe'; // user-composed via RecipeBuilder

export type QuickCommercePlatform =
  | 'blinkit'
  | 'zepto'
  | 'instamart'
  | 'bigbasket'
  | 'none';

export type FoodCategory =
  | 'dairy'
  | 'grains-flours'
  | 'protein'
  | 'produce'
  | 'pantry'
  | 'bakery'
  | 'recipe-base'
  | 'supplement';

export interface FoodItem {
  id: string;
  name: string;
  /** null for unbranded/loose items */
  brand: string | null;
  source: FoodSource;
  platform: QuickCommercePlatform;
  category: FoodCategory;
  /** Macros per 100 g (solids) or 100 ml (liquids). */
  per100: MacroProfile;
  unit: 'g' | 'ml';
  /** Human-readable default serving, e.g. "1 glass (250 ml)". */
  servingLabel: string;
  /** Default serving size in `unit`. */
  servingSize: number;
  /** Typical Mumbai quick-commerce price for `packLabel`, in INR. null if variable. */
  priceINR: number | null;
  packLabel: string | null;
  tags: string[];
}

export type MealSlot =
  | 'breakfast'
  | 'lunch'
  | 'snack'
  | 'dinner'
  | 'pre-workout'
  | 'post-workout';

export const MEAL_SLOTS: MealSlot[] = [
  'breakfast',
  'lunch',
  'snack',
  'dinner',
  'pre-workout',
  'post-workout',
];

export type LogMethod = 'search' | 'invoice' | 'recipe' | 'manual';

export interface LogEntry {
  id: string;
  /** ISO date string, e.g. "2026-07-03" */
  dateISO: string;
  /** null when logged from a custom recipe or manual entry */
  foodId: string | null;
  foodName: string;
  quantity: number;
  unit: 'g' | 'ml' | 'serving';
  /** Resolved macros for the logged quantity (not per-100). */
  macros: MacroProfile;
  mealSlot: MealSlot;
  loggedVia: LogMethod;
  createdAt: number; // epoch ms, for stable ordering within a day
}

export interface MacroTargets {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

// ---------------------------------------------------------------------------
// Custom recipes (Makhani gravies, hung-curd marinades, etc.)
// ---------------------------------------------------------------------------

export interface RecipeIngredient {
  foodId: string;
  /** Quantity in the ingredient's own unit (g or ml). */
  quantity: number;
}

export interface CustomRecipe {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  /** Cooked yield in grams; per100 is derived from this. */
  yieldG: number;
  /** Derived macros per 100 g of finished recipe. */
  per100: MacroProfile;
  createdAtISO: string;
}

// ---------------------------------------------------------------------------
// Invoice / receipt parsing adapters
// ---------------------------------------------------------------------------

export interface ParsedInvoiceLine {
  rawText: string;
  matchedFoodId: string | null;
  matchedFoodName: string | null;
  quantity: number;
  unit: 'g' | 'ml' | 'serving';
  /** 0..1 match confidence from the fuzzy matcher. */
  confidence: number;
}

export interface ParsedInvoice {
  platform: QuickCommercePlatform;
  lines: ParsedInvoiceLine[];
  parsedAtISO: string;
}

/** Adapter contract: each platform (Blinkit, Zepto, JSON payloads…) implements this. */
export interface InvoiceAdapter {
  platform: QuickCommercePlatform;
  /** Returns true if this adapter recognizes the raw payload format. */
  detect(raw: string): boolean;
  /** Parses raw invoice text/JSON into candidate lines. Never throws; returns [] on failure. */
  parse(raw: string): ParsedInvoiceLine[];
}

// ---------------------------------------------------------------------------
// Calisthenics
// ---------------------------------------------------------------------------

export type ExerciseId = 'pull-up' | 'dip' | 'push-up' | 'handstand';

export type ExerciseVariation =
  | 'strict'
  | 'weighted'
  | 'archer'
  | 'assisted'
  | 'wall' // handstand
  | 'freestanding' // handstand
  | 'press'; // handstand press / HSPU

export interface ExerciseSet {
  id: string;
  exerciseId: ExerciseId;
  variation: ExerciseVariation;
  /** Reps for dynamic movements; 0 for pure isometric holds. */
  reps: number;
  /** External load in kg (vest/belt); 0 for bodyweight-only. */
  addedWeightKg: number;
  /** Hold duration in seconds; 0 for dynamic sets. Used for handstands. */
  holdSeconds: number;
  /** Rate of perceived exertion 1-10; null if not recorded. */
  rpe: number | null;
}

export interface WorkoutSession {
  id: string;
  dateISO: string;
  /** Bodyweight at session time — the shifting baseline for all relative metrics. */
  bodyweightKg: number;
  sets: ExerciseSet[];
  notes: string;
  createdAt: number;
}

export interface BodyweightEntry {
  dateISO: string;
  weightKg: number;
}

/**
 * Per-session relative-strength telemetry.
 * strengthToWeight = ((bodyweight + addedWeight) / bodyweight) * volumeRatio
 * where volumeRatio normalizes session volume against the rolling baseline volume.
 */
export interface SessionMetrics {
  sessionId: string;
  dateISO: string;
  bodyweightKg: number;
  /** Sum over sets of (bodyweightFactor * bodyweight + addedWeight) * reps, in kg. */
  totalVolumeKg: number;
  /** Session volume / rolling mean volume of prior sessions (1.0 = at baseline). */
  volumeRatio: number;
  /** The headline relative-strength score for the session. */
  strengthToWeight: number;
  perExercise: Partial<Record<ExerciseId, ExerciseMetrics>>;
}

export interface ExerciseMetrics {
  exerciseId: ExerciseId;
  volumeKg: number;
  bestSet: ExerciseSet | null;
  /** (bodyweight + best added weight) / bodyweight — max relative intensity hit. */
  peakRelativeIntensity: number;
}

export interface ProgressPoint {
  dateISO: string;
  bodyweightKg: number;
  strengthToWeight: number;
  volumeKg: number;
  peakRelativeIntensity: number;
}

export interface ExerciseProgress {
  exerciseId: ExerciseId;
  points: ProgressPoint[];
}

// ---------------------------------------------------------------------------
// Haptics
// ---------------------------------------------------------------------------

export type HapticPattern = 'tap' | 'success' | 'warning' | 'heavy';
