import { MissionDefinition } from '../../core/types/mission';

export const missionGreenlands04: MissionDefinition = {
  id: 'mission.greenlands.04',
  regionId: 'region.greenlands',
  nameKey: 'mission.greenlands.04.name',
  storyIntroKey: 'mission.greenlands.04.story',
  mapId: 'map.greenlands.crystalGrove',
  waveSetId: 'waves.greenlands.04',
  startingGold: 360,
  baseHealth: 20,
  allowedTowerClasses: ['archer', 'mage', 'cannon', 'barracks'],
  objectives: [
    { type: 'surviveAllWaves' },
    { type: 'protectBase', targetValue: 12 }
  ],
  rewards: {
    starsMax: 3,
    firstClearRiftCrystals: 30
  },
  missionNumber: 4,
  nextMissionId: 'mission.greenlands.05'
};
