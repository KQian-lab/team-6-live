import { ImageType } from "../assets";

// Factory that defines the animations of the game
export enum AnimationType {
    Fly = "fly",
    Explosion = "explosion"
}

export class AnimationFactory {
    constructor(private _scene: Phaser.Scene) {
        this._init_();
    }

    private _init_() {
        // Generates the fly animation of the aliens from the Spritesheet frames
        this._scene.anims.create({
            key: AnimationType.Fly,
            frames: this._scene.anims.generateFrameNumbers(ImageType.Alien, {start: 0, end: 4}),
            frameRate: 3,
            repeat: -1
        });

        // Generates the explosion animation from the Spritesheet frames
        this._scene.anims.create({
            key: AnimationType.Explosion,
            frames: this._scene.anims.generateFrameNumbers(ImageType.Explosion, {start: 0, end: 15}),
            frameRate: 24,
            repeat: 0,
            hideOnComplete: true
        })
    }
}