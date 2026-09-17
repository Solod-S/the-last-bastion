import { describe, it, expect } from 'vitest';
import { selectTarget, ITargetCandidate } from '../src/core/targeting/targeting';

describe('Targeting System', () => {
  const candidates: ITargetCandidate[] = [
    {
      id: 'goblin_1',
      x: 100,
      y: 100,
      pathProgress: 0.85, // closest to exit!
      currentHp: 20,
      maxHp: 75,
      movementType: 'ground',
      isDead: false
    },
    {
      id: 'orc_1',
      x: 50,
      y: 50,
      pathProgress: 0.4,
      currentHp: 280, // strongest!
      maxHp: 320,
      movementType: 'ground',
      isDead: false
    },
    {
      id: 'goblin_2',
      x: 30,
      y: 30,
      pathProgress: 0.15, // furthest back / last
      currentHp: 10, // weakest!
      maxHp: 75,
      movementType: 'ground',
      isDead: false
    },
    {
      id: 'dead_knight',
      x: 60,
      y: 60,
      pathProgress: 0.95,
      currentHp: 0,
      maxHp: 240,
      movementType: 'ground',
      isDead: true
    }
  ];

  it('selects "first" target (highest path progress)', () => {
    const target = selectTarget(candidates, 50, 50, 'first');
    expect(target?.id).toBe('goblin_1');
  });

  it('selects "last" target (lowest path progress)', () => {
    const target = selectTarget(candidates, 50, 50, 'last');
    expect(target?.id).toBe('goblin_2');
  });

  it('selects "strongest" target (highest current HP)', () => {
    const target = selectTarget(candidates, 50, 50, 'strongest');
    expect(target?.id).toBe('orc_1');
  });

  it('selects "weakest" target (lowest current HP)', () => {
    const target = selectTarget(candidates, 50, 50, 'weakest');
    expect(target?.id).toBe('goblin_2');
  });

  it('selects "closest" target to tower position', () => {
    const target = selectTarget(candidates, 52, 48, 'closest');
    expect(target?.id).toBe('orc_1'); // closest to (52, 48)
  });

  it('ignores dead targets', () => {
    const target = selectTarget(candidates, 60, 60, 'first');
    expect(target?.id).not.toBe('dead_knight');
  });
});
