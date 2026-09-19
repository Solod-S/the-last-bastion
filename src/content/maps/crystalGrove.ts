import { MapDefinition } from '../../core/types/map';

export const crystalGroveMap: MapDefinition = {
  id: 'map.greenlands.crystalGrove',
  regionId: 'region.greenlands',
  nameKey: 'map.greenlands.crystalGrove.name',
  width: 1280,
  height: 720,
  spawnPoint: { x: 0, y: 650 },
  exitPoint: { x: 1280, y: 130 },
  path: [
    { x: 0, y: 650 },
    { x: 110, y: 620 },
    { x: 230, y: 550 },
    { x: 240, y: 390 },
    { x: 280, y: 280 },
    { x: 390, y: 210 },
    { x: 510, y: 230 },
    { x: 590, y: 310 },
    { x: 640, y: 470 },
    { x: 690, y: 570 },
    { x: 800, y: 570 },
    { x: 900, y: 490 },
    { x: 970, y: 370 },
    { x: 1040, y: 250 },
    { x: 1140, y: 190 },
    { x: 1280, y: 130 }
  ],
  towerSlots: [
    { id: 'slot_1', x: 115, y: 690 },
    { id: 'slot_2', x: 370, y: 630 },
    { id: 'slot_3', x: 320, y: 490 },
    { id: 'slot_4', x: 340, y: 320 },
    { id: 'slot_5', x: 565, y: 500 },
    { id: 'slot_6', x: 630, y: 210 },
    { id: 'slot_7', x: 765, y: 590 },
    { id: 'slot_8', x: 870, y: 190 },
    { id: 'slot_9', x: 990, y: 460 },
    { id: 'slot_10', x: 1000, y: 280 },
    { id: 'slot_11', x: 1130, y: 120 }
  ],
  interactiveObjects: [
    {
      id: 'mana_crystal_grove_1',
      nameKey: 'prop.manaCrystal.name',
      descriptionKey: 'prop.manaCrystal.description',
      type: 'mana_crystal',
      x: 210,
      y: 420,
      goldReward: 65,
      cooldownSeconds: 50,
      singleUse: false
    },
    {
      id: 'mana_crystal_grove_2',
      nameKey: 'prop.manaCrystal.name',
      descriptionKey: 'prop.manaCrystal.description',
      type: 'mana_crystal',
      x: 1150,
      y: 540,
      goldReward: 65,
      cooldownSeconds: 50,
      singleUse: false
    },
    {
      id: 'treasure_chest_grove',
      nameKey: 'prop.treasureChest.name',
      descriptionKey: 'prop.treasureChest.description',
      type: 'treasure_chest',
      x: 750,
      y: 360,
      goldReward: 110,
      singleUse: true
    }
  ]
};
