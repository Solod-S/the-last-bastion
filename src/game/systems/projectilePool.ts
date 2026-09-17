import Phaser from 'phaser';
import { ProjectileEntity, ProjectileConfig } from '../entities/projectileEntity';

export class ProjectilePool {
  private pool: ProjectileEntity[] = [];
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, initialSize: number = 30) {
    this.scene = scene;
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(new ProjectileEntity(scene));
    }
  }

  public spawn(config: ProjectileConfig): ProjectileEntity {
    let proj = this.pool.find((p) => !p.isActive);
    if (!proj) {
      proj = new ProjectileEntity(this.scene);
      this.pool.push(proj);
    }

    proj.launch(config);
    return proj;
  }

  public update(deltaSeconds: number): void {
    for (const proj of this.pool) {
      if (proj.isActive) {
        proj.updateProjectile(deltaSeconds);
      }
    }
  }

  public clear(): void {
    this.pool.forEach((p) => {
      p.isActive = false;
      p.setActive(false).setVisible(false);
    });
  }
}
