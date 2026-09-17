import { describe, it, expect } from 'vitest';
import { WaveManager } from '../src/core/waves/waveManager';
import { WaveSetDefinition } from '../src/core/types/waves';

describe('WaveManager System', () => {
  const mockWaveSet: WaveSetDefinition = {
    id: 'test_waves',
    missionId: 'test_mission',
    waves: [
      {
        id: 'wave_1',
        waveNumber: 1,
        rewardGold: 30,
        earlyBonusGold: 20,
        groups: [
          { enemyId: 'enemy.goblinRunner', count: 2, interval: 1.0, delayBefore: 0 }
        ]
      },
      {
        id: 'wave_2',
        waveNumber: 2,
        rewardGold: 50,
        earlyBonusGold: 30,
        groups: [
          { enemyId: 'enemy.orcBrute', count: 1, interval: 1.0, delayBefore: 0 }
        ]
      }
    ]
  };

  it('starts in countdown state and transitions to spawning on countdown expiry', () => {
    const wm = new WaveManager(mockWaveSet, 3);
    expect(wm.waveState).toBe('countdown');
    expect(wm.countdown).toBe(3);

    // Advance 3.1 seconds
    wm.update(3.1);
    expect(wm.waveState).toBe('spawning');
    expect(wm.currentWaveNumber).toBe(1);
  });

  it('spawns enemies according to group configuration', () => {
    const wm = new WaveManager(mockWaveSet, 1);
    wm.startNextWave();

    // First enemy spawns immediately on timer <= 0
    const spawns1 = wm.update(0.1);
    expect(spawns1.length).toBe(1);
    expect(spawns1[0].enemyId).toBe('enemy.goblinRunner');

    // Interval is 1.0s, so advancing 0.5s shouldn't spawn yet
    const spawns2 = wm.update(0.5);
    expect(spawns2.length).toBe(0);

    // Advance remaining 0.6s -> second enemy spawns
    const spawns3 = wm.update(0.6);
    expect(spawns3.length).toBe(1);
    expect(wm.waveState).toBe('active');
  });

  it('calculates early wave call bonus gold properly', () => {
    const wm = new WaveManager(mockWaveSet, 10);
    const { bonusGold } = wm.startWaveEarly();
    expect(bonusGold).toBeGreaterThan(0);
    expect(wm.currentWaveNumber).toBe(1);
  });

  it('detects wave completion and final victory', () => {
    const wm = new WaveManager(mockWaveSet, 1);
    wm.startNextWave();
    wm.update(0.1);
    wm.update(1.1);

    // 2 enemies active in wave 1
    const res1 = wm.onEnemyDefeatedOrLeaked();
    expect(res1.waveCompleted).toBe(false);

    const res2 = wm.onEnemyDefeatedOrLeaked();
    expect(res2.waveCompleted).toBe(true);
    expect(res2.allCompleted).toBe(false);
    expect(res2.rewardGold).toBe(30);

    // Wave 2 is last wave
    wm.startNextWave();
    wm.update(0.1);

    const res3 = wm.onEnemyDefeatedOrLeaked();
    expect(res3.waveCompleted).toBe(true);
    expect(res3.allCompleted).toBe(true);
    expect(wm.waveState).toBe('victory');
  });
});
