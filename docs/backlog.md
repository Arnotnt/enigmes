# Backlog

But du projet : chaque semaine de CP, l'enfant fait ses devoirs dans le jeu, en avançant sur une carte de civilisations.

## Comment on travaille

- **Épic** : un grand morceau du jeu, qui dure plusieurs sprints.
- **User story (US)** : un besoin de l'enfant ou du parent, assez petit pour tenir dans un sprint.
- **Sprint** : un week-end, du samedi au dimanche soir. Le rythme suit celui de la maîtresse, qui donne les devoirs le vendredi pour la semaine suivante.

Déroulé d'un sprint :

1. **Vendredi soir ou samedi matin :** le parent apporte les images prêtes. Les devoirs de la semaine suivent leur propre sprint (voir plus bas).
2. **Samedi :** on choisit les US du sprint et on fixe l'objectif.
3. **Dimanche soir :** revue du jeu publié. L'objectif du sprint est atteint si l'enfant peut jouer le lundi matin.
4. **Fin de semaine :** on note ce que l'enfant a aimé ou raté, pour le sprint suivant.

Priorité en cas de manque de temps : **les devoirs de la semaine passent toujours avant le reste.**

### Les devoirs, à part

Les devoirs de chaque semaine forment l'épic E9. Ils ne font pas partie des sprints du jeu : dès que la maîtresse les donne, on ouvre un sprint de devoirs, à part, avec son propre jalon (`Devoirs <date du lundi>`). Il se fait avec le skill `devoirs-semaine` et passe avant le sprint du jeu.

