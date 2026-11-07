import { EGYPT, TEMPLE } from './places.js';

// Le parcours du CP. Septembre-Octobre compte comme terminé : ce monde sera construit plus tard.
//
// Une semaine = un point d'étape. Chaque week-end, compléter la semaine à venir dans `weeks` :
// - id : la date du lundi. Elle sert à la sauvegarde : ne plus la changer ensuite ;
// - lessons : pour chaque jour, les salles à traverser dans l'ordre, avec un devoir par salle.
//   `room` est une clé de src/rooms.js et `entry` le point d'arrivée dans cette carte.
//   `devoir` choisit l'énigme, et le reste en donne le contenu ; les stèles se placent seules :
//   - additions : additions à trou au hasard, `max` = total le plus grand (10 sans rien) ;
//   - comparaisons : < ou > entre deux nombres au hasard, `max` = plus grand nombre (20 sans rien) ;
//   - mots : écouter un mot et trouver sa stèle, `mots` = la liste (4 au plus par ligne).

const DAY_NAMES = ['Lundi', 'Mardi', 'Jeudi', 'Vendredi'];

function week(id, title, lessons = {}, done = false) {
  return { id, title, done, days: DAY_NAMES.map((name) => ({ name, rooms: lessons[name] ?? [] })) };
}

export const WORLDS = [
  {
    name: 'L’Égypte',
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
];
