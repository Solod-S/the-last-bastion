import Phaser from 'phaser';
import { EnemyDefinition } from '../../core/types/enemies';
import { DamageInfo, DamageType, StatusEffect } from '../../core/types/combat';
import { calculateEffectiveDamage } from '../../core/combat/damage';
import { ITargetCandidate } from '../../core/targeting/targeting';
import { ISpatialEntity } from '../../core/spatial/spatialGrid';
import { SoldierEntity } from './soldierEntity';
import { gameEventBus, GameEvents } from '../events/gameEventBus';
import { audioManager } from '../../services/audio/audioManager';

export class EnemyEntity extends Phaser.GameObjects.Container implements ITargetCandidate, ISpatialEntity {
  public id: string;
  public definition: EnemyDefinition;
  public currentHp: number;
  public maxHp: number;
  public pathProgress: number = 0; // 0..1
  public movementType: 'ground' | 'air';
  public isDead: boolean = false;
  public radius: number = 18;

  // Melee combat blocking
  public engagedSoldier: SoldierEntity | null = null;
  public meleeAttackTimer: number = 0;
  public isBlocked: boolean = false;
  public currentBossPhase: number = 1;
  private regenTimer: number = 0;
  private enrageSpeedMultiplier: number = 1.0;

  // Status effects
  private statuses: StatusEffect[] = [];

  // Visuals
  private sprite: Phaser.GameObjects.Sprite;
  private hpBg: Phaser.GameObjects.Rectangle;
  private hpBar: Phaser.GameObjects.Rectangle;
  private auraCircle: Phaser.GameObjects.Arc | null = null;

  // Ability timers
  private abilityTimer: number = 0;

  // Callbacks
  private onKilledCb: (enemy: EnemyEntity) => void;
  private onLeakedCb: (enemy: EnemyEntity) => void;
  private onHealCb?: (x: number, y: number) => void;

  // Animation state
  private walkTimer: number = 0;
  private dustTimer: number = 0;
  private targetSize: number = 48;
  private isAttackingAnim: boolean = false;

  constructor(
    scene: Phaser.Scene,
    id: string,
    definition: EnemyDefinition,
    pathCurve: Phaser.Curves.Path,
    onKilled: (enemy: EnemyEntity) => void,
    onLeaked: (enemy: EnemyEntity) => void,
    onHeal?: (x: number, y: number) => void
  ) {
    const startPoint = pathCurve.getPoint(0);
    super(scene, startPoint.x, startPoint.y);

    this.id = id;
    this.definition = definition;
    this.currentHp = definition.maxHealth;
    this.maxHp = definition.maxHealth;
    this.movementType = definition.movementType;
    this.onKilledCb = onKilled;
    this.onLeakedCb = onLeaked;
    this.onHealCb = onHeal;

    // Drop shadow under feet
    const shadow = scene.add.ellipse(0, 10, 28, 12, 0x000000, 0.35);
    this.add(shadow);

    // Sprite
    this.sprite = scene.add.sprite(0, 0, definition.assetKey);
    this.targetSize = definition.class === 'boss' ? 84 : definition.class === 'large' ? 62 : definition.class === 'small' ? 40 : 48;
    this.sprite.setDisplaySize(this.targetSize, this.targetSize);
    this.add(this.sprite);

    // HP Bar Container
    const barW = definition.class === 'boss' ? 60 : 32;
    this.hpBg = scene.add.rectangle(0, -this.targetSize * 0.58, barW + 2, 6, 0x0f172a, 0.85);
    this.hpBar = scene.add.rectangle(-barW / 2, -this.targetSize * 0.58, barW, 4, 0x22c55e);
    this.hpBar.setOrigin(0, 0.5);

    this.add(this.hpBg);
    this.add(this.hpBar);

    // Shaman healer aura effect
    if (definition.abilities?.some((a) => a.type === 'heal_aura')) {
      this.auraCircle = scene.add.circle(0, 0, 130, 0x22c55e, 0.08);
      this.auraCircle.setStrokeStyle(1.5, 0x22c55e, 0.4);
      this.add(this.auraCircle);
    }

    // Depth sorting based on Y position (isometric layering)
    this.setDepth(startPoint.y);

    // Interactive inspection
    this.setSize(this.targetSize, this.targetSize);
    this.setInteractive(new Phaser.Geom.Rectangle(-this.targetSize / 2, -this.targetSize / 2, this.targetSize, this.targetSize), Phaser.Geom.Rectangle.Contains);

    scene.add.existing(this);

    if (definition.class === 'boss') {
      gameEventBus.emit(GameEvents.BOSS_SPAWNED, {
        id: this.id,
        name: this.definition.nameKey,
        maxHp: this.maxHp,
        currentHp: this.currentHp,
        phase: 1
      });
    }
  }

