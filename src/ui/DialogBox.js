import './dialog.css';
import { canSpeak, speak, stopSpeaking } from '../speech.js';

// Une seule boîte pour tout le jeu : elle existe dans index.html et survit aux changements de salle.
class DialogBox {
  constructor() {
    this.box = document.querySelector('#dialog');
    this.textElement = document.querySelector('#dialog-text');
    this.listenButton = document.querySelector('#dialog-listen');
    this.listenButton.hidden = !canSpeak();
    this.listenButton.addEventListener('click', () => this.listen());
  }

  // autoSpeak : lire tout de suite, pour une consigne. Une épreuve de lecture passera false.
  show(text, { autoSpeak = false } = {}) {
    this.textElement.textContent = text;
    this.box.hidden = false;
    if (autoSpeak) this.listen();
  }

  hide() {
    this.box.hidden = true;
    stopSpeaking();
  }

  listen() {
    if (!this.box.hidden) speak(this.textElement.textContent);
  }
}

export const dialogBox = new DialogBox();
