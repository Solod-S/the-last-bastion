import { TowerClass } from './towers';

export interface MissionObjective {
  type: 'surviveAllWaves' | 'protectBase' | 'noLeaks';
  targetValue?: number;
}

export interface MissionDefinition {
  id: string;
  regionId: string;
  nameKey: string;
  storyIntroKey: string;
  mapId: string;
  waveSetId: string;
  startingGold: number;
  baseHealth: number;
  allowedTowerClasses: TowerClass[];
  objectives: MissionObjective[];
  rewards: {
    starsMax: number;
    firstClearRiftCrystals: number;
  };
  missionNumber?: number;
  nextMissionId?: string;
  hasBoss?: boolean;
  bossEnemyId?: string;
}
