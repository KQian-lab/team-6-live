import { ImageType } from "./assets"

export class Gas extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, ImageType.Gas);
    }

    kill() {
        this.destroy();
    }
}