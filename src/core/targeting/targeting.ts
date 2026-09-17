import { TargetPriority } from '../types/combat';

export interface ITargetCandidate {
  id: string;
  x: number;
  y: number;
  pathProgress: number; // 0..1 (1 = closest to exit)
  currentHp: number;
  maxHp: number;
  movementType: 'ground' | 'air';
  isDead: boolean;
}

/**
 * Selects the optimal target from a list of candidates in range based on priority mode.
 */
export function selectTarget<T extends ITargetCandidate>(
  candidates: T[],
  towerX: number,
  towerY: number,
  priority: TargetPriority,
  allowedMovementTypes: ('ground' | 'air')[] = ['ground', 'air']
): T | null {
  const valid = candidates.filter(
    (c) => !c.isDead && c.currentHp > 0 && allowedMovementTypes.includes(c.movementType)
  );

  if (valid.length === 0) return null;
  if (valid.length === 1) return valid[0];

  switch (priority) {
    case 'first':
      return valid.reduce((best, cur) => (cur.pathProgress > best.pathProgress ? cur : best));

    case 'last':
      return valid.reduce((best, cur) => (cur.pathProgress < best.pathProgress ? cur : best));

    case 'strongest':
      return valid.reduce((best, cur) => (cur.currentHp > best.currentHp ? cur : best));

    case 'weakest':
      return valid.reduce((best, cur) => (cur.currentHp < best.currentHp ? cur : best));

    case 'closest': {
      let closest = valid[0];
      let minDistSq = (closest.x - towerX) ** 2 + (closest.y - towerY) ** 2;

      for (let i = 1; i < valid.length; i++) {
        const cur = valid[i];
        const distSq = (cur.x - towerX) ** 2 + (cur.y - towerY) ** 2;
        if (distSq < minDistSq) {
          minDistSq = distSq;
          closest = cur;
        }
      }
      return closest;
    }

    default:
      return valid[0];
  }
}
