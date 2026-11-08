import './dialog.css';
import { canSpeak, speak, stopSpeaking } from '../speech.js';

// Une seule boîte pour tout le jeu : elle existe dans index.html et survit aux changements de salle.
class DialogBox {
  constructor() {
    this.box = document.querySelector('#dialog');
    this.textElement = document.querySelector('#dialog-text');
    this.listenButton = document.querySelector('#dialog-listen');
    this.listenable = true;
    this.listenButton.hidden = !canSpeak();
    this.listenButton.addEventListener('click', () => {
      this.listen();
      this.listenButton.blur(); // sinon Entrée « cliquerait » encore le bouton
    });
  }

  // autoSpeak : lire tout de suite, pour une consigne. Une épreuve de lecture passera false.
  show(text, { autoSpeak = false } = {}) {
    this.speech = text;
    this.setListenable(true);
    this.textElement.textContent = text;
    this.box.classList.remove('prompt', 'banner', 'caption');
    this.box.hidden = false;
    if (autoSpeak) this.listen();
  }

  // Affiche seulement le bouton d'écoute : l'enfant écoute, il n'a rien à lire.
  showPrompt(speech) {
    this.speech = speech;
    this.setListenable(true);
    this.textElement.textContent = '';
    this.box.classList.remove('banner', 'caption');
    this.box.classList.add('prompt');
    this.box.hidden = false;
  }

  // Affiche un texte en haut de l'écran, pour une énigme qui se joue dans toute la salle.
  showBanner(text, speech) {
    this.speech = speech;
    this.setListenable(true);
    this.textElement.textContent = text;
    this.box.classList.remove('prompt', 'caption');
    this.box.classList.add('banner');
    this.box.hidden = false;
  }

  // Comme la bannière, en plus petit, pour laisser voir une carte illustrée.
  showCaption(text, speech) {
    this.showBanner(text, speech);
    this.box.classList.add('caption');
  }

  hide() {
    this.box.hidden = true;
    stopSpeaking();
  }

  // Une épreuve de lecture peut cacher l'écoute un moment, pour pousser à lire d'abord.
  // Chaque nouveau texte la rend de nouveau possible.
  setListenable(listenable) {
    this.listenable = listenable;
    this.listenButton.hidden = !listenable || !canSpeak();
  }

  listen() {
    if (!this.box.hidden && this.listenable) speak(this.speech);
  }
}

export const dialogBox = new DialogBox();
