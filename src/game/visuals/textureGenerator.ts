import Phaser from 'phaser';

/**
 * Generates rich, stylized 2.5D visual textures directly into Phaser TextureManager
 * matching the concept art in assets/concepts/01_visual_style_guide.png.
 */
export class TextureGenerator {
  public static generateAll(scene: Phaser.Scene): void {
    const tm = scene.textures;

    this.createGrassTile(tm);
    this.createRoadTexture(tm);
    this.createWaterTexture(tm);
    this.createBridgeTexture(tm);
    this.createBuildSlotTexture(tm);
    this.createBastionGateTexture(tm);
    this.createRiftPortalTexture(tm);

    this.createArcherTowerTextures(tm);
    this.createMageTowerTextures(tm);
    this.createCannonTowerTextures(tm);
    this.createBarracksTextures(tm);
    this.createAlchemyTowerTextures(tm);

    this.createEnemyTextures(tm);
    this.createNewEnemyTextures(tm);
    this.createHeroTextures(tm);
    this.createSoldierTexture(tm);
    this.createPropTextures(tm);
    this.createProjectileTextures(tm);
    this.createVfxTextures(tm);
    this.createSpellAndVfxTextures(tm);
    this.createRadialButtonTextures(tm);
    this.createMapBackgroundTextures(tm);
  }

