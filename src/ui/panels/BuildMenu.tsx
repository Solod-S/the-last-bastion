import React from 'react';
import { useGameStore } from '../store/gameStore';
import { ContentRegistry } from '../../content/registry';
import { gameEventBus, GameEvents } from '../../game/events/gameEventBus';
import { i18n } from '../../services/localization/i18n';
import { audioManager } from '../../services/audio/audioManager';
import { Coins, X } from 'lucide-react';

export const BuildMenu: React.FC = () => {
  const selectedSlot = useGameStore((state) => state.selectedSlot);
  const clearSelection = useGameStore((state) => state.clearSelection);
  const playerGold = useGameStore((state) => state.gameState.gold);

  if (!selectedSlot) return null;

  const towers = ContentRegistry.getAllTowers().filter((t) =>
    selectedSlot.allowedTypes.includes(t.class)
  );

  const handleBuild = (towerId: string) => {
    audioManager.ensureAudioUnlocked();
    gameEventBus.emit(GameEvents.CMD_BUILD_TOWER, {
      slotId: selectedSlot.slotId,
      towerId
    });
  };

  const getTowerImage = (tClass: string) => {
    switch (tClass) {
      case 'archer':
        return '/assets/towers/tower_archer_l1.png';
      case 'mage':
        return '/assets/towers/tower_mage_l1.png';
      case 'cannon':
        return '/assets/towers/tower_cannon_l1.png';
      case 'alchemy':
        return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="16" y="44" width="32" height="16" rx="4" fill="%231e293b" stroke="%2310b981" stroke-width="2"/><circle cx="32" cy="32" r="14" fill="%2310b981" stroke="%2334d399" stroke-width="2"/><rect x="28" y="10" width="8" height="18" fill="%2378350f" stroke="%23b45309" stroke-width="2"/><circle cx="32" cy="32" r="4" fill="%23ffffff" opacity="0.8"/></svg>';
      case 'barracks':
      default:
        return '/assets/towers/tower_barracks_l1.png';
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 60,
        pointerEvents: 'auto'
      }}
    >
      <div
        className="fantasy-panel"
        style={{
          padding: '16px 20px',
          width: Math.min(720, Math.max(540, towers.length * 135)),
          border: '2px solid #3b82f6',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(59, 130, 246, 0.2)'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
            borderBottom: '1px solid #334155',
            paddingBottom: 8
          }}
        >
          <div style={{ fontFamily: 'var(--font-fantasy)', fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>
            {i18n.t('ui.build')}
          </div>
          <button
            onClick={() => {
              audioManager.playUi();
              clearSelection();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Towers Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${towers.length}, 1fr)`, gap: 10 }}>
          {towers.map((tower) => {
            const l1 = tower.levels[0];
            const canAfford = playerGold >= tower.buildCost;

            return (
              <button
                key={tower.id}
                className="fantasy-panel"
                disabled={!canAfford}
                onClick={() => handleBuild(tower.id)}
                style={{
                  padding: '12px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                  opacity: canAfford ? 1 : 0.45,
                  background: canAfford ? 'rgba(30, 41, 59, 0.8)' : 'rgba(15, 23, 42, 0.8)',
                  borderColor: canAfford ? '#475569' : '#1e293b',
                  transition: 'transform 0.15s ease, border-color 0.15s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  if (canAfford) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = '#60a5fa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (canAfford) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#475569';
                  }
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    background: 'rgba(15, 23, 42, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #334155',
                    overflow: 'hidden',
                    padding: 2
                  }}
                >
                  <img
                    src={getTowerImage(tower.class)}
                    alt={tower.class}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>

                {/* Name */}
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#f8fafc',
                    fontFamily: 'var(--font-fantasy)',
                    minHeight: 32,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {i18n.t(tower.nameKey)}
                </div>

                {/* Stats */}
                <div style={{ fontSize: 10, color: '#94a3b8' }}>
                  {tower.class === 'barracks' ? (
                    <span>2 Soldiers</span>
                  ) : (
                    <span>
                      {l1.damage} {i18n.t(`ui.damage_type.${l1.damageType}`).slice(0, 3)}.
                    </span>
                  )}
                </div>

                {/* Cost */}
                <div
                  className="badge-gold"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 4,
                    fontSize: 12
                  }}
                >
                  <Coins size={13} />
                  <span>{tower.buildCost}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
