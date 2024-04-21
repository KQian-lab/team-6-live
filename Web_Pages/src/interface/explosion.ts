import { ImageType } from "./assets";

// This class defines the kaboom class as the explosion asset
export class Explosion extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, ImageType.Explosion);
    }
}