import { TowerDefinition } from '../../core/types/towers';

export const mageTower: TowerDefinition = {
  id: 'tower.mage',
  class: 'mage',
  nameKey: 'tower.mage.name',
  descriptionKey: 'tower.mage.description',
  buildCost: 110,
  allowedTargetTypes: ['ground', 'air'],
  defaultPriority: 'strongest',
  levels: [
    {
      level: 1,
      nameKey: 'tower.mage.l1.name',
      descriptionKey: 'tower.mage.l1.description',
      upgradeCost: 95,
      damage: 32,
      damageType: 'magic',
      range: 150,
      attacksPerSecond: 0.85,
      projectileSpeed: 360,
      assetKey: 'tower_mage_l1'
    },
    {
      level: 2,
      nameKey: 'tower.mage.l2.name',
      descriptionKey: 'tower.mage.l2.description',
      upgradeCost: 145,
      damage: 58,
      damageType: 'magic',
      range: 170,
      attacksPerSecond: 1.0,
      projectileSpeed: 380,
      assetKey: 'tower_mage_l2'
    },
    {
      level: 3,
      nameKey: 'tower.mage.l3.name',
      descriptionKey: 'tower.mage.l3.description',
      upgradeCost: 220,
      damage: 96,
      damageType: 'magic',
      range: 195,
      attacksPerSecond: 1.2,
      projectileSpeed: 400,
      assetKey: 'tower_mage_l3'
    }
  ]
};
