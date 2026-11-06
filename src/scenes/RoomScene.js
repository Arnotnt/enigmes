import * as Phaser from 'phaser';
import { Npc } from '../characters/Npc.js';
import { PLAYER_HITBOX, PLAYER_SPEED, ROOM_FADE } from '../constants.js';
import { DIRECTIONS, firstFrame } from '../directions.js';
import { BlockPuzzle } from '../puzzles/BlockPuzzle.js';
import { FIRST_ENTRY, FIRST_ROOM } from '../rooms.js';
import { feetOffset, sameTile, tileAt } from '../tiles.js';
import { dialogBox } from '../ui/DialogBox.js';

const SOLVED_ROOMS = 'solvedRooms'; // liste gardée dans le registre, qui survit aux changements de salle

export class RoomScene extends Phaser.Scene {
  constructor() {
    super('room');
  }

  // data : la salle à afficher, le point d'arrivée et le regard du personnage.
  init({ room = FIRST_ROOM, entry = FIRST_ENTRY, facing = 'down' }) {
    this.room = room;
    this.entry = entry;
    this.facing = facing;
    this.leaving = false;
  }

  create() {
    const map = this.make.tilemap({ key: this.room });
    const tileset = map.addTilesetImage('overworld', 'tiles');
    map.createLayer('sol', tileset);
    const walls = map.createLayer('murs', tileset);
    walls.setCollisionByExclusion([-1]); // toute tuile peinte sur ce calque bloque le passage

    const findPoint = (name) => map.findObject('objets', (object) => object.name === name);
    const start = findPoint(this.entry);

    // Le point d'arrivée désigne l'emplacement des pieds, pas le centre du dessin.
    this.player = this.physics.add.sprite(start.x, start.y - feetOffset(), 'player', firstFrame(this.facing));
    this.player.body.setSize(PLAYER_HITBOX.width, PLAYER_HITBOX.height);
    this.player.body.setOffset(PLAYER_HITBOX.offsetX, PLAYER_HITBOX.offsetY);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(1); // toujours dessiné devant le bloc et la porte
    this.physics.add.collider(this.player, walls);

    this.puzzle = null;
    if (findPoint('bloc')) {
      const solvedRooms = this.registry.get(SOLVED_ROOMS) ?? [];
      this.puzzle = new BlockPuzzle(this, map, this.player, solvedRooms.includes(this.room), () => {
        this.registry.set(SOLVED_ROOMS, [...solvedRooms, this.room]);
      });
    }

    const npcSpot = findPoint('pnj');
    this.npc = npcSpot ? new Npc(this, npcSpot, this.player) : null;

    this.exit = findPoint('sortie');

    this.cursors = this.input.keyboard.createCursorKeys();
    this.heldDirections = []; // de la plus ancienne à la plus récente
    this.cameras.main.fadeIn(ROOM_FADE);
  }

  update(time, delta) {
    if (this.leaving) return;

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
      this.stopPlayer();
    }

    this.puzzle?.update(delta, DIRECTIONS[name]);
    this.npc?.update();

    if (this.exit && sameTile(tileAt(this.player.body.center), tileAt(this.exit))) this.leaveRoom();
  }

  stopPlayer() {
    this.player.body.setVelocity(0, 0);
    this.player.anims.stop();
    this.player.setFrame(firstFrame(this.facing));
  }

  leaveRoom() {
    this.leaving = true;
    this.stopPlayer();
    dialogBox.hide();

    const property = (name) => this.exit.properties.find((item) => item.name === name).value;
    const room = property('salle');
    const entry = property('arrivee');

    this.cameras.main.fadeOut(ROOM_FADE);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.restart({ room, entry, facing: this.facing });
    });
  }
}
