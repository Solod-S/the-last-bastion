import { TowerDefinition } from '../../core/types/towers';

export const cannonTower: TowerDefinition = {
  id: 'tower.cannon',
  class: 'cannon',
  nameKey: 'tower.cannon.name',
  descriptionKey: 'tower.cannon.description',
  buildCost: 125,
  allowedTargetTypes: ['ground'],
  defaultPriority: 'first',
  levels: [
    {
      level: 1,
      nameKey: 'tower.cannon.l1.name',
      descriptionKey: 'tower.cannon.l1.description',
      upgradeCost: 110,
      damage: 42,
      damageType: 'physical',
      range: 155,
      attacksPerSecond: 0.55,
      projectileSpeed: 300,
      splashRadius: 65,
      assetKey: 'tower_cannon_l1'
    },
    {
      level: 2,
      nameKey: 'tower.cannon.l2.name',
      descriptionKey: 'tower.cannon.l2.description',
      upgradeCost: 160,
      damage: 75,
      damageType: 'physical',
      range: 175,
      attacksPerSecond: 0.65,
      projectileSpeed: 320,
      splashRadius: 80,
      assetKey: 'tower_cannon_l2'
    },
    {
      level: 3,
      nameKey: 'tower.cannon.l3.name',
      descriptionKey: 'tower.cannon.l3.description',
      upgradeCost: 240,
      damage: 125,
      damageType: 'physical',
      range: 195,
      attacksPerSecond: 0.75,
      projectileSpeed: 340,
      splashRadius: 95,
      assetKey: 'tower_cannon_l3'
    }
  ]
};
