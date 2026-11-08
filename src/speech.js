import { SPEECH_RESTART_DELAY, SPEECH_START_TIMEOUT } from './constants.js';

// Lecture à voix haute avec la voix française du navigateur.
const speech = window.speechSynthesis;

let restartTimer = null;
let watchdogTimer = null;
let utterance = null; // gardée ici : sinon le navigateur peut l'oublier en cours de lecture

// Ceux qui veulent savoir quand la voix parle : la musique baisse pendant ce temps.
const listeners = new Set();
let speaking = false;

const setSpeaking = (value) => {
  if (value === speaking) return;
  speaking = value;
  for (const listener of listeners) listener(value);
};

export const onSpeakingChange = (listener) => listeners.add(listener);

const clearTimers = () => {
  clearTimeout(restartTimer);
  clearTimeout(watchdogTimer);
};

// Le navigateur peut finir une lecture commencée avant un rechargement de la page.
speech?.cancel();

export const canSpeak = () => Boolean(speech);

// Une voix de France d'abord : sur Mac, une voix du Québec peut être listée avant, et l'accent
// compte pour des sons et des syllabes. Sinon, une autre voix française.
function frenchVoice() {
  const voices = speech.getVoices();
  const language = (voice) => voice.lang.replace('_', '-');
  return voices.find((voice) => language(voice) === 'fr-FR') ?? voices.find((voice) => language(voice).startsWith('fr'));
}

function start(text, canRetry) {
  const current = new SpeechSynthesisUtterance(text);
  utterance = current;
  utterance.lang = 'fr-FR';
  utterance.rate = 0.85; // un peu plus lent, pour un enfant qui apprend à lire
  const voice = frenchVoice();
  if (voice) utterance.voice = voice;

  // Si le moteur reste muet, on le relance une fois.
  let started = false;
  utterance.onstart = () => {
    started = true;
    setSpeaking(true);
  };
  // Une lecture coupée finit aussi : on ne l'écoute que si c'est encore la lecture en cours.
  utterance.onend = () => {
    if (utterance === current) setSpeaking(false);
  };
  utterance.onerror = utterance.onend;
  if (canRetry) {
    watchdogTimer = setTimeout(() => {
      if (!started) speak(text, false);
    }, SPEECH_START_TIMEOUT);
  }

  speech.speak(utterance);
}

export function speak(text, canRetry = true) {
  if (!speech) return;
  clearTimers();

  // Couper une lecture puis enchaîner aussitôt peut bloquer le moteur : la nouvelle ne démarre
  // jamais. On lui laisse donc un instant pour s'arrêter.
  const busy = speech.speaking || speech.pending;
  speech.cancel();
  restartTimer = setTimeout(() => start(text, canRetry), busy ? SPEECH_RESTART_DELAY : 0);
}

export function stopSpeaking() {
  clearTimers();
  speech?.cancel();
  setSpeaking(false);
}
