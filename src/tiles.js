import { TILE_SIZE } from './constants.js';

// Case de la salle qui contient le point (x, y).
export const tileAt = ({ x, y }) => ({
  column: Math.floor(x / TILE_SIZE),
  row: Math.floor(y / TILE_SIZE),
});

export const sameTile = (a, b) => a.column === b.column && a.row === b.row;
