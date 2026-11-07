// Les pictogrammes ARASAAC des mots, rangés dans src/assets/pictos/ (un fichier par mot, par
// exemple lune.png). Pour en ajouter : node outils/picto.mjs lune moto.
// Vite les trouve tous ici : il suffit de déposer le fichier, sans toucher au code.
const files = import.meta.glob('../assets/pictos/*.png', { eager: true, import: 'default' });

// mot → adresse publiée de son image
export const PICTOS = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.split('/').pop().replace('.png', '').normalize('NFC'), url]),
);

export const pictoKey = (word) => `picto-${word.normalize('NFC')}`;
export const hasPicto = (word) => word.normalize('NFC') in PICTOS;
