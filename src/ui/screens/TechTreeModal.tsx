import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ALL_TECH_UPGRADES } from '../../content/upgrades/techTree';
import { SaveService } from '../../services/save/saveService';
import { audioManager } from '../../services/audio/audioManager';
import { i18n } from '../../services/localization/i18n';
import { Star, RotateCcw, X, Shield, Zap, Sparkles, Flame, Target } from 'lucide-react';
import { TechUpgradeBranch } from '../../core/types/upgrades';

export const TechTreeModal: React.FC = () => {
  const isTechTreeOpen = useGameStore((state) => state.isTechTreeOpen);
  const setTechTreeOpen = useGameStore((state) => state.setTechTreeOpen);

  // Re-render trigger when purchases/resets happen
  const [, setTick] = useState(0);

  if (!isTechTreeOpen) return null;

  const availableStars = SaveService.getAvailableStars();
  const totalStars = SaveService.load().campaign.starsTotal || 0;

  const branches: { id: TechUpgradeBranch; nameKey: string; icon: React.ReactNode }[] = [
    { id: 'archer', nameKey: 'upgrade.branch.archer', icon: <Target size={20} color="#38bdf8" /> },
    { id: 'barracks', nameKey: 'upgrade.branch.barracks', icon: <Shield size={20} color="#60a5fa" /> },
    { id: 'mage', nameKey: 'upgrade.branch.mage', icon: <Zap size={20} color="#c084fc" /> },
    { id: 'cannon', nameKey: 'upgrade.branch.cannon', icon: <Flame size={20} color="#f97316" /> },
    { id: 'alchemy', nameKey: 'upgrade.branch.alchemy', icon: <Sparkles size={20} color="#34d399" /> },
    { id: 'spells', nameKey: 'upgrade.branch.spells', icon: <Sparkles size={20} color="#facc15" /> }
  ];

  const handlePurchase = (upgradeId: string) => {
    audioManager.ensureAudioUnlocked();
    const success = SaveService.purchaseUpgrade(upgradeId);
    if (success) {
      audioManager.playCoin();
      setTick((t) => t + 1);
    } else {
      audioManager.playUi();
    }
  };

  const handleReset = () => {
    audioManager.ensureAudioUnlocked();
    audioManager.playUi();
    SaveService.resetUpgrades();
    setTick((t) => t + 1);
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 95,
        backdropFilter: 'blur(10px)',
        padding: 24
      }}
    >
      <div
        className="fantasy-panel"
        style={{
          width: 960,
          height: 580,
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid #a855f7',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(168, 85, 247, 0.25)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '2px solid #334155',
            backgroundColor: 'rgba(15, 23, 42, 0.8)'
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-fantasy)',
                fontSize: 22,
                color: '#fef08a'
              }}
            >
              {i18n.t('campaign.tech_tree.title') || 'Bastion Upgrades'}
            </h2>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              {i18n.t('campaign.tech_tree.desc') || 'Empower your kingdom defenses with earned stars'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* Stars count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Star size={22} color="#fbbf24" fill="#fbbf24" />
              <span style={{ fontSize: 18, fontWeight: 900, color: '#fef08a' }}>
                {availableStars} / {totalStars}
              </span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>
                {i18n.t('campaign.stars.available') || 'Available Stars'}
              </span>
            </div>

            {/* Reset Button */}
            <button
              className="fantasy-btn"
              onClick={handleReset}
              style={{ padding: '6px 14px', fontSize: 12 }}
            >
              <RotateCcw size={14} />
              <span>{i18n.t('campaign.reset_upgrades') || 'Reset All'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                audioManager.playUi();
                setTechTreeOpen(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tree Branches Grid */}
        <div
          style={{
            flex: 1,
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            overflowY: 'auto',
            backgroundColor: '#090d16'
          }}
        >
          {branches.map((branch) => {
            const nodes = ALL_TECH_UPGRADES.filter((n) => n.branch === branch.id);

            return (
              <div
                key={branch.id}
                className="fantasy-panel"
                style={{
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  backgroundColor: 'rgba(15, 23, 42, 0.7)'
                }}
              >
                {/* Branch Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {branch.icon}
                  <div
                    style={{
                      fontFamily: 'var(--font-fantasy)',
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#f8fafc'
                    }}
                  >
                    {i18n.t(branch.nameKey) || branch.id.toUpperCase()}
                  </div>
                </div>

                {/* Tiers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {nodes.map((node) => {
                    const isBought = SaveService.hasUpgrade(node.id);
                    const canAfford = availableStars >= node.starCost;

                    return (
                      <button
                        key={node.id}
                        disabled={isBought || !canAfford}
                        onClick={() => handlePurchase(node.id)}
                        className="fantasy-panel"
                        style={{
                          padding: '10px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          textAlign: 'left',
                          backgroundColor: isBought
                            ? 'rgba(34, 197, 94, 0.15)'
                            : canAfford
                            ? 'rgba(30, 41, 59, 0.7)'
                            : 'rgba(15, 23, 42, 0.5)',
                          borderColor: isBought
                            ? '#22c55e'
                            : canAfford
                            ? '#38bdf8'
                            : '#334155',
                          cursor: isBought ? 'default' : canAfford ? 'pointer' : 'not-allowed',
                          opacity: isBought ? 1 : canAfford ? 1 : 0.5,
                          transition: 'transform 0.1s ease'
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: isBought ? '#86efac' : '#f8fafc'
                            }}
                          >
                            {i18n.t(node.nameKey)}
                          </div>
                          <div style={{ fontSize: 10, color: '#94a3b8' }}>
                            {i18n.t(node.descriptionKey)}
                          </div>
                        </div>

                        {/* Cost / Bought Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
                          {isBought ? (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 800,
                                color: '#22c55e',
                                textTransform: 'uppercase'
                              }}
                            >
                              MAX
                            </span>
                          ) : (
                            <>
                              <Star size={14} color="#fbbf24" fill="#fbbf24" />
                              <span style={{ fontSize: 12, fontWeight: 800, color: '#fef08a' }}>
                                {node.starCost}
                              </span>
                            </>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
