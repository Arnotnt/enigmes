import * as Phaser from 'phaser';
import { NPC_FRAME_SIZE, NPC_HITBOX_HEIGHT, NPC_TALK_DISTANCE, PLAYER_HITBOX } from '../constants.js';
import { dialogBox } from '../ui/DialogBox.js';
import { feetOffset } from '../tiles.js';

// Personnage qui parle quand on s'approche. S'éloigner ferme simplement la boîte :
// il n'y a pas de bouton à trouver pour continuer à jouer.
export class Npc {
  constructor(scene, spot, player) {
    this.player = player;
    this.spot = spot;
    this.text = spot.properties.find((item) => item.name === 'texte').value;

    this.sprite = scene.physics.add.staticSprite(spot.x, spot.y - feetOffset(), 'npc', 0);
    this.sprite.body.setSize(PLAYER_HITBOX.width, NPC_HITBOX_HEIGHT);
    this.sprite.body.setOffset((NPC_FRAME_SIZE - PLAYER_HITBOX.width) / 2, PLAYER_HITBOX.offsetY);
    scene.physics.add.collider(player, this.sprite);

    this.listenKey = scene.input.keyboard.addKey('SPACE');
    this.talking = false;
  }

  update() {
    const distance = this.player.body.center.distance(this.spot);
    const close = distance <= NPC_TALK_DISTANCE;

    if (close && !this.talking) dialogBox.show(this.text, { autoSpeak: true });
    if (!close && this.talking) dialogBox.hide();
    this.talking = close;

    if (close && Phaser.Input.Keyboard.JustDown(this.listenKey)) dialogBox.listen();
  }
}
