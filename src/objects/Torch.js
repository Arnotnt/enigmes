import * as Phaser from 'phaser';
import { OBJECTS, OVERWORLD, TORCH_REACH } from '../constants.js';

// Torche portant une lettre ou un nombre, placée sur un point de la carte.
export class Torch {
  constructor(scene, spot, player, label) {
    const { x, y } = spot;
    this.scene = scene;
    this.spot = spot;
    this.player = player;
    this.label = label;
    this.lit = false;
    this.near = false;
    this.flame = null;

    this.needsPush = false; // voir rearm()

    // Une lettre, un nombre ou un signe tient sur une plaque carrée ; un mot a une plaque plus large.
    const isWord = label.length > 2;
    const fontSize = isWord ? '9px' : label.length > 1 ? '11px' : '13px'; // 10 doit tenir sur la plaque
    const post = [
      scene.add.image(x, y - 16, 'tiles', OVERWORLD.postTop),
      scene.add.image(x, y, 'tiles', OVERWORLD.postBottom),
    ];
    const plate = scene.add.rectangle(x, y - 7, 15, 15, 0xfff8e7).setStrokeStyle(1, 0x6b4a2f);
    const text = scene.add
      .text(x, y - 8, label, { fontFamily: 'Andika', fontSize, color: '#2b2118' })
      .setOrigin(0.5)
      .setResolution(8);
    text.texture.setFilter(Phaser.Textures.FilterMode.LINEAR); // lettre lisse, contrairement aux dessins du jeu
    if (isWord) plate.setSize(Math.ceil(text.width) + 5, 13).setPosition(x, y - 7);

    this.parts = [...post, plate, text];

    const body = scene.physics.add.staticImage(x, y, 'tiles', OVERWORLD.postBottom).setVisible(false);
    scene.physics.add.collider(player, body);
  }

  // Vrai à l'instant où le personnage arrive contre la torche.
  justTouched() {
    const { center, velocity } = this.player.body;
    const near = center.distance(this.spot) <= TORCH_REACH;
    if (near && this.needsPush) {
      // Après rearm(), rester immobile contre la torche ne compte pas : il faut avancer vers elle.
      const towards = velocity.x * (this.spot.x - center.x) + velocity.y * (this.spot.y - center.y) > 0;
      if (!towards) return false;
    }
    const touched = near && !this.near;
    this.near = near;
    if (touched) this.needsPush = false;
    return touched;
  }

  // Pour une nouvelle question : la torche peut de nouveau répondre, même si le personnage est
  // encore contre elle. Il suffit qu'il avance vers elle, sans devoir s'écarter puis revenir.
  rearm() {
    this.near = false;
    this.needsPush = true;
  }

  light() {
    this.lit = true;
    const { x, y } = this.spot;
    this.flame = this.scene.add.sprite(x, y - 24, 'objects', OBJECTS.flameFirst).play('flame');
  }

  extinguish() {
    this.lit = false;
    this.flame?.destroy();
    this.flame = null;
  }

  shake() {
    this.scene.tweens.add({ targets: this.parts, x: '+=1', duration: 50, yoyo: true, repeat: 2 });
  }
}
