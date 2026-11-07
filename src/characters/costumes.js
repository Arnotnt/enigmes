import explorateurUrl from '../assets/personnages/explorateur.png';
import pirateUrl from '../assets/personnages/pirate.png';

// Les costumes du héros. Un monde choisit le sien avec sa propriété `costume` (src/parcours/worlds.js).
// Toutes les planches ont la même disposition : voir outils/decouper-personnage.py.
export const COSTUMES = { explorateur: explorateurUrl, pirate: pirateUrl };

const DEFAULT_COSTUME = 'explorateur';

// Nom de la planche du héros dans un monde. Hors d'un monde, ou sans costume indiqué : l'explorateur.
export function heroTexture(world) {
  const costume = world?.costume ?? DEFAULT_COSTUME;
  if (COSTUMES[costume]) return `hero-${costume}`;
  console.warn(`Costume inconnu : ${costume}`);
  return `hero-${DEFAULT_COSTUME}`;
}

// Nom de l'animation de marche d'une planche dans une direction.
export const walkAnimation = (texture, direction) => `${texture}-walk-${direction}`;
