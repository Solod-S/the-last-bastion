import { MapDefinition } from '../../core/types/map';

export const stoneBridgeMap: MapDefinition = {
  id: 'map.greenlands.stoneBridge',
  regionId: 'region.greenlands',
  nameKey: 'map.greenlands.stoneBridge.name',
  width: 1280,
  height: 720,
  spawnPoint: { x: 160, y: 120 },
  exitPoint: { x: 1140, y: 620 },
  path: [
    { x: 160, y: 120 },
    { x: 300, y: 200 },
    { x: 450, y: 310 },
    { x: 570, y: 360 },
    { x: 710, y: 360 }, // Long stone bridge over river
    { x: 840, y: 410 },
    { x: 990, y: 520 },
    { x: 1140, y: 620 }
  ],
  towerSlots: [
    { id: 'slot_1', x: 260, y: 100 },
    { id: 'slot_2', x: 390, y: 210 },
    { id: 'slot_3', x: 500, y: 230 },
    { id: 'slot_4', x: 500, y: 460 },
    { id: 'slot_5', x: 640, y: 230 },
    { id: 'slot_6', x: 640, y: 480 },
    { id: 'slot_7', x: 780, y: 260 },
    { id: 'slot_8', x: 780, y: 480 },
    { id: 'slot_9', x: 930, y: 390 },
    { id: 'slot_10', x: 1060, y: 490 }
  ],
  interactiveObjects: [
    {
      id: 'treasure_chest_bridge',
      nameKey: 'prop.treasureChest.name',
      descriptionKey: 'prop.treasureChest.description',
      type: 'treasure_chest',
      x: 640,
      y: 150,
      goldReward: 100,
      singleUse: true
    },
    {
      id: 'mana_crystal_bridge',
      nameKey: 'prop.manaCrystal.name',
      descriptionKey: 'prop.manaCrystal.description',
      type: 'mana_crystal',
      x: 350,
      y: 450,
      goldReward: 60,
      cooldownSeconds: 60,
      singleUse: false
    }
  ]
};
