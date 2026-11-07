---
name: ecrire-us
description: Transforme une idée du jeu Énigmes en user story prête à planifier, dans une issue GitHub. À utiliser quand le propriétaire veut noter une idée, écrire, affiner ou découper une user story, depuis le téléphone ou le Mac.
---

# Écrire une user story

But : une issue claire, qu'on peut développer sans reposer de questions. On ne code rien ici.

1. Lis `CLAUDE.md` et les épics de `docs/backlog.md`.
2. Cherche dans les issues ouvertes si l'idée existe déjà. Si oui, complète l'issue au lieu d'en créer une autre.
3. Reformule l'idée en une phrase. Pose une ou deux questions seulement si la réponse change la story.
4. Vérifie l'idée avec les règles du jeu :
   - elle sert d'abord à apprendre à lire ou à faire les devoirs ;
   - toute consigne reste écoutable ;
   - une erreur ne punit pas, et rien ne bloque la partie ;
   - pas de combat, pas de chrono.
   Signale tout conflit plutôt que de l'écrire tel quel.
5. Si elle dépasse la taille L, propose de la découper.
6. Montre le texte, puis crée ou modifie l'issue une fois qu'il est validé.

## Format de l'issue

Titre : `US-<numéro> : <besoin en quelques mots>`. Le numéro suit le dernier de l'épic : E2 donne 2xx, E4 donne 4xx.

```markdown
En tant que <enfant ou parent>, je veux <besoin>, afin de <bénéfice>.

## Critères d'acceptation

- [ ] <ce qu'on peut vérifier dans le jeu>

---
Taille : S, M ou L. Définition de « fini » : voir `docs/backlog.md`.
```

Écris 2 à 4 critères, vérifiables au clavier, sans détail de code.

## Labels

- Le label de l'épic : `epic:parcours`, `epic:carte-monde`, `epic:carte-semaine`, `epic:journee`, `epic:hd`, `epic:contenu`, `epic:lecture` ou `epic:finition`.
- Un seul état :
  - `us-idee` : pas encore rédigée comme une user story ;
  - `us-review` : rédigée et validée, mais il manque une image ou un arbitrage. Ajoute un commentaire « En attente de : … » ;
  - `us-prete` : peut être développée dans un sprint.
- `parent` si la tâche ne demande pas de code.

Ne mets pas de jalon : le sprint se choisit le samedi.

## Confidentialité

Le dépôt est public. N'écris jamais dans une issue le nom de l'enfant, de la maîtresse ou de l'école, et n'y mets aucune photo de cahier.
