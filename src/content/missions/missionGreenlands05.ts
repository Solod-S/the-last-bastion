import { MissionDefinition } from '../../core/types/mission';

export const missionGreenlands05: MissionDefinition = {
  id: 'mission.greenlands.05',
  regionId: 'region.greenlands',
  nameKey: 'mission.greenlands.05.name',
  storyIntroKey: 'mission.greenlands.05.story',
  mapId: 'map.greenlands.brokenMill',
  waveSetId: 'waves.greenlands.05',
  startingGold: 380,
  baseHealth: 20,
  allowedTowerClasses: ['archer', 'mage', 'cannon', 'barracks', 'alchemy'],
  objectives: [
    { type: 'surviveAllWaves' },
    { type: 'protectBase', targetValue: 10 }
  ],
  rewards: {
    starsMax: 3,
    firstClearRiftCrystals: 35
  },
  missionNumber: 5,
  nextMissionId: 'mission.greenlands.06'
};
