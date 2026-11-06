// Une salle fait 15×10 tuiles de 16 px, soit 240×160 : la résolution de la GBA.
export const TILE_SIZE = 16;
export const ROOM_WIDTH = 15;
export const ROOM_HEIGHT = 10;

export const PLAYER_SPEED = 80; // pixels par seconde
export const PLAYER_SIZE = 12; // plus petit qu'une tuile pour passer les couloirs sans accrocher

export const COLORS = {
  floor: 0x3d6b4f,
  wall: 0x6b5a48,
  player: 0xf2c14e,
};
