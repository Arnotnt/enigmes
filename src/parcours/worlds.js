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
//   - syllabes : former la syllabe entendue, consonne puis voyelle, 4 fois. `syllabes` = la liste,
//     par exemple ['ma', 'li', 'ch-ou'] : le tiret sépare les deux sons quand ils font plusieurs lettres.

const DAY_NAMES = ['Lundi', 'Mardi', 'Jeudi', 'Vendredi'];

function week(id, title, lessons = {}, done = false) {
  return { id, title, done, days: DAY_NAMES.map((name) => ({ name, rooms: lessons[name] ?? [] })) };
}

export const WORLDS = [
  { name: 'Septembre-Octobre', months: 'septembre et octobre', done: true, weeks: [] },
  {
    name: 'L’Égypte',
    months: 'novembre et décembre',
    music: 'musique-egypte',
    place: EGYPT,
    weekPlace: TEMPLE,
    weeks: [
      week('2026-11-02', 'Semaine du 2 novembre', {}, true), // déjà passée quand le jeu a commencé
      week('2026-11-09', 'Semaine du 9 novembre', {
        Lundi: [{ room: 'temple-egypte', entry: 'entree', devoir: 'additions' }], // totaux jusqu'à 10
        Mardi: [{ room: 'temple-egypte', entry: 'entree', devoir: 'comparaisons', max: 20 }],
        Jeudi: [{ room: 'temple-egypte', entry: 'entree', devoir: 'additions', max: 15 }],
        Vendredi: [
          { room: 'temple-egypte', entry: 'entree', devoir: 'mots', mots: ['lune', 'renard', 'moto'] },
        ],
      }),
      week('2026-11-16', 'Semaine du 16 novembre'),
      week('2026-11-23', 'Semaine du 23 novembre'),
      week('2026-11-30', 'Semaine du 30 novembre'),
      week('2026-12-07', 'Semaine du 7 décembre'),
      week('2026-12-14', 'Semaine du 14 décembre'),
    ],
  },
  { name: 'La Chine', months: 'janvier et février', weeks: [] },
  { name: null, months: 'mars et avril', weeks: [] },
  { name: null, months: 'mai et juin', weeks: [] },
];
