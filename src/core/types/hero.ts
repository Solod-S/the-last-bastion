export interface HeroAbilityDefinition {
  id: string;
  nameKey: string;
  descriptionKey: string;
  cooldown: number; // seconds
  damage: number;
  stunDuration: number; // seconds
  radius: number; // pixels
  iconKey: string;
}

export interface HeroDefinition {
  id: string;
  nameKey: string;
  descriptionKey: string;
  maxHealth: number;
  armor: number;
  damage: number;
  attackInterval: number; // seconds
  baseSpeed: number; // pixels per second
  respawnTime: number; // seconds
  ability: HeroAbilityDefinition;
  assetKey: string;
}

export interface HeroRuntimeState {
  id: string;
  currentHp: number;
  maxHp: number;
  isDead: boolean;
  respawnTimeRemaining: number;
  abilityCooldownRemaining: number;
  abilityMaxCooldown: number;
  x: number;
  y: number;
}
