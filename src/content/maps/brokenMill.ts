import { MapDefinition } from '../../core/types/map';

export const brokenMillMap: MapDefinition = {
  id: 'map.greenlands.brokenMill',
  regionId: 'region.greenlands',
  nameKey: 'map.greenlands.brokenMill.name',
  width: 1280,
  height: 720,
  spawnPoint: { x: 120, y: 160 },
  exitPoint: { x: 1200, y: 560 },
  path: [
    { x: 120, y: 160 },
    { x: 320, y: 160 },
    { x: 480, y: 240 },
    { x: 520, y: 440 },
    { x: 680, y: 520 },
    { x: 840, y: 440 },
    { x: 880, y: 240 },
    { x: 1040, y: 320 },
    { x: 1200, y: 560 }
  ],
  towerSlots: [
    { id: 'slot_1', x: 220, y: 270 },
    { id: 'slot_2', x: 380, y: 260 },
    { id: 'slot_3', x: 420, y: 440 },
    { id: 'slot_4', x: 600, y: 340 },
    { id: 'slot_5', x: 680, y: 390 },
    { id: 'slot_6', x: 680, y: 620 },
    { id: 'slot_7', x: 780, y: 240 },
    { id: 'slot_8', x: 960, y: 420 },
    { id: 'slot_9', x: 960, y: 180 },
    { id: 'slot_10', x: 1140, y: 440 }
  ],
  interactiveObjects: [
    {
      id: 'treasure_chest_mill',
      nameKey: 'prop.treasureChest.name',
      descriptionKey: 'prop.treasureChest.description',
      type: 'treasure_chest',
      x: 600,
      y: 200,
      goldReward: 120,
      singleUse: true
    },
    {
      id: 'mana_crystal_mill',
      nameKey: 'prop.manaCrystal.name',
      descriptionKey: 'prop.manaCrystal.description',
      type: 'mana_crystal',
      x: 740,
      y: 160,
      goldReward: 70,
      cooldownSeconds: 45,
      singleUse: false
    }
  ]
};
