import Phaser = require("phaser");

// https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Matter.Image.html
export interface IFruitConstructor {
  world: Phaser.Physics.Matter.World;
  x: number;
  y: number;
  texture?: string;
  frame?: string | number;
  options?: Phaser.Types.Physics.Matter.MatterBodyConfig;
}
