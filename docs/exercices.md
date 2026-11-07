# Exercices disponibles

La liste des devoirs qu'on peut écrire dans le parcours (`src/parcours/worlds.js`) pour préparer une semaine. Le skill `devoirs-semaine` part de ce fichier. Une énigme ajoutée au jeu y reçoit sa fiche.

## Écrire un devoir

Un devoir = une salle. Une journée est une liste de salles, jouées dans l'ordre :

```js
week('2026-11-16', 'Semaine du 16 novembre', {
  Lundi: [
    { room: 'temple-egypte', entry: 'entree', devoir: 'syllabes', syllabes: ['ma', 'li', 'ro'] },
    { room: 'temple-egypte', entry: 'entree', devoir: 'additions', max: 10 },
  ],
  Mardi: [ … ],
}),
```

- `room` : la salle (clé de `src/rooms.js`). En Égypte, c'est toujours `temple-egypte`.
- `entry` : le point d'arrivée dans la salle, ici `entree`.
- `devoir` : l'exercice, choisi dans le tableau ci-dessous. Le reste de la ligne donne son contenu.

Les stèles se placent seules. Une erreur fait trembler la stèle, sans rien enlever, et l'enfant réessaie. La touche Espace et le bouton d'écoute redisent la consigne. Revenir dans la salle relance une nouvelle série.

## Les exercices

| `devoir` | Matière | L'enfant entend | L'enfant lit ou cherche | Contenu à donner | Tours |
|---|---|---|---|---|---|
| `additions` | Calcul | l'addition | le nombre qui manque, de 0 à 10 | `max` (facultatif) | 4 |
| `comparaisons` | Calcul | la question | le signe < ou > | `max` (facultatif) | 4 |
| `mots` | Lecture | un mot | le mot écrit sur une stèle | `mots` | un par mot |
| `sons` | Lecture | une voyelle | sa lettre | `sons` | 4 |
| `syllabes` | Lecture | une syllabe | la consonne, puis la voyelle | `syllabes` | 4 |
| `lire-mots` | Lecture | rien d'abord | un mot écrit, puis son image | `mots` | 4 |
| `image-mot` | Lecture | la consigne | une image, puis son mot écrit | `mots`, `pieges` | 4 |
| `phrase-scene` | Lecture | rien d'abord | une phrase, puis sa scène | `phrases` | 3 |
| `scene-phrase` | Lecture | la consigne | une scène, puis sa phrase parmi trois | `phrases` | 3 |

### `additions` : addition à trou

Le haut de l'écran affiche « 3 + ... = 7 », et la voix le dit. L'enfant touche la stèle du nombre qui manque, parmi 11 stèles, de 0 à 10.

- `max` : le total le plus grand, 10 par défaut. Le nombre à trouver ne dépasse jamais 10.
- Les additions sont tirées au hasard. La même réponse ne revient pas deux fois de suite.

```js
{ room: 'temple-egypte', entry: 'entree', devoir: 'additions', max: 15 }
```

### `comparaisons` : plus petit ou plus grand

Le haut de l'écran affiche « 12 … 7 », et la voix demande quel signe va entre les deux. L'enfant touche la stèle < ou la stèle >.

- `max` : le plus grand nombre comparé, 20 par défaut.
- Les deux nombres sont toujours différents : il n'y a pas de stèle « = ».

```js
{ room: 'temple-egypte', entry: 'entree', devoir: 'comparaisons', max: 20 }
```

### `mots` : entendre un mot, trouver sa stèle

La voix dit un mot, que l'écran n'affiche pas. Chaque stèle porte un mot écrit : il faut les lire pour trouver le bon. Chaque mot est demandé une fois, dans le désordre.

- `mots` : la liste des mots. Une ligne tient 4 mots, et la salle en accueille 2 lignes.
- La voix du navigateur prononce bien les mots entiers.
- Pour que la lecture compte, choisissez des mots qui ne commencent pas tous par une lettre différente (`lune`, `lame`, `loupe`) : sinon, la première lettre suffit.

```js
{ room: 'temple-egypte', entry: 'entree', devoir: 'mots', mots: ['lune', 'renard', 'moto'] }
```

