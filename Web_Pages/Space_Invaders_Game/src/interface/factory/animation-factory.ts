import { AssetType } from "../assets";

// Factory that defines the animations of the game
export enum AnimationType {
    Fly = "fly",
    Kaboom = "kaboom"
}

export class AnimationFactory {
    constructor(private _scene: Phaser.Scene) {
        this._init();
    }

    private _init() {
        // Generates the fly animation of the aliens from the Spritesheet frames
        this._scene.anims.create({
            key: AnimationType.Fly,
            frames: this._scene.anims.generateFrameNumbers(AssetType.Alien, {
                start: 0,
                end: 3
            }),
            frameRate: 20,
            repeat: -1
        });

        // Generates the explosion animation from the spritesheet frames
        this._scene.anims.create({
            key: AnimationType.Kaboom,
            frames: this._scene.anims.generateFrameNumbers(AssetType.Kaboom, {
                start: 0,
                end: 15
            }),
            frameRate: 24,
            repeat: 0,
            hideOnComplete: true
        })
    }
}