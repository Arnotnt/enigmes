import { MUSICS } from '../audio/musics.js';
import { COSTUMES } from '../characters/costumes.js';
import { hasPicto } from '../reading/pictos.js';
import { parseSentence } from '../reading/sentences.js';
import { SPOKEN_SOUNDS } from '../reading/sounds.js';
import { ROOMS } from '../rooms.js';
import { WORLDS } from './worlds.js';

const MAX_STONES = 8; // la salle ne tient pas plus de stèles de mots

// Une liste de contenu doit exister et ne pas être vide.
function checkList(lesson, field) {
  return Array.isArray(lesson[field]) && lesson[field].length > 0 ? [] : [`liste « ${field} » vide ou absente`];
}

function checkMax({ max }) {
  return max === undefined || (Number.isInteger(max) && max >= 1) ? [] : [`max doit être un nombre entier d'au moins 1 (ici ${max})`];
}

function checkStones(lesson) {
  const count = new Set([...(lesson.mots ?? []), ...(lesson.pieges ?? [])]).size;
  return count <= MAX_STONES ? [] : [`${count} stèles, pour ${MAX_STONES} au plus`];
}

function checkPictures({ mots = [] }) {
  return mots.filter((word) => !hasPicto(word)).map((word) => `pas d'image pour « ${word} » (node outils/picto.mjs ${word})`);
}

function checkSentences({ phrases = [] }) {
  return phrases.filter((sentence) => !parseSentence(sentence)).map((sentence) => `phrase impossible à dessiner, « ${sentence} »`);
}

// « ma » ou « ch-ou » : au plus un tiret, avec un son de chaque côté.
function checkSyllables({ syllabes = [] }) {
  return syllabes
    .filter((syllable) => {
      const parts = syllable.includes('-') ? syllable.split('-') : [syllable[0], syllable.slice(1)];
      return parts.length !== 2 || parts.some((part) => !part);
    })
    .map((syllable) => `syllabe mal écrite, « ${syllable} »`);
}

function checkSounds({ sons = [] }) {
  return sons.filter((sound) => !SPOKEN_SOUNDS[sound]).map((sound) => `son inconnu, « ${sound} »`);
}

const list = (field) => (lesson) => checkList(lesson, field);

// Ce que vérifie chaque devoir. Une nouvelle énigme de devoir (DEVOIRS, dans RoomScene.js)
// s'ajoute aussi ici : sinon la vérification la refuse comme « devoir inconnu ».
const DEVOIR_CHECKS = {
  additions: [checkMax],
  comparaisons: [checkMax],
  mots: [list('mots'), checkStones],
  'lire-mots': [list('mots'), checkStones, checkPictures],
  'image-mot': [list('mots'), checkStones, checkPictures],
  'phrase-scene': [list('phrases'), checkSentences],
  'scene-phrase': [list('phrases'), checkSentences],
  syllabes: [list('syllabes'), checkSyllables],
  sons: [list('sons'), checkSounds],
};

function checkRoom({ room, entry }, readMap) {
  if (!ROOMS[room]) return [`salle inconnue, « ${room} »`];
  const map = readMap?.(room);
  if (!map) return []; // sans carte à lire, le point d'arrivée n'est pas vérifié
  const objects = map.layers.find((layer) => layer.name === 'objets')?.objects ?? [];
  return objects.some((object) => object.name === entry) ? [] : [`point d'arrivée inconnu, « ${entry} », dans ${room}`];
}

function checkLesson(lesson, readMap) {
  const checks = DEVOIR_CHECKS[lesson.devoir];
  const problems = checkRoom(lesson, readMap);
  if (!checks) return [...problems, `devoir inconnu, « ${lesson.devoir} »`];
  return [...problems, ...checks.flatMap((check) => check(lesson))];
}

function checkWorld(world) {
  const problems = [];
  if (world.music && !MUSICS[world.music]) problems.push(`musique inconnue, « ${world.music} »`);
  if (world.costume && !COSTUMES[world.costume]) problems.push(`costume inconnu, « ${world.costume} »`);
  if (world.place && world.weeks.length > world.place.stops.length) {
    problems.push(`${world.weeks.length} semaines pour ${world.place.stops.length} points sur la carte`);
  }
  const days = world.weeks[0]?.days.length ?? 0;
  if (world.weekPlace && days > world.weekPlace.stops.length) {
    problems.push(`${days} jours pour ${world.weekPlace.stops.length} points sur la carte de la semaine`);
  }
  return problems.map((problem) => `${world.name ?? 'Monde sans nom'} : ${problem}`);
}

// Relit tout le parcours et rend la liste des erreurs, écrites aussi dans la console.
// `npm run verifier` la lance avant chaque publication (outils/verifier-parcours.mjs), et le jeu
// au démarrage. readMap(salle) rend le contenu de la carte Tiled, pour vérifier le point d'arrivée.
export function checkParcours({ worlds = WORLDS, readMap = null } = {}) {
  const problems = worlds.flatMap((world) => [
    ...checkWorld(world),
    ...world.weeks.flatMap((week) => week.days.flatMap((day) => day.rooms.flatMap((lesson) =>
      checkLesson(lesson, readMap).map((problem) => `${world.name ?? 'Monde sans nom'}, ${week.title}, ${day.name} : ${problem}`)))),
  ]);
  for (const problem of problems) console.error(`Parcours : ${problem}`);
  return problems;
}
