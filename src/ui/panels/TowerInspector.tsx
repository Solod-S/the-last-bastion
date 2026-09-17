import React from 'react';
import { useGameStore } from '../store/gameStore';
import { gameEventBus, GameEvents } from '../../game/events/gameEventBus';
import { i18n } from '../../services/localization/i18n';
import { audioManager } from '../../services/audio/audioManager';
import { TargetPriority } from '../../core/types/combat';
import { ChevronUp, Coins, X, Target } from 'lucide-react';

export const TowerInspector: React.FC = () => {
  const selectedTower = useGameStore((state) => state.selectedTower);
  const clearSelection = useGameStore((state) => state.clearSelection);
  const playerGold = useGameStore((state) => state.gameState.gold);

  if (!selectedTower) return null;

  const {
    slotId,
    towerClass,
    level,
    maxLevel,
    damage,
    damageType,
    attacksPerSecond,
    range,
    priority,
    upgradeCost,
    sellRefund
  } = selectedTower;

  const canAffordUpgrade = upgradeCost !== null && playerGold >= upgradeCost;

  const handleUpgrade = () => {
    audioManager.ensureAudioUnlocked();
    gameEventBus.emit(GameEvents.CMD_UPGRADE_TOWER, { slotId });
  };

  const handleSell = () => {
    audioManager.ensureAudioUnlocked();
    gameEventBus.emit(GameEvents.CMD_SELL_TOWER, { slotId });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPriority = e.target.value as TargetPriority;
    gameEventBus.emit(GameEvents.CMD_SET_PRIORITY, { slotId, priority: newPriority });
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 24,
        right: 24,
        zIndex: 60,
        pointerEvents: 'auto'
      }}
    >
      <div
        className="fantasy-panel"
        style={{
          width: 320,
          padding: '16px 20px',
          border: '2px solid #3b82f6'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
            borderBottom: '1px solid #334155',
            paddingBottom: 8
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 6,
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid #3b82f6',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <img
                src={`/assets/towers/tower_${towerClass}_l1.png`}
                alt={towerClass}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-fantasy)', fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>
                {i18n.t(`tower.${towerClass}.name`)}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                {i18n.t('ui.level')} {level} / {maxLevel}
              </div>
            </div>
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

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            marginBottom: 14,
            fontSize: 12,
            background: 'rgba(15, 23, 42, 0.6)',
            padding: 10,
            borderRadius: 6
          }}
        >
          <div>
            <span style={{ color: '#94a3b8' }}>{i18n.t('ui.dps')}: </span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{damage}</span>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>{i18n.t('ui.type')}: </span>
            <span style={{ fontWeight: 700, color: damageType === 'magic' ? '#c084fc' : '#f87171' }}>
              {i18n.t(`ui.damage_type.${damageType}`)}
            </span>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>{i18n.t('ui.speed_stat')}: </span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{attacksPerSecond}/s</span>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>{i18n.t('ui.range')}: </span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{range}</span>
          </div>
        </div>

        {/* Priority Selector (for non-barracks) */}
        {towerClass !== 'barracks' && (
          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                color: '#94a3b8',
                marginBottom: 4
              }}
            >
              <Target size={14} color="#38bdf8" />
              <span>{i18n.t('ui.priority')}</span>
            </div>
            <select
              value={priority}
              onChange={handlePriorityChange}
              style={{
                width: '100%',
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #475569',
                borderRadius: 4,
                padding: '6px 8px',
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              <option value="first">{i18n.t('ui.priority.first')}</option>
              <option value="last">{i18n.t('ui.priority.last')}</option>
              <option value="strongest">{i18n.t('ui.priority.strongest')}</option>
              <option value="weakest">{i18n.t('ui.priority.weakest')}</option>
              <option value="closest">{i18n.t('ui.priority.closest')}</option>
            </select>
          </div>
        )}

        {/* Actions (Upgrade & Sell) */}
        <div style={{ display: 'flex', gap: 10 }}>
          {/* Upgrade */}
          {upgradeCost !== null ? (
            <button
              className="fantasy-btn fantasy-btn-primary"
              disabled={!canAffordUpgrade}
              onClick={handleUpgrade}
              style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}
            >
              <ChevronUp size={16} />
              <span>{i18n.t('ui.upgrade')}</span>
              <span className="badge-gold" style={{ fontSize: 11 }}>
                {upgradeCost}g
              </span>
            </button>
          ) : (
            <div
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 12,
                color: '#10b981',
                padding: 6,
                fontWeight: 700
              }}
            >
              {i18n.t('ui.max_level_reached')}
            </div>
          )}

          {/* Sell */}
          <button
            className="fantasy-btn fantasy-btn-danger"
            onClick={handleSell}
            style={{ fontSize: 12 }}
            title="Refund 70% of invested gold"
          >
            <Coins size={14} />
            <span>+{sellRefund}g</span>
          </button>
        </div>
      </div>
    </div>
  );
};
