import { ImageType, SoundType } from "../interface/assets";
import { Bullet } from "../interface/bullet";
import { AssetManager } from "../interface/manager/asset-manager";
import { AlienManager } from "../interface/manager/alien-manager";
import { Ship } from "../interface/ship";
import {
    AnimationFactory,
    AnimationType,
} from "../interface/factory/animation-factory";
import { Alien } from "../interface/alien";
import { Explosion } from "../interface/explosion";
import { EnemyBullet } from "../interface/enemy-bullet";
import { ScoreManager } from "../interface/manager/score-manager";
import { GameState } from "../interface/game-state";
import { Repair } from "../interface/repair";
import { Gas } from "../interface/gas"
import { Stealth } from "../interface/stealth"
import { Meteor } from "../interface/meteor"

export class MainScene extends Phaser.Scene {
    state: GameState;
    assetManager: AssetManager;
    animationFactory: AnimationFactory;
    scoreManager: ScoreManager;
    bulletTime = 0;
    firingTimer = 0;
    repairTimer = this.getRandomInt(30000,60000);     // random timer for initial spawn
    gasTimer = this.getRandomInt(45000,60000);        // random timer for initial spawn
    stealthTimer = this.getRandomInt(60000,90000);    // random timer for initial spawn
    stealthDuration = 15000;                          // stealth pack duration
    isStealth = false;                                // tells if stealth is active
    stealthDurationTimer = 0;                         // duration timer of a stealth pack
    meteorTimer = 0;
    isVisionImpaired = false;                         // tells if player vision is impaired by a gas cloud
    visionImpairmentDuration = 15000;                 // duration of the impairment
    visionImpairmentTimer = 0;                        // timer to check if the impairment is over on update
    starfield: Phaser.GameObjects.TileSprite;
    haze: Phaser.GameObjects.Image;
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
        // Load images
        this.load.setBaseURL("/assets");
        this.load.image(ImageType.Starfield, "/images/starfield.png");
        this.load.image(ImageType.Haze, "/images/hazyVision.png")
        this.load.image(ImageType.Bullet, "/images/bullet.png");
        this.load.image(ImageType.EnemyBullet, "/images/enemy-bullet.png");
        this.load.image(ImageType.Repair, "/images/repair.png")
        this.load.image(ImageType.Gas, "/images/gas.png")
        this.load.image(ImageType.Stealth, "/images/stealth.png")
        this.load.image(ImageType.Meteor, '/images/meteor.png');
        this.load.spritesheet(ImageType.Alien, "/images/invader.png", {
            frameWidth: 32,
            frameHeight: 36,
        });
        this.load.image(ImageType.Ship, "/images/player.png");
        this.load.spritesheet(ImageType.Explosion, "/images/explode.png", {
            frameWidth: 128,
            frameHeight: 128,
        });

