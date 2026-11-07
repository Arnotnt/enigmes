import chineUrl from '../assets/parcours/monde-chine.jpg?url';
import egyptUrl from '../assets/parcours/monde-egypte.jpg?url';
import atlasUrl from '../assets/parcours/monde-entier.jpg?url';
import gauleUrl from '../assets/parcours/monde-gaule.jpg?url';
import greceUrl from '../assets/parcours/monde-grece.jpg?url';
import piratesUrl from '../assets/parcours/monde-pirates.jpg?url';
import templeUrl from '../assets/parcours/temple.jpg?url';

// Les lieux illustrés. `path` suit le chemin de l'image, en pixels de cette image.
// `stops` donne, pour chaque point d'étape, sa position dans `path`.
// La carte des mondes : un point par monde, dans l'ordre de l'année.
// Points : le repaire des pirates, les pyramides, le pont chinois, l'île gauloise, puis l'île grecque.
// Le chemin traverse la rivière et le pont sans pointillés. La route de mer vers l'île grecque
// a été ajoutée à l'image de Gemini, avec les mêmes points noirs.
export const ATLAS = {
  key: 'place-atlas',
  url: atlasUrl,
  width: 1531,
  path: [
    [332, 300], [355, 317], [365, 344], [354, 370], [332, 390], [306, 406], [278, 421], [254, 438],
    [234, 460], [222, 484], [220, 514], [230, 540], [252, 562], [280, 574], [308, 580], [340, 579],
    [368, 570], [394, 556], [414, 536], [428, 512], [440, 486], [446, 461], [454, 436], [465, 410],
    [480, 388], [500, 368], [524, 354], [552, 346], [582, 346], [612, 354], [654, 378], [678, 396],
    [698, 417], [710, 444], [716, 472], [714, 502], [710, 530], [708, 558], [714, 586], [730, 610],
    [758, 623], [788, 629], [818, 630], [848, 622], [874, 606], [888, 580], [882, 552], [868, 526],
    [882, 500], [914, 486], [944, 478], [975, 474], [1000, 470], [1025, 478], [1048, 510], [1078, 515],
    [1108, 510], [1144, 501], [1172, 498], [1196, 485], [1216, 466], [1240, 452], [1266, 444], [1293, 432],
    [1310, 410], [1302, 384], [1278, 368], [1251, 356], [1224, 344], [1200, 328], [1182, 304], [1188, 278],
    [1214, 263], [1230, 258], [1257, 269], [1286, 271], [1315, 270], [1344, 270], [1370, 283], [1383, 308],
    [1389, 337], [1391, 366], [1392, 395], [1391, 425], [1388, 454], [1384, 482], [1378, 511], [1373, 540],
    [1370, 569], [1366, 598], [1362, 627], [1360, 641],
  ],
  stops: [0, 28, 52, 73, 91],
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

// Les cartes des mondes à venir, une étape par semaine. Images de 629×421 : pour une version
// plus grande, multiplier les points du chemin d'autant.
// La route pavée, le coffre, les canons, le ponton, les cabanes, puis la maison du capitaine.
export const PIRATES = {
  key: 'place-pirates',
  url: piratesUrl,
  width: 629,
  path: [
    [472, 405], [455, 388], [430, 378], [405, 375], [440, 365], [475, 350], [505, 332], [525, 310],
    [540, 282], [552, 255], [548, 230], [515, 225], [480, 224], [445, 217], [415, 205], [395, 190],
    [378, 178], [362, 170], [380, 182], [405, 198], [440, 214], [480, 224], [520, 224], [540, 210],
    [535, 192], [528, 175],
  ],
  stops: [0, 3, 7, 9, 14, 17, 25],
};

// La route pavée sous les deux portiques, puis le palais et les rizières en terrasses.
export const CHINE = {
  key: 'place-chine',
  url: chineUrl,
  width: 629,
  path: [
    [305, 412], [335, 400], [360, 385], [385, 368], [410, 352], [435, 335], [458, 318], [480, 300],
    [500, 285], [512, 265], [514, 245], [505, 225], [495, 210], [518, 195], [495, 205], [465, 203],
    [430, 198], [395, 190], [360, 180], [338, 168], [345, 155], [370, 147], [398, 142],
  ],
  stops: [0, 3, 6, 10, 13, 22],
};

// La route pavée, la charrette, le dolmen, le pont, les huttes, puis le village fortifié.
export const GAULE = {
  key: 'place-gaule',
  url: gauleUrl,
  width: 629,
  path: [
    [520, 415], [498, 398], [472, 382], [440, 368], [410, 358], [380, 348], [352, 333], [338, 315],
    [330, 300], [322, 285], [305, 268], [275, 258], [245, 250], [215, 240], [182, 225], [190, 205],
    [194, 186], [192, 172],
  ],
  stops: [0, 2, 6, 9, 14, 17],
};

// La plage, les statues, le stade, le temple, le marché, puis le grand temple.
export const GRECE = {
  key: 'place-grece',
  url: greceUrl,
  width: 629,
  path: [
    [330, 306], [368, 307], [405, 296], [435, 296], [462, 300], [480, 270], [497, 240], [512, 210],
    [525, 186], [500, 168], [470, 160], [440, 155], [412, 150], [370, 151], [330, 149], [290, 145],
    [250, 138], [210, 128],
  ],
  stops: [0, 2, 4, 8, 12, 17],
};

export const PLACES = [ATLAS, EGYPT, TEMPLE, PIRATES, CHINE, GAULE, GRECE];
