// @ts-ignore
import Phaser from 'phaser';
import {CONST} from "../const";

export class BootScene extends Phaser.Scene {

  constructor() {
    super({
      key: 'BootScene'
    });
  }

  preload(): void {
    this.load.spritesheet("background", CONST.imgUrl.background, {
      frameWidth: CONST.PIECE_WIDTH, frameHeight: CONST.PIECE_HEIGHT
    });
    this.load.spritesheet("blank", CONST.imgUrl.blank, {
      frameWidth: CONST.PIECE_WIDTH, frameHeight: CONST.PIECE_HEIGHT
    })
  }

  init(): void {
    // ..
  }

  create(): void {
    // ..
  }

  update(): void {
    // ..
    this.scene.start('GameScene');
  }


}
