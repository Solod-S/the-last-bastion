import React from 'react';
import { useGameStore } from '../store/gameStore';
import { gameEventBus, GameEvents } from '../../game/events/gameEventBus';
import { i18n } from '../../services/localization/i18n';
import { audioManager } from '../../services/audio/audioManager';
import {
  Heart,
  Coins,
  ShieldAlert,
  Play,
  Pause,
  FastForward,
  Settings,
  Wrench,
  Flame,
  Map,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const TopHud: React.FC = () => {
  const gameState = useGameStore((state) => state.gameState);
  const setSettingsOpen = useGameStore((state) => state.setSettingsOpen);
  const setDevToolsOpen = useGameStore((state) => state.setDevToolsOpen);
  const isDevToolsOpen = useGameStore((state) => state.isDevToolsOpen);

  const { lives, maxLives, gold, waveNumber, totalWaves, waveState, countdown, timeScale, isPaused, isBossWave } =
    gameState;

  const handleStartWaveEarly = () => {
    audioManager.ensureAudioUnlocked();
    gameEventBus.emit(GameEvents.CMD_START_WAVE_EARLY, null);
  };

  const handleSpeedChange = (speed: number) => {
    audioManager.ensureAudioUnlocked();
    gameEventBus.emit(GameEvents.CMD_SET_SPEED, speed);
  };

  const handleTogglePause = () => {
    audioManager.ensureAudioUnlocked();
    gameEventBus.emit(GameEvents.CMD_TOGGLE_PAUSE, null);
  };

  const isCountdown = waveState === 'countdown';

  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: 16,
        right: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 50
      }}
    >
      {/* Left: Player Resources (Lives, Gold) */}
      <div style={{ display: 'flex', gap: 12, pointerEvents: 'auto' }}>
        {/* Lives */}
        <div
          className="fantasy-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderLeft: '4px solid #ef4444'
          }}
        >
          <Heart size={20} color="#ef4444" fill="#ef4444" />
          <div>
            <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {i18n.t('ui.lives')}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-fantasy)' }}>
              {lives} <span style={{ fontSize: 12, color: '#64748b' }}>/ {maxLives}</span>
            </div>
          </div>
        </div>

        {/* Gold */}
        <div
          className="fantasy-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderLeft: '4px solid #f59e0b'
          }}
        >
          <Coins size={20} color="#fbbf24" />
          <div>
            <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {i18n.t('ui.gold')}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fef08a', fontFamily: 'var(--font-fantasy)' }}>
              {gold}
            </div>
          </div>
        </div>
      </div>

      {/* Center: Wave Indicator & Call Wave Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, pointerEvents: 'auto' }}>
        <div
          className="fantasy-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 20px',
            borderBottom: isBossWave ? '3px solid #dc2626' : '3px solid #2563eb'
          }}
        >
          {isBossWave ? <Flame size={20} color="#ef4444" /> : <ShieldAlert size={20} color="#38bdf8" />}
          <div>
            <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase' }}>
              {i18n.t('ui.wave')}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: isBossWave ? '#fca5a5' : '#f8fafc',
                fontFamily: 'var(--font-fantasy)'
              }}
            >
              {waveNumber} <span style={{ fontSize: 12, color: '#64748b' }}>{i18n.t('ui.wave_of')} {totalWaves}</span>
            </div>
          </div>
        </div>

        {/* Early Call Button */}
        {isCountdown && (
          <button
            className="fantasy-btn fantasy-btn-gold"
            onClick={handleStartWaveEarly}
            style={{
              padding: '10px 18px',
              fontSize: 14,
              animation: 'pulse 1.5s infinite'
            }}
          >
            <Play size={16} fill="currentColor" />
            <span>
              {i18n.t('ui.next_wave')} ({countdown}s)
            </span>
          </button>
        )}
      </div>

      {/* Right: Game Speed, Settings, DevTools */}
      <div style={{ display: 'flex', gap: 8, pointerEvents: 'auto' }}>
        {/* Pause */}
        <button
          className={`fantasy-btn ${isPaused ? 'fantasy-btn-primary' : ''}`}
          onClick={handleTogglePause}
          title="Pause (Space)"
        >
          {isPaused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
        </button>

        {/* 1x Speed */}
        <button
          className={`fantasy-btn ${!isPaused && timeScale === 1 ? 'fantasy-btn-primary' : ''}`}
          onClick={() => handleSpeedChange(1)}
        >
          1x
        </button>

        {/* 2x Speed */}
        <button
          className={`fantasy-btn ${!isPaused && timeScale === 2 ? 'fantasy-btn-primary' : ''}`}
          onClick={() => handleSpeedChange(2)}
        >
          2x
        </button>

        {/* 3x Speed */}
        <button
          className={`fantasy-btn ${!isPaused && timeScale === 3 ? 'fantasy-btn-primary' : ''}`}
          onClick={() => handleSpeedChange(3)}
        >
          <FastForward size={16} /> 3x
        </button>

        {/* Campaign Map */}
        <button
          className="fantasy-btn fantasy-btn-primary"
          onClick={() => {
            audioManager.playUi();
            useGameStore.setState({ isCampaignMapOpen: true });
          }}
          title={i18n.t('campaign.map.title') || 'Карта кампании'}
        >
          <Map size={16} />
        </button>

        {/* Tech Tree */}
        <button
          className="fantasy-btn fantasy-btn-gold"
          onClick={() => {
            audioManager.playUi();
            useGameStore.setState({ isTechTreeOpen: true });
          }}
          title={i18n.t('tech_tree.title') || 'Улучшения Бастиона'}
        >
          <Sparkles size={16} />
        </button>

        {/* Codex */}
        <button
          className="fantasy-btn fantasy-btn-primary"
          onClick={() => {
            audioManager.playUi();
            useGameStore.setState({ isCodexOpen: true });
          }}
          title="Кодекс Бастиона (Бестиарий, Башни, Герои, Лор)"
        >
          <BookOpen size={16} />
        </button>

        {/* Settings */}
        <button
          className="fantasy-btn"
          onClick={() => {
            audioManager.playUi();
            setSettingsOpen(true);
          }}
          title={i18n.t('game.settings')}
        >
          <Settings size={16} />
        </button>

        {/* DevTools */}
        <button
          className={`fantasy-btn ${isDevToolsOpen ? 'fantasy-btn-gold' : ''}`}
          onClick={() => {
            audioManager.playUi();
            setDevToolsOpen(!isDevToolsOpen);
          }}
          title="Developer Cheats"
        >
          <Wrench size={16} />
        </button>
      </div>
    </div>
  );
};
