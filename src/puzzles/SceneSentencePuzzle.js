import * as Phaser from 'phaser';
import { ROOM_END_DELAY, ROOM_WIDTH, SCENE_PICTURE, SCENE_ROUNDS, TILE_SIZE, TORCH, TORCH_NEXT_ROUND_DELAY } from '../constants.js';
import { drawScene } from '../objects/drawScene.js';
import { placeRow } from '../objects/placeStones.js';
import { Torch } from '../objects/Torch.js';
import { nounsOf, parseSentence, sentenceTraps } from '../reading/sentences.js';
import { speak } from '../speech.js';
import { dialogBox } from '../ui/DialogBox.js';

const INSTRUCTION = 'Trouve la phrase de l’image. Va lire les stèles, puis appuie sur Entrée devant la bonne.';
const CHOICES = 3; // la bonne phrase et deux pièges
const ROW = 5; // en cases depuis le haut, sous la scène

// Devoir de lecture : une scène s'affiche en haut de la salle, et trois stèles portent chacune une
// phrase. Devant une stèle, sa phrase s'écrit dans la boîte du bas, sans être lue ; Entrée la
// choisit. Les phrases ne diffèrent que d'un mot (sur ou sous, deux ou trois…) : il faut les
// lire et les comparer. C'est l'inverse de `phrase-scene`. Après une erreur, la phrase de la
// stèle devant laquelle on se trouve peut s'écouter. SCENE_ROUNDS scènes, puis la salle est finie.
export class SceneSentencePuzzle {
  // content : le devoir écrit dans le parcours. `phrases` : les bonnes phrases, comme pour
  // `phrase-scene`. Le jeu écrit lui-même les phrases pièges.
  constructor(scene, map, player, solved, onSolved, content = {}) {
    this.scene = scene;
    this.player = player;
    this.solved = false; // jamais mémorisée : on peut revenir pour une nouvelle série
    this.torches = [];
    this.picture = [];

    const sentences = (content.phrases ?? []).filter((text) => parseSentence(text));
    this.nouns = nounsOf(sentences.map(parseSentence));
    this.remaining = Phaser.Utils.Array.Shuffle([...sentences]).slice(0, SCENE_ROUNDS);
    this.spots = placeRow(CHOICES, ROW);

    // La scène à décrire, accrochée au mur du haut.
    const x = (ROOM_WIDTH * TILE_SIZE) / 2;
    const { y, size } = SCENE_PICTURE;
    scene.add.rectangle(x, y, size, size, TORCH.plateColor).setStrokeStyle(1, 0x2b2118);

    this.listenKey = scene.input.keyboard.addKey('SPACE');
    this.chooseKey = scene.input.keyboard.addKey('ENTER');
    this.near = null; // la stèle devant laquelle se tient l'enfant
    this.waiting = true;
    // La consigne se dit sans s'afficher : une grande boîte cacherait le héros.
    dialogBox.showPrompt(INSTRUCTION);
    dialogBox.listen();
    this.startRound();
  }

  get target() {
    return this.remaining[0];
  }

  startRound() {
    this.torches.forEach((torch) => torch.destroy());
    this.picture.forEach((part) => part.destroy());

    const x = (ROOM_WIDTH * TILE_SIZE) / 2;
    const { y, size } = SCENE_PICTURE;
    this.picture = drawScene(this.scene, x, y, size - 3, parseSentence(this.target));

    const traps = sentenceTraps(this.target, this.nouns).slice(0, CHOICES - 1);
    const choices = Phaser.Utils.Array.Shuffle([this.target, ...traps]);
    this.sentences = new Map();
    this.torches = choices.map((sentence, i) => {
      const torch = new Torch(this.scene, this.spots[i], this.player, String(i + 1));
      this.sentences.set(torch, sentence);
      return torch;
    });

    this.mistake = false;
    this.near = null;
    this.waiting = false;
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.listenKey)) dialogBox.listen();
    if (this.waiting) return;

    // La stèle la plus proche, à portée de main, montre sa phrase.
    for (const torch of this.torches) torch.justTouched(); // met à jour torch.near
    const near = this.torches.find((torch) => torch.near) ?? null;
    if (near !== this.near) {
      this.near = near;
      this.showNear();
    }

    if (Phaser.Input.Keyboard.JustDown(this.chooseKey) && this.near) this.choose(this.near);
  }

  // Devant une stèle : sa phrase, à lire. L'écoute n'est possible qu'après une erreur.
  // Loin des stèles : seulement la consigne, à écouter.
  showNear() {
    if (!this.near) {
      dialogBox.showPrompt(INSTRUCTION);
      return;
    }
    const sentence = this.sentences.get(this.near);
    dialogBox.show(sentence);
    dialogBox.setListenable(this.mistake);
  }

  choose(torch) {
    if (this.sentences.get(torch) !== this.target) {
      torch.shake();
      this.mistake = true;
      dialogBox.setListenable(true); // il peut maintenant écouter les phrases
      return;
    }

    this.waiting = true;
    torch.light();
    dialogBox.show(this.target);
    speak(`Bravo ! ${this.target}`);
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
