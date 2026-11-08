import * as Phaser from 'phaser';
import {
  GAME_WIDTH,
  MAP_EXIT_WALK,
  MAP_GLIDE_SPEED,
  MAP_HERO_SCALE,
  MAP_STOP_RADIUS,
  PLAYER_FRAME,
  PLAYER_TEXTURE_SCALE,
  ROOM_FADE,
} from '../constants.js';
import { playStep } from '../audio/sound.js';
import { heroTexture, walkAnimation } from '../characters/costumes.js';
import { standingFrame } from '../directions.js';
import { feetOffset } from '../tiles.js';
import { dialogBox } from '../ui/DialogBox.js';

const STOP_COLORS = { done: 0x4f8a5b, open: 0xf2c14e, closed: 0x8a8378, empty: 0xc9d6df };
const TEXT_COLORS = { done: '#fff8e7', open: '#2b2118', closed: '#fff8e7', empty: '#2b2118' };
const STOP_MARKS = { done: '✓', empty: '–' }; // à la place du numéro ou du nom

const direction = (from, to) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left';
  return dy > 0 ? 'down' : 'up';
};

// Base des deux cartes illustrées : le personnage glisse de point en point sur un chemin.
// Une carte fille appelle buildMap, puis fournit describe, enter et closedText.
export class PathMapScene extends Phaser.Scene {
  // stops : [{ label, state }], state valant 'done', 'open', 'closed' ou 'empty' (un jour sans devoir).
  buildMap(place, stops, startIndex) {
    this.stopsData = stops;
    this.current = startIndex;
    this.route = null;
    this.leaving = false;
    this.exiting = false; // vrai quand le personnage sort par un bout du chemin

    const scale = GAME_WIDTH / place.width;
    this.path = place.path.map(([x, y]) => new Phaser.Math.Vector2(x * scale, y * scale));
    this.stopPoints = place.stops;

    const background = this.add.image(0, 0, place.key).setOrigin(0).setScale(scale);
    background.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);

    stops.forEach((stop, index) => this.drawStop(this.path[place.stops[index]], stop));

    const start = this.path[place.stops[startIndex]];
    // Le costume du monde ouvert ; la carte des mondes n'a pas de monde : l'explorateur.
    this.hero = this.add.sprite(start.x, start.y, heroTexture(this.world), standingFrame('down'));
    this.hero.setScale(MAP_HERO_SCALE / PLAYER_TEXTURE_SCALE);
    this.hero.setOrigin(0.5, 0.5 + feetOffset() / PLAYER_FRAME.height); // le point est sous ses pieds

    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey('ENTER');
    this.listenKey = this.input.keyboard.addKey('SPACE');
    this.backKey = this.input.keyboard.addKey('ESC');
    this.cameras.main.fadeIn(ROOM_FADE);
  }

  drawStop({ x, y }, { label, state }) {
    this.add.circle(x, y, MAP_STOP_RADIUS, STOP_COLORS[state]).setStrokeStyle(3, 0x2b2118);
    const text = STOP_MARKS[state] ?? label;
    const size = text.length > 2 ? 17 : 24;
    const color = text.length > 2 ? '#2b2118' : TEXT_COLORS[state];
    const item = this.add.text(x, y, text, { fontFamily: 'Andika', fontSize: size, color }).setOrigin(0.5);
    item.setResolution(2);
    if (text.length > 2) {
      // Un nom de jour dépasse du point : il se lit sur une étiquette, sous le point.
      item.setY(y + MAP_STOP_RADIUS + 14).setBackgroundColor('#fff8e7').setPadding(6, 1);
    }
  }

  get lastReachable() {
    const firstClosed = this.stopsData.findIndex((stop) => stop.state === 'closed');
    return firstClosed === -1 ? this.stopsData.length - 1 : firstClosed - 1;
  }

  move(step) {
    const target = this.current + step;
    if ((target < 0 || target >= this.stopsData.length) && this.exitsBy(step)) {
      this.walkOut(step);
      return;
    }
    if (target < 0) return;
    if (target > this.lastReachable) {
      this.say(this.closedText(target >= this.stopsData.length ? null : target));
      return;
    }

    const from = this.stopPoints[this.current];
    const to = this.stopPoints[target];
    const route = step > 0 ? this.path.slice(from + 1, to + 1) : this.path.slice(to, from).reverse();
    this.route = route;
    this.routeStep = 0;
    this.current = target;
    playStep();
  }

  // Vrai si dépasser ce bout du chemin (-1 : avant le premier point, 1 : après le dernier) ramène
  // à la carte précédente, comme Échap. Chaque carte choisit ses bouts.
  exitsBy() {
    return false;
  }

  // Le personnage sort de la carte : vers la gauche par le début du chemin, ou dans le
  // prolongement du chemin par la fin. Arrivé au bout, il quitte la carte sans rien valider.
  walkOut(step) {
    const here = this.path[this.stopPoints[this.current]];
    let way = new Phaser.Math.Vector2(-1, 0);
    if (step > 0) {
      const before = this.path[this.stopPoints[this.current] - 1] ?? here;
      way = here.clone().subtract(before);
      if (way.length() === 0) way.set(1, 0);
    }
    this.route = [here.clone().add(way.normalize().scale(MAP_EXIT_WALK))];
    this.routeStep = 0;
    this.exiting = true;
    dialogBox.hide();
    playStep();
  }

  // Avance le long du chemin, à vitesse constante, même dans les virages.
  glide(delta) {
    let distance = (MAP_GLIDE_SPEED * delta) / 1000;
    while (distance > 0 && this.routeStep < this.route.length) {
      const next = this.route[this.routeStep];
      const left = Phaser.Math.Distance.BetweenPoints(this.hero, next);
      this.hero.anims.play(walkAnimation(this.hero.texture.key, direction(this.hero, next)), true);
      if (left <= distance) {
        this.hero.setPosition(next.x, next.y);
        this.routeStep += 1;
        distance -= left;
      } else {
        const ratio = distance / left;
        this.hero.x += (next.x - this.hero.x) * ratio;
        this.hero.y += (next.y - this.hero.y) * ratio;
        distance = 0;
      }
    }

    if (this.routeStep === this.route.length) {
      this.route = null;
      if (this.exiting) {
        this.goBack();
        return;
      }
      this.hero.anims.stop();
      this.hero.setFrame(standingFrame('down'));
      this.say(this.describe(this.current));
    }
  }

  say({ text, speech = text }) {
    dialogBox.showCaption(text, speech);
    dialogBox.listen();
  }

  update(time, delta) {
    if (this.leaving) return;
    if (this.route) {
      this.glide(delta);
      return;
    }

    const { JustDown } = Phaser.Input.Keyboard;
    if (JustDown(this.backKey)) this.goBack();
    else if (JustDown(this.cursors.right)) this.move(1);
    else if (JustDown(this.cursors.left)) this.move(-1);
    else if (JustDown(this.listenKey)) dialogBox.listen();
    else if (JustDown(this.enterKey)) this.enter(this.current);
  }

  // À la fin du fondu, next ouvre l'écran suivant.
  leave(next) {
    if (this.leaving) return;
    this.leaving = true;
    dialogBox.hide();
    this.cameras.main.fadeOut(ROOM_FADE);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, next);
  }

  goBack() {}
}
