import React from 'react';
import { useGameStore } from '../store/gameStore';
import { i18n } from '../../services/localization/i18n';
import { Shield, Sparkles, Gauge, Heart } from 'lucide-react';

export const EnemyInspector: React.FC = () => {
  const inspectedEnemy = useGameStore((state) => state.inspectedEnemy);

  if (!inspectedEnemy) return null;

  const { definition, currentHp, maxHp, armor, magicResistance, speed } = inspectedEnemy;
  const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 24,
        left: 24,
        zIndex: 60,
        pointerEvents: 'none'
      }}
    >
      <div
        className="fantasy-panel"
        style={{
          width: 260,
          padding: '12px 16px',
          borderLeft: '4px solid #a855f7'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 6,
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid #475569',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <img
              src={`/assets/enemies/${definition.assetKey}.png`}
              alt={definition.id}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-fantasy)', fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>
              {i18n.t(definition.nameKey)}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              {i18n.t(definition.descriptionKey ?? '')}
            </div>
          </div>
        </div>

        {/* HP Bar */}
        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11,
              marginBottom: 2
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ef4444' }}>
              <Heart size={12} fill="#ef4444" /> HP
            </span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>
              {Math.round(currentHp)} / {maxHp}
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: 6,
              background: '#1e293b',
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${hpPercent}%`,
                height: '100%',
                background: hpPercent > 50 ? '#22c55e' : hpPercent > 25 ? '#eab308' : '#ef4444',
                transition: 'width 0.15s ease'
              }}
            />
          </div>
        </div>

        {/* Defense Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8' }}>
            <Shield size={13} color="#94a3b8" />
            <span>Броня: </span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{armor}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8' }}>
            <Sparkles size={13} color="#c084fc" />
            <span>Маг. рег: </span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{Math.round(magicResistance * 100)}%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8' }}>
            <Gauge size={13} color="#38bdf8" />
            <span>Скор: </span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{speed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
