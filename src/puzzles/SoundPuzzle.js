import * as Phaser from 'phaser';
import { OBJECTS, OVERWORLD, TORCH_NEXT_ROUND_DELAY, TORCH_REACH } from '../constants.js';
import { Door } from '../objects/Door.js';
import { SPOKEN_SOUNDS } from '../reading/sounds.js';
import { speak } from '../speech.js';
import { dialogBox } from '../ui/DialogBox.js';

const propertyOf = (object, name) => object.properties.find((item) => item.name === name).value;

// Énigme : écouter un son, puis aller à la torche qui porte la bonne lettre.
// Une erreur ne coûte rien : le son est simplement répété.
export class SoundPuzzle {
  constructor(scene, map, player, solved, onSolved) {
    this.scene = scene;
    this.player = player;
    this.onSolved = onSolved;
    this.solved = solved;

    const doorSpot = map.findObject('objets', (object) => object.name === 'porte');
    this.door = new Door(scene, doorSpot, player, solved);

    const spots = map.filterObjects('objets', (object) => object.name === 'torche');
    this.torches = spots.map((spot) => this.createTorch(spot));
    if (solved) {
      this.torches.forEach((torch) => this.light(torch));
      return;
    }

    this.remaining = Phaser.Utils.Array.Shuffle(this.torches.map((torch) => torch.letter));
    this.listenKey = scene.input.keyboard.addKey('SPACE');
    this.waiting = true; // pas de réponse possible avant d'avoir entendu le son
    scene.time.delayedCall(TORCH_NEXT_ROUND_DELAY, () => this.startRound());
  }

  createTorch(spot) {
    const { x, y } = spot;
    const parts = [
      this.scene.add.image(x, y - 16, 'tiles', OVERWORLD.postTop),
      this.scene.add.image(x, y, 'tiles', OVERWORLD.postBottom),
      this.scene.add.rectangle(x, y - 7, 15, 15, 0xfff8e7).setStrokeStyle(1, 0x6b4a2f),
    ];
    const label = this.scene.add
      .text(x, y - 8, propertyOf(spot, 'lettre'), { fontFamily: 'Andika', fontSize: '13px', color: '#2b2118' })
      .setOrigin(0.5)
      .setResolution(8);
    label.texture.setFilter(Phaser.Textures.FilterMode.LINEAR); // lettre lisse, contrairement aux dessins du jeu
    parts.push(label);
    const body = this.scene.physics.add.staticImage(x, y, 'tiles', OVERWORLD.postBottom).setVisible(false);
    this.scene.physics.add.collider(this.player, body);

    return { x, y, parts, letter: propertyOf(spot, 'lettre'), lit: false, near: false };
  }

  light(torch) {
    torch.lit = true;
    this.scene.add.sprite(torch.x, torch.y - 24, 'objects', OBJECTS.flameFirst).play('flame');
  }

  get target() {
    return this.remaining[0];
  }

  startRound() {
    this.waiting = false;
    dialogBox.showPrompt(`Trouve le son : ${SPOKEN_SOUNDS[this.target]}.`);
    dialogBox.listen();
  }

  update() {
    if (this.solved) return;
    if (Phaser.Input.Keyboard.JustDown(this.listenKey)) dialogBox.listen();

    const feet = this.player.body.center;
    for (const torch of this.torches) {
      const near = feet.distance(torch) <= TORCH_REACH;
      if (near && !torch.near && !this.waiting) this.touch(torch);
      torch.near = near;
    }
  }

  touch(torch) {
    if (torch.lit) return;
    if (torch.letter !== this.target) {
      this.scene.tweens.add({ targets: torch.parts, x: '+=1', duration: 50, yoyo: true, repeat: 2 });
      dialogBox.listen();
      return;
    }

    this.light(torch);
    this.remaining.shift();
    if (this.remaining.length === 0) {
      this.solve();
    } else {
      this.waiting = true;
      this.scene.time.delayedCall(TORCH_NEXT_ROUND_DELAY, () => this.startRound());
    }
  }

  solve() {
    this.solved = true;
    dialogBox.hide();
    speak('Bravo !');
    this.door.open();
    this.scene.cameras.main.shake(150, 0.004);
    this.onSolved();
  }
}
