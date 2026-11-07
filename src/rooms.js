import firstRoomUrl from './assets/maps/first-room.tmj?url';
import secondRoomUrl from './assets/maps/second-room.tmj?url';
import templeEgypteRoomUrl from './assets/maps/temple-egypte.tmj?url';
import thirdRoomUrl from './assets/maps/third-room.tmj?url';
import templeEgypteUrl from './assets/salles/temple-egypte.jpg?url';

// Toutes les cartes du jeu. La clé est le nom utilisé par la propriété `salle` des sorties.
export const ROOMS = {
  'first-room': firstRoomUrl,
  'second-room': secondRoomUrl,
  'third-room': thirdRoomUrl,
  'temple-egypte': templeEgypteRoomUrl, // salle vide du temple : le devoir vient du parcours
};

// Les fonds de salle dessinés. Une carte choisit le sien avec sa propriété `fond`, dans Tiled.
// L'image couvre toute la salle, murs compris : elle remplace les tuiles des calques `sol` et `murs`.
export const BACKGROUNDS = {
  'temple-egypte': templeEgypteUrl,
};

// Une sortie vers cette « salle » termine le devoir de la salle : on passe à la salle suivante.
export const ROOM_DONE = 'fin';
