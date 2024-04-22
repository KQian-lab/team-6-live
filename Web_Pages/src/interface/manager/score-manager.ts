import { ImageType } from "../assets";

// This class manages the scoreboard from display to current amount of lives, and the points awarded per alien slayed
export class ScoreManager {
  scoreText: Phaser.GameObjects.Text;
  line1Text: Phaser.GameObjects.Text;
  line2Text: Phaser.GameObjects.Text;
  lives: Phaser.Physics.Arcade.Group;

  // This will be the function that inserts the score to our sqlite db (Connects successfully to the db)
  private addScoreToDB(playerID, playerName, score, date){
    const sqlite = require("sqlite3") .verbose();
    const axios = require("axios");

    // Connect to db
    const db = new sqlite.Database("../../../../code/teamSix.db", sqlite.OPEN_READWRITE, (err)=>{
      if (err)console.error(err);
      else console.log("Successfully connected to the database")
    });
    //try{
      //const sql_statement = 'INSERT INTO Scores (playerID, playerName, score, date) VALUES (?,?,?,?)'
      //db.run(sql_statement, [playerID, playerName, score, date], (err) =>{
      //if(err) console.error(err)
    //});
    //}catch (error){
     //console.log(error);
    //}
  }



  // checks for a game over
  get noMoreLives() {
    return this.lives.countActive(true) === 0;
  }

  highScore = 0;
  score = 0;

  constructor(private _scene: Phaser.Scene) {
    this._init();
    this.print();
  }

  private _init() {
    const { width: SIZE_X, height: SIZE_Y } = this._scene.game.canvas;
    const textConfig = {
      fontFamily: `'Arial', sans-serif`,
      fill: "#ffffff",
    };
    const normalTextConfig = {
      ...textConfig,
      fontSize: "16px",
    };

    const bigTextConfig = {
      ...textConfig,
      fontSize: "36px",
    };

    this._scene.add.text(16, 16, `SCORE`, normalTextConfig);
    this.scoreText = this._scene.add.text(22, 32, "", normalTextConfig);
    this.line1Text = this._scene.add
      .text(SIZE_X / 2, 320, "", bigTextConfig)
      .setOrigin(0.5);

    this.line2Text = this._scene.add
      .text(SIZE_X / 2, 400, "", bigTextConfig)
      .setOrigin(0.5);

    this.setLivesText(SIZE_X, normalTextConfig);
  }

  // Gives three lives
  private setLivesText(
    SIZE_X: number,
    textConfig: { fontSize: string; fontFamily: string; fill: string }
  ) {
    this._scene.add.text(SIZE_X - 100, 16, `LIVES`, textConfig);
    this.lives = this._scene.physics.add.group({
      maxSize: 3,
      runChildUpdate: true,
    });
    this.resetLives();
  }

  resetLives() {
    let SIZE_X = this._scene.game.canvas.width;
    this.lives.clear(true, true)
    for (let i = 0; i < 3; i++) {
      let ship: Phaser.GameObjects.Sprite = this.lives.create(
        SIZE_X - 100 + 30 * i,
        60,
        ImageType.Ship
      );
      ship.setOrigin(0.5, 0.5);
      ship.setAngle(90);
      ship.setAlpha(0.6);
    }
  }

  // Text display for game over and winning
  setGameOverText() {
    this._setBigText("GAME OVER", "PRESS SPACE FOR NEW GAME");
  }

  // Clears text on screen
  hideText() {
    this._setBigText("", "")
  }

  private _setBigText(line1: string, line2: string) {
    this.line1Text.setText(line1);
    this.line2Text.setText(line2);
  }

  setHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
    this.score = 0;
    this.print();
  }

  print() {
    this.scoreText.setText(`${this.padding(this.score)}`);
  }

  // Awards 10 points per alien killed
  increaseScore(step = 10) {
    this.score += step;
    this.print();
  }

  // Reset the score to zero (Used for Game Over)
  resetScore() {
    this.score = 0;
    this.print();
  }

  padding(num: number) {
    return `${num}`.padStart(4, "0");
  }
}


