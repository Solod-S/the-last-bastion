import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { gameEventBus, GameEvents } from '../../game/events/gameEventBus';
import { audioManager } from '../../services/audio/audioManager';
import { i18n } from '../../services/localization/i18n';
import { Flame, Users, Move } from 'lucide-react';

export const HeroAndSpellsPanel: React.FC = () => {
  const heroState = useGameStore((state) => state.heroState);
  const activeSpellToCast = useGameStore((state) => state.activeSpellToCast);
  const setActiveSpellToCast = useGameStore((state) => state.setActiveSpellToCast);
  const isPlacingHero = useGameStore((state) => state.isPlacingHero);
  const setIsPlacingHero = useGameStore((state) => state.setIsPlacingHero);

  // Local spell cooldown timers (in seconds)
  const [meteorCooldown, setMeteorCooldown] = useState(0);
  const [militiaCooldown, setMilitiaCooldown] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMeteorCooldown((prev) => Math.max(0, prev - 1));
      setMilitiaCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleHeroMoveClick = () => {
    audioManager.ensureAudioUnlocked();
    audioManager.playUi();
    setIsPlacingHero(!isPlacingHero);
  };

  const handleHeroAbilityClick = () => {
    if (!heroState || heroState.abilityCooldownRemaining > 0 || heroState.isDead) return;
    audioManager.ensureAudioUnlocked();
    gameEventBus.emit(GameEvents.CMD_HERO_ABILITY, null);
  };

  const handleSpellClick = (spellId: 'spell_meteor' | 'spell_reinforcements') => {
    audioManager.ensureAudioUnlocked();
    audioManager.playUi();

    if (spellId === 'spell_meteor') {
      if (meteorCooldown > 0) return;
      if (activeSpellToCast === 'spell_meteor') {
        setActiveSpellToCast(null);
      } else {
        setActiveSpellToCast('spell_meteor');
      }
    } else {
      if (militiaCooldown > 0) return;
      if (activeSpellToCast === 'spell_reinforcements') {
        setActiveSpellToCast(null);
      } else {
        setActiveSpellToCast('spell_reinforcements');
      }
    }
  };

  // Listen for cast completion to set cooldown
  useEffect(() => {
    const unsubs = [
      gameEventBus.on(GameEvents.CMD_CAST_SPELL, ({ spellId }: { spellId: string }) => {
        if (spellId === 'spell_meteor') {
          setMeteorCooldown(45);
        } else if (spellId === 'spell_reinforcements') {
          setMilitiaCooldown(22);
        }
      })
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        zIndex: 50,
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 12
      }}
    >
      {/* Hero Box */}
      {heroState && (
        <div
          className="fantasy-panel"
          style={{
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            border: isPlacingHero ? '2px solid #38bdf8' : '2px solid #334155',
            boxShadow: isPlacingHero ? '0 0 15px rgba(56, 189, 248, 0.4)' : undefined,
            background: 'rgba(15, 23, 42, 0.9)'
          }}
        >
          {/* Avatar Icon with Concept Portrait */}
          <div
            style={{
              position: 'relative',
              width: 54,
              height: 54,
              borderRadius: 8,
              background: 'radial-gradient(circle, #334155 0%, #0f172a 100%)',
              border: '2px solid #fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
            }}
          >
            <img
              src="/assets/heroes/portrait_hero_aldren.png"
              alt="Sir Aldren"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
            {heroState.isDead && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.75)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444',
                  fontSize: 11,
                  fontWeight: 800
                }}
              >
                {heroState.respawnTimeRemaining}s
              </div>
            )}
          </div>

          {/* Info & HP */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 100 }}>
            <div style={{ fontFamily: 'var(--font-fantasy)', fontSize: 13, fontWeight: 700, color: '#fef08a' }}>
              {i18n.t('hero.commander.name')}
            </div>

            {/* HP Bar */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: 8,
                backgroundColor: '#0f172a',
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid #334155'
              }}
            >
              <div
                style={{
                  width: `${Math.max(0, Math.min(1, heroState.currentHp / heroState.maxHp)) * 100}%`,
                  height: '100%',
                  backgroundColor: '#38bdf8',
                  transition: 'width 0.2s ease'
                }}
              />
            </div>
            <div style={{ fontSize: 9, color: '#94a3b8', textAlign: 'right', fontWeight: 600 }}>
              {Math.round(heroState.currentHp)} / {heroState.maxHp}
            </div>
          </div>

          {/* Actions: Move & Strike */}
          <div style={{ display: 'flex', gap: 6 }}>
            {/* Move Button */}
            <button
              className="fantasy-btn"
              onClick={handleHeroMoveClick}
              title={i18n.t('hero.action.move')}
              style={{
                width: 38,
                height: 38,
                padding: 0,
                justifyContent: 'center',
                backgroundColor: isPlacingHero ? '#0284c7' : '#1e293b',
                borderColor: isPlacingHero ? '#38bdf8' : '#475569'
              }}
            >
              <Move size={18} color="#ffffff" />
            </button>

            {/* Ability Button (Bastion Strike) */}
            <button
              className="fantasy-btn"
              onClick={handleHeroAbilityClick}
              disabled={heroState.abilityCooldownRemaining > 0 || heroState.isDead}
              title={i18n.t('hero.commander.ability.name')}
              style={{
                position: 'relative',
                width: 38,
                height: 38,
                padding: 3,
                justifyContent: 'center',
                backgroundColor: heroState.abilityCooldownRemaining > 0 ? '#0f172a' : '#854d0e',
                borderColor: heroState.abilityCooldownRemaining > 0 ? '#334155' : '#fbbf24',
                opacity: heroState.abilityCooldownRemaining > 0 || heroState.isDead ? 0.5 : 1,
                overflow: 'hidden'
              }}
            >
              <img
                src="/assets/heroes/ability_bastion_strike_icon.png"
                alt="Bastion Strike"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              {heroState.abilityCooldownRemaining > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#ffffff'
                  }}
                >
                  {heroState.abilityCooldownRemaining}
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Commander Spells */}
      <div style={{ display: 'flex', gap: 8 }}>
        {/* Spell 1: Meteor */}
        <button
          className="fantasy-panel"
          onClick={() => handleSpellClick('spell_meteor')}
          title={i18n.t('spell.meteor.name')}
          style={{
            position: 'relative',
            width: 58,
            height: 58,
            borderRadius: 10,
            border: activeSpellToCast === 'spell_meteor' ? '2px solid #ef4444' : '2px solid #78350f',
            boxShadow:
              activeSpellToCast === 'spell_meteor' ? '0 0 15px rgba(239, 68, 68, 0.7)' : undefined,
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: meteorCooldown > 0 ? 'not-allowed' : 'pointer',
            opacity: meteorCooldown > 0 ? 0.6 : 1,
            transition: 'transform 0.1s ease',
            overflow: 'hidden',
            padding: '4px 2px'
          }}
        >
          <Flame size={24} color="#f97316" />
          <span
            style={{
              fontSize: 9,
              color: '#fef08a',
              fontWeight: 800,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 52,
              marginTop: 2,
              textAlign: 'center'
            }}
          >
            {i18n.t('spell.meteor.short')}
          </span>
          {meteorCooldown > 0 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 8,
                backgroundColor: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 900,
                color: '#ffffff'
              }}
            >
              {meteorCooldown}
            </div>
          )}
        </button>

        {/* Spell 2: Reinforcements */}
        <button
          className="fantasy-panel"
          onClick={() => handleSpellClick('spell_reinforcements')}
          title={i18n.t('spell.reinforcements.name')}
          style={{
            position: 'relative',
            width: 58,
            height: 58,
            borderRadius: 10,
            border:
              activeSpellToCast === 'spell_reinforcements'
                ? '2px solid #38bdf8'
                : '2px solid #1e40af',
            boxShadow:
              activeSpellToCast === 'spell_reinforcements'
                ? '0 0 15px rgba(56, 189, 248, 0.7)'
                : undefined,
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: militiaCooldown > 0 ? 'not-allowed' : 'pointer',
            opacity: militiaCooldown > 0 ? 0.6 : 1,
            transition: 'transform 0.1s ease',
            overflow: 'hidden',
            padding: '4px 2px'
          }}
        >
          <Users size={24} color="#60a5fa" />
          <span
            style={{
              fontSize: 9,
              color: '#93c5fd',
              fontWeight: 800,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 52,
              marginTop: 2,
              textAlign: 'center'
            }}
          >
            {i18n.t('spell.reinforcements.short')}
          </span>
          {militiaCooldown > 0 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 8,
                backgroundColor: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 900,
                color: '#ffffff'
              }}
            >
              {militiaCooldown}
            </div>
          )}
        </button>
      </div>

      {/* Casting Prompt */}
      {(activeSpellToCast || isPlacingHero) && (
        <div
          className="fantasy-panel"
          style={{
            padding: '6px 14px',
            backgroundColor: 'rgba(2, 6, 23, 0.9)',
            borderColor: activeSpellToCast ? '#ef4444' : '#38bdf8',
            color: '#f8fafc',
            fontSize: 12,
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
          }}
        >
          {activeSpellToCast
            ? i18n.t('spell.prompt.target') || 'Click on map to cast spell!'
            : i18n.t('hero.prompt.move') || 'Click on map to move Hero!'}
        </div>
      )}
    </div>
  );
};
