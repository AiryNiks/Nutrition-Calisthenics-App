/// src/lib/haptics.ts
import type { HapticPattern } from '../types';

/**
 * Vibration patterns tuned to feel like iOS UIImpactFeedbackGenerator tiers.
 * Note: the Web Vibration API fires on Android Chrome/Firefox; iOS Safari
 * silently ignores navigator.vibrate — animations carry the feel there.
 */
const PATTERNS: Record<HapticPattern, number | number[]> = {
  tap: 10,
  success: [12, 50, 22],
  warning: [30, 60, 30, 60, 30],
  heavy: 45,
};

export function haptic(pattern: HapticPattern = 'tap'): void {
  if (
    typeof navigator === 'undefined' ||
    typeof navigator.vibrate !== 'function'
  ) {
    return;
  }
  try {
    navigator.vibrate(PATTERNS[pattern]);
  } catch {
    // Some browsers throw on vibrate without user activation — safe to ignore.
  }
}
