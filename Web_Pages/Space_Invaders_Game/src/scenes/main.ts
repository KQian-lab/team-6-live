import { AssetType, SoundType } from "../interface/assets";
import { Bullet } from "../interface/bullet";
import { AssetManager } from "../interface/manager/asset-manager";
import { AlienManager } from "../interface/manager/alien-manager";
import { Ship } from "../interface/ship";
import {
    AnimationFactory,
    AnimationType,
} from "../interface/factory/animation-factory";
import { Alien } from "../interface/alien";
import { Kaboom } from "../interface/kaboom";
import { EnemyBullet } from "../interface/enemy-bullet";
import { ScoreManager } from "../interface/manager/score-manager";
import { GameState } from "../interface/game-state";

export class MainScene extends Phaser.Scene {
    state: GameState;
    assetManager: AssetManager;
    animationFactory: AnimationFactory;
    scoreManager: ScoreManager;
    bulletTime = 0;
    firingTimer = 0;
    starfield: Phaser.GameObjects.TileSprite;
    player: Phaser.Physics.Arcade.Sprite;
    alienManager: AlienManager;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    fireKey: Phaser.Input.Keyboard.Key;

    constructor() {
        super({
            key: "MainScene",
        });
    }

    // This is the preload function in phaser that loads the assets
    preload() {
        this.load.setBaseURL("/assets");
        this.load.image(AssetType.Starfield, "/images/starfield.png");
        this.load.image(AssetType.Bullet, "/images/bullet.png");
        this.load.image(AssetType.EnemyBullet, "/images/enemy-bullet.png");
        this.load.spritesheet(AssetType.Alien, "/images/invader.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.image(AssetType.Ship, "/images/player.png");
        this.load.spritesheet(AssetType.Kaboom, "/images/explode.png", {
            frameWidth: 128,
            frameHeight: 128,
        });

        this.sound.volume = 0.25;
        this.load.audio(SoundType.Shoot, "/audio/boop.wav");
        this.load.audio(SoundType.Kaboom, "/audio/boom.wav");
        this.load.audio(SoundType.PlayerKaboom, "/audio/player_boom.wav");
        this.load.audio(SoundType.Song, "/audio/boop_song.wav");
    }

    // This function sets up the playing field for the game on start
    create() {
        this.state = GameState.Playing;
        this.starfield = this.add
            .tileSprite(0, 0, 800, 600, AssetType.Starfield)
            .setOrigin(0, 0);
        this.assetManager = new AssetManager(this);
        this.animationFactory = new AnimationFactory(this);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.fireKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        this.player = Ship.create(this);
        this.alienManager = new AlienManager(this);
        this.scoreManager = new ScoreManager(this);
        

        this.fireKey.on("down", () => {
            switch (this.state) {
                case GameState.Win:
                case GameState.GameOver:
                    this.restart();
                    break;
            }
        })
        var music = this.sound.add(SoundType.Song);
        music.setLoop(true);
        music.play();
    }



    // This function updates the game based on bullets
    update() {
        this._shipKeyboardHandler();
        if (this.time.now > this.firingTimer) {
            this._enemyFires();
        }

        this.physics.overlap(
            this.assetManager.bullets,
            this.alienManager.aliens,
            this._bulletHitAliens,
            null,
            this
        );
        this.physics.overlap(
            this.assetManager.enemyBullets,
            this.player,
            this._enemyBulletHitPlayer,
            null,
            this
        );
    }

    // This function handles the movement of the hero ship
    private _shipKeyboardHandler() {
        let playerBody = this.player.body as Phaser.Physics.Arcade.Body;
        playerBody.setVelocity(0, 0);
        if (this.cursors.left.isDown) {
            playerBody.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            playerBody.setVelocityX(200);
        }

        if (this.fireKey.isDown) {
            this._fireBullet();
        }
    }

    // This functions handles when a bullet collides with an enemy
    private _bulletHitAliens(bullet: Bullet, alien: Alien) {
        let explosion: Kaboom = this.assetManager.explosions.get();
        bullet.kill();
        alien.kill(explosion);
        this.scoreManager.increaseScore();
        if (!this.alienManager.hasAliveAliens) {
            this.scoreManager.increaseScore(1000);
            this.scoreManager.setWinText();
            this.state = GameState.Win;
        }
    }

    // This function handles when an enemy bullet collides with the hero ship
    private _enemyBulletHitPlayer(ship, enemyBullet: EnemyBullet) {
        let explosion: Kaboom = this.assetManager.explosions.get();
        enemyBullet.kill();
        let live: Phaser.GameObjects.Sprite = this.scoreManager.lives.getFirstAlive();
        if (live) {
            live.setActive(false).setVisible(false);
        }

        explosion.setPosition(this.player.x, this.player.y);
        explosion.play(AnimationType.Kaboom);
        this.sound.play(SoundType.PlayerKaboom)
        if (this.scoreManager.noMoreLives) {
            this.scoreManager.setGameOverText();
            this.assetManager.gameOver();
            this.state = GameState.GameOver;
            this.player.disableBody(true, true);
        }
    }

    // This function handles when an enemy fires a bullet
    private _enemyFires() {
        if (!this.player.active) {
            return;
        }
        let enemyBullet: EnemyBullet = this.assetManager.enemyBullets.get();
        let randomEnemy = this.alienManager.getRandomAliveEnemy();
        if (enemyBullet && randomEnemy) {
            enemyBullet.setPosition(randomEnemy.x, randomEnemy.y);
            this.physics.moveToObject(enemyBullet, this.player, 120);
            this.firingTimer = this.time.now + 2000;
        }
    }

    // This function handles when the hero ship fires a bullet
    private _fireBullet() {
        if (!this.player.active) {
            return;
        }

        if (this.time.now > this.bulletTime) {
            let bullet: Bullet = this.assetManager.bullets.get();
            if (bullet) {
                bullet.shoot(this.player.x, this.player.y - 18);
                this.bulletTime = this.time.now + 200;
            }
        }
    }

    // This function handles resetting the game playing field
    restart() {
        this.state = GameState.Playing;
        this.player.enableBody(true, this.player.x, this.player.y, true, true);
        this.scoreManager.resetLives();
        this.scoreManager.hideText();
        this.alienManager.reset();
        this.assetManager.reset();
    }
}
