import { PLAYER_SHEET_COLUMNS } from './constants.js';

// sheetRow : ligne de character.png où se trouve la marche dans cette direction.
export const DIRECTIONS = {
  down: { x: 0, y: 1, sheetRow: 0 },
  right: { x: 1, y: 0, sheetRow: 1 },
  up: { x: 0, y: -1, sheetRow: 2 },
  left: { x: -1, y: 0, sheetRow: 3 },
};

// Premier dessin de la marche dans une direction : c'est aussi la pose à l'arrêt.
export const firstFrame = (direction) => DIRECTIONS[direction].sheetRow * PLAYER_SHEET_COLUMNS;
