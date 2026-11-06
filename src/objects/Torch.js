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

    this.parts = [
      scene.add.image(x, y - 16, 'tiles', OVERWORLD.postTop),
      scene.add.image(x, y, 'tiles', OVERWORLD.postBottom),
      scene.add.rectangle(x, y - 7, 15, 15, 0xfff8e7).setStrokeStyle(1, 0x6b4a2f),
    ];
    const fontSize = label.length > 1 ? '11px' : '13px'; // 10 doit tenir sur la plaque
    const text = scene.add
      .text(x, y - 8, label, { fontFamily: 'Andika', fontSize, color: '#2b2118' })
      .setOrigin(0.5)
      .setResolution(8);
    text.texture.setFilter(Phaser.Textures.FilterMode.LINEAR); // lettre lisse, contrairement aux dessins du jeu
    this.parts.push(text);

    const body = scene.physics.add.staticImage(x, y, 'tiles', OVERWORLD.postBottom).setVisible(false);
    scene.physics.add.collider(player, body);
  }

  // Vrai à l'instant où le personnage arrive contre la torche.
  justTouched() {
    const near = this.player.body.center.distance(this.spot) <= TORCH_REACH;
    const touched = near && !this.near;
    this.near = near;
    return touched;
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
