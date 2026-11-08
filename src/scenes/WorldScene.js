import { MAP_MUSIC } from '../audio/musics.js';
import { playBravo, playMusic } from '../audio/sound.js';
import { currentWeekIndex, currentWorldIndex, isAllOpen, isWeekDone, isWeekWaiting } from '../parcours/progress.js';
import { WORLDS } from '../parcours/worlds.js';
import { backButton } from '../ui/BackButton.js';
import { PathMapScene } from './PathMapScene.js';

// La carte d'un monde : un point par semaine. Le point suivant s'ouvre quand la semaine est finie
// (toutes sont ouvertes dans la sauvegarde admin). Une semaine simulée reste fermée pour l'enfant.
const WAITING_SPEECH = 'Les devoirs de cette semaine arrivent bientôt.';

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
      const open = (index === current || isAllOpen()) && !isWeekDone(week) && !isWeekWaiting(week);
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
    const next = this.world.weeks.find((week) => !isWeekDone(week));
    if (isWeekWaiting(next)) return { text: 'Bravo !', speech: 'Bravo ! La semaine est finie. Les devoirs de la semaine suivante arrivent bientôt.' };
    return { text: 'Bravo !', speech: 'Bravo ! La semaine est finie. Une nouvelle semaine est ouverte.' };
  }

  describe(index) {
    const week = this.world.weeks[index];
    if (isWeekWaiting(week)) return { text: week.title, speech: `${week.title}. ${WAITING_SPEECH}` };
    return { text: week.title, speech: `${week.title}. Appuie sur Entrée pour entrer.` };
  }

  closedText(target) {
    if (target === null) return { text: 'Fin du chemin', speech: 'C’est la fin du chemin.' };
    if (isWeekWaiting(this.world.weeks[target])) return { text: 'Bientôt', speech: WAITING_SPEECH };
    return { text: 'Fermé', speech: 'Ce point est fermé. Finis d’abord la semaine en cours.' };
  }

  enter(index) {
    const week = this.world.weeks[index];
    if (isWeekWaiting(week)) {
      this.say(this.describe(index));
      return;
    }
    backButton.hide();
    this.leave(() => this.scene.start('week', { world: this.world, week }));
  }

  // ← sur la première semaine, ou → sur la dernière, ramène à la carte des mondes.
  exitsBy() {
    return true;
  }

  goBack() {
    backButton.hide();
    this.leave(() => this.scene.start('atlas'));
  }
}