        // Load audio
        this.sound.volume = 0.25;
        this.load.audio(SoundType.Shoot, "/audio/boop.wav");
        this.load.audio(SoundType.Kaboom, "/audio/boom.wav");
        this.load.audio(SoundType.PlayerKaboom, "/audio/player_boom.wav");
        this.load.audio(SoundType.Song, "/audio/boop_song.wav");
        this.load.audio(SoundType.Gas, "/audio/gas_powerdown.wav");
        this.load.audio(SoundType.Repair, "/audio/repair_powerup.wav");
        this.load.audio(SoundType.Stealth, "/audio/stealth_powerup.wav");
        this.load.audio(SoundType.StealthEnd, "/audio/stealth_powerdown.wav");
    }

    // This function sets up the playing field for the game on start
    create() {
        this.state = GameState.Playing;
        this.starfield = this.add
            .tileSprite(0, 0, 800, 600, ImageType.Starfield)
            .setOrigin(0, 0);
        this.assetManager = new AssetManager(this);
        this.animationFactory = new AnimationFactory(this);
        this.cursors = this.input.keyboard.createCursorKeys();
        // Setting space key to be the fire key
        this.fireKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        this.player = Ship.create(this);
        this.alienManager = new AlienManager(this);
        this.haze = this.add
            .image(400, 300, ImageType.Haze)
        this.haze.visible = false;
        this.scoreManager = new ScoreManager(this);
        

        // Set space key to restart after game over
        this.fireKey.on("down", () => {
            switch (this.state) {
                case GameState.GameOver:
                    this.restart();
                    break;
            }
        })

        // Add background music on a loop
        var music = this.sound.add(SoundType.Song);
        music.setLoop(true);
        music.play();
    }



    // This function checks for updates periodically during game play
    update() {
        // Make the background move
        this.starfield.tilePositionY -= 0.5;
        

        this.shipKeyboardHandler();

        // update to keep  the aliens firing at the hero
        if (this.time.now > this.firingTimer && !(this.isStealth)) {   // If stealth mod is active, enemies do not shoot
            this._enemyFires();
            if (this.isVisionImpaired){
                this.assetManager.enemyBullets.setAlpha(0.1); // if vision is impaired hide bullets
            }
        }

        // update to restore vision
        if (this.time.now > this.visionImpairmentTimer && this.isVisionImpaired){
            this.haze.visible = false;
            this.assetManager.enemyBullets.setAlpha(1);
            this.alienManager.aliens.setAlpha(1);
            this.assetManager.meteor.setAlpha(1);
            this.isVisionImpaired = false;
        }

        // Update for the repair pack being spawned
        if (this.time.now > this.repairTimer){
            this._repairSpawn();
            if (this.isVisionImpaired){
                this.assetManager.repair.setAlpha(0.1);   // if vision is impaired hide repair pack
            }
        }

        // Update for the gas being spawned
        if (this.time.now > this.gasTimer){
            this._gasSpawn();
        }
        
        // Update for the meteor being spawned
        if (this.time.now > this.meteorTimer){
            this._meteorSpawn();
            if (this.isVisionImpaired){
                this.assetManager.meteor.setAlpha(0.1);   // if vision is impaired hide meteor
            }
        }
        
        // Update for the stealth pack being spawned
        if (this.time.now > this.stealthTimer){
            this._stealthSpawn();
            if (this.isVisionImpaired){
                this.assetManager.stealth.setAlpha(0.1);   // if vision is impaired hide stealth pack
            }
        }

        // Update for ending the stealth power-up
        if (this.isStealth && this.time.now > this.stealthDurationTimer){
            this.player.setAlpha(1);
            this.sound.play(SoundType.StealthEnd)
            this.isStealth = false;
        }

        // Check for bullet collision w/ an alien
        this.physics.overlap(
            this.assetManager.bullets,
            this.alienManager.aliens,
            this.bulletHitAliens,
            null,
            this
        );
        
        // Check for an enemy bullet overlap w/ the player
        this.physics.overlap(
            this.assetManager.enemyBullets,
            this.player,
            this.enemyBulletHitPlayer,
            null,
            this
        );

        // Check for a repair pack overlap with hero ship
        this.physics.overlap(
            this.assetManager.repair,
            this.player,
            this.playerGetsRepair,
            null,
            this
        );

        // Check for a repair pack overlap with hero ship
        this.physics.overlap(
            this.assetManager.gas,
            this.player,
            this.gasHitPlayer,
            null,
            this
        );

        // Check for stealth pack overlap w/ the player ship
        this.physics.overlap(
            this.assetManager.stealth,
            this.player,
            this.playerGetsStealth,
            null,
            this
        )
        //Check for meteor overlap with player ship
        this.physics.overlap(
            this.assetManager.meteor,
            this.player,
            this.meteorHitPlayer,
            null,
            this
        )
    }

    // This function handles the movement of the hero ship
    private shipKeyboardHandler() {
        let playerBody = this.player.body as Phaser.Physics.Arcade.Body;
        playerBody.setVelocity(0, 0);
        if (this.cursors.left.isDown) {
            playerBody.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            playerBody.setVelocityX(200);
        }


        // check for if the space key is pressed. If so, fire a bullet
        if (this.fireKey.isDown) {
            this._fireBullet();
        }
    }

    // This functions handles when a bullet collides with an enemy
    private bulletHitAliens(bullet: Bullet, alien: Alien) {
        let explosion: Explosion = this.assetManager.explosions.get();
        bullet.kill();
        alien.kill(explosion);
        this.scoreManager.increaseScore();
        if (!this.alienManager.hasAliveAliens) {
            this.scoreManager.increaseScore(1000);
            this.alienManager.reset();
            this.assetManager.reset();

            if (this.isVisionImpaired){
                this.alienManager.aliens.setAlpha(0.1); // make aliens spawn invisible when vision is impaired
            }
        }
    }

    // If player gets a repair pack, reset the lives count
    private playerGetsRepair(ship: Ship, repair: Repair){
        repair.kill();
        this.sound.play(SoundType.Repair);
        this.scoreManager.resetLives();
    }

    // If player gets a stealth mod, make them transparent and let the game know to make enemies not shoot
    private playerGetsStealth(ship: Ship, stealth: Stealth){
        stealth.kill();
        this.sound.play(SoundType.Stealth);
        ship.setAlpha(0.5)
        this.isStealth = true;
        this.stealthDurationTimer = this.time.now + this.stealthDuration;
    }

    // If player hits a gas cloud
    private gasHitPlayer (ship: Ship, gas: Gas){
        gas.kill();
        this.isVisionImpaired = true;
        this.haze.visible = true;
        this.assetManager.enemyBullets.setAlpha(0.1);
        this.alienManager.aliens.setAlpha(0.1);
        this.assetManager.meteor.setAlpha(0.1);
        this.visionImpairmentTimer = this.time.now + this.visionImpairmentDuration;
    }
    
    //If player hits a meteor
    private meteorHitPlayer(ship: Ship, meteor: Meteor) {
        meteor.kill();  // Destroy the meteor
        let explosion: Explosion = this.assetManager.explosions.get();
        explosion.setPosition(ship.x, ship.y);
        explosion.play(AnimationType.Explosion);
        this.sound.play(SoundType.Kaboom);  // Play explosion sound
    
        // Apply damage to the ship, potentially decrementing the life count
        let live: Phaser.GameObjects.Sprite = this.scoreManager.lives.getFirstAlive();
        if (live) {
            live.setActive(false).setVisible(false);  // Decrease life
        }
    }
        
    //This function manages meteor spawning
    private _meteorSpawn() {
        if (!this.player.active) {
            return;
        }
        let meteor = this.assetManager.meteor.get();
        if (meteor) {
            let x = this.getRandomInt(50, 751);
            meteor.setPosition(x, 0).setActive(true).setVisible(true);
            this.physics.world.enable(meteor);
            meteor.setRandomVelocity();
            let coolDownTime = this.getRandomInt(10000, 20000);
            this.meteorTimer = this.time.now + coolDownTime;
        } else {
            // Handle the case where the meteor couldn't be retrieved
            console.error('Could not spawn meteor. No instance available.');
        }
    }
        
    // This function handles when an enemy bullet collides with the hero ship
    private enemyBulletHitPlayer(ship: Ship, enemyBullet: EnemyBullet) {
        let explosion: Explosion = this.assetManager.explosions.get();
        enemyBullet.kill();
        let live: Phaser.GameObjects.Sprite = this.scoreManager.lives.getFirstAlive();
        if (live) {
            live.setActive(false).setVisible(false);
        }

        // Explosion on collision and change game state if player is out of lives
        explosion.setPosition(this.player.x, this.player.y);
        explosion.play(AnimationType.Explosion);
        this.sound.play(SoundType.PlayerKaboom)
        if (this.scoreManager.noMoreLives) {
            this.scoreManager.resetScore();
            this.scoreManager.setGameOverText();
            this.assetManager.gameOver();
            this.state = GameState.GameOver;
            this.player.disableBody(true, true);
        }
    }

    // Function to handle the repair pack spawn
    private _repairSpawn(){
        if (!this.player.active) {
            return;
        }
        let repair: Repair = this.assetManager.repair.get();
        if (repair) {
            let x = this.getRandomInt(50,751);
            repair.move(x);
            let coolDownTime = this.getRandomInt(30000,60000);
            this.repairTimer = this.time.now + coolDownTime;
        }
    }

    // function to spawn a gas cloud
    private _gasSpawn(){
        if (!this.player.active) {
            return;
        }
        let gas: Gas = this.assetManager.gas.get();
        if (gas) {
            let x = this.getRandomInt(50,751);
            gas.setPosition(x, 50);
            this.physics.moveToObject(gas, this.player, 250);
            let coolDownTime = this.getRandomInt(60000,90000);   // random cool down time (1 - 1.5 min)
            this.gasTimer = this.time.now + coolDownTime;
        }
    }

    // function to spawn a stealth mod
    private _stealthSpawn (){
        if (!this.player.active) {
            return;
        }
        let stealth: Stealth = this.assetManager.stealth.get();
        if (stealth) {
            let x = this.getRandomInt(50,751);
            stealth.move(x);
            let coolDownTime = this.getRandomInt(60000,90000);      // random cool down time (1 - 1.5 min)
            this.stealthTimer = this.time.now + coolDownTime + this.stealthDuration;
        }
    }

    // This function handles when an enemy fires a bullet
    private _enemyFires() {
        if (!this.player.active) {
            return;
        }
        let enemyBullet: EnemyBullet = this.assetManager.enemyBullets.get();
        let randomEnemy = this.alienManager.getRandomAliveEnemy();

        // Check to fire an enemy bullet every two seconds and aim it towards the player ship
        if (enemyBullet && randomEnemy) {
            enemyBullet.setPosition(randomEnemy.x, randomEnemy.y);
            this.physics.moveToObject(enemyBullet, this.player, 120);
            this.firingTimer = this.time.now + 2000;
        }
    }

    // This function handles when the player ship fires, limits to a rate of one bullet per 200ms
    private _fireBullet() {
        if (!this.player.active) {
            return;
        }
        // Checks to fire the a bullet every two seconds
        if (this.time.now > this.bulletTime) {
            let bullet: Bullet = this.assetManager.bullets.get();
            if (bullet) {
                bullet.shoot(this.player.x, this.player.y - 18);
                this.bulletTime = this.time.now + 200;
            }
        }
    }

    // Function to get a random int, used for making a random time for new spawns
    private getRandomInt(min: number, max: number) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
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
