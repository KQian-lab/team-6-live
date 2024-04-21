import { EnemyBullet } from "../enemy-bullet";
import { Bullet } from "../bullet";
import { Explosion } from "../explosion";
import { Repair } from "../repair";
import { Gas } from "../gas";
import { Stealth } from "../stealth";
import { Meteor } from "../meteor";

// Class that handles creation of new assets when the game is in play (bullets and explosions) and when the game is over
export class AssetManager {

    // assets controlled by this class
    bullets: Phaser.Physics.Arcade.Group;
    enemyBullets: Phaser.Physics.Arcade.Group;
    explosions: Phaser.Physics.Arcade.Group;
    repair: Phaser.Physics.Arcade.Group;
    gas: Phaser.Physics.Arcade.Group;
    stealth: Phaser.Physics.Arcade.Group;
    meteor: Phaser.Physics.Arcade.Group;

    constructor(private _scene: Phaser.Scene) {
        this.bullets = this._createBullets();
        this.enemyBullets = this._createEnemyBullets();
        this.explosions = this._createExplosions();
        this.repair = this._createRepair();
        this.gas = this._createGas();
        this.stealth = this._createStealth();
        this.meteor = this._createMeteor();
    }

    // clears bullets when the game is ove
    gameOver() {
        this.enemyBullets.clear(true, true)
        this.bullets.clear(true, true)
        this.repair.clear(true, true)
        this.gas.clear(true, true)
        this.stealth.clear(true, true)
        this.meteor.clear(true, true)
    }

    // resets the assets when the game is restarted
    reset() {
        this._createEnemyBullets();
        this._createBullets();
        this._createRepair();
        this._createGas();
        this._createStealth();
        this._createMeteor();
    }
    

    private _createEnemyBullets(): Phaser.Physics.Arcade.Group {
        let enemyBullets = this._scene.physics.add.group({
            max: 0,
            classType: EnemyBullet,
            runChildUpdate: true
        });
        enemyBullets.setOrigin(0.5, 1);
        return enemyBullets;
    }

    private _createBullets(): Phaser.Physics.Arcade.Group {
        let bullets = this._scene.physics.add.group({
            max: 0,
            classType: Bullet,
            runChildUpdate: true
        });
        bullets.setOrigin(0.5, 1);
        return bullets;
    }

    private _createExplosions(): Phaser.Physics.Arcade.Group {
        let explosions = this._scene.physics.add.group({
            max: 0,
            classType: Explosion,
            runChildUpdate: true
        });

        return explosions;
    }

    private _createRepair(): Phaser.Physics.Arcade.Group {
        let repair = this._scene.physics.add.group({
            max: 0,
            classType: Repair,
            runChildUpdate: true
        });
        
        return repair
    }

    private _createGas(): Phaser.Physics.Arcade.Group {
        let gas = this._scene.physics.add.group({
            max: 0,
            classType: Gas,
            runChildUpdate: true
        });
        return gas
    }

    private _createStealth(): Phaser.Physics.Arcade.Group {
        let stealth= this._scene.physics.add.group({
            max: 0,
            classType: Stealth,
            runChildUpdate: true
        });
        return stealth
    }
    private _createMeteor(): Phaser.Physics.Arcade.Group {
        let meteor = this._scene.physics.add.group({
            classType: Meteor,
            runChildUpdate: true
        });
        return meteor;
    }
}
