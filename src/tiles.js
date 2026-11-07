import { PLAYER_FRAME, PLAYER_HITBOX, TILE_SIZE } from './constants.js';

// Case de la salle qui contient le point (x, y).
export const tileAt = ({ x, y }) => ({
  column: Math.floor(x / TILE_SIZE),
  row: Math.floor(y / TILE_SIZE),
});

export const sameTile = (a, b) => a.column === b.column && a.row === b.row;

// Écart entre le centre du dessin d'un personnage et le centre de ses pieds.
export const feetOffset = () =>
  PLAYER_HITBOX.offsetY + PLAYER_HITBOX.height / 2 - PLAYER_FRAME.height / 2;

// Propriété personnalisée de la carte, définie dans Tiled (Carte > Propriétés de la carte).
export function mapProperty(map, name) {
  const properties = Array.isArray(map.properties) ? map.properties : [];
  return properties.find((item) => item.name === name)?.value;
}
