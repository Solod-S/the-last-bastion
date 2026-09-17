import { CommanderSpellDefinition } from '../../core/types/spells';

export const meteorStrikeSpell: CommanderSpellDefinition = {
  id: 'spell_meteor',
  type: 'meteor',
  nameKey: 'spell.meteor.name',
  descriptionKey: 'spell.meteor.desc',
  cooldown: 45,
  radius: 110,
  damage: 320,
  iconKey: 'icon_spell_meteor'
};

export const reinforcementsSpell: CommanderSpellDefinition = {
  id: 'spell_reinforcements',
  type: 'reinforcements',
  nameKey: 'spell.reinforcements.name',
  descriptionKey: 'spell.reinforcements.desc',
  cooldown: 22,
  radius: 65,
  summonCount: 2,
  duration: 35,
  iconKey: 'icon_spell_reinforcements'
};

export const allCommanderSpells: CommanderSpellDefinition[] = [
  meteorStrikeSpell,
  reinforcementsSpell
];
