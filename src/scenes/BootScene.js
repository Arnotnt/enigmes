import * as Phaser from 'phaser';
import npcUrl from '../assets/npc.png';
import objectsUrl from '../assets/objects.png';
import torchUrl from '../assets/objets/torche-egypte.png';
import overworldUrl from '../assets/overworld.png';
import { MUSICS } from '../audio/musics.js';
import { initSound } from '../audio/sound.js';
import { COSTUMES, walkAnimation } from '../characters/costumes.js';
import { NPC_FRAME_SIZE, PLAYER_FRAME, PLAYER_TEXTURE_SCALE, TILE_SIZE, TORCH, WALK_FRAMES } from '../constants.js';
import { DIRECTIONS, standingFrame } from '../directions.js';
import { checkParcours } from '../parcours/check.js';
import { PLACES } from '../parcours/places.js';
import { PICTOS, pictoKey } from '../reading/pictos.js';
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
    // Tous les costumes du héros, chargés une fois : chaque scène prend celui de son monde.
    const heroFrame = {
      frameWidth: PLAYER_FRAME.width * PLAYER_TEXTURE_SCALE,
      frameHeight: PLAYER_FRAME.height * PLAYER_TEXTURE_SCALE,
    };
    for (const [name, url] of Object.entries(COSTUMES)) this.load.spritesheet(`hero-${name}`, url, heroFrame);

    this.load.spritesheet('torch', torchUrl, { frameWidth: TORCH.frameWidth, frameHeight: TORCH.frameHeight });
    this.load.spritesheet('npc', npcUrl, { frameWidth: NPC_FRAME_SIZE, frameHeight: NPC_FRAME_SIZE });

    for (const [key, url] of Object.entries(ROOMS)) this.load.tilemapTiledJSON(key, url);
    for (const { key, url } of PLACES) this.load.image(key, url);
    for (const [name, url] of Object.entries(BACKGROUNDS)) this.load.image(`fond-${name}`, url);
    for (const [key, urls] of Object.entries(MUSICS)) this.load.audio(key, urls);
    for (const [word, url] of Object.entries(PICTOS)) this.load.image(pictoKey(word), url);
  }

  create() {
    checkParcours(); // un mot sans image ou une phrase impossible à dessiner, dans la console
    initSound(this.game);
    for (const name of Object.keys(COSTUMES)) {
      const texture = `hero-${name}`;
      // Le héros est dessiné en détail, puis réduit : lissé, il garde des contours propres.
      this.textures.get(texture).setFilter(Phaser.Textures.FilterMode.LINEAR);

      for (const direction of Object.keys(DIRECTIONS)) {
        const first = standingFrame(direction) + 1;
        this.anims.create({
          key: walkAnimation(texture, direction),
          frames: this.anims.generateFrameNumbers(texture, { start: first, end: first + WALK_FRAMES - 1 }),
          frameRate: 8,
          repeat: -1,
        });
      }
    }

    // Les pictogrammes sont réduits dans la salle : lissés, ils restent nets.
    for (const word of Object.keys(PICTOS)) this.textures.get(pictoKey(word)).setFilter(Phaser.Textures.FilterMode.LINEAR);

    // Les lettres du jeu sont dessinées avec Andika : elle doit être prête avant le premier écran.
    document.fonts.load('16px Andika').finally(() => this.scene.start('title'));
  }
}
