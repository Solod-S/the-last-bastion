import { MissionDefinition } from '../../core/types/mission';

export const missionGreenlands06: MissionDefinition = {
  id: 'mission.greenlands.06',
  regionId: 'region.greenlands',
  nameKey: 'mission.greenlands.06.name',
  storyIntroKey: 'mission.greenlands.06.story',
  mapId: 'map.greenlands.trollPass',
  waveSetId: 'waves.greenlands.06',
  startingGold: 450,
  baseHealth: 20,
  allowedTowerClasses: ['archer', 'mage', 'cannon', 'barracks', 'alchemy'],
  objectives: [
    { type: 'surviveAllWaves' },
    { type: 'protectBase', targetValue: 8 }
  ],
  rewards: {
    starsMax: 3,
    firstClearRiftCrystals: 60
  },
  missionNumber: 6,
  hasBoss: true,
  bossEnemyId: 'enemy.trollKing'
};
