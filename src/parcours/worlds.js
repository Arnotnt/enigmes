import { CHINE, EGYPT, GAULE, GRECE, PIRATES, TEMPLE } from './places.js';

// Le parcours du CP : les mondes de l'année, dans l'ordre de la carte des mondes.
// Un monde a un nom, ses mois, puis, quand il est construit, ses cartes (`place` pour les semaines,
// `weekPlace` pour les jours ; il ne s'ouvre qu'avec les deux et des semaines), sa musique (clé de `MUSICS` dans src/audio/musics.js) et ses semaines.
// `costume` habille le héros dans ce monde (clé de `COSTUMES` dans src/characters/costumes.js,
// par exemple 'pirate') ; sans costume, le héros est l'explorateur.
// Un monde sans nom est un « ? » sur la carte : un monde à découvrir.
// Les Pirates (septembre-octobre) comptent comme terminés : ce monde sera construit plus tard.
//
// Une semaine = un point d'étape. Chaque week-end, compléter la semaine à venir dans `weeks` :
// - id : la date du lundi. Elle sert à la sauvegarde : ne plus la changer ensuite ;
// - lessons : pour chaque jour, les salles à traverser dans l'ordre, avec un devoir par salle.
//   `room` est une clé de src/rooms.js et `entry` le point d'arrivée dans cette carte.
//   `devoir` choisit l'énigme, et le reste en donne le contenu ; les stèles se placent seules.
//   La fiche de chaque exercice, avec des exemples, est dans docs/exercices.md :
//   - additions : additions à trou au hasard, `max` = total le plus grand (10 sans rien) ;
//   - comparaisons : < ou > entre deux nombres au hasard, `max` = plus grand nombre (20 sans rien) ;
//   - mots : écouter un mot et trouver sa stèle, `mots` = la liste (4 au plus par ligne) ;
//   - lire-mots : lire un mot écrit et toucher son image, `mots` = la liste (images dans src/assets/pictos/) ;
//   - image-mot : voir une image et toucher son mot écrit, `mots` = la liste, `pieges` = mots en plus ;
//   - phrase-scene : lire une phrase et toucher sa scène, `phrases` = la liste (« Le chat est sur le lit. ») ;
//   - scene-phrase : voir une scène et choisir sa phrase parmi trois, `phrases` = comme phrase-scene ;
//   - syllabes : former la syllabe entendue, consonne puis voyelle, 4 fois. `syllabes` = la liste,
//     par exemple ['ma', 'li', 'ch-ou'] : le tiret sépare les deux sons quand ils font plusieurs lettres.
//   - sons : entendre une voyelle et toucher sa lettre, 4 fois. `sons` = la liste, par exemple ['a', 'i', 'o'].

const DAY_NAMES = ['Lundi', 'Mardi', 'Jeudi', 'Vendredi'];

function week(id, title, lessons = {}, done = false) {
  return { id, title, done, days: DAY_NAMES.map((name) => ({ name, rooms: lessons[name] ?? [] })) };
}

// Un devoir dans la salle du temple, la salle commune de l'Égypte.
function temple(devoir, contenu = {}) {
  return { room: 'temple-egypte', entry: 'entree', devoir, ...contenu };
}

// La salle commune de chaque autre monde. La Gaule et la Grèce ont aussi la leur,
// `salle-gaule` et `salle-grece`, pour quand leurs semaines seront écrites.
function salle(room) {
  return (devoir, contenu = {}) => ({ room, entry: 'entree', devoir, ...contenu });
}
const village = salle('salle-pirates');
const chine = salle('salle-chine');

