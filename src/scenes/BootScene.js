import * as Phaser from 'phaser';
import npcUrl from '../assets/npc.png';
import objectsUrl from '../assets/objects.png';
import overworldUrl from '../assets/overworld.png';
import { MUSICS } from '../audio/musics.js';
import { initSound } from '../audio/sound.js';
import { COSTUMES, walkAnimation } from '../characters/costumes.js';
import { GAME_HEIGHT, GAME_WIDTH, NPC_FRAME_SIZE, PLAYER_FRAME, PLAYER_TEXTURE_SCALE, TILE_SIZE, WALK_FRAMES } from '../constants.js';
import { DIRECTIONS, standingFrame } from '../directions.js';
import { TORCH_STYLES, torchKey } from '../objects/torchStyles.js';
import { checkParcours } from '../parcours/check.js';
import { PLACES } from '../parcours/places.js';
import { PICTOS, pictoKey } from '../reading/pictos.js';
import { BACKGROUNDS, ROOMS } from '../rooms.js';

const LOADING_BAR = { width: 480, height: 32, border: 6 };

// Charge une seule fois tout ce qui sert au jeu, puis ouvre l'écran de démarrage.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  // Une barre avance pendant le chargement : sans elle, l'écran noir ferait croire à une panne.
  drawLoadingBar() {
    const { width, height, border } = LOADING_BAR;
    const left = (GAME_WIDTH - width) / 2;
    const y = GAME_HEIGHT / 2;
    this.add.rectangle(GAME_WIDTH / 2, y, width + border * 2, height + border * 2, 0x6b4a2f);
    this.add.rectangle(GAME_WIDTH / 2, y, width, height, 0xfff8e7);
    const fill = this.add.rectangle(left, y, width, height, 0xf2c14e).setOrigin(0, 0.5).setScale(0, 1);
    this.load.on('progress', (value) => fill.setScale(value, 1));
  }

  preload() {
    this.drawLoadingBar();
    const tileSize = { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE };
    this.load.spritesheet('tiles', overworldUrl, tileSize);
    this.load.spritesheet('objects', objectsUrl, tileSize);
    // Tous les costumes du héros, chargés une fois : chaque scène prend celui de son monde.
    const heroFrame = {
      frameWidth: PLAYER_FRAME.width * PLAYER_TEXTURE_SCALE,
      frameHeight: PLAYER_FRAME.height * PLAYER_TEXTURE_SCALE,
    };
    for (const [name, url] of Object.entries(COSTUMES)) this.load.spritesheet(`hero-${name}`, url, heroFrame);

    for (const [name, { url, frameWidth, frameHeight }] of Object.entries(TORCH_STYLES)) {
      this.load.spritesheet(torchKey(name), url, { frameWidth, frameHeight });
    }
    this.load.spritesheet('npc', npcUrl, { frameWidth: NPC_FRAME_SIZE, frameHeight: NPC_FRAME_SIZE });

    for (const [key, url] of Object.entries(ROOMS)) this.load.tilemapTiledJSON(key, url);
    for (const { key, url } of PLACES) this.load.image(key, url);
    for (const [name, url] of Object.entries(BACKGROUNDS)) this.load.image(`fond-${name}`, url);
    for (const [key, urls] of Object.entries(MUSICS)) this.load.audio(key, urls);
    for (const [word, url] of Object.entries(PICTOS)) this.load.image(pictoKey(word), url);
  }

  create() {
    checkParcours({ readMap: (room) => this.cache.tilemap.get(room)?.data }); // les erreurs, dans la console
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
    Promise.all([document.fonts.load('16px Andika'), document.fonts.load('bold 16px Andika')]).finally(() => this.scene.start('title'));
  }
}
