import { EnemyDefinition } from '../../core/types/enemies';

export const goblinRunner: EnemyDefinition = {
  id: 'enemy.goblinRunner',
  nameKey: 'enemy.goblinRunner.name',
  descriptionKey: 'enemy.goblinRunner.description',
  class: 'small',
  movementType: 'ground',
  baseSpeed: 95,
  maxHealth: 75,
  defense: { armor: 0, magicResistance: 0 },
  rewardGold: 7,
  leakDamage: 1,
  tags: ['goblin', 'fast'],
  assetKey: 'enemy_goblin_runner'
};

export const orcBrute: EnemyDefinition = {
  id: 'enemy.orcBrute',
  nameKey: 'enemy.orcBrute.name',
  descriptionKey: 'enemy.orcBrute.description',
  class: 'large',
  movementType: 'ground',
  baseSpeed: 48,
  maxHealth: 320,
  defense: { armor: 15, magicResistance: 0 },
  rewardGold: 18,
  leakDamage: 2,
  tags: ['orc', 'tank'],
  assetKey: 'enemy_orc_brute'
};

export const riftKnight: EnemyDefinition = {
  id: 'enemy.riftKnight',
  nameKey: 'enemy.riftKnight.name',
  descriptionKey: 'enemy.riftKnight.description',
  class: 'medium',
  movementType: 'ground',
  baseSpeed: 60,
  maxHealth: 240,
  // High physical armor (60 armor absorbs ~37.5% physical damage), 0% magic resistance (weak to mage tower!)
  defense: { armor: 60, magicResistance: 0 },
  rewardGold: 22,
  leakDamage: 2,
  tags: ['rift', 'armored'],
  assetKey: 'enemy_rift_knight'
};

export const shamanHealer: EnemyDefinition = {
  id: 'enemy.shamanHealer',
  nameKey: 'enemy.shamanHealer.name',
  descriptionKey: 'enemy.shamanHealer.description',
  class: 'medium',
  movementType: 'ground',
  baseSpeed: 52,
  maxHealth: 190,
  defense: { armor: 5, magicResistance: 0.2 },
  rewardGold: 25,
  leakDamage: 1,
  tags: ['orc', 'healer', 'support'],
  abilities: [
    {
      type: 'heal_aura',
      radius: 130,
      value: 30,
      interval: 3.0
    }
  ],
  assetKey: 'enemy_shaman_healer'
};

export const sapper: EnemyDefinition = {
  id: 'enemy.sapper',
  nameKey: 'enemy.sapper.name',
  descriptionKey: 'enemy.sapper.description',
  class: 'small',
  movementType: 'ground',
  baseSpeed: 90,
  maxHealth: 110,
  defense: { armor: 5, magicResistance: 0 },
  rewardGold: 14,
  leakDamage: 2,
  tags: ['goblin', 'sapper', 'explosive'],
  assetKey: 'enemy_sapper'
};

export const troll: EnemyDefinition = {
  id: 'enemy.troll',
  nameKey: 'enemy.troll.name',
  descriptionKey: 'enemy.troll.description',
  class: 'large',
  movementType: 'ground',
  baseSpeed: 44,
  maxHealth: 680,
  defense: { armor: 25, magicResistance: 0.15 },
  rewardGold: 45,
  leakDamage: 3,
  tags: ['troll', 'regen', 'tank'],
  abilities: [
    {
      type: 'regen',
      value: 20,
      interval: 2.0
    }
  ],
  assetKey: 'enemy_troll'
};

export const trollKing: EnemyDefinition = {
  id: 'enemy.trollKing',
  nameKey: 'enemy.trollKing.name',
  descriptionKey: 'enemy.trollKing.description',
  class: 'boss',
  movementType: 'ground',
  baseSpeed: 38,
  maxHealth: 4500,
  defense: { armor: 40, magicResistance: 0.25 },
  rewardGold: 300,
  leakDamage: 10,
  tags: ['boss', 'troll', 'heavy'],
  abilities: [
    {
      type: 'regen',
      value: 35,
      interval: 2.0
    }
  ],
  assetKey: 'enemy_troll_king'
};

export const allEnemies: EnemyDefinition[] = [
  goblinRunner,
  orcBrute,
  riftKnight,
  shamanHealer,
  sapper,
  troll,
  trollKing
];
