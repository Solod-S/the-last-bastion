import React from 'react';
import { useGameStore } from '../store/gameStore';
import { i18n } from '../../services/localization/i18n';
import { Skull, Flame } from 'lucide-react';

export const BossHealthBar: React.FC = () => {
  const bossState = useGameStore((state) => state.bossState);

  if (!bossState) return null;

  const { name, currentHp, maxHp, phase } = bossState;
  const ratio = Math.max(0, Math.min(1, currentHp / maxHp));
  const isEnraged = phase >= 3;

  return (
    <div
      style={{
        position: 'absolute',
        top: 76,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 55,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4
      }}
    >
      {/* Title & Phase */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'var(--font-fantasy)',
          fontSize: 16,
          fontWeight: 900,
          color: isEnraged ? '#f87171' : '#fef08a',
          textShadow: isEnraged
            ? '0 0 12px rgba(239, 68, 68, 0.9)'
            : '0 0 10px rgba(245, 158, 11, 0.7)',
          letterSpacing: 1.5,
          textTransform: 'uppercase'
        }}
      >
        <Skull size={18} color={isEnraged ? '#ef4444' : '#fbbf24'} />
        <span>{i18n.t(name) || name}</span>
        {isEnraged && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              color: '#ef4444',
              fontWeight: 700
            }}
          >
            <Flame size={14} /> ENRAGED!
          </span>
        )}
      </div>

      {/* Health Bar Container */}
      <div
        style={{
          position: 'relative',
          width: 440,
          height: 18,
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          border: '2px solid #7f1d1d',
          borderRadius: 6,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 15px rgba(239, 68, 68, 0.3)'
        }}
      >
        {/* Fill */}
        <div
          style={{
            width: `${ratio * 100}%`,
            height: '100%',
            background: isEnraged
              ? 'linear-gradient(90deg, #dc2626, #ef4444, #f87171)'
              : 'linear-gradient(90deg, #991b1b, #dc2626, #f97316)',
            transition: 'width 0.15s ease'
          }}
        />

        {/* Phase Dividers */}
        <div
          style={{
            position: 'absolute',
            left: '70%',
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: 'rgba(254, 240, 138, 0.6)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '40%',
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: 'rgba(254, 240, 138, 0.6)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '20%',
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: 'rgba(254, 240, 138, 0.6)'
          }}
        />

        {/* HP Numbers */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 800,
            color: '#ffffff',
            textShadow: '0 1px 4px #000000'
          }}
        >
          {currentHp} / {maxHp}
        </div>
      </div>
    </div>
  );
};
