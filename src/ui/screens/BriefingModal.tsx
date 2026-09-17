import React from 'react';
import { useGameStore } from '../store/gameStore';
import { ContentRegistry } from '../../content/registry';
import { i18n } from '../../services/localization/i18n';
import { audioManager } from '../../services/audio/audioManager';
import { ShieldCheck, Play, MessageSquare } from 'lucide-react';

const MISSION_VISUALS: Record<
  string,
  { scene: string; portrait: string; npcName: string; npcRole: string }
> = {
  'mission.greenlands.01': {
    scene: '/assets/scenes/scene_first_rift.png',
    portrait: '/assets/portraits/portrait_elira.png',
    npcName: 'Командир Элира',
    npcRole: 'Начальник гарнизона Бастиона'
  },
  'mission.greenlands.02': {
    scene: '/assets/scenes/scene_march_to_ruins.png',
    portrait: '/assets/portraits/portrait_elira.png',
    npcName: 'Командир Элира',
    npcRole: 'Начальник гарнизона Бастиона'
  },
  'mission.greenlands.03': {
    scene: '/assets/scenes/scene_swamp_crossing.png',
    portrait: '/assets/portraits/portrait_rowan.png',
    npcName: 'Архивариус Роуэн',
    npcRole: 'Хранитель свитков Разлома'
  },
  'mission.greenlands.04': {
    scene: '/assets/scenes/scene_volcanic_ascent.png',
    portrait: '/assets/portraits/portrait_rowan.png',
    npcName: 'Архивариус Роуэн',
    npcRole: 'Хранитель свитков Разлома'
  },
  'mission.greenlands.05': {
    scene: '/assets/scenes/scene_frozen_watch.png',
    portrait: '/assets/portraits/portrait_elira.png',
    npcName: 'Командир Элира',
    npcRole: 'Начальник гарнизона Бастиона'
  },
  'mission.greenlands.06': {
    scene: '/assets/scenes/scene_rift_storm.png',
    portrait: '/assets/portraits/portrait_elira.png',
    npcName: 'Командир Элира',
    npcRole: 'Начальник гарнизона Бастиона'
  }
};

export const BriefingModal: React.FC = () => {
  const isBriefingOpen = useGameStore((state) => state.isBriefingOpen);
  const setBriefingOpen = useGameStore((state) => state.setBriefingOpen);
  const currentMissionId = useGameStore((state) => state.currentMissionId);

  if (!isBriefingOpen) return null;

  let mission = null;
  try {
    mission = ContentRegistry.getMission(currentMissionId);
  } catch (e) {
    // fallback
  }

  const visuals =
    MISSION_VISUALS[currentMissionId] || MISSION_VISUALS['mission.greenlands.01'];

  const missionName = mission ? i18n.t(mission.nameKey) : i18n.t('mission.greenlands.01.name');
  const missionStory = mission ? i18n.t(mission.storyIntroKey) : i18n.t('mission.greenlands.01.story');

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
        backgroundColor: 'rgba(5, 8, 15, 0.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        backdropFilter: 'blur(8px)',
        padding: 20
      }}
    >
      <div
        className="fantasy-panel"
        style={{
          width: 580,
          border: '2px solid #38bdf8',
          boxShadow: '0 25px 60px rgba(0,0,0,0.95), 0 0 35px rgba(56, 189, 248, 0.3)',
          overflow: 'hidden',
          backgroundColor: '#0a0f1d'
        }}
      >
        {/* Top Cinematic Scene Banner */}
        <div
          style={{
            position: 'relative',
            height: 160,
            overflow: 'hidden',
            borderBottom: '2px solid #1e293b'
          }}
        >
          <img
            src={visuals.scene}
            alt="Cinematic Scene"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(10, 15, 29, 0.2) 0%, rgba(10, 15, 29, 0.95) 100%)'
            }}
          />

          {/* Region and Mission Name Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: 20,
              right: 20
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: '#38bdf8',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                fontWeight: 700
              }}
            >
              Акт I: Зеленые Земли • Рубеж Обороны
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-fantasy)',
                fontSize: 22,
                color: '#f8fafc',
                margin: '2px 0 0',
                fontWeight: 800,
                textShadow: '0 2px 8px rgba(0,0,0,0.8)'
              }}
            >
              {missionName}
            </h2>
          </div>
        </div>

        {/* Modal Content Body */}
        <div style={{ padding: '20px 24px' }}>
          {/* NPC Dialogue Box */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              background: 'rgba(15, 23, 42, 0.7)',
              padding: '14px 16px',
              borderRadius: 8,
              border: '1px solid #334155',
              marginBottom: 16,
              alignItems: 'center'
            }}
          >
            {/* NPC Portrait */}
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 8,
                border: '2px solid #38bdf8',
                boxShadow: '0 0 14px rgba(56, 189, 248, 0.3)',
                overflow: 'hidden',
                flexShrink: 0,
                backgroundColor: '#0c1322'
              }}
            >
              <img
                src={visuals.portrait}
                alt={visuals.npcName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* NPC Quote */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 4
                }}
              >
                <MessageSquare size={14} />
                <span>{visuals.npcName}</span>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>
                  ({visuals.npcRole})
                </span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: '#e2e8f0',
                  fontStyle: 'italic'
                }}
              >
                "{missionStory}"
              </div>
            </div>
          </div>

          {/* Objectives */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.4)',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid rgba(51, 65, 85, 0.6)',
              marginBottom: 20
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: '#94a3b8',
                textTransform: 'uppercase',
                marginBottom: 8,
                fontWeight: 700,
                letterSpacing: 0.5
              }}
            >
              Боевые задачи гарнизона:
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: '#e2e8f0',
                marginBottom: 6
              }}
            >
              <ShieldCheck size={16} color="#22c55e" />
              <span>Отразить все волны демонических орд Разлома</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: '#e2e8f0'
              }}
            >
              <ShieldCheck size={16} color="#22c55e" />
              <span>Не допустить разрушения крепостных ворот Бастиона</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            className="fantasy-btn fantasy-btn-primary"
            onClick={handleStart}
            style={{
              width: '100%',
              padding: '14px 24px',
              fontSize: 16,
              justifyContent: 'center',
              letterSpacing: 0.5,
              fontWeight: 700
            }}
          >
            <Play size={18} fill="currentColor" />
            <span>Вступить в бой!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
