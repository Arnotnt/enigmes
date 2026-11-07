// Télécharge des pictogrammes ARASAAC pour les mots d'un devoir, dans src/assets/pictos/.
//
//   node outils/picto.mjs lune moto renard     le meilleur pictogramme de chaque mot
//   node outils/picto.mjs lune=2933            un pictogramme précis, par son numéro
//
// Le numéro se trouve sur https://arasaac.org, en cherchant le mot : il sert quand le premier
// résultat ne convient pas. Regardez toujours les images obtenues avant de les publier.
// Pictogrammes : Sergio Palao, ARASAAC (https://arasaac.org), Gouvernement d'Aragon,
// licence CC BY-NC-SA (voir CREDITS.md).

import { mkdir, writeFile } from 'node:fs/promises';

const API = 'https://api.arasaac.org/v1/pictograms/fr';
const IMAGE_SIZE = 300; // pixels : assez fin pour la caméra qui agrandit la salle 4 fois
const FOLDER = new URL('../src/assets/pictos/', import.meta.url);

async function findId(word) {
  for (const search of ['bestsearch', 'search']) {
    const response = await fetch(`${API}/${search}/${encodeURIComponent(word)}`);
    if (!response.ok) continue;
    const [first] = await response.json();
    if (first) return first._id;
  }
  return null;
}

const words = process.argv.slice(2);
if (words.length === 0) {
  console.log('Donnez les mots : node outils/picto.mjs lune moto renard');
  process.exit(1);
}

await mkdir(FOLDER, { recursive: true });
for (const arg of words) {
  const [word, forcedId] = arg.split('=');
  const id = forcedId ?? (await findId(word));
  if (!id) {
    console.log(`✗ ${word} : aucun pictogramme trouvé. Cherchez-le sur arasaac.org, puis ${word}=<numéro>.`);
    continue;
  }
  const response = await fetch(`https://static.arasaac.org/pictograms/${id}/${id}_${IMAGE_SIZE}.png`);
  if (!response.ok) {
    console.log(`✗ ${word} : l'image ${id} n'a pas pu être téléchargée.`);
    continue;
  }
  await writeFile(new URL(`${word}.png`, FOLDER), Buffer.from(await response.arrayBuffer()));
  console.log(`✓ ${word} : pictogramme ${id}`);
}