### `sons` : entendre une voyelle, trouver sa lettre

La voix dit un son, que l'écran n'affiche pas. Une ligne de stèles porte les lettres : l'enfant touche celle du son entendu. C'est l'exercice de la rentrée, avant les consonnes : la voix du navigateur prononce bien les voyelles.

- `sons` : les lettres de la salle, une stèle chacune. Le jeu en demande 4, au hasard, sans répéter deux fois de suite le même son.
- Il comprend a, i, o, u, e et é (voir `SPOKEN_SOUNDS` dans `src/reading/sounds.js`). Une autre lettre est dite telle quelle.

```js
{ room: 'temple-egypte', entry: 'entree', devoir: 'sons', sons: ['a', 'i', 'o'] }
```

### `syllabes` : former la syllabe entendue

La voix dit une syllabe. L'enfant touche la consonne dans la ligne du haut, puis la voyelle dans la ligne du bas. Les stèles viennent des syllabes de la liste.

- `syllabes` : la liste des syllabes possibles. Le jeu en demande 4, au hasard.
- Un tiret sépare les deux sons quand l'un fait plusieurs lettres : `'ch-ou'`. Sans tiret, la consonne est la première lettre : `'ma'`.
- La voix du navigateur prononce mal certaines syllabes. Testez-les d'abord avec la page `outils/voix.html`.

```js
{ room: 'temple-egypte', entry: 'entree', devoir: 'syllabes', syllabes: ['ma', 'li', 'ro', 'ch-ou'] }
```

### `lire-mots` : lire un mot, trouver son image

Un mot s'écrit en haut de l'écran, sans être dit. Chaque stèle porte une image : l'enfant va toucher celle du mot. Au début de la salle, la voix dit seulement la consigne. Le bouton d'écoute du mot n'apparaît qu'après une erreur : on pousse à lire d'abord, sans jamais bloquer.

- `mots` : les mots de la semaine. Toutes leurs images sont dans la salle, et 4 mots sont demandés au hasard. Donnez-en de 4 à 8 : les images en plus servent de pièges.
- Chaque mot doit avoir son image dans `src/assets/pictos/`. Pour les télécharger depuis ARASAAC : `node outils/picto.mjs lune moto renard`. Regardez les images obtenues. Si l'une ne convient pas, cherchez le mot sur arasaac.org et donnez le numéro de la bonne : `node outils/picto.mjs lune=2933`.
- Un mot sans image est laissé de côté, avec un avertissement dans la console.

```js
{ room: 'temple-egypte', entry: 'entree', devoir: 'lire-mots', mots: ['lune', 'renard', 'moto', 'vélo', 'chat', 'tomate'] }
```

### `image-mot` : voir une image, trouver son mot

Une image s'accroche en haut de la salle, et chaque stèle porte un mot écrit : l'enfant va toucher le mot de l'image. Le mot n'est jamais dit avant d'être trouvé. Après une erreur, chaque stèle touchée dit son mot (« Non, ici c'est écrit lame. ») : l'enfant n'est jamais bloqué.

- `mots` : les mots à trouver, chacun avec son image dans `src/assets/pictos/` (voir `lire-mots`). 4 sont demandés au hasard.
- `pieges` (facultatif) : des mots écrits en plus, sans image, qui ressemblent aux vrais. Avec `lune`, mettez `lame` ou `lutin` : il faut alors lire tout le mot, pas seulement la première lettre. La salle tient 8 stèles en tout.

```js
{ room: 'temple-egypte', entry: 'entree', devoir: 'image-mot', mots: ['lune', 'moto', 'mouton', 'tomate'], pieges: ['lame', 'mot', 'mouche', 'tomber'] }
```

### `phrase-scene` : lire une phrase, trouver sa scène

Une phrase s'écrit en haut de l'écran, sans être lue. Trois scènes sont posées sur des stèles : l'enfant va toucher celle qui montre la phrase. Les deux autres ne diffèrent que d'un détail : la position (sur ou sous), ou le nombre (un ou deux). Il faut donc lire toute la phrase. Comme pour `lire-mots`, l'écoute de la phrase n'arrive qu'après une erreur.

