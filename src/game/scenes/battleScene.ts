import Phaser from 'phaser';
import { ContentRegistry } from '../../content/registry';
import { MapDefinition, TowerSlotDefinition } from '../../core/types/map';
import { MissionDefinition } from '../../core/types/mission';
import { WaveSetDefinition } from '../../core/types/waves';
import { WaveManager } from '../../core/waves/waveManager';
import { GameTime } from '../../core/time/gameTime';
import { SpatialGrid } from '../../core/spatial/spatialGrid';
import { calculateSellRefund, calculateStars } from '../../core/economy/economy';
import { TowerEntity } from '../entities/towerEntity';
import { EnemyEntity } from '../entities/enemyEntity';
import { HeroEntity } from '../entities/heroEntity';
import { SoldierEntity } from '../entities/soldierEntity';
import { bastionCommander } from '../../content/heroes/commander';
import { useGameStore } from '../../ui/store/gameStore';
import { ProjectilePool } from '../systems/projectilePool';
import { VFXManager } from '../systems/vfxManager';
import { TextureGenerator } from '../visuals/textureGenerator';
import { audioManager } from '../../services/audio/audioManager';
import { SaveService } from '../../services/save/saveService';
import {
  gameEventBus,
  GameEvents,
  GameStateSnapshot,
  SelectedTowerInfo,
  SelectedSlotInfo
} from '../events/gameEventBus';

export class BattleScene extends Phaser.Scene {
  private mission!: MissionDefinition;
  private mapDef!: MapDefinition;
  private waveSet!: WaveSetDefinition;

  // Managers & Systems
  private waveManager!: WaveManager;
  private gameTime = new GameTime();
  private spatialGrid = new SpatialGrid<EnemyEntity>(80);
  private projectilePool!: ProjectilePool;
  private vfxManager!: VFXManager;

  // Hero & Temporary troops
  public hero: HeroEntity | null = null;
  private tempSoldiers: SoldierEntity[] = [];

  // Rally point state for barracks
  private isSettingRallyPoint: boolean = false;
  private rallyPointTower: TowerEntity | null = null;

  // Path
  private pathCurve!: Phaser.Curves.Path;

  // Entities & Slots
  private towers = new Map<string, TowerEntity>();
  private enemies: EnemyEntity[] = [];
  private slotMarkers = new Map<string, Phaser.GameObjects.Sprite>();

  // State
  private gold: number = 0;
  private lives: number = 0;
  private maxLives: number = 0;
  private isGameOver: boolean = false;
  private isGodMode: boolean = false;

  // Selection
  private selectedSlotId: string | null = null;
  private radialMenuContainer: Phaser.GameObjects.Container | null = null;

  // Stats
  private enemiesDefeatedCount: number = 0;
  private towersBuiltCount: number = 0;
  private goldEarnedTotal: number = 0;
  private sessionStartTime: number = 0;

  // Event bus unsubscribe functions
  private unsubs: (() => void)[] = [];

  constructor() {
    super({ key: 'BattleScene' });
  }

  init(data: { missionId?: string }): void {
    const missionId = data.missionId || 'mission.greenlands.01';
    this.mission = ContentRegistry.getMission(missionId);
    this.mapDef = ContentRegistry.getMap(this.mission.mapId);
    this.waveSet = ContentRegistry.getWaveSet(this.mission.waveSetId);

    this.gold = this.mission.startingGold;
    this.lives = this.mission.baseHealth;
    this.maxLives = this.mission.baseHealth;
    this.isGameOver = false;
    this.isGodMode = false;
    this.enemiesDefeatedCount = 0;
    this.towersBuiltCount = 0;
    this.goldEarnedTotal = this.gold;
    this.sessionStartTime = Date.now();

    this.waveManager = new WaveManager(this.waveSet, 6);
  }

  create(): void {
    this.towers.clear();
    this.enemies = [];
    this.slotMarkers.clear();

    this.projectilePool = new ProjectilePool(this, 40);
    this.vfxManager = new VFXManager(this);

    // Build environment
    this.createEnvironment();

    // Setup input & event bus listeners
    this.setupEventListeners();

    // Start battle music
    audioManager.startMusic();

    // Initial state push to UI
    this.publishState();
  }

