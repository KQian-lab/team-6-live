import { Alien } from "../alien";
import { AnimationType } from "../factory/animation-factory";

// Class that manages the aliens from building them, checking how many are still alive, animating them, and resting them
export class AlienManager {
    aliens: Phaser.Physics.Arcade.Group;
    get hasAliveAliens(): boolean {
        return !!this.aliens.children.size
    }

    constructor(private _scene: Phaser.Scene) {
        this.aliens = this._scene.physics.add.group({
            maxSize: 40,
            classType: Alien,
            runChildUpdate: true
        });
        this.aliens.setOrigin(0, 0)
        this._sortAliens();
        this._animate();
    }

    // Grabs a random alive enemy to shoot a bullet when called
    getRandomAliveEnemy(): Alien {
        let random = Phaser.Math.RND.integerInRange(1, this.aliens.children.size);
        let aliens = this.aliens.children.getArray() as Alien[];
        return aliens[random];
    }

    // Call on game reset
    reset() {
        this._sortAliens();
        this._animate();
    }

    private _sortAliens() {
        // Builds 40 enemies in a 4x10 grid
        let ORIGIN_X = 100;
        let ORIGIN_Y = 100;
        this.aliens.clear(true, true);
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 10; x++) {
                let alien: Alien = this.aliens.create(ORIGIN_X + x * 48, ORIGIN_Y + y * 50);
                alien.setOrigin(0.5, 0.5);
                alien.play(AnimationType.Fly)
                alien.setImmovable(false);
            }
        }
    }

    // animation of the aliens flying
    private _animate() {
        this.aliens.children.iterate((c: Alien) => {
            this._scene.tweens.add({
                targets: c,
                ease: "Linear",
                duration: 2000,
                x: "+=200",
                paused: false,
                delay: 0,
                yoyo: true,
                repeat: -1
            })
        })
    }
}