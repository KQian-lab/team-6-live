import { ImageType, SoundType} from "./assets";

// This class defines the heros bullets and a function for bullet collision and shooting
export class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, ImageType.Bullet);
    }

    // Defines when the player shoots
    shoot(x: number, y: number) {
        this.scene.sound.play(SoundType.Shoot)
        this.setPosition(x, y);
        this.setVelocityY(-400);
    }

    kill() {
        this.destroy();
    }
}

