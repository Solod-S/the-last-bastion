import { DamageType, TargetPriority } from './combat';

export type TowerClass = 'archer' | 'mage' | 'cannon' | 'barracks' | 'alchemy';

export interface TowerLevelStats {
  level: number;
  nameKey: string;
  descriptionKey: string;
  upgradeCost: number;
  damage: number;
  damageType: DamageType;
  range: number;
  attacksPerSecond: number;
  projectileSpeed?: number;
  splashRadius?: number; // for AOE (cannon)
  slowPercent?: number;
  slowDuration?: number;
  spawnSoldierCount?: number; // for barracks
  soldierHp?: number;
  soldierDamage?: number;
  soldierRespawnTime?: number;
  assetKey: string;
}

export interface TowerDefinition {
  id: string;
  class: TowerClass;
  nameKey: string;
  descriptionKey: string;
  buildCost: number;
  allowedTargetTypes: ('ground' | 'air')[];
  defaultPriority: TargetPriority;
  levels: TowerLevelStats[];
}
