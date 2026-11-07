import { EGYPT, TEMPLE } from './places.js';

// Le parcours du CP : les mondes de l'année, dans l'ordre de la carte des mondes.
// Un monde a un nom, ses mois, puis, quand il est construit, ses cartes (`place` pour les semaines,
// `weekPlace` pour les jours), sa musique (clé de `MUSICS` dans src/audio/musics.js) et ses semaines.
// `costume` habille le héros dans ce monde (clé de `COSTUMES` dans src/characters/costumes.js,
// par exemple 'pirate') ; sans costume, le héros est l'explorateur.
// Un monde sans nom est un « ? » sur la carte : un monde à découvrir.
// Septembre-Octobre compte comme terminé : ce monde sera construit plus tard.
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

export const WORLDS = [
  { name: 'Septembre-Octobre', months: 'septembre et octobre', done: true, weeks: [] },
  {
    name: 'L’Égypte',
    months: 'novembre et décembre',
    music: 'musique-egypte',
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
  { name: 'La Chine', months: 'janvier et février', weeks: [] },
  { name: null, months: 'mars et avril', weeks: [] },
  { name: null, months: 'mai et juin', weeks: [] },
];
