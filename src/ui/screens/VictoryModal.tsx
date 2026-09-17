import React from 'react';
import { useGameStore } from '../store/gameStore';
import { gameEventBus, GameEvents } from '../../game/events/gameEventBus';
import { i18n } from '../../services/localization/i18n';
import { audioManager } from '../../services/audio/audioManager';
import { Star, RotateCcw, Trophy, Skull, Coins, Clock, Hammer, Heart } from 'lucide-react';

export const VictoryModal: React.FC = () => {
  const victoryStats = useGameStore((state) => state.victoryStats);

  if (!victoryStats) return null;

  const { stars, livesRemaining, goldEarned, enemiesDefeated, towersBuilt, timeElapsedSeconds } = victoryStats;

  const handleRestart = () => {
    audioManager.ensureAudioUnlocked();
    audioManager.playUi();
    useGameStore.setState({ victoryStats: null });
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
        backgroundColor: 'rgba(5, 8, 15, 0.88)',
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
          width: 480,
          padding: '32px',
          textAlign: 'center',
          border: '2px solid #fbbf24',
          boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 35px rgba(245, 158, 11, 0.35)'
        }}
      >
        <Trophy size={48} color="#fbbf24" style={{ margin: '0 auto 12px' }} />

        <h1
          style={{
            fontFamily: 'var(--font-fantasy)',
            fontSize: 32,
            fontWeight: 900,
            color: '#fef08a',
            margin: '0 0 4px',
            textShadow: '0 0 15px rgba(245, 158, 11, 0.6)'
          }}
        >
          {i18n.t('mission.victory.title')}
        </h1>
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>
          {i18n.t('mission.victory.desc')}
        </div>

        {/* 3 Stars */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              size={38}
              color={starIdx <= stars ? '#f59e0b' : '#334155'}
              fill={starIdx <= stars ? '#fbbf24' : 'none'}
              style={{ filter: starIdx <= stars ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.8))' : 'none' }}
            />
          ))}
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
            <Skull size={18} color="#ef4444" />
            <span style={{ color: '#94a3b8' }}>Побеждено: </span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{enemiesDefeated}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <Coins size={18} color="#fbbf24" />
            <span style={{ color: '#94a3b8' }}>Золото: </span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{goldEarned}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <Hammer size={18} color="#38bdf8" />
            <span style={{ color: '#94a3b8' }}>Башен: </span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{towersBuilt}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <Clock size={18} color="#a855f7" />
            <span style={{ color: '#94a3b8' }}>Время: </span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{timeFormatted}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, gridColumn: 'span 2', justifyContent: 'center' }}>
            <Heart size={18} color="#ef4444" fill="#ef4444" />
            <span style={{ color: '#94a3b8' }}>Жизни Бастиона: </span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{livesRemaining}</span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {victoryStats.nextMissionId && (
            <button
              className="fantasy-btn fantasy-btn-gold"
              onClick={() => {
                audioManager.ensureAudioUnlocked();
                audioManager.playUi();
                const nextId = victoryStats.nextMissionId!;
                useGameStore.setState({ victoryStats: null });
                gameEventBus.emit(GameEvents.CMD_START_MISSION, { missionId: nextId });
              }}
              style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: 15 }}
            >
              <span>{i18n.t('mission.victory.next_level') || 'Следующий рубеж'}</span>
            </button>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="fantasy-btn fantasy-btn-primary"
              onClick={() => {
                audioManager.ensureAudioUnlocked();
                audioManager.playUi();
                useGameStore.setState({ victoryStats: null, isCampaignMapOpen: true });
              }}
              style={{ flex: 1, justifyContent: 'center', padding: '10px 16px', fontSize: 14 }}
            >
              <span>{i18n.t('campaign.map.title') || 'Карта кампании'}</span>
            </button>

            <button
              className="fantasy-btn"
              onClick={handleRestart}
              style={{ flex: 1, justifyContent: 'center', padding: '10px 16px', fontSize: 14 }}
            >
              <RotateCcw size={16} />
              <span>{i18n.t('game.restart')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
