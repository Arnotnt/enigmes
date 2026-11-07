import * as Phaser from 'phaser';
import { stopMusic } from '../audio/sound.js';
import { Npc } from '../characters/Npc.js';
import {
  CORNER_ASSIST,
  PLAYER_HITBOX,
  PLAYER_SPEED,
  ROOM_FADE,
  ROOM_HEIGHT,
  ROOM_WIDTH,
  TILE_SIZE,
  VIEW_ZOOM,
} from '../constants.js';
import { DIRECTIONS, firstFrame } from '../directions.js';
import { AdditionPuzzle } from '../puzzles/AdditionPuzzle.js';
import { BlockPuzzle } from '../puzzles/BlockPuzzle.js';
import { ComparePuzzle } from '../puzzles/ComparePuzzle.js';
import { SoundPuzzle } from '../puzzles/SoundPuzzle.js';
import { SyllablePuzzle } from '../puzzles/SyllablePuzzle.js';
import { WordPuzzle } from '../puzzles/WordPuzzle.js';
import { markDayDone } from '../parcours/progress.js';
import { ROOM_DONE } from '../rooms.js';
import { feetOffset, mapProperty, sameTile, tileAt } from '../tiles.js';
import { backButton } from '../ui/BackButton.js';
import { dialogBox } from '../ui/DialogBox.js';

export const SOLVED_ROOMS = 'solvedRooms'; // liste gardée dans le registre, qui survit aux changements de salle

// La présence de ce point dans la carte indique l'énigme de la salle.
const PUZZLES = { bloc: BlockPuzzle, torche: SoundPuzzle, 'torche-nombre': AdditionPuzzle };

// Un devoir écrit dans le parcours (`devoir: 'mots'`…) choisit lui-même son énigme, dans
// n'importe quelle salle : la carte n'a alors besoin que de son décor et de ses murs.
const DEVOIRS = {
  additions: AdditionPuzzle,
  comparaisons: ComparePuzzle,
  mots: WordPuzzle,
  syllabes: SyllablePuzzle,
};

export class RoomScene extends Phaser.Scene {
  constructor() {
    super('room');
  }

  // data : le monde, la semaine et le jour en cours, puis `step`, la place de la salle dans la
  // journée. `entry` remplace le point d'arrivée prévu par la journée, `facing` est le regard.
  init({ world, week, day, step = 0, entry, facing = 'down' }) {
    this.world = world;
    this.week = week;
    this.day = day;
    this.step = step;
    this.room = day.rooms[step].room;
    this.entry = entry ?? day.rooms[step].entry;
    this.facing = facing;
    this.leaving = false;
  }

  create() {
    stopMusic(); // pas de musique dans les salles : l'enfant se concentre sur la lecture
    const width = ROOM_WIDTH * TILE_SIZE;
    const height = ROOM_HEIGHT * TILE_SIZE;
    this.physics.world.setBounds(0, 0, width, height);
    this.cameras.main.setZoom(VIEW_ZOOM).centerOn(width / 2, height / 2);

    const map = this.make.tilemap({ key: this.room });
    const tileset = map.addTilesetImage('overworld', 'tiles');
    const floor = map.createLayer('sol', tileset);
    this.walls = map.createLayer('murs', tileset);
    this.walls.setCollisionByExclusion([-1]); // toute tuile peinte sur ce calque bloque le passage

    // Une salle dessinée : la grande image remplace les tuiles, mais les murs bloquent toujours.
    const background = mapProperty(map, 'fond');
    if (background) {
      floor.setVisible(false);
      this.walls.setVisible(false);
      const image = this.add.image(0, 0, `fond-${background}`).setOrigin(0).setDisplaySize(width, height);
      image.setDepth(-1);
      // L'image est réduite dans le monde de la salle, puis la caméra l'agrandit 4 fois :
      // lissée, elle reste nette à l'écran. Le personnage, lui, garde ses pixels.
      image.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    }

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
    const lesson = this.day.rooms[this.step];
    const Puzzle = DEVOIRS[lesson.devoir] ?? PUZZLES[Object.keys(PUZZLES).find(findPoint)];
    if (lesson.devoir && !DEVOIRS[lesson.devoir]) console.warn(`Devoir inconnu : ${lesson.devoir}`);
    if (Puzzle) {
      const solvedRooms = this.registry.get(SOLVED_ROOMS) ?? [];
      const onSolved = () => this.registry.set(SOLVED_ROOMS, [...solvedRooms, this.room]);
      const solved = solvedRooms.includes(this.room);
      this.puzzle = new Puzzle(this, map, this.player, solved, onSolved, lesson);
    }

    const npcSpot = findPoint('pnj');
    this.npc = npcSpot ? new Npc(this, npcSpot, this.player) : null;

    // Une sortie vers une salle qui n'est pas dans la journée reste fermée.
    this.exits = map
      .filterObjects('objets', (object) => object.name === 'sortie')
      .filter((exit) => this.exitTarget(exit) === ROOM_DONE || this.stepOf(this.exitTarget(exit)) !== -1);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.backKey = this.input.keyboard.addKey('ESC');
    backButton.show(() => this.backToWeek());
    this.heldDirections = []; // de la plus ancienne à la plus récente
    this.cameras.main.fadeIn(ROOM_FADE);
  }

  update(time, delta) {
    if (this.leaving) return;
    if (Phaser.Input.Keyboard.JustDown(this.backKey)) {
      this.backToWeek();
      return;
    }

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

  exitTarget(exit) {
    return exit.properties.find((item) => item.name === 'salle').value;
  }

  stepOf(room) {
    return this.day.rooms.findIndex((item) => item.room === room);
  }

  get journey() {
    return { world: this.world, week: this.week, day: this.day };
  }

  leaveRoom(exit) {
    const target = this.exitTarget(exit);
    if (target === ROOM_DONE) {
      this.finishRoom();
      return;
    }

    const entry = exit.properties.find((item) => item.name === 'arrivee').value;
    const data = { ...this.journey, step: this.stepOf(target), entry, facing: this.facing };
    this.fadeOut(() => this.scene.restart(data));
  }

  // Le devoir de la salle est fait : salle suivante, ou fin de la journée.
  finishRoom() {
    if (this.leaving) return;
    const step = this.step + 1;
    if (step < this.day.rooms.length) {
      this.fadeOut(() => this.scene.restart({ ...this.journey, step }));
      return;
    }

    // C'est le seul endroit qui fait avancer le parcours.
    markDayDone(this.week, this.day);
    this.fadeOut(() => this.scene.start('week', { ...this.journey, finished: this.day }));
  }

  // Revenir au temple ne coûte rien : on recommencera ce jour plus tard.
  backToWeek() {
    if (this.leaving) return;
    this.fadeOut(() => this.scene.start('week', { world: this.world, week: this.week }));
  }

  fadeOut(next) {
    this.leaving = true;
    this.stopPlayer();
    this.time.removeAllEvents(); // une annonce prévue ne doit pas arriver après avoir quitté la salle
    dialogBox.hide();
    backButton.hide();

    this.cameras.main.fadeOut(ROOM_FADE);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, next);
  }
}
