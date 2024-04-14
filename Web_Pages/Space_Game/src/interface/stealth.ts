import { ImageType } from "./assets"

export class Stealth extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, ImageType.Stealth);
    }

    move(x: number) {
        this.setPosition(x, 50);
        this.setVelocityY(120);
    }

    kill() {
        this.destroy();
    }
}