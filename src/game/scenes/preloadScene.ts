import Phaser from 'phaser';
import { TextureGenerator } from '../visuals/textureGenerator';
import { removeSpriteBackground } from '../visuals/spriteProcessor';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    // 1. Regional Map Backgrounds
    this.load.image('map_forest_road_bg', '/assets/maps/forest_road_bg.png');
    this.load.image('map_village_crossing_bg', '/assets/maps/broken_pass_bg.png');
    this.load.image('map_stone_bridge_bg', '/assets/maps/sunken_causeway_bg.png');
    this.load.image('map_crystal_grove_bg', '/assets/maps/molten_ridge_bg.png');
    this.load.image('map_broken_mill_bg', '/assets/maps/frozen_front_bg.png');
    this.load.image('map_troll_pass_bg', '/assets/maps/shattered_path_bg.png');

    // 2. Towers Progression (L1, L2, L3 + Specs)
    const towerTypes = ['archer', 'mage', 'cannon', 'barracks', 'alchemy'];
    const tiers = ['l1', 'l2', 'l3', 'spec1', 'spec2'];
    for (const t of towerTypes) {
      for (const tier of tiers) {
        const key = `tower_${t}_${tier}`;
        this.load.image(key, `/assets/towers/${key}.png`);
      }
    }

    // 3. Hero Sir Aldren & Soldiers
    this.load.image('hero_sir_aldren', '/assets/heroes/hero_sir_aldren.png');
    this.load.image('soldier_kingdom', '/assets/soldiers/soldier_guard.png');

    // 4. Enemies & Regional Boss
    this.load.image('enemy_goblin_runner', '/assets/enemies/enemy_goblin_runner.png');
    this.load.image('enemy_orc_brute', '/assets/enemies/enemy_orc_brute.png');
    this.load.image('enemy_rift_knight', '/assets/enemies/enemy_rift_knight.png');
    this.load.image('enemy_shaman_healer', '/assets/enemies/enemy_shaman_healer.png');
    this.load.image('enemy_sapper', '/assets/enemies/enemy_sapper.png');
    this.load.image('boss_king_grukk', '/assets/enemies/boss_king_grukk.png');
    this.load.image('enemy_goblin_spearman', '/assets/enemies/enemy_goblin_spearman.png');
    this.load.image('enemy_boar_raider', '/assets/enemies/enemy_boar_raider.png');
    this.load.image('enemy_iron_shield_raider', '/assets/enemies/enemy_iron_shield_raider.png');
    this.load.image('enemy_rot_walker', '/assets/enemies/enemy_rot_walker.png');

    // 5. Projectiles & VFX
    this.load.image('proj_arrow', '/assets/projectiles/proj_arrow.png');
    this.load.image('proj_magic_bolt', '/assets/projectiles/proj_magic_bolt.png');
    this.load.image('proj_cannonball', '/assets/projectiles/proj_cannonball.png');
    this.load.image('vfx_poison_cloud', '/assets/vfx/vfx_poison_cloud.png');
    this.load.image('vfx_summon_portal', '/assets/vfx/vfx_summon_portal.png');
    this.load.image('vfx_explosion_aoe', '/assets/vfx/vfx_explosion_aoe.png');
    this.load.image('vfx_death_burst', '/assets/vfx/vfx_death_burst.png');
    this.load.image('vfx_gold_pickup', '/assets/vfx/vfx_gold_pickup.png');

    // 6. Props & Slots
    this.load.image('prop_mana_crystal', '/assets/props/prop_mana_crystal.png');
    this.load.image('prop_treasure_chest', '/assets/props/prop_treasure_chest.png');
    this.load.image('tex_build_slot', '/assets/props/tex_build_slot.png');
  }

  create(): void {
    // Process sprites to ensure background transparency
    const cutoutKeys = [
      'soldier_kingdom',
      'prop_mana_crystal',
      'prop_treasure_chest',
      'tex_build_slot'
    ];

    for (const key of cutoutKeys) {
      removeSpriteBackground(this, key, key);
    }

    // Aliases for Hero and Boss
    const heroTex = this.textures.get('hero_sir_aldren');
    if (heroTex && !this.textures.exists('hero_commander')) {
      this.textures.addImage('hero_commander', heroTex.getSourceImage() as HTMLImageElement);
    }

    const bossTex = this.textures.get('boss_king_grukk');
    if (bossTex) {
      if (!this.textures.exists('boss_troll_king')) {
        this.textures.addImage('boss_troll_king', bossTex.getSourceImage() as HTMLImageElement);
      }
      if (!this.textures.exists('enemy_troll_king')) {
        this.textures.addImage('enemy_troll_king', bossTex.getSourceImage() as HTMLImageElement);
      }
      if (!this.textures.exists('enemy_troll')) {
        this.textures.addImage('enemy_troll', bossTex.getSourceImage() as HTMLImageElement);
      }
    }

    // Generate fallback textures, particles and sounds
    TextureGenerator.generateAll(this);

    // Start battle scene with default mission
    this.scene.start('BattleScene', { missionId: 'mission.greenlands.01' });
  }
}

