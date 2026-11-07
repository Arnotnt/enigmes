import { MAP_MUSIC } from '../audio/musics.js';
import { playBravo, playMusic } from '../audio/sound.js';
import { currentWeekIndex, currentWorldIndex, isWeekDone } from '../parcours/progress.js';
import { WORLDS } from '../parcours/worlds.js';
import { backButton } from '../ui/BackButton.js';
import { PathMapScene } from './PathMapScene.js';

// La carte d'un monde : un point par semaine. Le point suivant s'ouvre quand la semaine est finie.
export class WorldScene extends PathMapScene {
  constructor() {
    super('world');
  }

  // world : le monde ouvert. finished : la semaine qui vient d'être validée, pour féliciter l'enfant.
  init({ world = WORLDS[currentWorldIndex(WORLDS)], finished = null }) {
    this.world = world;
    this.finished = finished;
  }

  create() {
    const current = currentWeekIndex(this.world);
    const stops = this.world.weeks.map((week, index) => {
      const open = index === current && !isWeekDone(week);
      return { label: String(index + 1), state: isWeekDone(week) ? 'done' : open ? 'open' : 'closed' };
    });
    this.buildMap(this.world.place, stops, current);
    playMusic(this.world.music ?? MAP_MUSIC);
    backButton.show(() => this.goBack());
    if (this.finished) playBravo();
    this.say(this.finished ? this.bravo() : this.describe(current));
  }

  bravo() {
    const done = this.world.weeks.every(isWeekDone);
    if (done) return { text: 'Bravo !', speech: `Bravo ! Tu as fini ${this.world.name.toLowerCase()} !` };
    return { text: 'Bravo !', speech: 'Bravo ! La semaine est finie. Une nouvelle semaine est ouverte.' };
  }

  describe(index) {
    const { title } = this.world.weeks[index];
    return { text: title, speech: `${title}. Appuie sur Entrée pour entrer.` };
  }

  closedText(target) {
    if (target === null) return { text: 'Fin du chemin', speech: 'C’est la fin du chemin.' };
    return { text: 'Fermé', speech: 'Ce point est fermé. Finis d’abord la semaine en cours.' };
  }

  enter(index) {
    const week = this.world.weeks[index];
    backButton.hide();
    this.leave(() => this.scene.start('week', { world: this.world, week }));
  }

  goBack() {
    backButton.hide();
    this.leave(() => this.scene.start('atlas'));
  }
}
