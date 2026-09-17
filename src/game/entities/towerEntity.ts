import Phaser from 'phaser';
import { TowerDefinition, TowerLevelStats } from '../../core/types/towers';
import { TargetPriority } from '../../core/types/combat';
import { selectTarget } from '../../core/targeting/targeting';
import { SpatialGrid } from '../../core/spatial/spatialGrid';
import { EnemyEntity } from './enemyEntity';
import { SoldierEntity } from './soldierEntity';
import { ProjectileConfig, ProjectileType } from './projectileEntity';

export class TowerEntity extends Phaser.GameObjects.Container {
  public slotId: string;
  public definition: TowerDefinition;
  public currentLevel: number = 1;
  public priority: TargetPriority;
  public totalInvestedGold: number = 0;

  // Attack timing
  private attackCooldownTimer: number = 0;

  // Barracks soldier management
  public soldiers: SoldierEntity[] = [];
  private soldierRespawnTimers: number[] = [];
  public rallyX: number;
  public rallyY: number;

  // Visuals
  private baseSprite: Phaser.GameObjects.Sprite;
  private rangeCircle: Phaser.GameObjects.Arc;
  public isSelected: boolean = false;

  // Callbacks
  private onFireProjectileCb: (config: ProjectileConfig) => void;
  private onPlaySoundCb: (type: 'arrow' | 'magic' | 'cannon' | 'hammer') => void;

