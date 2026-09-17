import { MapDefinition } from '../../core/types/map';

export const forestRoadMap: MapDefinition = {
  id: 'map.greenlands.forestRoad',
  regionId: 'region.greenlands',
  nameKey: 'map.greenlands.forestRoad.name',
  width: 1280,
  height: 720,
  spawnPoint: { x: 150, y: 135 },
  exitPoint: { x: 1180, y: 600 },
  path: [
    { x: 150, y: 135 }, // Rift Portal
    { x: 235, y: 195 },
    { x: 330, y: 250 },
    { x: 440, y: 265 },
    { x: 575, y: 310 },
    { x: 670, y: 360 }, // Stone Bridge center
    { x: 740, y: 405 },
    { x: 840, y: 420 },
    { x: 975, y: 410 },
    { x: 1090, y: 505 },
    { x: 1180, y: 600 }  // Bastion Gate
  ],
  towerSlots: [
    { id: 'slot_1', x: 341, y: 191 },
    { id: 'slot_2', x: 218, y: 292 },
    { id: 'slot_3', x: 190, y: 538 },
    { id: 'slot_4', x: 311, y: 440 },
    { id: 'slot_5', x: 580, y: 236 },
    { id: 'slot_6', x: 940, y: 239 },
    { id: 'slot_7', x: 883, y: 373 },
    { id: 'slot_8', x: 758, y: 498 },
    { id: 'slot_9', x: 915, y: 593 }
  ],
  interactiveObjects: [
    {
      id: 'mana_crystal_1',
      nameKey: 'prop.manaCrystal.name',
      descriptionKey: 'prop.manaCrystal.description',
      type: 'mana_crystal',
      x: 430,
      y: 510,
      goldReward: 50,
      cooldownSeconds: 60,
      singleUse: false
    },
    {
      id: 'treasure_chest_1',
      nameKey: 'prop.treasureChest.name',
      descriptionKey: 'prop.treasureChest.description',
      type: 'treasure_chest',
      x: 880,
      y: 180,
      goldReward: 80,
      singleUse: true
    }
  ],
  environmentProps: []
};

