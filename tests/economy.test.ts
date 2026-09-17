import { describe, it, expect } from 'vitest';
import { calculateSellRefund, calculateStars, calculateEarlyWaveBonus } from '../src/core/economy/economy';

describe('Economy System', () => {
  it('refunds 70% of invested gold on tower sell', () => {
    expect(calculateSellRefund(100)).toBe(70);
    expect(calculateSellRefund(80)).toBe(56);
    expect(calculateSellRefund(250)).toBe(175);
  });

  it('calculates early wave call bonus linearly based on remaining time', () => {
    // 50% time left of 30 bonus -> 15 gold
    expect(calculateEarlyWaveBonus(30, 5, 10)).toBe(15);
    // 100% time left -> 30 gold
    expect(calculateEarlyWaveBonus(30, 10, 10)).toBe(30);
    // 0 time left -> 0 gold
    expect(calculateEarlyWaveBonus(30, 0, 10)).toBe(0);
  });

  it('calculates 3 stars for >= 90% lives, 2 for >= 50%, 1 for victory', () => {
    expect(calculateStars(20, 20)).toBe(3);
    expect(calculateStars(18, 20)).toBe(3); // 90%
    expect(calculateStars(10, 20)).toBe(2); // 50%
    expect(calculateStars(3, 20)).toBe(1);  // 15%
    expect(calculateStars(0, 20)).toBe(0);  // Defeat
  });
});
