import { WaveSetDefinition } from '../../core/types/waves';

export const wavesGreenlands03: WaveSetDefinition = {
  id: 'waves.greenlands.03',
  missionId: 'mission.greenlands.03',
  waves: [
    {
      id: 'wave_1',
      waveNumber: 1,
      rewardGold: 40,
      earlyBonusGold: 20,
      groups: [
        { enemyId: 'enemy.goblinRunner', count: 14, interval: 0.7, delayBefore: 0 }
      ]
    },
    {
      id: 'wave_2',
      waveNumber: 2,
      rewardGold: 50,
      earlyBonusGold: 25,
      groups: [
        { enemyId: 'enemy.goblinRunner', count: 16, interval: 0.6, delayBefore: 0 },
        { enemyId: 'enemy.orcBrute', count: 3, interval: 1.8, delayBefore: 2.0 }
      ]
    },
    {
      id: 'wave_3',
      waveNumber: 3,
      rewardGold: 65,
      earlyBonusGold: 30,
      groups: [
        { enemyId: 'enemy.goblinRunner', count: 20, interval: 0.5, delayBefore: 0 },
        { enemyId: 'enemy.orcBrute', count: 4, interval: 1.5, delayBefore: 2.0 }
      ]
    },
    {
      id: 'wave_4',
      waveNumber: 4,
      rewardGold: 80,
      earlyBonusGold: 35,
      groups: [
        { enemyId: 'enemy.riftKnight', count: 5, interval: 1.5, delayBefore: 0 },
        { enemyId: 'enemy.goblinRunner', count: 15, interval: 0.5, delayBefore: 2.0 }
      ]
    },
    {
      id: 'wave_5',
      waveNumber: 5,
      rewardGold: 95,
      earlyBonusGold: 40,
      groups: [
        { enemyId: 'enemy.orcBrute', count: 6, interval: 1.4, delayBefore: 0 },
        { enemyId: 'enemy.shamanHealer', count: 2, interval: 2.0, delayBefore: 1.0 },
        { enemyId: 'enemy.goblinRunner', count: 18, interval: 0.4, delayBefore: 3.0 }
      ]
    },
    {
      id: 'wave_6',
      waveNumber: 6,
      rewardGold: 110,
      earlyBonusGold: 45,
      groups: [
        { enemyId: 'enemy.riftKnight', count: 7, interval: 1.3, delayBefore: 0 },
        { enemyId: 'enemy.goblinRunner', count: 22, interval: 0.4, delayBefore: 2.0 }
      ]
    },
    {
      id: 'wave_7',
      waveNumber: 7,
      rewardGold: 125,
      earlyBonusGold: 50,
      groups: [
        { enemyId: 'enemy.orcBrute', count: 8, interval: 1.3, delayBefore: 0 },
        { enemyId: 'enemy.shamanHealer', count: 3, interval: 1.8, delayBefore: 1.0 },
        { enemyId: 'enemy.riftKnight', count: 5, interval: 1.5, delayBefore: 3.0 }
      ]
    },
    {
      id: 'wave_8',
      waveNumber: 8,
      rewardGold: 145,
      earlyBonusGold: 55,
      groups: [
        { enemyId: 'enemy.goblinRunner', count: 28, interval: 0.35, delayBefore: 0 },
        { enemyId: 'enemy.orcBrute', count: 6, interval: 1.4, delayBefore: 3.0 }
      ]
    },
    {
      id: 'wave_9',
      waveNumber: 9,
      rewardGold: 165,
      earlyBonusGold: 60,
      groups: [
        { enemyId: 'enemy.riftKnight', count: 8, interval: 1.2, delayBefore: 0 },
        { enemyId: 'enemy.shamanHealer', count: 4, interval: 1.5, delayBefore: 1.0 },
        { enemyId: 'enemy.goblinRunner', count: 24, interval: 0.35, delayBefore: 3.0 }
      ]
    },
    {
      id: 'wave_10',
      waveNumber: 10,
      rewardGold: 220,
      earlyBonusGold: 70,
      groups: [
        { enemyId: 'enemy.orcBrute', count: 10, interval: 1.1, delayBefore: 0 },
        { enemyId: 'enemy.riftKnight', count: 8, interval: 1.2, delayBefore: 2.0 },
        { enemyId: 'enemy.shamanHealer', count: 4, interval: 1.5, delayBefore: 3.0 },
        { enemyId: 'enemy.goblinRunner', count: 30, interval: 0.3, delayBefore: 5.0 }
      ]
    }
  ]
};
