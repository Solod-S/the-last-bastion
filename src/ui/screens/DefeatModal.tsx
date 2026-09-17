import React from 'react';
import { useGameStore } from '../store/gameStore';
import { gameEventBus, GameEvents } from '../../game/events/gameEventBus';
import { i18n } from '../../services/localization/i18n';
import { audioManager } from '../../services/audio/audioManager';
import { RotateCcw, Skull, ShieldOff, Clock } from 'lucide-react';

export const DefeatModal: React.FC = () => {
  const defeatStats = useGameStore((state) => state.defeatStats);

  if (!defeatStats) return null;

  const { waveReached, totalWaves, enemiesDefeated, timeElapsedSeconds } = defeatStats;

  const handleRetry = () => {
    audioManager.ensureAudioUnlocked();
    audioManager.playUi();
    useGameStore.setState({ defeatStats: null });
    gameEventBus.emit(GameEvents.CMD_RESTART_MISSION, null);
  };

  const minutes = Math.floor(timeElapsedSeconds / 60);
  const seconds = timeElapsedSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(15, 7, 7, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        className="fantasy-panel"
        style={{
          width: 440,
          padding: '32px',
          textAlign: 'center',
          border: '2px solid #ef4444',
          boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 35px rgba(239, 68, 68, 0.35)'
        }}
      >
        <ShieldOff size={48} color="#ef4444" style={{ margin: '0 auto 12px' }} />

        <h1
          style={{
            fontFamily: 'var(--font-fantasy)',
            fontSize: 30,
            fontWeight: 900,
            color: '#f87171',
            margin: '0 0 4px',
            textShadow: '0 0 15px rgba(239, 68, 68, 0.6)'
          }}
        >
          {i18n.t('mission.defeat.title')}
        </h1>
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>
          {i18n.t('mission.defeat.desc')}
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '16px',
            borderRadius: 8,
            marginBottom: 24,
            border: '1px solid #334155'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span style={{ color: '#94a3b8' }}>Волна: </span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>
              {waveReached} / {totalWaves}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <Skull size={18} color="#ef4444" />
            <span style={{ color: '#94a3b8' }}>Убито: </span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{enemiesDefeated}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, gridColumn: 'span 2' }}>
            <Clock size={18} color="#a855f7" />
            <span style={{ color: '#94a3b8' }}>Время обороны: </span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{timeFormatted}</span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="fantasy-btn"
            onClick={() => {
              audioManager.ensureAudioUnlocked();
              audioManager.playUi();
              useGameStore.setState({ defeatStats: null, isCampaignMapOpen: true });
            }}
            style={{ flex: 1, justifyContent: 'center', padding: '12px 16px', fontSize: 14 }}
          >
            <span>{i18n.t('campaign.map.title') || 'Карта кампании'}</span>
          </button>

          <button
            className="fantasy-btn fantasy-btn-primary"
            onClick={handleRetry}
            style={{ flex: 1, justifyContent: 'center', padding: '12px 16px', fontSize: 14 }}
          >
            <RotateCcw size={16} />
            <span>{i18n.t('mission.defeat.retry') || 'Попробовать снова'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
