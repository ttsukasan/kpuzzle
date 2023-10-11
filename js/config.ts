import {GameScene} from './scenes/game-scene';
import {CONST} from "./const/const";

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Alpha Adjust',
  url: 'https://github.com/digitsensitive/phaser3-typescript',
  version: '2.0',
  type: Phaser.AUTO,
  parent: 'game',
  scene: [GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game-wrapper',
    width: CONST.canvasWidth,
    height: CONST.canvasHeight,
  },
  input: {
    mouse: true
  },
  physics: {
    default: 'matter',
    matter: {
      enableSleeping: true
    }
  },
  backgroundColor: '#ffffee',
  render: {pixelArt: false, antialias: true}
};
