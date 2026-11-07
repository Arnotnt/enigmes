"""Découpe une planche de personnage faite par Gemini en sprites pour le jeu.

La planche : 3 lignes (face, dos, profil vers la droite) de 5 cases, séparées par des traits noirs,
sur fond blanc. Cases utilisées : de face et de dos, 1 = debout et 2 = un pied en avant ; de profil, 2 = debout,
3 et 5 = marche. Les autres, tournées de trois quarts ou en double, sont ignorées.

Résultat : 4 lignes (bas, droite, haut, gauche) de 5 dessins de 64×128 :
le dessin à l'arrêt, puis les 4 temps de la marche. La gauche est le profil retourné.

Utilisation, avec Python et Pillow (pip install pillow numpy scipy) :
    python outils/decouper-personnage.py docs/personnages/explorateur-planche.jpg src/assets/personnages/explorateur.png
"""

import sys

import numpy as np
from PIL import Image
from scipy import ndimage

FRAME_W, FRAME_H = 64, 128  # 16×32 pixels de salle, agrandis 4 fois par la caméra
FEET_Y = 120  # bas des pieds dans le dessin : 30 pixels de salle, comme la boîte de collision
HERO_HEIGHT = 112  # hauteur du personnage debout, chapeau compris
WHITE = 225  # au-dessus, sur les trois couleurs, un pixel touchant le bord compte comme fond


def grid_lines(gray, axis):
    """Positions des traits noirs qui traversent toute la planche."""
    dark = (gray < 90).mean(axis=axis) > 0.9
    lines = np.where(dark)[0]
    groups = np.split(lines, np.where(np.diff(lines) > 1)[0] + 1)
    return [int(group.mean()) for group in groups]


def cells(sheet):
    gray = np.asarray(sheet.convert('L'))
    xs, ys = grid_lines(gray, 0), grid_lines(gray, 1)
    return [[(xs[c] + 6, ys[r] + 6, xs[c + 1] - 6, ys[r + 1] - 6) for c in range(len(xs) - 1)] for r in range(len(ys) - 1)]


def cut_out(sheet, box):
    """Le personnage de la case, détouré : le blanc relié au bord devient transparent."""
    rgb = np.asarray(sheet.crop(box).convert('RGB'))
    light = (rgb > WHITE).all(axis=2)
    labels, _ = ndimage.label(light)
    border = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))) - {0}
    background = np.isin(labels, list(border))
    alpha = np.where(background, 0, 255).astype(np.uint8)
    # Le liseré clair autour du trait noir s'efface en douceur.
    edge = ndimage.binary_dilation(background) & ~background
    whiteness = rgb.min(axis=2).astype(float)
    alpha[edge] = np.clip((255 - whiteness[edge]) * 255 / (255 - 160), 0, 255).astype(np.uint8)
    image = Image.fromarray(np.dstack([rgb, alpha]))
    return image.crop(image.getbbox())


def place(figure, scale):
    """Pose le personnage dans un dessin de 64×128, centré, pieds sur la même ligne."""
    w, h = max(1, round(figure.width * scale)), max(1, round(figure.height * scale))
    small = figure.resize((w, h), Image.LANCZOS, reducing_gap=3.0)
    frame = Image.new('RGBA', (FRAME_W, FRAME_H))
    frame.alpha_composite(small, ((FRAME_W - w) // 2, FEET_Y - h))
    return frame


def main(source, target):
    sheet = Image.open(source)
    figures = [[cut_out(sheet, box) for box in row] for row in cells(sheet)]
    front, back, side = figures
    scale = HERO_HEIGHT / front[0].height  # même échelle partout : le personnage ne change pas de taille
    widest = max(f.width for row in figures for f in row) * scale
    if widest > FRAME_W:
        scale *= FRAME_W / widest

    mirror = lambda figure: figure.transpose(Image.FLIP_LEFT_RIGHT)
    # Face et dos : un seul pas dessiné, l'autre pied est le même dessin retourné.
    # Profil : les pas dessinés avancent tous le même pied, la pose debout sert d'entre-deux.
    # La case 2 du profil plutôt que la 1 : la plume y est visible, comme pendant la marche.
    rows = [
        [front[0], front[1], front[0], mirror(front[1]), front[0]],
        [side[1], side[2], side[1], side[4], side[1]],
        [back[0], back[1], back[0], mirror(back[1]), back[0]],
        [mirror(f) for f in (side[1], side[2], side[1], side[4], side[1])],
    ]
    out = Image.new('RGBA', (FRAME_W * 5, FRAME_H * 4))
    for r, row in enumerate(rows):
        for c, figure in enumerate(row):
            out.alpha_composite(place(figure, scale), (c * FRAME_W, r * FRAME_H))
    # Les pixels transparents deviennent noirs : même image, fichier plus léger.
    pixels = np.asarray(out).copy()
    pixels[pixels[..., 3] == 0] = 0
    Image.fromarray(pixels).save(target, optimize=True)


if __name__ == '__main__':
    main(*sys.argv[1:3])
