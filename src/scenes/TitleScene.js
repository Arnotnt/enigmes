import * as Phaser from 'phaser';
import { MAP_MUSIC } from '../audio/musics.js';
import { playMusic } from '../audio/sound.js';
import { GAME_HEIGHT, GAME_TITLE, GAME_WIDTH, MAP_HERO_SCALE, PLAYER_TEXTURE_SCALE, ROOM_FADE } from '../constants.js';
import { standingFrame } from '../directions.js';
import { ATLAS } from '../parcours/places.js';
import { dialogBox } from '../ui/DialogBox.js';

const START_TEXT = 'Appuie sur Entrée pour jouer.';

// L'écran de démarrage. La musique est demandée dès l'arrivée : le navigateur la lance tout de
// suite s'il le permet, sinon au premier appui sur une touche ou au premier clic (il refuse le son
// tant qu'on n'a touché à rien).
export class TitleScene extends Phaser.Scene {
  constructor() {
    super('title');
  }

  create() {
    this.leaving = false;

    // La carte des mondes en fond, un peu voilée pour que le titre ressorte.
    const background = this.add.image(0, 0, ATLAS.key).setOrigin(0).setScale(GAME_WIDTH / ATLAS.width);
    background.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x2b2118, 0.35).setOrigin(0);

    const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.27, GAME_TITLE, {
      fontFamily: 'Andika',
      fontSize: 84,
      align: 'center',
      lineSpacing: -6,
      color: '#fff8e7',
      stroke: '#6b4a2f',
      strokeThickness: 14,
    });
    title.setOrigin(0.5).setResolution(2);
    this.tweens.add({ targets: title, y: title.y - 8, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

    // Le personnage attend le départ, et sautille de temps en temps.
    const hero = this.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT * 0.58, 'player', standingFrame('down'));
    hero.setScale((MAP_HERO_SCALE * 1.4) / PLAYER_TEXTURE_SCALE);
    this.tweens.add({ targets: hero, y: hero.y - 12, duration: 220, yoyo: true, repeat: -1, repeatDelay: 1600 });

    playMusic(MAP_MUSIC);
    dialogBox.show(START_TEXT);
    this.enterKey = this.input.keyboard.addKey('ENTER');
    this.listenKey = this.input.keyboard.addKey('SPACE');
    this.cameras.main.fadeIn(ROOM_FADE);
  }

  update() {
    if (this.leaving) return;
    const { JustDown } = Phaser.Input.Keyboard;
    if (JustDown(this.listenKey)) dialogBox.listen();
    else if (JustDown(this.enterKey)) this.start();
  }

  start() {
    this.leaving = true;
    dialogBox.hide();
    this.cameras.main.fadeOut(ROOM_FADE);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('atlas'));
  }
}
