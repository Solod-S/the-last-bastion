import { MapDefinition } from '../../core/types/map';

export const trollPassMap: MapDefinition = {
  id: 'map.greenlands.trollPass',
  regionId: 'region.greenlands',
  nameKey: 'map.greenlands.trollPass.name',
  width: 1280,
  height: 720,
  spawnPoint: { x: 120, y: 60 },
  exitPoint: { x: 1120, y: 680 },
  path: [
    { x: 120, y: 60 },
    { x: 230, y: 140 },
    { x: 330, y: 210 },
    { x: 280, y: 330 },
    { x: 220, y: 410 },
    { x: 280, y: 520 },
    { x: 400, y: 550 },
    { x: 510, y: 470 },
    { x: 640, y: 360 },
    { x: 750, y: 290 },
    { x: 880, y: 280 },
    { x: 970, y: 330 },
    { x: 1010, y: 440 },
    { x: 970, y: 560 },
    { x: 1040, y: 640 },
    { x: 1120, y: 680 } // Bastion Iron Gate
  ],
  towerSlots: [
    { id: 'slot_1', x: 230, y: 240 },
    { id: 'slot_2', x: 420, y: 180 },
    { id: 'slot_3', x: 280, y: 390 },
    { id: 'slot_4', x: 160, y: 495 },
    { id: 'slot_5', x: 395, y: 605 },
    { id: 'slot_6', x: 530, y: 550 },
    { id: 'slot_7', x: 765, y: 360 },
    { id: 'slot_8', x: 880, y: 370 },
    { id: 'slot_9', x: 995, y: 510 },
    { id: 'slot_10', x: 870, y: 640 }
  ],
  interactiveObjects: [
    {
      id: 'treasure_chest_pass',
      nameKey: 'prop.treasureChest.name',
      descriptionKey: 'prop.treasureChest.description',
      type: 'treasure_chest',
      x: 700,
      y: 190,
      goldReward: 150,
      singleUse: true
    },
    {
      id: 'mana_crystal_pass',
      nameKey: 'prop.manaCrystal.name',
      descriptionKey: 'prop.manaCrystal.description',
      type: 'mana_crystal',
      x: 400,
      y: 430,
      goldReward: 80,
      cooldownSeconds: 40,
      singleUse: false
    }
  ]
};
