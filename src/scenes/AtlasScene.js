import { MAP_MUSIC } from '../audio/musics.js';
import { playMusic } from '../audio/sound.js';
import { currentWorldIndex, isAllOpen, isWorldBuilt, isWorldDone } from '../parcours/progress.js';
import { ATLAS } from '../parcours/places.js';
import { WORLDS } from '../parcours/worlds.js';
import { PathMapScene } from './PathMapScene.js';

// La carte des mondes : un point par monde de l'année. On peut glisser partout pour écouter le nom
// de chaque monde, mais Entrée n'ouvre qu'un monde fini ou en cours (tout monde construit dans la
// sauvegarde admin).
export class AtlasScene extends PathMapScene {
  constructor() {
    super('atlas');
  }

  create() {
    const current = currentWorldIndex(WORLDS);
    this.states = WORLDS.map((world, index) => {
      if (isWorldDone(world)) return 'done';
      const open = index === current || (isAllOpen() && isWorldBuilt(world));
      return open ? 'open' : 'closed';
    });
    const stops = WORLDS.map((world, index) => ({
      label: world.name ? String(index + 1) : '?',
      state: this.states[index],
    }));

    this.buildMap(ATLAS, stops, current);
    playMusic(MAP_MUSIC);
    this.say(this.describe(current));
  }

  // Tous les points se visitent : un monde fermé se découvre, il ne s'ouvre pas.
  get lastReachable() {
    return WORLDS.length - 1;
  }

  canEnter(index) {
    return isWorldBuilt(WORLDS[index]) && this.states[index] !== 'closed';
  }

  describe(index) {
    const { name, months } = WORLDS[index];
    const state = this.states[index];
    if (!name) return { text: '?', speech: `Un monde à découvrir, en ${months}.` };
    if (this.canEnter(index)) {
      const action = state === 'done' ? 'le revoir' : 'entrer';
      return { text: name, speech: `${name}. Appuie sur Entrée pour ${action}.` };
    }
    if (state === 'done') return { text: name, speech: `${name}. Ce monde est fini. Bravo !` };
    return { text: name, speech: `${name}. Ce monde s’ouvrira en ${months}.` };
  }

  closedText() {
    return { text: 'Fin du chemin', speech: 'C’est la fin du chemin.' };
  }

  enter(index) {
    if (!this.canEnter(index)) {
      this.say(this.describe(index));
      return;
    }
    this.leave(() => this.scene.start('world', { world: WORLDS[index] }));
  }
}
