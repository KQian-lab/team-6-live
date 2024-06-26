import '../assets/css/style.css'
import Phaser from 'phaser'
import { MainScene } from './scenes/main';

const config: Phaser.Types.Core.GameConfig = {
  title: "Space Invaders",
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: MainScene,
    physics: {
      default: "arcade"
  },
  parent: "SpaceInvaders"
};

class SpaceInvadersGame extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
      super(config)
  }
}

const game = new SpaceInvadersGame(config);