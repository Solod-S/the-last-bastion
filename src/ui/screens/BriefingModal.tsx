import React from 'react';
import { useGameStore } from '../store/gameStore';
import { i18n } from '../../services/localization/i18n';
import { audioManager } from '../../services/audio/audioManager';
import { ShieldCheck, Play, Swords } from 'lucide-react';

export const BriefingModal: React.FC = () => {
  const isBriefingOpen = useGameStore((state) => state.isBriefingOpen);
  const setBriefingOpen = useGameStore((state) => state.setBriefingOpen);

  if (!isBriefingOpen) return null;

  const handleStart = () => {
    audioManager.ensureAudioUnlocked();
    audioManager.playUi();
    audioManager.playWaveHorn();
    setBriefingOpen(false);
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        backdropFilter: 'blur(6px)'
      }}
    >
      <div
        className="fantasy-panel"
        style={{
          width: 520,
          padding: '28px 32px',
          border: '2px solid #3b82f6',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(37, 99, 235, 0.3)'
        }}
      >
        {/* Heraldic Shield */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: '2px solid #93c5fd',
            boxShadow: '0 0 16px rgba(59, 130, 246, 0.5)'
          }}
        >
          <Swords size={28} color="#ffffff" />
        </div>

        {/* Region & Mission Title */}
        <div style={{ fontSize: 12, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>
          {i18n.t('map.greenlands.forestRoad.name')}
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-fantasy)',
            fontSize: 24,
            color: '#f8fafc',
            margin: '6px 0 16px',
            fontWeight: 800
          }}
        >
          {i18n.t('mission.greenlands.01.name')}
        </h2>

        {/* Narrative Box */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '16px 20px',
            borderRadius: 6,
            border: '1px solid #334155',
            fontSize: 14,
            lineHeight: 1.6,
            color: '#cbd5e1',
            fontStyle: 'italic',
            marginBottom: 20
          }}
        >
          "{i18n.t('mission.greenlands.01.story')}"
        </div>

        {/* Objectives */}
        <div
          style={{
            textAlign: 'left',
            background: 'rgba(30, 41, 59, 0.4)',
            padding: '12px 16px',
            borderRadius: 6,
            marginBottom: 24
          }}
        >
          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>
            Цели миссии:
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#e2e8f0', marginBottom: 4 }}>
            <ShieldCheck size={16} color="#22c55e" />
            <span>Отразить все 6 волн врагов Разлома</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#e2e8f0' }}>
            <ShieldCheck size={16} color="#22c55e" />
            <span>Защитить крепостные ворота Бастиона</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          className="fantasy-btn fantasy-btn-primary"
          onClick={handleStart}
          style={{
            width: '100%',
            padding: '12px 24px',
            fontSize: 16,
            justifyContent: 'center',
            letterSpacing: 0.5
          }}
        >
          <Play size={18} fill="currentColor" />
          <span>Вступить в бой!</span>
        </button>
      </div>
    </div>
  );
};
