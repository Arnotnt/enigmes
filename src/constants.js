// Une salle fait 15×10 tuiles de 16 px, soit 240×160 : la résolution de la GBA.
export const TILE_SIZE = 16;
export const ROOM_WIDTH = 15;
export const ROOM_HEIGHT = 10;

export const PLAYER_SPEED = 80; // pixels par seconde

// Le dessin du personnage fait 16×32, mais seuls ses pieds touchent les murs.
export const PLAYER_FRAME = { width: 16, height: 32 };
export const PLAYER_HITBOX = { width: 12, height: 12, offsetX: 2, offsetY: 18 };
export const PLAYER_SHEET_COLUMNS = 17; // nombre de dessins par ligne dans character.png
export const WALK_FRAMES = 4;

// Durée de poussée avant que le bloc bouge, pour éviter de le déplacer en le frôlant.
export const BLOCK_PUSH_DELAY = 150; // millisecondes
export const BLOCK_MOVE_DURATION = 200; // millisecondes pour avancer d'une case

// Numéros des dessins dans overworld.png (OVERWORLD) et objects.png (OBJECTS).
export const OVERWORLD = { block: 70, doorClosed: 65, doorOpen: 145 };
export const OBJECTS = { switch: 297, lever: 299 };
