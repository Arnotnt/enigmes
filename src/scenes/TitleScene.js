import * as Phaser from 'phaser';
import { MAP_MUSIC } from '../audio/musics.js';
import { playMusic, playStep } from '../audio/sound.js';
import {
  GAME_HEIGHT, GAME_TITLE, GAME_WIDTH, MAP_HERO_SCALE, PLAYER_NAME, PLAYER_TEXTURE_SCALE, ROOM_FADE,
} from '../constants.js';
import { heroTexture } from '../characters/costumes.js';
import { standingFrame } from '../directions.js';
import { chooseProfile } from '../parcours/progress.js';
import { ATLAS } from '../parcours/places.js';
import { dialogBox } from '../ui/DialogBox.js';

// Les sauvegardes. Celle de l'enfant est choisie d'office : il n'a qu'à appuyer sur Entrée.
// Admin ne s'affiche qu'avec ?admin dans l'adresse : l'enfant ne peut pas y entrer par erreur.
const ALL_PROFILES = [
  {
    id: 'joueur',
    name: PLAYER_NAME,
    detail: 'Ma partie',
    speech: `${PLAYER_NAME}. Appuie sur Entrée pour jouer.`,
    color: 0xfff8e7,
  },
  {
    id: 'admin',
    name: 'Admin',
    detail: 'Tout est ouvert',
    speech: 'Admin : tous les mondes sont ouverts.',
    color: 0xdfe6ee,
  },
];
const PROFILES = new URLSearchParams(window.location.search).has('admin') ? ALL_PROFILES : [ALL_PROFILES[0]];

const CARD = { width: 250, height: 110, gap: 60, y: GAME_HEIGHT * 0.66 };
const GOLD = 0xf2c14e;
const BROWN = 0x6b4a2f;

// L'écran de démarrage. La musique est demandée dès l'arrivée : le navigateur la lance tout de
// suite s'il le permet, sinon au premier appui sur une touche ou au premier clic (il refuse le son
// tant qu'on n'a touché à rien).
export class TitleScene extends Phaser.Scene {
  constructor() {
    super('title');
  }

  create() {
    this.leaving = false;
    this.selected = 0;

    // La carte des mondes en fond, un peu voilée pour que le titre ressorte.
    const background = this.add.image(0, 0, ATLAS.key).setOrigin(0).setScale(GAME_WIDTH / ATLAS.width);
    background.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x2b2118, 0.4).setOrigin(0);

    this.drawTitle();
    this.cards = PROFILES.map((profile, index) => this.drawCard(profile, index));

    // Le personnage se tient au-dessus de la sauvegarde choisie, et sautille de temps en temps.
    this.hero = this.add.sprite(this.cardX(0), CARD.y - CARD.height / 2 - 2, heroTexture(), standingFrame('down'));
    this.hero.setOrigin(0.5, 1).setScale((MAP_HERO_SCALE * 1.2) / PLAYER_TEXTURE_SCALE);
    this.tweens.add({ targets: this.hero, scaleY: this.hero.scaleY * 0.92, duration: 220, yoyo: true, repeat: -1, repeatDelay: 1600 });
    this.highlight();

