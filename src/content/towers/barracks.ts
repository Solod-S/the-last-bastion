import { TowerDefinition } from '../../core/types/towers';

export const barracksTower: TowerDefinition = {
  id: 'tower.barracks',
  class: 'barracks',
  nameKey: 'tower.barracks.name',
  descriptionKey: 'tower.barracks.description',
  buildCost: 90,
  allowedTargetTypes: ['ground'],
  defaultPriority: 'first',
  levels: [
    {
      level: 1,
      nameKey: 'tower.barracks.l1.name',
      descriptionKey: 'tower.barracks.l1.description',
      upgradeCost: 80,
      damage: 8,
      damageType: 'physical',
      range: 150, // rally placement radius
      attacksPerSecond: 1.0,
      spawnSoldierCount: 2,
      soldierHp: 120,
      soldierDamage: 10,
      soldierRespawnTime: 12,
      assetKey: 'tower_barracks_l1'
    },
    {
      level: 2,
      nameKey: 'tower.barracks.l2.name',
      descriptionKey: 'tower.barracks.l2.description',
      upgradeCost: 120,
      damage: 15,
      damageType: 'physical',
      range: 170,
      attacksPerSecond: 1.1,
      spawnSoldierCount: 2,
      soldierHp: 200,
      soldierDamage: 18,
      soldierRespawnTime: 10,
      assetKey: 'tower_barracks_l2'
    },
    {
      level: 3,
      nameKey: 'tower.barracks.l3.name',
      descriptionKey: 'tower.barracks.l3.description',
      upgradeCost: 190,
      damage: 26,
      damageType: 'physical',
      range: 190,
      attacksPerSecond: 1.2,
      spawnSoldierCount: 3,
      soldierHp: 320,
      soldierDamage: 28,
      soldierRespawnTime: 8,
      assetKey: 'tower_barracks_l3'
    }
  ]
};
