import {GameScene} from './scenes/game-scene';
import {BootScene} from './scenes/boot-scene';
import {CONST} from './const';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Alpha Adjust',
  url: 'https://github.com/digitsensitive/phaser3-typescript',
  version: '2.0',
  type: Phaser.AUTO,
  parent: 'game',
  scene: [BootScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game-wrapper',
    width: CONST.canvasWidth,
    height: CONST.canvasHeight,
  },
  input: {
    mouse: true
  },
  backgroundColor: '#d6d3d1',
  render: {pixelArt: false, antialias: true}
};