- `phrases` : 3 phrases ou plus. Le jeu en demande 3, au hasard.
- Le jeu dessine lui-même les scènes avec les pictogrammes. Il ne comprend que ces modèles :
  - « Le chat est **sur** le lit. », « … **sous** la table. », « … **dans** la boîte. », « … **à côté de** la chaise. » ;
  - au pluriel : « **Deux** chiens sont sous la table. », « **Les** chats sont à côté du lit. » (« les » compte pour deux) ;
  - « Il y a **trois** ballons. »
- Chaque nom doit avoir son image (voir `lire-mots`). Le pluriel en -s ou -x se retrouve seul : « chiens » utilise `chien.png`.
- Au démarrage du jeu, la console signale toute phrase que le jeu ne sait pas dessiner (« Le chat mange. ») et tout mot sans image. En jeu, ces phrases sont laissées de côté.
- Les phrases de l'école ne suivent pas toujours ces modèles : il faut alors les adapter, en gardant les mots de la semaine.

```js
{ room: 'temple-egypte', entry: 'entree', devoir: 'phrase-scene', phrases: ['Le chat est sur le lit.', 'Deux chiens sont sous la table.', "L'oiseau est dans la boîte.", 'Le ballon est à côté de la chaise.'] }
```

### `scene-phrase` : voir une scène, trouver sa phrase

Une scène s'accroche en haut de la salle. Trois stèles numérotées portent chacune une phrase : quand le héros se place devant une stèle, sa phrase s'écrit en bas de l'écran, sans être lue. Entrée choisit cette phrase. Les phrases ne diffèrent que d'un mot (« sur » ou « sous », « deux » ou « trois »…) : il faut les lire et les comparer. Après une erreur, la phrase de la stèle devant laquelle on se trouve peut s'écouter.

- `phrases` : les bonnes phrases, avec les mêmes modèles que `phrase-scene`. Le jeu en demande 3, et il écrit lui-même les phrases pièges, en changeant un seul mot. Les accords suivent : « dans le panier » devient « à côté du panier », « Le chat est » devient « Deux chats sont ».
- On peut donner la même liste qu'à `phrase-scene` : un jour dans un sens, un jour dans l'autre.

```js
{ room: 'temple-egypte', entry: 'entree', devoir: 'scene-phrase', phrases: ['Le chat est sur le lit.', 'Deux chiens sont sous la table.', "L'oiseau est dans la boîte.", 'Le ballon est à côté de la chaise.'] }
```

## Les images

Toutes les images sont dans `src/assets/pictos/`, une par mot. Aujourd'hui : ananas, âne, araignée, arbre, balai, ballon, banane, bateau, bébé, bijou, boîte, bol, bonbon, bus, café, canard, cerise, chaise, champignon, chapeau, chat, château, chemise, cheval, chien, chou, coq, cygne, dame, dauphin, dé, domino, dragon, éléphant, épée, étoile, fée, fil, fraise, fusée, gant, gâteau, île, judo, jupe, jus, kiwi, koala, lait, lama, lapin, lion, lit, loup, lune, maison, melon, momie, montagne, moto, mouche, moulin, mouton, mur, mûre, navire, nez, niche, noix, oiseau, olive, os, panier, pantalon, peigne, pirate, poire, poisson, pomme, pont, poule, poupée, pull, puma, purée, pyjama, radis, raisin, rame, rat, renard, riz, robe, robot, roi, rose, roue, sac, salade, sapin, seau, sel, sirop, sofa, soupe, souris, table, tapis, tasse, tomate, tortue, tube, vache, valise, vase, vélo, zèbre. Pour en ajouter : `node outils/picto.mjs <mot>` (voir `lire-mots`).

## Énigmes liées à une carte

Deux énigmes plus anciennes dépendent d'objets dessinés dans Tiled, pas du parcours : le bloc à pousser sur un interrupteur (`bloc`) et les torches des sons (`torche`). Elles ne servent pas pour les devoirs de la semaine.
