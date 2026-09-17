import { MapDefinition } from '../../core/types/map';

export const villageCrossingMap: MapDefinition = {
  id: 'map.greenlands.villageCrossing',
  regionId: 'region.greenlands',
  nameKey: 'map.greenlands.villageCrossing.name',
  width: 1280,
  height: 720,
  spawnPoint: { x: 120, y: 360 },
  exitPoint: { x: 1200, y: 360 },
  path: [
    { x: 120, y: 360 },
    { x: 260, y: 360 },
    { x: 380, y: 240 },
    { x: 550, y: 210 },
    { x: 720, y: 260 },
    { x: 860, y: 360 },
    { x: 1020, y: 360 },
    { x: 1200, y: 360 }
  ],
  towerSlots: [
    { id: 'slot_1', x: 240, y: 230 },
    { id: 'slot_2', x: 380, y: 140 },
    { id: 'slot_3', x: 550, y: 120 },
    { id: 'slot_4', x: 720, y: 160 },
    { id: 'slot_5', x: 440, y: 330 },
    { id: 'slot_6', x: 660, y: 330 },
    { id: 'slot_7', x: 380, y: 470 },
    { id: 'slot_8', x: 550, y: 500 },
    { id: 'slot_9', x: 720, y: 460 },
    { id: 'slot_10', x: 940, y: 270 }
  ],
  interactiveObjects: [
    {
      id: 'treasure_chest_village',
      nameKey: 'prop.treasureChest.name',
      descriptionKey: 'prop.treasureChest.description',
      type: 'treasure_chest',
      x: 550,
      y: 350,
      goldReward: 90,
      singleUse: true
    },
    {
      id: 'mana_crystal_village',
      nameKey: 'prop.manaCrystal.name',
      descriptionKey: 'prop.manaCrystal.description',
      type: 'mana_crystal',
      x: 880,
      y: 190,
      goldReward: 50,
      cooldownSeconds: 60,
      singleUse: false
    }
  ]
};
