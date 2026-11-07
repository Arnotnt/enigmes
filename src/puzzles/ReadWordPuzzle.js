import * as Phaser from 'phaser';
import { READ_WORD_ROUNDS, ROOM_END_DELAY, TORCH_NEXT_ROUND_DELAY } from '../constants.js';
import { placeStones } from '../objects/placeStones.js';
import { Torch } from '../objects/Torch.js';
import { hasPicto, pictoKey } from '../reading/pictos.js';
import { speak } from '../speech.js';
import { dialogBox } from '../ui/DialogBox.js';

const INSTRUCTION = 'Lis le mot, puis va toucher son image.';

// Devoir de lecture : un mot s'affiche, sans être dit, et l'enfant va toucher la stèle de son
// image. C'est l'inverse du devoir `mots`. READ_WORD_ROUNDS mots, puis la salle est finie.
// Pour pousser à lire d'abord, l'écoute du mot n'arrive qu'après une première erreur.
// Une erreur ne coûte rien. Revenir dans la salle relance une série.
export class ReadWordPuzzle {
  // content : le devoir écrit dans le parcours. `mots` : les mots, qui ont chacun leur image
  // dans src/assets/pictos/. Toutes les images sont dans la salle ; 4 mots sont demandés.
  constructor(scene, map, player, solved, onSolved, content = {}) {
    this.scene = scene;
    this.solved = false; // jamais mémorisée : on peut revenir pour une nouvelle série

    const all = content.mots ?? [];
    const missing = all.filter((word) => !hasPicto(word));
    if (missing.length) console.warn(`Mots sans image, laissés de côté : ${missing.join(', ')}`);
    const words = Phaser.Utils.Array.Shuffle(all.filter(hasPicto));

    const spots = placeStones(words.length, { spacing: 3 }); // une image est plus large qu'une lettre
    this.torches = words.map((word, i) => new Torch(scene, spots[i], player, word, { picture: pictoKey(word) }));

    this.remaining = Phaser.Utils.Array.Shuffle([...words]).slice(0, READ_WORD_ROUNDS);
    this.listenKey = scene.input.keyboard.addKey('SPACE');
    this.waiting = true;

    // La consigne se dit une fois, au début : elle ne donne pas le mot.
    dialogBox.show(INSTRUCTION, { autoSpeak: true });
    scene.time.delayedCall(TORCH_NEXT_ROUND_DELAY * 3, () => this.startRound());
  }

  get target() {
    return this.remaining[0];
  }

  startRound() {
    this.torches.forEach((torch) => torch.rearm());
    this.waiting = false;
    // Le mot est écrit, mais pas lu : l'écoute reste cachée jusqu'à une erreur.
    dialogBox.showBanner(this.target, this.target);
    dialogBox.setListenable(false);
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
      // Après une erreur, l'enfant peut écouter le mot : il ne reste jamais bloqué.
      torch.shake();
      dialogBox.setListenable(true);
      return;
    }

    this.waiting = true;
    torch.light();
    dialogBox.setListenable(true);
    speak(`Bravo ! ${this.target}.`);
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
