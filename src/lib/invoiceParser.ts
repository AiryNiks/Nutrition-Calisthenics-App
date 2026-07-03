/// src/lib/invoiceParser.ts
import type {
  InvoiceAdapter,
  LogEntry,
  MealSlot,
  ParsedInvoice,
  ParsedInvoiceLine,
  QuickCommercePlatform,
} from '../types';
import { getFoodById, scaleMacros, searchFoods } from '../data/nutritionDb';
import { uid } from './uid';

// ---------------------------------------------------------------------------
// Line-level parsing primitives
// ---------------------------------------------------------------------------

const SKIP_LINE =
  /\b(total|subtotal|sub-total|delivery|handling|convenience|gst|cgst|sgst|tax|tip|discount|savings?|coupon|invoice|order\s*(id|no|number)?[:#]|payment|paid|amount|bill|charge[sd]?|thank|customer|address|phone|email|www\.|http)\b/i;

const QTY_UNIT =
  /(\d+(?:\.\d+)?)\s*(kg|kgs|g|gm|gms|gram|grams|ml|l|ltr|litre|liter)\b/i;

const MULTIPLIER = /(?:^|\s)(?:x|×)\s*(\d+)\b|(?:^|\s)(\d+)\s*(?:x|×)(?=\s|$)/i;

const STRIP_PRICE = /(?:₹|rs\.?|inr)\s*\d+(?:[.,]\d+)?/gi;
const STRIP_QTY =
  /(\d+(?:\.\d+)?)\s*(kg|kgs|g|gm|gms|gram|grams|ml|l|ltr|litre|liter)\b/gi;
const STRIP_MULT = /(?:^|\s)(?:x|×)\s*\d+\b|(?:^|\s)\d+\s*(?:x|×)(?=\s|$)/gi;

interface QtyParse {
  quantity: number;
  unit: 'g' | 'ml' | 'serving';
}

function parseQuantity(line: string): QtyParse {
  const unitMatch = QTY_UNIT.exec(line);
  const multMatch = MULTIPLIER.exec(line);
  const multStr = multMatch ? (multMatch[1] ?? multMatch[2]) : undefined;
  const mult = multStr ? parseInt(multStr, 10) || 1 : 1;

  if (unitMatch) {
    const value = parseFloat(unitMatch[1]);
    const rawUnit = unitMatch[2].toLowerCase();
    let quantity = value;
    let unit: 'g' | 'ml';

    if (rawUnit === 'ml') {
      unit = 'ml';
    } else if (
      rawUnit === 'l' ||
      rawUnit === 'ltr' ||
      rawUnit === 'litre' ||
      rawUnit === 'liter'
    ) {
      unit = 'ml';
      quantity = value * 1000;
    } else if (rawUnit === 'kg' || rawUnit === 'kgs') {
      unit = 'g';
      quantity = value * 1000;
    } else {
      unit = 'g';
    }
    return { quantity: quantity * mult, unit };
  }

  if (multStr) return { quantity: mult, unit: 'serving' };
  return { quantity: 1, unit: 'serving' };
}

function cleanName(line: string): string {
  return line
    .replace(STRIP_PRICE, ' ')
    .replace(STRIP_QTY, ' ')
    .replace(STRIP_MULT, ' ')
    .replace(/[|•*_>#()[\]{}-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

interface FoodMatch {
  foodId: string | null;
  foodName: string | null;
  confidence: number;
}

const NO_MATCH: FoodMatch = { foodId: null, foodName: null, confidence: 0 };

function matchFood(name: string): FoodMatch {
  if (!name) return NO_MATCH;
  const results = searchFoods(name);
  const top = results[0];
  if (!top) return NO_MATCH;

  const haystack = `${top.name} ${top.brand ?? ''} ${top.tags.join(' ')}`.toLowerCase();
  const tokens = name
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);
  if (tokens.length === 0) return NO_MATCH;

  const hits = tokens.filter((t) => haystack.includes(t)).length;
  const confidence = Math.round((hits / tokens.length) * 100) / 100;
  return { foodId: top.id, foodName: top.name, confidence };
}

function parseTextLines(raw: string): ParsedInvoiceLine[] {
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 2 && !SKIP_LINE.test(l))
    .map((line) => {
      const { quantity, unit } = parseQuantity(line);
      const match = matchFood(cleanName(line));
      return {
        rawText: line,
        matchedFoodId: match.foodId,
        matchedFoodName: match.foodName,
        quantity,
        unit,
        confidence: match.confidence,
      };
    });
}

// ---------------------------------------------------------------------------
// JSON payload adapter (structured exports / email-invoice JSON)
// ---------------------------------------------------------------------------

function itemToLine(item: unknown): ParsedInvoiceLine | null {
  if (typeof item !== 'object' || item === null) return null;
  const rec = item as Record<string, unknown>;

  const name =
    typeof rec.name === 'string'
      ? rec.name
      : typeof rec.title === 'string'
        ? rec.title
        : typeof rec.product === 'string'
          ? rec.product
          : null;
  if (!name) return null;

  const qtyRaw = rec.quantity ?? rec.qty ?? rec.count ?? 1;
  const qtyNum =
    typeof qtyRaw === 'number'
      ? qtyRaw
      : typeof qtyRaw === 'string'
        ? parseFloat(qtyRaw) || 1
        : 1;

  const unitRaw = typeof rec.unit === 'string' ? rec.unit.toLowerCase() : '';
  let quantity = qtyNum;
  let unit: 'g' | 'ml' | 'serving' = 'serving';

  if (['g', 'gm', 'gms', 'gram', 'grams'].includes(unitRaw)) {
    unit = 'g';
  } else if (unitRaw === 'kg' || unitRaw === 'kgs') {
    unit = 'g';
    quantity = qtyNum * 1000;
  } else if (unitRaw === 'ml') {
    unit = 'ml';
  } else if (['l', 'ltr', 'litre', 'liter'].includes(unitRaw)) {
    unit = 'ml';
    quantity = qtyNum * 1000;
  } else {
    // No explicit unit field — try to lift "500 ml" style sizing out of the name.
    const embedded = parseQuantity(name);
    if (embedded.unit !== 'serving') {
      unit = embedded.unit;
      quantity = embedded.quantity * qtyNum;
    }
  }

  const match = matchFood(cleanName(name));
  return {
    rawText: name,
    matchedFoodId: match.foodId,
    matchedFoodName: match.foodName,
    quantity,
    unit,
    confidence: match.confidence,
  };
}

const jsonAdapter: InvoiceAdapter = {
  platform: 'none',
  detect(raw: string): boolean {
    const t = raw.trim();
    if (!t.startsWith('{') && !t.startsWith('[')) return false;
    try {
      JSON.parse(t);
      return true;
    } catch {
      return false;
    }
  },
  parse(raw: string): ParsedInvoiceLine[] {
    try {
      const payload = JSON.parse(raw.trim()) as unknown;
      const items = Array.isArray(payload)
        ? payload
        : (payload as { items?: unknown[] }).items;
      if (!Array.isArray(items)) return [];
      return items
        .map(itemToLine)
        .filter((l): l is ParsedInvoiceLine => l !== null);
    } catch {
      return [];
    }
  },
};

// ---------------------------------------------------------------------------
// Platform text adapters
// ---------------------------------------------------------------------------

function textAdapter(
  platform: QuickCommercePlatform,
  marker: RegExp | null,
): InvoiceAdapter {
  return {
    platform,
    detect: (raw: string) => (marker ? marker.test(raw) : true),
    parse: (raw: string) => parseTextLines(raw),
  };
}

/** Ordered adapter chain — first `detect` win takes it; last entry is the catch-all. */
export const INVOICE_ADAPTERS: InvoiceAdapter[] = [
  jsonAdapter,
  textAdapter('blinkit', /blinkit|grofers/i),
  textAdapter('zepto', /zepto/i),
  textAdapter('instamart', /instamart|swiggy/i),
  textAdapter('bigbasket', /bigbasket|bb\s*now/i),
  textAdapter('none', null),
];

export function parseInvoice(raw: string): ParsedInvoice {
  const adapter =
    INVOICE_ADAPTERS.find((a) => a.detect(raw)) ??
    INVOICE_ADAPTERS[INVOICE_ADAPTERS.length - 1];
  return {
    platform: adapter.platform,
    lines: adapter.parse(raw),
    parsedAtISO: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Parsed lines → log entries
// ---------------------------------------------------------------------------

export function invoiceLinesToLogEntries(
  lines: ParsedInvoiceLine[],
  dateISO: string,
  mealSlot: MealSlot,
): LogEntry[] {
  const entries: LogEntry[] = [];
  for (const line of lines) {
    if (!line.matchedFoodId) continue;
    const food = getFoodById(line.matchedFoodId);
    if (!food) continue;

    const quantity =
      line.unit === 'serving'
        ? food.servingSize * line.quantity
        : line.quantity;

    entries.push({
      id: uid('log'),
      dateISO,
      foodId: food.id,
      foodName: food.name,
      quantity,
      unit: food.unit,
      macros: scaleMacros(food.per100, quantity),
      mealSlot,
      loggedVia: 'invoice',
      createdAt: Date.now(),
    });
  }
  return entries;
}
