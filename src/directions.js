import { PLAYER_SHEET_COLUMNS } from './constants.js';

// sheetRow : ligne de explorateur.png où se trouve cette direction.
export const DIRECTIONS = {
  down: { x: 0, y: 1, sheetRow: 0 },
  right: { x: 1, y: 0, sheetRow: 1 },
  up: { x: 0, y: -1, sheetRow: 2 },
  left: { x: -1, y: 0, sheetRow: 3 },
};

// Pose à l'arrêt dans une direction : le premier dessin de la ligne. La marche suit.
export const standingFrame = (direction) => DIRECTIONS[direction].sheetRow * PLAYER_SHEET_COLUMNS;
