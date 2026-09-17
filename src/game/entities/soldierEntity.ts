import Phaser from 'phaser';
import { EnemyEntity } from './enemyEntity';

export class SoldierEntity extends Phaser.GameObjects.Container {
  public id: string;
  public currentHp: number;
  public maxHp: number;
  public damage: number;
  public isDead: boolean = false;

  private engagedEnemy: EnemyEntity | null = null;
  private attackTimer: number = 0;

  private sprite: Phaser.GameObjects.Sprite;
  private hpBg: Phaser.GameObjects.Rectangle;
  private hpBar: Phaser.GameObjects.Rectangle;

  private onDeathCb: (soldier: SoldierEntity) => void;

  constructor(
    scene: Phaser.Scene,
    id: string,
    spawnX: number,
    spawnY: number,
    rallyX: number,
    rallyY: number,
    maxHp: number,
    damage: number,
    onDeath: (soldier: SoldierEntity) => void
  ) {
    super(scene, spawnX, spawnY);

    this.id = id;
    this.currentHp = maxHp;
    this.maxHp = maxHp;
    this.damage = damage;
    this.onDeathCb = onDeath;

    // Drop shadow under feet
    const shadow = scene.add.ellipse(0, 8, 26, 12, 0x000000, 0.35);
    this.add(shadow);

    this.sprite = scene.add.sprite(0, -6, 'soldier_kingdom');
    this.sprite.setDisplaySize(48, 48);
    this.add(this.sprite);

    // HP Bar
    const barWidth = 28;
    const barHeight = 4;
    const yOffset = -30;

    this.hpBg = scene.add.rectangle(0, yOffset, barWidth + 2, barHeight + 2, 0x0f172a);
    this.hpBar = scene.add.rectangle(-barWidth / 2, yOffset, barWidth, barHeight, 0x38bdf8); // blue for kingdom
    this.hpBar.setOrigin(0, 0.5);

    this.add(this.hpBg);
    this.add(this.hpBar);

    this.setDepth(spawnY);
    scene.add.existing(this);

    // Idle breathing tween
    const baseScale = 48 / this.sprite.height;
    scene.tweens.add({
      targets: this.sprite,
      scaleY: baseScale * 1.05,
      yoyo: true,
      duration: 900,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // March from tower to rally point with footstep dust
    let marchDustTimer = 0;
    scene.tweens.add({
      targets: this,
      x: rallyX,
      y: rallyY,
      duration: 1100,
      ease: 'Power1',
      onUpdate: () => {
        this.setDepth(this.y);
        marchDustTimer += 0.016;
        if (marchDustTimer > 0.25) {
          marchDustTimer = 0;
          const bScene = this.scene as any;
          if (bScene.vfxManager) {
            bScene.vfxManager.spawnFootstepDust(this.x, this.y);
          }
        }
      }
    });
  }

  public moveToRallyPoint(newX: number, newY: number): void {
    if (this.isDead) return;
    this.engagedEnemy = null;
    let marchDustTimer = 0;
    this.scene.tweens.add({
      targets: this,
      x: newX,
      y: newY,
      duration: 1000,
      ease: 'Power1',
      onUpdate: () => {
        this.setDepth(this.y);
        marchDustTimer += 0.016;
        if (marchDustTimer > 0.22) {
          marchDustTimer = 0;
          const bScene = this.scene as any;
          if (bScene.vfxManager) {
            bScene.vfxManager.spawnFootstepDust(this.x, this.y);
          }
        }
      }
    });
  }

  public takeDamage(amount: number): void {
    if (this.isDead) return;
    this.currentHp = Math.max(0, this.currentHp - amount);
    this.updateHpBar();

    // Damage flash & shield block recoil
    this.sprite.setTintFill(0xffffff);
    this.scene.time.delayedCall(50, () => {
      if (!this.isDead && this.sprite.active) {
        this.sprite.clearTint();
      }
    });

    const baseScale = 48 / this.sprite.height;
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: baseScale * 1.15,
      scaleY: baseScale * 0.85,
      yoyo: true,
      duration: 80
    });

    if (this.currentHp <= 0) {
      this.die();
    }
  }

  private updateHpBar(): void {
    const ratio = Math.max(0, Math.min(1, this.currentHp / this.maxHp));
    this.hpBar.width = 26 * ratio;
  }

  public updateLogic(deltaSeconds: number, enemies: EnemyEntity[]): void {
    if (this.isDead) return;

    // Check if current engaged enemy is still alive
    if (this.engagedEnemy) {
      if (this.engagedEnemy.isDead || !this.engagedEnemy.active) {
        this.engagedEnemy = null;
      } else {
        // Face the engaged enemy
        this.sprite.setFlipX(this.engagedEnemy.x < this.x);

        // Attack engaged enemy
        this.attackTimer += deltaSeconds;
        if (this.attackTimer >= 1.0) {
          this.attackTimer = 0;
          this.engagedEnemy.takeDamage({ amount: this.damage, type: 'physical' });

          // Sword swing visual lunge
          const dirX = this.engagedEnemy.x > this.x ? 1 : -1;
          this.scene.tweens.add({
            targets: this.sprite,
            x: dirX * 10,
            rotation: dirX * 0.15,
            yoyo: true,
            duration: 120,
            onYoyo: () => {
              const bScene = this.scene as any;
              if (bScene.vfxManager) {
                bScene.vfxManager.spawnSlashSparks(this.x + dirX * 12, this.y);
              }
            },
            onComplete: () => {
              this.sprite.setPosition(0, -6);
              this.sprite.setRotation(0);
            }
          });
        }
        return;
      }
    }

    // Look for incoming unengaged enemy near rally point (within 35px)
    for (const enemy of enemies) {
      if (!enemy.isDead && !enemy.engagedSoldier) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
        if (dist <= 35) {
          this.engagedEnemy = enemy;
          enemy.engagedSoldier = this;
          break;
        }
      }
    }
  }

  private die(): void {
    if (this.isDead) return;
    this.isDead = true;
    if (this.engagedEnemy) {
      this.engagedEnemy.engagedSoldier = null;
      this.engagedEnemy = null;
    }
    this.onDeathCb(this);

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleY: 0.2,
      duration: 300,
      onComplete: () => {
        this.destroy();
      }
    });
  }
}
