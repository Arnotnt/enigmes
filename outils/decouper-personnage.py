"""Découpe une planche de personnage faite par Gemini en sprites pour le jeu.

Chaque planche est rangée dans docs/personnages/<nom>-planche.jpg, sur fond blanc, avec ou sans traits
noirs entre les cases. PLANCHES ci-dessous dit, pour chacune, sa grille et les cases à prendre
(ligne, colonne, en comptant depuis 0) :
- face, dos : la pose debout, puis, si la planche en a une, un pas vu bien de face (ou de dos) ;
  l'autre pas est le même dessin retourné ;
- profil (tourné vers la droite) : la pose debout, puis un ou deux pas.
Les cases tournées de trois quarts ne servent pas : le héros semblerait marcher en biais.

Résultat : src/assets/personnages/<nom>.png, 4 lignes (bas, droite, haut, gauche) de 5 dessins de 64×128 :
le dessin à l'arrêt, puis les 4 temps de la marche. La gauche est le profil retourné.

Utilisation, avec Python et Pillow (pip install pillow numpy scipy) :
    python outils/decouper-personnage.py pirate
"""

import sys

import numpy as np
from PIL import Image
from scipy import ndimage

PLANCHES = {
    'explorateur': {
        'grille': (3, 5),
        'face': [(0, 0), (0, 1)],
        'dos': [(1, 0), (1, 1)],
        # Case 2 plutôt que 1 pour la pose debout : la plume y est visible, comme pendant la marche.
        'profil': [(2, 1), (2, 2), (2, 4)],
    },
    'pirate': {
        'grille': (3, 5),
        'face': [(0, 0), (0, 1)],
        'dos': [(1, 0), (1, 1)],
        'profil': [(2, 1), (2, 2), (2, 4)],
    },
    'egyptien': {
        'grille': (3, 5),
        'face': [(0, 0), (0, 1)],
        'dos': [(1, 0), (1, 1)],
        'profil': [(2, 0), (2, 2), (2, 4)],
    },
    'gaulois': {
        'grille': (3, 3),
        'face': [(0, 0), (0, 1)],
        'dos': [(1, 0), (1, 1)],
        'profil': [(2, 0), (2, 1), (2, 2)],
    },
    # Pas de pas de face ni de dos sur cette planche : le héros glisse sans bouger les jambes.
    'grec': {
        'grille': (3, 3),
        'face': [(0, 0)],
        'dos': [(1, 0)],
        'profil': [(2, 0), (2, 1), (2, 2)],
    },
    # La tunique change de couleur d'une case à l'autre : seules les cases rouges sont prises.
    'chinois': {
        'grille': (2, 6),
        'face': [(0, 0)],
        'dos': [(0, 3)],
        'profil': [(1, 0), (1, 5)],
    },
}

FRAME_W, FRAME_H = 64, 128  # 16×32 pixels de salle, agrandis 4 fois par la caméra
FEET_Y = 120  # bas des pieds dans le dessin : 30 pixels de salle, comme la boîte de collision
HERO_HEIGHT = 112  # hauteur du personnage debout, chapeau compris
WHITE = 225  # au-dessus, sur les trois couleurs, un pixel touchant le bord compte comme fond
GROUND_BAND = 14  # pixels du bas du personnage où chercher un trait de sol
GROUND_THICKNESS = 5  # un trait plus fin que ça, sans rien au-dessus, n'est pas le personnage


def bounds(gray, axis, count):
    """Limites des cases sur un axe : les traits noirs s'il y en a, sinon des cases égales."""
    size = gray.shape[1 - axis]
    dark = np.where((gray < 90).mean(axis=axis) > 0.8)[0]
    lines = [int(g.mean()) for g in np.split(dark, np.where(np.diff(dark) > 1)[0] + 1) if len(g)]
    margin = size * 0.05  # un trait collé au bord de la planche n'est qu'un cadre ou un sol
    lines = [x for x in lines if margin < x < size - margin]
    if len(lines) != count - 1:
        lines = [round(size * i / count) for i in range(1, count)]
    return [0, *lines, size]


