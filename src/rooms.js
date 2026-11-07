import firstRoomUrl from './assets/maps/first-room.tmj?url';
import secondRoomUrl from './assets/maps/second-room.tmj?url';
import thirdRoomUrl from './assets/maps/third-room.tmj?url';

// Toutes les cartes du jeu. La clé est le nom utilisé par la propriété `salle` des sorties.
export const ROOMS = {
  'first-room': firstRoomUrl,
  'second-room': secondRoomUrl,
  'third-room': thirdRoomUrl,
};

// Une sortie vers cette « salle » termine le devoir de la salle : on passe à la salle suivante.
export const ROOM_DONE = 'fin';
