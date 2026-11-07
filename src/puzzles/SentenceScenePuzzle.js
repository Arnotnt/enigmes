import * as Phaser from 'phaser';
import { ROOM_END_DELAY, SCENE_FRAME, SCENE_ROUNDS, TORCH_NEXT_ROUND_DELAY } from '../constants.js';
import { drawScene } from '../objects/drawScene.js';
import { placeRow } from '../objects/placeStones.js';
import { Torch } from '../objects/Torch.js';
import { nounsOf, parseSentence, variants } from '../reading/sentences.js';
import { speak } from '../speech.js';
import { dialogBox } from '../ui/DialogBox.js';

const INSTRUCTION = 'Lis la phrase, puis va toucher l’image qui la montre.';
const CHOICES = 3; // la bonne scène et deux pièges
const ROW = 6; // en cases depuis le haut : assez bas pour qu'une phrase sur deux lignes ne cache rien

// Devoir de lecture : une phrase s'affiche, sans être lue, et l'enfant va toucher la scène qui
// la montre, parmi trois qui ne diffèrent que par un détail (sur ou sous, un ou deux…).
// Les scènes sont composées par le jeu avec les pictogrammes : rien à dessiner chaque semaine.
// SCENE_ROUNDS phrases, puis la salle est finie. Comme pour `lire-mots`, l'écoute de la phrase
// n'arrive qu'après une première erreur. Revenir dans la salle relance une série.
export class SentenceScenePuzzle {
  // content : le devoir écrit dans le parcours. `phrases` : les phrases à lire.
  constructor(scene, map, player, solved, onSolved, content = {}) {
    this.scene = scene;
    this.player = player;
    this.solved = false; // jamais mémorisée : on peut revenir pour une nouvelle série
    this.torches = [];

    // Les phrases que le jeu ne sait pas dessiner sont signalées au démarrage (checkParcours).
    const sentences = (content.phrases ?? [])
      .map((text) => ({ text, description: parseSentence(text) }))
      .filter((item) => item.description);
    this.nouns = nounsOf(sentences.map((item) => item.description));
    this.remaining = Phaser.Utils.Array.Shuffle(sentences).slice(0, SCENE_ROUNDS);
    this.spots = placeRow(CHOICES, ROW);

    this.listenKey = scene.input.keyboard.addKey('SPACE');
    this.waiting = true;
    dialogBox.show(INSTRUCTION, { autoSpeak: true });
    scene.time.delayedCall(TORCH_NEXT_ROUND_DELAY * 3, () => this.startRound());
  }

  get target() {
    return this.remaining[0];
  }

  // Trois nouvelles scènes, dans le désordre : la bonne et deux pièges.
  startRound() {
    this.torches.forEach((torch) => torch.destroy());
    const { description } = this.target;
    // L'autre position et l'autre nombre d'abord : un autre objet ne sert que s'il en manque.
    const traps = variants(description, this.nouns).slice(0, CHOICES - 1);
    const choices = Phaser.Utils.Array.Shuffle([{ ...description, good: true }, ...traps]);
    this.torches = choices.map((choice, i) => {
      const draw = (x, y, size) => drawScene(this.scene, x, y, size, choice);
      const torch = new Torch(this.scene, this.spots[i], this.player, choice.good ? 'bonne' : 'piège', {
        picture: draw,
        pictureSize: SCENE_FRAME,
      });
      torch.rearm(); // le personnage est peut-être déjà contre une stèle
      return torch;
    });

    this.waiting = false;
    dialogBox.showBanner(this.target.text, this.target.text);
    dialogBox.setListenable(false);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.listenKey)) dialogBox.listen();

    for (const torch of this.torches) {
      if (torch.justTouched() && !this.waiting) this.touch(torch);
    }
  }

  touch(torch) {
    if (torch.label !== 'bonne') {
      // Après une erreur, l'enfant peut écouter la phrase : il ne reste jamais bloqué.
      torch.shake();
      dialogBox.setListenable(true);
      return;
    }

    this.waiting = true;
    torch.light();
    dialogBox.setListenable(true);
    speak(`Bravo ! ${this.target.text}`);
    this.remaining.shift();
    const next = this.remaining.length > 0 ? () => this.startRound() : () => this.endRoom();
    this.scene.time.delayedCall(TORCH_NEXT_ROUND_DELAY * 4, next);
  }

  endRoom() {
    dialogBox.showBanner('Bravo !', 'Bravo ! Tu as réussi !');
    dialogBox.listen();
    this.scene.time.delayedCall(ROOM_END_DELAY, () => this.scene.finishRoom());
  }
}
