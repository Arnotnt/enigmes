import * as Phaser from 'phaser';
import characterUrl from '../assets/character.png';
import npcUrl from '../assets/npc.png';
import objectsUrl from '../assets/objects.png';
import overworldUrl from '../assets/overworld.png';
import { NPC_FRAME_SIZE, PLAYER_FRAME, TILE_SIZE, WALK_FRAMES } from '../constants.js';
import { DIRECTIONS, firstFrame } from '../directions.js';
import { ROOMS } from '../rooms.js';

// Charge une seule fois tout ce qui sert au jeu, puis lance la première salle.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  preload() {
    const tileSize = { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE };
    this.load.spritesheet('tiles', overworldUrl, tileSize);
    this.load.spritesheet('objects', objectsUrl, tileSize);
    this.load.spritesheet('player', characterUrl, {
      frameWidth: PLAYER_FRAME.width,
      frameHeight: PLAYER_FRAME.height,
    });

    this.load.spritesheet('npc', npcUrl, { frameWidth: NPC_FRAME_SIZE, frameHeight: NPC_FRAME_SIZE });

    for (const [key, url] of Object.entries(ROOMS)) this.load.tilemapTiledJSON(key, url);
  }

  create() {
    for (const direction of Object.keys(DIRECTIONS)) {
      const first = firstFrame(direction);
      this.anims.create({
        key: `walk-${direction}`,
        frames: this.anims.generateFrameNumbers('player', {
          start: first,
          end: first + WALK_FRAMES - 1,
        }),
        frameRate: 8,
        repeat: -1,
      });
    }

    this.scene.start('room');
  }
}
