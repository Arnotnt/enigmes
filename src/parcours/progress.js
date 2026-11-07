// La progression est gardée dans le navigateur : { "2026-11-09": ["Lundi", "Mardi"] }.
// Si le navigateur refuse, le jeu marche quand même, sans sauvegarde d'une fois sur l'autre.
//
// Deux sauvegardes, choisies sur l'écran de démarrage : celle de l'enfant, et « admin », où tous
// les mondes, toutes les semaines et tous les jours sont ouverts, pour tout tester. Chacune garde
// sa progression à part. La clé de l'enfant reste celle d'avant, pour ne rien perdre.
const STORAGE_KEYS = { joueur: 'enigmes.progress', admin: 'enigmes.progress.admin' };

function load(profile) {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS[profile])) ?? {};
  } catch {
    return {};
  }
}

let profile = 'joueur';
let progress = load(profile);

// profile : 'joueur' ou 'admin'.
export function chooseProfile(name) {
  profile = name;
  progress = load(profile);
}

// Vrai dans la sauvegarde admin : rien n'est fermé.
export const isAllOpen = () => profile === 'admin';

export const isDayDone = (week, day) => (progress[week.id] ?? []).includes(day.name);
export const isWeekDone = (week) => week.done || week.days.every((day) => isDayDone(week, day));

// Un jour s'ouvre quand le précédent est validé.
export function isDayOpen(week, day) {
  const index = week.days.indexOf(day);
  return isAllOpen() || index === 0 || isDayDone(week, week.days[index - 1]);
}

// La semaine à faire : la première qui n'est pas finie, ou la dernière si tout est fini.
export function currentWeekIndex(world) {
  const index = world.weeks.findIndex((week) => !isWeekDone(week));
  return index === -1 ? world.weeks.length - 1 : index;
}

export function markDayDone(week, day) {
  if (isDayDone(week, day)) return;
  progress[week.id] = [...(progress[week.id] ?? []), day.name];
  try {
    localStorage.setItem(STORAGE_KEYS[profile], JSON.stringify(progress));
  } catch {
    // Rien à faire : la progression reste en mémoire jusqu'à la fermeture de la page.
  }
}

// Un monde est fini quand toutes ses semaines le sont. Un monde sans semaine n'est pas encore fait,
// sauf s'il est marqué `done`.
export const isWorldDone = (world) =>
  world.done || (world.weeks.length > 0 && world.weeks.every(isWeekDone));

// Un monde est construit quand il a ses deux cartes (celle des semaines et celle des jours)
// et au moins une semaine.
export const isWorldBuilt = (world) => Boolean(world.place && world.weekPlace && world.weeks.length);

// Le monde à faire : le premier construit et pas fini, ou le dernier construit si tout est fini.
export function currentWorldIndex(worlds) {
  const index = worlds.findIndex((world) => isWorldBuilt(world) && !isWorldDone(world));
  if (index !== -1) return index;
  return worlds.findLastIndex(isWorldBuilt);
}
