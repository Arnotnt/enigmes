import * as Phaser from 'phaser';
import { TORCH_NEXT_ROUND_DELAY } from '../constants.js';
import { Door } from '../objects/Door.js';
import { Torch } from '../objects/Torch.js';
import { SPOKEN_SOUNDS } from '../reading/sounds.js';
import { speak } from '../speech.js';
import { dialogBox } from '../ui/DialogBox.js';

const propertyOf = (object, name) => object.properties.find((item) => item.name === name).value;

// Énigme : écouter un son, puis aller à la torche qui porte la bonne lettre.
// Une erreur ne coûte rien : le son est simplement répété.
export class SoundPuzzle {
  constructor(scene, map, player, solved, onSolved) {
    this.scene = scene;
    this.onSolved = onSolved;
    this.solved = solved;

    const doorSpot = map.findObject('objets', (object) => object.name === 'porte');
    this.door = new Door(scene, doorSpot, player, solved);

    const spots = map.filterObjects('objets', (object) => object.name === 'torche');
    this.torches = spots.map((spot) => new Torch(scene, spot, player, propertyOf(spot, 'lettre')));
    if (solved) {
      this.torches.forEach((torch) => torch.light());
      return;
    }

    this.remaining = Phaser.Utils.Array.Shuffle(this.torches.map((torch) => torch.label));
    this.listenKey = scene.input.keyboard.addKey('SPACE');
    this.waiting = true; // pas de réponse possible avant d'avoir entendu le son
    scene.time.delayedCall(TORCH_NEXT_ROUND_DELAY, () => this.startRound());
  }

  get target() {
    return this.remaining[0];
  }

  startRound() {
    this.waiting = false;
    dialogBox.showPrompt(`Trouve le son : ${SPOKEN_SOUNDS[this.target]}.`);
    dialogBox.listen();
  }

  update() {
    if (this.solved) return;
    if (Phaser.Input.Keyboard.JustDown(this.listenKey)) dialogBox.listen();

    for (const torch of this.torches) {
      if (torch.justTouched() && !this.waiting) this.touch(torch);
    }
  }

  touch(torch) {
    if (torch.lit) return;
    if (torch.label !== this.target) {
      torch.shake();
      dialogBox.listen();
      return;
    }

    torch.light();
    this.remaining.shift();
    if (this.remaining.length === 0) {
      this.solve();
    } else {
      this.waiting = true;
      this.scene.time.delayedCall(TORCH_NEXT_ROUND_DELAY, () => this.startRound());
    }
  }

  solve() {
    this.solved = true;
    dialogBox.hide();
    speak('Bravo !');
    this.door.open();
    this.scene.cameras.main.shake(150, 0.004);
    this.onSolved();
  }
}
