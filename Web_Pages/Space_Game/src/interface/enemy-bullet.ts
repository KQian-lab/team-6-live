import { AssetType } from "./assets";

// This class defines the enemies bullets and a function for impact
export class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, AssetType.EnemyBullet);
    }

    kill() {
        this.destroy();
    }
}

