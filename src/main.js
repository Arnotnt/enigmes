import '@fontsource/andika/400.css';
import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from './constants.js';
import { AtlasScene } from './scenes/AtlasScene.js';
import { BootScene } from './scenes/BootScene.js';
import { RoomScene } from './scenes/RoomScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { WeekScene } from './scenes/WeekScene.js';
import { WorldScene } from './scenes/WorldScene.js';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  pixelArt: true, // agrandissement net, sans flou, pour les dessins des salles
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: 'arcade' },
  scene: [BootScene, TitleScene, AtlasScene, WorldScene, WeekScene, RoomScene],
});

// Accès depuis la console du navigateur, en développement uniquement.
if (import.meta.env.DEV) window.game = game;
