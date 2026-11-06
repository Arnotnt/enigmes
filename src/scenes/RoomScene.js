import * as Phaser from 'phaser';
import { COLORS, PLAYER_SIZE, PLAYER_SPEED, TILE_SIZE } from '../constants.js';
import { FIRST_ROOM } from '../rooms.js';

const DIRECTIONS = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
};

// Centre, en pixels, de la tuile située en (colonne, ligne).
const tileCenter = (index) => index * TILE_SIZE + TILE_SIZE / 2;

export class RoomScene extends Phaser.Scene {
  constructor() {
    super('room');
  }

  create() {
    const walls = this.physics.add.staticGroup();
    let start = null;

    FIRST_ROOM.forEach((line, row) => {
      [...line].forEach((tile, column) => {
        const x = tileCenter(column);
        const y = tileCenter(row);
        const color = tile === '#' ? COLORS.wall : COLORS.floor;
        const rectangle = this.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, color);

        if (tile === '#') walls.add(rectangle);
        if (tile === 'P') start = { x, y };
      });
    });

    this.player = this.add.rectangle(start.x, start.y, PLAYER_SIZE, PLAYER_SIZE, COLORS.player);
    this.physics.add.existing(this.player);
    this.physics.add.collider(this.player, walls);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.heldDirections = []; // de la plus ancienne à la plus récente
  }

  update() {
    // Une seule direction à la fois, jamais en diagonale : la dernière touche enfoncée gagne.
    for (const name of Object.keys(DIRECTIONS)) {
      const key = this.cursors[name];
      if (Phaser.Input.Keyboard.JustDown(key)) this.heldDirections.push(name);
      if (key.isUp) this.heldDirections = this.heldDirections.filter((held) => held !== name);
    }

    const current = DIRECTIONS[this.heldDirections.at(-1)] ?? { x: 0, y: 0 };
    this.player.body.setVelocity(current.x * PLAYER_SPEED, current.y * PLAYER_SPEED);
  }
}