  constructor(
    scene: Phaser.Scene,
    slotId: string,
    x: number,
    y: number,
    definition: TowerDefinition,
    rallyPoint: { x: number; y: number },
    onFireProjectile: (config: ProjectileConfig) => void,
    onPlaySound: (type: 'arrow' | 'magic' | 'cannon' | 'hammer') => void
  ) {
    super(scene, x, y);

    this.slotId = slotId;
    this.definition = definition;
    this.currentLevel = 1;
    this.priority = definition.defaultPriority;
    this.totalInvestedGold = definition.buildCost;
    this.rallyX = rallyPoint.x;
    this.rallyY = rallyPoint.y;
    this.onFireProjectileCb = onFireProjectile;
    this.onPlaySoundCb = onPlaySound;

    // Drop shadow
    const shadow = scene.add.ellipse(0, 4, 76, 32, 0x000000, 0.4);
    this.add(shadow);

    // Tower Sprite
    const stats = this.stats;
    this.baseSprite = scene.add.sprite(0, -32, stats.assetKey);
    this.baseSprite.setDisplaySize(96, 110);
    this.add(this.baseSprite);

    // Range Circle (invisible until selected)
    this.rangeCircle = scene.add.circle(0, 0, stats.range, 0x38bdf8, 0.12);
    this.rangeCircle.setStrokeStyle(2, 0x38bdf8, 0.7);
    this.rangeCircle.setVisible(false);
    this.add(this.rangeCircle);

    // Barracks initial soldiers
    if (this.definition.class === 'barracks') {
      this.initSoldiers();
    }

    // Depth sorting based on Y position (isometric layering)
    this.setDepth(y);

    // Idle animation for specific tower types
    if (this.definition.class === 'mage') {
      scene.tweens.add({
        targets: this.baseSprite,
        y: -36,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    } else if (this.definition.class === 'archer') {
      scene.tweens.add({
        targets: this.baseSprite,
        rotation: 0.015,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // Interactive selection on baseSprite
    this.baseSprite.setInteractive({ useHandCursor: true });
    this.baseSprite.on('pointerover', () => {
      this.baseSprite.setTint(0xfef08a);
    });
    this.baseSprite.on('pointerout', () => {
      this.baseSprite.clearTint();
    });
    this.baseSprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      pointer.event.stopPropagation();
      this.emit('tower_clicked', this);
    });

    // Also support container-level clicking
    this.setSize(84, 110);
    this.setInteractive(new Phaser.Geom.Rectangle(-42, -90, 84, 110), Phaser.Geom.Rectangle.Contains);
    this.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      pointer.event.stopPropagation();
      this.emit('tower_clicked', this);
    });

    scene.add.existing(this);
  }

  get stats(): TowerLevelStats {
    return this.definition.levels[this.currentLevel - 1];
  }

  get maxLevel(): number {
    return this.definition.levels.length;
  }

  get nextLevelStats(): TowerLevelStats | null {
    if (this.currentLevel < this.maxLevel) {
      return this.definition.levels[this.currentLevel];
    }
    return null;
  }

  public setSelected(selected: boolean): void {
    this.isSelected = selected;
    this.rangeCircle.setVisible(selected);
  }

  private upgradeTween: Phaser.Tweens.Tween | null = null;

  public upgrade(): boolean {
    const next = this.nextLevelStats;
    if (!next) return false;

    this.currentLevel++;
    this.totalInvestedGold += next.upgradeCost;

    // Update visuals
    this.baseSprite.setTexture(this.stats.assetKey);
    this.baseSprite.setDisplaySize(96, 110);
    this.rangeCircle.setRadius(this.stats.range);

    const baseScaleX = 96 / this.baseSprite.width;
    const baseScaleY = 110 / this.baseSprite.height;

    // Stop any in-flight upgrade bounce tween to prevent compounding
    if (this.upgradeTween) {
      this.upgradeTween.stop();
      this.upgradeTween = null;
    }
    this.baseSprite.setScale(baseScaleX, baseScaleY);

    // Subtle, safe bounce animation relative to base dimensions
    this.upgradeTween = this.scene.tweens.add({
      targets: this.baseSprite,
      scaleX: baseScaleX * 1.12,
      scaleY: baseScaleY * 1.12,
      yoyo: true,
      duration: 120,
      ease: 'Quad.easeOut',
      onComplete: () => {
        if (this.baseSprite && this.baseSprite.active) {
          this.baseSprite.setScale(baseScaleX, baseScaleY);
        }
        this.upgradeTween = null;
      }
    });

    // If barracks, refresh soldiers stats/count
    if (this.definition.class === 'barracks') {
      this.initSoldiers();
    }

    return true;
  }

  private initSoldiers(): void {
    const stats = this.stats;
    const count = stats.spawnSoldierCount ?? 2;

    // Clear old soldiers
    this.soldiers.forEach((s) => s.destroy());
    this.soldiers = [];
    this.soldierRespawnTimers = [];

    for (let i = 0; i < count; i++) {
      const offsetX = (i - (count - 1) / 2) * 22;
      const offsetY = ((i % 2) - 0.5) * 12;

      const soldier = new SoldierEntity(
        this.scene,
        `soldier_${this.slotId}_${i}`,
        this.x,
        this.y,
        this.rallyX + offsetX,
        this.rallyY + offsetY,
        stats.soldierHp ?? 120,
        stats.soldierDamage ?? 10,
        (deadSoldier) => this.onSoldierDied(deadSoldier)
      );
      this.soldiers.push(soldier);
    }
  }

  private onSoldierDied(soldier: SoldierEntity): void {
    const idx = this.soldiers.indexOf(soldier);
    if (idx !== -1) {
      this.soldiers.splice(idx, 1);
      // Start respawn timer
      this.soldierRespawnTimers.push(this.stats.soldierRespawnTime ?? 10);
    }
  }

  public setRallyPoint(x: number, y: number): void {
    this.rallyX = x;
    this.rallyY = y;
    const count = this.soldiers.length;
    this.soldiers.forEach((soldier, i) => {
      const offsetX = (i - (count - 1) / 2) * 22;
      const offsetY = ((i % 2) - 0.5) * 12;
      soldier.moveToRallyPoint(x + offsetX, y + offsetY);
    });
  }

  public updateLogic(deltaSeconds: number, spatialGrid: SpatialGrid<EnemyEntity>): void {
    const stats = this.stats;

    // Barracks respawn logic
    if (this.definition.class === 'barracks') {
      for (let i = this.soldierRespawnTimers.length - 1; i >= 0; i--) {
        this.soldierRespawnTimers[i] -= deltaSeconds;
        if (this.soldierRespawnTimers[i] <= 0) {
          this.soldierRespawnTimers.splice(i, 1);
          // Respawn one soldier
          const idx = this.soldiers.length;
          const count = stats.spawnSoldierCount ?? 2;
          const offsetX = (idx - (count - 1) / 2) * 22;
          const offsetY = ((idx % 2) - 0.5) * 12;

          const soldier = new SoldierEntity(
            this.scene,
            `soldier_${this.slotId}_${Date.now()}`,
            this.x,
            this.y,
            this.rallyX + offsetX,
            this.rallyY + offsetY,
            stats.soldierHp ?? 120,
            stats.soldierDamage ?? 10,
            (deadSoldier) => this.onSoldierDied(deadSoldier)
          );
          this.soldiers.push(soldier);
        }
      }
      return;
    }

    // Shooting Towers
    this.attackCooldownTimer -= deltaSeconds;
    if (this.attackCooldownTimer > 0) return;

    // Spatial query enemies in range
    const candidates = spatialGrid.queryRadius(this.x, this.y, stats.range);
    if (candidates.length === 0) return;

    const target = selectTarget(candidates, this.x, this.y, this.priority, this.definition.allowedTargetTypes);
    if (!target) return;

    // Attack target!
    this.attackCooldownTimer = 1.0 / stats.attacksPerSecond;
    this.fireAt(target);
  }

  private fireAt(target: EnemyEntity): void {
    const stats = this.stats;
    const bScene = this.scene as any;

    let projType: ProjectileType = 'arrow';
    let startYOffset = -40;

    if (this.definition.class === 'cannon') {
      projType = 'cannonball';
      startYOffset = -55;
      this.onPlaySoundCb('cannon');

      // Heavy cannon recoil kickback animation
      this.scene.tweens.add({
        targets: this.baseSprite,
        y: -24,
        duration: 60,
        yoyo: true,
        ease: 'Quad.easeOut'
      });

      // Muzzle smoke and fire flash
      if (bScene.vfxManager) {
        bScene.vfxManager.spawnCannonFire(this.x, this.y - 55, -0.6);
      }

      // Subtle screen shake
      this.scene.cameras.main.shake(80, 0.002);
    } else if (this.definition.class === 'mage') {
      projType = 'magic';
      startYOffset = -65;
      this.onPlaySoundCb('magic');

      // Arcane pulse animation
      this.scene.tweens.add({
        targets: this.baseSprite,
        scaleY: (110 / this.baseSprite.height) * 1.08,
        scaleX: (96 / this.baseSprite.width) * 0.95,
        yoyo: true,
        duration: 100,
        ease: 'Sine.easeOut'
      });

      // Magic sparks gather
      if (bScene.vfxManager) {
        bScene.vfxManager.spawnMagicSparks(this.x, this.y - 65);
      }
    } else {
      // Archer tower
      this.onPlaySoundCb('arrow');
      startYOffset = -50;

      // Archer bow release recoil
      this.scene.tweens.add({
        targets: this.baseSprite,
        y: -28,
        yoyo: true,
        duration: 80
      });
    }

    this.onFireProjectileCb({
      type: projType,
      startX: this.x,
      startY: this.y + startYOffset,
      target,
      damage: stats.damage,
      damageType: stats.damageType,
      speed: stats.projectileSpeed ?? 400,
      splashRadius: stats.splashRadius,
      onHit: () => {
        // Handled in BattleScene
      }
    });
  }
}
