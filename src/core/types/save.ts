export interface AudioSettings {
  masterVolume: number; // 0..1
  musicVolume: number; // 0..1
  sfxVolume: number; // 0..1
  ambientVolume: number; // 0..1
  muted: boolean;
}

export interface GameplaySettings {
  language: 'ru' | 'en' | 'uk';
  showDamageNumbers: boolean;
  screenShake: boolean;
}

export interface MissionProgress {
  stars: number;
  unlocked: boolean;
  highScore: number;
  completedAt?: string;
}

export interface SaveProfile {
  schemaVersion: number;
  updatedAt: string;
  settings: {
    audio: AudioSettings;
    gameplay: GameplaySettings;
  };
  campaign: {
    currentRegionId: string;
    missions: Record<string, MissionProgress>;
    riftCrystals: number;
    starsTotal: number;
    upgrades?: Record<string, number>;
    selectedHeroId?: string;
  };
}
