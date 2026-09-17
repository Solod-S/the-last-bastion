export type TechUpgradeBranch = 'archer' | 'barracks' | 'mage' | 'cannon' | 'alchemy' | 'spells';

export interface TechUpgradeNode {
  id: string;
  branch: TechUpgradeBranch;
  tier: number; // 1, 2, 3
  starCost: number;
  nameKey: string;
  descriptionKey: string;
  effectType:
    | 'range_boost'
    | 'damage_boost'
    | 'armor_boost'
    | 'cooldown_reduction'
    | 'dot_boost'
    | 'cost_reduction'
    | 'respawn_boost';
  effectValue: number; // e.g. 0.10 for +10%
}
