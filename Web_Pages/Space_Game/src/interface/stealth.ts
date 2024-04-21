import { ImageType } from "./assets"

export class Stealth extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, ImageType.Stealth);
    }

    move(x: number) {
        this.setPosition(x, 50);
        this.setVelocityY(350);
        this.setVelocityX(Phaser.Math.Between(-100, 100))
    }

    kill() {
        this.destroy();
    }
}