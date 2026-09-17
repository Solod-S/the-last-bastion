import { DamageInfo, DefenseStats } from '../types/combat';

/**
 * Calculates effective damage applied to a target given target defense stats.
 * Uses standardized non-linear armor mitigation and percentage magic resistance.
 */
export function calculateEffectiveDamage(damageInfo: DamageInfo, defense: DefenseStats): number {
  const { amount, type } = damageInfo;
  if (amount <= 0) return 0;

  switch (type) {
    case 'physical': {
      const armor = Math.max(0, defense.armor || 0);
      // Armor formula: reduction = armor / (armor + 100)
      // 20 armor -> ~16.7% reduction
      // 50 armor -> 33.3% reduction
      // 100 armor -> 50% reduction
      const reduction = armor / (armor + 100);
      const effective = amount * (1 - reduction);
      return Math.max(1, Math.round(effective * 10) / 10);
    }

    case 'magic': {
      const mr = Math.max(0, Math.min(0.9, defense.magicResistance || 0));
      const effective = amount * (1 - mr);
      return Math.max(1, Math.round(effective * 10) / 10);
    }

    case 'true':
    default:
      return Math.max(1, Math.round(amount * 10) / 10);
  }
}