  private createEnvironment(): void {
    const width = this.mapDef.width;
    const height = this.mapDef.height;

    // 1. Hand-Painted Isometric Background Map
    const bgKeyMap: Record<string, string> = {
      'map.greenlands.forestRoad': 'map_forest_road_bg',
      'map.greenlands.villageCrossing': 'map_village_crossing_bg',
      'map.greenlands.stoneBridge': 'map_stone_bridge_bg',
      'map.greenlands.crystalGrove': 'map_crystal_grove_bg',
      'map.greenlands.brokenMill': 'map_broken_mill_bg',
      'map.greenlands.trollPass': 'map_troll_pass_bg'
    };
    const bgKey = bgKeyMap[this.mapDef.id] || 'map_forest_road_bg';

    if (this.textures.exists(bgKey)) {
      const bg = this.add.image(width / 2, height / 2, bgKey);
      bg.setDisplaySize(width, height);
      bg.setDepth(0);
    } else {
      // Fallback: procedural grass tiles
      for (let x = 0; x < width; x += 64) {
        for (let y = 0; y < height; y += 64) {
          this.add.image(x + 32, y + 32, 'tile_grass');
        }
      }
    }

    // 2. Road Spline / Path for enemies
    this.pathCurve = new Phaser.Curves.Path(this.mapDef.path[0].x, this.mapDef.path[0].y);
    for (let i = 1; i < this.mapDef.path.length; i++) {
      this.pathCurve.lineTo(this.mapDef.path[i].x, this.mapDef.path[i].y);
    }

    // 3. Interactive Objects
    this.createInteractiveObjects();

    // 4. Tower Build Slots
    this.createTowerSlots();

    // 5. Living Animated Environment (Portal, Chimney Smoke, River Splashes, Torches)
    this.createLivingEnvironment();

    // 6. Spawn Bastion Commander Hero
    const heroSpawnPt = this.mapDef.path[Math.min(2, this.mapDef.path.length - 1)];
    this.hero = new HeroEntity(this, heroSpawnPt.x + 20, heroSpawnPt.y + 20, bastionCommander);

    // Click background to deselect, place rally point, move hero or cast spell
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
      // If currently placing rally point for barracks
      if (this.isSettingRallyPoint && this.rallyPointTower) {
        this.rallyPointTower.setRallyPoint(pointer.worldX, pointer.worldY);
        this.vfxManager.spawnMagicSparks(pointer.worldX, pointer.worldY);
        audioManager.playUi();
        this.isSettingRallyPoint = false;
        this.rallyPointTower = null;
        return;
      }

      // If casting active commander spell
      const activeSpell = useGameStore.getState().activeSpellToCast;
      if (activeSpell) {
        this.castCommanderSpell(activeSpell, pointer.worldX, pointer.worldY);
        useGameStore.setState({ activeSpellToCast: null });
        return;
      }

      // If moving hero (either hero is selected or isPlacingHero is true)
      if (this.hero && (this.hero.isSelected || useGameStore.getState().isPlacingHero)) {
        this.hero.orderMoveTo(pointer.worldX, pointer.worldY);
        this.vfxManager.spawnFootstepDust(pointer.worldX, pointer.worldY);
        audioManager.playUi();
        this.hero.setSelected(false);
        useGameStore.setState({ isPlacingHero: false });
        return;
      }

      // Check if clicked empty space (no interactive game objects under cursor)
      if (!currentlyOver || currentlyOver.length === 0) {
        // Prevent accidental deselect if clicked near selected slot or its radial buttons
        if (this.selectedSlotId) {
          const slot = this.mapDef.towerSlots.find((s) => s.id === this.selectedSlotId);
          if (slot) {
            const distSq = (pointer.worldX - slot.x) ** 2 + (pointer.worldY - slot.y) ** 2;
            if (distSq < 85 * 85) {
              return;
            }
          }
        }
        this.deselect();
      }
    });
  }

  private createLivingEnvironment(): void {
    // 1. Rift Portal Vortex animation at spawn point
    if (this.textures.exists('vfx_portal_vortex')) {
      const spawnPt = this.mapDef.spawnPoint;
      const vortex = this.add.sprite(spawnPt.x, spawnPt.y, 'vfx_portal_vortex');
      vortex.setDisplaySize(110, 110);
      vortex.setBlendMode(Phaser.BlendModes.ADD);
      vortex.setDepth(spawnPt.y - 5);
      vortex.setAlpha(0.85);

      this.tweens.add({
        targets: vortex,
        angle: 360,
        duration: 6000,
        repeat: -1,
        ease: 'Linear'
      });

      this.tweens.add({
        targets: vortex,
        scaleX: 1.12,
        scaleY: 1.12,
        alpha: 0.95,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Ambient portal spark emission
      this.time.addEvent({
        delay: 500,
        loop: true,
        callback: () => {
          if (!this.isGameOver) {
            this.vfxManager.spawnMagicSparks(
              spawnPt.x + (Math.random() * 20 - 10),
              spawnPt.y + (Math.random() * 20 - 10)
            );
          }
        }
      });
    }

    // 2. Cottage chimney smoke
    this.time.addEvent({
      delay: 850,
      loop: true,
      callback: () => {
        if (!this.isGameOver) {
          this.vfxManager.spawnChimneySmoke(1055, 115);
        }
      }
    });

    // 4. Mountain river foam & splashes under the stone bridge
    const riverNodes = [
      { x: 620, y: 460 },
      { x: 670, y: 400 },
      { x: 710, y: 330 },
      { x: 580, y: 520 }
    ];
    this.time.addEvent({
      delay: 450,
      loop: true,
      callback: () => {
        if (!this.isGameOver) {
          const node = riverNodes[Math.floor(Math.random() * riverNodes.length)];
          this.vfxManager.spawnRiverSplash(
            node.x + (Math.random() * 20 - 10),
            node.y + (Math.random() * 14 - 7)
          );
        }
      }
    });

    // 5. Shimmer on interactive props
    this.time.addEvent({
      delay: 2400,
      loop: true,
      callback: () => {
        if (!this.isGameOver) {
          // Chest sparkle
          this.vfxManager.spawnShimmer(880, 180);
          // Mana crystal sparkles
          this.vfxManager.spawnMagicSparks(430, 510);
        }
      }
    });
  }

  private createInteractiveObjects(): void {
    for (const objDef of this.mapDef.interactiveObjects) {
      const texKey = objDef.type === 'mana_crystal' ? 'prop_mana_crystal' : 'prop_treasure_chest';
      const size = objDef.type === 'mana_crystal' ? 56 : 50;

      // Drop shadow underneath prop
      const shadow = this.add.ellipse(objDef.x, objDef.y + (objDef.type === 'mana_crystal' ? 18 : 14), 44, 20, 0x000000, 0.4);
      shadow.setDepth(objDef.y - 1);

      const sprite = this.add.sprite(objDef.x, objDef.y, texKey);
      sprite.setDisplaySize(size, size);
      sprite.setDepth(objDef.y);
      sprite.setInteractive({ useHandCursor: true });

      // Pulsing tween for mana crystal
      if (objDef.type === 'mana_crystal') {
        this.tweens.add({
          targets: sprite,
          scaleX: (size / sprite.width) * 1.08,
          scaleY: (size / sprite.height) * 1.08,
          yoyo: true,
          duration: 1200,
          repeat: -1
        });
      }

      let isSpent = false;

      sprite.on('pointerdown', () => {
        if (isSpent) return;

        const reward = objDef.goldReward ?? 50;
        this.gold += reward;
        this.goldEarnedTotal += reward;
        audioManager.playCoin();
        this.vfxManager.spawnCoinReward(objDef.x, objDef.y, reward);
        this.vfxManager.spawnMagicSparks(objDef.x, objDef.y);

        gameEventBus.emit(GameEvents.PROP_ACTIVATED, {
          nameKey: objDef.nameKey,
          rewardGold: reward
        });

        if (objDef.singleUse) {
          isSpent = true;
          sprite.setAlpha(0.5);
          sprite.disableInteractive();
        } else {
          isSpent = true;
          sprite.setAlpha(0.4);
          this.time.delayedCall((objDef.cooldownSeconds ?? 45) * 1000, () => {
            isSpent = false;
            sprite.setAlpha(1.0);
          });
        }

        this.publishState();
      });
    }
  }

  private createTowerSlots(): void {
    for (const slot of this.mapDef.towerSlots) {
      const marker = this.add.sprite(slot.x, slot.y, 'tex_build_slot');
      marker.setDisplaySize(76, 54);
      marker.setDepth(5);
      marker.setAlpha(0.85);
      marker.setInteractive({ useHandCursor: true });

      marker.on('pointerover', () => {
        marker.setDisplaySize(82, 58);
        marker.setAlpha(1.0);
      });
      marker.on('pointerout', () => {
        marker.setDisplaySize(76, 54);
        marker.setAlpha(0.85);
      });
      marker.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        pointer.event.stopPropagation();
        this.onSlotClicked(slot);
      });

      this.slotMarkers.set(slot.id, marker);
    }
  }

  private onSlotClicked(slot: TowerSlotDefinition): void {
    if (this.radialMenuContainer) {
      this.radialMenuContainer.destroy(true);
      this.radialMenuContainer = null;
    }
    if (this.selectedSlotId && this.selectedSlotId !== slot.id) {
      const prevTower = this.towers.get(this.selectedSlotId);
      if (prevTower) prevTower.setSelected(false);
    }

    this.selectedSlotId = slot.id;

    const existingTower = this.towers.get(slot.id);
    if (existingTower) {
      existingTower.setSelected(true);
      const stats = existingTower.stats;
      const nextStats = existingTower.nextLevelStats;

      const towerInfo: SelectedTowerInfo = {
        slotId: slot.id,
        towerClass: existingTower.definition.class,
        level: existingTower.currentLevel,
        maxLevel: existingTower.maxLevel,
        damage: stats.damage,
        damageType: stats.damageType,
        attacksPerSecond: stats.attacksPerSecond,
        range: stats.range,
        priority: existingTower.priority,
        upgradeCost: nextStats ? nextStats.upgradeCost : null,
        sellRefund: calculateSellRefund(existingTower.totalInvestedGold),
        x: existingTower.x,
        y: existingTower.y
      };
      gameEventBus.emit(GameEvents.TOWER_SELECTED, towerInfo);
      this.showRadialTowerMenu(slot, existingTower);
    } else {
      const slotInfo: SelectedSlotInfo = {
        slotId: slot.id,
        x: slot.x,
        y: slot.y,
        allowedTypes: slot.allowedTypes || this.mission.allowedTowerClasses
      };
      gameEventBus.emit(GameEvents.SLOT_SELECTED, slotInfo);
      this.showRadialBuildMenu(slot);
    }

    audioManager.playUi();
  }

  private showRadialBuildMenu(slot: TowerSlotDefinition): void {
    if (this.radialMenuContainer) {
      this.radialMenuContainer.destroy(true);
      this.radialMenuContainer = null;
    }

    const container = this.add.container(slot.x, slot.y);
    container.setDepth(2000);

    // Glowing pulsing selection ring around the slot
    const ring = this.add.circle(0, 0, 36);
    ring.setStrokeStyle(3, 0x38bdf8, 0.9);
    container.add(ring);

    this.tweens.add({
      targets: ring,
      scaleX: 1.15,
      scaleY: 1.15,
      alpha: 0.6,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    const towerOptions = [
      { towerId: 'tower.archer', tex: 'btn_radial_archer', x: -44, y: -42, cost: 80 },
      { towerId: 'tower.barracks', tex: 'btn_radial_barracks', x: 44, y: -42, cost: 90 },
      { towerId: 'tower.mage', tex: 'btn_radial_mage', x: -44, y: 42, cost: 110 },
      { towerId: 'tower.cannon', tex: 'btn_radial_cannon', x: 44, y: 42, cost: 125 }
    ];

    const allowedClasses = slot.allowedTypes || this.mission.allowedTowerClasses;

    for (const opt of towerOptions) {
      const def = ContentRegistry.getTower(opt.towerId);
      if (!def || !allowedClasses.includes(def.class)) continue;

      const canAfford = this.gold >= opt.cost;
      const btn = this.add.sprite(opt.x, opt.y, opt.tex);
      btn.setAlpha(canAfford ? 1.0 : 0.5);
      btn.setScale(0.7);

      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerover', () => {
        btn.setScale(1.12);
      });
      btn.on('pointerout', () => {
        btn.setScale(1.0);
      });
      btn.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        pointer.event.stopPropagation();
        if (this.gold < opt.cost) {
          audioManager.playUi();
          this.vfxManager.spawnFloatingText(slot.x + opt.x, slot.y + opt.y - 25, `Need ${opt.cost}g!`, '#ef4444');
          this.tweens.add({
            targets: btn,
            x: opt.x - 3,
            duration: 40,
            yoyo: true,
            repeat: 3
          });
          return;
        }

        audioManager.playUi();
        this.buildTower(slot.id, opt.towerId);
      });

      this.tweens.add({
        targets: btn,
        scaleX: 1,
        scaleY: 1,
        duration: 160,
        ease: 'Back.easeOut'
      });

      container.add(btn);
    }

    container.setAlpha(0);
    this.tweens.add({
      targets: container,
      alpha: 1,
      duration: 150
    });

    this.radialMenuContainer = container;
  }

  private showRadialTowerMenu(slot: TowerSlotDefinition, tower: TowerEntity): void {
    if (this.radialMenuContainer) {
      this.radialMenuContainer.destroy(true);
      this.radialMenuContainer = null;
    }

    const container = this.add.container(slot.x, slot.y - 14);
    container.setDepth(2000);

    // Glowing pulsing selection ring around the tower
    const ring = this.add.circle(0, 14, 40);
    ring.setStrokeStyle(3, 0x38bdf8, 0.9);
    container.add(ring);

    this.tweens.add({
      targets: ring,
      scaleX: 1.15,
      scaleY: 1.15,
      alpha: 0.6,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    const nextStats = tower.nextLevelStats;
    const upgradeCost = nextStats ? nextStats.upgradeCost : null;
    const canAffordUpgrade = upgradeCost !== null && this.gold >= upgradeCost;
    const isMaxLevel = upgradeCost === null;

    // 1. Upgrade Button (top-left)
    const upgradeTex = TextureGenerator.getOrCreateUpgradeButtonTexture(this.textures, upgradeCost);
    const upgradeBtn = this.add.sprite(-44, -48, upgradeTex);
    upgradeBtn.setAlpha(canAffordUpgrade ? 1.0 : isMaxLevel ? 0.85 : 0.55);
    upgradeBtn.setScale(0.7);

    upgradeBtn.setInteractive({ useHandCursor: true });
    upgradeBtn.on('pointerover', () => {
      upgradeBtn.setScale(1.12);
    });
    upgradeBtn.on('pointerout', () => {
      upgradeBtn.setScale(1.0);
    });
    upgradeBtn.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      pointer.event.stopPropagation();
      if (isMaxLevel) {
        audioManager.playUi();
        this.vfxManager.spawnFloatingText(slot.x - 44, slot.y - 75, 'MAX LEVEL!', '#facc15');
        return;
      }
      if (!canAffordUpgrade) {
        audioManager.playUi();
        this.vfxManager.spawnFloatingText(slot.x - 44, slot.y - 75, `Need ${upgradeCost}g!`, '#ef4444');
        this.tweens.add({
          targets: upgradeBtn,
          x: '-=4',
          duration: 40,
          yoyo: true,
          repeat: 3
        });
        return;
      }

      this.upgradeTower(slot.id);
    });

    this.tweens.add({
      targets: upgradeBtn,
      scaleX: 1,
      scaleY: 1,
      duration: 160,
      ease: 'Back.easeOut'
    });
    container.add(upgradeBtn);

    // 2. Sell Button (top-right)
    const refund = calculateSellRefund(tower.totalInvestedGold);
    const sellTex = TextureGenerator.getOrCreateSellButtonTexture(this.textures, refund);
    const sellBtn = this.add.sprite(44, -48, sellTex);
    sellBtn.setScale(0.7);

    sellBtn.setInteractive({ useHandCursor: true });
    sellBtn.on('pointerover', () => {
      sellBtn.setScale(1.12);
    });
    sellBtn.on('pointerout', () => {
      sellBtn.setScale(1.0);
    });
    sellBtn.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      pointer.event.stopPropagation();
      this.sellTower(slot.id);
    });

    this.tweens.add({
      targets: sellBtn,
      scaleX: 1,
      scaleY: 1,
      duration: 160,
      ease: 'Back.easeOut'
    });
    container.add(sellBtn);

    // 3. Rally Point Button (for Barracks)
    if (tower.definition.class === 'barracks') {
      const rallyBtn = this.add.sprite(0, 48, 'btn_radial_rally');
      rallyBtn.setScale(0.7);
      rallyBtn.setInteractive({ useHandCursor: true });
      rallyBtn.on('pointerover', () => {
        rallyBtn.setScale(1.12);
      });
      rallyBtn.on('pointerout', () => {
        rallyBtn.setScale(1.0);
      });
      rallyBtn.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        pointer.event.stopPropagation();
        audioManager.playUi();
        this.isSettingRallyPoint = true;
        this.rallyPointTower = tower;
        this.vfxManager.spawnFloatingText(slot.x, slot.y + 75, 'Click path to set rally!', '#38bdf8');
      });

      this.tweens.add({
        targets: rallyBtn,
        scaleX: 1,
        scaleY: 1,
        duration: 160,
        ease: 'Back.easeOut'
      });
      container.add(rallyBtn);
    }

    container.setAlpha(0);
    this.tweens.add({
      targets: container,
      alpha: 1,
      duration: 150
    });

    this.radialMenuContainer = container;
  }

  private deselect(): void {
    this.isSettingRallyPoint = false;
    this.rallyPointTower = null;
    if (this.radialMenuContainer) {
      this.radialMenuContainer.destroy(true);
      this.radialMenuContainer = null;
    }
    if (this.selectedSlotId) {
      const tower = this.towers.get(this.selectedSlotId);
      if (tower) {
        tower.setSelected(false);
      }
    }
    this.selectedSlotId = null;
    gameEventBus.emit(GameEvents.SELECTION_CLEARED, null);
  }

  private setupEventListeners(): void {
    // UI Commands
    this.unsubs.push(
      gameEventBus.on(GameEvents.CMD_BUILD_TOWER, ({ slotId, towerId }: { slotId: string; towerId: string }) => {
        this.buildTower(slotId, towerId);
      }),
      gameEventBus.on(GameEvents.CMD_UPGRADE_TOWER, ({ slotId }: { slotId: string }) => {
        this.upgradeTower(slotId);
      }),
      gameEventBus.on(GameEvents.CMD_SELL_TOWER, ({ slotId }: { slotId: string }) => {
        this.sellTower(slotId);
      }),
      gameEventBus.on(GameEvents.CMD_DESELECT, () => {
        this.deselect();
      }),
      gameEventBus.on(GameEvents.CMD_SET_PRIORITY, ({ slotId, priority }: { slotId: string; priority: any }) => {
        const tower = this.towers.get(slotId);
        if (tower) {
          tower.priority = priority;
          this.onSlotClicked({ id: slotId, x: tower.x, y: tower.y });
        }
      }),
      gameEventBus.on(GameEvents.CMD_START_WAVE_EARLY, () => {
        const { bonusGold } = this.waveManager.startWaveEarly();
        if (bonusGold > 0) {
          this.gold += bonusGold;
          this.goldEarnedTotal += bonusGold;
          audioManager.playCoin();
          this.vfxManager.spawnCoinReward(640, 360, bonusGold);
        }
        audioManager.playWaveHorn();
        this.publishState();
      }),
      gameEventBus.on(GameEvents.CMD_SET_SPEED, (scale: number) => {
        this.gameTime.setScale(scale);
        this.publishState();
      }),
      gameEventBus.on(GameEvents.CMD_TOGGLE_PAUSE, () => {
        this.gameTime.togglePause();
        this.publishState();
      }),
      gameEventBus.on(GameEvents.CMD_TRIGGER_DEV_ACTION, ({ action, payload }: { action: string; payload?: any }) => {
        this.handleDevAction(action, payload);
      }),
      gameEventBus.on(GameEvents.CMD_RESTART_MISSION, () => {
        this.scene.restart({ missionId: this.mission.id });
      }),
      gameEventBus.on(GameEvents.CMD_START_MISSION, ({ missionId }: { missionId: string }) => {
        this.scene.restart({ missionId });
      }),
      gameEventBus.on(GameEvents.CMD_CAST_SPELL, ({ spellId, x, y }: { spellId: string; x?: number; y?: number }) => {
        const targetX = x ?? (this.hero?.x || 640);
        const targetY = y ?? (this.hero?.y || 360);
        this.castCommanderSpell(spellId, targetX, targetY);
      }),
      gameEventBus.on(GameEvents.CMD_HERO_MOVE, ({ x, y }: { x: number; y: number }) => {
        if (this.hero) this.hero.orderMoveTo(x, y);
      }),
      gameEventBus.on(GameEvents.CMD_HERO_ABILITY, () => {
        if (this.hero) this.hero.useAbility(this.enemies);
      })
    );
  }

  private buildTower(slotId: string, towerId: string): void {
    const slot = this.mapDef.towerSlots.find((s) => s.id === slotId);
    if (!slot || this.towers.has(slotId)) return;

    const def = ContentRegistry.getTower(towerId);
    if (this.gold < def.buildCost) return;

    if (this.radialMenuContainer) {
      this.radialMenuContainer.destroy();
      this.radialMenuContainer = null;
    }

    this.gold -= def.buildCost;
    this.towersBuiltCount++;

    // Calculate nearest road point for barracks rally point
    const rallyPoint = this.getNearestPathPoint(slot.x, slot.y);

    const tower = new TowerEntity(
      this,
      slotId,
      slot.x,
      slot.y,
      def,
      rallyPoint,
      (projConfig) => this.onFireProjectile(projConfig),
      (soundType) => {
        if (soundType === 'magic') audioManager.playMagic();
        else if (soundType === 'cannon') audioManager.playCannon();
        else audioManager.playArrow();
      }
    );

    tower.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      pointer.event.stopPropagation();
      this.onSlotClicked(slot);
    });
    tower.on('tower_clicked', () => {
      this.onSlotClicked(slot);
    });

    this.towers.set(slotId, tower);

    // Hide build slot marker and disable interaction
    const marker = this.slotMarkers.get(slotId);
    if (marker) {
      marker.setVisible(false);
      marker.disableInteractive();
    }

    audioManager.playBuild();
    this.vfxManager.spawnMagicSparks(slot.x, slot.y);

    this.onSlotClicked(slot);
    this.publishState();
  }

  private upgradeTower(slotId: string): void {
    const tower = this.towers.get(slotId);
    if (!tower) return;

    const next = tower.nextLevelStats;
    if (!next || this.gold < next.upgradeCost) return;

    this.gold -= next.upgradeCost;
    tower.upgrade();

    audioManager.playBuild();
    this.vfxManager.spawnMagicSparks(tower.x, tower.y);

    const slot = this.mapDef.towerSlots.find((s) => s.id === slotId);
    if (slot) this.onSlotClicked(slot);
    this.publishState();
  }

  private sellTower(slotId: string): void {
    const tower = this.towers.get(slotId);
    if (!tower) return;

    const refund = calculateSellRefund(tower.totalInvestedGold);
    this.gold += refund;

    // Cleanup soldiers if barracks
    tower.soldiers.forEach((s) => s.destroy());
    tower.destroy();
    this.towers.delete(slotId);

    // Restore build slot marker and enable interaction
    const marker = this.slotMarkers.get(slotId);
    if (marker) {
      marker.setVisible(true);
      marker.setInteractive({ useHandCursor: true });
    }

    audioManager.playCoin();
    this.vfxManager.spawnCoinReward(tower.x, tower.y, refund);

    this.deselect();
    this.publishState();
  }

  private onFireProjectile(config: any): void {
    this.projectilePool.spawn({
      ...config,
      onHit: (hitInfo) => {
        if (hitInfo.splashRadius && hitInfo.splashRadius > 0) {
          // Cannon AOE splash damage or Alchemy acid pool
          if (hitInfo.damageInfo.type === 'magic') {
            this.vfxManager.spawnAcidPool(hitInfo.x, hitInfo.y);
          } else {
            this.vfxManager.spawnExplosion(hitInfo.x, hitInfo.y, hitInfo.splashRadius);
          }
          const nearby = this.spatialGrid.queryRadius(hitInfo.x, hitInfo.y, hitInfo.splashRadius);
          nearby.forEach((enemy) => {
            if (!enemy.isDead) {
              const dealt = enemy.takeDamage(hitInfo.damageInfo);
              this.vfxManager.spawnDamageNumber(enemy.x, enemy.y, dealt, hitInfo.damageInfo.type);
              if (hitInfo.damageInfo.type === 'magic') {
                enemy.applyStatus({ type: 'slow', duration: 3.0, potency: 0.35 });
                enemy.applyStatus({ type: 'armorBreak', duration: 4.0, potency: 0.3 });
              }
            }
          });
        } else if (hitInfo.target && !hitInfo.target.isDead) {
          // Direct single target hit
          const dealt = hitInfo.target.takeDamage(hitInfo.damageInfo);
          this.vfxManager.spawnDamageNumber(hitInfo.target.x, hitInfo.target.y, dealt, hitInfo.damageInfo.type);
          if (hitInfo.damageInfo.type === 'magic') {
            this.vfxManager.spawnMagicSparks(hitInfo.x, hitInfo.y);
          } else {
            audioManager.playHit();
          }
        }
      }
    });
  }

  private spawnEnemy(enemyId: string): void {
    const def = ContentRegistry.getEnemy(enemyId);
    const enemy = new EnemyEntity(
      this,
      `enemy_${Date.now()}_${Math.random()}`,
      def,
      this.pathCurve,
      (deadEnemy) => this.onEnemyKilled(deadEnemy),
      (leakedEnemy) => this.onEnemyLeaked(leakedEnemy),
      (hx, hy) => {
        audioManager.playMagic();
        this.vfxManager.spawnHealEffect(hx, hy);
      }
    );

    // Enemy inspect event
    enemy.on('pointerover', () => {
      gameEventBus.emit(GameEvents.ENEMY_INSPECTED, {
        id: enemy.id,
        definition: enemy.definition,
        currentHp: enemy.currentHp,
        maxHp: enemy.maxHp,
        armor: enemy.definition.defense.armor,
        magicResistance: enemy.definition.defense.magicResistance,
        speed: enemy.definition.baseSpeed,
        x: enemy.x,
        y: enemy.y
      });
    });
    enemy.on('pointerout', () => {
      gameEventBus.emit(GameEvents.ENEMY_INSPECT_CLEARED, null);
    });

    this.enemies.push(enemy);
  }

  private onEnemyKilled(enemy: EnemyEntity): void {
    const idx = this.enemies.indexOf(enemy);
    if (idx !== -1) this.enemies.splice(idx, 1);

    this.enemiesDefeatedCount++;
    const reward = enemy.definition.rewardGold;
    this.gold += reward;
    this.goldEarnedTotal += reward;

    audioManager.playDeath();
    audioManager.playCoin();
    this.vfxManager.spawnCoinReward(enemy.x, enemy.y, reward);

    this.checkWaveProgress();
    this.publishState();
  }

  private onEnemyLeaked(enemy: EnemyEntity): void {
    const idx = this.enemies.indexOf(enemy);
    if (idx !== -1) this.enemies.splice(idx, 1);

    if (!this.isGodMode) {
      this.lives = Math.max(0, this.lives - enemy.definition.leakDamage);
    }

    audioManager.playDefeat();
    this.cameras.main.shake(200, 0.01);

    if (this.lives <= 0 && !this.isGameOver) {
      this.triggerDefeat();
    } else {
      this.checkWaveProgress();
      this.publishState();
    }
  }

  private checkWaveProgress(): void {
    const outcome = this.waveManager.onEnemyDefeatedOrLeaked();
    if (outcome.rewardGold > 0) {
      this.gold += outcome.rewardGold;
      this.goldEarnedTotal += outcome.rewardGold;
      this.vfxManager.spawnCoinReward(640, 360, outcome.rewardGold);
      audioManager.playCoin();
    }

    if (outcome.allCompleted && !this.isGameOver) {
      this.triggerVictory();
    }
  }

  private triggerVictory(): void {
    this.isGameOver = true;
    audioManager.stopMusic();
    audioManager.playVictory();

    const stars = calculateStars(this.lives, this.maxLives);
    SaveService.recordMissionVictory(this.mission.id, stars, this.goldEarnedTotal, this.mission.nextMissionId);

    gameEventBus.emit(GameEvents.MISSION_VICTORY, {
      missionId: this.mission.id,
      nextMissionId: this.mission.nextMissionId,
      stars,
      livesRemaining: this.lives,
      goldEarned: this.goldEarnedTotal,
      enemiesDefeated: this.enemiesDefeatedCount,
      towersBuilt: this.towersBuiltCount,
      timeElapsedSeconds: Math.floor((Date.now() - this.sessionStartTime) / 1000)
    });
  }

  private triggerDefeat(): void {
    this.isGameOver = true;
    audioManager.stopMusic();
    audioManager.playDefeat();

    gameEventBus.emit(GameEvents.MISSION_DEFEAT, {
      missionId: this.mission.id,
      waveReached: this.waveManager.currentWaveNumber,
      totalWaves: this.waveManager.totalWaves,
      enemiesDefeated: this.enemiesDefeatedCount,
      goldEarned: this.goldEarnedTotal,
      timeElapsedSeconds: Math.floor((Date.now() - this.sessionStartTime) / 1000)
    });
  }

  private handleDevAction(action: string, payload?: any): void {
    switch (action) {
      case 'add_gold':
        this.gold += 500;
        this.goldEarnedTotal += 500;
        audioManager.playCoin();
        this.vfxManager.spawnCoinReward(640, 360, 500);
        break;
      case 'kill_all':
        [...this.enemies].forEach((e) => e.takeDamage({ amount: 99999, type: 'true' }));
        break;
      case 'god_mode':
        this.isGodMode = true;
        this.lives = 999;
        this.maxLives = 999;
        break;
      case 'spawn_enemy':
        if (payload?.enemyId) {
          this.spawnEnemy(payload.enemyId);
        }
        break;
    }
    this.publishState();
  }

  private getNearestPathPoint(x: number, y: number): { x: number; y: number } {
    let nearest = this.mapDef.path[0];
    let minDistSq = Infinity;
    for (const pt of this.mapDef.path) {
      const distSq = (pt.x - x) ** 2 + (pt.y - y) ** 2;
      if (distSq < minDistSq) {
        minDistSq = distSq;
        nearest = pt;
      }
    }
    return { x: nearest.x, y: nearest.y };
  }

  update(_time: number, delta: number): void {
    if (this.isGameOver) return;

    const deltaSec = this.gameTime.getDelta(delta / 1000);
    if (deltaSec <= 0) return;

    // 1. Advance Wave Manager
    const spawns = this.waveManager.update(deltaSec);
    spawns.forEach((item) => this.spawnEnemy(item.enemyId));

    // 2. Rebuild Spatial Grid for enemies
    this.spatialGrid.clear();
    this.enemies.forEach((e) => this.spatialGrid.insert(e));

    // 3. Update Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      this.enemies[i].updateLogic(deltaSec, this.pathCurve, this.enemies);
    }

    // 4. Update Towers
    this.towers.forEach((tower) => {
      tower.updateLogic(deltaSec, this.spatialGrid);
      // Update soldiers
      tower.soldiers.forEach((soldier) => soldier.updateLogic(deltaSec, this.enemies));
    });

    // 5. Update Projectiles
    this.projectilePool.update(deltaSec);

    // 6. Update Hero
    if (this.hero) {
      this.hero.updateLogic(deltaSec, this.enemies);
    }

    // 7. Update Temporary Militia Soldiers
    for (let i = this.tempSoldiers.length - 1; i >= 0; i--) {
      const s = this.tempSoldiers[i];
      if (!s.active || s.isDead) {
        this.tempSoldiers.splice(i, 1);
      } else {
        s.updateLogic(deltaSec, this.enemies);
      }
    }

    // Periodic state push
    this.publishState();
  }

  public castCommanderSpell(spellId: string, x: number, y: number): void {
    if (spellId === 'spell_meteor') {
      const meteor = this.add.sprite(x + 100, y - 280, 'proj_meteor');
      meteor.setDisplaySize(48, 48);
      meteor.setDepth(2000);
      this.tweens.add({
        targets: meteor,
        x,
        y,
        duration: 350,
        ease: 'Cubic.easeIn',
        onComplete: () => {
          meteor.destroy();
          this.vfxManager.spawnExplosion(x, y, 2.2);
          audioManager.playCannon();
          this.cameras.main.shake(300, 0.02);

          for (const enemy of this.enemies) {
            if (!enemy.isDead && enemy.active) {
              const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
              if (dist <= 110) {
                enemy.takeDamage(320, 'physical');
              }
            }
          }
        }
      });
    } else if (spellId === 'spell_reinforcements') {
      audioManager.playBuild();
      this.vfxManager.spawnMagicSparks(x, y);
      for (let i = 0; i < 2; i++) {
        const sx = x + (i === 0 ? -18 : 18);
        const sy = y;
        const militia = new SoldierEntity(
          this,
          `militia_${Date.now()}_${i}`,
          sx,
          sy,
          sx,
          sy,
          140,
          18,
          () => {}
        );
        this.tempSoldiers.push(militia);
        this.time.delayedCall(35000, () => {
          if (militia.active) militia.destroy();
        });
      }
    }
  }

  private publishState(): void {
    const snapshot: GameStateSnapshot = {
      lives: this.lives,
      maxLives: this.maxLives,
      gold: this.gold,
      waveNumber: this.waveManager.currentWaveNumber,
      totalWaves: this.waveManager.totalWaves,
      waveState: this.waveManager.waveState,
      countdown: this.waveManager.countdown,
      activeEnemies: this.enemies.length,
      timeScale: this.gameTime.scale,
      isPaused: this.gameTime.isPaused,
      isBossWave: this.waveManager.currentWave?.isBossWave
    };
    gameEventBus.emit(GameEvents.STATE_UPDATED, snapshot);
  }

  shutdown(): void {
    this.unsubs.forEach((unsub) => unsub());
    this.unsubs = [];
    audioManager.stopMusic();
  }
}
