import Phaser from 'phaser';
import { BootScene } from './scenes/bootScene';
import { PreloadScene } from './scenes/preloadScene';
import { BattleScene } from './scenes/battleScene';

export function createPhaserGame(parent: HTMLElement): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    width: 1280,
    height: 720,
    backgroundColor: '#0b0f14',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    },
    scene: [BootScene, PreloadScene, BattleScene]
  };

  return new Phaser.Game(config);
}