    playMusic(MAP_MUSIC);
    dialogBox.show(PROFILES[0].speech, { autoSpeak: true });
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey('ENTER');
    this.listenKey = this.input.keyboard.addKey('SPACE');
    this.cameras.main.fadeIn(ROOM_FADE);
  }

  // Le titre sur deux lignes : « Le Tour du Monde » en crème, le prénom en grand et en or.
  drawTitle() {
    const [top, bottom] = GAME_TITLE.split('\n');
    const container = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT * 0.25);

    const first = this.add.text(0, -62, top, {
      fontFamily: 'Andika',
      fontStyle: 'bold',
      fontSize: 54,
      color: '#fff8e7',
      stroke: '#4a3220',
      strokeThickness: 10,
    });
    first.setOrigin(0.5).setResolution(2).setShadow(0, 5, '#1c140d', 0, true, false);

    const second = this.add.text(0, 30, bottom, {
      fontFamily: 'Andika',
      fontStyle: 'bold',
      fontSize: 104,
      stroke: '#4a3220',
      strokeThickness: 14,
    });
    second.setOrigin(0.5).setResolution(2).setShadow(0, 7, '#1c140d', 0, true, false);
    // Un dégradé doré, du jaune clair en haut à l'orange en bas.
    const gradient = second.context.createLinearGradient(0, 0, 0, second.height / second.style.resolution);
    gradient.addColorStop(0.2, '#fff3b0');
    gradient.addColorStop(0.55, '#f2c14e');
    gradient.addColorStop(0.9, '#d9822b');
    second.setFill(gradient);

    // Quelques étoiles qui scintillent autour du prénom.
    const stars = [[-250, 10, 1], [255, -10, 0.8], [-200, 80, 0.6], [220, 75, 0.7], [-300, -70, 0.5], [310, -80, 0.6]];
    const starItems = stars.map(([x, y, size], index) => {
      const star = this.add.star(x, y, 5, 6 * size, 16 * size, 0xfff3b0).setStrokeStyle(2, 0x4a3220);
      this.tweens.add({
        targets: star, scale: 0.4, alpha: 0.5, angle: 40, duration: 900, yoyo: true, repeat: -1,
        delay: index * 260, ease: 'Sine.InOut',
      });
      return star;
    });

    container.add([...starItems, first, second]);
    this.tweens.add({ targets: container, y: container.y - 8, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.tweens.add({ targets: second, angle: { from: -2, to: 2 }, duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }

  cardX(index) {
    if (PROFILES.length === 1) return GAME_WIDTH / 2;
    const offset = (CARD.width + CARD.gap) / 2;
    return GAME_WIDTH / 2 + (index === 0 ? -offset : offset);
  }

  // Une sauvegarde : une carte avec son nom. Un clic la choisit et lance la partie.
  drawCard(profile, index) {
    const x = this.cardX(index);
    const box = this.add.rectangle(x, CARD.y, CARD.width, CARD.height, profile.color).setStrokeStyle(6, BROWN);
    const name = this.add.text(x, CARD.y - 14, profile.name, {
      fontFamily: 'Andika', fontStyle: 'bold', fontSize: 40, color: '#2b2118',
    }).setOrigin(0.5).setResolution(2);
    const detail = this.add.text(x, CARD.y + 30, profile.detail, {
      fontFamily: 'Andika', fontSize: 20, color: '#6b4a2f',
    }).setOrigin(0.5).setResolution(2);

    box.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      if (this.leaving) return;
      this.select(index);
      this.start();
    });
    return { box, name, detail };
  }

  highlight() {
    this.cards.forEach(({ box, name, detail }, index) => {
      const on = index === this.selected;
      box.setStrokeStyle(on ? 8 : 5, on ? GOLD : BROWN).setAlpha(on ? 1 : 0.75);
      [box, name, detail].forEach((item) => item.setScale(on ? 1.06 : 1));
    });
  }

  select(index) {
    if (index === this.selected) return;
    this.selected = index;
    this.highlight();
    playStep();
    this.tweens.killTweensOf(this.hero, ['x']);
    this.hero.setFlipX(this.cardX(index) < this.hero.x);
    this.tweens.add({ targets: this.hero, x: this.cardX(index), duration: 250, ease: 'Sine.Out' });
    dialogBox.show(PROFILES[index].speech, { autoSpeak: true });
  }

  update() {
    if (this.leaving) return;
    const { JustDown } = Phaser.Input.Keyboard;
    if (JustDown(this.listenKey)) dialogBox.listen();
    else if (JustDown(this.enterKey)) this.start();
    else if (JustDown(this.cursors.left)) this.select(0);
    else if (JustDown(this.cursors.right)) this.select(PROFILES.length - 1);
  }

  start() {
    this.leaving = true;
    chooseProfile(PROFILES[this.selected].id);
    dialogBox.hide();
    this.cameras.main.fadeOut(ROOM_FADE);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('atlas'));
  }
}
