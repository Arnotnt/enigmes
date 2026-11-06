// Une salle fait 15×10 tuiles de 16 px, soit 240×160 : la résolution de la GBA.
export const TILE_SIZE = 16;
export const ROOM_WIDTH = 15;
export const ROOM_HEIGHT = 10;

export const PLAYER_SPEED = 80; // pixels par seconde
export const CORNER_ASSIST = 14; // pixels de décalage corrigés pour entrer dans une ouverture

// Le dessin du personnage fait 16×32, mais seuls ses pieds touchent les murs.
export const PLAYER_FRAME = { width: 16, height: 32 };
export const PLAYER_HITBOX = { width: 12, height: 12, offsetX: 2, offsetY: 18 };
export const PLAYER_SHEET_COLUMNS = 17; // nombre de dessins par ligne dans character.png
export const WALK_FRAMES = 4;

export const NPC_TALK_DISTANCE = 26; // pixels entre les pieds pour engager la conversation
export const NPC_HITBOX_HEIGHT = 20; // plus haut que les pieds : le joueur ne cache pas son visage
export const NPC_FRAME_SIZE = 32; // dessins de npc.png, plus larges que ceux du personnage

export const ROOM_FADE = 200; // millisecondes de fondu entre deux salles

// Durée de poussée avant que le bloc bouge, pour éviter de le déplacer en le frôlant.
export const BLOCK_PUSH_DELAY = 150; // millisecondes
export const BLOCK_MOVE_DURATION = 200; // millisecondes pour avancer d'une case

// Numéros des dessins dans overworld.png (OVERWORLD) et objects.png (OBJECTS).
export const OVERWORLD = { block: 70, doorClosed: 65, doorOpen: 145, postTop: 680, postBottom: 720 };
export const OBJECTS = { switch: 297, lever: 299, flameFirst: 103, flameLast: 109 };

export const TORCH_REACH = 22; // pixels entre les pieds et la torche pour répondre
export const TORCH_NEXT_ROUND_DELAY = 900; // millisecondes avant d'annoncer le son suivant
