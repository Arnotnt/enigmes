import { OVERWORLD } from '../constants.js';

// Porte placée sur un point `porte` de la carte, qui bloque le passage tant qu'elle est fermée.
export class Door {
  constructor(scene, spot, player, opened) {
    this.image = scene.physics.add.staticImage(spot.x, spot.y, 'tiles', OVERWORLD.doorClosed);
    this.collider = scene.physics.add.collider(player, this.image);
    if (opened) this.open();
  }

  open() {
    this.image.setFrame(OVERWORLD.doorOpen);
    this.collider.destroy();
  }
}
