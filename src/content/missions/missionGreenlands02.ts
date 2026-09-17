import { MissionDefinition } from '../../core/types/mission';

export const missionGreenlands02: MissionDefinition = {
  id: 'mission.greenlands.02',
  regionId: 'region.greenlands',
  nameKey: 'mission.greenlands.02.name',
  storyIntroKey: 'mission.greenlands.02.story',
  mapId: 'map.greenlands.villageCrossing',
  waveSetId: 'waves.greenlands.02',
  startingGold: 320,
  baseHealth: 20,
  allowedTowerClasses: ['archer', 'mage', 'cannon', 'barracks'],
  objectives: [
    { type: 'surviveAllWaves' },
    { type: 'protectBase', targetValue: 12 }
  ],
  rewards: {
    starsMax: 3,
    firstClearRiftCrystals: 20
  },
  missionNumber: 2,
  nextMissionId: 'mission.greenlands.03'
};