  public takeDamage(damage: DamageInfo | number, type?: DamageType): number {
    if (this.isDead) return 0;

    const damageInfo: DamageInfo = typeof damage === 'number'
      ? { amount: damage, type: type || 'physical' }
      : damage;

    const effective = calculateEffectiveDamage(damageInfo, this.definition.defense);
    this.currentHp = Math.max(0, this.currentHp - effective);
    this.updateHpBar();

    if (this.definition.class === 'boss') {
      const ratio = this.currentHp / this.maxHp;
      let phase = 1;
      if (ratio <= 0.20) phase = 4;
      else if (ratio <= 0.40) phase = 3;
      else if (ratio <= 0.70) phase = 2;

      gameEventBus.emit(GameEvents.BOSS_HEALTH_UPDATED, {
        currentHp: Math.round(this.currentHp),
        maxHp: this.maxHp,
        phase
      });

      if (ratio <= 0.70 && this.currentBossPhase < 2) {
        this.currentBossPhase = 2;
        this.triggerBossPhase2();
      } else if (ratio <= 0.40 && this.currentBossPhase < 3) {
        this.currentBossPhase = 3;
        this.triggerBossPhase3();
      } else if (ratio <= 0.20 && this.currentBossPhase < 4) {
        this.currentBossPhase = 4;
        this.triggerBossPhase4();
      }
    }

    // Damage flash & squash reaction
    this.sprite.setTintFill(0xffffff);
    this.scene.time.delayedCall(60, () => {
      if (!this.isDead && this.sprite.active) {
        this.sprite.clearTint();
        if (this.enrageSpeedMultiplier > 1.0) {
          this.sprite.setTint(0xff5555);
        }
      }
    });

    const baseScale = this.targetSize / this.sprite.height;
    this.scene.tweens.add({
      targets: this.sprite,
      scaleY: baseScale * 0.8,
      scaleX: baseScale * 1.15,
      yoyo: true,
      duration: 80
    });

    if (this.currentHp <= 0) {
      this.die();
    }

    return effective;
  }

  private triggerBossPhase2(): void {
    const bScene = this.scene as any;
    if (bScene.vfxManager) {
      bScene.vfxManager.spawnExplosion(this.x, this.y, 1.8);
    }
    audioManager.playCannon();
    this.scene.cameras.main.shake(300, 0.015);
  }

  private triggerBossPhase3(): void {
    this.enrageSpeedMultiplier = 1.35;
    this.sprite.setTint(0xff5555);
    audioManager.playWaveHorn();
  }

  private triggerBossPhase4(): void {
    this.enrageSpeedMultiplier = 1.55;
    this.sprite.setTint(0xff2222);
    audioManager.playWaveHorn();
  }

  public applyStun(duration: number): void {
    this.applyStatus({ type: 'stun', duration, potency: 1.0 });
  }

  public heal(amount: number): void {
    if (this.isDead) return;
    this.currentHp = Math.min(this.maxHp, this.currentHp + amount);
    this.updateHpBar();
  }

  public applyStatus(status: StatusEffect): void {
    if (this.isDead) return;
    const existing = this.statuses.find((s) => s.type === status.type);
    if (existing) {
      existing.duration = Math.max(existing.duration, status.duration);
    } else {
      this.statuses.push({ ...status });
    }
  }

  private updateHpBar(): void {
    const ratio = Math.max(0, Math.min(1, this.currentHp / this.maxHp));
    this.hpBar.width = 32 * ratio;

    if (ratio > 0.5) {
      this.hpBar.fillColor = 0x22c55e; // green
    } else if (ratio > 0.25) {
      this.hpBar.fillColor = 0xeab308; // yellow
    } else {
      this.hpBar.fillColor = 0xef4444; // red
    }
  }

  public updateLogic(deltaSeconds: number, pathCurve: Phaser.Curves.Path, allEnemies: EnemyEntity[]): void {
    if (this.isDead) return;

    // Process status effects (slow, stun)
    let speedMult = 1.0;
    let isStunned = false;

    for (let i = this.statuses.length - 1; i >= 0; i--) {
      const s = this.statuses[i];
      s.duration -= deltaSeconds;

      if (s.type === 'slow') {
        speedMult = Math.min(speedMult, 1 - s.potency);
      } else if (s.type === 'stun') {
        isStunned = true;
      }

      if (s.duration <= 0) {
        this.statuses.splice(i, 1);
      }
    }

    // Shaman healer ability
    const healAbility = this.definition.abilities?.find((a) => a.type === 'heal_aura');
    if (healAbility) {
      this.abilityTimer += deltaSeconds;
      if (this.abilityTimer >= (healAbility.interval ?? 3.0)) {
        this.abilityTimer = 0;
        const radius = healAbility.radius ?? 130;
        const healVal = healAbility.value ?? 30;

        allEnemies.forEach((other) => {
          if (!other.isDead && other !== this) {
            const dist = Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y);
            if (dist <= radius) {
              other.heal(healVal);
            }
          }
        });

        if (this.onHealCb) {
          this.onHealCb(this.x, this.y);
        }
      }
    }

