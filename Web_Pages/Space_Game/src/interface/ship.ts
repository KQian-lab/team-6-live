import { AssetType } from "./assets";


// This class defines the hero ship
export class Ship {
    static create(scene: Phaser.Scene): Phaser.Physics.Arcade.Sprite {
        let ship = scene.physics.add.sprite(400, 500, AssetType.Ship);
        ship.setCollideWorldBounds(true);
        return ship;
    }
}