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
| `syllabes` | Lecture | une syllabe | la consonne, puis la voyelle | `syllabes` | 4 |
| `lire-mots` | Lecture | rien d'abord | un mot écrit, puis son image | `mots` | 4 |

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

Images disponibles : chat, lit, lune, moto, mouton, renard, tomate, vélo.

## Bientôt

Ces exercices sont en cours de développement au Sprint 4. Leur fiche s'ajoutera ici quand ils seront prêts.

| Exercice | US |
|---|---|
| Voir une image, trouver son mot | [US-705](https://github.com/Arnotnt/enigmes/issues/72) |
| Lire une phrase, trouver sa scène | [US-706](https://github.com/Arnotnt/enigmes/issues/73) |
| Voir une scène, trouver sa phrase | [US-707](https://github.com/Arnotnt/enigmes/issues/74) |

## Énigmes liées à une carte

Deux énigmes plus anciennes dépendent d'objets dessinés dans Tiled, pas du parcours : le bloc à pousser sur un interrupteur (`bloc`) et les torches des sons (`torche`). Elles ne servent pas pour les devoirs de la semaine.
