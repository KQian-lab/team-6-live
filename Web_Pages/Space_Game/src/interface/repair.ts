import { ImageType } from "./assets";

export class Repair extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, ImageType.Repair);
    }

    move(x: number) {
        this.setPosition(x, 50);
        this.setVelocityY(Phaser.Math.Between(150, 200));
        this.setVelocityX(Phaser.Math.Between(-50, 50));
    }

    kill() {
        this.destroy();
    }
}