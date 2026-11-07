import * as Phaser from 'phaser';
import { ADDITION_NEXT_DELAY, COMPARE_MAX, COMPARE_ROUNDS, ROOM_END_DELAY } from '../constants.js';
import { placeStones } from '../objects/placeStones.js';
import { Torch } from '../objects/Torch.js';
import { speak } from '../speech.js';
import { dialogBox } from '../ui/DialogBox.js';

// Tire deux nombres différents de 0 à `max` : il n'y a pas de torche « = ».
export function randomComparison(max = COMPARE_MAX) {
  const left = Phaser.Math.Between(0, max);
  let right;
  do {
    right = Phaser.Math.Between(0, max);
  } while (right === left);
  return { left, right, sign: left < right ? '<' : '>' };
}

// Devoir : allumer la torche du bon signe, < ou >, entre deux nombres. COMPARE_ROUNDS fois,
// puis la salle est finie. Une erreur ne coûte rien. Revenir dans la salle relance une série.
export class ComparePuzzle {
  // content : le devoir écrit dans le parcours. `max` est le plus grand nombre comparé.
  constructor(scene, map, player, solved, onSolved, content = {}) {
    this.scene = scene;
    this.solved = false; // jamais mémorisée : on peut revenir pour une nouvelle série

    const spots = placeStones(2);
    this.torches = ['<', '>'].map((sign, i) => new Torch(scene, spots[i], player, sign));
    this.max = content.max ?? COMPARE_MAX;

    this.listenKey = scene.input.keyboard.addKey('SPACE');
    this.roundsLeft = COMPARE_ROUNDS;
    this.startRound();
  }

  startRound() {
    // Avec deux torches, la même réponse revient souvent : le personnage peut rester devant.
    this.torches.forEach((torch) => {
      torch.extinguish();
      torch.rearm();
    });

    this.comparison = randomComparison(this.max);
    const { left, right } = this.comparison;
    this.waiting = false;
    dialogBox.showBanner(`${left}  …  ${right}`, `Quel signe va entre ${left} et ${right} ?`);
    dialogBox.listen();
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.listenKey)) dialogBox.listen();

    for (const torch of this.torches) {
      if (torch.justTouched() && !this.waiting) this.touch(torch);
    }
  }

  touch(torch) {
    const { left, right, sign } = this.comparison;
    if (torch.label !== sign) {
      torch.shake();
      dialogBox.listen();
      return;
    }

    this.waiting = true;
    torch.light();
    const words = sign === '<' ? 'plus petit que' : 'plus grand que';
    dialogBox.showBanner(`${left} ${sign} ${right}`, `${left} est ${words} ${right}.`);
    speak(`Bravo ! ${left} est ${words} ${right}.`);
    this.roundsLeft -= 1;
    const next = this.roundsLeft > 0 ? () => this.startRound() : () => this.endRoom();
    this.scene.time.delayedCall(ADDITION_NEXT_DELAY, next);
  }

  endRoom() {
    this.torches.forEach((torch) => torch.light());
    dialogBox.showBanner('Bravo !', 'Bravo ! Tu as réussi !');
    dialogBox.listen();
    this.scene.time.delayedCall(ROOM_END_DELAY, () => this.scene.finishRoom());
  }
}