    // If engaged in melee with soldier, fight instead of moving
    if (this.engagedSoldier) {
      if (this.engagedSoldier.isDead || !this.engagedSoldier.active) {
        this.engagedSoldier = null;
      } else {
        this.meleeAttackTimer += deltaSeconds;

        // Attack strike animation lunge
        if (this.meleeAttackTimer >= 0.65 && !this.isAttackingAnim) {
          this.isAttackingAnim = true;
          const dirX = Math.sign(this.engagedSoldier.x - this.x) || 1;
          this.scene.tweens.add({
            targets: this.sprite,
            x: dirX * 12,
            yoyo: true,
            duration: 120,
            onYoyo: () => {
              const bScene = this.scene as any;
              if (bScene.vfxManager) {
                bScene.vfxManager.spawnSlashSparks(this.x + dirX * 14, this.y);
              }
            },
            onComplete: () => {
              this.isAttackingAnim = false;
              this.sprite.setX(0);
            }
          });
        }

        if (this.meleeAttackTimer >= 1.0) {
          this.meleeAttackTimer = 0;
          this.engagedSoldier.takeDamage(12);
        }
        return; // blocked from moving forward!
      }
    }

    // Passive regeneration ability (e.g. trolls)
    const regenAbility = this.definition.abilities?.find((a) => a.type === 'regen');
    if (regenAbility) {
      this.regenTimer += deltaSeconds;
      if (this.regenTimer >= (regenAbility.interval ?? 2.0)) {
        this.regenTimer = 0;
        if (this.currentHp < this.maxHp) {
          this.heal(regenAbility.value ?? 20);
        }
      }
    }

    if (this.isBlocked || isStunned) return;

    // Advance along path
    const pathLength = pathCurve.getLength();
    const speed = this.definition.baseSpeed * speedMult * this.enrageSpeedMultiplier;
    const progressDelta = (speed * deltaSeconds) / pathLength;

    this.pathProgress = Math.min(1.0, this.pathProgress + progressDelta);

    const pos = pathCurve.getPoint(this.pathProgress);
    if (pos) {
      const prevX = this.x;
      this.x = pos.x;

      // Dynamic walking/running squash and stretch + body sway
      this.walkTimer += deltaSeconds;
      const freq = this.definition.id === 'enemy.goblinRunner' ? 16 : this.definition.id === 'enemy.orcBrute' ? 8 : 11;
      const bounce = Math.sin(this.walkTimer * freq);
      const tilt = Math.cos(this.walkTimer * freq) * 0.08;

      this.y = pos.y + bounce * 2.5;
      this.setDepth(this.y);

      const baseScale = this.targetSize / this.sprite.height;
      this.sprite.scaleY = baseScale * (1 + bounce * 0.08);
      this.sprite.scaleX = baseScale * (1 - bounce * 0.05);
      this.sprite.rotation = tilt;

      // Footstep dust
      this.dustTimer += deltaSeconds;
      if (this.dustTimer > 0.22) {
        this.dustTimer = 0;
        const bScene = this.scene as any;
        if (bScene.vfxManager) {
          bScene.vfxManager.spawnFootstepDust(this.x, this.y + 12);
        }
      }

      // Sprite facing direction
      if (this.x < prevX) {
        this.sprite.setFlipX(true);
      } else if (this.x > prevX) {
        this.sprite.setFlipX(false);
      }
    }

    // Check if reached bastion gate
    if (this.pathProgress >= 0.99) {
      this.leak();
    }
  }

  private leak(): void {
    if (this.isDead) return;
    this.isDead = true;
    this.onLeakedCb(this);
    this.destroy();
  }

  private die(): void {
    if (this.isDead) return;
    this.isDead = true;
    this.onKilledCb(this);

    if (this.definition.class === 'boss') {
      gameEventBus.emit(GameEvents.BOSS_DEFEATED, null);
    }

    if (this.definition.tags.includes('explosive') || this.definition.tags.includes('sapper')) {
      const bScene = this.scene as any;
      if (bScene.vfxManager) {
        bScene.vfxManager.spawnExplosion(this.x, this.y, 1.4);
      }
      audioManager.playCannon();
    }

    // Death pop & upward launch tween
    this.scene.tweens.add({
      targets: this,
      y: this.y - 28,
      scaleX: 0.1,
      scaleY: 0.1,
      rotation: (Math.random() - 0.5) * 1.5,
      alpha: 0,
      duration: 350,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.destroy();
      }
    });
  }
}
