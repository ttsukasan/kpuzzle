import {IFruitConstructor} from "../interfaces/fruit.interface";
import {CONST} from "../const/const";

export class Fruit extends Phaser.Physics.Matter.Image {
  rank: number;


  constructor(rank: number, aParams: IFruitConstructor) {
    super(aParams.world, aParams.x, aParams.y, aParams.texture);
    // this.rank = rank;
    // console.log(this.displayHeight, this.displayOriginY, this.displayWidth / this.calsBallDiameter(), );
    //
    // this.setTexture(this.calcBallTexture());
    // this.setScale(this.calsBallDiameter() / 512);
    // this.setCircle(this.calsBallDiameter() / 2);
    this.setState("normal");
    this.setRank(rank);
    this.setBounce(0.7)
    this.setFriction(-0);
    this.world.scene.add.existing(this);
    // this.setStatic(true);
  }

  update(): void {
  }

  rankUp(): void {
    this.setRank(this.rank + 1)
  }

  isRankUpable(): boolean {
    return this.rank < CONST.rankConfig.length - 1;
  }

  setRank(rank: number): void {
    if (rank >= CONST.rankConfig.length) {
      console.warn("rankを超えています", rank);
      return;
    }
    // let tmpY = this.y
    this.rank = rank;
    this.setTexture(this.calcBallTexture());
    this.setScale(this.calsBallDiameter() / 512);
    this.setCircle(this.calsBallDiameter() / 2);
    // this.setY(tmpY);


    // this.setFrictionAir(0)
    // this.setFrictionStatic(0)
  }

  workOut(): void {
    this.setState("removed")
    this.destroy()
  }

  private calcBallTexture(): string {
    return CONST.rankConfig[this.rank]["texture"] || "";
  }

  private calsBallDiameter(): number {
    return CONST.rankConfig[this.rank]["diameter"] || 30;
  }
}
