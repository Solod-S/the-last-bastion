import { HeroDefinition } from '../../core/types/hero';

export const bastionCommander: HeroDefinition = {
  id: 'hero.commander',
  nameKey: 'hero.commander.name',
  descriptionKey: 'hero.commander.description',
  maxHealth: 550,
  armor: 20,
  damage: 45,
  attackInterval: 1.0,
  baseSpeed: 110,
  respawnTime: 15,
  ability: {
    id: 'heroic_strike',
    nameKey: 'hero.commander.ability.name',
    descriptionKey: 'hero.commander.ability.desc',
    cooldown: 18,
    damage: 180,
    stunDuration: 2.5,
    radius: 95,
    iconKey: 'icon_ability_strike'
  },
  assetKey: 'hero_commander'
};