// Le contenu de lecture de chaque semaine simulée : les mots (avec image), les pièges (mots
// écrits sans image, qui leur ressemblent) et les phrases. Chaque liste sert deux jours.
// La salle tient 8 stèles : mots et pièges ensemble n'en dépassent jamais 8.
const S1 = { // son [l]
  mots: ['lune', 'lama', 'lit', 'île', 'olive'],
  pieges: ['lame', 'lime', 'lilas'],
  phrases: ['Le lama est sur le lit.', 'Deux lamas sont à côté du lit.', 'La lune est sur l’île.', 'Il y a trois lits.'],
};
const S2 = { // son [r]
  mots: ['renard', 'moto', 'rat', 'riz', 'robot', 'lune'],
  pieges: ['rame', 'roi'],
  phrases: ['Le rat est sous le lit.', 'Le robot est dans la boîte.', 'Le renard est à côté de la moto.', 'Il y a deux rats.'],
};
const S3 = { // son [m]
  mots: ['momie', 'mûre', 'rame', 'mur', 'moto', 'lama'],
  pieges: ['mime', 'rime'],
  phrases: ['La momie est dans la boîte.', 'Deux momies sont à côté du lit.', 'Le lama est sur le mur.', 'Il y a trois mûres.'],
};
const S4 = { // son [s]
  mots: ['sac', 'salade', 'sirop', 'os', 'sel'],
  pieges: ['sol', 'sale', 'salle'],
  phrases: ['Le sac est sur la chaise.', 'L’os est sous la table.', 'Deux sacs sont à côté du lit.', 'Il y a trois os.'],
};
const S5 = { // son [f]
  mots: ['fée', 'fusée', 'sofa', 'café', 'fil'],
  pieges: ['fumée', 'filé', 'farine'],
  phrases: ['La fée est sur le sofa.', 'Le chat est sous le sofa.', 'Deux fusées sont à côté du lit.', 'Il y a trois fées.'],
};
const S6 = { // son [n]
  mots: ['âne', 'ananas', 'navire', 'nez', 'lune'],
  pieges: ['nana', 'animal', 'nul'],
  phrases: ['L’âne est à côté du navire.', 'L’ananas est sur la table.', 'Deux ânes sont sous l’arbre.', 'Il y a trois ananas.'],
};
const S7 = { // son [t]
  mots: ['tortue', 'tapis', 'tasse', 'tomate', 'moto'],
  pieges: ['tarte', 'totem', 'tasser'],
  phrases: ['La tortue est sur le tapis.', 'La tasse est sur la table.', 'Deux tortues sont sous la table.', 'Il y a trois tomates.'],
};

// Les Pirates (septembre-octobre), simulé : les voyelles, puis deux semaines de révision avec les premières phrases.
// `sons` remplace `syllabes` : il n'y a pas encore de consonne.
const A1 = { // a, i
  mots: ['chat', 'rat', 'sac', 'lit', 'riz', 'kiwi'],
  pieges: ['lot', 'sec'],
};
const A2 = { // o
  mots: ['moto', 'os', 'robot', 'vélo', 'domino', 'lit'],
  pieges: ['mot', 'lot'],
};
const A3 = { // u
  mots: ['lune', 'tortue', 'mur', 'mûre', 'bus', 'jupe'],
  pieges: ['lut', 'rue'],
};
const A4 = { // e
  mots: ['renard', 'cheval', 'melon', 'cerise', 'chemise'],
  pieges: ['menu', 'venir'],
};
const A5 = { // é
  mots: ['vélo', 'fée', 'café', 'fusée', 'épée', 'bébé'],
  pieges: ['été', 'épi'],
};
const A6 = { // révision : les nombres
  mots: ['chat', 'moto', 'lune', 'fée', 'robot', 'sac'],
  pieges: ['mot', 'lot'],
  phrases: ['Il y a deux chats.', 'Il y a trois lits.', 'Il y a un vélo.', 'Il y a deux robots.'],
};
const A7 = { // révision : les positions
  mots: ['lit', 'vélo', 'tortue', 'cheval', 'bébé'],
  pieges: ['lot', 'bel'],
  phrases: ['Le chat est sur le lit.', 'Le rat est sous la table.', 'Le robot est dans la boîte.', 'Il y a deux vélos.'],
};
const VOYELLES = ['a', 'i', 'o', 'u', 'e', 'é'];

