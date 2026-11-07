import * as Phaser from 'phaser';
import { OVERWORLD, TORCH, TORCH_REACH } from '../constants.js';

// Torche portant une lettre, un nombre, un signe ou un mot, placée sur un point de la carte.
// Le dessin est une stèle : image 0 éteinte, image 1 allumée. Le point désigne le centre de la
// case où elle est posée ; la stèle monte au-dessus, comme un personnage.
export class Torch {
  constructor(scene, spot, player, label) {
    const { x, y } = spot;
    this.scene = scene;
    this.spot = spot;
    this.player = player;
    this.label = label;
    this.lit = false;
    this.near = false;
    this.glow = null;

    this.needsPush = false; // voir rearm()

    const bottom = y + 8; // bas de la case
    this.stele = scene.add.image(x, bottom, 'torch', 0).setOrigin(0.5, 1);
    this.stele.setDisplaySize(TORCH.width, TORCH.width * (this.stele.height / this.stele.width));
    // Dessin réduit puis agrandi par la caméra : lissé, il reste net, comme le fond de la salle.
    this.stele.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);

    // Une lettre, un nombre ou un signe s'écrit dans le cartouche de la stèle.
    // Un mot est trop large : il reçoit une plaque posée par-dessus.
    const centerY = bottom - TORCH.labelHeight;
    const isWord = label.length > 2;
    const fontSize = isWord ? '9px' : label.length > 1 ? '10px' : '13px'; // 10 doit tenir dans le cartouche
    const text = scene.add
      .text(x, centerY - 1, label, { fontFamily: 'Andika', fontSize, color: '#2b2118' })
      .setOrigin(0.5)
      .setResolution(8);
    text.texture.setFilter(Phaser.Textures.FilterMode.LINEAR); // lettre lisse, contrairement aux dessins du jeu
    this.parts = [this.stele, text];
    if (isWord) {
      const plate = scene.add
        .rectangle(x, centerY, Math.ceil(text.width) + 5, 13, TORCH.plateColor)
        .setStrokeStyle(0.75, 0x2b2118);
      scene.children.bringToTop(text);
      this.parts.splice(1, 0, plate);
    }

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
    this.stele.setFrame(1);
    // Une lueur douce qui palpite au-dessus de la flamme : le dessin, lui, ne bouge pas.
    const { x } = this.spot;
    this.glow = this.scene.add
      .circle(x, this.spot.y + 8 - TORCH.flameHeight, TORCH.glowRadius, TORCH.glowColor, 0.25)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.scene.tweens.add({ targets: this.glow, alpha: 0.5, scale: 1.15, duration: 380, yoyo: true, repeat: -1 });
  }

  extinguish() {
    this.lit = false;
    this.stele.setFrame(0);
    this.glow?.destroy();
    this.glow = null;
  }

  shake() {
    this.scene.tweens.add({ targets: this.parts, x: '+=1', duration: 50, yoyo: true, repeat: 2 });
  }
}
