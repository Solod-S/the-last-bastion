import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { i18n, SupportedLanguage } from '../../services/localization/i18n';
import { audioManager } from '../../services/audio/audioManager';
import { SaveService } from '../../services/save/saveService';
import { Volume2, Globe, Keyboard, X } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const isSettingsOpen = useGameStore((state) => state.isSettingsOpen);
  const setSettingsOpen = useGameStore((state) => state.setSettingsOpen);

  const profile = SaveService.load();
  const [masterVol, setMasterVol] = useState(profile.settings.audio.masterVolume);
  const [musicVol, setMusicVol] = useState(profile.settings.audio.musicVolume);
  const [sfxVol, setSfxVol] = useState(profile.settings.audio.sfxVolume);
  const [ambientVol, setAmbientVol] = useState(profile.settings.audio.ambientVolume);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(i18n.getLanguage());

  if (!isSettingsOpen) return null;

  const handleVolumeChange = (type: 'master' | 'music' | 'sfx' | 'ambient', val: number) => {
    let m = masterVol,
      mu = musicVol,
      s = sfxVol,
      a = ambientVol;
    if (type === 'master') {
      m = val;
      setMasterVol(val);
    } else if (type === 'music') {
      mu = val;
      setMusicVol(val);
    } else if (type === 'sfx') {
      s = val;
      setSfxVol(val);
    } else if (type === 'ambient') {
      a = val;
      setAmbientVol(val);
    }

    audioManager.setVolumes(m, mu, s, a);
  };

  const handleLangChange = (lang: SupportedLanguage) => {
    i18n.setLanguage(lang);
    setCurrentLang(lang);
    const p = SaveService.load();
    p.settings.gameplay.language = lang;
    SaveService.save(p);
    audioManager.playUi();
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        backdropFilter: 'blur(6px)'
      }}
    >
      <div
        className="fantasy-panel"
        style={{
          width: 440,
          padding: '24px 28px',
          border: '2px solid #64748b'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            borderBottom: '1px solid #334155',
            paddingBottom: 10
          }}
        >
          <div style={{ fontFamily: 'var(--font-fantasy)', fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>
            {i18n.t('game.settings')}
          </div>
          <button
            onClick={() => {
              audioManager.playUi();
              setSettingsOpen(false);
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
            <X size={20} />
          </button>
        </div>

        {/* Audio Sliders */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              color: '#38bdf8',
              marginBottom: 12,
              textTransform: 'uppercase'
            }}
          >
            <Volume2 size={16} />
            <span>Звук и Музыка</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#cbd5e1' }}>
                <span>{i18n.t('ui.sound.master')}</span>
                <span>{Math.round(masterVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={masterVol}
                onChange={(e) => handleVolumeChange('master', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#2563eb' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#cbd5e1' }}>
                <span>{i18n.t('ui.sound.music')}</span>
                <span>{Math.round(musicVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVol}
                onChange={(e) => handleVolumeChange('music', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#2563eb' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#cbd5e1' }}>
                <span>{i18n.t('ui.sound.sfx')}</span>
                <span>{Math.round(sfxVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVol}
                onChange={(e) => handleVolumeChange('sfx', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#2563eb' }}
              />
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              color: '#38bdf8',
              marginBottom: 10,
              textTransform: 'uppercase'
            }}
          >
            <Globe size={16} />
            <span>{i18n.t('ui.language')}</span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {(['ru', 'en', 'uk'] as SupportedLanguage[]).map((lang) => (
              <button
                key={lang}
                className={`fantasy-btn ${currentLang === lang ? 'fantasy-btn-primary' : ''}`}
                onClick={() => handleLangChange(lang)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {lang === 'ru' ? 'Русский' : lang === 'en' ? 'English' : 'Українська'}
              </button>
            ))}
          </div>
        </div>

        {/* Hotkeys */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: 12, borderRadius: 6, fontSize: 11 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#94a3b8',
              marginBottom: 6,
              fontWeight: 700
            }}
          >
            <Keyboard size={14} />
            <span>Горячие клавиши</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, color: '#e2e8f0' }}>
            <div>
              <kbd style={{ background: '#334155', padding: '2px 5px', borderRadius: 3 }}>Space</kbd> : Пауза
            </div>
            <div>
              <kbd style={{ background: '#334155', padding: '2px 5px', borderRadius: 3 }}>1, 2, 3</kbd> : Скорость
            </div>
            <div>
              <kbd style={{ background: '#334155', padding: '2px 5px', borderRadius: 3 }}>W</kbd> : Вызов волны
            </div>
            <div>
              <kbd style={{ background: '#334155', padding: '2px 5px', borderRadius: 3 }}>Esc</kbd> : Закрыть окно
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
