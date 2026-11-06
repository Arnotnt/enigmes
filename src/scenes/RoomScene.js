import * as Phaser from 'phaser';
import characterUrl from '../assets/character.png';
import firstRoomUrl from '../assets/maps/first-room.tmj?url';
import objectsUrl from '../assets/objects.png';
import overworldUrl from '../assets/overworld.png';
import {
  PLAYER_FRAME,
  PLAYER_HITBOX,
  PLAYER_SHEET_COLUMNS,
  PLAYER_SPEED,
  TILE_SIZE,
  WALK_FRAMES,
} from '../constants.js';
import { BlockPuzzle } from '../puzzles/BlockPuzzle.js';

// sheetRow : ligne de character.png où se trouve la marche dans cette direction.
const DIRECTIONS = {
  down: { x: 0, y: 1, sheetRow: 0 },
  right: { x: 1, y: 0, sheetRow: 1 },
  up: { x: 0, y: -1, sheetRow: 2 },
  left: { x: -1, y: 0, sheetRow: 3 },
};

// Premier dessin de la marche dans une direction : c'est aussi la pose à l'arrêt.
const firstFrame = (direction) => DIRECTIONS[direction].sheetRow * PLAYER_SHEET_COLUMNS;

export class RoomScene extends Phaser.Scene {
  constructor() {
    super('room');
  }

  preload() {
    this.load.spritesheet('player', characterUrl, {
      frameWidth: PLAYER_FRAME.width,
      frameHeight: PLAYER_FRAME.height,
    });
    const tileSize = { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE };
    this.load.spritesheet('tiles', overworldUrl, tileSize);
    this.load.spritesheet('objects', objectsUrl, tileSize);
    this.load.tilemapTiledJSON('first-room', firstRoomUrl);
  }

  create() {
    const map = this.make.tilemap({ key: 'first-room' });
    const tileset = map.addTilesetImage('overworld', 'tiles');
    map.createLayer('sol', tileset);
    const walls = map.createLayer('murs', tileset);
    walls.setCollisionByExclusion([-1]); // toute tuile peinte sur ce calque bloque le passage

    const start = map.findObject('objets', (object) => object.name === 'depart');

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

    // Le point de départ désigne l'emplacement des pieds, pas le centre du dessin.
    const feetOffset = PLAYER_HITBOX.offsetY + PLAYER_HITBOX.height / 2 - PLAYER_FRAME.height / 2;
    this.player = this.physics.add.sprite(start.x, start.y - feetOffset, 'player', firstFrame('down'));
    this.player.body.setSize(PLAYER_HITBOX.width, PLAYER_HITBOX.height);
    this.player.body.setOffset(PLAYER_HITBOX.offsetX, PLAYER_HITBOX.offsetY);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(1); // toujours dessiné devant le bloc et la porte
    this.physics.add.collider(this.player, walls);

    this.puzzle = new BlockPuzzle(this, map, this.player);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.heldDirections = []; // de la plus ancienne à la plus récente
    this.facing = 'down';
  }

  update(time, delta) {
    // Une seule direction à la fois, jamais en diagonale : la dernière touche enfoncée gagne.
    for (const name of Object.keys(DIRECTIONS)) {
      const key = this.cursors[name];
      if (Phaser.Input.Keyboard.JustDown(key)) this.heldDirections.push(name);
      if (key.isUp) this.heldDirections = this.heldDirections.filter((held) => held !== name);
    }

    const name = this.heldDirections.at(-1);
    if (name) {
      const { x, y } = DIRECTIONS[name];
      this.facing = name;
      this.player.body.setVelocity(x * PLAYER_SPEED, y * PLAYER_SPEED);
      this.player.anims.play(`walk-${name}`, true);
    } else {
      this.player.body.setVelocity(0, 0);
      this.player.anims.stop();
      this.player.setFrame(firstFrame(this.facing));
    }

    this.puzzle.update(delta, DIRECTIONS[name]);
  }
}
