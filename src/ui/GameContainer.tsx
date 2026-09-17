import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createPhaserGame } from '../game/phaserGame';
import { initGameStoreBridge, useGameStore } from './store/gameStore';
import { gameEventBus, GameEvents } from '../game/events/gameEventBus';
import { audioManager } from '../services/audio/audioManager';
import { SaveService } from '../services/save/saveService';
import { i18n } from '../services/localization/i18n';
import { TopHud } from './hud/TopHud';
import { BuildMenu } from './panels/BuildMenu';
import { TowerInspector } from './panels/TowerInspector';
import { EnemyInspector } from './panels/EnemyInspector';
import { BriefingModal } from './screens/BriefingModal';
import { VictoryModal } from './screens/VictoryModal';
import { DefeatModal } from './screens/DefeatModal';
import { SettingsModal } from './screens/SettingsModal';
import { BossHealthBar } from './hud/BossHealthBar';
import { HeroAndSpellsPanel } from './hud/HeroAndSpellsPanel';
import { CampaignMapModal } from './screens/CampaignMapModal';
import { TechTreeModal } from './screens/TechTreeModal';
import { DevTools } from './debug/DevTools';
import './theme.css';

export const GameContainer: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  const clearSelection = useGameStore((state) => state.clearSelection);
  const setSettingsOpen = useGameStore((state) => state.setSettingsOpen);
  const isSettingsOpen = useGameStore((state) => state.isSettingsOpen);
  const setDevToolsOpen = useGameStore((state) => state.setDevToolsOpen);
  const isDevToolsOpen = useGameStore((state) => state.isDevToolsOpen);

  useEffect(() => {
    if (!gameContainerRef.current) return;

    // Synchronize language and settings from profile
    const profile = SaveService.load();
    if (profile?.settings?.gameplay?.language) {
      i18n.setLanguage(profile.settings.gameplay.language);
    }

    // Initialize audio system
    audioManager.init();

    // Initialize store bridge
    const cleanupBridge = initGameStoreBridge();

    // Mount Phaser
    if (!phaserGameRef.current) {
      phaserGameRef.current = createPhaserGame(gameContainerRef.current);
    }

    // Keyboard Hotkeys
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      audioManager.ensureAudioUnlocked();

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          gameEventBus.emit(GameEvents.CMD_TOGGLE_PAUSE, null);
          break;
        case 'Digit1':
          gameEventBus.emit(GameEvents.CMD_SET_SPEED, 1);
          break;
        case 'Digit2':
          gameEventBus.emit(GameEvents.CMD_SET_SPEED, 2);
          break;
        case 'Digit3':
          gameEventBus.emit(GameEvents.CMD_SET_SPEED, 3);
          break;
        case 'KeyW':
          gameEventBus.emit(GameEvents.CMD_START_WAVE_EARLY, null);
          break;
        case 'Backquote': // ~ or `
          setDevToolsOpen(!isDevToolsOpen);
          break;
        case 'Escape':
          if (isSettingsOpen) {
            setSettingsOpen(false);
          } else {
            clearSelection();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cleanupBridge();
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#090d14'
      }}
      onClick={() => audioManager.ensureAudioUnlocked()}
    >
      {/* Phaser Canvas Container */}
      <div
        ref={gameContainerRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />

      {/* React UI Overlays */}
      <TopHud />
      <BossHealthBar />
      <HeroAndSpellsPanel />
      <BuildMenu />
      <TowerInspector />
      <EnemyInspector />
      <CampaignMapModal />
      <TechTreeModal />
      <BriefingModal />
      <VictoryModal />
      <DefeatModal />
      <SettingsModal />
      <DevTools />
    </div>
  );
};
