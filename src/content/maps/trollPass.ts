import { MapDefinition } from '../../core/types/map';

export const trollPassMap: MapDefinition = {
  id: 'map.greenlands.trollPass',
  regionId: 'region.greenlands',
  nameKey: 'map.greenlands.trollPass.name',
  width: 1280,
  height: 720,
  spawnPoint: { x: 120, y: 140 },
  exitPoint: { x: 1200, y: 520 },
  path: [
    { x: 120, y: 140 },
    { x: 300, y: 220 },
    { x: 440, y: 340 },
    { x: 580, y: 380 },
    { x: 740, y: 340 },
    { x: 860, y: 220 },
    { x: 1020, y: 320 },
    { x: 1100, y: 440 },
    { x: 1200, y: 520 }
  ],
  towerSlots: [
    { id: 'slot_1', x: 200, y: 260 },
    { id: 'slot_2', x: 320, y: 120 },
    { id: 'slot_3', x: 350, y: 360 },
    { id: 'slot_4', x: 480, y: 230 },
    { id: 'slot_5', x: 480, y: 470 },
    { id: 'slot_6', x: 640, y: 260 },
    { id: 'slot_7', x: 640, y: 490 },
    { id: 'slot_8', x: 790, y: 220 },
    { id: 'slot_9', x: 790, y: 450 },
    { id: 'slot_10', x: 940, y: 140 },
    { id: 'slot_11', x: 960, y: 420 },
    { id: 'slot_12', x: 1120, y: 320 }
  ],
  interactiveObjects: [
    {
      id: 'treasure_chest_pass',
      nameKey: 'prop.treasureChest.name',
      descriptionKey: 'prop.treasureChest.description',
      type: 'treasure_chest',
      x: 640,
      y: 160,
      goldReward: 150,
      singleUse: true
    },
    {
      id: 'mana_crystal_pass',
      nameKey: 'prop.manaCrystal.name',
      descriptionKey: 'prop.manaCrystal.description',
      type: 'mana_crystal',
      x: 640,
      y: 600,
      goldReward: 80,
      cooldownSeconds: 40,
      singleUse: false
    }
  ]
};
