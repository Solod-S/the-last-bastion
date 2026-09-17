import { TargetPriority } from '../../core/types/combat';
import { TowerClass } from '../../core/types/towers';
import { EnemyDefinition } from '../../core/types/enemies';

export interface GameStateSnapshot {
  lives: number;
  maxLives: number;
  gold: number;
  waveNumber: number;
  totalWaves: number;
  waveState: string;
  countdown: number;
  activeEnemies: number;
  timeScale: number;
  isPaused: boolean;
  isBossWave?: boolean;
}

export interface SelectedTowerInfo {
  slotId: string;
  towerClass: TowerClass;
  level: number;
  maxLevel: number;
  damage: number;
  damageType: string;
  attacksPerSecond: number;
  range: number;
  priority: TargetPriority;
  upgradeCost: number | null;
  sellRefund: number;
  x: number;
  y: number;
  customStats?: Record<string, string | number>;
}

export interface SelectedSlotInfo {
  slotId: string;
  x: number;
  y: number;
  allowedTypes: TowerClass[];
}

export interface InspectedEnemyInfo {
  id: string;
  definition: EnemyDefinition;
  currentHp: number;
  maxHp: number;
  armor: number;
  magicResistance: number;
  speed: number;
  x: number;
  y: number;
}

export interface VictoryStats {
  missionId: string;
  nextMissionId?: string;
  stars: number;
  livesRemaining: number;
  goldEarned: number;
  enemiesDefeated: number;
  towersBuilt: number;
  timeElapsedSeconds: number;
}

export interface DefeatStats {
  missionId: string;
  waveReached: number;
  totalWaves: number;
  enemiesDefeated: number;
  goldEarned: number;
  timeElapsedSeconds: number;
}

export interface BossStateSnapshot {
  id: string;
  name: string;
  currentHp: number;
  maxHp: number;
  phase: number;
}

type EventListener<T = any> = (payload: T) => void;

class EventBus {
  private listeners = new Map<string, Set<EventListener>>();

  on<T>(event: string, callback: EventListener<T>): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(callback);
    return () => {
      set?.delete(callback);
    };
  }

  emit<T>(event: string, payload: T): void {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`[EventBus] Error in listener for event "${event}":`, err);
        }
      });
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}

export const GameEvents = {
  // Game -> UI
  STATE_UPDATED: 'game:state_updated',
  SLOT_SELECTED: 'game:slot_selected',
  TOWER_SELECTED: 'game:tower_selected',
  SELECTION_CLEARED: 'game:selection_cleared',
  ENEMY_INSPECTED: 'game:enemy_inspected',
  ENEMY_INSPECT_CLEARED: 'game:enemy_inspect_cleared',
  PROP_ACTIVATED: 'game:prop_activated',
  MISSION_VICTORY: 'game:mission_victory',
  MISSION_DEFEAT: 'game:mission_defeat',

  // Boss
  BOSS_SPAWNED: 'game:boss_spawned',
  BOSS_HEALTH_UPDATED: 'game:boss_health_updated',
  BOSS_DEFEATED: 'game:boss_defeated',

  // Hero & Spells
  HERO_STATE_CHANGED: 'game:hero_state_changed',
  SPELL_STATE_CHANGED: 'game:spell_state_changed',

  // UI -> Game commands
  CMD_BUILD_TOWER: 'cmd:build_tower',
  CMD_UPGRADE_TOWER: 'cmd:upgrade_tower',
  CMD_SELL_TOWER: 'cmd:sell_tower',
  CMD_SET_PRIORITY: 'cmd:set_priority',
  CMD_START_WAVE_EARLY: 'cmd:start_wave_early',
  CMD_SET_SPEED: 'cmd:set_speed',
  CMD_TOGGLE_PAUSE: 'cmd:toggle_pause',
  CMD_TRIGGER_DEV_ACTION: 'cmd:trigger_dev_action',
  CMD_RESTART_MISSION: 'cmd:restart_mission',
  CMD_START_MISSION: 'cmd:start_mission',
  CMD_DESELECT: 'cmd:deselect',
  CMD_CAST_SPELL: 'cmd:cast_spell',
  CMD_HERO_MOVE: 'cmd:hero_move',
  CMD_HERO_ABILITY: 'cmd:hero_ability',
  CMD_OPEN_CAMPAIGN_MAP: 'cmd:open_campaign_map',
  CMD_OPEN_TECH_TREE: 'cmd:open_tech_tree'
};

export const gameEventBus = new EventBus();
