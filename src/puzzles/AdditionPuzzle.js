import * as Phaser from 'phaser';
import {
  ADDITION_ANSWER_MAX,
  ADDITION_MAX,
  ADDITION_NEXT_DELAY,
  ADDITION_ROUNDS,
  ROOM_END_DELAY,
} from '../constants.js';
import { placeStones } from '../objects/placeStones.js';
import { Torch } from '../objects/Torch.js';
import { speak } from '../speech.js';
import { dialogBox } from '../ui/DialogBox.js';

// Tire une addition a + ? = total, sans dépasser `max` et sans le cas vide 0 + 0 = 0.
// Le nombre à trouver reste entre 0 et ADDITION_ANSWER_MAX : ce sont les torches de la salle.
export function randomAddition(max = ADDITION_MAX) {
  const total = Phaser.Math.Between(1, max);
  const missing = Phaser.Math.Between(0, Math.min(total, ADDITION_ANSWER_MAX));
  return { first: total - missing, total, missing };
}

// Devoir : allumer la torche du nombre manquant, ADDITION_ROUNDS fois, puis la salle est finie.
// Une erreur ne coûte rien. Revenir dans la salle relance une série d'additions tirées au hasard.
export class AdditionPuzzle {
  // content : le devoir écrit dans le parcours. `max` est le total le plus grand.
  constructor(scene, map, player, solved, onSolved, content = {}) {
    this.scene = scene;
    this.solved = false; // jamais mémorisée : on peut revenir pour une nouvelle série

    // Une stèle par réponse possible, de 0 à ADDITION_ANSWER_MAX, placées par le jeu.
    const labels = Array.from({ length: ADDITION_ANSWER_MAX + 1 }, (_, n) => String(n));
    const spots = placeStones(labels.length);
    this.torches = labels.map((label, i) => new Torch(scene, spots[i], player, label));

    this.max = content.max ?? ADDITION_MAX;
    this.listenKey = scene.input.keyboard.addKey('SPACE');
    this.addition = null;
    this.roundsLeft = ADDITION_ROUNDS;
    this.startRound();
  }

  startRound() {
    this.torches.forEach((torch) => torch.extinguish());

    // Jamais deux fois de suite la même réponse : le personnage est encore contre cette torche,
    // et il devrait s'en écarter puis revenir pour que le jeu la prenne en compte.
    const previous = this.addition;
    do {
      this.addition = randomAddition(this.max);
    } while (previous && this.addition.missing === previous.missing);

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
