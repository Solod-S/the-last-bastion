import { MissionDefinition } from '../../core/types/mission';

export const missionGreenlands03: MissionDefinition = {
  id: 'mission.greenlands.03',
  regionId: 'region.greenlands',
  nameKey: 'mission.greenlands.03.name',
  storyIntroKey: 'mission.greenlands.03.story',
  mapId: 'map.greenlands.stoneBridge',
  waveSetId: 'waves.greenlands.03',
  startingGold: 340,
  baseHealth: 20,
  allowedTowerClasses: ['archer', 'mage', 'cannon', 'barracks'],
  objectives: [
    { type: 'surviveAllWaves' },
    { type: 'protectBase', targetValue: 15 }
  ],
  rewards: {
    starsMax: 3,
    firstClearRiftCrystals: 25
  },
  missionNumber: 3,
  nextMissionId: 'mission.greenlands.04'
};
