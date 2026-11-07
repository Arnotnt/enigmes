import cartesMp3 from '../assets/sons/musique-cartes.mp3?url';
import cartesOgg from '../assets/sons/musique-cartes.ogg?url';
import egypteMp3 from '../assets/sons/musique-egypte.mp3?url';
import egypteOgg from '../assets/sons/musique-egypte.ogg?url';

// Les musiques du jeu, chargées par BootScene. Chacune existe en deux formats :
// Phaser prend le premier que le navigateur sait lire (OGG boucle mieux, MP3 pour Safari).
export const MUSICS = {
  'musique-cartes': [cartesOgg, cartesMp3], // écran de démarrage et carte des mondes
  'musique-egypte': [egypteOgg, egypteMp3],
};

export const MAP_MUSIC = 'musique-cartes';
