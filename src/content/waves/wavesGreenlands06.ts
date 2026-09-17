import { WaveSetDefinition } from '../../core/types/waves';

export const wavesGreenlands06: WaveSetDefinition = {
  id: 'waves.greenlands.06',
  missionId: 'mission.greenlands.06',
  waves: [
    {
      id: 'wave_1',
      waveNumber: 1,
      rewardGold: 50,
      earlyBonusGold: 20,
      groups: [
        { enemyId: 'enemy.troll', count: 2, interval: 3.0, delayBefore: 0 },
        { enemyId: 'enemy.goblinRunner', count: 8, interval: 0.8, delayBefore: 2.0 }
      ]
    },
    {
      id: 'wave_2',
      waveNumber: 2,
      rewardGold: 60,
      earlyBonusGold: 25,
      groups: [
        { enemyId: 'enemy.troll', count: 3, interval: 2.5, delayBefore: 0 },
        { enemyId: 'enemy.sapper', count: 6, interval: 1.0, delayBefore: 2.0 }
      ]
    },
    {
      id: 'wave_3',
      waveNumber: 3,
      rewardGold: 75,
      earlyBonusGold: 30,
      groups: [
        { enemyId: 'enemy.troll', count: 4, interval: 2.2, delayBefore: 0 },
        { enemyId: 'enemy.shamanHealer', count: 2, interval: 2.0, delayBefore: 1.0 }
      ]
    },
    {
      id: 'wave_4',
      waveNumber: 4,
      rewardGold: 90,
      earlyBonusGold: 35,
      groups: [
        { enemyId: 'enemy.orcBrute', count: 6, interval: 1.5, delayBefore: 0 },
        { enemyId: 'enemy.troll', count: 3, interval: 2.2, delayBefore: 2.0 },
        { enemyId: 'enemy.goblinRunner', count: 12, interval: 0.5, delayBefore: 4.0 }
      ]
    },
    {
      id: 'wave_5',
      waveNumber: 5,
      rewardGold: 105,
      earlyBonusGold: 40,
      groups: [
        { enemyId: 'enemy.riftKnight', count: 6, interval: 1.5, delayBefore: 0 },
        { enemyId: 'enemy.troll', count: 4, interval: 2.0, delayBefore: 2.0 }
      ]
    },
    {
      id: 'wave_6',
      waveNumber: 6,
      rewardGold: 120,
      earlyBonusGold: 45,
      groups: [
        { enemyId: 'enemy.troll', count: 5, interval: 1.8, delayBefore: 0 },
        { enemyId: 'enemy.shamanHealer', count: 3, interval: 1.8, delayBefore: 1.0 },
        { enemyId: 'enemy.sapper', count: 10, interval: 0.7, delayBefore: 3.0 }
      ]
    },
    {
      id: 'wave_7',
      waveNumber: 7,
      rewardGold: 135,
      earlyBonusGold: 50,
      groups: [
        { enemyId: 'enemy.orcBrute', count: 8, interval: 1.3, delayBefore: 0 },
        { enemyId: 'enemy.riftKnight', count: 6, interval: 1.4, delayBefore: 2.0 },
        { enemyId: 'enemy.troll', count: 4, interval: 2.0, delayBefore: 4.0 }
      ]
    },
    {
      id: 'wave_8',
      waveNumber: 8,
      rewardGold: 150,
      earlyBonusGold: 55,
      groups: [
        { enemyId: 'enemy.troll', count: 6, interval: 1.8, delayBefore: 0 },
        { enemyId: 'enemy.shamanHealer', count: 4, interval: 1.5, delayBefore: 1.0 },
        { enemyId: 'enemy.goblinRunner', count: 20, interval: 0.4, delayBefore: 3.0 }
      ]
    },
    {
      id: 'wave_9',
      waveNumber: 9,
      rewardGold: 170,
      earlyBonusGold: 60,
      groups: [
        { enemyId: 'enemy.riftKnight', count: 10, interval: 1.2, delayBefore: 0 },
        { enemyId: 'enemy.troll', count: 5, interval: 1.8, delayBefore: 2.0 },
        { enemyId: 'enemy.sapper', count: 12, interval: 0.6, delayBefore: 4.0 }
      ]
    },
    {
      id: 'wave_10',
      waveNumber: 10,
      rewardGold: 190,
      earlyBonusGold: 65,
      groups: [
        { enemyId: 'enemy.troll', count: 8, interval: 1.6, delayBefore: 0 },
        { enemyId: 'enemy.shamanHealer', count: 4, interval: 1.5, delayBefore: 1.0 },
        { enemyId: 'enemy.orcBrute', count: 8, interval: 1.2, delayBefore: 3.0 }
      ]
    },
    {
      id: 'wave_11',
      waveNumber: 11,
      rewardGold: 210,
      earlyBonusGold: 70,
      groups: [
        { enemyId: 'enemy.riftKnight', count: 12, interval: 1.1, delayBefore: 0 },
        { enemyId: 'enemy.troll', count: 6, interval: 1.7, delayBefore: 2.0 },
        { enemyId: 'enemy.sapper', count: 16, interval: 0.5, delayBefore: 4.0 }
      ]
    },
    {
      id: 'wave_12',
      waveNumber: 12,
      rewardGold: 230,
      earlyBonusGold: 75,
      groups: [
        { enemyId: 'enemy.troll', count: 8, interval: 1.5, delayBefore: 0 },
        { enemyId: 'enemy.shamanHealer', count: 5, interval: 1.4, delayBefore: 1.0 },
        { enemyId: 'enemy.riftKnight', count: 10, interval: 1.1, delayBefore: 3.0 },
        { enemyId: 'enemy.goblinRunner', count: 24, interval: 0.35, delayBefore: 5.0 }
      ]
    },
    {
      id: 'wave_13',
      waveNumber: 13,
      rewardGold: 250,
      earlyBonusGold: 80,
      groups: [
        { enemyId: 'enemy.orcBrute', count: 12, interval: 1.0, delayBefore: 0 },
        { enemyId: 'enemy.troll', count: 8, interval: 1.5, delayBefore: 2.0 },
        { enemyId: 'enemy.sapper', count: 18, interval: 0.5, delayBefore: 4.0 }
      ]
    },
    {
      id: 'wave_14',
      waveNumber: 14,
      rewardGold: 280,
      earlyBonusGold: 85,
      groups: [
        { enemyId: 'enemy.troll', count: 10, interval: 1.4, delayBefore: 0 },
        { enemyId: 'enemy.shamanHealer', count: 6, interval: 1.2, delayBefore: 1.0 },
        { enemyId: 'enemy.riftKnight', count: 14, interval: 1.0, delayBefore: 3.0 }
      ]
    },
    {
      id: 'wave_15',
      waveNumber: 15,
      rewardGold: 500,
      earlyBonusGold: 100,
      groups: [
        // BOSS WAVE: The Troll King emerges!
        { enemyId: 'enemy.trollKing', count: 1, interval: 1.0, delayBefore: 0 },
        { enemyId: 'enemy.shamanHealer', count: 4, interval: 1.8, delayBefore: 3.0 },
        { enemyId: 'enemy.troll', count: 4, interval: 2.2, delayBefore: 6.0 },
        { enemyId: 'enemy.sapper', count: 10, interval: 0.8, delayBefore: 10.0 }
      ]
    }
  ]
};
