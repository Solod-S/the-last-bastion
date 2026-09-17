import { MapDefinition } from '../../core/types/map';

export const crystalGroveMap: MapDefinition = {
  id: 'map.greenlands.crystalGrove',
  regionId: 'region.greenlands',
  nameKey: 'map.greenlands.crystalGrove.name',
  width: 1280,
  height: 720,
  spawnPoint: { x: 140, y: 550 },
  exitPoint: { x: 1160, y: 180 },
  path: [
    { x: 140, y: 550 },
    { x: 300, y: 550 },
    { x: 420, y: 440 },
    { x: 440, y: 260 },
    { x: 600, y: 190 },
    { x: 740, y: 280 },
    { x: 780, y: 480 },
    { x: 920, y: 520 },
    { x: 1040, y: 380 },
    { x: 1160, y: 180 }
  ],
  towerSlots: [
    { id: 'slot_1', x: 250, y: 440 },
    { id: 'slot_2', x: 340, y: 340 },
    { id: 'slot_3', x: 540, y: 320 },
    { id: 'slot_4', x: 500, y: 150 },
    { id: 'slot_5', x: 670, y: 150 },
    { id: 'slot_6', x: 660, y: 420 },
    { id: 'slot_7', x: 680, y: 580 },
    { id: 'slot_8', x: 880, y: 380 },
    { id: 'slot_9', x: 900, y: 220 },
    { id: 'slot_10', x: 1040, y: 520 },
    { id: 'slot_11', x: 1150, y: 320 }
  ],
  interactiveObjects: [
    {
      id: 'mana_crystal_grove_1',
      nameKey: 'prop.manaCrystal.name',
      descriptionKey: 'prop.manaCrystal.description',
      type: 'mana_crystal',
      x: 320,
      y: 190,
      goldReward: 65,
      cooldownSeconds: 50,
      singleUse: false
    },
    {
      id: 'mana_crystal_grove_2',
      nameKey: 'prop.manaCrystal.name',
      descriptionKey: 'prop.manaCrystal.description',
      type: 'mana_crystal',
      x: 880,
      y: 590,
      goldReward: 65,
      cooldownSeconds: 50,
      singleUse: false
    },
    {
      id: 'treasure_chest_grove',
      nameKey: 'prop.treasureChest.name',
      descriptionKey: 'prop.treasureChest.description',
      type: 'treasure_chest',
      x: 580,
      y: 470,
      goldReward: 110,
      singleUse: true
    }
  ]
};
