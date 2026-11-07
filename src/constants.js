// Une salle fait 15×10 tuiles de 16 px, soit 240×160. La caméra l'agrandit pour remplir le jeu,
// qui fait 960×640 : les salles gardent leurs coordonnées, les cartes illustrées restent nettes.
export const TILE_SIZE = 16;
export const ROOM_WIDTH = 15;
export const ROOM_HEIGHT = 10;
export const VIEW_ZOOM = 4;
export const GAME_WIDTH = ROOM_WIDTH * TILE_SIZE * VIEW_ZOOM;
export const GAME_HEIGHT = ROOM_HEIGHT * TILE_SIZE * VIEW_ZOOM;

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

export const SPEECH_RESTART_DELAY = 150; // millisecondes entre une lecture coupée et la suivante
export const SPEECH_START_TIMEOUT = 700; // millisecondes avant de relancer une voix restée muette

export const ROOM_FADE = 200; // millisecondes de fondu entre deux salles

export const MAP_GLIDE_SPEED = 170; // pixels par seconde sur les cartes illustrées
export const MAP_HERO_SCALE = 2.5; // le dessin du personnage, agrandi sur les cartes
export const MAP_STOP_RADIUS = 18; // pixels

// Durée de poussée avant que le bloc bouge, pour éviter de le déplacer en le frôlant.
export const BLOCK_PUSH_DELAY = 150; // millisecondes
export const BLOCK_MOVE_DURATION = 200; // millisecondes pour avancer d'une case

// Numéros des dessins dans overworld.png (OVERWORLD) et objects.png (OBJECTS).
export const OVERWORLD = { block: 70, doorClosed: 65, doorOpen: 145, postTop: 680, postBottom: 720 };
export const OBJECTS = { switch: 297, lever: 299, flameFirst: 103, flameLast: 109 };

export const TORCH_REACH = 15; // pixels entre les pieds et la torche : il faut la toucher pour répondre
export const TORCH_NEXT_ROUND_DELAY = 900; // millisecondes avant d'annoncer le son suivant

export const ADDITION_MAX = 10; // total le plus grand, sauf si la carte a une propriété `max`
export const ADDITION_ANSWER_MAX = 10; // nombre à trouver le plus grand : les torches vont de 0 à 10
export const ADDITION_ROUNDS = 4; // additions à trouver avant la fin du jeu
export const ADDITION_NEXT_DELAY = 4000; // millisecondes pour écouter le bravo avant la suivante
export const COMPARE_MAX = 20; // nombres comparés, de 0 à 20
export const COMPARE_ROUNDS = 4; // comparaisons à faire avant la fin de la salle
export const ROOM_END_DELAY = 2500; // millisecondes pour écouter le bravo avant de quitter la salle
