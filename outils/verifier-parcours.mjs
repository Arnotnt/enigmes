// Vérifie tout le parcours, sans ouvrir le jeu : npm run verifier.
// S'arrête avec une erreur si un devoir est mal écrit : la publication s'arrête alors aussi.
// Le parcours importe des images : Vite sait les lire, là où Node seul ne saurait pas.
import { readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { createServer } from 'vite';

const server = await createServer({
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false, watch: null },
});

let problems;
try {
  const { checkParcours } = await server.ssrLoadModule('/src/parcours/check.js');
  const { ROOMS } = await server.ssrLoadModule('/src/rooms.js');
  // ROOMS donne l'adresse de chaque carte, dont le nom de fichier ne change pas.
  const readMap = (room) => {
    const file = basename(ROOMS[room].split('?')[0]);
    return JSON.parse(readFileSync(join('src/assets/maps', file), 'utf8'));
  };
  problems = checkParcours({ readMap });
} finally {
  await server.close();
}

if (problems.length > 0) {
  console.error(`\n${problems.length} erreur(s) dans le parcours : à corriger avant de publier.`);
  process.exit(1);
}
console.log('Parcours vérifié : aucune erreur.');
