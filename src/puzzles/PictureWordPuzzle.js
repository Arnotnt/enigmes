import * as Phaser from 'phaser';
import { PICTURE_FRAME, READ_WORD_ROUNDS, ROOM_END_DELAY, ROOM_WIDTH, TILE_SIZE, TORCH, TORCH_NEXT_ROUND_DELAY } from '../constants.js';
import { placeStones } from '../objects/placeStones.js';
import { Torch } from '../objects/Torch.js';
import { hasPicto, pictoKey } from '../reading/pictos.js';
import { speak } from '../speech.js';
import { dialogBox } from '../ui/DialogBox.js';

const INSTRUCTION = 'Regarde l’image en haut, puis va toucher son mot.';

// Devoir de lecture : une image s'affiche en haut de la salle, et l'enfant va toucher la stèle
// où son mot est écrit. C'est l'inverse du devoir `lire-mots`. READ_WORD_ROUNDS images, puis la
// salle est finie. Le mot n'est jamais dit avant d'être trouvé : il faut lire les stèles.
// Après une erreur, chaque stèle touchée dit son mot, pour ne jamais rester bloqué.
export class PictureWordPuzzle {
  // content : le devoir écrit dans le parcours. `mots` : les mots à trouver, chacun avec son
  // image dans src/assets/pictos/. `pieges` : des mots écrits en plus, sans image, qui
  // ressemblent aux vrais (lune → lame), pour qu'il faille lire tout le mot.
  constructor(scene, map, player, solved, onSolved, content = {}) {
    this.scene = scene;
    this.solved = false; // jamais mémorisée : on peut revenir pour une nouvelle série

    const all = content.mots ?? [];
    const missing = all.filter((word) => !hasPicto(word));
    if (missing.length) console.warn(`Mots sans image, laissés de côté : ${missing.join(', ')}`);
    const words = all.filter(hasPicto);
    const labels = Phaser.Utils.Array.Shuffle([...new Set([...words, ...(content.pieges ?? [])])]);

    const spots = placeStones(labels.length, { spacing: 3 });
    this.torches = labels.map((label, i) => new Torch(scene, spots[i], player, label));

    // L'image à reconnaître, accrochée au mur du haut comme un tableau.
    const x = (ROOM_WIDTH * TILE_SIZE) / 2;
    const y = PICTURE_FRAME.y;
    const size = PICTURE_FRAME.size;
    this.frame = scene.add.rectangle(x, y, size, size, TORCH.plateColor).setStrokeStyle(1, 0x2b2118);
    this.picture = scene.add.image(x, y, pictoKey(words[0] ?? '')).setVisible(false);

    this.remaining = Phaser.Utils.Array.Shuffle([...words]).slice(0, READ_WORD_ROUNDS);
    this.listenKey = scene.input.keyboard.addKey('SPACE');

    // Seule la consigne s'écoute : elle ne donne jamais le mot.
    dialogBox.showPrompt(INSTRUCTION);
    dialogBox.listen();
    this.startRound(); // l'image est là dès l'entrée : la consigne en parle
  }

  get target() {
    return this.remaining[0];
  }

  startRound() {
    this.torches.forEach((torch) => torch.rearm());
    this.mistake = false;
    this.waiting = false;
    const inner = PICTURE_FRAME.size - 3;
    this.picture.setTexture(pictoKey(this.target)).setDisplaySize(inner, inner).setVisible(true);
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
      // Dès la première erreur, la stèle dit son mot : l'enfant entend ce qu'il a touché.
      // Les suivantes aussi, jusqu'à la bonne : il ne reste jamais bloqué.
      speak(this.mistake ? torch.label : `Non, ici c'est écrit ${torch.label}.`);
      this.mistake = true;
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
