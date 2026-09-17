import { SaveProfile } from '../../core/types/save';
import { ALL_TECH_UPGRADES } from '../../content/upgrades/techTree';

const STORAGE_KEY = 'the_last_bastion_save_profile';
const CURRENT_SCHEMA_VERSION = 3;

export const DEFAULT_SAVE_PROFILE: SaveProfile = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  updatedAt: new Date().toISOString(),
  settings: {
    audio: {
      masterVolume: 0.8,
      musicVolume: 0.6,
      sfxVolume: 0.8,
      ambientVolume: 0.5,
      muted: false
    },
    gameplay: {
      language: 'en',
      showDamageNumbers: true,
      screenShake: true
    }
  },
  campaign: {
    currentRegionId: 'region.greenlands',
    missions: {
      'mission.greenlands.01': {
        stars: 0,
        unlocked: true,
        highScore: 0
      }
    },
    riftCrystals: 0,
    starsTotal: 0,
    upgrades: {},
    selectedHeroId: 'hero.commander'
  }
};

export class SaveService {
  private static cachedProfile: SaveProfile | null = null;

  public static load(): SaveProfile {
    if (this.cachedProfile) return this.cachedProfile;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.cachedProfile = { ...DEFAULT_SAVE_PROFILE };
        this.save(this.cachedProfile);
        return this.cachedProfile;
      }

      const parsed = JSON.parse(raw);
      const migrated = this.migrate(parsed);
      this.cachedProfile = migrated;
      return migrated;
    } catch (e) {
      console.warn('[SaveService] Failed to load save, fallback to default:', e);
      this.cachedProfile = { ...DEFAULT_SAVE_PROFILE };
      return this.cachedProfile;
    }
  }

  public static save(profile: SaveProfile): void {
    try {
      profile.updatedAt = new Date().toISOString();
      this.cachedProfile = profile;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('[SaveService] Failed to persist save:', e);
    }
  }

  public static recordMissionVictory(
    missionId: string,
    stars: number,
    score: number,
    nextMissionId?: string
  ): void {
    const profile = this.load();
    const current = profile.campaign.missions[missionId] || { stars: 0, unlocked: true, highScore: 0 };

    const oldStars = current.stars;
    current.stars = Math.max(current.stars, stars);
    current.highScore = Math.max(current.highScore, score);
    current.completedAt = new Date().toISOString();

    profile.campaign.missions[missionId] = current;
    const gainedStars = Math.max(0, current.stars - oldStars);
    profile.campaign.starsTotal += gainedStars;
    profile.campaign.riftCrystals += gainedStars * 10;

    // Unlock next mission if available
    if (nextMissionId) {
      if (!profile.campaign.missions[nextMissionId]) {
        profile.campaign.missions[nextMissionId] = { stars: 0, unlocked: true, highScore: 0 };
      } else {
        profile.campaign.missions[nextMissionId].unlocked = true;
      }
    }

    this.save(profile);
  }

  public static isMissionUnlocked(missionId: string): boolean {
    if (missionId === 'mission.greenlands.01') return true;
    const profile = this.load();
    return Boolean(profile.campaign.missions[missionId]?.unlocked);
  }

  public static getMissionStars(missionId: string): number {
    const profile = this.load();
    return profile.campaign.missions[missionId]?.stars || 0;
  }

  public static getSpentStars(): number {
    const profile = this.load();
    const upgrades = profile.campaign.upgrades || {};
    let spent = 0;
    for (const node of ALL_TECH_UPGRADES) {
      if (upgrades[node.id]) {
        spent += node.starCost;
      }
    }
    return spent;
  }

  public static getAvailableStars(): number {
    const profile = this.load();
    return Math.max(0, profile.campaign.starsTotal - this.getSpentStars());
  }

  public static hasUpgrade(upgradeId: string): boolean {
    const profile = this.load();
    return Boolean(profile.campaign.upgrades?.[upgradeId]);
  }

  public static purchaseUpgrade(upgradeId: string): boolean {
    const node = ALL_TECH_UPGRADES.find((u) => u.id === upgradeId);
    if (!node) return false;

    const available = this.getAvailableStars();
    if (available < node.starCost) return false;

    const profile = this.load();
    profile.campaign.upgrades = profile.campaign.upgrades || {};
    profile.campaign.upgrades[upgradeId] = 1;
    this.save(profile);
    return true;
  }

  public static resetUpgrades(): void {
    const profile = this.load();
    profile.campaign.upgrades = {};
    this.save(profile);
  }

  private static migrate(data: any): SaveProfile {
    if (!data || typeof data !== 'object') {
      return { ...DEFAULT_SAVE_PROFILE };
    }

    // Version migrations
    if (!data.schemaVersion || data.schemaVersion < 2) {
      if (!data.settings?.gameplay?.language || data.settings?.gameplay?.language === 'ru') {
        data.settings = data.settings || {};
        data.settings.gameplay = data.settings.gameplay || {};
        data.settings.gameplay.language = 'en';
      }
      data.schemaVersion = 2;
    }

    if (data.schemaVersion < 3) {
      data.campaign = data.campaign || {};
      data.campaign.upgrades = data.campaign.upgrades || {};
      data.campaign.selectedHeroId = data.campaign.selectedHeroId || 'hero.commander';
      data.schemaVersion = 3;
    }

    return {
      ...DEFAULT_SAVE_PROFILE,
      ...data,
      settings: {
        ...DEFAULT_SAVE_PROFILE.settings,
        ...(data.settings || {})
      },
      campaign: {
        ...DEFAULT_SAVE_PROFILE.campaign,
        ...(data.campaign || {})
      }
    };
  }
}
