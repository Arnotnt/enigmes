import { defineConfig } from 'vite';

// Chemins relatifs : le jeu fonctionnera aussi sous /nom-du-depot/ sur GitHub Pages.
// Deux pages publiées : le jeu, et la page qui fait dire les syllabes pour tester la voix.
export default defineConfig({
  base: './',
  build: {
    chunkSizeWarningLimit: 1600, // le fichier du jeu est gros à cause de Phaser, sans gêne ici
    rollupOptions: {
      input: { jeu: 'index.html', voix: 'outils/voix.html' },
    },
  },
});
