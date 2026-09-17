import { WaveDefinition, WaveSetDefinition } from '../types/waves';
import { calculateEarlyWaveBonus } from '../economy/economy';

export type WaveState = 'waiting_to_start' | 'countdown' | 'spawning' | 'active' | 'completed' | 'victory';

export interface WaveSpawnItem {
  enemyId: string;
}

export class WaveManager {
  private waveSet: WaveSetDefinition;
  private currentWaveIndex: number = -1;
  private state: WaveState = 'waiting_to_start';
  
  private countdownDuration: number = 10;
  private countdownRemaining: number = 10;

  // Spawning state for the current wave
  private currentGroupIndex: number = 0;
  private currentGroupSpawned: number = 0;
  private groupDelayTimer: number = 0;
  private spawnIntervalTimer: number = 0;
  private totalEnemiesInWave: number = 0;
  private activeEnemiesCount: number = 0;

  constructor(waveSet: WaveSetDefinition, initialCountdown: number = 5) {
    this.waveSet = waveSet;
    this.countdownDuration = initialCountdown;
    this.countdownRemaining = initialCountdown;
    this.state = 'countdown';
  }

  get currentWaveNumber(): number {
    return this.currentWaveIndex + 1;
  }

  get totalWaves(): number {
    return this.waveSet.waves.length;
  }

  get currentWave(): WaveDefinition | null {
    if (this.currentWaveIndex >= 0 && this.currentWaveIndex < this.waveSet.waves.length) {
      return this.waveSet.waves[this.currentWaveIndex];
    }
    return null;
  }

  get waveState(): WaveState {
    return this.state;
  }

  get countdown(): number {
    return Math.max(0, Math.ceil(this.countdownRemaining));
  }

  get isLastWave(): boolean {
    return this.currentWaveIndex === this.waveSet.waves.length - 1;
  }

  get totalWaveEnemies(): number {
    return this.totalEnemiesInWave;
  }

  get activeEnemies(): number {
    return this.activeEnemiesCount;
  }

  /**
   * Triggers the wave immediately (early call), returns bonus gold.
   */
  startWaveEarly(): { bonusGold: number; waveNumber: number } {
    if (this.state !== 'countdown' && this.state !== 'waiting_to_start') {
      return { bonusGold: 0, waveNumber: this.currentWaveNumber };
    }

    const nextWave = this.waveSet.waves[this.currentWaveIndex + 1];
    const bonus = nextWave
      ? calculateEarlyWaveBonus(nextWave.earlyBonusGold, this.countdownRemaining, this.countdownDuration)
      : 0;

    this.startNextWave();
    return { bonusGold: bonus, waveNumber: this.currentWaveNumber };
  }

  startNextWave(): void {
    if (this.currentWaveIndex + 1 >= this.waveSet.waves.length) {
      return;
    }

    this.currentWaveIndex++;
    const wave = this.waveSet.waves[this.currentWaveIndex];
    this.state = 'spawning';
    this.currentGroupIndex = 0;
    this.currentGroupSpawned = 0;
    this.groupDelayTimer = wave.groups[0]?.delayBefore ?? 0;
    this.spawnIntervalTimer = 0;

    this.totalEnemiesInWave = wave.groups.reduce((sum, g) => sum + g.count, 0);
    this.activeEnemiesCount = 0;
  }

  /**
   * Advances wave logic by delta time (scaled). Returns any enemies to spawn.
   */
  update(deltaSeconds: number): WaveSpawnItem[] {
    const spawns: WaveSpawnItem[] = [];

    if (this.state === 'countdown') {
      this.countdownRemaining -= deltaSeconds;
      if (this.countdownRemaining <= 0) {
        this.startNextWave();
      }
      return spawns;
    }

    if (this.state === 'spawning') {
      const wave = this.currentWave;
      if (!wave) return spawns;

      const group = wave.groups[this.currentGroupIndex];
      if (!group) {
        // All groups finished spawning
        this.state = 'active';
        return spawns;
      }

      // Handle group delay before start
      if (this.groupDelayTimer > 0) {
        this.groupDelayTimer -= deltaSeconds;
        return spawns;
      }

      // Handle spawn interval
      this.spawnIntervalTimer -= deltaSeconds;
      if (this.spawnIntervalTimer <= 0) {
        spawns.push({ enemyId: group.enemyId });
        this.currentGroupSpawned++;
        this.activeEnemiesCount++;
        this.spawnIntervalTimer = group.interval;

        if (this.currentGroupSpawned >= group.count) {
          // Advance to next group
          this.currentGroupIndex++;
          this.currentGroupSpawned = 0;
          const nextGroup = wave.groups[this.currentGroupIndex];
          this.groupDelayTimer = nextGroup?.delayBefore ?? 0;
          this.spawnIntervalTimer = 0;

          if (!nextGroup) {
            this.state = 'active';
          }
        }
      }
    }

    return spawns;
  }

  onEnemyDefeatedOrLeaked(): { waveCompleted: boolean; allCompleted: boolean; rewardGold: number } {
    this.activeEnemiesCount = Math.max(0, this.activeEnemiesCount - 1);

    if (this.state === 'active' && this.activeEnemiesCount === 0) {
      const reward = this.currentWave?.rewardGold ?? 0;
      if (this.isLastWave) {
        this.state = 'victory';
        return { waveCompleted: true, allCompleted: true, rewardGold: reward };
      } else {
        this.state = 'countdown';
        this.countdownDuration = 10;
        this.countdownRemaining = 10;
        return { waveCompleted: true, allCompleted: false, rewardGold: reward };
      }
    }

    return { waveCompleted: false, allCompleted: false, rewardGold: 0 };
  }
}
