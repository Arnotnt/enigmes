import { MAP_MUSIC } from '../audio/musics.js';
import { playBravo, playMusic } from '../audio/sound.js';
import { isDayDone, isDayOpen, isWeekDone } from '../parcours/progress.js';
import { backButton } from '../ui/BackButton.js';
import { SOLVED_ROOMS } from './RoomScene.js';
import { PathMapScene } from './PathMapScene.js';

// La carte de la semaine : un point par jour, à valider dans l'ordre.
export class WeekScene extends PathMapScene {
  constructor() {
    super('week');
  }

  // finished : le jour qui vient d'être validé.
  init({ world, week, finished = null }) {
    this.world = world;
    this.week = week;
    this.finished = finished;
  }

  create() {
    if (this.finished && isWeekDone(this.week)) {
      this.scene.start('world', { world: this.world, finished: this.week });
      return;
    }

    const { days } = this.week;
    const state = (day) => {
      if (day.rooms.length === 0) return 'empty';
      if (isDayDone(this.week, day)) return 'done';
      return isDayOpen(this.week, day) ? 'open' : 'closed';
    };
    const stops = days.map((day) => ({ label: day.name, state: state(day) }));
    const firstToDo = days.findIndex((day) => !isDayDone(this.week, day));

    this.buildMap(this.world.weekPlace, stops, firstToDo === -1 ? 0 : firstToDo);
    backButton.show(() => this.goBack());
    playMusic(this.world.music ?? MAP_MUSIC);
    if (this.finished) playBravo();
    this.say(
      this.finished
        ? { text: 'Bravo !', speech: `Bravo ! ${this.finished.name} est fini.` }
        : this.describe(this.current),
    );
  }

  describe(index) {
    const day = this.week.days[index];
    if (day.rooms.length === 0) {
      return { text: day.name, speech: `${day.name}. Il n’y a pas de devoir ce jour-là.` };
    }
    return { text: day.name, speech: `${day.name}. Appuie sur Entrée pour commencer.` };
  }

  closedText(target) {
    if (target === null) return { text: 'Fin du chemin', speech: 'C’est le dernier jour de la semaine.' };
    const toDo = this.week.days.find((day) => !isDayDone(this.week, day));
    return { text: 'Fermé', speech: `Ce jour est fermé. Finis d’abord ${toDo.name.toLowerCase()}.` };
  }

  // Chaque jour repart de zéro : les énigmes de la veille ne restent pas résolues.
  enter(index) {
    const day = this.week.days[index];
    if (day.rooms.length === 0) {
      this.say(this.describe(index));
      return;
    }

    backButton.hide();
    this.registry.set(SOLVED_ROOMS, []);
    this.leave(() => this.scene.start('room', { world: this.world, week: this.week, day }));
  }

  // ← sur le lundi ramène à la carte du monde.
  exitsBy(step) {
    return step < 0;
  }

  goBack() {
    backButton.hide();
    this.leave(() => this.scene.start('world', { world: this.world }));
  }
}
