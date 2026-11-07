import egyptUrl from '../assets/parcours/monde-egypte.jpg?url';
import templeUrl from '../assets/parcours/temple.jpg?url';

// Les lieux illustrés. `path` suit le chemin de l'image, en pixels de cette image.
// `stops` donne, pour chaque point d'étape, sa position dans `path`.
export const EGYPT = {
  key: 'place-egypt',
  url: egyptUrl,
  width: 1264,
  path: [
    [300, 800], [296, 758], [261, 722], [201, 687], [150, 659], [117, 608], [150, 574], [205, 568],
    [332, 578], [450, 566], [560, 522], [640, 495], [760, 512], [870, 544], [1000, 548], [1120, 530],
    [1173, 468], [1153, 413], [1090, 370], [1000, 342], [966, 316], [925, 265], [850, 250], [775, 208],
    [730, 196], [640, 202], [598, 243], [568, 302], [527, 354], [420, 385], [317, 379], [240, 335],
    [246, 306], [294, 271], [312, 228],
  ],
  stops: [0, 5, 11, 14, 21, 25, 34],
};

export const TEMPLE = {
  key: 'place-temple',
  url: templeUrl,
  width: 1264,
  path: [
    [262, 405], [400, 425], [540, 385], [640, 374], [700, 375], [780, 410], [720, 480], [750, 545],
    [900, 585], [1040, 570], [1085, 480], [1098, 362],
  ],
  stops: [0, 3, 8, 11],
};

export const PLACES = [EGYPT, TEMPLE];
