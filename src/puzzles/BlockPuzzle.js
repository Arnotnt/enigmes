import { BLOCK_MOVE_DURATION, BLOCK_PUSH_DELAY, OBJECTS, OVERWORLD, TILE_SIZE } from '../constants.js';
import { sameTile, tileAt } from '../tiles.js';

// Énigme : pousser le bloc sur l'interrupteur pour ouvrir la porte.
// Le levier remet le bloc à sa place : l'enfant ne peut jamais rester coincé.
export class BlockPuzzle {
  // solved : vrai si l'énigme a déjà été résolue. onSolved est appelée à la résolution.
  constructor(scene, map, player, solved, onSolved) {
    this.scene = scene;
    this.map = map;
    this.player = player;
    this.onSolved = onSolved;

    const point = (name) => map.findObject('objets', (object) => object.name === name);
    this.start = point('bloc');
    this.switchSpot = point('interrupteur');
    const doorSpot = point('porte');
    const leverSpot = point('retour');
    this.reservedTiles = [doorSpot, leverSpot].map(tileAt);

    scene.add.image(this.switchSpot.x, this.switchSpot.y, 'objects', OBJECTS.switch);
    this.lever = scene.add.image(leverSpot.x, leverSpot.y, 'objects', OBJECTS.lever);
    this.door = scene.physics.add.staticImage(doorSpot.x, doorSpot.y, 'tiles', OVERWORLD.doorClosed);
    const blockSpot = solved ? this.switchSpot : this.start;
    this.block = scene.physics.add.image(blockSpot.x, blockSpot.y, 'tiles', OVERWORLD.block);
    this.block.setImmovable(true);

    this.doorCollider = scene.physics.add.collider(player, this.door);
    scene.physics.add.collider(player, this.block, () => {
      this.touchingBlock = true;
    });

    this.touchingBlock = false;
    this.pushTime = 0;
    this.blockTween = null;
    this.onLever = false;
    this.solved = solved;
    if (solved) this.openDoor();
  }

  // direction : la direction dans laquelle le personnage marche, ou undefined à l'arrêt.
  update(delta, direction) {
    const touching = this.touchingBlock;
    this.touchingBlock = false;

    if (this.solved) return;
    this.checkLever();
    if (this.blockTween) return;

    if (touching && direction && this.isBehindBlock(direction)) {
      this.pushTime += delta;
      if (this.pushTime >= BLOCK_PUSH_DELAY) this.tryPush(direction);
    } else {
      this.pushTime = 0;
    }
  }

  // Vrai si le personnage est du côté opposé à la poussée et à peu près en face du bloc.
  isBehindBlock(direction) {
    const dx = this.player.body.center.x - this.block.x;
    const dy = this.player.body.center.y - this.block.y;
    const behind = dx * direction.x + dy * direction.y < 0;
    const offCenter = Math.abs(dx * direction.y) + Math.abs(dy * direction.x);
    return behind && offCenter <= TILE_SIZE / 2;
  }

  canMoveTo(tile) {
    const wall = this.map.getTileAt(tile.column, tile.row, false, 'murs');
    return !wall && !this.reservedTiles.some((reserved) => sameTile(reserved, tile));
  }

  tryPush(direction) {
    this.pushTime = 0;
    const from = tileAt(this.block);
    const target = { column: from.column + direction.x, row: from.row + direction.y };
    if (!this.canMoveTo(target)) return;

    this.blockTween = this.scene.tweens.add({
      targets: this.block,
      x: this.block.x + direction.x * TILE_SIZE,
      y: this.block.y + direction.y * TILE_SIZE,
      duration: BLOCK_MOVE_DURATION,
      onComplete: () => {
        this.blockTween = null;
        if (sameTile(target, tileAt(this.switchSpot))) this.solve();
      },
    });
  }

  solve() {
    this.solved = true;
    this.openDoor();
    this.scene.cameras.main.shake(150, 0.004);
    this.onSolved();
  }

  openDoor() {
    this.door.setFrame(OVERWORLD.doorOpen);
    this.doorCollider.destroy();
  }

  checkLever() {
    const onLever = sameTile(tileAt(this.player.body.center), tileAt(this.lever));
    if (onLever && !this.onLever) this.reset();
    this.onLever = onLever;
  }

  reset() {
    this.blockTween?.stop();
    this.blockTween = null;
    this.pushTime = 0;
    this.block.setPosition(this.start.x, this.start.y);
    this.lever.toggleFlipX();
  }
}
