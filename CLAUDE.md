# Énigmes

Jeu d'aventure-énigmes en vue de dessus, style GBA, pour un enfant de 6-7 ans qui apprend à lire. Il joue sur ordinateur, au clavier.

## Objectif

C'est un **serious game** : les énigmes font progresser en lecture. Le but pédagogique passe avant la complexité du jeu.

## Règles de conception

- Pas de combat, pas de game over, pas de chrono. Une erreur ne punit jamais : on réessaie.
- L'enfant ne lit pas seul : toute consigne est disponible à voix haute. Il ne doit jamais rester bloqué à cause du texte.
- La lecture est nécessaire pour résoudre l'énigme, avec le niveau d'aide adapté : écouter reste toujours possible.
- Une énigme ne doit jamais pouvoir bloquer la partie : prévoir une remise à zéro de la salle.
- Le français du jeu est correct et simple ; les lettres sont bien lisibles, avec une police adaptée aux débutants.

## Technique

- Phaser 4 et Vite, en JavaScript. `npm run dev` pour lancer, `npm run build` pour publier.
- Salle de 15×10 tuiles de 16 px (240×160, agrandi à l'écran), `pixelArt: true`.
- Déplacement libre en 4 directions, jamais en diagonale. Les blocs poussés avancent case par case.
- Cartes faites dans Tiled, dans `src/assets/maps/` (format `.tmj`). Calques : `sol` (décor), `murs` (toute tuile peinte bloque le passage), `objets` (points). Les points d'arrivée désignent les pieds du personnage (`depart`, `entree`…). Les autres sont au centre d'une case : `bloc`, `interrupteur`, `porte`, `retour` pour l'énigme, `pnj` (aux pieds, propriété `texte`), `torche` (propriété `lettre`, avec un point `porte`), `torche-nombre` (propriété `nombre`), et `sortie`, avec les propriétés `salle` (carte à ouvrir) et `arrivee` (point d'arrivée dans cette carte). La case de `porte` doit rester vide dans `murs`.
- Pour ajouter une salle : créer la carte, puis l'ajouter à `src/rooms.js`.
- Assets libres uniquement, jamais de sprites Nintendo ; chaque source et licence va dans `CREDITS.md`.
- Textes en HTML par-dessus le jeu, police Andika (`src/ui/`). `dialogBox.show(texte, { autoSpeak })` : `autoSpeak: false` pour une épreuve de lecture ; l'écoute reste toujours possible.
- Sons de lecture dans `src/reading/sounds.js`. L'ordre est provisoire : à caler sur celui de l'école. La voix du navigateur ne convient qu'aux voyelles.
- Hébergement sur GitHub Pages : garder des chemins relatifs.
- Images et cartes dans `src/assets/`, importées dans le code : leur nom publié change avec leur contenu, sinon le cache du navigateur mélange ancienne et nouvelle version.

## Organisation

- Méthode, épics et sprints : `docs/backlog.md`. Un sprint = un week-end. Les user stories vivent dans les issues GitHub, référence commune au téléphone et au Mac. `docs/feuille-de-route.md` garde l'historique des premières phases.
- Une user story = une issue = une branche = une pull request.
- Skills du projet : `ecrire-us`, `devoirs-semaine`, `developper-us`.
- Style des images : `docs/style-images.md`.
- Le dépôt est public : jamais de nom de l'enfant, de la maîtresse ou de l'école, ni de photo de cahier.
- Le propriétaire du projet apprend Phaser : expliquer les choix simplement, en français.
