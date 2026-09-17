import Phaser from 'phaser';
import { HeroDefinition, HeroRuntimeState } from '../../core/types/hero';
import { EnemyEntity } from './enemyEntity';
import { gameEventBus, GameEvents } from '../events/gameEventBus';
import { audioManager } from '../../services/audio/audioManager';

export class HeroEntity extends Phaser.GameObjects.Container {
  public definition: HeroDefinition;
  public currentHp: number;
  public maxHp: number;
  public isDead: boolean = false;
  public respawnTimer: number = 0;
  public abilityCooldownTimer: number = 0;

  // Movement & targeting
  private targetX: number | null = null;
  private targetY: number | null = null;
  private currentEnemy: EnemyEntity | null = null;
  private attackTimer: number = 0;
  private outOfCombatTimer: number = 0;

  // Visuals
  private baseSprite: Phaser.GameObjects.Sprite;
  private hpBg: Phaser.GameObjects.Graphics;
  private selectionRing: Phaser.GameObjects.Arc;
  public isSelected: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, definition: HeroDefinition) {
    super(scene, x, y);

    this.definition = definition;
    this.maxHp = definition.maxHealth;
    this.currentHp = definition.maxHealth;

    // Drop shadow
    const shadow = scene.add.ellipse(0, 4, 40, 18, 0x000000, 0.4);
    this.add(shadow);

    // Selection ring
    this.selectionRing = scene.add.circle(0, 0, 24, 0x38bdf8, 0.15);
    this.selectionRing.setStrokeStyle(2, 0x38bdf8, 0.8);
    this.selectionRing.setVisible(false);
    this.add(this.selectionRing);

    // Hero Sprite
    this.baseSprite = scene.add.sprite(0, -22, definition.assetKey);
    const origW = this.baseSprite.width || 1;
    const origH = this.baseSprite.height || 1;
    const aspect = origW / origH;
    this.baseSprite.setDisplaySize(72 * Math.min(1.3, aspect), 72);
    this.add(this.baseSprite);

    // HP Bar
    this.hpBg = scene.add.graphics();
    this.hpBg.setPosition(-20, -50);
    this.add(this.hpBg);
    this.updateHpBar();

    this.setDepth(y + 20);
    this.setSize(48, 54);
    this.setInteractive({ useHandCursor: true });

    this.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      pointer.event.stopPropagation();
      this.toggleSelected();
    });

    scene.add.existing(this);
    this.emitState();
  }

  public toggleSelected(): void {
    this.isSelected = !this.isSelected;
    this.selectionRing.setVisible(this.isSelected);
    audioManager.playUi();
  }

  public setSelected(selected: boolean): void {
    this.isSelected = selected;
    this.selectionRing.setVisible(selected);
  }

  public orderMoveTo(x: number, y: number): void {
    if (this.isDead) return;
    this.targetX = x;
    this.targetY = y;
    if (this.currentEnemy) {
      this.currentEnemy.isBlocked = false;
      this.currentEnemy = null;
    }
  }

  public updateLogic(deltaSeconds: number, enemies: EnemyEntity[]): void {
    // Cooldown tick
    if (this.abilityCooldownTimer > 0) {
      this.abilityCooldownTimer = Math.max(0, this.abilityCooldownTimer - deltaSeconds);
      this.emitState();
    }

    // Dead state / Respawn tick
    if (this.isDead) {
      this.respawnTimer -= deltaSeconds;
      if (this.respawnTimer <= 0) {
        this.respawn();
      }
      this.emitState();
      return;
    }

    // Out of combat passive healing
    if (!this.currentEnemy) {
      this.outOfCombatTimer += deltaSeconds;
      if (this.outOfCombatTimer >= 1.0 && this.currentHp < this.maxHp) {
        this.currentHp = Math.min(this.maxHp, this.currentHp + 12 * deltaSeconds);
        this.updateHpBar();
        this.emitState();
      }
    } else {
      this.outOfCombatTimer = 0;
    }

    // Movement to target point
    if (this.targetX !== null && this.targetY !== null) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 4) {
        this.x = this.targetX;
        this.y = this.targetY;
        this.targetX = null;
        this.targetY = null;
      } else {
        const step = this.definition.baseSpeed * deltaSeconds;
        this.x += (dx / dist) * Math.min(step, dist);
        this.y += (dy / dist) * Math.min(step, dist);
        this.setDepth(this.y + 20);

        // Turn sprite towards movement direction
        if (dx < 0) this.baseSprite.setFlipX(true);
        else if (dx > 0) this.baseSprite.setFlipX(false);
      }
    }

    // Combat logic
    if (this.currentEnemy) {
      if (this.currentEnemy.isDead || !this.currentEnemy.active) {
        this.currentEnemy.isBlocked = false;
        this.currentEnemy = null;
      } else {
        // Attack enemy
        this.attackTimer += deltaSeconds;
        if (this.attackTimer >= this.definition.attackInterval) {
          this.attackTimer = 0;
          this.strikeEnemy(this.currentEnemy);
        }
      }
    } else if (this.targetX === null) {
      // Find nearest alive enemy within melee range (45 px)
      for (const enemy of enemies) {
        if (!enemy.isDead && enemy.active && !enemy.isBlocked) {
          const d = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (d <= 45) {
            this.currentEnemy = enemy;
            enemy.isBlocked = true;
            this.attackTimer = this.definition.attackInterval * 0.5;
            break;
          }
        }
      }
    }
  }

  private strikeEnemy(enemy: EnemyEntity): void {
    // Attack animation
    this.scene.tweens.add({
      targets: this.baseSprite,
      x: (enemy.x - this.x) * 0.25,
      duration: 100,
      yoyo: true,
      ease: 'Power2'
    });

    audioManager.playSword();
    enemy.takeDamage(this.definition.damage, 'physical');

    // Enemy strikes back
    const enemyDmg = Math.max(5, 18 - this.definition.armor * 0.4);
    this.takeDamage(enemyDmg);
  }

  public takeDamage(amount: number): void {
    if (this.isDead) return;
    this.currentHp = Math.max(0, this.currentHp - amount);
    this.updateHpBar();
    this.emitState();

    // Red flash
    this.baseSprite.setTint(0xff6666);
    this.scene.time.delayedCall(120, () => {
      if (this.baseSprite?.active) this.baseSprite.clearTint();
    });

    if (this.currentHp <= 0) {
      this.die();
    }
  }

  public useAbility(enemies: EnemyEntity[]): boolean {
    if (this.isDead || this.abilityCooldownTimer > 0) return false;

    const ability = this.definition.ability;
    this.abilityCooldownTimer = ability.cooldown;

    // Golden shockwave animation
    const wave = this.scene.add.circle(this.x, this.y, 10, 0xfacc15, 0.5);
    wave.setDepth(this.depth + 10);
    this.scene.tweens.add({
      targets: wave,
      radius: ability.radius,
      alpha: 0,
      duration: 450,
      ease: 'Cubic.easeOut',
      onComplete: () => wave.destroy()
    });

    audioManager.playMagic();

    // Damage & stun enemies in radius
    for (const enemy of enemies) {
      if (!enemy.isDead && enemy.active) {
        const d = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        if (d <= ability.radius) {
          enemy.takeDamage(ability.damage, 'physical');
          enemy.applyStun(ability.stunDuration);
        }
      }
    }

    this.emitState();
    return true;
  }

  private die(): void {
    this.isDead = true;
    this.respawnTimer = this.definition.respawnTime;
    if (this.currentEnemy) {
      this.currentEnemy.isBlocked = false;
      this.currentEnemy = null;
    }
    this.setVisible(false);
    this.emitState();
  }

  private respawn(): void {
    this.isDead = false;
    this.currentHp = this.maxHp;
    this.setVisible(true);
    this.updateHpBar();
    this.emitState();
    audioManager.playBuild();
  }

  private updateHpBar(): void {
    this.hpBg.clear();
    const w = 40;
    const h = 5;

    // Background
    this.hpBg.fillStyle(0x0f172a, 0.8);
    this.hpBg.fillRect(0, 0, w, h);

    // Health fill (blue-cyan for hero)
    const ratio = Math.max(0, this.currentHp / this.maxHp);
    this.hpBg.fillStyle(0x38bdf8, 1);
    this.hpBg.fillRect(0, 0, w * ratio, h);

    // Border
    this.hpBg.lineStyle(1, 0x0284c7, 0.9);
    this.hpBg.strokeRect(0, 0, w, h);
  }

  public emitState(): void {
    const state: HeroRuntimeState = {
      id: this.definition.id,
      currentHp: Math.round(this.currentHp),
      maxHp: this.maxHp,
      isDead: this.isDead,
      respawnTimeRemaining: Math.ceil(this.respawnTimer),
      abilityCooldownRemaining: Math.ceil(this.abilityCooldownTimer),
      abilityMaxCooldown: this.definition.ability.cooldown,
      x: this.x,
      y: this.y
    };
    gameEventBus.emit(GameEvents.HERO_STATE_CHANGED, state);
  }
}
