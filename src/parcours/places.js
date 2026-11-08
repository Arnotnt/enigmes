import chineUrl from '../assets/parcours/monde-chine.jpg?url';
import egyptUrl from '../assets/parcours/monde-egypte.jpg?url';
import atlasUrl from '../assets/parcours/monde-entier.jpg?url';
import gauleUrl from '../assets/parcours/monde-gaule.jpg?url';
import greceUrl from '../assets/parcours/monde-grece.jpg?url';
import piratesUrl from '../assets/parcours/monde-pirates.jpg?url';
import semaineChineUrl from '../assets/parcours/semaine-chine.jpg?url';
import semaineGauleUrl from '../assets/parcours/semaine-gaule.jpg?url';
import semaineGreceUrl from '../assets/parcours/semaine-grece.jpg?url';
import semainePiratesUrl from '../assets/parcours/semaine-pirates.jpg?url';
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

// Les cartes des mondes à venir, une étape par semaine. Images de 1264 pixels de large : une
// nouvelle image, même proche, demande de vérifier que le chemin suit toujours sa route.
// La route pavée, le coffre, les canons, le ponton, les cabanes, puis la maison du capitaine.
export const PIRATES = {
  key: 'place-pirates',
  url: piratesUrl,
  width: 1264,
  path: [
    [945, 802], [938, 775], [925, 738], [880, 722], [848, 705], [900, 715], [950, 692], [995, 667],
    [1040, 642], [1085, 615], [1130, 582], [1152, 545], [1148, 505], [1115, 470], [1060, 455], [1000, 452],
    [940, 440], [895, 415], [855, 390], [810, 378], [770, 355], [810, 378], [855, 390], [895, 415],
    [945, 437], [1000, 452], [1060, 455], [1085, 437], [1078, 415], [1073, 385], [1062, 352],
  ],
  stops: [0, 4, 8, 12, 18, 20, 30],
};

// La route pavée sous les deux portiques, puis le palais et les rizières en terrasses.
export const CHINE = {
  key: 'place-chine',
  url: chineUrl,
  width: 1264,
  path: [
    [655, 805], [690, 785], [735, 760], [780, 735], [830, 705], [880, 672], [925, 645], [985, 605],
    [1028, 572], [1038, 530], [1004, 490], [977, 455], [968, 428], [1000, 408], [1042, 388], [1000, 408],
    [968, 428], [920, 420], [860, 413], [770, 400], [695, 385], [660, 358], [685, 338], [745, 312],
    [797, 287],
  ],
  stops: [0, 3, 6, 10, 14, 24],
};

// La route pavée, la charrette, le dolmen, le pont, les huttes, puis le village fortifié.
export const GAULE = {
  key: 'place-gaule',
  url: gauleUrl,
  width: 1264,
  path: [
    [1040, 808], [995, 780], [940, 757], [880, 735], [820, 722], [760, 700], [705, 672], [675, 635],
    [664, 607], [648, 577], [627, 546], [600, 524], [526, 512], [452, 508], [392, 498], [395, 450],
    [385, 395], [365, 345],
  ],
  stops: [0, 2, 6, 9, 14, 17],
};

// La plage, les statues, le stade, le temple, le marché, puis le grand temple.
export const GRECE = {
  key: 'place-grece',
  url: greceUrl,
  width: 1264,
  path: [
    [897, 802], [922, 762], [930, 700], [895, 640], [870, 575], [850, 525], [905, 532], [950, 507],
    [985, 472], [1025, 440], [1041, 405], [1035, 365], [1005, 335], [960, 318], [905, 312], [835, 314],
    [770, 312], [700, 305], [630, 298], [560, 285], [490, 272], [425, 258],
  ],
  stops: [0, 5, 8, 11, 15, 21],
};

// Les cartes des jours des autres mondes, comme le temple : quatre lieux, un par jour.
// Images de 1264×848.

// Le ponton, l'étal au perroquet, la taverne, puis la maison du capitaine.
export const PIRATES_JOURS = {
  key: 'place-pirates-jours',
  url: semainePiratesUrl,
  width: 1264,
  path: [
    [305, 415], [268, 465], [310, 525], [390, 550], [480, 535], [580, 520], [680, 535], [780, 575],
    [860, 605], [960, 600], [1060, 555], [1125, 480], [1115, 410], [1065, 360], [1010, 320], [1005, 290],
  ],
  stops: [0, 4, 8, 15],
};

// Le portique aux lions, le pont rouge, le pavillon de thé, puis la pagode.
export const CHINE_JOURS = {
  key: 'place-chine-jours',
  url: semaineChineUrl,
  width: 1264,
  path: [
    [190, 375], [270, 385], [350, 410], [430, 440], [515, 425], [590, 505], [680, 545], [780, 568],
    [870, 570], [970, 560], [1060, 525], [1090, 470], [1045, 420], [985, 375], [985, 335], [1040, 300],
    [1065, 285],
  ],
  stops: [0, 4, 8, 16],
};

// La porte de la palissade, la forge, le marché, puis la grande hutte du chef.
export const GAULE_JOURS = {
  key: 'place-gaule-jours',
  url: semaineGauleUrl,
  width: 1264,
  path: [
    [250, 345], [310, 365], [330, 410], [295, 460], [315, 520], [420, 575], [530, 580], [630, 555],
    [705, 515], [725, 455], [705, 400], [730, 365], [840, 340], [940, 320], [1000, 285],
  ],
  stops: [0, 5, 12, 14],
};

// La fontaine au lion, l'atelier du potier, le théâtre, puis le temple sur la colline.
// Les deux autres bouts de route (vers les maisons et vers le bas à gauche) ne sont pas suivis.
export const GRECE_JOURS = {
  key: 'place-grece-jours',
  url: semaineGreceUrl,
  width: 1264,
  path: [
    [320, 430], [300, 500], [360, 545], [470, 545], [600, 555], [720, 575], [870, 585], [990, 570],
    [1090, 520], [1140, 450], [1110, 380], [1040, 330], [975, 285], [950, 245], [995, 210], [1040, 195],
  ],
  stops: [0, 3, 6, 15],
};

export const PLACES = [
  ATLAS, EGYPT, TEMPLE, PIRATES, CHINE, GAULE, GRECE,
  PIRATES_JOURS, CHINE_JOURS, GAULE_JOURS, GRECE_JOURS,
];
