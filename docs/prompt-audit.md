# Prompt d'audit du code

À donner à un agent (ou à coller dans une session Claude Code) pour un audit complet du projet. Il n'écrit qu'un rapport : aucune modification du code.

---

Tu es développeur senior, expert en JavaScript, Phaser et Vite, et habitué aux jeux éducatifs. Tu fais l'audit complet du jeu **Énigmes** (dépôt courant). Le propriétaire apprend Phaser : écris en français simple, explique chaque constat en une ou deux phrases, sans jargon inutile.

## Contexte à lire d'abord

1. `CLAUDE.md` : règles de conception (pas de game over, consignes à voix haute, salle jamais bloquante…), conventions techniques et organisation.
2. `docs/backlog.md`, `docs/exercices.md`, `docs/feuille-de-route.md`.
3. Les issues GitHub ouvertes et fermées récemment : `gh issue list --state all --limit 100`, puis `gh issue view <n>` pour celles qui sont ouvertes.
4. L'historique récent : `git log --oneline -60`.

## Ce que tu relis

**Tout** le code de `src/` (scènes, énigmes, objets, parcours, interface, audio, lecture), plus `index.html`, `vite.config.js`, `package.json`, `.github/workflows/`, `outils/` et les cartes `src/assets/maps/*.tmj` (seulement leurs propriétés et objets). Lis chaque fichier en entier : pas de survol.

## Ce que tu cherches

### 1. Bugs et fragilités
- Erreurs de logique, cas limites (liste vide, devoir mal rempli, salle absente de la journée, sauvegarde ancienne ou corrompue dans `localStorage`).
- Fuites : écouteurs clavier, `setTimeout`, tweens, éléments HTML ou voix qui survivent à la sortie d'une scène (`shutdown`).
- Tout ce qui peut **bloquer l'enfant** : énigme sans remise à zéro, texte sans écoute possible, touche qui ne répond plus, voix coupée par M.
- Respect des règles de `CLAUDE.md` : `autoSpeak`, musique absente des salles, chemins relatifs pour GitHub Pages, assets importés (pas de chemins en dur), aucune donnée personnelle hors les prénoms de `PLAYERS`.

### 2. Code mort
- Fichiers, fonctions, exports, constantes, clés de configuration jamais utilisés (vérifie chaque import et chaque usage avec `grep`).
- Cartes `.tmj`, images, sons ou pictogrammes qui ne sont référencés nulle part.
- Énigmes ou scènes qui ne sont plus atteignables depuis le parcours.
- Dépendances de `package.json` inutilisées.
- Pour chaque élément, donne la preuve (la recherche faite) et dis si on peut le supprimer sans risque.

### 3. Optimisations et simplifications
- Code dupliqué entre les énigmes (`src/puzzles/`) ou entre les scènes de carte : propose une factorisation seulement si elle simplifie vraiment.
- Performance : chargements (`BootScene`), taille du build (`npm run build`, regarde la taille des fichiers produits), images trop lourdes, travail refait à chaque image dans `update`.
- Lisibilité : fonctions trop longues, noms peu clairs, commentaires faux ou périmés.
- Ne propose pas d'outils lourds (TypeScript, framework de tests complet) sans peser le pour et le contre pour un projet tenu le week-end.

### 4. Pertinence du backlog
Pour chaque US ouverte (issues GitHub et `docs/backlog.md`) :
- **Déjà faite** (en tout ou partie) d'après le code ? Cite le fichier.
- **Toujours utile** pour le but pédagogique (apprendre à lire, 6-7 ans) ?
- **À revoir** : trop grosse, floue, en contradiction avec le code actuel ou avec `CLAUDE.md` ?
- **Manquante** : un besoin révélé par l'audit qui mériterait une US.
Vérifie aussi que `CLAUDE.md`, `docs/exercices.md` et le commentaire en tête de `worlds.js` décrivent bien le code actuel.

## Vérifications à lancer
- `npm run build` : note les avertissements et la taille du résultat.
- Si un script de contrôle existe (par exemple `src/parcours/check.js`), comprends ce qu'il vérifie et dis ce qui lui manque.

## Règles
- **Ne modifie aucun fichier du projet** à part le rapport. Pas de commit, pas de branche, pas d'issue créée.
- Chaque constat cite `fichier:ligne`. Pas de constat sans preuve ; si tu as un doute, dis-le.
- Classe par gravité : **Bloquant** (casse le jeu ou bloque l'enfant), **Important**, **Mineur**.

## Livrable
Écris le rapport dans `docs/audit-AAAA-MM-JJ.md` (date du jour), avec :
1. Résumé en 10 lignes maximum : état général et les 5 actions prioritaires.
2. Bugs et fragilités.
3. Code mort (tableau : élément, preuve, suppression sûre ?).
4. Optimisations.
5. Backlog : tableau des US (numéro, titre, verdict : garder / fermer / revoir / déjà fait, raison), puis les US à créer.
6. Documentation à mettre à jour.
7. Plan proposé : regroupe les corrections en lots de la taille d'une US.

Termine en donnant le chemin du rapport et le résumé.
