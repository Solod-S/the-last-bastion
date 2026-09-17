export interface WaveGroup {
  enemyId: string;
  count: number;
  interval: number; // spawn interval in seconds
  delayBefore?: number; // delay before this group starts in seconds
}

export interface WaveDefinition {
  id: string;
  waveNumber: number;
  groups: WaveGroup[];
  rewardGold: number;
  earlyBonusGold: number;
  isBossWave?: boolean;
}

export interface WaveSetDefinition {
  id: string;
  missionId: string;
  waves: WaveDefinition[];
}
