---
name: devoirs-semaine
description: Prépare dans le jeu Énigmes les devoirs de la semaine à venir à partir de ce qu'a donné la maîtresse (photo, texte, dictée). À utiliser le week-end, quand le propriétaire apporte les devoirs de la semaine.
---

# Préparer les devoirs de la semaine

But : le dimanche soir, les 4 jours sont publiés et l'enfant peut jouer le lundi.

1. **Relevé.** Lis la photo ou le texte, puis recopie les devoirs jour par jour : lundi, mardi, jeudi, vendredi. N'invente aucun devoir. Si un mot est illisible, demande. Fais valider ce relevé.
2. **Plan.** Propose un tableau avec une ligne par devoir : le jour, le devoir, la salle, le modèle utilisé, et ce que l'enfant doit lire ou écouter. Une salle contient un seul devoir. Attends la validation du plan avant de développer.
3. **Modèles.** Réutilise d'abord les exercices de `docs/exercices.md`, qui donne pour chacun le contenu à écrire. Si un devoir n'entre dans aucune, propose le plus simple : adapter une énigme, ou écrire une US avec le skill `ecrire-us`.
4. **Construction.** Travaille sur une branche `us-<numéro>-devoirs-<date du lundi>`, avec l'issue de la semaine. Si elle n'existe pas, crée-la avec le label `epic:devoirs` (numéro en 9xx). Range-la dans le jalon `Devoirs <date du lundi>`, à créer s'il n'existe pas : les devoirs ont leur propre sprint, à part de ceux du jeu. Écris la semaine dans le fichier du parcours décrit dans `CLAUDE.md` : chaque devoir y donne son énigme (`devoir`) et son contenu, dans la salle commune du monde. Si la semaine existe déjà en `simulation(…)`, remplace son contenu et écris `week(…)` à la place, sinon l'enfant ne pourra pas y jouer. Une nouvelle carte n'est utile que pour un nouveau décor.
5. **Vérification.** Joue chaque jour jusqu'à sa validation. Chaque journée doit avoir une fin qui valide le jour, et chaque salle doit pouvoir être réussie.
6. **Publication.** Ouvre la pull request, puis donne au propriétaire la liste des mots et sons de la semaine, pour un dernier contrôle.

## Règles pédagogiques

- La lecture doit servir à résoudre l'énigme. Une épreuve de lecture utilise `autoSpeak: false`, mais l'écoute reste possible.
- Le français du jeu reste correct et simple.
- La voix du navigateur ne convient qu'aux voyelles. Pour une consonne ou une syllabe, signale-le avant de construire.
- Les mots et sons suivent ce que la classe étudie, pas `src/reading/sounds.js` si les deux diffèrent.

## Confidentialité

Le dépôt est public. Ne mets jamais dans le dépôt, une issue ou une pull request la photo des devoirs, ni le nom de l'enfant, de la maîtresse ou de l'école. Seuls les mots et les calculs utiles au jeu y entrent.
