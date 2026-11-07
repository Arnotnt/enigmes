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

// Le personnage occupe 16×32 pixels de salle, mais seuls ses pieds touchent les murs.
export const PLAYER_FRAME = { width: 16, height: 32 };
export const PLAYER_HITBOX = { width: 12, height: 12, offsetX: 2, offsetY: 18 };
// Ses dessins sont 4 fois plus fins (64×128) : une fois la caméra zoomée, 1 pixel du dessin = 1 pixel de l'écran.
export const PLAYER_TEXTURE_SCALE = 4;
export const PLAYER_SHEET_COLUMNS = 5; // par ligne de explorateur.png : le dessin à l'arrêt, puis la marche
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
export const OVERWORLD = { block: 70, doorClosed: 65, doorOpen: 145, postBottom: 720 };
export const OBJECTS = { switch: 297, lever: 299 };

// Ce qui est commun aux stèles de tous les mondes. Mesures en pixels de la salle, depuis le bas de
// la case où elle est posée. Dessin et mesures propres à chaque monde : src/objects/torchStyles.js.
export const TORCH = {
  glowRadius: 6,
  glowColor: 0xffa040,
  plateColor: 0xf3e7c4, // crème du cartouche, pour la plaque d'un mot
  pictureSize: 22, // côté du cadre d'une image, posé sur le haut de la stèle
  pictureHeight: 22, // centre de ce cadre
};

export const TORCH_REACH = 15; // pixels entre les pieds et la torche : il faut la toucher pour répondre
export const TORCH_NEXT_ROUND_DELAY = 900; // millisecondes avant d'annoncer le son suivant

export const ADDITION_MAX = 10; // total le plus grand, sauf si la carte a une propriété `max`
export const ADDITION_ANSWER_MAX = 10; // nombre à trouver le plus grand : les torches vont de 0 à 10
export const ADDITION_ROUNDS = 4; // additions à trouver avant la fin du jeu
export const ADDITION_NEXT_DELAY = 4000; // millisecondes pour écouter le bravo avant la suivante
export const COMPARE_MAX = 20; // nombres comparés, de 0 à 20
export const COMPARE_ROUNDS = 4; // comparaisons à faire avant la fin de la salle
export const SYLLABLE_ROUNDS = 4; // syllabes à former avant la fin de la salle
export const VOWEL_ROUNDS = 4; // sons à reconnaître avant la fin de la salle
export const READ_WORD_ROUNDS = 4; // mots à lire avant la fin de la salle
export const SCENE_ROUNDS = 3; // phrases à lire avant la fin de la salle
export const SCENE_FRAME = 46; // côté du cadre d'une scène, en pixels de salle
export const SCENE_PICTURE = { y: 27, size: 50 }; // la scène à décrire, en haut de la salle
export const PICTURE_FRAME = { y: 20, size: 26 }; // l'image à reconnaître, en haut de la salle (pixels de salle)
export const ROOM_END_DELAY = 2500; // millisecondes pour écouter le bravo avant de quitter la salle

export const GAME_TITLE = 'Le Tour du Monde\nd’Alexis'; // titre de l'écran de démarrage, sur deux lignes

// Musique : volume normal, volume quand la voix parle, et durée des fondus.
export const MUSIC_VOLUME = 0.35;
export const MUSIC_DUCKED_VOLUME = 0.08;
export const MUSIC_FADE = 500; // millisecondes
