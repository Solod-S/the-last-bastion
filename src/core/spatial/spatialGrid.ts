export interface ISpatialEntity {
  id: string;
  x: number;
  y: number;
  radius?: number;
}

export class SpatialGrid<T extends ISpatialEntity> {
  private cellSize: number;
  private grid = new Map<string, Set<T>>();

  constructor(cellSize: number = 100) {
    this.cellSize = cellSize;
  }

  private getKey(cx: number, cy: number): string {
    return `${cx}:${cy}`;
  }

  clear(): void {
    this.grid.clear();
  }

  insert(entity: T): void {
    const cx = Math.floor(entity.x / this.cellSize);
    const cy = Math.floor(entity.y / this.cellSize);
    const key = this.getKey(cx, cy);

    let cell = this.grid.get(key);
    if (!cell) {
      cell = new Set();
      this.grid.set(key, cell);
    }
    cell.add(entity);
  }

  /**
   * Returns all entities within range of (x, y).
   */
  queryRadius(x: number, y: number, radius: number): T[] {
    const minCx = Math.floor((x - radius) / this.cellSize);
    const maxCx = Math.floor((x + radius) / this.cellSize);
    const minCy = Math.floor((y - radius) / this.cellSize);
    const maxCy = Math.floor((y + radius) / this.cellSize);

    const radiusSq = radius * radius;
    const results: T[] = [];
    const seen = new Set<string>();

    for (let cx = minCx; cx <= maxCx; cx++) {
      for (let cy = minCy; cy <= maxCy; cy++) {
        const key = this.getKey(cx, cy);
        const cell = this.grid.get(key);
        if (!cell) continue;

        for (const entity of cell) {
          if (seen.has(entity.id)) continue;
          seen.add(entity.id);

          const dx = entity.x - x;
          const dy = entity.y - y;
          if (dx * dx + dy * dy <= radiusSq) {
            results.push(entity);
          }
        }
      }
    }

    return results;
  }
}
