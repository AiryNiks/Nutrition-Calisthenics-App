/// src/lib/uid.ts

/** Collision-safe id generator with a readable prefix, e.g. "log-9f3c2a1b". */
export function uid(prefix: string): string {
  const rand =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${rand}`;
}
