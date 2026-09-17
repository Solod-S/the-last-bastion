export type CommanderSpellType = 'meteor' | 'reinforcements';

export interface CommanderSpellDefinition {
  id: string;
  type: CommanderSpellType;
  nameKey: string;
  descriptionKey: string;
  cooldown: number; // seconds
  radius: number; // pixels
  damage?: number;
  summonCount?: number;
  duration?: number; // seconds
  iconKey: string;
}

export interface CommanderSpellRuntimeState {
  spellId: string;
  type: CommanderSpellType;
  cooldownRemaining: number;
  maxCooldown: number;
  isReady: boolean;
}
