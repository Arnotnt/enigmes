// Lecture à voix haute avec la voix française du navigateur.
const speech = window.speechSynthesis;

export const canSpeak = () => Boolean(speech);

export function speak(text) {
  if (!speech) return;
  speech.cancel(); // évite d'empiler les lectures

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = 0.85; // un peu plus lent, pour un enfant qui apprend à lire
  const voice = speech.getVoices().find((item) => item.lang.startsWith('fr'));
  if (voice) utterance.voice = voice;
  speech.speak(utterance);
}

export function stopSpeaking() {
  speech?.cancel();
}