// La Chine, simulée : p, d, b, puis les premiers sons de deux lettres (ou, on, ch).
const C1 = { // p
  mots: ['pomme', 'pirate', 'purée', 'pull', 'puma'],
  pieges: ['pipe', 'pile', 'pâte'],
  phrases: ['La pomme est sur la table.', 'Le pirate est à côté du sac.', 'Deux pommes sont dans le panier.', 'Il y a trois pulls.'],
};
const C2 = { // d
  mots: ['dé', 'domino', 'radis', 'dame', 'salade'],
  pieges: ['date', 'dur', 'ride'],
  phrases: ['Le dé est dans la boîte.', 'Deux dominos sont sur la table.', 'Le radis est à côté de la tomate.', 'Il y a trois dés.'],
};
const C3 = { // b, mélangé avec d et p, souvent confondus
  mots: ['bol', 'bus', 'bébé', 'robe', 'tube', 'robot'],
  pieges: ['balle', 'bulle'],
  phrases: ['Le bébé est dans le lit.', 'Le bol est sur la table.', 'Deux bus sont à côté de l’arbre.', 'Il y a trois bols.'],
};
const C4 = { // ou
  mots: ['loup', 'poule', 'roue', 'poupée', 'soupe', 'mouton'],
  pieges: ['loupe', 'pou'],
  phrases: ['Le loup est sous le lit.', 'Deux poules sont à côté de la roue.', 'La poupée est dans la boîte.', 'Il y a trois poules.'],
};
const C5 = { // on
  mots: ['dragon', 'pont', 'melon', 'lion', 'bonbon', 'ballon'],
  pieges: ['long', 'salon'],
  phrases: ['Le dragon est sur le pont.', 'Le lion est sous le pont.', 'Deux melons sont dans le panier.', 'Il y a trois bonbons.'],
};
const C6 = { // ch
  mots: ['cheval', 'mouche', 'niche', 'chou', 'chaise', 'chat'],
  pieges: ['chute', 'roche'],
  phrases: ['Le chat est dans la niche.', 'La mouche est sur le chou.', 'Deux chiens sont à côté de la niche.', 'Il y a trois mouches.'],
};

