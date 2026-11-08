// La progression est gardée dans le navigateur : { "2026-11-09": ["Lundi", "Mardi"] }.
// Si le navigateur refuse, le jeu marche quand même, sans sauvegarde d'une fois sur l'autre.
//
// Deux sauvegardes, choisies sur l'écran de démarrage : celle de l'enfant, et « admin », où tous
// les mondes, toutes les semaines et tous les jours sont ouverts, pour tout tester. Chacune garde
// sa progression à part. La clé de l'enfant reste celle d'avant, pour ne rien perdre.
const STORAGE_KEYS = { joueur: 'enigmes.progress', admin: 'enigmes.progress.admin' };

// Garde seulement ce qui ressemble à une progression : une sauvegarde abîmée ne doit jamais
// empêcher d'enregistrer la suite.
function repair(saved) {
  if (typeof saved !== 'object' || saved === null || Array.isArray(saved)) return {};
  return Object.fromEntries(Object.entries(saved).filter(([, days]) => Array.isArray(days)));
}

function load(profile) {
  try {
    return repair(JSON.parse(localStorage.getItem(STORAGE_KEYS[profile])));
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

// Efface la progression de la sauvegarde admin, jamais celle de l'enfant.
export function resetAdminProgress() {
  try {
    localStorage.removeItem(STORAGE_KEYS.admin);
  } catch {
    // Rien à faire : la sauvegarde n'existe qu'en mémoire.
  }
  if (profile === 'admin') progress = {};
}

// Vrai dans la sauvegarde admin : rien n'est fermé.
export const isAllOpen = () => profile === 'admin';

// Vrai pour une semaine simulée vue depuis la sauvegarde de l'enfant : elle attend ses vrais
// devoirs. L'enfant ne peut pas y jouer, donc aucun de ses jours ne sera validé à l'avance.
export const isWeekWaiting = (week) => Boolean(week.simulation) && !isAllOpen();

// Un jour sans devoir (jour férié, sortie) compte comme fait : il ne bloque jamais la suite.
export const isDayDone = (week, day) => week.done || day.rooms.length === 0 || (progress[week.id] ?? []).includes(day.name);
export const isWeekDone = (week) => week.done || week.days.every((day) => isDayDone(week, day));

// Un jour s'ouvre quand tous les précédents sont validés : un mardi sans devoir n'ouvre pas jeudi
// avant que lundi soit fait.
export function isDayOpen(week, day) {
  const index = week.days.indexOf(day);
  return isAllOpen() || week.days.slice(0, index).every((previous) => isDayDone(week, previous));
}

// La semaine à faire : la première qui n'est pas finie, ou la dernière si tout est fini.
// Si cette semaine attend ses vrais devoirs, l'enfant reste sur celle qu'il vient de finir.
export function currentWeekIndex(world) {
  const index = world.weeks.findIndex((week) => !isWeekDone(week));
  if (index === -1) return world.weeks.length - 1;
  return isWeekWaiting(world.weeks[index]) ? Math.max(index - 1, 0) : index;
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
