import { TowerDefinition } from '../../core/types/towers';

export const archerTower: TowerDefinition = {
  id: 'tower.archer',
  class: 'archer',
  nameKey: 'tower.archer.name',
  descriptionKey: 'tower.archer.description',
  buildCost: 80,
  allowedTargetTypes: ['ground', 'air'],
  defaultPriority: 'first',
  levels: [
    {
      level: 1,
      nameKey: 'tower.archer.l1.name',
      descriptionKey: 'tower.archer.l1.description',
      upgradeCost: 70,
      damage: 16,
      damageType: 'physical',
      range: 160,
      attacksPerSecond: 1.25,
      projectileSpeed: 420,
      assetKey: 'tower_archer_l1'
    },
    {
      level: 2,
      nameKey: 'tower.archer.l2.name',
      descriptionKey: 'tower.archer.l2.description',
      upgradeCost: 110,
      damage: 28,
      damageType: 'physical',
      range: 185,
      attacksPerSecond: 1.45,
      projectileSpeed: 450,
      assetKey: 'tower_archer_l2'
    },
    {
      level: 3,
      nameKey: 'tower.archer.l3.name',
      descriptionKey: 'tower.archer.l3.description',
      upgradeCost: 180,
      damage: 48,
      damageType: 'physical',
      range: 215,
      attacksPerSecond: 1.7,
      projectileSpeed: 480,
      assetKey: 'tower_archer_l3'
    }
  ]
};
