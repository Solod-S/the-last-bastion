import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { audioManager } from '../../services/audio/audioManager';
import { i18n, SupportedLanguage } from '../../services/localization/i18n';
import { SaveService } from '../../services/save/saveService';
import { ContentRegistry } from '../../content/registry';
import { gameEventBus, GameEvents } from '../../game/events/gameEventBus';
import {
  Swords,
  Map,
  Sparkles,
  BookOpen,
  Settings,
  Star,
  Gem,
  Volume2,
  VolumeX,
  Lock,
  Play,
  X,
  ChevronRight
} from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  alpha: number;
  hue: number;
  phase: number;
}

export const MainMenuScreen: React.FC = () => {
  const isMainMenuOpen = useGameStore((state) => state.isMainMenuOpen);
  const setCampaignMapOpen = useGameStore((state) => state.setCampaignMapOpen);
  const setTechTreeOpen = useGameStore((state) => state.setTechTreeOpen);
  const setCodexOpen = useGameStore((state) => state.setCodexOpen);
  const setSettingsOpen = useGameStore((state) => state.setSettingsOpen);

  const [isLevelDrawerOpen, setIsLevelDrawerOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [profile, setProfile] = useState(() => SaveService.load());
  const [isMuted, setIsMuted] = useState(() => profile.settings.audio.muted);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(() => i18n.getLanguage());

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-start music and sync profile
  useEffect(() => {
    if (!isMainMenuOpen) {
      audioManager.stopMenuMusic();
      return;
    }

    const currentP = SaveService.load();
    setProfile(currentP);
    setIsMuted(currentP.settings.audio.muted);

    // Start menu theme on first interaction or mount
    const unlockAndPlay = () => {
      audioManager.ensureAudioUnlocked();
      audioManager.startMenuMusic();
    };

    unlockAndPlay();
    window.addEventListener('click', unlockAndPlay, { once: true });
    window.addEventListener('keydown', unlockAndPlay, { once: true });

    return () => {
      window.removeEventListener('click', unlockAndPlay);
      window.removeEventListener('keydown', unlockAndPlay);
    };
  }, [isMainMenuOpen]);

  // Particle System (Embers and glowing dust)
  useEffect(() => {
    if (!isMainMenuOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const PARTICLE_COUNT = 65;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 1.2,
        speedY: Math.random() * 1.2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.6,
        alpha: Math.random() * 0.7 + 0.2,
        hue: Math.random() > 0.4 ? 38 + Math.random() * 14 : 12 + Math.random() * 12, // Gold / Amber / Flame
        phase: Math.random() * Math.PI * 2
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += p.speedX + Math.sin(p.phase) * 0.4;
        p.phase += 0.02;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const rad = p.size;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 2.2);
        grad.addColorStop(0, `hsla(${p.hue}, 95%, 65%, ${p.alpha})`);
        grad.addColorStop(0.5, `hsla(${p.hue}, 90%, 50%, ${p.alpha * 0.6})`);
        grad.addColorStop(1, `hsla(${p.hue}, 90%, 40%, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isMainMenuOpen]);

  if (!isMainMenuOpen) return null;

  const allMissions = ContentRegistry.getAllMissions();

  // Find latest unlocked mission
  let latestUnlockedMission = allMissions[0];
  for (const m of allMissions) {
    if (SaveService.isMissionUnlocked(m.id)) {
      latestUnlockedMission = m;
    }
  }

  const isContinue = (profile.campaign.starsTotal || 0) > 0;

  const handleStartCampaign = () => {
    launchMission(latestUnlockedMission.id);
  };

  const launchMission = (missionId: string) => {
    audioManager.ensureAudioUnlocked();
    audioManager.playWaveHorn();
    setIsTransitioning(true);

    setTimeout(() => {
      audioManager.stopMenuMusic();
      audioManager.startMusic();
      useGameStore.setState({
        isMainMenuOpen: false,
        currentMissionId: missionId,
        isCampaignMapOpen: false
      });
      gameEventBus.emit(GameEvents.CMD_START_MISSION, { missionId });
      setIsTransitioning(false);
      setIsLevelDrawerOpen(false);
    }, 450);
  };

  const handleLangChange = (l: SupportedLanguage) => {
    audioManager.playMenuSelect();
    i18n.setLanguage(l);
    setCurrentLang(l);
    const p = SaveService.load();
    p.settings.gameplay.language = l;
    SaveService.save(p);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    audioManager.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  const missionThumbnails: Record<string, string> = {
    'mission.greenlands.01': '/assets/maps/forest_road_bg.png',
    'mission.greenlands.02': '/assets/maps/village_crossing_bg.png',
    'mission.greenlands.03': '/assets/maps/stone_bridge_bg.png',
    'mission.greenlands.04': '/assets/maps/crystal_grove_bg.png',
    'mission.greenlands.05': '/assets/maps/broken_mill_bg.png',
    'mission.greenlands.06': '/assets/maps/troll_pass_bg.png'
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        userSelect: 'none',
        backgroundColor: '#070a10',
        opacity: isTransitioning ? 0 : 1,
        transition: 'opacity 0.45s ease-in-out'
      }}
      onClick={() => audioManager.ensureAudioUnlocked()}
    >
      {/* 1. Cinematic Background with subtle zoom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/assets/ui/main_menu_bg_hd.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          animation: 'bastion-zoom 25s infinite alternate ease-in-out',
          zIndex: 1
        }}
      />

      {/* 2. Dark Vignette & Atmospheric Gradients */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(0, 0, 0, 0.15) 0%, rgba(3, 7, 18, 0.7) 65%, rgba(2, 6, 23, 0.95) 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* 3. Ember & Flame Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />

      {/* 4. Top Header Bar: Stats & Controls */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'auto'
        }}
      >
        {/* Left: Player Progress Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Total Stars */}
          <div
            className="fantasy-panel"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              borderColor: '#b45309'
            }}
          >
            <Star size={18} color="#facc15" fill="#facc15" />
            <span style={{ fontFamily: 'var(--font-fantasy)', fontSize: 16, fontWeight: 700, color: '#fef08a' }}>
              {profile.campaign.starsTotal || 0}
            </span>
          </div>

          {/* Rift Crystals */}
          <div
            className="fantasy-panel"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              borderColor: '#7c3aed'
            }}
          >
            <Gem size={18} color="#c084fc" fill="#a855f7" />
            <span style={{ fontFamily: 'var(--font-fantasy)', fontSize: 16, fontWeight: 700, color: '#f3e8ff' }}>
              {profile.campaign.riftCrystals || 0}
            </span>
          </div>
        </div>

        {/* Right: Languages & Audio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Language Switchers */}
          <div
            className="fantasy-panel"
            style={{
              display: 'flex',
              padding: 3,
              gap: 4,
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              borderColor: '#475569'
            }}
          >
            {(['ru', 'en', 'uk'] as SupportedLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLangChange(lang)}
                onMouseEnter={() => audioManager.playMenuHover()}
                style={{
                  background: currentLang === lang ? 'linear-gradient(180deg, #d97706, #b45309)' : 'transparent',
                  border: currentLang === lang ? '1px solid #fde047' : 'none',
                  color: currentLang === lang ? '#ffffff' : '#94a3b8',
                  fontFamily: 'var(--font-fantasy)',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Mute Button */}
          <button
            onClick={handleToggleMute}
            onMouseEnter={() => audioManager.playMenuHover()}
            className="fantasy-panel"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            style={{
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              borderColor: isMuted ? '#ef4444' : '#475569',
              cursor: 'pointer'
            }}
          >
            {isMuted ? <VolumeX size={18} color="#ef4444" /> : <Volume2 size={18} color="#38bdf8" />}
          </button>
        </div>
      </div>

      {/* 5. Center Title & Floating Emblem */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          pointerEvents: 'auto',
          marginTop: -20
        }}
      >
        {/* Animated Emblem / Logo */}
        <div
          style={{
            animation: 'bastion-float 4.5s infinite ease-in-out',
            filter: 'drop-shadow(0 4px 30px rgba(245, 158, 11, 0.55)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.8))'
          }}
        >
          <img
            src="/assets/ui/logo_the_last_bastion.png"
            alt="The Last Bastion"
            style={{
              width: 360,
              maxWidth: '85vw',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Subtitle Lore */}
        <div
          style={{
            marginTop: 10,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#fef08a',
            textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 0 20px rgba(245, 158, 11, 0.4)',
            fontFamily: 'var(--font-fantasy)',
            maxWidth: 600,
            padding: '0 20px'
          }}
        >
          {i18n.t('menu.subtitle')}
        </div>
      </div>

      {/* 6. Navigation Buttons Section */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          marginBottom: 42,
          pointerEvents: 'auto',
          width: '100%',
          maxWidth: 720,
          padding: '0 24px'
        }}
      >
        {/* Primary Action Button: Start / Continue Campaign */}
        <button
          onClick={handleStartCampaign}
          onMouseEnter={() => audioManager.playMenuHover()}
          className="menu-hero-btn"
          style={{
            width: '100%',
            maxWidth: 440,
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14
          }}
        >
          <Swords size={28} color="#fde047" />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: 1.5,
                color: '#ffffff',
                textShadow: '0 2px 6px rgba(0,0,0,0.8)'
              }}
            >
              {isContinue ? i18n.t('menu.continueCampaign') : i18n.t('menu.startCampaign')}
            </span>
            <span
              style={{
                fontSize: 11,
                color: '#fef08a',
                fontWeight: 600,
                letterSpacing: 0.5,
                marginTop: 2
              }}
            >
              {i18n.t(latestUnlockedMission.nameKey)}
            </span>
          </div>
          <ChevronRight size={24} color="#fde047" style={{ marginLeft: 'auto' }} />
        </button>

        {/* Secondary Actions Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            width: '100%',
            maxWidth: 620
          }}
        >
          {/* Level Select */}
          <button
            onClick={() => {
              audioManager.playMenuSelect();
              setIsLevelDrawerOpen(true);
            }}
            onMouseEnter={() => audioManager.playMenuHover()}
            className="menu-sub-btn"
            style={{
              padding: '12px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Map size={22} color="#38bdf8" />
            <span style={{ fontSize: 12, fontWeight: 700 }}>{i18n.t('menu.levelSelect')}</span>
          </button>

          {/* Tech Tree */}
          <button
            onClick={() => {
              audioManager.playMenuSelect();
              setTechTreeOpen(true);
            }}
            onMouseEnter={() => audioManager.playMenuHover()}
            className="menu-sub-btn"
            style={{
              padding: '12px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Sparkles size={22} color="#fbbf24" />
            <span style={{ fontSize: 12, fontWeight: 700 }}>{i18n.t('menu.techTree')}</span>
          </button>

          {/* Codex */}
          <button
            onClick={() => {
              audioManager.playMenuSelect();
              setCodexOpen(true);
            }}
            onMouseEnter={() => audioManager.playMenuHover()}
            className="menu-sub-btn"
            style={{
              padding: '12px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6
            }}
          >
            <BookOpen size={22} color="#4ade80" />
            <span style={{ fontSize: 12, fontWeight: 700 }}>{i18n.t('menu.codex')}</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              audioManager.playMenuSelect();
              setSettingsOpen(true);
            }}
            onMouseEnter={() => audioManager.playMenuHover()}
            className="menu-sub-btn"
            style={{
              padding: '12px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Settings size={22} color="#94a3b8" />
            <span style={{ fontSize: 12, fontWeight: 700 }}>{i18n.t('menu.settings')}</span>
          </button>
        </div>
      </div>

      {/* 7. Quick Level Selection Modal / Drawer */}
      {isLevelDrawerOpen && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(3, 7, 18, 0.92)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24
          }}
        >
          <div
            className="fantasy-panel"
            style={{
              width: '100%',
              maxWidth: 960,
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(15, 23, 42, 0.96)',
              borderColor: '#fbbf24',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(245, 158, 11, 0.3)'
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(90deg, #1e293b, #0f172a)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Map size={24} color="#facc15" />
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-fantasy)',
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#f8fafc'
                    }}
                  >
                    {i18n.t('menu.quickSelect')}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>
                    {i18n.t('region.greenlands.name')} (6 {i18n.t('menu.mission')})
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => {
                    audioManager.playMenuSelect();
                    setIsLevelDrawerOpen(false);
                    setCampaignMapOpen(true);
                  }}
                  onMouseEnter={() => audioManager.playMenuHover()}
                  className="fantasy-btn fantasy-btn-primary"
                  style={{ fontSize: 12, padding: '6px 14px' }}
                >
                  <Map size={15} />
                  {i18n.t('menu.levelSelect')}
                </button>

                <button
                  onClick={() => {
                    audioManager.playUi();
                    setIsLevelDrawerOpen(false);
                  }}
                  className="fantasy-btn"
                  style={{ padding: '6px 10px' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Missions Grid */}
            <div
              style={{
                padding: 24,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 18,
                overflowY: 'auto'
              }}
            >
              {allMissions.map((m, idx) => {
                const isUnlocked = SaveService.isMissionUnlocked(m.id);
                const stars = SaveService.getMissionStars(m.id);
                const thumbnail = missionThumbnails[m.id] || '/assets/maps/forest_road_bg.png';

                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      if (isUnlocked) launchMission(m.id);
                    }}
                    onMouseEnter={() => {
                      if (isUnlocked) audioManager.playMenuHover();
                    }}
                    style={{
                      position: 'relative',
                      borderRadius: 10,
                      overflow: 'hidden',
                      border: isUnlocked ? '2px solid #475569' : '2px solid #1e293b',
                      backgroundColor: '#0f172a',
                      cursor: isUnlocked ? 'pointer' : 'not-allowed',
                      opacity: isUnlocked ? 1 : 0.55,
                      transition: 'all 0.2s ease',
                      boxShadow: '0 6px 18px rgba(0,0,0,0.6)'
                    }}
                    onMouseOver={(e) => {
                      if (isUnlocked) {
                        e.currentTarget.style.borderColor = '#fbbf24';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (isUnlocked) {
                        e.currentTarget.style.borderColor = '#475569';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {/* Thumbnail Image */}
                    <div style={{ position: 'relative', width: '100%', height: 110, overflow: 'hidden' }}>
                      <img
                        src={thumbnail}
                        alt={i18n.t(m.nameKey)}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: isUnlocked ? undefined : 'grayscale(1) brightness(0.6)'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, transparent 40%, rgba(15, 23, 42, 0.95) 100%)'
                        }}
                      />

                      {/* Mission Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          padding: '2px 8px',
                          borderRadius: 4,
                          backgroundColor: 'rgba(0,0,0,0.75)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          fontSize: 11,
                          fontWeight: 800,
                          color: '#f8fafc',
                          fontFamily: 'var(--font-fantasy)'
                        }}
                      >
                        #{idx + 1}
                      </div>

                      {/* Locked Overlay Icon */}
                      {!isUnlocked && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)'
                          }}
                        >
                          <Lock size={28} color="#94a3b8" />
                        </div>
                      )}
                    </div>

                    {/* Mission Details */}
                    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-fantasy)',
                          fontSize: 14,
                          fontWeight: 700,
                          color: isUnlocked ? '#fef08a' : '#64748b',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {i18n.t(m.nameKey)}
                      </div>

                      {/* Stars Earned */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: 3 }}>
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              color={s <= stars ? '#facc15' : '#334155'}
                              fill={s <= stars ? '#facc15' : 'none'}
                            />
                          ))}
                        </div>

                        {/* Reward Crystals */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#c084fc' }}>
                          <Gem size={12} />
                          <span>+{m.rewards.firstClearRiftCrystals}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      {isUnlocked && (
                        <div
                          style={{
                            marginTop: 6,
                            padding: '6px 0',
                            textAlign: 'center',
                            borderRadius: 6,
                            background: 'linear-gradient(180deg, #d97706, #b45309)',
                            color: '#ffffff',
                            fontSize: 12,
                            fontWeight: 700,
                            fontFamily: 'var(--font-fantasy)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6
                          }}
                        >
                          <Play size={12} fill="#ffffff" />
                          <span>{i18n.t('menu.playMission')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
