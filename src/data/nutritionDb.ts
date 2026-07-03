/// src/data/nutritionDb.ts
import type {
  FoodCategory,
  FoodItem,
  FoodSource,
  MacroProfile,
  QuickCommercePlatform,
} from '../types';

// ---------------------------------------------------------------------------
// Seed dataset — Mumbai dairy lines, quick-commerce staples, and prep bases.
// Macro values are per 100 g / 100 ml, sourced from pack labels and
// IFCT-2017 baseline data for loose/unbranded items.
// ---------------------------------------------------------------------------

export const NUTRITION_DB: FoodItem[] = [
  // --- Local dairy & essentials -------------------------------------------
  {
    id: 'gokul-full-cream-milk',
    name: 'Gokul Full Cream Milk (Red Pack)',
    brand: 'Gokul',
    source: 'standard',
    platform: 'none',
    category: 'dairy',
    per100: { kcal: 89, proteinG: 3.2, carbsG: 5.0, fatG: 6.0, fiberG: 0 },
    unit: 'ml',
    servingLabel: '1 glass (250 ml)',
    servingSize: 250,
    priceINR: 34,
    packLabel: '500 ml pouch',
    tags: ['milk', 'full cream', 'buffalo', 'kolhapur'],
  },
  {
    id: 'gokul-toned-milk',
    name: 'Gokul Toned Milk (Blue Pack)',
    brand: 'Gokul',
    source: 'standard',
    platform: 'none',
    category: 'dairy',
    per100: { kcal: 58, proteinG: 3.1, carbsG: 4.8, fatG: 3.0, fiberG: 0 },
    unit: 'ml',
    servingLabel: '1 glass (250 ml)',
    servingSize: 250,
    priceINR: 27,
    packLabel: '500 ml pouch',
    tags: ['milk', 'toned', 'low fat'],
  },
  {
    id: 'amul-taaza',
    name: 'Amul Taaza Toned Milk',
    brand: 'Amul',
    source: 'standard',
    platform: 'none',
    category: 'dairy',
    per100: { kcal: 58, proteinG: 3.0, carbsG: 4.7, fatG: 3.0, fiberG: 0 },
    unit: 'ml',
    servingLabel: '1 glass (250 ml)',
    servingSize: 250,
    priceINR: 28,
    packLabel: '500 ml pouch',
    tags: ['milk', 'toned', 'homogenised'],
  },
  {
    id: 'mother-dairy-full-cream',
    name: 'Mother Dairy Full Cream Milk',
    brand: 'Mother Dairy',
    source: 'standard',
    platform: 'none',
    category: 'dairy',
    per100: { kcal: 87, proteinG: 3.2, carbsG: 4.8, fatG: 5.8, fiberG: 0 },
    unit: 'ml',
    servingLabel: '1 glass (250 ml)',
    servingSize: 250,
    priceINR: 35,
    packLabel: '500 ml pouch',
    tags: ['milk', 'full cream'],
  },
  {
    id: 'loose-paneer-local',
    name: 'Paneer (Loose, Local Dairy)',
    brand: null,
    source: 'standard',
    platform: 'none',
    category: 'dairy',
    per100: { kcal: 296, proteinG: 18.3, carbsG: 4.9, fatG: 22.0, fiberG: 0 },
    unit: 'g',
    servingLabel: '150 g block',
    servingSize: 150,
    priceINR: 65,
    packLabel: '150 g (loose cut)',
    tags: ['paneer', 'cottage cheese', 'protein', 'unbranded'],
  },
  {
    id: 'dahi-toned-set-curd',
    name: 'Dahi (Set Curd, Toned Milk)',
    brand: null,
    source: 'standard',
    platform: 'none',
    category: 'dairy',
    per100: { kcal: 60, proteinG: 3.2, carbsG: 4.7, fatG: 3.1, fiberG: 0 },
    unit: 'g',
    servingLabel: '1 katori (100 g)',
    servingSize: 100,
    priceINR: 35,
    packLabel: '400 g cup',
    tags: ['curd', 'yogurt', 'dahi', 'probiotic'],
  },
  {
    id: 'hung-curd',
    name: 'Hung Curd (Chakka)',
    brand: null,
    source: 'standard',
    platform: 'none',
    category: 'dairy',
    per100: { kcal: 96, proteinG: 7.6, carbsG: 5.4, fatG: 4.9, fiberG: 0 },
    unit: 'g',
    servingLabel: '100 g',
    servingSize: 100,
    priceINR: null,
    packLabel: null,
    tags: ['hung curd', 'chakka', 'marinade', 'greek style', 'protein'],
  },
  {
    id: 'amul-butter',
    name: 'Amul Butter',
    brand: 'Amul',
    source: 'standard',
    platform: 'none',
    category: 'dairy',
    per100: { kcal: 722, proteinG: 0.5, carbsG: 0.6, fatG: 81.0, fiberG: 0 },
    unit: 'g',
    servingLabel: '1 tbsp (14 g)',
    servingSize: 14,
    priceINR: 60,
    packLabel: '100 g pack',
    tags: ['butter', 'fat', 'makhani base'],
  },
  {
    id: 'amul-fresh-cream',
    name: 'Amul Fresh Cream (25% Fat)',
    brand: 'Amul',
    source: 'standard',
    platform: 'none',
    category: 'dairy',
    per100: { kcal: 245, proteinG: 2.0, carbsG: 3.8, fatG: 25.0, fiberG: 0 },
    unit: 'ml',
    servingLabel: '2 tbsp (30 ml)',
    servingSize: 30,
    priceINR: 75,
    packLabel: '250 ml tetra',
    tags: ['cream', 'fat', 'makhani base'],
  },
  {
    id: 'epigamia-greek-yogurt',
    name: 'Epigamia Greek Yogurt (Natural)',
    brand: 'Epigamia',
    source: 'quick-commerce',
    platform: 'zepto',
    category: 'dairy',
    per100: { kcal: 92, proteinG: 8.2, carbsG: 8.6, fatG: 3.3, fiberG: 0 },
    unit: 'g',
    servingLabel: '1 cup (90 g)',
    servingSize: 90,
    priceINR: 60,
    packLabel: '90 g cup',
    tags: ['greek yogurt', 'protein', 'mumbai brand', 'snack'],
  },

  // --- Quick-commerce store brands ----------------------------------------
  {
    id: 'zepto-fm-spinach',
    name: 'Farmers Market Spinach (Palak)',
    brand: 'Zepto Farmers Market',
    source: 'quick-commerce',
    platform: 'zepto',
    category: 'produce',
    per100: { kcal: 23, proteinG: 2.9, carbsG: 3.6, fatG: 0.4, fiberG: 2.2 },
    unit: 'g',
    servingLabel: '1 bunch cooked-down (100 g)',
    servingSize: 100,
    priceINR: 30,
    packLabel: '250 g bunch',
    tags: ['spinach', 'palak', 'greens', 'iron'],
  },
  {
    id: 'zepto-fm-broccoli',
    name: 'Farmers Market Broccoli',
    brand: 'Zepto Farmers Market',
    source: 'quick-commerce',
    platform: 'zepto',
    category: 'produce',
    per100: { kcal: 34, proteinG: 2.8, carbsG: 6.6, fatG: 0.4, fiberG: 2.6 },
    unit: 'g',
    servingLabel: '1 cup florets (90 g)',
    servingSize: 90,
    priceINR: 55,
    packLabel: '250 g head',
    tags: ['broccoli', 'greens', 'fiber'],
  },
  {
    id: 'blinkit-rolled-oats',
    name: 'Blinkit Rolled Oats',
    brand: 'Blinkit',
    source: 'quick-commerce',
    platform: 'blinkit',
    category: 'grains-flours',
    per100: { kcal: 389, proteinG: 13.5, carbsG: 67.0, fatG: 7.0, fiberG: 10.1 },
    unit: 'g',
    servingLabel: '1 bowl dry (40 g)',
    servingSize: 40,
    priceINR: 120,
    packLabel: '1 kg pouch',
    tags: ['oats', 'breakfast', 'fiber', 'own brand'],
  },
  {
    id: 'blinkit-white-eggs',
    name: 'Blinkit Farm Fresh White Eggs',
    brand: 'Blinkit',
    source: 'quick-commerce',
    platform: 'blinkit',
    category: 'protein',
    per100: { kcal: 143, proteinG: 12.6, carbsG: 0.7, fatG: 9.5, fiberG: 0 },
    unit: 'g',
    servingLabel: '1 egg (50 g)',
    servingSize: 50,
    priceINR: 90,
    packLabel: 'Tray of 12',
    tags: ['eggs', 'protein', 'own brand', 'whole egg'],
  },
  {
    id: 'organic-ragi-flour',
    name: 'Organic Ragi (Nachni) Flour',
    brand: 'Blinkit',
    source: 'quick-commerce',
    platform: 'blinkit',
    category: 'grains-flours',
    per100: { kcal: 321, proteinG: 7.2, carbsG: 66.8, fatG: 1.9, fiberG: 11.2 },
    unit: 'g',
    servingLabel: '1 bhakri portion (50 g)',
    servingSize: 50,
    priceINR: 80,
    packLabel: '500 g pouch',
    tags: ['ragi', 'nachni', 'millet', 'flour', 'calcium', 'organic'],
  },
  {
    id: 'organic-bajra-flour',
    name: 'Organic Bajra (Pearl Millet) Flour',
    brand: 'Zepto',
    source: 'quick-commerce',
    platform: 'zepto',
    category: 'grains-flours',
    per100: { kcal: 347, proteinG: 10.9, carbsG: 61.8, fatG: 5.4, fiberG: 11.5 },
    unit: 'g',
    servingLabel: '1 bhakri portion (50 g)',
    servingSize: 50,
    priceINR: 70,
    packLabel: '500 g pouch',
    tags: ['bajra', 'millet', 'flour', 'organic', 'winter'],
  },
  {
    id: 'zepto-chicken-breast',
    name: 'Fresh Chicken Breast (Boneless)',
    brand: 'Zepto Relish',
    source: 'quick-commerce',
    platform: 'zepto',
    category: 'protein',
    per100: { kcal: 120, proteinG: 22.5, carbsG: 0, fatG: 2.6, fiberG: 0 },
    unit: 'g',
    servingLabel: '1 fillet (150 g raw)',
    servingSize: 150,
    priceINR: 135,
    packLabel: '450 g pack',
    tags: ['chicken', 'breast', 'lean protein', 'raw weight'],
  },
  {
    id: 'blinkit-soya-chunks',
    name: 'Soya Chunks',
    brand: 'Blinkit',
    source: 'quick-commerce',
    platform: 'blinkit',
    category: 'protein',
    per100: { kcal: 345, proteinG: 52.0, carbsG: 33.0, fatG: 0.5, fiberG: 13.0 },
    unit: 'g',
    servingLabel: '1 portion dry (40 g)',
    servingSize: 40,
    priceINR: 65,
    packLabel: '500 g pouch',
    tags: ['soya', 'vegetarian protein', 'dry weight', 'own brand'],
  },
  {
    id: 'instamart-tofu',
    name: 'Firm Tofu',
    brand: 'Instamart',
    source: 'quick-commerce',
    platform: 'instamart',
    category: 'protein',
    per100: { kcal: 110, proteinG: 12.0, carbsG: 2.5, fatG: 6.0, fiberG: 0.5 },
    unit: 'g',
    servingLabel: '100 g slab',
    servingSize: 100,
    priceINR: 85,
    packLabel: '200 g pack',
    tags: ['tofu', 'soy', 'vegan protein'],
  },
  {
    id: 'blinkit-peanuts-raw',
    name: 'Raw Peanuts (Shengdana)',
    brand: 'Blinkit',
    source: 'quick-commerce',
    platform: 'blinkit',
    category: 'pantry',
    per100: { kcal: 567, proteinG: 25.8, carbsG: 16.1, fatG: 49.2, fiberG: 8.5 },
    unit: 'g',
    servingLabel: '1 handful (30 g)',
    servingSize: 30,
    priceINR: 60,
    packLabel: '200 g pouch',
    tags: ['peanuts', 'shengdana', 'healthy fat', 'snack'],
  },
  {
    id: 'avvatar-whey-isolate',
    name: 'Avvatar Whey Protein Isolate',
    brand: 'Avvatar (Parag Milk Foods)',
    source: 'quick-commerce',
    platform: 'blinkit',
    category: 'supplement',
    per100: { kcal: 373, proteinG: 90.0, carbsG: 2.0, fatG: 0.7, fiberG: 0 },
    unit: 'g',
    servingLabel: '1 scoop (30 g)',
    servingSize: 30,
    priceINR: 2899,
    packLabel: '1 kg jar',
    tags: ['whey', 'isolate', 'supplement', 'made in maharashtra'],
  },

  // --- Standard grains, staples & produce ----------------------------------
  {
    id: 'aashirvaad-atta',
    name: 'Aashirvaad Whole Wheat Atta',
    brand: 'Aashirvaad',
    source: 'standard',
    platform: 'none',
    category: 'grains-flours',
    per100: { kcal: 340, proteinG: 12.0, carbsG: 71.0, fatG: 1.7, fiberG: 11.0 },
    unit: 'g',
    servingLabel: '1 chapati portion (30 g dry)',
    servingSize: 30,
    priceINR: 325,
    packLabel: '5 kg bag',
    tags: ['atta', 'wheat', 'chapati', 'roti'],
  },
  {
    id: 'kolam-rice',
    name: 'Kolam Rice (Raw)',
    brand: null,
    source: 'standard',
    platform: 'none',
    category: 'grains-flours',
    per100: { kcal: 356, proteinG: 6.8, carbsG: 78.2, fatG: 0.6, fiberG: 2.8 },
    unit: 'g',
    servingLabel: '1 katori cooked (~50 g raw)',
    servingSize: 50,
    priceINR: 70,
    packLabel: '1 kg loose',
    tags: ['rice', 'kolam', 'staple', 'raw weight'],
  },
  {
    id: 'poha-flattened-rice',
    name: 'Poha (Flattened Rice, Thick)',
    brand: null,
    source: 'standard',
    platform: 'none',
    category: 'grains-flours',
    per100: { kcal: 346, proteinG: 6.6, carbsG: 77.3, fatG: 1.2, fiberG: 2.0 },
    unit: 'g',
    servingLabel: '1 plate dry (60 g)',
    servingSize: 60,
    priceINR: 55,
    packLabel: '500 g pouch',
    tags: ['poha', 'breakfast', 'kanda poha', 'dry weight'],
  },
  {
    id: 'toor-dal',
    name: 'Toor Dal (Arhar, Raw)',
    brand: null,
    source: 'standard',
    platform: 'none',
    category: 'protein',
    per100: { kcal: 343, proteinG: 22.3, carbsG: 57.6, fatG: 1.7, fiberG: 9.1 },
    unit: 'g',
    servingLabel: '1 katori cooked (~35 g raw)',
    servingSize: 35,
    priceINR: 160,
    packLabel: '1 kg pouch',
    tags: ['dal', 'toor', 'arhar', 'varan', 'raw weight'],
  },
  {
    id: 'moong-dal',
    name: 'Moong Dal (Yellow, Raw)',
    brand: null,
    source: 'standard',
    platform: 'none',
    category: 'protein',
    per100: { kcal: 348, proteinG: 24.5, carbsG: 59.9, fatG: 1.2, fiberG: 8.2 },
    unit: 'g',
    servingLabel: '1 katori cooked (~35 g raw)',
    servingSize: 35,
    priceINR: 150,
    packLabel: '1 kg pouch',
    tags: ['dal', 'moong', 'light', 'raw weight'],
  },
  {
    id: 'elaichi-banana',
    name: 'Elaichi Banana',
    brand: null,
    source: 'standard',
    platform: 'none',
    category: 'produce',
    per100: { kcal: 89, proteinG: 1.1, carbsG: 22.8, fatG: 0.3, fiberG: 2.6 },
    unit: 'g',
    servingLabel: '1 small banana (60 g)',
    servingSize: 60,
    priceINR: 60,
    packLabel: '1 dozen',
    tags: ['banana', 'elaichi', 'fruit', 'pre-workout'],
  },
  {
    id: 'tomato',
    name: 'Tomato',
    brand: null,
    source: 'standard',
    platform: 'none',
    category: 'produce',
    per100: { kcal: 20, proteinG: 0.9, carbsG: 3.9, fatG: 0.2, fiberG: 1.2 },
    unit: 'g',
    servingLabel: '1 medium (100 g)',
    servingSize: 100,
    priceINR: 40,
    packLabel: '1 kg loose',
    tags: ['tomato', 'gravy base', 'makhani base'],
  },
  {
    id: 'onion',
    name: 'Onion',
    brand: null,
    source: 'standard',
    platform: 'none',
    category: 'produce',
    per100: { kcal: 40, proteinG: 1.1, carbsG: 9.3, fatG: 0.1, fiberG: 1.7 },
    unit: 'g',
    servingLabel: '1 medium (80 g)',
    servingSize: 80,
    priceINR: 35,
    packLabel: '1 kg loose',
    tags: ['onion', 'kanda', 'gravy base'],
  },
  {
    id: 'cashew-whole',
    name: 'Cashew (Kaju, Whole)',
    brand: null,
    source: 'standard',
    platform: 'none',
    category: 'pantry',
    per100: { kcal: 553, proteinG: 18.2, carbsG: 30.2, fatG: 43.9, fiberG: 3.3 },
    unit: 'g',
    servingLabel: '10 pieces (15 g)',
    servingSize: 15,
    priceINR: 180,
    packLabel: '200 g pouch',
    tags: ['cashew', 'kaju', 'makhani base', 'healthy fat'],
  },
  {
    id: 'ginger-garlic-paste',
    name: 'Ginger-Garlic Paste',
    brand: null,
    source: 'standard',
    platform: 'none',
    category: 'pantry',
    per100: { kcal: 58, proteinG: 2.0, carbsG: 12.0, fatG: 0.3, fiberG: 1.5 },
    unit: 'g',
    servingLabel: '1 tbsp (15 g)',
    servingSize: 15,
    priceINR: 45,
    packLabel: '200 g jar',
    tags: ['ginger', 'garlic', 'paste', 'marinade base'],
  },
  {
    id: 'britannia-brown-bread',
    name: 'Britannia 100% Whole Wheat Bread',
    brand: 'Britannia',
    source: 'standard',
    platform: 'none',
    category: 'bakery',
    per100: { kcal: 244, proteinG: 8.5, carbsG: 47.0, fatG: 2.5, fiberG: 4.0 },
    unit: 'g',
    servingLabel: '2 slices (50 g)',
    servingSize: 50,
    priceINR: 60,
    packLabel: '400 g loaf',
    tags: ['bread', 'brown bread', 'whole wheat', 'breakfast'],
  },
  {
    id: 'ladi-pav',
    name: 'Ladi Pav (Bakery)',
    brand: null,
    source: 'standard',
    platform: 'none',
    category: 'bakery',
    per100: { kcal: 270, proteinG: 8.0, carbsG: 50.0, fatG: 4.0, fiberG: 2.0 },
    unit: 'g',
    servingLabel: '1 pav (40 g)',
    servingSize: 40,
    priceINR: 24,
    packLabel: 'Ladi of 6',
    tags: ['pav', 'bread', 'mumbai', 'misal', 'bhaji'],
  },

  // --- Restaurant prep bases (composable) ----------------------------------
  {
    id: 'makhani-gravy-base',
    name: 'Makhani Gravy Base (Homestyle)',
    brand: null,
    source: 'restaurant-base',
    platform: 'none',
    category: 'recipe-base',
    per100: { kcal: 148, proteinG: 2.6, carbsG: 8.2, fatG: 11.8, fiberG: 1.6 },
    unit: 'g',
    servingLabel: '1 ladle (80 g)',
    servingSize: 80,
    priceINR: null,
    packLabel: null,
    tags: ['makhani', 'gravy', 'butter', 'tomato', 'cashew', 'base'],
  },
  {
    id: 'hung-curd-marinade',
    name: 'Hung Curd Tandoori Marinade',
    brand: null,
    source: 'restaurant-base',
    platform: 'none',
    category: 'recipe-base',
    per100: { kcal: 104, proteinG: 7.1, carbsG: 6.4, fatG: 5.6, fiberG: 0.6 },
    unit: 'g',
    servingLabel: 'Coating for 150 g protein (50 g)',
    servingSize: 50,
    priceINR: null,
    packLabel: null,
    tags: ['marinade', 'tandoori', 'hung curd', 'base'],
  },
  {
    id: 'malvani-coconut-gravy-base',
    name: 'Malvani Coconut Gravy Base',
    brand: null,
    source: 'restaurant-base',
    platform: 'none',
    category: 'recipe-base',
    per100: { kcal: 165, proteinG: 2.4, carbsG: 7.0, fatG: 14.5, fiberG: 3.2 },
    unit: 'g',
    servingLabel: '1 ladle (80 g)',
    servingSize: 80,
    priceINR: null,
    packLabel: null,
    tags: ['malvani', 'coconut', 'gravy', 'konkan', 'base'],
  },
  {
    id: 'green-chutney',
    name: 'Green Chutney (Coriander-Mint)',
    brand: null,
    source: 'restaurant-base',
    platform: 'none',
    category: 'recipe-base',
    per100: { kcal: 46, proteinG: 2.2, carbsG: 6.5, fatG: 1.2, fiberG: 2.8 },
    unit: 'g',
    servingLabel: '2 tbsp (30 g)',
    servingSize: 30,
    priceINR: null,
    packLabel: null,
    tags: ['chutney', 'coriander', 'mint', 'condiment', 'base'],
  },
];

