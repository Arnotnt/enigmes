import { pictoKey } from '../reading/pictos.js';

// Dessine une scène décrite par une phrase (voir src/reading/sentences.js) dans un carré de côté
// `size`, centré sur (x, y). Les pictogrammes sont posés les uns par rapport aux autres :
// au-dessus pour « sur », en dessous pour « sous », à moitié caché pour « dans », côte à côte pour
// « à côté de ». Rend la liste des images, pour les faire trembler ou les effacer ensemble.
export function drawScene(scene, x, y, size, { subject, count, position, object }) {
  const parts = [];
  const add = (word, px, py, side) => {
    parts.push(scene.add.image(px, py, pictoKey(word)).setDisplaySize(side, side));
  };
  // `count` objets côte à côte, centrés sur (cx, cy), dans une largeur `width`.
  const addGroup = (cx, cy, width, side) => {
    const each = Math.min(side, width / count);
    for (let i = 0; i < count; i++) add(subject, cx + (i - (count - 1) / 2) * each, cy, each);
  };

  if (!position) {
    addGroup(x, y, size, size * 0.6);
  } else if (position === 'sur') {
    add(object, x, y + size * 0.2, size * 0.6);
    addGroup(x, y - size * 0.25, size * 0.9, size * 0.42);
  } else if (position === 'sous') {
    add(object, x, y - size * 0.17, size * 0.62);
    addGroup(x, y + size * 0.28, size * 0.9, size * 0.4);
  } else if (position === 'dans') {
    // Le contenu dépasse du haut, et le contenant, dessiné après, en cache le bas.
    addGroup(x, y - size * 0.12, size * 0.6, size * 0.42);
    add(object, x, y + size * 0.16, size * 0.68);
  } else {
    add(object, x + size * 0.24, y, size * 0.5);
    addGroup(x - size * 0.24, y, size * 0.48, size * 0.44);
  }
  return parts;
}
