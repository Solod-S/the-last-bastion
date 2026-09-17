import { create } from 'zustand';
import {
  gameEventBus,
  GameEvents,
  GameStateSnapshot,
  SelectedTowerInfo,
  SelectedSlotInfo,
  InspectedEnemyInfo,
  VictoryStats,
  DefeatStats,
  BossStateSnapshot
} from '../../game/events/gameEventBus';
import { HeroRuntimeState } from '../../core/types/hero';
import { CommanderSpellRuntimeState } from '../../core/types/spells';

interface GameStoreState {
  // Snapshot
  gameState: GameStateSnapshot;
  selectedSlot: SelectedSlotInfo | null;
  selectedTower: SelectedTowerInfo | null;
  inspectedEnemy: InspectedEnemyInfo | null;
  victoryStats: VictoryStats | null;
  defeatStats: DefeatStats | null;
  bossState: BossStateSnapshot | null;
  heroState: HeroRuntimeState | null;
  spellsState: Record<string, CommanderSpellRuntimeState>;
  activeSpellToCast: string | null;
  isPlacingHero: boolean;

  // Modals & Navigation
  currentMissionId: string;
  isBriefingOpen: boolean;
  isSettingsOpen: boolean;
  isDevToolsOpen: boolean;
  isCampaignMapOpen: boolean;
  isTechTreeOpen: boolean;
  isCodexOpen: boolean;

  // Actions
  setCurrentMissionId: (id: string) => void;
  setBriefingOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setDevToolsOpen: (open: boolean) => void;
  setCampaignMapOpen: (open: boolean) => void;
  setTechTreeOpen: (open: boolean) => void;
  setCodexOpen: (open: boolean) => void;
  setActiveSpellToCast: (spellId: string | null) => void;
  setIsPlacingHero: (placing: boolean) => void;
  clearSelection: () => void;
}

const defaultSnapshot: GameStateSnapshot = {
  lives: 20,
  maxLives: 20,
  gold: 250,
  waveNumber: 1,
  totalWaves: 8,
  waveState: 'countdown',
  countdown: 6,
  activeEnemies: 0,
  timeScale: 1,
  isPaused: false
};

export const useGameStore = create<GameStoreState>((set) => ({
  gameState: defaultSnapshot,
  selectedSlot: null,
  selectedTower: null,
  inspectedEnemy: null,
  victoryStats: null,
  defeatStats: null,
  bossState: null,
  heroState: null,
  spellsState: {},
  activeSpellToCast: null,
  isPlacingHero: false,

  currentMissionId: 'mission.greenlands.01',
  isBriefingOpen: false, // Initially false so player can see campaign or start
  isSettingsOpen: false,
  isDevToolsOpen: false,
  isCampaignMapOpen: false,
  isTechTreeOpen: false,
  isCodexOpen: false,

  setCurrentMissionId: (id) => set({ currentMissionId: id }),
  setBriefingOpen: (open) => set({ isBriefingOpen: open }),
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  setDevToolsOpen: (open) => set({ isDevToolsOpen: open }),
  setCampaignMapOpen: (open) => set({ isCampaignMapOpen: open }),
  setTechTreeOpen: (open) => set({ isTechTreeOpen: open }),
  setCodexOpen: (open) => set({ isCodexOpen: open }),
  setActiveSpellToCast: (spellId) => set({ activeSpellToCast: spellId, isPlacingHero: false }),
  setIsPlacingHero: (placing) => set({ isPlacingHero: placing, activeSpellToCast: null }),
  clearSelection: () => {
    set({ selectedSlot: null, selectedTower: null, activeSpellToCast: null, isPlacingHero: false });
    gameEventBus.emit(GameEvents.CMD_DESELECT, null);
  }
}));

// Setup listener bindings to GameEvents
export function initGameStoreBridge(): () => void {
  const unsubs: (() => void)[] = [
    gameEventBus.on(GameEvents.STATE_UPDATED, (snapshot: GameStateSnapshot) => {
      useGameStore.setState({ gameState: snapshot });
    }),
    gameEventBus.on(GameEvents.SLOT_SELECTED, (slot: SelectedSlotInfo) => {
      useGameStore.setState({ selectedSlot: slot, selectedTower: null, activeSpellToCast: null, isPlacingHero: false });
    }),
    gameEventBus.on(GameEvents.TOWER_SELECTED, (tower: SelectedTowerInfo) => {
      useGameStore.setState({ selectedTower: tower, selectedSlot: null, activeSpellToCast: null, isPlacingHero: false });
    }),
    gameEventBus.on(GameEvents.SELECTION_CLEARED, () => {
      useGameStore.setState({ selectedSlot: null, selectedTower: null, activeSpellToCast: null, isPlacingHero: false });
    }),
    gameEventBus.on(GameEvents.ENEMY_INSPECTED, (enemy: InspectedEnemyInfo) => {
      useGameStore.setState({ inspectedEnemy: enemy });
    }),
    gameEventBus.on(GameEvents.ENEMY_INSPECT_CLEARED, () => {
      useGameStore.setState({ inspectedEnemy: null });
    }),
    gameEventBus.on(GameEvents.MISSION_VICTORY, (stats: VictoryStats) => {
      useGameStore.setState({ victoryStats: stats, bossState: null });
    }),
    gameEventBus.on(GameEvents.MISSION_DEFEAT, (stats: DefeatStats) => {
      useGameStore.setState({ defeatStats: stats, bossState: null });
    }),
    gameEventBus.on(GameEvents.BOSS_SPAWNED, (boss: BossStateSnapshot) => {
      useGameStore.setState({ bossState: boss });
    }),
    gameEventBus.on(GameEvents.BOSS_HEALTH_UPDATED, (update: { currentHp: number; maxHp: number; phase: number }) => {
      const current = useGameStore.getState().bossState;
      if (current) {
        useGameStore.setState({
          bossState: {
            ...current,
            currentHp: update.currentHp,
            maxHp: update.maxHp,
            phase: update.phase
          }
        });
      }
    }),
    gameEventBus.on(GameEvents.BOSS_DEFEATED, () => {
      useGameStore.setState({ bossState: null });
    }),
    gameEventBus.on(GameEvents.HERO_STATE_CHANGED, (hero: HeroRuntimeState) => {
      useGameStore.setState({ heroState: hero });
    }),
    gameEventBus.on(GameEvents.SPELL_STATE_CHANGED, (spell: CommanderSpellRuntimeState) => {
      const spells = { ...useGameStore.getState().spellsState, [spell.spellId]: spell };
      useGameStore.setState({ spellsState: spells });
    }),
    gameEventBus.on(GameEvents.CMD_OPEN_CAMPAIGN_MAP, () => {
      useGameStore.setState({ isCampaignMapOpen: true });
    }),
    gameEventBus.on(GameEvents.CMD_OPEN_TECH_TREE, () => {
      useGameStore.setState({ isTechTreeOpen: true });
    })
  ];

  return () => unsubs.forEach((u) => u());
}