  private static createGrassTile(tm: Phaser.Textures.TextureManager): void {
    if (tm.exists('tile_grass')) return;
    const canvas = tm.createCanvas('tile_grass', 64, 64);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Base meadow green
    ctx.fillStyle = '#476e36';
    ctx.fillRect(0, 0, 64, 64);

    // Subtle texture variations
    ctx.fillStyle = '#3f6330';
    for (let i = 0; i < 40; i++) {
      const rx = Math.random() * 64;
      const ry = Math.random() * 64;
      ctx.fillRect(rx, ry, 2, 3);
    }
    ctx.fillStyle = '#558240';
    for (let i = 0; i < 30; i++) {
      const rx = Math.random() * 64;
      const ry = Math.random() * 64;
      ctx.fillRect(rx, ry, 2, 2);
    }

    // Small wild flowers (yellow, white, blue)
    const flowerColors = ['#f59e0b', '#f8fafc', '#60a5fa'];
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = flowerColors[i % flowerColors.length];
      const fx = Math.random() * 60 + 2;
      const fy = Math.random() * 60 + 2;
      ctx.beginPath();
      ctx.arc(fx, fy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    canvas.refresh();
  }

  private static createRoadTexture(tm: Phaser.Textures.TextureManager): void {
    if (tm.exists('tex_road')) return;
    const canvas = tm.createCanvas('tex_road', 64, 64);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Sandy dirt road
    ctx.fillStyle = '#a88960';
    ctx.fillRect(0, 0, 64, 64);

    // Cobblestones
    ctx.fillStyle = '#876c49';
    const stones = [
      [10, 12, 14, 10], [32, 8, 16, 12], [14, 34, 18, 12],
      [42, 28, 12, 14], [24, 48, 16, 10], [46, 46, 14, 12]
    ];
    stones.forEach(([x, y, w, h]) => {
      ctx.beginPath();
      ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Cobblestone highlights
    ctx.fillStyle = '#bfa580';
    stones.forEach(([x, y, w]) => {
      ctx.fillRect(x - w / 4, y - 2, w / 2, 2);
    });

    canvas.refresh();
  }

  private static createWaterTexture(tm: Phaser.Textures.TextureManager): void {
    if (tm.exists('tex_water')) return;
    const canvas = tm.createCanvas('tex_water', 64, 64);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // River blue gradient
    const grad = ctx.createLinearGradient(0, 0, 64, 0);
    grad.addColorStop(0, '#1e3a8a');
    grad.addColorStop(0.5, '#2563eb');
    grad.addColorStop(1, '#1d4ed8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    // Waves / foam highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(10, 14, 20, 2);
    ctx.fillRect(34, 38, 22, 2);
    ctx.fillRect(8, 52, 16, 2);
    canvas.refresh();
  }

  private static createBridgeTexture(tm: Phaser.Textures.TextureManager): void {
    if (tm.exists('tex_stone_bridge')) return;
    const canvas = tm.createCanvas('tex_stone_bridge', 110, 70);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Stone arch piers
    ctx.fillStyle = '#64748b';
    ctx.fillRect(5, 5, 100, 60);

    // Wooden deck
    ctx.fillStyle = '#92400e';
    ctx.fillRect(15, 10, 80, 50);

    // Planks
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    for (let x = 20; x < 95; x += 10) {
      ctx.beginPath();
      ctx.moveTo(x, 10);
      ctx.lineTo(x, 60);
      ctx.stroke();
    }

    // Stone railings with blue heraldic banners
    ctx.fillStyle = '#475569';
    ctx.fillRect(5, 5, 10, 60);
    ctx.fillRect(95, 5, 10, 60);

    // Blue banners
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(7, 20, 6, 28);
    ctx.fillRect(97, 20, 6, 28);

    canvas.refresh();
  }

  private static createBuildSlotTexture(tm: Phaser.Textures.TextureManager): void {
    if (tm.exists('tex_build_slot')) return;
    const canvas = tm.createCanvas('tex_build_slot', 64, 64);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Outer stone foundation ring
    ctx.fillStyle = 'rgba(30, 41, 59, 0.75)';
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fill();

    // Stone border
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner rune circle
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(32, 32, 18, 0, Math.PI * 2);
    ctx.stroke();

    // Build hammer / plus icon
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(29, 20, 6, 24);
    ctx.fillRect(20, 29, 24, 6);

    canvas.refresh();
  }

  private static createBastionGateTexture(tm: Phaser.Textures.TextureManager): void {
    if (tm.exists('tex_bastion_gate')) return;
    const canvas = tm.createCanvas('tex_bastion_gate', 90, 90);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Stone fortress arch
    ctx.fillStyle = '#475569';
    ctx.fillRect(10, 20, 70, 65);

    // Archway entrance
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(45, 55, 25, Math.PI, 0);
    ctx.fillRect(20, 55, 50, 30);
    ctx.fill();

    // Royal Blue Banners on sides
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(14, 25, 12, 35);
    ctx.fillRect(64, 25, 12, 35);
    // Gold trim on banners
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(14, 58, 12, 3);
    ctx.fillRect(64, 58, 12, 3);

    // Battlements
    ctx.fillStyle = '#64748b';
    ctx.fillRect(10, 10, 16, 12);
    ctx.fillRect(37, 10, 16, 12);
    ctx.fillRect(64, 10, 16, 12);

    canvas.refresh();
  }

  private static createRiftPortalTexture(tm: Phaser.Textures.TextureManager): void {
    if (tm.exists('tex_rift_portal')) return;
    const canvas = tm.createCanvas('tex_rift_portal', 80, 80);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Dark void ring
    ctx.fillStyle = '#2e1065';
    ctx.beginPath();
    ctx.arc(40, 40, 32, 0, Math.PI * 2);
    ctx.fill();

    // Purple swirl
    const grad = ctx.createRadialGradient(40, 40, 5, 40, 40, 30);
    grad.addColorStop(0, '#f472b6');
    grad.addColorStop(0.5, '#a855f7');
    grad.addColorStop(1, '#581c87');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(40, 40, 24, 0, Math.PI * 2);
    ctx.fill();

    // Portal runes
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 3;
    ctx.stroke();

    canvas.refresh();
  }

  // --- TOWERS ---
  private static createArcherTowerTextures(tm: Phaser.Textures.TextureManager): void {
    [1, 2, 3].forEach((level) => {
      const key = `tower_archer_l${level}`;
      if (tm.exists(key)) return;
      const canvas = tm.createCanvas(key, 70, 90);
      if (!canvas) return;
      const ctx = canvas.getContext();

      // Stone circular base
      ctx.fillStyle = '#64748b';
      ctx.fillRect(15, 45, 40, 40);

      // Wooden timber framing
      ctx.fillStyle = '#78350f';
      ctx.fillRect(12, 30, 46, 18);
      ctx.fillRect(16, 25, 6, 25);
      ctx.fillRect(48, 25, 6, 25);

      // Blue hipped roof (concept art signature)
      ctx.fillStyle = '#1d4ed8';
      ctx.beginPath();
      ctx.moveTo(35, 6);
      ctx.lineTo(60, 26);
      ctx.lineTo(10, 26);
      ctx.closePath();
      ctx.fill();

      // Blue heraldic banner on front
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(28, 48, 14, 25);
      // White Tree crest on banner
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(34, 52, 2, 14);
      ctx.fillRect(31, 56, 8, 2);

      // Archer figurine
      ctx.fillStyle = '#15803d'; // green tunic
      ctx.fillRect(32, 22, 6, 8);
      ctx.fillStyle = '#fde047'; // hair/hat
      ctx.fillRect(32, 19, 6, 3);
      // Bow
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(42, 25, 6, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      // Level 2/3 extras
      if (level >= 2) {
        ctx.fillStyle = '#fbbf24'; // gold finial on roof
        ctx.beginPath();
        ctx.arc(35, 5, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      if (level === 3) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(15, 82, 40, 4); // reinforced gold base
      }

      canvas.refresh();
    });
  }

  private static createMageTowerTextures(tm: Phaser.Textures.TextureManager): void {
    [1, 2, 3].forEach((level) => {
      const key = `tower_mage_l${level}`;
      if (tm.exists(key)) return;
      const canvas = tm.createCanvas(key, 70, 95);
      if (!canvas) return;
      const ctx = canvas.getContext();

      // Tall stone tower with masonry lines
      ctx.fillStyle = '#475569';
      ctx.fillRect(16, 35, 38, 55);

      // Battlements
      ctx.fillStyle = '#64748b';
      ctx.fillRect(13, 26, 12, 10);
      ctx.fillRect(45, 26, 12, 10);

      // Blue banner
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(29, 46, 12, 26);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(33, 50, 4, 16);

      // Central giant floating blue mana crystal
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(35, 4);
      ctx.lineTo(44, 18);
      ctx.lineTo(35, 28);
      ctx.lineTo(26, 18);
      ctx.closePath();
      ctx.fill();

      // Crystal highlight
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.moveTo(35, 4);
      ctx.lineTo(39, 18);
      ctx.lineTo(35, 28);
      ctx.closePath();
      ctx.fill();

      // Smaller orbiting crystals
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(12, 16, 5, 8);
      ctx.fillRect(53, 16, 5, 8);

      if (level >= 2) {
        ctx.fillStyle = '#67e8f9';
        ctx.fillRect(8, 8, 4, 6);
        ctx.fillRect(58, 8, 4, 6);
      }
      if (level === 3) {
        // Glowing gold astrolabe ring around crystal
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(35, 17, 24, 8, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      canvas.refresh();
    });
  }

  private static createCannonTowerTextures(tm: Phaser.Textures.TextureManager): void {
    [1, 2, 3].forEach((level) => {
      const key = `tower_cannon_l${level}`;
      if (tm.exists(key)) return;
      const canvas = tm.createCanvas(key, 80, 80);
      if (!canvas) return;
      const ctx = canvas.getContext();

      // Heavy fortified stone fortress base
      ctx.fillStyle = '#475569';
      ctx.fillRect(10, 36, 60, 40);

      // Wooden timber revetment
      ctx.fillStyle = '#78350f';
      ctx.fillRect(14, 40, 52, 6);

      // Blue heraldic banner
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(33, 48, 14, 22);

      // Massive iron mortar / cannon barrel (aimed up-right at 45 deg)
      ctx.save();
      ctx.translate(40, 32);
      ctx.rotate(-Math.PI / 4);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-12, -18, 24, 34);

      // Bronze muzzle ring
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-14, -22, 28, 6);

      // Muzzle bore
      ctx.fillStyle = '#09090b';
      ctx.beginPath();
      ctx.ellipse(0, -22, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Cannonballs pile on platform
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(20, 68, 4, 0, Math.PI * 2);
      ctx.arc(26, 68, 4, 0, Math.PI * 2);
      ctx.arc(23, 62, 4, 0, Math.PI * 2);
      ctx.fill();

      if (level >= 2) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(10, 72, 60, 4);
      }

      canvas.refresh();
    });
  }

  private static createBarracksTextures(tm: Phaser.Textures.TextureManager): void {
    [1, 2, 3].forEach((level) => {
      const key = `tower_barracks_l${level}`;
      if (tm.exists(key)) return;
      const canvas = tm.createCanvas(key, 80, 85);
      if (!canvas) return;
      const ctx = canvas.getContext();

      // Stone building
      ctx.fillStyle = '#64748b';
      ctx.fillRect(12, 32, 56, 48);

      // Wooden arched gate
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(40, 60, 12, Math.PI, 0);
      ctx.fillRect(28, 60, 24, 20);
      ctx.fill();

      // Blue shingled roof
      ctx.fillStyle = '#1d4ed8';
      ctx.beginPath();
      ctx.moveTo(40, 10);
      ctx.lineTo(72, 32);
      ctx.lineTo(8, 32);
      ctx.closePath();
      ctx.fill();

      // Blue banner
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(54, 38, 10, 28);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(58, 42, 2, 16);

      // Crossed swords emblem above gate
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(33, 40);
      ctx.lineTo(47, 50);
      ctx.moveTo(47, 40);
      ctx.lineTo(33, 50);
      ctx.stroke();

      if (level >= 2) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(8, 76, 64, 4);
      }

      canvas.refresh();
    });
  }

  // --- ENEMIES ---
  private static createEnemyTextures(tm: Phaser.Textures.TextureManager): void {
    // 1. Goblin Runner (green skin, red bandana, fast legs, twin daggers)
    if (!tm.exists('enemy_goblin_runner')) {
      const canvas = tm.createCanvas('enemy_goblin_runner', 36, 36);
      if (canvas) {
        const ctx = canvas.getContext();
        // Green body
        ctx.fillStyle = '#65a30d';
        ctx.fillRect(12, 14, 12, 14);
        // Red bandana
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(10, 8, 16, 7);
        ctx.fillRect(6, 10, 5, 4); // bandana tail
        // Face & eyes
        ctx.fillStyle = '#84cc16';
        ctx.fillRect(12, 11, 12, 6);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(14, 12, 3, 2);
        ctx.fillRect(20, 12, 3, 2);
        // Daggers
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(6, 18, 4, 10);
        ctx.fillRect(26, 18, 4, 10);
        canvas.refresh();
      }
    }

    // 2. Orc Brute (massive muscular green, spiked shoulder, big club)
    if (!tm.exists('enemy_orc_brute')) {
      const canvas = tm.createCanvas('enemy_orc_brute', 48, 48);
      if (canvas) {
        const ctx = canvas.getContext();
        // Huge torso
        ctx.fillStyle = '#4d7c0f';
        ctx.fillRect(12, 16, 24, 22);
        // Head
        ctx.fillStyle = '#3f6212';
        ctx.fillRect(16, 8, 16, 12);
        // Red eyes
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(18, 11, 3, 2);
        ctx.fillRect(26, 11, 3, 2);
        // Tusks
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(18, 16, 2, 4);
        ctx.fillRect(27, 16, 2, 4);
        // Spiked iron shoulder
        ctx.fillStyle = '#475569';
        ctx.fillRect(8, 14, 8, 10);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(6, 12, 4, 4); // spike
        // Spiked heavy wooden club
        ctx.fillStyle = '#78350f';
        ctx.fillRect(36, 10, 8, 28);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(34, 12, 12, 4);
        ctx.fillRect(34, 20, 12, 4);
        canvas.refresh();
      }
    }

    // 3. Rift Knight (dark full plate, glowing purple runes and purple heater shield)
    if (!tm.exists('enemy_rift_knight')) {
      const canvas = tm.createCanvas('enemy_rift_knight', 42, 46);
      if (canvas) {
        const ctx = canvas.getContext();
        // Dark steel armor
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(12, 14, 18, 24);
        // Helm
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(13, 6, 16, 12);
        // Purple visor glow
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(16, 11, 10, 2);
        // Purple energy lines on chest
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(21, 16);
        ctx.lineTo(21, 26);
        ctx.moveTo(16, 21);
        ctx.lineTo(26, 21);
        ctx.stroke();
        // Dark purple shield with glowing glyph
        ctx.fillStyle = '#3b0764';
        ctx.beginPath();
        ctx.moveTo(4, 14);
        ctx.lineTo(12, 14);
        ctx.lineTo(12, 34);
        ctx.lineTo(8, 38);
        ctx.lineTo(4, 34);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#d8b4fe';
        ctx.fillRect(6, 22, 4, 6);
        // Dark sword
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(32, 12, 4, 24);
        canvas.refresh();
      }
    }

    // 4. Shaman Healer (skull mask, feathered headdress, green healing staff)
    if (!tm.exists('enemy_shaman_healer')) {
      const canvas = tm.createCanvas('enemy_shaman_healer', 40, 44);
      if (canvas) {
        const ctx = canvas.getContext();
        // Body with rags
        ctx.fillStyle = '#713f12';
        ctx.fillRect(12, 18, 16, 20);
        // Skull mask
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(13, 8, 14, 12);
        // Dark eye sockets
        ctx.fillStyle = '#09090b';
        ctx.fillRect(15, 11, 3, 3);
        ctx.fillRect(22, 11, 3, 3);
        // Feathers on head (red and turquoise)
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(11, 2, 4, 8);
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(25, 2, 4, 8);
        // Healing staff
        ctx.fillStyle = '#92400e';
        ctx.fillRect(32, 6, 4, 34);
        // Glowing green crystal orb on staff
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(34, 6, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#86efac';
        ctx.beginPath();
        ctx.arc(33, 4, 2, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }
  }

  // --- SOLDIERS (from Barracks) ---
  private static createSoldierTexture(tm: Phaser.Textures.TextureManager): void {
    if (tm.exists('soldier_kingdom')) return;
    const canvas = tm.createCanvas('soldier_kingdom', 34, 38);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Steel chainmail / plate
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(10, 14, 14, 18);

    // Helmet
    ctx.fillStyle = '#64748b';
    ctx.fillRect(11, 6, 12, 10);
    // Visor
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(13, 10, 8, 2);

    // Blue Heraldic Shield with white tree
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.moveTo(3, 12);
    ctx.lineTo(10, 12);
    ctx.lineTo(10, 28);
    ctx.lineTo(6, 32);
    ctx.lineTo(3, 28);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(5, 18, 2, 8); // tree trunk

    // Steel sword
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(24, 10, 3, 18);
    ctx.fillStyle = '#fbbf24'; // crossguard
    ctx.fillRect(22, 22, 7, 3);

    canvas.refresh();
  }

  // --- PROPS ---
  private static createPropTextures(tm: Phaser.Textures.TextureManager): void {
    // Mana Crystal
    if (!tm.exists('prop_mana_crystal')) {
      const canvas = tm.createCanvas('prop_mana_crystal', 50, 60);
      if (canvas) {
        const ctx = canvas.getContext();
        // Mossy stone pedestal
        ctx.fillStyle = '#475569';
        ctx.fillRect(10, 38, 30, 18);
        ctx.fillStyle = '#15803d'; // moss
        ctx.fillRect(12, 38, 8, 4);
        ctx.fillRect(28, 42, 10, 4);

        // Giant glowing blue crystal
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(25, 6);
        ctx.lineTo(38, 22);
        ctx.lineTo(25, 40);
        ctx.lineTo(12, 22);
        ctx.closePath();
        ctx.fill();

        // Facet light reflection
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(25, 6);
        ctx.lineTo(30, 22);
        ctx.lineTo(25, 40);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.arc(24, 18, 3, 0, Math.PI * 2);
        ctx.fill();

        canvas.refresh();
      }
    }

    // Treasure Chest
    if (!tm.exists('prop_treasure_chest')) {
      const canvas = tm.createCanvas('prop_treasure_chest', 46, 38);
      if (canvas) {
        const ctx = canvas.getContext();
        // Wood chest
        ctx.fillStyle = '#78350f';
        ctx.fillRect(6, 12, 34, 22);
        // Domed lid
        ctx.beginPath();
        ctx.ellipse(23, 14, 17, 8, 0, Math.PI, 0);
        ctx.fill();
        // Golden bands & lock
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(11, 8, 4, 26);
        ctx.fillRect(31, 8, 4, 26);
        ctx.fillRect(20, 18, 6, 6);
        canvas.refresh();
      }
    }

    // Pine Tree
    if (!tm.exists('prop_tree')) {
      const canvas = tm.createCanvas('prop_tree', 50, 75);
      if (canvas) {
        const ctx = canvas.getContext();
        // Trunk
        ctx.fillStyle = '#713f12';
        ctx.fillRect(21, 55, 8, 16);
        // Foliage layers
        ctx.fillStyle = '#1e3a1f';
        ctx.beginPath();
        ctx.moveTo(25, 6);
        ctx.lineTo(46, 60);
        ctx.lineTo(4, 60);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2d5a2e';
        ctx.beginPath();
        ctx.moveTo(25, 8);
        ctx.lineTo(42, 45);
        ctx.lineTo(8, 45);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3f7c41';
        ctx.beginPath();
        ctx.moveTo(25, 10);
        ctx.lineTo(38, 30);
        ctx.lineTo(12, 30);
        ctx.closePath();
        ctx.fill();

        canvas.refresh();
      }
    }

    // Cottage
    if (!tm.exists('prop_cottage')) {
      const canvas = tm.createCanvas('prop_cottage', 90, 80);
      if (canvas) {
        const ctx = canvas.getContext();
        // Stone & timber base
        ctx.fillStyle = '#d6d3d1';
        ctx.fillRect(14, 34, 62, 40);
        // Timber beams
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 3;
        ctx.strokeRect(14, 34, 62, 40);
        ctx.beginPath();
        ctx.moveTo(45, 34);
        ctx.lineTo(45, 74);
        ctx.stroke();

        // Blue shingle roof
        ctx.fillStyle = '#1d4ed8';
        ctx.beginPath();
        ctx.moveTo(45, 8);
        ctx.lineTo(84, 36);
        ctx.lineTo(6, 36);
        ctx.closePath();
        ctx.fill();

        // Glowing warm window
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(24, 46, 12, 12);

        canvas.refresh();
      }
    }

    // Palisade
    if (!tm.exists('prop_palisade')) {
      const canvas = tm.createCanvas('prop_palisade', 50, 40);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = '#78350f';
        for (let i = 0; i < 5; i++) {
          const x = 5 + i * 8;
          ctx.beginPath();
          ctx.moveTo(x + 4, 4);
          ctx.lineTo(x + 8, 12);
          ctx.lineTo(x + 8, 38);
          ctx.lineTo(x, 38);
          ctx.lineTo(x, 12);
          ctx.closePath();
          ctx.fill();
        }
        // Rope lashings
        ctx.fillStyle = '#d97706';
        ctx.fillRect(4, 22, 42, 3);
        canvas.refresh();
      }
    }

    // Road marker stone
    if (!tm.exists('prop_marker')) {
      const canvas = tm.createCanvas('prop_marker', 30, 42);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(15, 4);
        ctx.lineTo(26, 14);
        ctx.lineTo(24, 38);
        ctx.lineTo(6, 38);
        ctx.lineTo(4, 14);
        ctx.closePath();
        ctx.fill();
        // Carved tree glyph
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(14, 14, 2, 14);
        ctx.fillRect(10, 18, 10, 2);
        canvas.refresh();
      }
    }
  }

  // --- PROJECTILES ---
  private static createProjectileTextures(tm: Phaser.Textures.TextureManager): void {
    // Arrow
    if (!tm.exists('proj_arrow')) {
      const canvas = tm.createCanvas('proj_arrow', 24, 6);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = '#92400e'; // shaft
        ctx.fillRect(4, 2, 16, 2);
        ctx.fillStyle = '#cbd5e1'; // arrowhead
        ctx.beginPath();
        ctx.moveTo(24, 3);
        ctx.lineTo(18, 0);
        ctx.lineTo(18, 6);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#38bdf8'; // blue fletching
        ctx.fillRect(2, 0, 4, 6);
        canvas.refresh();
      }
    }

    // Arcane Bolt
    if (!tm.exists('proj_magic')) {
      const canvas = tm.createCanvas('proj_magic', 16, 16);
      if (canvas) {
        const ctx = canvas.getContext();
        const grad = ctx.createRadialGradient(8, 8, 1, 8, 8, 7);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, '#38bdf8');
        grad.addColorStop(1, '#6366f1');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(8, 8, 7, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }

    // Cannonball
    if (!tm.exists('proj_cannonball')) {
      const canvas = tm.createCanvas('proj_cannonball', 14, 14);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(7, 7, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(5, 5, 2, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }
  }

  // --- VFX & PARTICLES ---
  private static createVfxTextures(tm: Phaser.Textures.TextureManager): void {
    // Explosion shockwave
    if (!tm.exists('vfx_explosion_ring')) {
      const canvas = tm.createCanvas('vfx_explosion_ring', 64, 64);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(32, 32, 28, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(32, 32, 16, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }

    // Spark
    if (!tm.exists('vfx_spark')) {
      const canvas = tm.createCanvas('vfx_spark', 8, 8);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(4, 4, 3, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }

    // Heal Green Cross
    if (!tm.exists('vfx_heal_cross')) {
      const canvas = tm.createCanvas('vfx_heal_cross', 12, 12);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(4, 1, 4, 10);
        ctx.fillRect(1, 4, 10, 4);
        canvas.refresh();
      }
    }

    // Footstep Dust
    if (!tm.exists('vfx_dust')) {
      const canvas = tm.createCanvas('vfx_dust', 16, 16);
      if (canvas) {
        const ctx = canvas.getContext();
        const grad = ctx.createRadialGradient(8, 8, 1, 8, 8, 8);
        grad.addColorStop(0, 'rgba(217, 180, 130, 0.7)');
        grad.addColorStop(0.5, 'rgba(180, 145, 100, 0.4)');
        grad.addColorStop(1, 'rgba(180, 145, 100, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(8, 8, 8, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }

    // Smoke Puff (Chimney & Cannon)
    if (!tm.exists('vfx_smoke')) {
      const canvas = tm.createCanvas('vfx_smoke', 24, 24);
      if (canvas) {
        const ctx = canvas.getContext();
        const grad = ctx.createRadialGradient(12, 12, 2, 12, 12, 12);
        grad.addColorStop(0, 'rgba(240, 240, 245, 0.8)');
        grad.addColorStop(0.6, 'rgba(200, 205, 215, 0.4)');
        grad.addColorStop(1, 'rgba(160, 165, 175, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(12, 12, 12, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }

    // Torch Flame
    if (!tm.exists('vfx_flame')) {
      const canvas = tm.createCanvas('vfx_flame', 12, 18);
      if (canvas) {
        const ctx = canvas.getContext();
        const grad = ctx.createRadialGradient(6, 12, 1, 6, 9, 8);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.4, '#f97316');
        grad.addColorStop(0.9, '#dc2626');
        grad.addColorStop(1, 'rgba(220, 38, 38, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(6, 9, 5, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }

    // Water Foam & Splash
    if (!tm.exists('vfx_water_foam')) {
      const canvas = tm.createCanvas('vfx_water_foam', 14, 14);
      if (canvas) {
        const ctx = canvas.getContext();
        const grad = ctx.createRadialGradient(7, 7, 1, 7, 7, 7);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, 'rgba(186, 230, 253, 0.8)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(7, 7, 7, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }

    // Portal Vortex Spiral
    if (!tm.exists('vfx_portal_vortex')) {
      const canvas = tm.createCanvas('vfx_portal_vortex', 80, 80);
      if (canvas) {
        const ctx = canvas.getContext();
        const grad = ctx.createRadialGradient(40, 40, 4, 40, 40, 40);
        grad.addColorStop(0, '#f5d0fe');
        grad.addColorStop(0.3, '#c084fc');
        grad.addColorStop(0.6, '#7e22ce');
        grad.addColorStop(0.9, '#3b0764');
        grad.addColorStop(1, 'rgba(59, 7, 100, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(40, 40, 40, 0, Math.PI * 2);
        ctx.fill();

        // Spiral energy arms
        ctx.strokeStyle = '#e879f9';
        ctx.lineWidth = 2.5;
        for (let a = 0; a < 3; a++) {
          ctx.beginPath();
          for (let r = 8; r < 36; r += 2) {
            const th = (a * (Math.PI * 2) / 3) + (r * 0.15);
            const x = 40 + Math.cos(th) * r;
            const y = 40 + Math.sin(th) * r;
            if (r === 8) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        canvas.refresh();
      }
    }

    // Shimmer Sparkle (for gold chest & crystals)
    if (!tm.exists('vfx_shimmer')) {
      const canvas = tm.createCanvas('vfx_shimmer', 16, 16);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(10, 6);
        ctx.lineTo(16, 8);
        ctx.lineTo(10, 10);
        ctx.lineTo(8, 16);
        ctx.lineTo(6, 10);
        ctx.lineTo(0, 8);
        ctx.lineTo(6, 6);
        ctx.closePath();
        ctx.fill();
        canvas.refresh();
      }
    }
  }

  private static createRadialButtonTextures(tm: Phaser.Textures.TextureManager): void {
    const buttons = [
      { key: 'btn_radial_archer', color: '#38bdf8', cost: '80', type: 'archer' },
      { key: 'btn_radial_barracks', color: '#60a5fa', cost: '90', type: 'barracks' },
      { key: 'btn_radial_mage', color: '#c084fc', cost: '110', type: 'mage' },
      { key: 'btn_radial_cannon', color: '#fb923c', cost: '125', type: 'cannon' }
    ];

    buttons.forEach((b) => {
      if (tm.exists(b.key)) return;
      const canvas = tm.createCanvas(b.key, 48, 54);
      if (!canvas) return;
      const ctx = canvas.getContext();

      // Circular button background
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(24, 20, 18, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Icon
      if (b.type === 'archer') {
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(24, 20, 9, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(18, 19, 12, 2);
      } else if (b.type === 'barracks') {
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.moveTo(18, 13);
        ctx.lineTo(30, 13);
        ctx.lineTo(30, 23);
        ctx.lineTo(24, 27);
        ctx.lineTo(18, 23);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(23, 16, 2, 8);
      } else if (b.type === 'mage') {
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.moveTo(24, 11);
        ctx.lineTo(30, 19);
        ctx.lineTo(24, 27);
        ctx.lineTo(18, 19);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(22, 15, 3, 4);
      } else if (b.type === 'cannon') {
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(24, 20, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#09090b';
        ctx.beginPath();
        ctx.arc(24, 20, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Gold cost pill at bottom
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.roundRect(8, 38, 32, 13, 4);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${b.cost}g`, 24, 44);

      canvas.refresh();
    });

    // Create Base Rally Point button
    if (!tm.exists('btn_radial_rally')) {
      const canvas = tm.createCanvas('btn_radial_rally', 52, 56);
      if (canvas) {
        const ctx = canvas.getContext();
        // Circle
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(26, 20, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Flag icon
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(21, 10);
        ctx.lineTo(21, 29);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(21, 11);
        ctx.lineTo(32, 16);
        ctx.lineTo(21, 21);
        ctx.closePath();
        ctx.fill();

        // Bottom label pill
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.roundRect(8, 38, 36, 14, 4);
        ctx.fill();
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#93c5fd';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('RALLY', 26, 45);

        canvas.refresh();
      }
    }

    // Pre-cache all possible upgrade costs so no runtime canvas allocation happens during battle
    const commonUpgradeCosts = [null, 110, 140, 150, 160, 200, 220];
    commonUpgradeCosts.forEach((cost) => {
      this.getOrCreateUpgradeButtonTexture(tm, cost);
    });

    // Pre-cache common refund values (70% of cumulative invested gold)
    const commonRefunds = [56, 63, 77, 87, 133, 140, 175, 192, 245, 252, 259, 315, 346];
    commonRefunds.forEach((refund) => {
      this.getOrCreateSellButtonTexture(tm, refund);
    });
  }

  public static getOrCreateUpgradeButtonTexture(tm: Phaser.Textures.TextureManager, cost: number | null): string {
    const key = cost === null ? 'btn_radial_upgrade_max' : `btn_radial_upgrade_${cost}`;
    if (tm.exists(key)) return key;

    const canvas = tm.createCanvas(key, 52, 56);
    if (!canvas) return key;
    const ctx = canvas.getContext();

    // Circle background
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(26, 20, 18, 0, Math.PI * 2);
    ctx.fill();

    // Border
    ctx.strokeStyle = cost === null ? '#eab308' : '#22c55e';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Upgrade arrow icon
    ctx.fillStyle = cost === null ? '#facc15' : '#4ade80';
    ctx.beginPath();
    ctx.moveTo(26, 11);
    ctx.lineTo(34, 19);
    ctx.lineTo(29, 19);
    ctx.lineTo(29, 27);
    ctx.lineTo(23, 27);
    ctx.lineTo(23, 19);
    ctx.lineTo(18, 19);
    ctx.closePath();
    ctx.fill();

    // Bottom pill
    if (cost === null) {
      // MAX label
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.roundRect(10, 38, 32, 14, 4);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('MAX', 26, 45);
    } else {
      // Cost label
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.roundRect(8, 38, 36, 14, 4);
      ctx.fill();
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#a7f3d0';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${cost}g`, 26, 45);
    }

    canvas.refresh();
    return key;
  }

  public static getOrCreateSellButtonTexture(tm: Phaser.Textures.TextureManager, refund: number): string {
    const key = `btn_radial_sell_${refund}`;
    if (tm.exists(key)) return key;

    const canvas = tm.createCanvas(key, 52, 56);
    if (!canvas) return key;
    const ctx = canvas.getContext();

    // Circle background
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(26, 20, 18, 0, Math.PI * 2);
    ctx.fill();

    // Border
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Coin icon
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(24, 18, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(28, 22, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fcd34d';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Bottom pill with refund
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.roundRect(6, 38, 40, 14, 4);
    ctx.fill();
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#fecaca';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`+${refund}g`, 26, 45);

    canvas.refresh();
    return key;
  }

  private static createAlchemyTowerTextures(tm: Phaser.Textures.TextureManager): void {
    const levels = [
      { key: 'tower_alchemy_l1', flaskColor: '#10b981', trim: '#6ee7b7' },
      { key: 'tower_alchemy_l2', flaskColor: '#14b8a6', trim: '#5eead4' },
      { key: 'tower_alchemy_l3', flaskColor: '#8b5cf6', trim: '#facc15' }
    ];

    for (const lvl of levels) {
      if (tm.exists(lvl.key)) continue;
      const canvas = tm.createCanvas(lvl.key, 96, 110);
      if (!canvas) continue;
      const ctx = canvas.getContext();

      // Stone base foundation
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(14, 76, 68, 28, 6);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Copper chamber
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.roundRect(22, 42, 52, 38, 8);
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Distillation flask
      ctx.fillStyle = lvl.flaskColor;
      ctx.beginPath();
      ctx.arc(48, 56, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = lvl.trim;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Bubbles
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(44, 52, 3, 0, Math.PI * 2);
      ctx.arc(52, 58, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Flue pipe
      ctx.fillStyle = '#92400e';
      ctx.fillRect(42, 16, 12, 28);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.strokeRect(42, 16, 12, 28);

      // Vapor
      ctx.fillStyle = lvl.trim;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(48, 12, 8, 0, Math.PI * 2);
      ctx.arc(44, 6, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;

      canvas.refresh();
    }
  }

  private static createNewEnemyTextures(tm: Phaser.Textures.TextureManager): void {
    // 1. Sapper
    if (!tm.exists('enemy_sapper')) {
      const c = tm.createCanvas('enemy_sapper', 48, 48);
      if (c) {
        const ctx = c.getContext();
        // Green goblin head
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(18, 20, 10, 0, Math.PI * 2);
        ctx.fill();

        // Red bandana
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(10, 12, 16, 6);

        // Big black gunpowder barrel carried on back
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(22, 14, 20, 24, 4);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Burning fuse spark
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(32, 10, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(32, 10, 2, 0, Math.PI * 2);
        ctx.fill();

        c.refresh();
      }
    }

    // 2. Mountain Troll
    if (!tm.exists('enemy_troll')) {
      const c = tm.createCanvas('enemy_troll', 64, 64);
      if (c) {
        const ctx = c.getContext();
        // Big grey-blue troll torso
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.ellipse(32, 34, 22, 24, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Head with jaw
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(32, 18, 14, 0, Math.PI * 2);
        ctx.fill();

        // Glowing yellow eyes
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(28, 16, 2.5, 0, Math.PI * 2);
        ctx.arc(36, 16, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Wooden club with iron band
        ctx.fillStyle = '#78350f';
        ctx.fillRect(48, 16, 10, 36);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(47, 20, 12, 5);

        c.refresh();
      }
    }

    // 3. Troll King (Boss)
    if (!tm.exists('enemy_troll_king')) {
      const c = tm.createCanvas('enemy_troll_king', 96, 96);
      if (c) {
        const ctx = c.getContext();
        // Colossal muscular torso
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.ellipse(48, 54, 34, 36, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Spiked shoulder pauldron
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(20, 42, 14, 0, Math.PI * 2);
        ctx.arc(76, 42, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Head
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(48, 28, 20, 0, Math.PI * 2);
        ctx.fill();

        // Spiked Iron Crown with rubies
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(32, 22);
        ctx.lineTo(36, 8);
        ctx.lineTo(42, 16);
        ctx.lineTo(48, 4);
        ctx.lineTo(54, 16);
        ctx.lineTo(60, 8);
        ctx.lineTo(64, 22);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Ruby in center of crown
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(48, 16, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Glowing red eyes
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(42, 26, 3.5, 0, Math.PI * 2);
        ctx.arc(54, 26, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Great War Warhammer
        ctx.fillStyle = '#92400e';
        ctx.fillRect(74, 24, 12, 60);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(64, 16, 32, 20);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(64, 16, 32, 20);

        c.refresh();
      }
    }
  }

  private static createHeroTextures(tm: Phaser.Textures.TextureManager): void {
    if (tm.exists('hero_commander')) return;
    const c = tm.createCanvas('hero_commander', 64, 64);
    if (!c) return;
    const ctx = c.getContext();

    // Royal Blue Cape flowing
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.moveTo(22, 24);
    ctx.lineTo(12, 56);
    ctx.lineTo(44, 56);
    ctx.lineTo(42, 24);
    ctx.closePath();
    ctx.fill();

    // Steel Plate Armor Torso
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.roundRect(24, 22, 22, 26, 4);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Golden lion crest on chest
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(35, 34, 4, 0, Math.PI * 2);
    ctx.fill();

    // Knight Helm with blue plume
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(35, 16, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(32, 4, 6, 8);

    // Lion Shield in left hand
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.moveTo(14, 26);
    ctx.lineTo(26, 26);
    ctx.lineTo(24, 44);
    ctx.lineTo(20, 48);
    ctx.lineTo(16, 44);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Broadsword in right hand
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(46, 12, 4, 38);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(42, 34, 12, 4);

    c.refresh();
  }

  private static createSpellAndVfxTextures(tm: Phaser.Textures.TextureManager): void {
    // 1. Acid Flask projectile
    if (!tm.exists('proj_acid_flask')) {
      const c = tm.createCanvas('proj_acid_flask', 24, 24);
      if (c) {
        const ctx = c.getContext();
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(12, 14, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = '#d1fae5';
        ctx.fillRect(10, 4, 4, 6);
        c.refresh();
      }
    }

    // 2. Acid Pool VFX
    if (!tm.exists('vfx_acid_pool')) {
      const c = tm.createCanvas('vfx_acid_pool', 64, 64);
      if (c) {
        const ctx = c.getContext();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.45)';
        ctx.beginPath();
        ctx.ellipse(32, 32, 28, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#6ee7b7';
        ctx.beginPath();
        ctx.arc(24, 30, 4, 0, Math.PI * 2);
        ctx.arc(38, 34, 3, 0, Math.PI * 2);
        ctx.fill();
        c.refresh();
      }
    }

    // 3. Meteor projectile
    if (!tm.exists('proj_meteor')) {
      const c = tm.createCanvas('proj_meteor', 48, 48);
      if (c) {
        const ctx = c.getContext();
        const grad = ctx.createRadialGradient(24, 24, 4, 24, 24, 22);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.3, '#f97316');
        grad.addColorStop(0.7, '#ef4444');
        grad.addColorStop(1, '#450a0a');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(24, 24, 20, 0, Math.PI * 2);
        ctx.fill();
        c.refresh();
      }
    }
  }

  private static createMapBackgroundTextures(tm: Phaser.Textures.TextureManager): void {
    // 1. Village Crossing (1280x720)
    if (!tm.exists('map_village_crossing_bg')) {
      const c = tm.createCanvas('map_village_crossing_bg', 1280, 720);
      if (c) {
        const ctx = c.getContext();
        // Meadow background
        ctx.fillStyle = '#3a6634';
        ctx.fillRect(0, 0, 1280, 720);

        // Village paths (horizontal road and crossroads)
        ctx.fillStyle = '#8b6f4e';
        ctx.beginPath();
        ctx.moveTo(0, 330);
        ctx.lineTo(1280, 330);
        ctx.lineTo(1280, 390);
        ctx.lineTo(0, 390);
        ctx.fill();

        // Curved northern bypass
        ctx.beginPath();
        ctx.ellipse(550, 210, 260, 90, 0, 0, Math.PI * 2);
        ctx.lineWidth = 45;
        ctx.strokeStyle = '#8b6f4e';
        ctx.stroke();

        // Cobblestone accents
        ctx.fillStyle = '#785f40';
        for (let x = 30; x < 1250; x += 60) {
          ctx.fillRect(x, 345, 12, 10);
        }

        // Village thatched houses
        const houses = [
          { x: 180, y: 150 },
          { x: 740, y: 120 },
          { x: 340, y: 520 },
          { x: 880, y: 500 }
        ];
        for (const h of houses) {
          ctx.fillStyle = '#78350f';
          ctx.fillRect(h.x, h.y + 20, 80, 60);
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.moveTo(h.x - 10, h.y + 20);
          ctx.lineTo(h.x + 40, h.y - 15);
          ctx.lineTo(h.x + 90, h.y + 20);
          ctx.closePath();
          ctx.fill();
        }

        c.refresh();
      }
    }

    // 2. Old Stone Bridge (1280x720)
    if (!tm.exists('map_stone_bridge_bg')) {
      const c = tm.createCanvas('map_stone_bridge_bg', 1280, 720);
      if (c) {
        const ctx = c.getContext();
        // Grassland
        ctx.fillStyle = '#365e30';
        ctx.fillRect(0, 0, 1280, 720);

        // River flowing through center
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.moveTo(600, 0);
        ctx.bezierCurveTo(560, 240, 720, 480, 680, 720);
        ctx.lineTo(760, 720);
        ctx.bezierCurveTo(800, 480, 640, 240, 680, 0);
        ctx.closePath();
        ctx.fill();

        // Road across bridge
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(120, 100);
        ctx.lineTo(550, 360);
        ctx.lineTo(730, 360);
        ctx.lineTo(1160, 640);
        ctx.lineWidth = 55;
        ctx.strokeStyle = '#64748b';
        ctx.stroke();

        // Massive stone bridge piers
        ctx.fillStyle = '#475569';
        ctx.fillRect(560, 315, 160, 90);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 4;
        ctx.strokeRect(560, 315, 160, 90);

        c.refresh();
      }
    }

    // 3. Crystal Grove (1280x720)
    if (!tm.exists('map_crystal_grove_bg')) {
      const c = tm.createCanvas('map_crystal_grove_bg', 1280, 720);
      if (c) {
        const ctx = c.getContext();
        // Twilight forest floor
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, 1280, 720);

        // Glowing moss trail
        ctx.fillStyle = '#065f46';
        ctx.beginPath();
        ctx.moveTo(100, 550);
        ctx.bezierCurveTo(400, 550, 420, 200, 650, 200);
        ctx.bezierCurveTo(800, 200, 800, 520, 1000, 400);
        ctx.lineTo(1200, 180);
        ctx.lineWidth = 50;
        ctx.strokeStyle = '#047857';
        ctx.stroke();

        // Glowing crystal spires
        const crystals = [
          { x: 320, y: 190, color: '#38bdf8' },
          { x: 880, y: 590, color: '#a855f7' },
          { x: 620, y: 350, color: '#38bdf8' }
        ];
        for (const cry of crystals) {
          ctx.fillStyle = cry.color;
          ctx.beginPath();
          ctx.moveTo(cry.x, cry.y - 30);
          ctx.lineTo(cry.x + 12, cry.y + 10);
          ctx.lineTo(cry.x - 12, cry.y + 10);
          ctx.closePath();
          ctx.fill();
        }

        c.refresh();
      }
    }

    // 4. Broken Mill (1280x720)
    if (!tm.exists('map_broken_mill_bg')) {
      const c = tm.createCanvas('map_broken_mill_bg', 1280, 720);
      if (c) {
        const ctx = c.getContext();
        ctx.fillStyle = '#2d5328';
        ctx.fillRect(0, 0, 1280, 720);

        // River
        ctx.fillStyle = '#1e40af';
        ctx.beginPath();
        ctx.moveTo(450, 0);
        ctx.bezierCurveTo(460, 300, 580, 400, 600, 720);
        ctx.lineTo(670, 720);
        ctx.bezierCurveTo(650, 400, 530, 300, 520, 0);
        ctx.closePath();
        ctx.fill();

        // Mill building
        ctx.fillStyle = '#5c3a21';
        ctx.fillRect(660, 240, 90, 80);
        // Waterwheel
        ctx.fillStyle = '#3e2716';
        ctx.beginPath();
        ctx.arc(655, 280, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Winding road
        ctx.fillStyle = '#7a6042';
        ctx.beginPath();
        ctx.moveTo(120, 160);
        ctx.bezierCurveTo(480, 160, 520, 480, 740, 480);
        ctx.bezierCurveTo(860, 480, 900, 240, 1200, 560);
        ctx.lineWidth = 45;
        ctx.strokeStyle = '#7a6042';
        ctx.stroke();

        c.refresh();
      }
    }

    // 5. Troll Pass (1280x720)
    if (!tm.exists('map_troll_pass_bg')) {
      const c = tm.createCanvas('map_troll_pass_bg', 1280, 720);
      if (c) {
        const ctx = c.getContext();
        // Rocky granite mountain canyon
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, 1280, 720);

        // Jagged mountain cliff edges
        ctx.fillStyle = '#334155';
        for (let i = 0; i < 15; i++) {
          ctx.beginPath();
          ctx.moveTo(i * 90, 0);
          ctx.lineTo(i * 90 + 45, 120 + Math.sin(i) * 30);
          ctx.lineTo(i * 90 + 90, 0);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(i * 90, 720);
          ctx.lineTo(i * 90 + 45, 600 - Math.sin(i) * 30);
          ctx.lineTo(i * 90 + 90, 720);
          ctx.fill();
        }

        // Rugged rocky road
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(120, 140);
        ctx.bezierCurveTo(360, 320, 540, 420, 740, 340);
        ctx.bezierCurveTo(880, 240, 1020, 320, 1200, 520);
        ctx.lineWidth = 55;
        ctx.strokeStyle = '#475569';
        ctx.stroke();

        // Grand Bastion Gates at exit (1200, 520)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(1160, 460, 40, 120);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.strokeRect(1160, 460, 40, 120);

        c.refresh();
      }
    }
  }
}
