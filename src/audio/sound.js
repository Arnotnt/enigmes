import { MUSIC_DUCKED_VOLUME, MUSIC_FADE, MUSIC_VOLUME } from '../constants.js';
import { onSpeakingChange } from '../speech.js';

// La musique et les bruitages du jeu. Ils passent par le gestionnaire de sons de Phaser, commun
// à toutes les scènes : la musique continue quand on change d'écran.
// La touche M coupe la musique et les bruitages, jamais la voix : l'enfant doit toujours pouvoir
// écouter les consignes.

const STORAGE_KEY = 'enigmes.son'; // 'coupe' quand le son est coupé
const DUCK_FADE = 200; // millisecondes pour baisser la musique quand la voix commence
const FADE_STEP = 30; // millisecondes entre deux changements de volume pendant un fondu

let sound = null; // le gestionnaire de sons de Phaser
let music = null; // la musique en cours
let musicKey = null; // la musique demandée, même si elle attend que le son soit débloqué
let ducked = false; // vrai pendant que la voix parle
const button = document.querySelector('#sound-button');

const musicVolume = () => (ducked ? MUSIC_DUCKED_VOLUME : MUSIC_VOLUME);

// Change le volume petit à petit. Un nouveau fondu sur la même musique remplace l'ancien.
// Le volume est retenu dans `level` : celui que rend Phaser arrive avec un temps de retard.
function fade(track, to, duration, done) {
  const from = track.level;
  const start = performance.now();
  const id = (track.fadeId ?? 0) + 1;
  track.fadeId = id;
  const step = () => {
    if (track.fadeId !== id) return;
    const progress = Math.min(1, (performance.now() - start) / duration);
    track.level = from + (to - from) * progress;
    track.setVolume(track.level);
    if (progress < 1) setTimeout(step, FADE_STEP);
    else done?.();
  };
  step();
}

function readMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'coupe';
  } catch {
    return false;
  }
}

function setMuted(muted) {
  sound.mute = muted;
  button.classList.toggle('off', muted);
  button.setAttribute('aria-label', muted ? 'Remettre le son' : 'Couper le son');
  try {
    localStorage.setItem(STORAGE_KEY, muted ? 'coupe' : 'oui');
  } catch {
    // Sans sauvegarde, le choix vaut jusqu'à la fermeture de la page.
  }
}

const toggleMuted = () => setMuted(!sound.mute);

// À appeler une fois, au démarrage du jeu.
export function initSound(game) {
  sound = game.sound;
  setMuted(readMuted());
  button.hidden = false;
  button.addEventListener('click', () => {
    toggleMuted();
    button.blur(); // sinon Entrée « cliquerait » encore le bouton
  });
  window.addEventListener('keydown', (event) => {
    if (event.code === 'KeyM' && !event.repeat) toggleMuted();
  });

  onSpeakingChange((speaking) => {
    ducked = speaking;
    if (music) fade(music, musicVolume(), DUCK_FADE);
  });
}

let pendingStart = null; // la musique qui attend le premier appui sur une touche

// Lance une musique en boucle, chargée par BootScene. Si c'est déjà elle, elle continue.
export function playMusic(key) {
  if (key === musicKey) return;
  stopMusic();
  musicKey = key;

  const start = () => {
    if (musicKey !== key || music) return; // une autre musique a été demandée entre-temps
    music = sound.add(key, { loop: true, volume: 0 });
    music.level = 0;
    music.play();
    fade(music, musicVolume(), MUSIC_FADE);
  };
  // Le navigateur garde le son bloqué jusqu'au premier appui sur une touche.
  if (pendingStart) sound.off('unlocked', pendingStart);
  pendingStart = sound.locked ? start : null;
  if (sound.locked) sound.once('unlocked', start);
  else start();
}

export function stopMusic() {
  musicKey = null;
  if (!music) return;
  const old = music;
  music = null;
  fade(old, 0, MUSIC_FADE, () => old.destroy());
}

// Joue des notes fabriquées par le navigateur : pas de fichier, pas de licence.
// notes : [fréquence en Hz, début en secondes, durée en secondes].
function playNotes(notes, { type = 'triangle', volume = 0.2 } = {}) {
  const context = sound?.context;
  if (!context || sound.locked || sound.mute) return;
  const now = context.currentTime;
  for (const [frequency, at, length] of notes) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    // Attaque rapide puis extinction douce : une note ronde, sans claquement.
    gain.gain.setValueAtTime(0, now + at);
    gain.gain.linearRampToValueAtTime(volume, now + at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + at + length);
    oscillator.connect(gain).connect(sound.destination);
    oscillator.start(now + at);
    oscillator.stop(now + at + length + 0.05);
  }
}

// Un petit « pop » quand le personnage part sur la carte.
export const playStep = () => playNotes([[660, 0, 0.12]], { type: 'sine', volume: 0.15 });

// Do, mi, sol, do : une journée ou une semaine est finie.
export const playBravo = () =>
  playNotes([
    [523, 0, 0.18],
    [659, 0.13, 0.18],
    [784, 0.26, 0.18],
    [1047, 0.39, 0.6],
  ]);
