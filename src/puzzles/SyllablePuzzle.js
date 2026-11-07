import * as Phaser from 'phaser';
import { ROOM_END_DELAY, SYLLABLE_ROUNDS, TORCH_NEXT_ROUND_DELAY } from '../constants.js';
import { placeRow, ROWS } from '../objects/placeStones.js';
import { Torch } from '../objects/Torch.js';
import { speak } from '../speech.js';
import { dialogBox } from '../ui/DialogBox.js';

// Une syllabe du parcours, en deux sons : « ch-ou » se coupe au tiret, « ma » après la première
// lettre.
export function splitSyllable(syllable) {
  const [consonant, vowel] = syllable.includes('-')
    ? syllable.split('-')
    : [syllable[0], syllable.slice(1)];
  return { consonant, vowel, text: consonant + vowel };
}

// Devoir de lecture : entendre une syllabe, puis la former en touchant la stèle de la consonne
// (ligne du haut), puis celle de la voyelle (ligne du bas). SYLLABLE_ROUNDS syllabes, puis la
// salle est finie. Une erreur fait trembler la stèle et redit la syllabe, sans effacer ce qui
// est déjà juste. Revenir dans la salle relance une série.
export class SyllablePuzzle {
  // content : le devoir écrit dans le parcours. `syllabes` est la liste des syllabes possibles.
  constructor(scene, map, player, solved, onSolved, content = {}) {
    this.scene = scene;
    this.solved = false; // jamais mémorisée : on peut revenir pour une nouvelle série

    const syllables = (content.syllabes ?? []).map(splitSyllable);
    const unique = (list) => Phaser.Utils.Array.Shuffle([...new Set(list)]);
    const consonants = unique(syllables.map((item) => item.consonant));
    const vowels = unique(syllables.map((item) => item.vowel));
    const [top, bottom] = ROWS[2];
    const consonantSpots = placeRow(consonants.length, top);
    const vowelSpots = placeRow(vowels.length, bottom);
    this.consonants = consonants.map((label, i) => new Torch(scene, consonantSpots[i], player, label));
    this.vowels = vowels.map((label, i) => new Torch(scene, vowelSpots[i], player, label));
    this.torches = [...this.consonants, ...this.vowels];

    this.remaining = Phaser.Utils.Array.Shuffle(syllables).slice(0, SYLLABLE_ROUNDS);
    this.listenKey = scene.input.keyboard.addKey('SPACE');
    this.waiting = true; // pas de réponse possible avant d'avoir entendu la syllabe
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
    this.consonantDone = false;
    this.waiting = false;
    // La syllabe n'est pas écrite : l'enfant l'entend, puis la lit sur les stèles.
    dialogBox.showPrompt(this.target.text);
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
    const { consonant, vowel, text } = this.target;
    // D'abord la consonne, dans la ligne du haut, puis la voyelle, dans la ligne du bas.
    const [row, label] = this.consonantDone ? [this.vowels, vowel] : [this.consonants, consonant];
    if (!row.includes(torch) || torch.label !== label) {
      torch.shake();
      dialogBox.listen();
      return;
    }

    torch.light();
    if (!this.consonantDone) {
      // Le premier son est trouvé : il reste affiché pendant que l'enfant cherche le second.
      this.consonantDone = true;
      dialogBox.showBanner(`${consonant} …`, text);
      return;
    }

    this.waiting = true;
    dialogBox.showBanner(text, text);
    speak(`Bravo ! ${text}.`);
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