def cells(sheet, rows, columns):
    gray = np.asarray(sheet.convert('L'))
    xs, ys = bounds(gray, 0, columns), bounds(gray, 1, rows)
    return [[(xs[c] + 6, ys[r] + 6, xs[c + 1] - 6, ys[r + 1] - 6) for c in range(columns)] for r in range(rows)]


def erase_ground(figure):
    """Efface le trait de sol sous les pieds : en bas, un trait fin avec du blanc au-dessus.

    figure : les pixels qui ne sont pas blancs. Modifié sur place."""
    bottom = np.where(figure.any(axis=1))[0][-1]
    for x in range(figure.shape[1]):
        y = bottom
        while y > bottom - GROUND_BAND:
            if not figure[y, x]:
                y -= 1
                continue
            top = y
            while top > 0 and figure[top - 1, x]:
                top -= 1
            if y - top + 1 <= GROUND_THICKNESS:
                figure[top : y + 1, x] = False
            y = top - 1


def cut_out(sheet, box):
    """Le personnage de la case, détouré : le blanc relié au bord devient transparent."""
    rgb = np.asarray(sheet.crop(box).convert('RGB'))
    light = (rgb > WHITE).all(axis=2)
    labels, _ = ndimage.label(light)
    border = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))) - {0}
    background = np.isin(labels, list(border))
    ink = ~light
    erase_ground(ink)
    # Sans le trait de sol, le blanc entre les jambes rejoint le bord : c'est du fond, lui aussi.
    figure = ~background
    labels, _ = ndimage.label(~ink)
    border = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))) - {0}
    figure &= ~np.isin(labels, list(border))
    # Seul le plus gros morceau est le personnage : les miettes de trait autour disparaissent.
    pieces, count = ndimage.label(figure)
    if count > 1:
        sizes = ndimage.sum(figure, pieces, range(1, count + 1))
        figure = pieces == 1 + int(np.argmax(sizes))
    background = ~figure
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


def mirror(figure):
    return figure.transpose(Image.FLIP_LEFT_RIGHT)


def facing_row(poses):
    """Face ou dos : l'autre pied est le même pas retourné. Sans pas dessiné, le héros reste debout."""
    standing, *step = poses
    if not step:
        return [standing] * 5
    return [standing, step[0], standing, mirror(step[0]), standing]


def side_row(poses):
    """Profil : les pas dessinés avancent souvent le même pied, la pose debout sert d'entre-deux."""
    standing, *steps = poses
    first, second = steps[0], steps[-1]
    return [standing, first, standing, second, standing]


def main(name):
    planche = PLANCHES[name]
    sheet = Image.open(f'docs/personnages/{name}-planche.jpg')
    boxes = cells(sheet, *planche['grille'])
    pick = lambda key: [cut_out(sheet, boxes[r][c]) for r, c in planche[key]]
    front, back, side = pick('face'), pick('dos'), pick('profil')

    scale = HERO_HEIGHT / front[0].height  # même échelle partout : le personnage ne change pas de taille
    widest = max(f.width for f in front + back + side) * scale
    if widest > FRAME_W:
        scale *= FRAME_W / widest

    side_poses = side_row(side)
    rows = [facing_row(front), side_poses, facing_row(back), [mirror(f) for f in side_poses]]
    out = Image.new('RGBA', (FRAME_W * 5, FRAME_H * 4))
    for r, row in enumerate(rows):
        for c, figure in enumerate(row):
            out.alpha_composite(place(figure, scale), (c * FRAME_W, r * FRAME_H))
    # Les pixels transparents deviennent noirs : même image, fichier plus léger.
    pixels = np.asarray(out).copy()
    pixels[pixels[..., 3] == 0] = 0
    Image.fromarray(pixels).save(f'src/assets/personnages/{name}.png', optimize=True)


if __name__ == '__main__':
    for name in sys.argv[1:] or PLANCHES:
        main(name)
        print(f'{name} : src/assets/personnages/{name}.png')
