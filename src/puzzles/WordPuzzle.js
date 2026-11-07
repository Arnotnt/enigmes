import * as Phaser from 'phaser';
import { ROOM_END_DELAY, TORCH_NEXT_ROUND_DELAY } from '../constants.js';
import { placeStones } from '../objects/placeStones.js';
import { Torch } from '../objects/Torch.js';
import { speak } from '../speech.js';
import { dialogBox } from '../ui/DialogBox.js';

// Devoir de lecture : écouter un mot, puis aller au panneau où il est écrit. Chaque mot de la
// salle est demandé une fois, dans le désordre, puis la salle est finie.
// Le mot n'est jamais affiché dans la consigne : il faut lire les panneaux. Une erreur ne coûte
// rien : le mot est simplement redit. Revenir dans la salle relance une série.
export class WordPuzzle {
  // content : le devoir écrit dans le parcours. `mots` est la liste des mots à trouver.
  constructor(scene, map, player, solved, onSolved, content = {}) {
    this.scene = scene;
    this.solved = false; // jamais mémorisée : on peut revenir pour une nouvelle série

    // Les mots sont mélangés pour que leur place ne suive pas l'ordre du parcours.
    const words = Phaser.Utils.Array.Shuffle([...(content.mots ?? [])]);
    const spots = placeStones(words.length, { spacing: 3 }); // un mot est plus large qu'une lettre
    this.torches = words.map((word, i) => new Torch(scene, spots[i], player, word));

    this.remaining = Phaser.Utils.Array.Shuffle(this.torches.map((torch) => torch.label));
    this.listenKey = scene.input.keyboard.addKey('SPACE');
    this.waiting = true; // pas de réponse possible avant d'avoir entendu le mot
    scene.time.delayedCall(TORCH_NEXT_ROUND_DELAY, () => this.startRound());
  }

  get target() {
    return this.remaining[0];
  }

  startRound() {
    this.torches.forEach((torch) => torch.rearm());
    this.waiting = false;
    dialogBox.showPrompt(`Trouve le mot : ${this.target}.`);
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

    this.waiting = true;
    torch.light();
    speak(`Bravo ! C'est écrit ${this.target}.`);
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
