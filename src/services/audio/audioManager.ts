import { WebAudioEngine } from './webAudioEngine';
import { SaveService } from '../save/saveService';

class AudioManager {
  private engine = new WebAudioEngine();
  private initialized = false;

  public init(): void {
    if (this.initialized) return;
    this.engine.init();
    this.syncWithSave();
    this.initialized = true;
  }

  public syncWithSave(): void {
    const profile = SaveService.load();
    const { masterVolume, musicVolume, sfxVolume, ambientVolume, muted } = profile.settings.audio;
    this.engine.setVolumes(masterVolume, musicVolume, sfxVolume, ambientVolume, muted);
  }

  public ensureAudioUnlocked(): void {
    this.engine.ensureContext();
  }

  public setMuted(muted: boolean): void {
    const profile = SaveService.load();
    profile.settings.audio.muted = muted;
    SaveService.save(profile);
    this.syncWithSave();
  }

  public setVolumes(master: number, music: number, sfx: number, ambient: number): void {
    const profile = SaveService.load();
    profile.settings.audio.masterVolume = master;
    profile.settings.audio.musicVolume = music;
    profile.settings.audio.sfxVolume = sfx;
    profile.settings.audio.ambientVolume = ambient;
    SaveService.save(profile);
    this.syncWithSave();
  }

  // Audio trigger wrappers
  public playArrow(): void {
    this.engine.playArrowShot();
  }

  public playMagic(): void {
    this.engine.playMagicShot();
  }

  public playCannon(): void {
    this.engine.playCannonShot();
  }

  public playCoin(): void {
    this.engine.playCoinSound();
  }

  public playSword(): void {
    this.engine.playSwordClash();
  }

  public playWaveHorn(): void {
    this.engine.playWaveHorn();
  }

  public playBuild(): void {
    this.engine.playHammerBuild();
  }

  public playUi(): void {
    this.engine.playUiClick();
  }

  public playHit(): void {
    this.engine.playHitSound();
  }

  public playDeath(): void {
    this.engine.playDeathSound();
  }

  public playVictory(): void {
    this.engine.playVictory();
  }

  public playDefeat(): void {
    this.engine.playDefeat();
  }

  public startMusic(): void {
    this.engine.startBattleMusic();
  }

  public stopMusic(): void {
    this.engine.stopBattleMusic();
  }
}

export const audioManager = new AudioManager();
