import * as Phaser from 'phaser';
import {
  PLAYER_FRAME,
  PLAYER_HITBOX,
  PLAYER_SHEET_COLUMNS,
  PLAYER_SPEED,
  TILE_SIZE,
  TILES,
  WALK_FRAMES,
} from '../constants.js';
import { FIRST_ROOM } from '../rooms.js';

// sheetRow : ligne de character.png où se trouve la marche dans cette direction.
const DIRECTIONS = {
  down: { x: 0, y: 1, sheetRow: 0 },
  right: { x: 1, y: 0, sheetRow: 1 },
  up: { x: 0, y: -1, sheetRow: 2 },
  left: { x: -1, y: 0, sheetRow: 3 },
};

// Centre, en pixels, de la tuile située en (colonne, ligne).
const tileCenter = (index) => index * TILE_SIZE + TILE_SIZE / 2;

// Premier dessin de la marche dans une direction : c'est aussi la pose à l'arrêt.
const firstFrame = (direction) => DIRECTIONS[direction].sheetRow * PLAYER_SHEET_COLUMNS;

export class RoomScene extends Phaser.Scene {
  constructor() {
    super('room');
  }

  preload() {
    this.load.spritesheet('player', 'assets/character.png', {
      frameWidth: PLAYER_FRAME.width,
      frameHeight: PLAYER_FRAME.height,
    });
    this.load.spritesheet('tiles', 'assets/overworld.png', {
      frameWidth: TILE_SIZE,
      frameHeight: TILE_SIZE,
    });
  }

  create() {
    const walls = this.physics.add.staticGroup();
    let start = null;

    FIRST_ROOM.forEach((line, row) => {
      [...line].forEach((tile, column) => {
        const x = tileCenter(column);
        const y = tileCenter(row);
        const frame = tile === '#' ? TILES.wall : TILES.floor;
        const image = this.add.image(x, y, 'tiles', frame);

        if (tile === '#') walls.add(image);
        if (tile === 'P') start = { x, y };
      });
    });

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
    this.physics.add.collider(this.player, walls);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.heldDirections = []; // de la plus ancienne à la plus récente
    this.facing = 'down';
  }

  update() {
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
  }
}
