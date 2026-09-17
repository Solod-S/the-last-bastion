export type DamageType = 'physical' | 'magic' | 'true';

export interface DefenseStats {
  armor: number; // Percentage or flat reduction: 10 armor = ~9% damage reduction: reduction = armor / (armor + 100)
  magicResistance: number; // 0..1 percentage reduction (e.g. 0.25 = 25% reduction)
}

export interface DamageInfo {
  amount: number;
  type: DamageType;
  sourceId?: string;
  isCrit?: boolean;
}

export type StatusEffectType = 'slow' | 'stun' | 'burn' | 'armorBreak' | 'freeze';

export interface StatusEffect {
  type: StatusEffectType;
  duration: number; // seconds remaining
  potency: number; // e.g. 0.4 for 40% slow or 10 dmg/sec for burn
  tickTimer?: number;
  sourceId?: string;
}

export type TargetPriority = 'first' | 'last' | 'strongest' | 'weakest' | 'closest';
