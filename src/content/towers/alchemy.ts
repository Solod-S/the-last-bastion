import { TowerDefinition } from '../../core/types/towers';

export const alchemyTower: TowerDefinition = {
  id: 'tower.alchemy',
  class: 'alchemy',
  nameKey: 'tower.alchemy.name',
  descriptionKey: 'tower.alchemy.description',
  buildCost: 115,
  allowedTargetTypes: ['ground'],
  defaultPriority: 'first',
  levels: [
    {
      level: 1,
      nameKey: 'tower.alchemy.l1.name',
      descriptionKey: 'tower.alchemy.l1.description',
      upgradeCost: 100,
      damage: 24,
      damageType: 'magic',
      range: 150,
      attacksPerSecond: 0.8,
      splashRadius: 45,
      slowPercent: 0.2,
      slowDuration: 2.0,
      projectileSpeed: 320,
      assetKey: 'tower_alchemy_l1'
    },
    {
      level: 2,
      nameKey: 'tower.alchemy.l2.name',
      descriptionKey: 'tower.alchemy.l2.description',
      upgradeCost: 160,
      damage: 48,
      damageType: 'magic',
      range: 175,
      attacksPerSecond: 0.9,
      splashRadius: 60,
      slowPercent: 0.35,
      slowDuration: 2.8,
      projectileSpeed: 340,
      assetKey: 'tower_alchemy_l2'
    },
    {
      level: 3,
      nameKey: 'tower.alchemy.l3.name',
      descriptionKey: 'tower.alchemy.l3.description',
      upgradeCost: 240,
      damage: 85,
      damageType: 'magic',
      range: 200,
      attacksPerSecond: 1.0,
      splashRadius: 75,
      slowPercent: 0.5,
      slowDuration: 3.5,
      projectileSpeed: 360,
      assetKey: 'tower_alchemy_l3'
    }
  ]
};
