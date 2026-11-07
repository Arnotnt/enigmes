import chineUrl from '../assets/objets/torche-chine.png';
import egypteUrl from '../assets/objets/torche-egypte.png';
import gauleUrl from '../assets/objets/torche-gaule.png';
import greceUrl from '../assets/objets/torche-grece.png';
import piratesUrl from '../assets/objets/torche-pirates.png';

// Les stèles de chaque monde. Une salle choisit la sienne avec sa propriété `torche`, dans Tiled ;
// sans propriété, c'est celle de l'Égypte.
// Chaque image a deux dessins côte à côte (éteinte, allumée), de frameWidth × frameHeight, alignés en bas.
// width : largeur affichée, en pixels de la salle. labelHeight et flameHeight : centre du cartouche
// et centre de la flamme, en pixels de la salle depuis le bas de la case où la stèle est posée.
// Les plaques sont unies : l'emblème dessiné par Gemini a été effacé pour bien lire la lettre.
export const TORCH_STYLES = {
  egypte: { url: egypteUrl, frameWidth: 160, frameHeight: 379, width: 20, labelHeight: 15.5, flameHeight: 41 },
  pirates: { url: piratesUrl, frameWidth: 202, frameHeight: 435, width: 22, labelHeight: 12.8, flameHeight: 34 },
  gaule: { url: gauleUrl, frameWidth: 216, frameHeight: 431, width: 22, labelHeight: 14, flameHeight: 31.5 },
  chine: { url: chineUrl, frameWidth: 214, frameHeight: 386, width: 22, labelHeight: 13.8, flameHeight: 32 },
  grece: { url: greceUrl, frameWidth: 214, frameHeight: 404, width: 22, labelHeight: 14.4, flameHeight: 32.3 },
};

const DEFAULT_STYLE = 'egypte';

// Le nom de la stèle d'une salle, connu de la scène qui l'a lu dans la carte.
export function torchStyleName(name) {
  if (!name) return DEFAULT_STYLE;
  if (TORCH_STYLES[name]) return name;
  console.warn(`Torche inconnue : ${name}`);
  return DEFAULT_STYLE;
}

export const torchKey = (name) => `torch-${name}`;
