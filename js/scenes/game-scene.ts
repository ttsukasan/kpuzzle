import {CloneCrystal} from '../objects/clone-crystal';
import {OriginalCrystal} from '../objects/original-crystal';
import {CONST} from '../const/const';
import {Fruit} from "../objects/fruit";

export class GameScene extends Phaser.Scene {
  private cloneCrystal: CloneCrystal;
  private originalCrystal: OriginalCrystal;
  private playerHasClicked: boolean;
  private alphaDifferenceText: Phaser.GameObjects.Text;
  private feedbackText: Phaser.GameObjects.Text;

  private fruits: Phaser.Physics.Matter.Image[] = [];

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  preload(): void {
    this.load.image('crystal', CONST.imgPath.crystal);
    this.load.image('ball-pink', CONST.imgPath.ballPink);
    this.load.image('ball_01', CONST.imgPath.ball01);
    this.load.image('ball_02', CONST.imgPath.ball02);
    this.load.image('ball_03', CONST.imgPath.ball03);
    this.load.image('ball_04', CONST.imgPath.ball04);

  }

  init(): void {
    this.playerHasClicked = false;
    this.alphaDifferenceText = null;
    this.feedbackText = null;
  }

  create(): void {
    this.matter.world.setBounds(0, 0, CONST.canvasWidth, CONST.canvasHeight, 32, true, true, false, true);
    for (let i = 0; i < 3; i++) {
      this.fruits.push(new Fruit(
        0, {
          world: this.matter.world,
          x: Phaser.Math.Between(50, 350),
          y: Phaser.Math.Between(10, 50)
        }
      ))
    }

    this.matter.world.on("collisionstart", function (event, bodyA, bodyB) {
      if (bodyA.gameObject instanceof Fruit && bodyB.gameObject instanceof Fruit) {
        let [fruitA, fruitB] = [bodyA.gameObject, bodyB.gameObject];
        if ((fruitA.rank === fruitB.rank) && fruitA.isRankUpable() && (fruitA.state === "normal" && fruitB.state === "normal")) {
          console.log("衝突した", bodyA.gameObject, bodyB.gameObject);
          if (fruitA.y < fruitB.y){
            fruitA = bodyB.gameObject;
            fruitB = bodyA.gameObject;
          }
          let posX = (fruitA.x + fruitB.x) / 2;
          let posY = (fruitA.y + fruitB.y) / 2;
          fruitB.workOut();
          fruitA.rankUp();
          fruitA.setPosition(posX,posY)
          // 現在接しているものについてもう一度判定
          console.log("collideIndexes", fruitA.collideIndexes)
        }
      }
    })
    // this.matter.world.on("collisionactive", function (event, bodyA, bodyB) {
    //   if (bodyA.gameObject instanceof Fruit && bodyB.gameObject instanceof Fruit) {
    //     console.log("衝突中", bodyA.gameObject, bodyB.gameObject);
    //     let [fruitA, fruitB] = [bodyA.gameObject, bodyB.gameObject];
    //     if ((fruitA.rank === fruitB.rank) && fruitA.rank < 4 && (fruitA.state === "normal" && fruitB.state === "normal")) {
    //       if (fruitA.y < fruitB.y){
    //         fruitA = bodyB.gameObject;
    //         fruitB = bodyA.gameObject;
    //       }
    //       fruitB.workOut();
    //       fruitA.rankUp();
    //       fruitA.setX(10);
    //       fruitA.setY(10);
    //       // 現在接しているものについてもう一度判定
    //       console.log("collideIndexes", fruitA.collideIndexes)
    //     }
    //   }
    // })

    // クリックイベント
    this.input.on(
      'pointerup',
      function (event: Phaser.Input.Pointer){
        console.log("クリック", event);
        this.fruits.push(new Fruit(
          0, {
            world: this.matter.world,
            x: event.upX,
            y: event.upY
          }
        ));
        // if (!this.playerHasClicked) {
        //   this.playerHasClicked = true;
        // } else {
        //   this.scene.start('GameScene');
        // }
      },
      this
    );
  }

  update(): void {
    // if (!this.playerHasClicked) {
    //   this.cloneCrystal.update();
    // } else {
    //   let difference = this.calculateAlphaDifference();
    //   this.createResultTexts(difference);
    // }
  }

  private calculateAlphaDifference(): number {
    return Math.abs(this.cloneCrystal.alpha - this.originalCrystal.alpha);
  }

  private createResultTexts(difference: number): void {
    this.alphaDifferenceText = this.add.text(
      this.sys.canvas.width / 2 - 100,
      this.sys.canvas.height / 2 + 100,
      difference.toFixed(2) + '',
      {
        fontFamily: 'Arial',
        fontSize: 100 + 'px',
        stroke: '#000000',
        strokeThickness: 8,
        color: '#ffffff'
      }
    );

    let textConfig: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Arial',
      fontSize: 50 + 'px',
      stroke: '#000000',
      strokeThickness: 8,
      color: '#ffffff'
    };

    if (difference >= 0.5) {
      this.feedbackText = this.add.text(
        this.sys.canvas.width / 2 - 250,
        this.sys.canvas.height / 2 - 150,
        'You can do better!',
        textConfig
      );
    } else if (difference < 0.5 && difference >= 0.3) {
      this.feedbackText = this.add.text(
        this.sys.canvas.width / 2 - 40,
        this.sys.canvas.height / 2 - 150,
        'OK!',
        textConfig
      );
    } else if (difference < 0.3 && difference >= 0.1) {
      this.feedbackText = this.add.text(
        this.sys.canvas.width / 2 - 90,
        this.sys.canvas.height / 2 - 150,
        'Great!',
        textConfig
      );
    } else if (difference < 0.1) {
      this.feedbackText = this.add.text(
        this.sys.canvas.width / 2 - 145,
        this.sys.canvas.height / 2 - 150,
        'Wonderful!',
        textConfig
      );
    }
  }
}
