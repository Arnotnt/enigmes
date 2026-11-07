import egyptUrl from '../assets/parcours/monde-egypte.jpg?url';
import atlasUrl from '../assets/parcours/monde-entier.jpg?url';
import templeUrl from '../assets/parcours/temple.jpg?url';

// Les lieux illustrés. `path` suit le chemin de l'image, en pixels de cette image.
// `stops` donne, pour chaque point d'étape, sa position dans `path`.
// La carte des mondes : un point par monde, dans l'ordre de l'année.
// Points : le village d'automne, les pyramides, le pont chinois, puis les deux îles dans les nuages.
// Mondes : les Pirates (au village, en attendant une image redessinée), l'Égypte, la Chine,
// la Gaule et la Grèce antique (les deux îles).
export const ATLAS = {
  key: 'place-atlas',
  url: atlasUrl,
  width: 1264,
  path: [
    [250, 237], [284, 255], [302, 285], [283, 316], [252, 337], [219, 356], [193, 381], [180, 414],
    [190, 448], [218, 471], [255, 480], [292, 477], [325, 460], [348, 434], [362, 404], [371, 372],
    [383, 341], [402, 314], [432, 294], [468, 286], [506, 294], [550, 319], [577, 345], [590, 379],
    [589, 415], [584, 451], [588, 486], [614, 512], [650, 521], [688, 520], [721, 503], [733, 470],
    [716, 436], [741, 409], [780, 396], [805, 394], [835, 393], [855, 405], [866, 423], [903, 426],
    [958, 416], [989, 403], [996, 396], [1013, 381], [1047, 369], [1078, 352], [1076, 319],
    [1045, 300], [1011, 284], [982, 262], [982, 230], [1015, 215], [1032, 208],
  ],
  stops: [0, 19, 36, 42, 52],
};

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

export const PLACES = [ATLAS, EGYPT, TEMPLE];
