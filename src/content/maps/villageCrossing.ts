import { MapDefinition } from '../../core/types/map';

export const villageCrossingMap: MapDefinition = {
  id: 'map.greenlands.villageCrossing',
  regionId: 'region.greenlands',
  nameKey: 'map.greenlands.villageCrossing.name',
  width: 1280,
  height: 720,
  spawnPoint: { x: 0, y: 335 },
  exitPoint: { x: 1280, y: 380 },
  path: [
    { x: 0, y: 335 },
    { x: 120, y: 335 },
    { x: 220, y: 240 },
    { x: 310, y: 175 },
    { x: 400, y: 240 },
    { x: 470, y: 360 },
    { x: 550, y: 360 },
    { x: 640, y: 365 }, // Bridge
    { x: 730, y: 345 },
    { x: 830, y: 255 },
    { x: 930, y: 185 },
    { x: 1030, y: 205 },
    { x: 1090, y: 310 },
    { x: 1080, y: 440 },
    { x: 1160, y: 485 },
    { x: 1280, y: 380 }
  ],
  towerSlots: [
    { id: 'slot_1', x: 115, y: 275 },
    { id: 'slot_2', x: 115, y: 410 },
    { id: 'slot_3', x: 290, y: 270 },
    { id: 'slot_4', x: 380, y: 140 },
    { id: 'slot_5', x: 260, y: 440 },
    { id: 'slot_6', x: 380, y: 510 },
    { id: 'slot_7', x: 495, y: 270 },
    { id: 'slot_8', x: 490, y: 450 },
    { id: 'slot_9', x: 780, y: 400 },
    { id: 'slot_10', x: 860, y: 310 },
    { id: 'slot_11', x: 1010, y: 130 },
    { id: 'slot_12', x: 1010, y: 310 },
    { id: 'slot_13', x: 1170, y: 380 }
  ],
  interactiveObjects: [
    {
      id: 'treasure_chest_village',
      nameKey: 'prop.treasureChest.name',
      descriptionKey: 'prop.treasureChest.description',
      type: 'treasure_chest',
      x: 510,
      y: 530,
      goldReward: 90,
      singleUse: true
    },
    {
      id: 'mana_crystal_village',
      nameKey: 'prop.manaCrystal.name',
      descriptionKey: 'prop.manaCrystal.description',
      type: 'mana_crystal',
      x: 800,
      y: 540,
      goldReward: 50,
      cooldownSeconds: 60,
      singleUse: false
    }
  ]
};
