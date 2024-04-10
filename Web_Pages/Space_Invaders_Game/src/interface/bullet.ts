import { AssetType} from "./assets";

// This class defines the heros bullets and a function for bullet collision and shooting
export class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, AssetType.Bullet);
    }

    shoot(x: number, y: number) {
        this.setPosition(x, y);
        this.setVelocityY(-400);
    }

    kill() {
        this.destroy();
    }
}

