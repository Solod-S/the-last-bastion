/**
 * Economy calculation utilities.
 */

export const REFUND_RATE = 0.7; // 70% refund on sell

export function calculateSellRefund(totalInvestedGold: number): number {
  return Math.floor(totalInvestedGold * REFUND_RATE);
}

export function calculateEarlyWaveBonus(
  baseEarlyBonus: number,
  remainingSeconds: number,
  totalCountdownSeconds: number
): number {
  if (totalCountdownSeconds <= 0 || remainingSeconds <= 0) return 0;
  const ratio = Math.min(1, Math.max(0, remainingSeconds / totalCountdownSeconds));
  return Math.round(baseEarlyBonus * ratio);
}

export function calculateStars(currentLives: number, maxLives: number): number {
  if (currentLives <= 0 || maxLives <= 0) return 0;
  const ratio = currentLives / maxLives;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.5) return 2;
  return 1;
}
