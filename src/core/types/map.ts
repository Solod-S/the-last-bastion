import { TowerClass } from './towers';

export interface Point2D {
  x: number;
  y: number;
}

export interface TowerSlotDefinition {
  id: string;
  x: number;
  y: number;
  allowedTypes?: TowerClass[];
}

export interface InteractiveObjectDefinition {
  id: string;
  nameKey: string;
  descriptionKey: string;
  type: 'mana_crystal' | 'treasure_chest' | 'shrine' | 'barricade';
  x: number;
  y: number;
  cooldownSeconds?: number;
  goldReward?: number;
  manaReward?: number;
  singleUse?: boolean;
}

export interface MapDefinition {
  id: string;
  regionId: string;
  nameKey: string;
  width: number;
  height: number;
  path: Point2D[];
  spawnPoint: Point2D;
  exitPoint: Point2D;
  towerSlots: TowerSlotDefinition[];
  interactiveObjects: InteractiveObjectDefinition[];
  environmentProps?: {
    type: string;
    x: number;
    y: number;
    rotation?: number;
    scale?: number;
  }[];
}
