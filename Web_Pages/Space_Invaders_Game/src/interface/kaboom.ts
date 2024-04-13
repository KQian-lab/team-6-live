import { AssetType } from "./assets";

// This class defines the kaboom class as the explosion asset
export class Kaboom extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, AssetType.Kaboom);
    }
}