GitHub est la référence commune au téléphone et au Mac. Le détail des user stories et leur état vivent dans [les issues](https://github.com/Arnotnt/enigmes/issues), pas dans ce fichier.

| Organisation | Sur GitHub |
|---|---|
| User story | Une issue, une branche, une pull request |
| Épic | Un label (`epic:carte-monde`…) |
| Sprint | Un jalon ([milestones](https://github.com/Arnotnt/enigmes/milestones)) |
| Pas encore rédigée comme une US | Le label `us-idee` |
| Rédigée et validée, mais il manque une image ou un arbitrage | Le label `us-review` |
| Peut être développée dans un sprint | Le label `us-prete` |
| Tâche sans code | Le label `parent` |
| Suivi | Le [tableau du projet](https://github.com/users/Arnotnt/projects/1) : Idées, Review, US prêtes, Sprint, En cours, Fini |

Le dépôt est public : jamais de nom de l'enfant, de la maîtresse ou de l'école, ni de photo de cahier. Seule exception, choisie par le propriétaire : le prénom de l'enfant dans le titre du jeu.

### Qui fait quoi

| | Téléphone | Mac |
|---|---|---|
| Rôle | Idées et user stories | Développement et organisation du projet |
| Outil | Application GitHub, ou onglet Code de l'application Claude | Claude Code |
| Skills | `ecrire-us` | `ecrire-us`, `devoirs-semaine`, `developper-us` |

Une US en `us-review` porte un commentaire « En attente de : … ». Une fois l'élément fourni, elle passe en `us-prete`. Une US qui attend une autre US reste en `us-prete`, avec un commentaire « Dépend de : … ».

Style des images : voir [style-images.md](style-images.md).

Taille des US : **S** (moins d'une heure), **M** (une demi-journée), **L** (une journée ; à découper si possible).

### Une US est finie quand

- [ ] Ses critères d'acceptation sont vérifiés dans le jeu, au clavier.
- [ ] Toute consigne peut être écoutée, et aucune erreur ne punit ni ne bloque.
- [ ] `npm run build` passe et le jeu publié fonctionne avec ses chemins relatifs.
- [ ] Les nouvelles images sont dans `CREDITS.md`, avec leur source et leur licence.
- [ ] La pull request est fusionnée.

## Épics

| Épic | Objectif | État |
|---|---|---|
| E1 Parcours | Mondes, semaines, jours et sauvegarde | Prototype à reprendre |
| E2 Carte du monde | Glisser de semaine en semaine sur un chemin illustré | À faire |
| E3 Carte de la semaine | Valider lundi, mardi, jeudi, vendredi dans l'ordre | À faire |
| E4 Journée de devoirs | Enchaîner des salles, avec un devoir par salle | À faire |
| E5 Passage en HD | Quitter le pixel art pour tout le jeu | À faire |
| E6 Contenu | Images des civilisations, des salles et des objets | Récurrent |
| E7 Lecture | Syllabes, mots, phrases | À faire |
| E8 Finition | Écrans, sons, tests avec l'enfant | À faire |
| E9 Devoirs | Les devoirs de chaque semaine, en sprints à part | Récurrent |

## Sprints

| Sprint | Dates | Objectif | Semaine jouée |
|---|---|---|---|
| S1 | 7-8 novembre | Jouer ses devoirs depuis la carte d'Égypte | 9 novembre |
| S2 | 14-15 novembre | Salles et torches en HD | 16 novembre |
| S3 | 21-22 novembre | Devoirs plus faciles à créer, former des syllabes | 23 novembre |
| S4 | 28-29 novembre | Mots et phrases avec des images | 30 novembre |
| S5 | 5-6 décembre | Suivre une consigne écrite (US-703) | 7 décembre |
| S6 | 12-13 décembre | Fin du monde Égypte et bilan avec l'enfant | 14 décembre |
| S7 | Vacances de Noël | Préparer la Chine | Janvier |

S1 à S4 ont un jalon sur GitHub. Les suivants sont une prévision, à ajuster chaque samedi selon ce que demande l'école.

### Sprint 1 : 7-8 novembre

Objectif : lundi 9 novembre, l'enfant part de la carte d'Égypte, entre dans le temple et fait ses devoirs de lundi.

Ordre conseillé : US-602 et US-601 (contenu), US-501, E1, E2, E3, E4.

Si le temps manque, on garde la chaîne complète avec un rendu simple, et on repousse les finitions de la carte.

Pendant ce sprint seulement, les cartes sont en HD et les salles restent en pixel art. C'est provisoire, en attendant S2.

### Sprint 2 : 14-15 novembre

Objectif : les salles et les torches sont en HD, sans perte de jouabilité. Le personnage reste en pixel art pour l'instant : aucun personnage HD animé n'a été trouvé (US-502, reportée).

Ordre conseillé : US-505 (salles dessinées en HD), US-503 (fond de l'Égypte), puis US-504 (torches) si l'image de la torche est prête.

### Sprint 3 : 21-22 novembre

Objectif : une semaine de devoirs s'écrit dans le parcours sans toucher à Tiled, et l'enfant forme des syllabes en touchant une consonne puis une voyelle.

Ordre conseillé : US-403 (contenu des salles dans le parcours), US-704 (tester la voix sur les syllabes, tâche du parent), puis US-701 (former une syllabe). Si la voix prononce mal des syllabes, une US « jouer des sons enregistrés » passe avant US-701.

À vérifier aussi : une salle jouée au vrai clavier sur le jeu publié, restée ouverte depuis le Sprint 2.

### Sprint 4 : 28-29 novembre

Objectif : l'enfant lit des mots et des phrases en les reliant à des images, dans les deux sens.

Ordre : US-702 (#9, lire un mot et trouver son image), US-705 (#72, voir une image et trouver son mot), US-706 (#73, lire une phrase et trouver sa scène), puis US-707 (#74, voir une scène et trouver sa phrase). Chaque US dépend de la précédente. Les images sont les pictogrammes ARASAAC ; les scènes des phrases sont composées par le jeu à partir de ces pictogrammes.

L'écran de démarrage, la carte des mondes et la musique, prévus d'abord dans ce sprint, sont déjà fusionnés.

Les exercices prêts à l'emploi sont listés dans [exercices.md](exercices.md).

## Décisions prises

- Le jeu suit 3 niveaux : carte du monde, carte de la semaine, salles de la journée.
- Le premier monde joué est l'Égypte (novembre-décembre, 7 semaines), puis la Chine (janvier-février).
- Un point = une semaine. Les jours se font dans l'ordre imposé.
- Le personnage glisse sur le chemin : → avance, ← recule.
- Un seul lieu de semaine pour l'instant.
- Visée HD pour tout le jeu, en gardant la grille de 15×10.
- Septembre-Octobre compte comme terminé ; ce monde sera construit plus tard (US-205).
- La semaine du 2 novembre est validée d'office, faute de devoirs. À revoir si besoin.
- Sur la carte d'Égypte, le parcours va du bas vers les pyramides, et le personnage glisse sur l'eau pour traverser le Nil.
- Sprint 1 : une pull request par épic, par exception à la règle une US = une PR.

## Questions ouvertes

- Personnage HD : aucun personnage animé trouvé, US-502 est reportée. Piste : 4 vues générées et une marche faite d'un petit rebond.
- Thèmes des mondes de mars-avril et de mai-juin.
