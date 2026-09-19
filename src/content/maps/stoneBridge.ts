import { MapDefinition } from '../../core/types/map';

export const stoneBridgeMap: MapDefinition = {
  id: 'map.greenlands.stoneBridge',
  regionId: 'region.greenlands',
  nameKey: 'map.greenlands.stoneBridge.name',
  width: 1280,
  height: 720,
  spawnPoint: { x: 110, y: 70 },
  exitPoint: { x: 1280, y: 690 },
  path: [
    { x: 110, y: 70 },
    { x: 180, y: 130 },
    { x: 280, y: 160 },
    { x: 410, y: 175 },
    { x: 520, y: 240 },
    { x: 640, y: 320 }, // Bridge
    { x: 740, y: 375 },
    { x: 840, y: 440 },
    { x: 890, y: 490 },
    { x: 940, y: 570 },
    { x: 1040, y: 620 },
    { x: 1160, y: 660 },
    { x: 1280, y: 690 }
  ],
  towerSlots: [
    { id: 'slot_1', x: 240, y: 250 },
    { id: 'slot_2', x: 380, y: 270 },
    { id: 'slot_3', x: 430, y: 110 },
    { id: 'slot_4', x: 530, y: 160 },
    { id: 'slot_5', x: 970, y: 390 },
    { id: 'slot_6', x: 1070, y: 450 },
    { id: 'slot_7', x: 860, y: 570 },
    { id: 'slot_8', x: 1070, y: 580 },
    { id: 'slot_9', x: 880, y: 680 }
  ],
  interactiveObjects: [
    {
      id: 'treasure_chest_bridge',
      nameKey: 'prop.treasureChest.name',
      descriptionKey: 'prop.treasureChest.description',
      type: 'treasure_chest',
      x: 320,
      y: 90,
      goldReward: 100,
      singleUse: true
    },
    {
      id: 'mana_crystal_bridge',
      nameKey: 'prop.manaCrystal.name',
      descriptionKey: 'prop.manaCrystal.description',
      type: 'mana_crystal',
      x: 770,
      y: 560,
      goldReward: 60,
      cooldownSeconds: 60,
      singleUse: false
    }
  ]
};
