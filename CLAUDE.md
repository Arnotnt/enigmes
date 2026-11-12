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

- Phaser 4 et Vite, en JavaScript. `npm run dev` pour lancer, `npm run build` pour publier, `npm run verifier` pour relire tout le parcours (la publication s'arrête s'il trouve une erreur).
- Jeu en 960×640. Salle de 15×10 tuiles de 16 px (240×160), agrandie 4 fois par la caméra, `pixelArt: true`.
- Déplacement libre en 4 directions, jamais en diagonale. Les blocs poussés avancent case par case.
- Cartes faites dans Tiled, dans `src/assets/maps/` (format `.tmj`). Calques : `sol` (décor), `murs` (toute tuile peinte bloque le passage), `objets` (points). Les points d'arrivée désignent les pieds du personnage (`depart`, `entree`…). Les autres sont au centre d'une case : `bloc`, `interrupteur`, `porte`, `retour` pour l'énigme, `pnj` (aux pieds, propriété `texte`), `torche` (propriété `lettre`, avec un point `porte`), `torche-nombre` (marque la salle de démonstration des additions), et `sortie`, avec les propriétés `salle` (carte à ouvrir) et `arrivee` (point d'arrivée dans cette carte). La case de `porte` doit rester vide dans `murs`. Une carte peut avoir une propriété `fond` (clé de `BACKGROUNDS` dans `src/rooms.js`) : la grande image, rangée dans `src/assets/salles/`, remplace alors les tuiles, et `murs` bloque toujours sans se voir. Elle peut aussi avoir une propriété `torche` (clé de `TORCH_STYLES` dans `src/objects/torchStyles.js`) : la stèle des énigmes de ce monde, celle de l'Égypte sans propriété.
- Pour ajouter une salle : créer la carte, puis l'ajouter à `src/rooms.js`.
- Le jeu s'ouvre sur un écran de démarrage (`TitleScene`, titre dans `GAME_TITLE`, musique dès l'arrivée si le navigateur le permet). On y choisit la sauvegarde : celle d'un des enfants (`PLAYERS`, la dernière jouée choisie d'office ; tous suivent le même parcours, chacun avec sa progression) ou « Admin », où tout est ouvert pour tester, avec sa progression à part (`src/parcours/progress.js`). Admin n'apparaît qu'avec `?admin` dans l'adresse du jeu. Admin choisi, R deux fois de suite efface sa progression. Échap sur la carte des mondes ramène à cet écran. Puis 4 niveaux : carte des mondes (un point par monde de l'année ; un monde sans nom est un « ? » à découvrir), carte d'un monde (un point par semaine), carte de la semaine (lundi, mardi, jeudi, vendredi, dans l'ordre), salles de la journée (un devoir par salle).
- Parcours dans `src/parcours/worlds.js` : chaque week-end, remplir `lessons` pour la semaine à venir. L'`id` d'une semaine est la date du lundi et ne change plus : il sert à la sauvegarde, gardée dans `localStorage`. Une semaine écrite avec `simulation(…)` ne se joue qu'en Admin ; pour l'enfant, elle reste fermée en attendant les vrais devoirs (`week(…)`). Une journée interrompue recommence. Un devoir s'écrit dans le parcours, sans carte à dessiner : `{ room: 'temple-egypte', entry: 'entree', devoir: 'mots', mots: [...] }`. `devoir` choisit l'énigme (`additions`, `comparaisons`, `mots`, `syllabes`, `lire-mots`, `image-mot`, `phrase-scene`, `scene-phrase`), le reste en donne le contenu, et les stèles se placent seules (`src/objects/placeStones.js`). Le détail est en tête de `worlds.js`, et la liste des exercices, avec leur contenu, dans `docs/exercices.md` : toute nouvelle énigme de devoir y ajoute sa fiche.
- Lieux illustrés dans `src/parcours/places.js` : `path` suit le chemin de l'image, en pixels de l'image, et `stops` donne la place de chaque point dans `path`.
- Une sortie avec `salle` = `fin` termine le devoir de la salle, comme la fin de l'énigme des additions. Une sortie vers une salle absente de la journée reste fermée. Échap ou le bouton « Retour » ramènent à la carte précédente sans rien valider.
- On sort aussi en marchant, sans rien valider : ← sur le premier point d'une carte (→ sur la dernière semaine) et, dans une salle, la sortie `salle` = `semaine`, au milieu du bas, montrée par une flèche. Sa case reste vide dans `murs`, et le point `entree` est à deux cases de côté pour qu'on ne sorte pas par erreur.
- Assets libres ou générés pour le projet, jamais de sprites Nintendo ; chaque source et licence va dans `CREDITS.md`.
- Textes en HTML par-dessus le jeu, police Andika (`src/ui/`). `dialogBox.show(texte, { autoSpeak })` : `autoSpeak: false` pour une épreuve de lecture ; l'écoute reste toujours possible.
- Musique et bruitages dans `src/audio/` : une musique par monde (`music` dans `worlds.js`), aucune dans les salles. Elle baisse quand la voix parle. La touche M coupe musique et bruitages, jamais la voix.
- Images des mots : pictogrammes ARASAAC dans `src/assets/pictos/`, un fichier par mot (`lune.png`), téléchargés avec `node outils/picto.mjs lune moto`.
- Sons de lecture dans `src/reading/sounds.js`. L'ordre est provisoire : à caler sur celui de l'école. La voix du navigateur ne convient qu'aux voyelles. La page `outils/voix.html`, publiée avec le jeu, fait dire des syllabes d'un clic pour repérer celles qu'elle prononce mal.
- Hébergement sur GitHub Pages : garder des chemins relatifs.
- Images et cartes dans `src/assets/`, importées dans le code : leur nom publié change avec leur contenu, sinon le cache du navigateur mélange ancienne et nouvelle version.

## Organisation

- Méthode, épics et sprints : `docs/backlog.md`. Un sprint = un week-end. Les user stories vivent dans les issues GitHub, référence commune au téléphone et au Mac. `docs/feuille-de-route.md` garde l'historique des premières phases.
- Une user story = une issue = une branche = une pull request.
- Skills du projet : `ecrire-us`, `devoirs-semaine`, `developper-us`.
- Style des images : `docs/style-images.md`.
- Le dépôt est public : jamais de nom de l'enfant, de la maîtresse ou de l'école, ni de photo de cahier. Seule exception, choisie par le propriétaire : le prénom de chaque enfant sur sa sauvegarde (`PLAYERS`).
- Le propriétaire du projet apprend Phaser : expliquer les choix simplement, en français.
