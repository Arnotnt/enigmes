import * as Phaser from 'phaser';
import { ROOM_END_DELAY, TORCH_NEXT_ROUND_DELAY, VOWEL_ROUNDS } from '../constants.js';
import { placeRow, ROWS } from '../objects/placeStones.js';
import { Torch } from '../objects/Torch.js';
import { SPOKEN_SOUNDS } from '../reading/sounds.js';
import { speak } from '../speech.js';
import { dialogBox } from '../ui/DialogBox.js';

// Ce que la voix dit pour faire entendre le son d'une lettre : « o » seul serait lu « ouest ».
const spoken = (letter) => SPOKEN_SOUNDS[letter] ?? letter;

// Devoir de lecture `sons` : entendre une voyelle, puis toucher la stèle de sa lettre.
// VOWEL_ROUNDS sons au hasard, jamais le même deux fois de suite, puis la salle est finie.
// Une erreur fait trembler la stèle et redit le son. Revenir dans la salle relance une série.
export class VowelPuzzle {
  // content : le devoir écrit dans le parcours. `sons` est la liste des lettres, par exemple
  // ['a', 'i', 'o'] : une stèle par lettre, sur une ligne au milieu de la salle.
  constructor(scene, map, player, solved, onSolved, content = {}) {
    this.scene = scene;
    this.solved = false; // jamais mémorisée : on peut revenir pour une nouvelle série

    const letters = [...new Set(content.sons ?? [])];
    const spots = placeRow(letters.length, ROWS[1][0]);
    this.torches = Phaser.Utils.Array.Shuffle([...letters]).map(
      (letter, i) => new Torch(scene, spots[i], player, letter),
    );

    this.remaining = pickRounds(letters, VOWEL_ROUNDS);
    this.listenKey = scene.input.keyboard.addKey('SPACE');
    this.waiting = true; // pas de réponse possible avant d'avoir entendu le son
    scene.time.delayedCall(TORCH_NEXT_ROUND_DELAY, () => this.startRound());
  }

  get target() {
    return this.remaining[0];
  }

  startRound() {
    this.torches.forEach((torch) => {
      torch.extinguish();
      torch.rearm();
    });
    this.waiting = false;
    // Le son n'est pas écrit : l'enfant l'entend, puis cherche sa lettre sur les stèles.
    dialogBox.showPrompt(spoken(this.target));
    dialogBox.listen();
  }

  update() {
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
    this.waiting = true;
    dialogBox.showBanner(this.target, spoken(this.target));
    speak(`Bravo ! ${spoken(this.target)}.`);
    this.remaining.shift();
    const next = this.remaining.length > 0 ? () => this.startRound() : () => this.endRoom();
    this.scene.time.delayedCall(TORCH_NEXT_ROUND_DELAY * 3, next);
  }

  endRoom() {
    dialogBox.showBanner('Bravo !', 'Bravo ! Tu as réussi !');
    dialogBox.listen();
    this.scene.time.delayedCall(ROOM_END_DELAY, () => this.scene.finishRoom());
  }
}

// `count` lettres tirées au hasard, sans que la même revienne deux fois de suite
// (sauf s'il n'y en a qu'une : le héros est encore devant la stèle qu'il vient d'allumer).
function pickRounds(letters, count) {
  const rounds = [];
  while (letters.length > 0 && rounds.length < count) {
    const choices = letters.length > 1 ? letters.filter((letter) => letter !== rounds.at(-1)) : letters;
    rounds.push(Phaser.Utils.Array.GetRandom(choices));
  }
  return rounds;
}
