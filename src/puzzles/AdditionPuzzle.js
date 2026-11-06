import * as Phaser from 'phaser';
import { ADDITION_MAX, ADDITION_NEXT_DELAY } from '../constants.js';
import { Torch } from '../objects/Torch.js';
import { speak } from '../speech.js';
import { dialogBox } from '../ui/DialogBox.js';

const propertyOf = (object, name) => object.properties.find((item) => item.name === name).value;

// Tire une addition a + ? = total, sans dépasser ADDITION_MAX et sans le cas vide 0 + 0 = 0.
export function randomAddition() {
  const total = Phaser.Math.Between(1, ADDITION_MAX);
  const first = Phaser.Math.Between(0, total);
  return { first, total, missing: total - first };
}

// Énigme : allumer la torche du nombre manquant. Une erreur ne coûte rien, et chaque
// addition trouvée en amène une nouvelle : on peut s'entraîner autant qu'on veut.
export class AdditionPuzzle {
  constructor(scene, map, player) {
    this.scene = scene;
    this.solved = false; // jamais définitivement résolue : le personnage peut rester s'entraîner

    const spots = map.filterObjects('objets', (object) => object.name === 'torche-nombre');
    this.torches = spots.map((spot) => new Torch(scene, spot, player, propertyOf(spot, 'nombre')));

    this.listenKey = scene.input.keyboard.addKey('SPACE');
    this.addition = null;
    this.startRound();
  }

  startRound() {
    this.torches.forEach((torch) => torch.extinguish());

    // Jamais deux fois de suite la même addition.
    const previous = this.addition;
    do {
      this.addition = randomAddition();
    } while (previous && this.addition.first === previous.first && this.addition.total === previous.total);

    const { first, total } = this.addition;
    this.waiting = false;
    dialogBox.showBanner(`${first} + ... = ${total}`, `${first} plus combien égale ${total} ?`);
    dialogBox.listen();
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.listenKey)) dialogBox.listen();

    for (const torch of this.torches) {
      if (torch.justTouched() && !this.waiting) this.touch(torch);
    }
  }

  touch(torch) {
    const { first, missing, total } = this.addition;
    if (Number(torch.label) !== missing) {
      torch.shake();
      dialogBox.listen();
      return;
    }

    this.waiting = true;
    torch.light();
    dialogBox.showBanner(`${first} + ${missing} = ${total}`, `${first} plus ${missing} égale ${total}.`);
    speak(`Bravo ! ${first} plus ${missing} égale ${total}.`);
    this.scene.time.delayedCall(ADDITION_NEXT_DELAY, () => this.startRound());
  }
}
