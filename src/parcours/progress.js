// La progression est gardée dans le navigateur : { "2026-11-09": ["Lundi", "Mardi"] }.
// Si le navigateur refuse, le jeu marche quand même, sans sauvegarde d'une fois sur l'autre.
const STORAGE_KEY = 'enigmes.progress';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

const progress = load();

export const isDayDone = (week, day) => (progress[week.id] ?? []).includes(day.name);
export const isWeekDone = (week) => week.done || week.days.every((day) => isDayDone(week, day));

// Un jour s'ouvre quand le précédent est validé.
export function isDayOpen(week, day) {
  const index = week.days.indexOf(day);
  return index === 0 || isDayDone(week, week.days[index - 1]);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Rien à faire : la progression reste en mémoire jusqu'à la fermeture de la page.
  }
}
