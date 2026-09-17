import { WaveSetDefinition } from '../../core/types/waves';

export const wavesGreenlands01: WaveSetDefinition = {
  id: 'waves.greenlands.01',
  missionId: 'mission.greenlands.01',
  waves: [
    {
      id: 'wave_1',
      waveNumber: 1,
      rewardGold: 30,
      earlyBonusGold: 15,
      groups: [
        { enemyId: 'enemy.goblinRunner', count: 8, interval: 1.2, delayBefore: 0 }
      ]
    },
    {
      id: 'wave_2',
      waveNumber: 2,
      rewardGold: 40,
      earlyBonusGold: 20,
      groups: [
        { enemyId: 'enemy.goblinRunner', count: 6, interval: 0.9, delayBefore: 0 },
        { enemyId: 'enemy.orcBrute', count: 2, interval: 2.2, delayBefore: 2.0 }
      ]
    },
    {
      id: 'wave_3',
      waveNumber: 3,
      rewardGold: 50,
      earlyBonusGold: 25,
      groups: [
        { enemyId: 'enemy.riftKnight', count: 3, interval: 2.0, delayBefore: 0 },
        { enemyId: 'enemy.goblinRunner', count: 8, interval: 0.8, delayBefore: 2.5 }
      ]
    },
    {
      id: 'wave_4',
      waveNumber: 4,
      rewardGold: 65,
      earlyBonusGold: 30,
      groups: [
        { enemyId: 'enemy.orcBrute', count: 3, interval: 1.8, delayBefore: 0 },
        { enemyId: 'enemy.shamanHealer', count: 1, interval: 1.0, delayBefore: 0.5 },
        { enemyId: 'enemy.goblinRunner', count: 6, interval: 0.8, delayBefore: 3.0 }
      ]
    },
    {
      id: 'wave_5',
      waveNumber: 5,
      rewardGold: 85,
      earlyBonusGold: 35,
      groups: [
        { enemyId: 'enemy.riftKnight', count: 4, interval: 1.6, delayBefore: 0 },
        { enemyId: 'enemy.shamanHealer', count: 2, interval: 1.8, delayBefore: 1.0 },
        { enemyId: 'enemy.orcBrute', count: 3, interval: 1.8, delayBefore: 2.0 }
      ]
    },
    {
      id: 'wave_6',
      waveNumber: 6,
      rewardGold: 120,
      earlyBonusGold: 50,
      isBossWave: true,
      groups: [
        { enemyId: 'enemy.goblinRunner', count: 12, interval: 0.6, delayBefore: 0 },
        { enemyId: 'enemy.riftKnight', count: 5, interval: 1.5, delayBefore: 2.0 },
        { enemyId: 'enemy.shamanHealer', count: 2, interval: 1.5, delayBefore: 0.5 },
        { enemyId: 'enemy.orcBrute', count: 5, interval: 1.8, delayBefore: 3.0 }
      ]
    }
  ]
};
