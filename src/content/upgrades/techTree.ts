import { TechUpgradeNode } from '../../core/types/upgrades';

export const ALL_TECH_UPGRADES: TechUpgradeNode[] = [
  // Archer Branch
  {
    id: 'archer_t1',
    branch: 'archer',
    tier: 1,
    starCost: 1,
    nameKey: 'upgrade.archer.t1.name',
    descriptionKey: 'upgrade.archer.t1.desc',
    effectType: 'range_boost',
    effectValue: 0.15
  },
  {
    id: 'archer_t2',
    branch: 'archer',
    tier: 2,
    starCost: 2,
    nameKey: 'upgrade.archer.t2.name',
    descriptionKey: 'upgrade.archer.t2.desc',
    effectType: 'damage_boost',
    effectValue: 0.15
  },
  {
    id: 'archer_t3',
    branch: 'archer',
    tier: 3,
    starCost: 3,
    nameKey: 'upgrade.archer.t3.name',
    descriptionKey: 'upgrade.archer.t3.desc',
    effectType: 'damage_boost',
    effectValue: 0.2
  },

  // Barracks Branch
  {
    id: 'barracks_t1',
    branch: 'barracks',
    tier: 1,
    starCost: 1,
    nameKey: 'upgrade.barracks.t1.name',
    descriptionKey: 'upgrade.barracks.t1.desc',
    effectType: 'armor_boost',
    effectValue: 0.25
  },
  {
    id: 'barracks_t2',
    branch: 'barracks',
    tier: 2,
    starCost: 2,
    nameKey: 'upgrade.barracks.t2.name',
    descriptionKey: 'upgrade.barracks.t2.desc',
    effectType: 'damage_boost',
    effectValue: 0.2
  },
  {
    id: 'barracks_t3',
    branch: 'barracks',
    tier: 3,
    starCost: 3,
    nameKey: 'upgrade.barracks.t3.name',
    descriptionKey: 'upgrade.barracks.t3.desc',
    effectType: 'respawn_boost',
    effectValue: 0.3
  },

  // Mage Branch
  {
    id: 'mage_t1',
    branch: 'mage',
    tier: 1,
    starCost: 1,
    nameKey: 'upgrade.mage.t1.name',
    descriptionKey: 'upgrade.mage.t1.desc',
    effectType: 'damage_boost',
    effectValue: 0.15
  },
  {
    id: 'mage_t2',
    branch: 'mage',
    tier: 2,
    starCost: 2,
    nameKey: 'upgrade.mage.t2.name',
    descriptionKey: 'upgrade.mage.t2.desc',
    effectType: 'range_boost',
    effectValue: 0.15
  },
  {
    id: 'mage_t3',
    branch: 'mage',
    tier: 3,
    starCost: 3,
    nameKey: 'upgrade.mage.t3.name',
    descriptionKey: 'upgrade.mage.t3.desc',
    effectType: 'damage_boost',
    effectValue: 0.25
  },

  // Cannon Branch
  {
    id: 'cannon_t1',
    branch: 'cannon',
    tier: 1,
    starCost: 1,
    nameKey: 'upgrade.cannon.t1.name',
    descriptionKey: 'upgrade.cannon.t1.desc',
    effectType: 'damage_boost',
    effectValue: 0.15
  },
  {
    id: 'cannon_t2',
    branch: 'cannon',
    tier: 2,
    starCost: 2,
    nameKey: 'upgrade.cannon.t2.name',
    descriptionKey: 'upgrade.cannon.t2.desc',
    effectType: 'range_boost',
    effectValue: 0.15
  },
  {
    id: 'cannon_t3',
    branch: 'cannon',
    tier: 3,
    starCost: 3,
    nameKey: 'upgrade.cannon.t3.name',
    descriptionKey: 'upgrade.cannon.t3.desc',
    effectType: 'damage_boost',
    effectValue: 0.25
  },

  // Alchemy Branch
  {
    id: 'alchemy_t1',
    branch: 'alchemy',
    tier: 1,
    starCost: 1,
    nameKey: 'upgrade.alchemy.t1.name',
    descriptionKey: 'upgrade.alchemy.t1.desc',
    effectType: 'dot_boost',
    effectValue: 0.25
  },
  {
    id: 'alchemy_t2',
    branch: 'alchemy',
    tier: 2,
    starCost: 2,
    nameKey: 'upgrade.alchemy.t2.name',
    descriptionKey: 'upgrade.alchemy.t2.desc',
    effectType: 'range_boost',
    effectValue: 0.15
  },
  {
    id: 'alchemy_t3',
    branch: 'alchemy',
    tier: 3,
    starCost: 3,
    nameKey: 'upgrade.alchemy.t3.name',
    descriptionKey: 'upgrade.alchemy.t3.desc',
    effectType: 'damage_boost',
    effectValue: 0.3
  },

  // Spells Branch
  {
    id: 'spells_t1',
    branch: 'spells',
    tier: 1,
    starCost: 1,
    nameKey: 'upgrade.spells.t1.name',
    descriptionKey: 'upgrade.spells.t1.desc',
    effectType: 'cooldown_reduction',
    effectValue: 0.2
  },
  {
    id: 'spells_t2',
    branch: 'spells',
    tier: 2,
    starCost: 2,
    nameKey: 'upgrade.spells.t2.name',
    descriptionKey: 'upgrade.spells.t2.desc',
    effectType: 'damage_boost',
    effectValue: 0.25
  },
  {
    id: 'spells_t3',
    branch: 'spells',
    tier: 3,
    starCost: 3,
    nameKey: 'upgrade.spells.t3.name',
    descriptionKey: 'upgrade.spells.t3.desc',
    effectType: 'cooldown_reduction',
    effectValue: 0.2
  }
];
