import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ContentRegistry } from '../../content/registry';
import { SaveService } from '../../services/save/saveService';
import { gameEventBus, GameEvents } from '../../game/events/gameEventBus';
import { audioManager } from '../../services/audio/audioManager';
import { i18n } from '../../services/localization/i18n';
import {
  MapPin,
  Lock,
  Star,
  Coins,
  Heart,
  Play,
  X,
  Sparkles,
  TreePine,
  Home,
  Waves,
  Gem,
  Compass,
  Crown
} from 'lucide-react';

export const CampaignMapModal: React.FC = () => {
  const isCampaignMapOpen = useGameStore((state) => state.isCampaignMapOpen);
  const setCampaignMapOpen = useGameStore((state) => state.setCampaignMapOpen);
  const setTechTreeOpen = useGameStore((state) => state.setTechTreeOpen);
  const currentMissionId = useGameStore((state) => state.currentMissionId);

  const missions = ContentRegistry.getAllMissions();
  const [selectedMissionId, setSelectedMissionId] = useState<string>(
    currentMissionId || 'mission.greenlands.01'
  );

  if (!isCampaignMapOpen) return null;

  const profile = SaveService.load();
  const totalStars = profile.campaign.starsTotal || 0;
  const availableStars = SaveService.getAvailableStars();
  const riftCrystals = profile.campaign.riftCrystals || 0;

  const selectedMission =
    missions.find((m) => m.id === selectedMissionId) || missions[0];
  const isUnlocked = SaveService.isMissionUnlocked(selectedMission.id);

  const handleStartMission = (missionId: string) => {
    audioManager.ensureAudioUnlocked();
    audioManager.playUi();
    audioManager.playWaveHorn();
    useGameStore.setState({ currentMissionId: missionId, isCampaignMapOpen: false });
    gameEventBus.emit(GameEvents.CMD_START_MISSION, { missionId });
  };

  const getMissionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <TreePine size={22} color="#4ade80" />;
      case 1:
        return <Home size={22} color="#facc15" />;
      case 2:
        return <Waves size={22} color="#38bdf8" />;
      case 3:
        return <Gem size={22} color="#c084fc" />;
      case 4:
        return <Compass size={22} color="#fb923c" />;
      case 5:
      default:
        return <Crown size={22} color="#ef4444" />;
    }
  };

  // Node layout coordinates across regional map
  const nodePositions = [
    { x: 120, y: 380 }, // Mission 1: Forest Road
    { x: 280, y: 260 }, // Mission 2: Village Crossing
    { x: 440, y: 390 }, // Mission 3: Old Stone Bridge
    { x: 600, y: 240 }, // Mission 4: Crystal Grove
    { x: 740, y: 400 }, // Mission 5: Broken Mill
    { x: 880, y: 260 }  // Mission 6: Troll Pass (Boss)
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.94)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 90,
        backdropFilter: 'blur(10px)',
        padding: 24
      }}
    >
      <div
        className="fantasy-panel"
        style={{
          width: 1180,
          height: 640,
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid #fbbf24',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(245, 158, 11, 0.25)',
          overflow: 'hidden'
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 24px',
            borderBottom: '2px solid #334155',
            backgroundColor: 'rgba(15, 23, 42, 0.8)'
          }}
        >
          {/* Region Title */}
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-fantasy)',
                fontSize: 22,
                color: '#fef08a',
                letterSpacing: 1.2
              }}
            >
              {i18n.t('campaign.act1.title') || 'Act I: Green Lands'}
            </h2>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              {i18n.t('campaign.act1.desc') || 'Protect the frontier bastions against the demonic Rift!'}
            </div>
          </div>

          {/* Meta Currency & Upgrades Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={20} color="#fbbf24" fill="#fbbf24" />
              <span style={{ fontWeight: 800, fontSize: 16, color: '#fef08a' }}>
                {availableStars} / {totalStars}
              </span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                {i18n.t('campaign.stars.available') || 'Stars'}
              </span>
            </div>

            {/* Rift Crystals */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={20} color="#a855f7" />
              <span style={{ fontWeight: 800, fontSize: 16, color: '#e9d5ff' }}>
                {riftCrystals}
              </span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                {i18n.t('campaign.crystals') || 'Crystals'}
              </span>
            </div>

            {/* Tech Tree Button */}
            <button
              className="fantasy-btn fantasy-btn-gold"
              onClick={() => {
                audioManager.playUi();
                setTechTreeOpen(true);
              }}
              style={{ padding: '8px 16px', fontSize: 13 }}
            >
              <Sparkles size={16} />
              <span>{i18n.t('campaign.tech_tree.title') || 'Bastion Upgrades'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                audioManager.playUi();
                setCampaignMapOpen(false);
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
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Main Content: Map Visuals (Left) + Briefing (Right) */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Map Nodes Canvas Area */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              backgroundColor: '#0c1322',
              backgroundImage: 'url(/assets/ui/campaign_map_concept_bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              overflow: 'hidden'
            }}
          >
            {/* Dark Vignette Overlay for Readability */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at center, rgba(12, 19, 34, 0.45) 0%, rgba(5, 8, 15, 0.85) 100%)',
                pointerEvents: 'none'
              }}
            />
            {/* SVG Connecting Paths */}
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
            >
              {nodePositions.slice(0, nodePositions.length - 1).map((pos, idx) => {
                const next = nodePositions[idx + 1];
                const isPassed = SaveService.getMissionStars(missions[idx].id) > 0;
                return (
                  <line
                    key={idx}
                    x1={pos.x + 24}
                    y1={pos.y + 24}
                    x2={next.x + 24}
                    y2={next.y + 24}
                    stroke={isPassed ? '#fbbf24' : '#334155'}
                    strokeWidth={isPassed ? 3 : 2}
                    strokeDasharray={isPassed ? 'none' : '6 6'}
                    opacity={0.8}
                  />
                );
              })}
            </svg>

            {/* 6 Map Nodes */}
            {missions.map((mission, idx) => {
              const pos = nodePositions[idx] || { x: 100 * (idx + 1), y: 300 };
              const unlocked = SaveService.isMissionUnlocked(mission.id);
              const stars = SaveService.getMissionStars(mission.id);
              const isSelected = selectedMissionId === mission.id;
              const isBoss = mission.hasBoss;

              return (
                <div
                  key={mission.id}
                  onClick={() => {
                    audioManager.playUi();
                    setSelectedMissionId(mission.id);
                  }}
                  style={{
                    position: 'absolute',
                    left: pos.x,
                    top: pos.y,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    zIndex: isSelected ? 20 : 10
                  }}
                >
                  {/* Node Circle */}
                  <div
                    style={{
                      position: 'relative',
                      width: isBoss ? 56 : 48,
                      height: isBoss ? 56 : 48,
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#1e3a8a' : unlocked ? '#1e293b' : '#090d16',
                      border: isSelected
                        ? '3px solid #fbbf24'
                        : unlocked
                        ? isBoss
                          ? '2px solid #ef4444'
                          : '2px solid #38bdf8'
                        : '2px solid #334155',
                      boxShadow: isSelected
                        ? '0 0 20px rgba(251, 191, 36, 0.8)'
                        : isBoss
                        ? '0 0 15px rgba(239, 68, 68, 0.5)'
                        : undefined,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    {!unlocked ? (
                      <Lock size={20} color="#64748b" />
                    ) : (
                      getMissionIcon(idx)
                    )}

                    {/* Mission Roman Numeral badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: -8,
                        right: -6,
                        backgroundColor: '#0f172a',
                        border: '1px solid #fbbf24',
                        borderRadius: 10,
                        padding: '1px 6px',
                        fontSize: 9,
                        fontWeight: 900,
                        color: '#fef08a'
                      }}
                    >
                      {idx + 1}
                    </div>
                  </div>

                  {/* Stars under node */}
                  {unlocked && (
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          size={12}
                          color={starIdx <= stars ? '#fbbf24' : '#334155'}
                          fill={starIdx <= stars ? '#fbbf24' : 'none'}
                        />
                      ))}
                    </div>
                  )}

                  {/* Mission short name */}
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: isSelected ? '#fef08a' : unlocked ? '#e2e8f0' : '#64748b',
                      textShadow: '0 2px 4px #000000',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {i18n.t(mission.nameKey)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Briefing Sidebar */}
          <div
            style={{
              width: 380,
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              borderLeft: '2px solid #334155',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflowY: 'auto'
            }}
          >
            <div>
              {/* Mission Badge & Number */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                  color: selectedMission.hasBoss ? '#ef4444' : '#38bdf8',
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5
                }}
              >
                <MapPin size={16} />
                <span>
                  {selectedMission.hasBoss
                    ? 'BOSS BATTLE • STAGE 6'
                    : `STAGE ${selectedMission.missionNumber || 1}`}
                </span>
              </div>

              {/* Title */}
              <h1
                style={{
                  margin: '0 0 12px',
                  fontFamily: 'var(--font-fantasy)',
                  fontSize: 24,
                  color: '#fef08a',
                  lineHeight: 1.2
                }}
              >
                {i18n.t(selectedMission.nameKey)}
              </h1>

              {/* Mission Preview Banner */}
              <div
                style={{
                  height: 90,
                  borderRadius: 6,
                  overflow: 'hidden',
                  marginBottom: 14,
                  border: '1px solid #334155',
                  position: 'relative'
                }}
              >
                <img
                  src={
                    selectedMission.hasBoss
                      ? '/assets/scenes/scene_rift_storm.png'
                      : `/assets/scenes/scene_${['first_rift', 'march_to_ruins', 'swamp_crossing', 'volcanic_ascent', 'frozen_watch'][selectedMission.missionNumber ? (selectedMission.missionNumber - 1) % 5 : 0]}.png`
                  }
                  alt="Mission Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, transparent 30%, rgba(15, 23, 42, 0.85) 100%)'
                  }}
                />
              </div>

              {/* Story Intro */}
              <div
                style={{
                  fontSize: 13,
                  color: '#cbd5e1',
                  lineHeight: 1.5,
                  marginBottom: 20,
                  fontStyle: 'italic',
                  background: 'rgba(30, 41, 59, 0.5)',
                  padding: 12,
                  borderRadius: 6,
                  border: '1px solid #334155'
                }}
              >
                {i18n.t(selectedMission.storyIntroKey)}
              </div>

              {/* Mission Stats Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                  marginBottom: 20
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    color: '#94a3b8'
                  }}
                >
                  <Coins size={16} color="#fbbf24" />
                  <span>
                    Золото: <b style={{ color: '#f8fafc' }}>{selectedMission.startingGold}</b>
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    color: '#94a3b8'
                  }}
                >
                  <Heart size={16} color="#ef4444" />
                  <span>
                    Жизни: <b style={{ color: '#f8fafc' }}>{selectedMission.baseHealth}</b>
                  </span>
                </div>
              </div>

              {/* Allowed Towers */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>
                  {i18n.t('campaign.allowed_towers') || 'Allowed Tower Classes'}:
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {selectedMission.allowedTowerClasses.map((c) => (
                    <span
                      key={c}
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#38bdf8',
                        backgroundColor: 'rgba(14, 165, 233, 0.15)',
                        border: '1px solid rgba(14, 165, 233, 0.4)',
                        padding: '3px 8px',
                        borderRadius: 4,
                        textTransform: 'uppercase'
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div>
              {isUnlocked ? (
                <button
                  className="fantasy-btn fantasy-btn-gold"
                  onClick={() => handleStartMission(selectedMission.id)}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '14px 20px',
                    fontSize: 16
                  }}
                >
                  <Play size={20} fill="#1e293b" />
                  <span>{i18n.t('campaign.to_battle') || 'TO BATTLE!'}</span>
                </button>
              ) : (
                <button
                  className="fantasy-btn"
                  disabled
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '14px 20px',
                    fontSize: 15,
                    opacity: 0.5,
                    cursor: 'not-allowed'
                  }}
                >
                  <Lock size={18} />
                  <span>{i18n.t('campaign.locked') || 'LOCKED (Complete previous stage)'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
