import '@fontsource/andika/400.css';
import * as Phaser from 'phaser';
import { ROOM_HEIGHT, ROOM_WIDTH, TILE_SIZE } from './constants.js';
import { BootScene } from './scenes/BootScene.js';
import { RoomScene } from './scenes/RoomScene.js';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: ROOM_WIDTH * TILE_SIZE,
  height: ROOM_HEIGHT * TILE_SIZE,
  pixelArt: true, // agrandissement net, sans flou
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: 'arcade' },
  scene: [BootScene, RoomScene],
});

// Accès depuis la console du navigateur, en développement uniquement.
if (import.meta.env.DEV) window.game = game;