// ---------------------------------------------------------------------------
// Lookup + macro math
// ---------------------------------------------------------------------------

const DB_INDEX: ReadonlyMap<string, FoodItem> = new Map(
  NUTRITION_DB.map((item) => [item.id, item]),
);

export function getFoodById(id: string): FoodItem | undefined {
  return DB_INDEX.get(id);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Scale a per-100 profile to an arbitrary quantity (g/ml). */
export function scaleMacros(per100: MacroProfile, quantity: number): MacroProfile {
  const f = quantity / 100;
  return {
    kcal: Math.round(per100.kcal * f),
    proteinG: round1(per100.proteinG * f),
    carbsG: round1(per100.carbsG * f),
    fatG: round1(per100.fatG * f),
    fiberG: round1(per100.fiberG * f),
  };
}

/** Macros for N default servings of a food. */
export function macrosForServings(food: FoodItem, servings: number): MacroProfile {
  return scaleMacros(food.per100, food.servingSize * servings);
}

export function sumMacros(profiles: MacroProfile[]): MacroProfile {
  return profiles.reduce<MacroProfile>(
    (acc, p) => ({
      kcal: acc.kcal + p.kcal,
      proteinG: round1(acc.proteinG + p.proteinG),
      carbsG: round1(acc.carbsG + p.carbsG),
      fatG: round1(acc.fatG + p.fatG),
      fiberG: round1(acc.fiberG + p.fiberG),
    }),
    { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0, fiberG: 0 },
  );
}

// ---------------------------------------------------------------------------
// Search & filtering — differentiates standard vs quick-commerce sources
// ---------------------------------------------------------------------------

export interface FoodSearchFilters {
  source?: FoodSource | 'all';
  category?: FoodCategory | 'all';
  platform?: QuickCommercePlatform | 'all';
}

interface ScoredItem {
  item: FoodItem;
  score: number;
}

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Token-scored search: exact-name > name-prefix > name-substring >
 * brand match > tag match. Empty query returns the filtered DB in seed order.
 */
export function searchFoods(
  query: string,
  filters: FoodSearchFilters = {},
): FoodItem[] {
  const { source = 'all', category = 'all', platform = 'all' } = filters;

  const pool = NUTRITION_DB.filter((item) => {
    if (source !== 'all' && item.source !== source) return false;
    if (category !== 'all' && item.category !== category) return false;
    if (platform !== 'all' && item.platform !== platform) return false;
    return true;
  });

  const q = normalize(query);
  if (q.length === 0) return pool;

  const tokens = q.split(' ');
  const scored: ScoredItem[] = [];

  for (const item of pool) {
    const name = normalize(item.name);
    const brand = item.brand ? normalize(item.brand) : '';
    const tags = item.tags.map(normalize);
    let score = 0;

    for (const token of tokens) {
      if (name === token) score += 100;
      else if (name.startsWith(token)) score += 60;
      else if (name.includes(token)) score += 40;

      if (brand && brand.includes(token)) score += 30;
      if (tags.some((t) => t === token)) score += 35;
      else if (tags.some((t) => t.includes(token))) score += 15;
    }

    if (score > 0) scored.push({ item, score });
  }

  scored.sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));
  return scored.map((s) => s.item);
}

// ---------------------------------------------------------------------------
// UI label maps
// ---------------------------------------------------------------------------

export const SOURCE_LABELS: Record<FoodSource, string> = {
  standard: 'Standard DB',
  'quick-commerce': 'Quick Commerce',
  'restaurant-base': 'Prep Base',
  'custom-recipe': 'My Recipes',
};

export const PLATFORM_LABELS: Record<QuickCommercePlatform, string> = {
  blinkit: 'Blinkit',
  zepto: 'Zepto',
  instamart: 'Instamart',
  bigbasket: 'BigBasket',
  none: '—',
};

export const CATEGORY_LABELS: Record<FoodCategory, string> = {
  dairy: 'Dairy',
  'grains-flours': 'Grains & Flours',
  protein: 'Protein',
  produce: 'Produce',
  pantry: 'Pantry',
  bakery: 'Bakery',
  'recipe-base': 'Recipe Bases',
  supplement: 'Supplements',
};
