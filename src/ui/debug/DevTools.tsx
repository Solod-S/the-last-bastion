import React from 'react';
import { useGameStore } from '../store/gameStore';
import { gameEventBus, GameEvents } from '../../game/events/gameEventBus';
import { i18n } from '../../services/localization/i18n';
import { audioManager } from '../../services/audio/audioManager';
import { Wrench, Plus, Skull, ShieldCheck, UserPlus, X } from 'lucide-react';

export const DevTools: React.FC = () => {
  const isDevToolsOpen = useGameStore((state) => state.isDevToolsOpen);
  const setDevToolsOpen = useGameStore((state) => state.setDevToolsOpen);
  const activeEnemies = useGameStore((state) => state.gameState.activeEnemies);
  const gold = useGameStore((state) => state.gameState.gold);

  if (!isDevToolsOpen) return null;

  const trigger = (action: string, payload?: any) => {
    audioManager.playUi();
    gameEventBus.emit(GameEvents.CMD_TRIGGER_DEV_ACTION, { action, payload });
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 70,
        right: 16,
        zIndex: 70,
        pointerEvents: 'auto'
      }}
    >
      <div
        className="fantasy-panel"
        style={{
          width: 250,
          padding: '14px 16px',
          border: '2px dashed #f59e0b',
          background: 'rgba(15, 23, 42, 0.96)'
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
            paddingBottom: 6
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              color: '#fbbf24'
            }}
          >
            <Wrench size={15} />
            <span>{i18n.t('dev.title')}</span>
          </div>
          <button
            onClick={() => setDevToolsOpen(false)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Stats */}
        <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>
          <div>Врагов на карте: <span style={{ color: '#f8fafc', fontWeight: 700 }}>{activeEnemies}</span></div>
          <div>Золото: <span style={{ color: '#fef08a', fontWeight: 700 }}>{gold}</span></div>
        </div>

        {/* Cheats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
          <button
            className="fantasy-btn fantasy-btn-gold"
            onClick={() => trigger('add_gold')}
            style={{ fontSize: 11, padding: '5px 8px', justifyContent: 'center' }}
          >
            <Plus size={14} /> {i18n.t('dev.add_gold')}
          </button>

          <button
            className="fantasy-btn fantasy-btn-danger"
            onClick={() => trigger('kill_all')}
            style={{ fontSize: 11, padding: '5px 8px', justifyContent: 'center' }}
          >
            <Skull size={14} /> {i18n.t('dev.kill_all')}
          </button>

          <button
            className="fantasy-btn"
            onClick={() => trigger('god_mode')}
            style={{ fontSize: 11, padding: '5px 8px', justifyContent: 'center' }}
          >
            <ShieldCheck size={14} color="#22c55e" /> {i18n.t('dev.god_mode')}
          </button>
        </div>

        {/* Spawn Unit Buttons */}
        <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>
          Принудительный спавн:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          <button
            className="fantasy-btn"
            onClick={() => trigger('spawn_enemy', { enemyId: 'enemy.goblinRunner' })}
            style={{ fontSize: 10, padding: '4px 6px', justifyContent: 'center' }}
          >
            <UserPlus size={12} /> Гоблин
          </button>

          <button
            className="fantasy-btn"
            onClick={() => trigger('spawn_enemy', { enemyId: 'enemy.orcBrute' })}
            style={{ fontSize: 10, padding: '4px 6px', justifyContent: 'center' }}
          >
            <UserPlus size={12} /> Орк
          </button>

          <button
            className="fantasy-btn"
            onClick={() => trigger('spawn_enemy', { enemyId: 'enemy.riftKnight' })}
            style={{ fontSize: 10, padding: '4px 6px', justifyContent: 'center' }}
          >
            <UserPlus size={12} /> Рыцарь
          </button>

          <button
            className="fantasy-btn"
            onClick={() => trigger('spawn_enemy', { enemyId: 'enemy.shamanHealer' })}
            style={{ fontSize: 10, padding: '4px 6px', justifyContent: 'center' }}
          >
            <UserPlus size={12} /> Шаман
          </button>
        </div>
      </div>
    </div>
  );
};
