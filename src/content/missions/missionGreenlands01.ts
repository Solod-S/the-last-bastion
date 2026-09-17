import { MissionDefinition } from '../../core/types/mission';

export const missionGreenlands01: MissionDefinition = {
  id: 'mission.greenlands.01',
  regionId: 'region.greenlands',
  nameKey: 'mission.greenlands.01.name',
  storyIntroKey: 'mission.greenlands.01.story',
  mapId: 'map.greenlands.forestRoad',
  waveSetId: 'waves.greenlands.01',
  startingGold: 280,
  baseHealth: 20,
  allowedTowerClasses: ['archer', 'mage', 'cannon', 'barracks'],
  objectives: [
    { type: 'surviveAllWaves' },
    { type: 'protectBase', targetValue: 10 }
  ],
  rewards: {
    starsMax: 3,
    firstClearRiftCrystals: 15
  },
  missionNumber: 1,
  nextMissionId: 'mission.greenlands.02'
};
