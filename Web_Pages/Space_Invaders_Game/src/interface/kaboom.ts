import { AssetType } from "./assets";

// This class defines the explosion
export class Kaboom extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, AssetType.Kaboom);
    }
}