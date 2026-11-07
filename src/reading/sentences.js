import { hasPicto } from './pictos.js';

// Les phrases que le jeu sait dessiner, avec les pictogrammes de src/assets/pictos/ :
//   « Le chat est sur le lit. »      un objet, une position, un autre objet
//   « Deux chiens sont sous la table. »
//   « Il y a trois ballons. »        un nombre d'objets
// Positions : sur, sous, dans, à côté de. Nombres : un, une, deux, trois (« les » compte pour deux).
// Une phrase devient une description : { subject, count, position, object }.

export const POSITIONS = ['sur', 'sous', 'dans', 'à côté de'];
const COUNTS = { un: 1, une: 1, le: 1, la: 1, "l'": 1, les: 2, deux: 2, trois: 3 };
const WORD = "[a-zàâçéèêëîïôûùüÿœ]+";
const DETERMINER = "(?:de la|de l'|du|des|de|le|la|l'|les|un|une)";

const RELATION = new RegExp(
  `^(?:(le|la|l'|un|une|les|deux|trois) )?(${WORD}) (?:est|sont) (sur|sous|dans|à côté) (?:${DETERMINER} )?(${WORD})$`,
);
const THERE_IS = new RegExp(`^il y a (un|une|deux|trois) (${WORD})$`);

// Minuscules, apostrophe droite, sans le point final : « L’oiseau est… » → « l' oiseau est… »
export function normalize(sentence) {
  return sentence
    .toLowerCase()
    .normalize('NFC')
    .replace(/[’`]/g, "'")
    .replace(/l'/g, "l' ")
    .replace(/[.!?]+\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Le mot tel qu'il a une image : « chats » → « chat », « oiseaux » → « oiseau ».
function noun(word) {
  if (hasPicto(word)) return word;
  const singular = word.replace(/[sx]$/, '');
  return hasPicto(singular) ? singular : null;
}

// Rend la description d'une phrase, ou null si le jeu ne sait pas la dessiner.
export function parseSentence(sentence) {
  const text = normalize(sentence);
  const relation = text.match(RELATION);
  if (relation) {
    const [, determiner = 'le', subjectWord, positionWord, objectWord] = relation;
    const subject = noun(subjectWord);
    const object = noun(objectWord);
    if (!subject || !object || subject === object) return null;
    const position = positionWord === 'à côté' ? 'à côté de' : positionWord;
    return { subject, count: COUNTS[determiner], position, object };
  }
  const thereIs = text.match(THERE_IS);
  if (thereIs) {
    const subject = noun(thereIs[2]);
    return subject ? { subject, count: COUNTS[thereIs[1]], position: null, object: null } : null;
  }
  return null;
}

// Ce que l'on voit vraiment : « le chat est sous le lit » et « le lit est sur le chat » sont la
// même image. Deux scènes de même signature ne doivent jamais être proposées ensemble.
export function signature({ subject, count, position, object }) {
  const group = `${count}×${subject}`;
  if (position === 'sur') return `${group} / ${object}`;
  if (position === 'sous') return `${object} / ${group}`;
  return `${group} ${position ?? ''} ${object ?? ''}`;
}

const OPPOSITE = { sur: 'sous', sous: 'sur', dans: 'à côté de', 'à côté de': 'sur' };

// Les scènes qui ne diffèrent de la bonne que par un détail de la phrase : la position, le
// nombre, ou l'objet principal (pris parmi `nouns`, les autres mots de la salle).
// Ordre : l'autre position, l'autre nombre, puis les autres objets. Les deux premiers sont les
// pièges les plus utiles, et un objet remplacé peut donner une scène étrange (un lit dans une boîte).
export function variants(description, nouns = []) {
  const { subject, count, position, object } = description;
  const list = [];
  if (position) list.push({ ...description, position: OPPOSITE[position] });
  list.push({ ...description, count: count === 1 ? 2 : 1 });
  for (const other of nouns) {
    if (other !== subject && other !== object) list.push({ ...description, subject: other });
  }
  const seen = new Set([signature(description)]);
  return list.filter((item) => {
    const key = signature(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Tous les noms d'une liste de phrases, pour fabriquer des scènes pièges.
export function nounsOf(descriptions) {
  return [...new Set(descriptions.flatMap(({ subject, object }) => [subject, object].filter(Boolean)))];
}
