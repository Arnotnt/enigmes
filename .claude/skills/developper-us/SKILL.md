---
name: developper-us
description: Développe une user story du jeu Énigmes à partir de son issue GitHub, jusqu'à la pull request. À utiliser quand le propriétaire demande de lancer, développer ou reprendre une US, par exemple « développe l'US-201 » ou « lance l'issue 26 ».
---

# Développer une user story

Argument : le numéro de l'US ou de l'issue.

1. **Comprendre.** Lis l'issue, ses commentaires et `CLAUDE.md`. Si l'issue porte le label `idee` ou si ses critères sont flous, arrête-toi et propose d'utiliser `ecrire-us`.
2. **Vérifier ce qui bloque.** Regarde si une autre US ou une image attendue (label `parent`) manque. Si oui, dis-le avant de commencer.
3. **Annoncer.** Résume en quelques phrases le plan et les choix. Explique-les simplement, en français : le propriétaire apprend Phaser.
4. **Brancher.** Pars de `main` à jour et crée `us-<numéro>-<mot-clé>`. Ne mélange pas deux US sur une branche.
5. **Développer.** Reste dans le périmètre de l'issue. Toute autre idée devient une nouvelle issue. Suis les conventions de `CLAUDE.md`.
6. **Vérifier.** Lance le jeu et contrôle chaque critère d'acceptation, puis lance `npm run build`.
7. **Livrer.** Commite et ouvre une pull request avec `Closes #<issue>`, la liste des critères vérifiés, et ce qui n'a pas pu l'être. Ne fusionne pas sans l'accord du propriétaire.
8. **Documenter.** Si une règle du projet change, mets à jour `CLAUDE.md` ou `docs/backlog.md` dans la même branche.

## Définition de « fini »

La liste à cocher se trouve dans `docs/backlog.md`. Un critère non testé n'est jamais coché : indique-le clairement dans la pull request.

## Tester dans le navigateur intégré

- Si le panneau du navigateur est masqué, la boucle de Phaser s'arrête et le jeu paraît figé : affiche d'abord le panneau.
- Les touches simulées par le panneau peuvent ne pas atteindre Phaser. Envoie alors des `KeyboardEvent` à `window`, avec `keyCode` et `which`, en précisant dans la pull request que le vrai clavier reste à essayer.
- Après un retour sur une scène, vérifie que le clavier répond encore : Phaser réutilise le même objet de scène.
- Remets à zéro la progression de test à la fin (`localStorage`).

## Dans une session sur téléphone

En session cloud, il n'y a pas de navigateur intégré. Fais le développement et `npm run build`, puis note dans la pull request que le test au clavier reste à faire sur le Mac.