export const WORLDS = [
  {
    name: 'Les Pirates',
    months: 'septembre et octobre',
    costume: 'pirate',
    place: PIRATES,
    weekPlace: TEMPLE, // en attendant la carte des jours des pirates
    // Simulation (US-902). `done` : ces semaines sont passées. Sans lui, le jeu enverrait l'enfant
    // aux pirates plutôt qu'en Égypte. Le monde se visite quand même depuis la carte des mondes.
    done: true,
    weeks: [
      week('2026-08-31', 'Semaine du 31 août', {
        Lundi: [village('sons', { sons: ['a', 'i'] }), village('additions', { max: 5 })],
        Mardi: [village('lire-mots', { mots: A1.mots }), village('comparaisons', { max: 5 })],
        Jeudi: [village('mots', { mots: A1.mots }), village('sons', { sons: ['a', 'i'] })],
        Vendredi: [village('image-mot', { mots: A1.mots, pieges: A1.pieges }), village('additions', { max: 5 })],
      }),
      week('2026-09-07', 'Semaine du 7 septembre', {
        Lundi: [village('mots', { mots: A2.mots }), village('additions', { max: 5 })],
        Mardi: [village('sons', { sons: ['a', 'i', 'o'] }), village('image-mot', { mots: A2.mots, pieges: A2.pieges })],
        Jeudi: [village('comparaisons', { max: 10 }), village('sons', { sons: ['a', 'i', 'o'] })],
        Vendredi: [village('lire-mots', { mots: A2.mots }), village('additions', { max: 5 })],
      }),
      week('2026-09-14', 'Semaine du 14 septembre', {
        Lundi: [village('image-mot', { mots: A3.mots, pieges: A3.pieges }), village('sons', { sons: ['i', 'o', 'u'] })],
        Mardi: [village('additions', { max: 6 }), village('mots', { mots: A3.mots })],
        Jeudi: [village('sons', { sons: ['i', 'o', 'u'] }), village('lire-mots', { mots: A3.mots })],
        Vendredi: [village('additions', { max: 6 }), village('comparaisons', { max: 10 })],
      }),
      week('2026-09-21', 'Semaine du 21 septembre', {
        Lundi: [village('comparaisons', { max: 10 }), village('sons', { sons: ['a', 'o', 'u', 'e'] })],
        Mardi: [village('lire-mots', { mots: A4.mots }), village('additions', { max: 8 })],
        Jeudi: [village('mots', { mots: [...A4.mots, 'menu'] }), village('additions', { max: 8 })],
        Vendredi: [village('image-mot', { mots: A4.mots, pieges: A4.pieges }), village('sons', { sons: ['a', 'o', 'u', 'e'] })],
      }),
      week('2026-09-28', 'Semaine du 28 septembre', {
        Lundi: [village('additions', { max: 8 }), village('lire-mots', { mots: A5.mots })],
        Mardi: [village('sons', { sons: ['e', 'é', 'i'] }), village('mots', { mots: A5.mots })],
        Jeudi: [village('image-mot', { mots: A5.mots, pieges: A5.pieges }), village('additions', { max: 8 })],
        Vendredi: [village('sons', { sons: ['e', 'é', 'i'] }), village('comparaisons', { max: 10 })],
      }),
      week('2026-10-05', 'Semaine du 5 octobre', {
        Lundi: [village('sons', { sons: VOYELLES }), village('additions', { max: 10 })],
        Mardi: [village('lire-mots', { mots: A6.mots }), village('phrase-scene', { phrases: A6.phrases })],
        Jeudi: [village('mots', { mots: A6.mots }), village('comparaisons', { max: 10 })],
        Vendredi: [village('image-mot', { mots: A6.mots, pieges: A6.pieges }), village('scene-phrase', { phrases: A6.phrases })],
      }),
      week('2026-10-12', 'Semaine du 12 octobre', {
        Lundi: [village('phrase-scene', { phrases: A7.phrases }), village('mots', { mots: [...A7.mots, 'lune'] })],
        Mardi: [village('additions', { max: 10 }), village('image-mot', { mots: A7.mots, pieges: A7.pieges })],
        Jeudi: [village('scene-phrase', { phrases: A7.phrases }), village('sons', { sons: VOYELLES })],
        Vendredi: [village('lire-mots', { mots: A7.mots }), village('comparaisons', { max: 15 })],
      }),
    ],
  },
  {
    name: 'L’Égypte',
    months: 'novembre et décembre',
    music: 'musique-egypte',
    costume: 'egyptien',
    place: EGYPT,
    weekPlace: TEMPLE,
    weeks: [
      // Simulation : 7 semaines inventées pour tester tout le monde (US-901).
      // Un son par semaine, 2 salles par jour : chacun des 8 exercices revient une fois par semaine.
      week('2026-11-02', 'Semaine du 2 novembre', {
        Lundi: [temple('syllabes', { syllabes: ['la', 'li', 'lo', 'lu', 'lé'] }), temple('additions', { max: 5 })],
        Mardi: [temple('lire-mots', { mots: S1.mots }), temple('comparaisons', { max: 10 })],
        Jeudi: [temple('mots', { mots: ['lune', 'lama', 'lame', 'lit', 'lilas', 'île'] }), temple('phrase-scene', { phrases: S1.phrases })],
        Vendredi: [temple('image-mot', { mots: S1.mots, pieges: S1.pieges }), temple('scene-phrase', { phrases: S1.phrases })],
      }, true), // déjà passée quand le jeu a commencé
      week('2026-11-09', 'Semaine du 9 novembre', {
        Lundi: [temple('comparaisons', { max: 20 }), temple('mots', { mots: ['rat', 'riz', 'rame', 'robot', 'renard', 'roi'] })],
        Mardi: [temple('scene-phrase', { phrases: S2.phrases }), temple('syllabes', { syllabes: ['ra', 'ri', 'ro', 'ru', 'la'] })],
        Jeudi: [temple('additions', { max: 10 }), temple('image-mot', { mots: S2.mots, pieges: S2.pieges })],
        Vendredi: [temple('phrase-scene', { phrases: S2.phrases }), temple('lire-mots', { mots: S2.mots })],
      }),
      week('2026-11-16', 'Semaine du 16 novembre', {
        Lundi: [temple('lire-mots', { mots: S3.mots }), temple('scene-phrase', { phrases: S3.phrases })],
        Mardi: [temple('additions', { max: 10 }), temple('mots', { mots: ['momie', 'mûre', 'mur', 'mime', 'rame', 'moto'] })],
        Jeudi: [temple('syllabes', { syllabes: ['ma', 'mi', 'mo', 'mu', 'ra', 'li'] }), temple('image-mot', { mots: S3.mots, pieges: S3.pieges })],
        Vendredi: [temple('comparaisons', { max: 20 }), temple('phrase-scene', { phrases: S3.phrases })],
      }),
      week('2026-11-23', 'Semaine du 23 novembre', {
        Lundi: [temple('phrase-scene', { phrases: S4.phrases }), temple('additions', { max: 12 })],
        Mardi: [temple('syllabes', { syllabes: ['sa', 'si', 'so', 'su', 'ma', 'ré'] }), temple('image-mot', { mots: S4.mots, pieges: S4.pieges })],
        Jeudi: [temple('scene-phrase', { phrases: S4.phrases }), temple('comparaisons', { max: 20 })],
        Vendredi: [temple('mots', { mots: ['sac', 'sel', 'sol', 'salade', 'sirop', 'os'] }), temple('lire-mots', { mots: S4.mots })],
      }),
      week('2026-11-30', 'Semaine du 30 novembre', {
        Lundi: [temple('mots', { mots: ['fée', 'fil', 'fusée', 'fumée', 'sofa', 'café'] }), temple('scene-phrase', { phrases: S5.phrases })],
        Mardi: [temple('comparaisons', { max: 30 }), temple('image-mot', { mots: S5.mots, pieges: S5.pieges })],
        Jeudi: [temple('syllabes', { syllabes: ['fa', 'fi', 'fo', 'fu', 'sa', 'mi'] }), temple('phrase-scene', { phrases: S5.phrases })],
        Vendredi: [temple('additions', { max: 15 }), temple('lire-mots', { mots: S5.mots })],
      }),
      week('2026-12-07', 'Semaine du 7 décembre', {
        Lundi: [temple('additions', { max: 15 }), temple('phrase-scene', { phrases: S6.phrases })],
        Mardi: [temple('lire-mots', { mots: S6.mots }), temple('syllabes', { syllabes: ['na', 'ni', 'no', 'nu', 'fa', 'lu'] })],
        Jeudi: [temple('mots', { mots: ['âne', 'ananas', 'navire', 'nez', 'nana', 'lune'] }), temple('comparaisons', { max: 30 })],
        Vendredi: [temple('scene-phrase', { phrases: S6.phrases }), temple('image-mot', { mots: S6.mots, pieges: S6.pieges })],
      }),
      week('2026-12-14', 'Semaine du 14 décembre', {
        Lundi: [temple('image-mot', { mots: S7.mots, pieges: S7.pieges }), temple('comparaisons', { max: 30 })],
        Mardi: [temple('phrase-scene', { phrases: S7.phrases }), temple('mots', { mots: ['tortue', 'tapis', 'tasse', 'tarte', 'tomate', 'moto'] })],
        Jeudi: [temple('scene-phrase', { phrases: S7.phrases }), temple('additions', { max: 20 })],
        Vendredi: [temple('lire-mots', { mots: S7.mots }), temple('syllabes', { syllabes: ['ta', 'ti', 'to', 'tu', 'na', 'ré'] })],
      }),
    ],
  },
  {
    name: 'La Chine',
    months: 'janvier et février',
    costume: 'chinois',
    place: CHINE,
    weekPlace: TEMPLE, // en attendant la carte des jours de la Chine
    // Simulation (US-902).
    weeks: [
      week('2027-01-04', 'Semaine du 4 janvier', {
        Lundi: [chine('mots', { mots: [...C1.mots, 'pile'] }), chine('additions', { max: 20 })],
        Mardi: [chine('image-mot', { mots: C1.mots, pieges: C1.pieges }), chine('syllabes', { syllabes: ['pa', 'pi', 'po', 'pu', 'té'] })],
        Jeudi: [chine('phrase-scene', { phrases: C1.phrases }), chine('comparaisons', { max: 50 })],
        Vendredi: [chine('lire-mots', { mots: C1.mots }), chine('scene-phrase', { phrases: C1.phrases })],
      }),
      week('2027-01-11', 'Semaine du 11 janvier', {
        Lundi: [chine('syllabes', { syllabes: ['da', 'di', 'do', 'du', 'pa'] }), chine('lire-mots', { mots: C2.mots })],
        Mardi: [chine('scene-phrase', { phrases: C2.phrases }), chine('additions', { max: 20 })],
        Jeudi: [chine('comparaisons', { max: 50 }), chine('image-mot', { mots: C2.mots, pieges: C2.pieges })],
        Vendredi: [chine('mots', { mots: [...C2.mots, 'date'] }), chine('phrase-scene', { phrases: C2.phrases })],
      }),
      week('2027-01-18', 'Semaine du 18 janvier', {
        Lundi: [chine('phrase-scene', { phrases: C3.phrases }), chine('comparaisons', { max: 60 })],
        Mardi: [chine('mots', { mots: ['bol', 'bus', 'bébé', 'balle', 'robe', 'tube'] }), chine('lire-mots', { mots: C3.mots })],
        Jeudi: [chine('additions', { max: 20 }), chine('scene-phrase', { phrases: C3.phrases })],
        Vendredi: [chine('syllabes', { syllabes: ['ba', 'bo', 'bu', 'da', 'po'] }), chine('image-mot', { mots: C3.mots, pieges: C3.pieges })],
      }),
      week('2027-01-25', 'Semaine du 25 janvier', {
        Lundi: [chine('image-mot', { mots: C4.mots, pieges: C4.pieges }), chine('additions', { max: 20 })],
        Mardi: [chine('syllabes', { syllabes: ['l-ou', 'm-ou', 'p-ou', 'r-ou', 's-ou'] }), chine('phrase-scene', { phrases: C4.phrases })],
        Jeudi: [chine('lire-mots', { mots: C4.mots }), chine('mots', { mots: ['loup', 'loupe', 'poule', 'roue', 'soupe', 'poupée'] })],
        Vendredi: [chine('scene-phrase', { phrases: C4.phrases }), chine('comparaisons', { max: 80 })],
      }),
      week('2027-02-01', 'Semaine du 1er février', {
        Lundi: [chine('scene-phrase', { phrases: C5.phrases }), chine('syllabes', { syllabes: ['p-on', 'l-on', 'm-on', 'b-on', 'd-on'] })],
        Mardi: [chine('comparaisons', { max: 100 }), chine('lire-mots', { mots: C5.mots })],
        Jeudi: [chine('mots', { mots: ['dragon', 'pont', 'melon', 'lion', 'long', 'bonbon'] }), chine('phrase-scene', { phrases: C5.phrases })],
        Vendredi: [chine('additions', { max: 20 }), chine('image-mot', { mots: C5.mots, pieges: C5.pieges })],
      }),
      week('2027-02-08', 'Semaine du 8 février', {
        Lundi: [chine('lire-mots', { mots: C6.mots }), chine('comparaisons', { max: 100 })],
        Mardi: [chine('phrase-scene', { phrases: C6.phrases }), chine('additions', { max: 20 })],
        Jeudi: [chine('syllabes', { syllabes: ['ch-a', 'ch-i', 'ch-o', 'ch-ou', 'ch-on'] }), chine('image-mot', { mots: C6.mots, pieges: C6.pieges })],
        Vendredi: [chine('scene-phrase', { phrases: C6.phrases }), chine('mots', { mots: ['cheval', 'mouche', 'niche', 'chou', 'chute', 'chat'] })],
      }),
    ],
  },
  // Cartes des jours : celle du temple, en attendant la leur. 6 semaines chacun, à écrire.
  { name: 'La Gaule', months: 'mars et avril', costume: 'gaulois', place: GAULE, weekPlace: TEMPLE, weeks: [] },
  { name: 'La Grèce antique', months: 'mai et juin', costume: 'grec', place: GRECE, weekPlace: TEMPLE, weeks: [] },
];
