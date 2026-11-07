import { EGYPT, TEMPLE } from './places.js';

// Le parcours du CP. Septembre-Octobre compte comme terminé : ce monde sera construit plus tard.
//
// Une semaine = un point d'étape. Chaque week-end, compléter la semaine à venir dans `weeks` :
// - id : la date du lundi. Elle sert à la sauvegarde : ne plus la changer ensuite ;
// - lessons : pour chaque jour, les salles à traverser dans l'ordre, avec un devoir par salle.
//   `room` est une clé de src/rooms.js et `entry` le point d'arrivée dans cette carte.

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
        Lundi: [{ room: 'third-room', entry: 'entree' }], // 4 additions à trou au hasard
        Mardi: [{ room: 'comparaisons', entry: 'entree' }], // 4 comparaisons au hasard, de 0 à 20
        Jeudi: [{ room: 'additions-15', entry: 'entree' }], // 4 additions à trou, totaux jusqu'à 15
        Vendredi: [{ room: 'mots', entry: 'entree' }], // lune, renard, moto
      }),
      week('2026-11-16', 'Semaine du 16 novembre'),
      week('2026-11-23', 'Semaine du 23 novembre'),
      week('2026-11-30', 'Semaine du 30 novembre'),
      week('2026-12-07', 'Semaine du 7 décembre'),
      week('2026-12-14', 'Semaine du 14 décembre'),
    ],
  },
];
