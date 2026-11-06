import * as Phaser from 'phaser';
import { Npc } from '../characters/Npc.js';
import { CORNER_ASSIST, PLAYER_HITBOX, PLAYER_SPEED, ROOM_FADE, TILE_SIZE } from '../constants.js';
import { DIRECTIONS, firstFrame } from '../directions.js';
import { AdditionPuzzle } from '../puzzles/AdditionPuzzle.js';
import { BlockPuzzle } from '../puzzles/BlockPuzzle.js';
import { SoundPuzzle } from '../puzzles/SoundPuzzle.js';
import { FIRST_ENTRY, FIRST_ROOM } from '../rooms.js';
import { feetOffset, sameTile, tileAt } from '../tiles.js';
import { dialogBox } from '../ui/DialogBox.js';

const SOLVED_ROOMS = 'solvedRooms'; // liste gardée dans le registre, qui survit aux changements de salle

// La présence de ce point dans la carte indique l'énigme de la salle.
const PUZZLES = { bloc: BlockPuzzle, torche: SoundPuzzle, 'torche-nombre': AdditionPuzzle };

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
    this.walls = map.createLayer('murs', tileset);
    this.walls.setCollisionByExclusion([-1]); // toute tuile peinte sur ce calque bloque le passage

    const findPoint = (name) => map.findObject('objets', (object) => object.name === name);
    const start = findPoint(this.entry);

    // Le point d'arrivée désigne l'emplacement des pieds, pas le centre du dessin.
    this.player = this.physics.add.sprite(start.x, start.y - feetOffset(), 'player', firstFrame(this.facing));
    this.player.body.setSize(PLAYER_HITBOX.width, PLAYER_HITBOX.height);
    this.player.body.setOffset(PLAYER_HITBOX.offsetX, PLAYER_HITBOX.offsetY);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(1); // toujours dessiné devant le bloc et la porte
    this.physics.add.collider(this.player, this.walls);

    this.puzzle = null;
    const puzzleMarker = Object.keys(PUZZLES).find(findPoint);
    if (puzzleMarker) {
      const solvedRooms = this.registry.get(SOLVED_ROOMS) ?? [];
      this.puzzle = new PUZZLES[puzzleMarker](this, map, this.player, solvedRooms.includes(this.room), () => {
        this.registry.set(SOLVED_ROOMS, [...solvedRooms, this.room]);
      });
    }

    const npcSpot = findPoint('pnj');
    this.npc = npcSpot ? new Npc(this, npcSpot, this.player) : null;

    this.exits = map.filterObjects('objets', (object) => object.name === 'sortie');

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
      const slide = this.cornerSlide(name);
      this.player.body.setVelocity((x + slide.x) * PLAYER_SPEED, (y + slide.y) * PLAYER_SPEED);
      this.player.anims.play(`walk-${name}`, true);
    } else {
      this.stopPlayer();
    }

    this.puzzle?.update(delta, DIRECTIONS[name]);
    // Pendant une énigme des sons, le personnage se tait pour ne pas couvrir le son à écouter.
    if (!this.puzzle || this.puzzle.solved) this.npc?.update();

    const feet = tileAt(this.player.body.center);
    const exit = this.exits.find((item) => sameTile(feet, tileAt(item)));
    if (exit) this.leaveRoom(exit);
  }

  // Quand un mur bloque le personnage juste à côté d'une ouverture, le fait glisser vers elle.
  // Sinon il faudrait s'aligner au pixel près : le passage est à peine plus large que lui.
  cornerSlide(name) {
    const none = { x: 0, y: 0 };
    const { body } = this.player;
    if (!body.blocked[name]) return none;

    const { x, y } = DIRECTIONS[name];
    const across = { x: y === 0 ? 0 : 1, y: x === 0 ? 0 : 1 }; // axe perpendiculaire à la marche
    const feet = tileAt(body.center);

    for (const offset of [0, -1, 1]) {
      const column = feet.column + x + across.x * offset;
      const row = feet.row + y + across.y * offset;
      if (this.walls.getTileAt(column, row)) continue;

      const center = (index) => index * TILE_SIZE + TILE_SIZE / 2;
      const gap = across.x ? center(column) - body.center.x : center(row) - body.center.y;
      if (Math.abs(gap) < 2 || Math.abs(gap) > CORNER_ASSIST) continue; // déjà aligné, ou trop loin

      const step = Math.sign(gap);
      return { x: across.x * step, y: across.y * step };
    }
    return none;
  }

  stopPlayer() {
    this.player.body.setVelocity(0, 0);
    this.player.anims.stop();
    this.player.setFrame(firstFrame(this.facing));
  }

  leaveRoom(exit) {
    this.leaving = true;
    this.stopPlayer();
    this.time.removeAllEvents(); // une annonce prévue ne doit pas arriver après avoir quitté la salle
    dialogBox.hide();

    const property = (name) => exit.properties.find((item) => item.name === name).value;
    const room = property('salle');
    const entry = property('arrivee');

    this.cameras.main.fadeOut(ROOM_FADE);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.restart({ room, entry, facing: this.facing });
    });
  }
}
