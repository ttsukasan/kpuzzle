// @ts-ignore
import Phaser from 'phaser';
import {CONST} from "../const";
import config = require("tailwindcss/defaultConfig");


export class GameScene extends Phaser.Scene {
  private piecesGroup: Phaser.GameObjects.Group;
  private piecesAmount: number;
  private shuffledIndexArray: number[];

  BOARD_COLS: number;
  BOARD_ROWS: number;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  preload(): void {
    // ..
    // this.game.load.spritesheet("background", CONST.imgUrl.background, CONST.PIECE_WIDTH, CONST.PIECE_HEIGHT);
    this.load.spritesheet("background", CONST.imgUrl.background, {
      frameWidth: CONST.PIECE_WIDTH, frameHeight: CONST.PIECE_HEIGHT
    });
  }

  init(): void {
    // ..
  }

  create(): void {
    // ..
    this.prepareBoard();
    console.log(this)
  }

  update(): void {
    // ..
  }

  prepareBoard(): void {

    var piecesIndex = 0,
      i, j,
      piece;

    this.BOARD_COLS = Math.floor(CONST.SUBJECT_WIDTH / CONST.PIECE_WIDTH);
    this.BOARD_ROWS = Math.floor(CONST.SUBJECT_HEIGHT / CONST.PIECE_HEIGHT);

    this.piecesAmount = this.BOARD_COLS * this.BOARD_ROWS;
    this.shuffledIndexArray = this.createShuffledIndexArray();

    this.piecesGroup = this.add.group();

    for (i = 0; i < this.BOARD_ROWS; i++) {
      for (j = 0; j < this.BOARD_COLS; j++) {
        const x = j * CONST.PIECE_WIDTH + CONST.PIECE_WIDTH / 2;
        const y = i * CONST.PIECE_HEIGHT + CONST.PIECE_HEIGHT / 2;
        if (this.shuffledIndexArray[piecesIndex]) {
          piece = this.piecesGroup.create(x, y, "background", this.shuffledIndexArray[piecesIndex]);
        } else { //initial position of black piece
          piece = this.piecesGroup.create(x, y);
          piece.black = true;
        }
        // console.log(piece, piece.black)
        piece.name = 'piece' + i.toString() + 'x' + j.toString();
        piece.currentIndex = piecesIndex;
        piece.destIndex = this.shuffledIndexArray[piecesIndex];
        // piece.inputEnabled = true;
        // piece.setInteractive().on('pointerdown', function() {
        //   GameScene.
        // });
        piece.setInteractive();
        // piece.on("pointerdown", this.selectPiece, piece); // piece:pointer this:sprite

        // piece.on("pointerdown", (p, x, y, o, piece) => {
        //   console.log("selectPiece", piece);
        // this.selectPiece(piece);
        // }, piece)

        piece.on("pointerdown", this.selectPiece.bind(this, piece));

        piece.posX = j;
        piece.posY = i;
        piecesIndex++;
      }
    }

  }

  selectPiece(piece, pointer): void {
    var blackPiece = this.canMove(piece);

    //if there is a black piece in neighborhood
    if (blackPiece) {
      this.movePiece(piece, blackPiece);
    }

  }

  canMove(piece): Phaser.GameObjects.Sprite | null {

    var foundBlackElem = false;
    console.log("piece", piece.posX, piece.posY, piece.black);
    this.piecesGroup.children.entries.forEach(function (element) {
      console.log("element", element.posX, element.posY, element.black);
      if (element.posX === (piece.posX - 1) && element.posY === piece.posY && element.black ||
        element.posX === (piece.posX + 1) && element.posY === piece.posY && element.black ||
        element.posY === (piece.posY - 1) && element.posX === piece.posX && element.black ||
        element.posY === (piece.posY + 1) && element.posX === piece.posX && element.black) {
        foundBlackElem = element;
        return;
      }
    });

    return foundBlackElem;
  }

  movePiece(piece, blackPiece): void {
    console.log("movePiece", piece, blackPiece);

    var tmpPiece = {
      posX: piece.posX,
      posY: piece.posY,
      currentIndex: piece.currentIndex
    };

    this.tweens.add({
      x: blackPiece.posX * CONST.PIECE_WIDTH + CONST.PIECE_WIDTH / 2,
      y: blackPiece.posY * CONST.PIECE_HEIGHT + CONST.PIECE_HEIGHT / 2,

      targets: piece,
      // x: 700,
      duration: 300,
      // repeatDelay: 500,
      ease: 'linear'
    })
    // this.add.tween(piece).to({
    //   x: blackPiece.posX * CONST.PIECE_WIDTH,
    //   y: blackPiece.posY * CONST.PIECE_HEIGHT
    // }, 300, Phaser.Easing.Linear.None, true);

    //change places of piece and blackPiece
    piece.posX = blackPiece.posX;
    piece.posY = blackPiece.posY;
    piece.currentIndex = blackPiece.currentIndex;
    piece.name = 'piece' + piece.posX.toString() + 'x' + piece.posY.toString();

    //piece is the new black
    blackPiece.posX = tmpPiece.posX;
    blackPiece.posY = tmpPiece.posY;
    blackPiece.currentIndex = tmpPiece.currentIndex;
    blackPiece.name = 'piece' + blackPiece.posX.toString() + 'x' + blackPiece.posY.toString();

    //after every move check if puzzle is completed
    this.checkIfFinished();
  }

  checkIfFinished(): void {

    var isFinished = true;

    this.piecesGroup.children.entries.forEach(function (element) {
      if (element.currentIndex !== element.destIndex) {
        isFinished = false;
        return;
      }
    });

    if (isFinished) {
      this.showFinishedText();
    }

  }

  showFinishedText(): void {

    var style = {font: "40px Arial", fill: "#ffffff", align: "center"};

    var text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Congratulations! \nYou made it!", style);
    text.setPosition(this.cameras.main.centerX - text.width / 2, this.cameras.main.centerY - text.height / 2);
    // text.anchor.set(0.5); // なにこれ
  }

  createShuffledIndexArray(): number[] {

    var indexArray = [];

    for (var i = 0; i < this.piecesAmount; i++) {
      indexArray.push(i);
    }

    return this.shuffle(indexArray);

  }

  shuffle(array): number[] {

    var counter = array.length,
      temp,
      index;

    while (counter > 0) {
      index = Math.floor(Math.random() * counter);

      counter--;

      temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;

  }


}
