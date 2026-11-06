import { BLOCK_MOVE_DURATION, BLOCK_PUSH_DELAY, OBJECTS, OVERWORLD, TILE_SIZE } from '../constants.js';

// Énigme : pousser le bloc sur l'interrupteur pour ouvrir la porte.
// Le levier remet le bloc à sa place : l'enfant ne peut jamais rester coincé.
export class BlockPuzzle {
  constructor(scene, map, player) {
    this.scene = scene;
    this.map = map;
    this.player = player;

    const point = (name) => map.findObject('objets', (object) => object.name === name);
    this.start = point('bloc');
    this.switchSpot = point('interrupteur');
    const doorSpot = point('porte');
    const leverSpot = point('retour');
    this.reservedTiles = [doorSpot, leverSpot].map((spot) => this.tileAt(spot));

    scene.add.image(this.switchSpot.x, this.switchSpot.y, 'objects', OBJECTS.switch);
    this.lever = scene.add.image(leverSpot.x, leverSpot.y, 'objects', OBJECTS.lever);
    this.door = scene.physics.add.staticImage(doorSpot.x, doorSpot.y, 'tiles', OVERWORLD.doorClosed);
    this.block = scene.physics.add.image(this.start.x, this.start.y, 'tiles', OVERWORLD.block);
    this.block.setImmovable(true);

    this.doorCollider = scene.physics.add.collider(player, this.door);
    scene.physics.add.collider(player, this.block, () => {
      this.touchingBlock = true;
    });

    this.touchingBlock = false;
    this.pushTime = 0;
    this.blockTween = null;
    this.onLever = false;
    this.solved = false;
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

  tileAt({ x, y }) {
    return { column: Math.floor(x / TILE_SIZE), row: Math.floor(y / TILE_SIZE) };
  }

  sameTile(a, b) {
    return a.column === b.column && a.row === b.row;
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
    return !wall && !this.reservedTiles.some((reserved) => this.sameTile(reserved, tile));
  }

  tryPush(direction) {
    this.pushTime = 0;
    const from = this.tileAt(this.block);
    const target = { column: from.column + direction.x, row: from.row + direction.y };
    if (!this.canMoveTo(target)) return;

    this.blockTween = this.scene.tweens.add({
      targets: this.block,
      x: this.block.x + direction.x * TILE_SIZE,
      y: this.block.y + direction.y * TILE_SIZE,
      duration: BLOCK_MOVE_DURATION,
      onComplete: () => {
        this.blockTween = null;
        if (this.sameTile(target, this.tileAt(this.switchSpot))) this.solve();
      },
    });
  }

  solve() {
    this.solved = true;
    this.door.setFrame(OVERWORLD.doorOpen);
    this.doorCollider.destroy();
    this.scene.cameras.main.shake(150, 0.004);
  }

  checkLever() {
    const onLever = this.sameTile(this.tileAt(this.player.body.center), this.tileAt(this.lever));
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
