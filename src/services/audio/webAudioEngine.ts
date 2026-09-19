/**
 * Procedural Web Audio synthesizer for crisp, dynamic retro/fantasy sounds.
 * Generates arrows, spells, cannon booms, coin jingles, swords, horns, and ambient pads.
 */
export class WebAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;

  private isMuted: boolean = false;
  private musicInterval: number | null = null;

  public init(): void {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.ambientGain = this.ctx.createGain();

      this.sfxGain.connect(this.masterGain);
      this.musicGain.connect(this.masterGain);
      this.ambientGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('[WebAudioEngine] Web Audio API not supported:', e);
    }
  }

  public ensureContext(): void {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(master: number, music: number, sfx: number, ambient: number, muted: boolean): void {
    this.isMuted = muted;
    if (!this.ctx) return;

    const effectiveMaster = muted ? 0 : master;
    if (this.masterGain) this.masterGain.gain.setValueAtTime(effectiveMaster, this.ctx.currentTime);
    if (this.musicGain) this.musicGain.gain.setValueAtTime(music * 0.4, this.ctx.currentTime);
    if (this.sfxGain) this.sfxGain.gain.setValueAtTime(sfx * 0.7, this.ctx.currentTime);
    if (this.ambientGain) this.ambientGain.gain.setValueAtTime(ambient * 0.3, this.ctx.currentTime);
  }

  // SFX: Arrow release & whoosh
  public playArrowShot(): void {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain!);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // SFX: Magic arcane crystal blast
  public playMagicShot(): void {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.22);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(540, now);
    osc2.frequency.exponentialRampToValueAtTime(180, now + 0.22);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain!);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.22);
    osc2.stop(now + 0.22);
  }

  // SFX: Cannon boom & explosion
  public playCannonShot(): void {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Deep sub boom
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.4);

    oscGain.gain.setValueAtTime(0.7, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain!);

    osc.start(now);
    osc.stop(now + 0.4);

    // Noise crackle
    this.playNoiseBurst(0.35, 300);
  }

  // SFX: Coin chime on kill or reward
  public playCoinSound(): void {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.06); // E6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain!);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // SFX: Melee clash
  public playSwordClash(): void {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain!);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // SFX: Horn fanfare for wave start
  public playWaveHorn(): void {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const notes = [220, 277.18, 329.63, 440]; // A3, C#4, E4, A4
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.4);
    });
  }

  // SFX: Tower build / upgrade hammer sound
  public playHammerBuild(): void {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain!);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // SFX: UI button click
  public playUiClick(): void {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain!);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // SFX: Enemy hit reaction
  public playHitSound(): void {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain!);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // SFX: Enemy death
  public playDeathSound(): void {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain!);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // SFX: Victory fanfare
  public playVictory(): void {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.0, 523.25]; // C, E, G, C

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.18);

      gain.gain.setValueAtTime(0.25, now + idx * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.18 + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.18);
      osc.stop(now + idx * 0.18 + 0.6);
    });
  }

  // SFX: Defeat sound
  public playDefeat(): void {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [329.63, 311.13, 293.66, 220.0];

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.25);

      gain.gain.setValueAtTime(0.3, now + idx * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.25 + 0.7);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.25);
      osc.stop(now + idx * 0.25 + 0.7);
    });
  }

  private menuMusicInterval: number | null = null;

  // Menu Music: Noble fantasy chord progression with arpeggios
  public startMenuMusic(): void {
    if (this.menuMusicInterval) return;
    this.ensureContext();

    const menuChords = [
      { bass: 146.83, chord: [220.0, 349.23, 440.0], arp: [587.33, 523.25, 440.0, 349.23] }, // Dm
      { bass: 116.54, chord: [174.61, 293.66, 349.23], arp: [466.16, 440.0, 349.23, 293.66] }, // Bb
      { bass: 130.81, chord: [196.0, 261.63, 329.63], arp: [523.25, 493.88, 392.0, 329.63] },  // C
      { bass: 110.0,  chord: [164.81, 220.0, 261.63], arp: [440.0, 392.0, 329.63, 261.63] }    // Am
    ];
    let step = 0;

    const playStep = () => {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const { bass, chord, arp } = menuChords[step % menuChords.length];
      step++;

      // Warm bass drone
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bass, now);
      bassGain.gain.setValueAtTime(0, now);
      bassGain.gain.linearRampToValueAtTime(0.12, now + 0.6);
      bassGain.gain.exponentialRampToValueAtTime(0.005, now + 3.8);
      bassOsc.connect(bassGain);
      bassGain.connect(this.musicGain!);
      bassOsc.start(now);
      bassOsc.stop(now + 3.8);

      // Warm mid chord
      chord.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.003, now + 3.8);
        osc.connect(gain);
        gain.connect(this.musicGain!);
        osc.start(now);
        osc.stop(now + 3.8);
      });

      // Delicate harp arpeggio
      arp.forEach((freq, idx) => {
        const harpTime = now + 0.4 + idx * 0.45;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, harpTime);
        gain.gain.setValueAtTime(0, harpTime);
        gain.gain.linearRampToValueAtTime(0.05, harpTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, harpTime + 1.2);
        osc.connect(gain);
        gain.connect(this.musicGain!);
        osc.start(harpTime);
        osc.stop(harpTime + 1.2);
      });
    };

    playStep();
    this.menuMusicInterval = window.setInterval(playStep, 4000);
  }

  public stopMenuMusic(): void {
    if (this.menuMusicInterval) {
      clearInterval(this.menuMusicInterval);
      this.menuMusicInterval = null;
    }
  }

  // SFX: Soft UI Hover Chime
  public playMenuHover(): void {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // SFX: Menu Select / Sword Draw
  public playMenuSelect(): void {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // High metal ring
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Continuous medieval music loop
  public startBattleMusic(): void {
    if (this.musicInterval) return;
    this.ensureContext();

    const chords = [
      [146.83, 220.0, 261.63], // D minor
      [130.81, 196.0, 246.94], // C major
      [110.0, 164.81, 220.0],  // A minor
      [123.47, 185.0, 246.94]  // B dim
    ];
    let step = 0;

    const playStep = () => {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const chord = chords[step % chords.length];
      step++;

      chord.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 2.8);

        osc.connect(gain);
        gain.connect(this.musicGain!);

        osc.start(now);
        osc.stop(now + 2.8);
      });
    };

    playStep();
    this.musicInterval = window.setInterval(playStep, 3000);
  }

  public stopBattleMusic(): void {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // Procedural noise burst for explosions and impacts
  private playNoiseBurst(duration: number, cutoff: number): void {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff, now);
    filter.frequency.exponentialRampToValueAtTime(50, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain!);

    noise.start(now);
  }
}
