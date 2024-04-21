import { ImageType } from "./assets";

// This class defines the meteors and a function for impact
export class Meteor extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, ImageType.Meteor);
    }

    setRandomVelocity() {
        const velocityX = Phaser.Math.Between(-100, 100);
        const velocityY = Phaser.Math.Between(100, 200);
        this.setVelocity(velocityX, velocityY);
    }

    kill() {
        this.destroy();
    }
}