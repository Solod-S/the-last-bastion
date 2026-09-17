import Phaser from 'phaser';
import { TextureGenerator } from '../visuals/textureGenerator';
import { removeSpriteBackground } from '../visuals/spriteProcessor';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    // 1. Map background
    this.load.image('map_forest_road_bg', '/assets/maps/forest_road_bg.png');

    // 2. Towers
    this.load.image('tower_archer_l1', '/assets/towers/tower_archer_l1.png');
    this.load.image('tower_mage_l1', '/assets/towers/tower_mage_l1.png');
    this.load.image('tower_cannon_l1', '/assets/towers/tower_cannon_l1.png');
    this.load.image('tower_barracks_l1', '/assets/towers/tower_barracks_l1.png');

    // 3. Enemies & Soldiers
    this.load.image('enemy_goblin_runner', '/assets/enemies/enemy_goblin_runner.png');
    this.load.image('enemy_orc_brute', '/assets/enemies/enemy_orc_brute.png');
    this.load.image('enemy_rift_knight', '/assets/enemies/enemy_rift_knight.png');
    this.load.image('enemy_shaman_healer', '/assets/enemies/enemy_shaman_healer.png');
    this.load.image('soldier_kingdom', '/assets/soldiers/soldier_guard.png');

    // 4. Props & Slots
    this.load.image('prop_mana_crystal', '/assets/props/prop_mana_crystal.png');
    this.load.image('prop_treasure_chest', '/assets/props/prop_treasure_chest.png');
    this.load.image('tex_build_slot', '/assets/props/tex_build_slot.png');
  }

  create(): void {
    // Process sprites to make their background transparent
    const cutoutKeys = [
      'tower_archer_l1',
      'tower_mage_l1',
      'tower_cannon_l1',
      'tower_barracks_l1',
      'enemy_goblin_runner',
      'enemy_orc_brute',
      'enemy_rift_knight',
      'enemy_shaman_healer',
      'soldier_kingdom',
      'prop_mana_crystal',
      'prop_treasure_chest',
      'tex_build_slot'
    ];

    for (const key of cutoutKeys) {
      removeSpriteBackground(this, key, key);
    }

    // Clone tier 2 and 3 tower textures from tier 1
    const towerKeys = ['tower_archer', 'tower_mage', 'tower_cannon', 'tower_barracks'];
    for (const base of towerKeys) {
      const srcTex = this.textures.get(`${base}_l1`);
      if (srcTex && !this.textures.exists(`${base}_l2`)) {
        this.textures.addImage(`${base}_l2`, srcTex.getSourceImage() as HTMLImageElement);
      }
      if (srcTex && !this.textures.exists(`${base}_l3`)) {
        this.textures.addImage(`${base}_l3`, srcTex.getSourceImage() as HTMLImageElement);
      }
    }

    // Generate fallback textures, projectiles, UI radial buttons and particles
    TextureGenerator.generateAll(this);

    // Start battle scene with default mission
    this.scene.start('BattleScene', { missionId: 'mission.greenlands.01' });
  }
}

