import { describe, it, expect } from 'vitest';
import { calculateEffectiveDamage } from '../src/core/combat/damage';

describe('Combat System - Damage Calculations', () => {
  it('calculates physical damage against armor correctly', () => {
    // 0 armor -> 100% damage
    const dmgZeroArmor = calculateEffectiveDamage(
      { amount: 50, type: 'physical' },
      { armor: 0, magicResistance: 0 }
    );
    expect(dmgZeroArmor).toBe(50);

    // 100 armor -> reduction = 100 / (100 + 100) = 50% -> 25 damage
    const dmg100Armor = calculateEffectiveDamage(
      { amount: 50, type: 'physical' },
      { armor: 100, magicResistance: 0 }
    );
    expect(dmg100Armor).toBe(25);

    // 60 armor (Rift Knight) -> reduction = 60 / 160 = 0.375 -> 50 * 0.625 = 31.25 -> 31.3
    const dmgKnight = calculateEffectiveDamage(
      { amount: 50, type: 'physical' },
      { armor: 60, magicResistance: 0 }
    );
    expect(dmgKnight).toBe(31.3);
  });

  it('calculates magic damage against magic resistance', () => {
    // 0% MR -> full damage
    const dmgZeroMr = calculateEffectiveDamage(
      { amount: 40, type: 'magic' },
      { armor: 100, magicResistance: 0 }
    );
    expect(dmgZeroMr).toBe(40); // Ignores armor completely!

    // 25% MR -> 75% damage = 30
    const dmgWithMr = calculateEffectiveDamage(
      { amount: 40, type: 'magic' },
      { armor: 0, magicResistance: 0.25 }
    );
    expect(dmgWithMr).toBe(30);
  });

  it('calculates true damage ignoring both armor and magic resistance', () => {
    const dmgTrue = calculateEffectiveDamage(
      { amount: 45, type: 'true' },
      { armor: 200, magicResistance: 0.8 }
    );
    expect(dmgTrue).toBe(45);
  });

  it('guarantees minimum damage of 1 for positive damage amounts', () => {
    const dmgMin = calculateEffectiveDamage(
      { amount: 1, type: 'physical' },
      { armor: 1000, magicResistance: 0 }
    );
    expect(dmgMin).toBe(1);
  });
});
