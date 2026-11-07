import * as Phaser from 'phaser';
import characterUrl from '../assets/character.png';
import npcUrl from '../assets/npc.png';
import objectsUrl from '../assets/objects.png';
import torchUrl from '../assets/objets/torche-egypte.png';
import overworldUrl from '../assets/overworld.png';
import { MUSICS } from '../audio/musics.js';
import { initSound } from '../audio/sound.js';
import { NPC_FRAME_SIZE, PLAYER_FRAME, TILE_SIZE, TORCH, WALK_FRAMES } from '../constants.js';
import { DIRECTIONS, firstFrame } from '../directions.js';
import { PLACES } from '../parcours/places.js';
import { BACKGROUNDS, ROOMS } from '../rooms.js';

// Charge une seule fois tout ce qui sert au jeu, puis ouvre l'écran de démarrage.
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

    this.load.spritesheet('torch', torchUrl, { frameWidth: TORCH.frameWidth, frameHeight: TORCH.frameHeight });
    this.load.spritesheet('npc', npcUrl, { frameWidth: NPC_FRAME_SIZE, frameHeight: NPC_FRAME_SIZE });

    for (const [key, url] of Object.entries(ROOMS)) this.load.tilemapTiledJSON(key, url);
    for (const { key, url } of PLACES) this.load.image(key, url);
    for (const [name, url] of Object.entries(BACKGROUNDS)) this.load.image(`fond-${name}`, url);
    for (const [key, urls] of Object.entries(MUSICS)) this.load.audio(key, urls);
  }

  create() {
    initSound(this.game);
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

    // Les lettres du jeu sont dessinées avec Andika : elle doit être prête avant le premier écran.
    document.fonts.load('16px Andika').finally(() => this.scene.start('title'));
  }
}
