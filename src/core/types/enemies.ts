import { DefenseStats } from './combat';

export type EnemyClass = 'small' | 'medium' | 'large' | 'boss';

export interface EnemyAbilityConfig {
  type: 'heal_aura' | 'speed_boost' | 'regen' | 'shield';
  radius?: number;
  value?: number;
  interval?: number;
}

export interface EnemyDefinition {
  id: string;
  nameKey: string;
  descriptionKey?: string;
  class: EnemyClass;
  movementType: 'ground' | 'air';
  baseSpeed: number; // pixels per second
  maxHealth: number;
  defense: DefenseStats;
  rewardGold: number;
  leakDamage: number;
  tags: string[];
  abilities?: EnemyAbilityConfig[];
  assetKey: string;
}
