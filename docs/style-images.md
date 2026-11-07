# Style des images

Pour que le jeu reste cohérent, ce paragraphe se recopie tel quel dans chaque prompt d'image.

```text
Style : bande dessinée franco-belge humoristique des années 1960-70, dessinée à la main. Contours noirs à l'encre, souples et expressifs, couleurs en aplats chaudes et lumineuses, ombres simples, formes rondes et un peu exagérées, ambiance joyeuse et aventureuse.
```

## À la fin de chaque prompt

```text
Interdits : aucun personnage, aucun texte, aucune lettre, aucun chiffre, aucun hiéroglyphe lisible, aucun panneau, aucun logo, aucun X, aucun point marqué sur le chemin. Pas de pixel art, pas de rendu 3D, pas de photo réaliste.
```

## Règles

- Format paysage 3:2, au moins 1920×1280 si possible.
- Ne pas nommer de licence ou de personnage connu dans le prompt.
- Un seul chemin continu, sinueux, sans bifurcation ni croisement, jamais caché par un décor.
- Le quart inférieur reste calme : la boîte de dialogue s'y affiche.
- Les points sont dessinés par le jeu, pas sur l'image.
- Noter la source et les conditions de l'outil pour `CREDITS.md`.

## Planche d'un personnage

Une seule image, pour que le personnage reste le même d'une case à l'autre : 3 lignes (face, dos, profil tourné vers la droite) de 5 cases séparées par des traits noirs, fond blanc uni, corps entier, pieds alignés en bas. Même disposition que `docs/personnages/explorateur-planche.jpg`.

Ranger la planche dans `docs/personnages/`, puis la découper avec Python et Pillow :

```bash
python outils/decouper-personnage.py docs/personnages/pirate-planche.jpg src/assets/personnages/pirate.png
```
