import Phaser from 'phaser';
import { DamageType, DamageInfo } from '../../core/types/combat';
import { EnemyEntity } from './enemyEntity';

export type ProjectileType = 'arrow' | 'magic' | 'cannonball';

export interface ProjectileConfig {
  type: ProjectileType;
  startX: number;
  startY: number;
  target: EnemyEntity;
  targetX?: number;
  targetY?: number;
  damage: number;
  damageType: DamageType;
  speed: number;
  splashRadius?: number;
  onHit: (hitInfo: {
    x: number;
    y: number;
    damageInfo: DamageInfo;
    target: EnemyEntity | null;
    splashRadius?: number;
  }) => void;
}

export class ProjectileEntity extends Phaser.GameObjects.Container {
  private config!: ProjectileConfig;
  private sprite!: Phaser.GameObjects.Sprite;
  private totalDistance: number = 0;
  private destX: number = 0;
  private destY: number = 0;
  private startX: number = 0;
  private startY: number = 0;
  private flightTime: number = 0;
  private elapsedFlightTime: number = 0;
  public isActive: boolean = false;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.sprite = scene.add.sprite(0, 0, 'proj_arrow');
    this.add(this.sprite);
    scene.add.existing(this);
    this.setActive(false).setVisible(false);
  }

  public launch(config: ProjectileConfig): void {
    this.config = config;
    this.startX = config.startX;
    this.startY = config.startY;
    this.setPosition(this.startX, this.startY);

    // Texture selection
    if (config.type === 'arrow') {
      this.sprite.setTexture('proj_arrow');
      this.sprite.setDisplaySize(26, 12);
    } else if (config.type === 'magic') {
      const magicKey = this.scene.textures.exists('proj_magic_bolt') ? 'proj_magic_bolt' : 'proj_magic';
      this.sprite.setTexture(magicKey);
      this.sprite.setDisplaySize(26, 14);
    } else {
      this.sprite.setTexture('proj_cannonball');
      this.sprite.setDisplaySize(18, 18);
    }

    this.destX = config.targetX ?? config.target.x;
    this.destY = config.targetY ?? config.target.y;

    this.totalDistance = Phaser.Math.Distance.Between(this.startX, this.startY, this.destX, this.destY);
    this.flightTime = Math.max(0.1, this.totalDistance / config.speed);
    this.elapsedFlightTime = 0;

    this.isActive = true;
    this.setActive(true).setVisible(true);
  }

  public updateProjectile(deltaSeconds: number): void {
    if (!this.isActive) return;

    this.elapsedFlightTime += deltaSeconds;
    const t = Math.min(1.0, this.elapsedFlightTime / this.flightTime);

    // Homing update for magic bolt if target alive
    if (this.config.type === 'magic' && this.config.target && !this.config.target.isDead) {
      this.destX = this.config.target.x;
      this.destY = this.config.target.y;
    }

    // Position interpolation
    const currentX = Phaser.Math.Linear(this.startX, this.destX, t);
    let currentY = Phaser.Math.Linear(this.startY, this.destY, t);

    // Parabolic arc for cannonball
    if (this.config.type === 'cannonball') {
      const arcHeight = 60 * Math.sin(t * Math.PI);
      currentY -= arcHeight;
    }

    // Rotation towards flight direction
    const angle = Phaser.Math.Angle.Between(this.x, this.y, currentX, currentY);
    if (this.config.type === 'arrow') {
      this.setRotation(angle);
    } else if (this.config.type === 'magic') {
      this.rotation += 0.2; // spin magic orb
    }

    this.setPosition(currentX, currentY);

    if (t >= 1.0) {
      this.impact();
    }
  }

  private impact(): void {
    this.isActive = false;
    this.setActive(false).setVisible(false);

    this.config.onHit({
      x: this.destX,
      y: this.destY,
      damageInfo: {
        amount: this.config.damage,
        type: this.config.damageType
      },
      target: this.config.target.isDead ? null : this.config.target,
      splashRadius: this.config.splashRadius
    });
  }
}
