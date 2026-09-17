import Phaser from 'phaser';
import { DamageType } from '../../core/types/combat';

export class VFXManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public spawnDamageNumber(x: number, y: number, amount: number, type: DamageType, isCrit: boolean = false): void {
    const color =
      type === 'magic' ? '#c084fc' : type === 'true' ? '#ffffff' : '#f87171'; // purple for magic, red for physical

    const text = this.scene.add.text(x + (Math.random() * 16 - 8), y - 10, `${Math.round(amount)}`, {
      fontFamily: 'Inter, sans-serif',
      fontSize: isCrit ? '16px' : '12px',
      fontStyle: 'bold',
      color,
      stroke: '#000000',
      strokeThickness: 3
    });
    text.setOrigin(0.5);

    this.scene.tweens.add({
      targets: text,
      y: y - 35,
      alpha: 0,
      duration: 600,
      ease: 'Power1',
      onComplete: () => {
        text.destroy();
      }
    });
  }

  public spawnFloatingText(x: number, y: number, message: string, color: string = '#f87171'): void {
    const text = this.scene.add.text(x, y - 10, message, {
      fontFamily: 'Inter, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color,
      stroke: '#000000',
      strokeThickness: 3
    });
    text.setOrigin(0.5);
    text.setDepth(2500);

    this.scene.tweens.add({
      targets: text,
      y: y - 40,
      alpha: 0,
      duration: 800,
      ease: 'Power1',
      onComplete: () => {
        text.destroy();
      }
    });
  }

  public spawnCoinReward(x: number, y: number, amount: number): void {
    const text = this.scene.add.text(x + (Math.random() * 12 - 6), y - 12, `+${amount}g`, {
      fontFamily: 'Cinzel, Inter, serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#fbbf24',
      stroke: '#000000',
      strokeThickness: 3
    });
    text.setOrigin(0.5);
    text.setDepth(y + 30);

    this.scene.tweens.add({
      targets: text,
      y: y - 40,
      scaleX: 1.15,
      scaleY: 1.15,
      alpha: 0,
      duration: 750,
      ease: 'Power1',
      onComplete: () => {
        text.destroy();
      }
    });

    // Sparkles
    for (let i = 0; i < 3; i++) {
      const spark = this.scene.add.sprite(x, y - 10, 'vfx_spark');
      spark.setTint(0xfacc15);
      spark.setDepth(y + 29);
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 20 + 6;

      this.scene.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * dist,
        y: y - 10 + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.4,
        duration: 350,
        onComplete: () => {
          spark.destroy();
        }
      });
    }
  }

  public spawnExplosion(x: number, y: number, radius: number = 65): void {
    const ring = this.scene.add.sprite(x, y, 'vfx_explosion_ring');
    ring.setScale(0.2);
    ring.setAlpha(1);

    const targetScale = (radius * 2) / 64;

    this.scene.tweens.add({
      targets: ring,
      scaleX: targetScale,
      scaleY: targetScale,
      alpha: 0,
      duration: 350,
      ease: 'Quad.easeOut',
      onComplete: () => {
        ring.destroy();
      }
    });

    // High quality explosion burst art from concept pack
    if (this.scene.textures.exists('vfx_explosion_aoe')) {
      const burst = this.scene.add.sprite(x, y, 'vfx_explosion_aoe');
      burst.setDisplaySize(radius * 1.8, radius * 1.8);
      burst.setDepth(y + 35);
      this.scene.tweens.add({
        targets: burst,
        scaleX: burst.scaleX * 1.2,
        scaleY: burst.scaleY * 1.2,
        alpha: 0,
        duration: 380,
        ease: 'Quad.easeOut',
        onComplete: () => burst.destroy()
      });
    }

    // Sparks
    for (let i = 0; i < 6; i++) {
      const spark = this.scene.add.sprite(x, y, 'vfx_spark');
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * radius * 0.8;

      this.scene.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.5,
        duration: 300,
        onComplete: () => {
          spark.destroy();
        }
      });
    }
  }

  public spawnMagicSparks(x: number, y: number): void {
    for (let i = 0; i < 5; i++) {
      const spark = this.scene.add.sprite(x, y, 'vfx_spark');
      spark.setTint(0x38bdf8);
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 25 + 5;

      this.scene.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.3,
        duration: 250,
        onComplete: () => {
          spark.destroy();
        }
      });
    }
  }

  public spawnHealEffect(x: number, y: number): void {
    for (let i = 0; i < 3; i++) {
      const cross = this.scene.add.sprite(x + (Math.random() * 24 - 12), y, 'vfx_heal_cross');
      this.scene.tweens.add({
        targets: cross,
        y: y - 28,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          cross.destroy();
        }
      });
    }
  }

  public spawnFootstepDust(x: number, y: number): void {
    const dust = this.scene.add.sprite(x + (Math.random() * 8 - 4), y + 6, 'vfx_dust');
    dust.setScale(0.4);
    dust.setAlpha(0.6);
    dust.setDepth(y - 1);

    this.scene.tweens.add({
      targets: dust,
      scaleX: 1.0,
      scaleY: 0.8,
      y: y + 2,
      alpha: 0,
      duration: 350,
      ease: 'Quad.easeOut',
      onComplete: () => {
        dust.destroy();
      }
    });
  }

  public spawnCannonFire(x: number, y: number, angleRad: number = -0.5): void {
    // Muzzle smoke clouds
    for (let i = 0; i < 3; i++) {
      const smoke = this.scene.add.sprite(
        x + Math.cos(angleRad) * (15 + i * 10),
        y + Math.sin(angleRad) * (15 + i * 10),
        'vfx_smoke'
      );
      smoke.setScale(0.5);
      smoke.setAlpha(0.85);
      smoke.setDepth(y + 20);

      this.scene.tweens.add({
        targets: smoke,
        scaleX: 1.4 + i * 0.3,
        scaleY: 1.4 + i * 0.3,
        x: smoke.x + Math.cos(angleRad + (Math.random() * 0.4 - 0.2)) * 30,
        y: smoke.y + Math.sin(angleRad + (Math.random() * 0.4 - 0.2)) * 30 - 10,
        alpha: 0,
        duration: 500 + i * 100,
        ease: 'Quad.easeOut',
        onComplete: () => {
          smoke.destroy();
        }
      });
    }

    // Fiery muzzle flash sparks
    for (let i = 0; i < 6; i++) {
      const spark = this.scene.add.sprite(x, y, 'vfx_spark');
      spark.setTint(0xfbbf24);
      spark.setDepth(y + 25);
      const spkAngle = angleRad + (Math.random() * 0.8 - 0.4);
      const spkDist = Math.random() * 40 + 15;

      this.scene.tweens.add({
        targets: spark,
        x: x + Math.cos(spkAngle) * spkDist,
        y: y + Math.sin(spkAngle) * spkDist,
        alpha: 0,
        scale: 0.8,
        duration: 300,
        onComplete: () => {
          spark.destroy();
        }
      });
    }
  }

  public spawnSlashSparks(x: number, y: number): void {
    for (let i = 0; i < 4; i++) {
      const spark = this.scene.add.sprite(x, y, 'vfx_spark');
      spark.setTint(0xfef08a);
      spark.setDepth(y + 10);
      const ang = Math.random() * Math.PI * 2;
      const dist = Math.random() * 20 + 8;

      this.scene.tweens.add({
        targets: spark,
        x: x + Math.cos(ang) * dist,
        y: y + Math.sin(ang) * dist,
        alpha: 0,
        scale: 0.6,
        duration: 220,
        onComplete: () => {
          spark.destroy();
        }
      });
    }
  }

  public spawnChimneySmoke(x: number, y: number): void {
    const puff = this.scene.add.sprite(x + (Math.random() * 4 - 2), y, 'vfx_smoke');
    puff.setScale(0.3);
    puff.setAlpha(0.65);
    puff.setDepth(y);

    this.scene.tweens.add({
      targets: puff,
      x: puff.x + 20 + Math.random() * 15,
      y: puff.y - 35 - Math.random() * 15,
      scaleX: 0.9,
      scaleY: 0.9,
      alpha: 0,
      duration: 1800,
      ease: 'Sine.easeOut',
      onComplete: () => {
        puff.destroy();
      }
    });
  }

  public spawnRiverSplash(x: number, y: number): void {
    const splash = this.scene.add.sprite(x + (Math.random() * 16 - 8), y + (Math.random() * 8 - 4), 'vfx_water_foam');
    splash.setScale(0.3);
    splash.setAlpha(0.7);
    splash.setDepth(1);

    this.scene.tweens.add({
      targets: splash,
      scaleX: 0.9,
      scaleY: 0.9,
      alpha: 0,
      y: splash.y + 10,
      duration: 800,
      ease: 'Quad.easeOut',
      onComplete: () => {
        splash.destroy();
      }
    });
  }

  public spawnShimmer(x: number, y: number): void {
    const star = this.scene.add.sprite(x + (Math.random() * 24 - 12), y + (Math.random() * 16 - 8), 'vfx_shimmer');
    star.setScale(0.2);
    star.setAlpha(0);
    star.setDepth(y + 5);

    this.scene.tweens.add({
      targets: star,
      scaleX: 0.9,
      scaleY: 0.9,
      alpha: 1,
      duration: 250,
      yoyo: true,
      onComplete: () => {
        star.destroy();
      }
    });
  }

  public spawnAcidPool(x: number, y: number): void {
    const key = this.scene.textures.exists('vfx_poison_cloud') ? 'vfx_poison_cloud' : 'vfx_acid_pool';
    if (!this.scene.textures.exists(key)) return;
    const pool = this.scene.add.sprite(x, y, key);
    pool.setDisplaySize(72, 48);
    pool.setDepth(y - 5);
    pool.setAlpha(0.9);

    this.scene.tweens.add({
      targets: pool,
      scaleX: pool.scaleX * 1.15,
      scaleY: pool.scaleY * 1.15,
      duration: 1000,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        this.scene.tweens.add({
          targets: pool,
          alpha: 0,
          duration: 350,
          onComplete: () => pool.destroy()
        });
      }
    });
  }
}

