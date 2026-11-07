import { hasPicto } from '../reading/pictos.js';
import { parseSentence } from '../reading/sentences.js';
import { WORLDS } from './worlds.js';

// Relit tout le parcours au démarrage et signale dans la console ce que le jeu ne saura pas
// montrer : un mot sans image, une phrase qu'il ne sait pas dessiner. L'enfant n'en voit rien :
// en jeu, ces mots et ces phrases sont simplement laissés de côté.
export function checkParcours(worlds = WORLDS) {
  const problems = [];
  for (const world of worlds) {
    for (const week of world.weeks) {
      for (const day of week.days) {
        for (const lesson of day.rooms) {
          const where = `${week.title}, ${day.name}`;
          if (['lire-mots', 'image-mot'].includes(lesson.devoir)) {
            for (const word of lesson.mots ?? []) {
              if (!hasPicto(word)) problems.push(`${where} : pas d'image pour « ${word} » (node outils/picto.mjs ${word})`);
            }
          }
          for (const sentence of lesson.phrases ?? []) {
            if (!parseSentence(sentence)) problems.push(`${where} : phrase impossible à dessiner, « ${sentence} »`);
          }
        }
      }
    }
  }
  for (const problem of problems) console.error(`Parcours : ${problem}`);
  return problems;
}
