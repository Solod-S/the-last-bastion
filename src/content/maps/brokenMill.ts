import { MapDefinition } from '../../core/types/map';

export const brokenMillMap: MapDefinition = {
  id: 'map.greenlands.brokenMill',
  regionId: 'region.greenlands',
  nameKey: 'map.greenlands.brokenMill.name',
  width: 1280,
  height: 720,
  spawnPoint: { x: 0, y: 30 },
  exitPoint: { x: 1280, y: 710 },
  path: [
    { x: 0, y: 30 },
    { x: 140, y: 90 },
    { x: 260, y: 180 },
    { x: 310, y: 280 },
    { x: 260, y: 380 },
    { x: 230, y: 470 },
    { x: 260, y: 570 },
    { x: 370, y: 630 },
    { x: 480, y: 550 },
    { x: 570, y: 430 }, // Mill bridge
    { x: 650, y: 320 },
    { x: 760, y: 260 },
    { x: 890, y: 260 },
    { x: 990, y: 330 },
    { x: 1000, y: 430 }, // Second bridge
    { x: 980, y: 530 },
    { x: 1040, y: 630 },
    { x: 1140, y: 680 },
    { x: 1280, y: 710 }
  ],
  towerSlots: [
    { id: 'slot_1', x: 260, y: 270 },
    { id: 'slot_2', x: 395, y: 210 },
    { id: 'slot_3', x: 390, y: 340 },
    { id: 'slot_4', x: 390, y: 480 },
    { id: 'slot_5', x: 415, y: 600 },
    { id: 'slot_6', x: 545, y: 570 },
    { id: 'slot_7', x: 630, y: 220 },
    { id: 'slot_8', x: 770, y: 310 },
    { id: 'slot_9', x: 930, y: 345 },
    { id: 'slot_10', x: 1005, y: 190 },
    { id: 'slot_11', x: 1120, y: 350 },
    { id: 'slot_12', x: 1075, y: 545 }
  ],
  interactiveObjects: [
    {
      id: 'treasure_chest_mill',
      nameKey: 'prop.treasureChest.name',
      descriptionKey: 'prop.treasureChest.description',
      type: 'treasure_chest',
      x: 800,
      y: 590,
      goldReward: 120,
      singleUse: true
    },
    {
      id: 'mana_crystal_mill',
      nameKey: 'prop.manaCrystal.name',
      descriptionKey: 'prop.manaCrystal.description',
      type: 'mana_crystal',
      x: 630,
      y: 130,
      goldReward: 70,
      cooldownSeconds: 45,
      singleUse: false
    }
  ]
};
