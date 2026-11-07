// Le bouton « Retour » en haut à gauche : Échap fait la même chose au clavier.
class BackButton {
  constructor() {
    this.button = document.querySelector('#back-button');
  }

  show(onClick) {
    this.button.onclick = onClick;
    this.button.hidden = false;
  }

  hide() {
    this.button.hidden = true;
  }
}

export const backButton = new BackButton();
