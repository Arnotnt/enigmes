import firstRoomUrl from './assets/maps/first-room.tmj?url';
import salleChineRoomUrl from './assets/maps/salle-chine.tmj?url';
import salleGauleRoomUrl from './assets/maps/salle-gaule.tmj?url';
import salleGreceRoomUrl from './assets/maps/salle-grece.tmj?url';
import sallePiratesRoomUrl from './assets/maps/salle-pirates.tmj?url';
import secondRoomUrl from './assets/maps/second-room.tmj?url';
import templeEgypteRoomUrl from './assets/maps/temple-egypte.tmj?url';
import thirdRoomUrl from './assets/maps/third-room.tmj?url';
import salleChineUrl from './assets/salles/salle-chine.jpg?url';
import salleGauleUrl from './assets/salles/salle-gaule.jpg?url';
import salleGreceUrl from './assets/salles/salle-grece.jpg?url';
import sallePiratesUrl from './assets/salles/salle-pirates.jpg?url';
import templeEgypteUrl from './assets/salles/temple-egypte.jpg?url';

// Toutes les cartes du jeu. La clé est le nom utilisé par la propriété `salle` des sorties.
export const ROOMS = {
  'first-room': firstRoomUrl,
  'second-room': secondRoomUrl,
  'third-room': thirdRoomUrl,
  'temple-egypte': templeEgypteRoomUrl, // salle vide du temple : le devoir vient du parcours
  // Les salles des autres mondes, vides elles aussi. Murs : deux cases en haut et à gauche, une
  // à droite et en bas, comme sur leurs images.
  'salle-pirates': sallePiratesRoomUrl,
  'salle-chine': salleChineRoomUrl,
  'salle-gaule': salleGauleRoomUrl,
  'salle-grece': salleGreceRoomUrl,
};

// Les fonds de salle dessinés. Une carte choisit le sien avec sa propriété `fond`, dans Tiled.
// L'image couvre toute la salle, murs compris : elle remplace les tuiles des calques `sol` et `murs`.
export const BACKGROUNDS = {
  'temple-egypte': templeEgypteUrl,
  'salle-pirates': sallePiratesUrl,
  'salle-chine': salleChineUrl,
  'salle-gaule': salleGauleUrl,
  'salle-grece': salleGreceUrl,
};

// Une sortie vers cette « salle » termine le devoir de la salle : on passe à la salle suivante.
export const ROOM_DONE = 'fin';

// Une sortie vers cette « salle » ramène à la carte de la semaine, comme Échap, sans rien valider.
// Une flèche la montre dans la salle.
export const ROOM_BACK = 'semaine';
