import additions15Url from './assets/maps/additions-15.tmj?url';
import comparaisonsUrl from './assets/maps/comparaisons.tmj?url';
import firstRoomUrl from './assets/maps/first-room.tmj?url';
import secondRoomUrl from './assets/maps/second-room.tmj?url';
import motsUrl from './assets/maps/mots.tmj?url';
import thirdRoomUrl from './assets/maps/third-room.tmj?url';
import templeEgypteUrl from './assets/salles/temple-egypte.jpg?url';

// Toutes les cartes du jeu. La clé est le nom utilisé par la propriété `salle` des sorties.
export const ROOMS = {
  'first-room': firstRoomUrl,
  'second-room': secondRoomUrl,
  'third-room': thirdRoomUrl,
  comparaisons: comparaisonsUrl, // < ou > entre deux nombres de 0 à 20
  'additions-15': additions15Url, // additions à trou, totaux jusqu'à 15
  mots: motsUrl, // écouter un mot et trouver le panneau où il est écrit
};

// Les fonds de salle dessinés. Une carte choisit le sien avec sa propriété `fond`, dans Tiled.
// L'image couvre toute la salle, murs compris : elle remplace les tuiles des calques `sol` et `murs`.
export const BACKGROUNDS = {
  'temple-egypte': templeEgypteUrl,
};

// Une sortie vers cette « salle » termine le devoir de la salle : on passe à la salle suivante.
export const ROOM_DONE = 'fin';
