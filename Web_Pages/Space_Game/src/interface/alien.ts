import { ImageType, SoundType } from "./assets";
import { AnimationType } from "./factory/animation-factory";
import { Explosion } from "./explosion";

// Class the define the enemy and a function for when its hit with a bullet
export class Alien extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ImageType.Alien)
  }

  // function when alien is killed, play explosion, then remove the asset from the screen
  kill(explosion: Explosion) {
    if (explosion) {
      explosion.setX(this.x);
      explosion.setY(this.y);
      explosion.play(AnimationType.Explosion)
      this.scene.sound.play(SoundType.Kaboom)
    }
    this.destroy();
  }
}