import { ROOM_WIDTH, TILE_SIZE } from '../constants.js';

// Lignes de stèles possibles, en cases depuis le haut : une ligne au milieu, ou deux.
// La rangée 8 reste libre : c'est là qu'arrive le personnage.
const ROWS = { 1: [4], 2: [3, 6] };
const FLOOR_WIDTH = ROOM_WIDTH - 2; // cases de sol entre les deux murs
const MAX_SPACING = 4; // en cases : au-delà, les stèles paraissent perdues dans la salle

// Place des stèles en lignes, centrées dans la salle, et rend le point de chacune.
// `spacing` est l'écart minimal en cases : 2 pour une lettre ou un nombre, 3 pour un mot.
export function placeStones(count, { spacing = 2 } = {}) {
  const perRow = Math.floor(FLOOR_WIDTH / spacing);
  const rows = Math.min(Math.ceil(count / perRow), 2);
  if (count > perRow * rows) console.warn(`Trop de stèles pour la salle : ${count}`);

  const perLine = Math.ceil(count / rows);
  const spots = [];
  ROWS[rows].forEach((row, line) => {
    const inLine = Math.min(perLine, count - line * perLine);
    const step = Math.min(MAX_SPACING, Math.floor(FLOOR_WIDTH / inLine)) * TILE_SIZE;
    const center = (ROOM_WIDTH * TILE_SIZE) / 2;
    for (let i = 0; i < inLine; i++) {
      spots.push({ x: center + (i - (inLine - 1) / 2) * step, y: row * TILE_SIZE + TILE_SIZE / 2 });
    }
  });
  return spots;
}
