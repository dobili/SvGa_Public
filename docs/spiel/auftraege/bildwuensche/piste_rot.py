"""Schotterpiste auf rotem Wüstensand mit Rand, Innenecken und Schrägen (mittel-2, Runde 9).

Warum: Gutachten Staubstraße, Punkt 1: „Piste in Stufen statt Bögen“. Schotter (fels.png) und
roter Sand (fels_rot.png) haben keine Randkacheln; jeder Versatz der Piste war eine harte Stufe.
Dieser Bogen hat dieselbe Ordnung wie LimeZus Wege im Geländebogen, also kann
pipeline/abenteuer/bodenraster.py Ränder, Innenecken und Schrägen wählen (Material „pisteRot“
mit ``rand`` [0, 0] und ``diagonalen``):

- Spalten 0–2, Zeilen 0–2: 3 × 3-Block (Ecken, Kanten, Mitte [1, 1]).
- [3, 0] [4, 0] [3, 1] [4, 1]: Innenecken (Sand unten rechts, unten links, oben rechts, oben links).
- [5, 0] [6, 0] [5, 3] [6, 3]: Schrägen für Treppenkanten (Sand oben links, oben rechts, unten
  links, unten rechts).

Der Übergang ist ein 3 Pixel breites, dunkleres Bankett mit leicht zufälliger Kante (fester
Zufall, gleiches Bild bei jedem Lauf).

Aufruf: ``python piste_rot.py <ordner mit fels.png und fels_rot.png> <zielordner>``
(im privaten Repository: zweimal spiel/eigene/). Schreibt piste_rot.png (112 × 64).
"""

import random
import sys
from pathlib import Path

from PIL import Image

K = 16
RAND = 3  # Abstand der Kante vom Kachelrand in Pixeln
BANKETT = 2  # Breite des dunkleren Streifens innen an der Kante
RUNDUNG = 7  # Radius der Außenecken
INNEN_RADIUS = 5  # Radius des Sandflecks in einer Innenecke
ABDUNKELN = 0.82


def _abstand(art: str, x: float, y: float) -> float:
    """Wie weit (x, y) innerhalb der Piste liegt (negativ: Sand). ``art`` nennt die Kachel."""
    links, oben = x - RAND, y - RAND
    rechts, unten = K - 1 - RAND - x, K - 1 - RAND - y
    kanten = {
        "mitte": K,
        "o": oben,
        "u": unten,
        "l": links,
        "r": rechts,
        "ol": min(oben, links),
        "or": min(oben, rechts),
        "ul": min(unten, links),
        "ur": min(unten, rechts),
    }
    if art in kanten:
        d = kanten[art]
        if len(art) == 2:  # Außenecke gerundet
            dx = max(0.0, RUNDUNG - (links if "l" in art else rechts))
            dy = max(0.0, RUNDUNG - (oben if "o" in art else unten))
            if dx > 0 and dy > 0:
                d = RUNDUNG - (dx * dx + dy * dy) ** 0.5
        return d
    if art.startswith("innen_"):  # Sandfleck in der genannten Ecke
        cx = K - 0.5 if "r" in art else -0.5
        cy = K - 0.5 if art.endswith(("ur", "ul")) else -0.5
        return ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5 - INNEN_RADIUS
    # Schrägen: Sand im genannten Dreieck, Kante von Ecke zu Ecke, um RAND nach innen versetzt.
    ecke = art.removeprefix("schraeg_")
    u = x if "l" in ecke else K - 1 - x
    v = y if "o" in ecke else K - 1 - y
    return (u + v - (K - 1)) / 2**0.5 + RAND / 2


# Kacheln im Bogen: (Spalte, Zeile) → Art (siehe _abstand).
ORDNUNG = {
    (0, 0): "ol",
    (1, 0): "o",
    (2, 0): "or",
    (0, 1): "l",
    (1, 1): "mitte",
    (2, 1): "r",
    (0, 2): "ul",
    (1, 2): "u",
    (2, 2): "ur",
    (3, 0): "innen_ur",
    (4, 0): "innen_ul",
    (3, 1): "innen_or",
    (4, 1): "innen_ol",
    (5, 0): "schraeg_ol",
    (6, 0): "schraeg_or",
    (5, 3): "schraeg_ul",
    (6, 3): "schraeg_ur",
}


def _kachel(bogen: Image.Image, feld: tuple[int, int]) -> Image.Image:
    return bogen.crop((feld[0] * K, feld[1] * K, (feld[0] + 1) * K, (feld[1] + 1) * K))


def pistenbogen(schotter_bogen: Image.Image, sand_bogen: Image.Image) -> Image.Image:
    """Der Bogen 7 × 4 Kacheln; Schotter und Sand aus den Feldern [2..3, 0..1] der Felsbögen."""
    bild = Image.new("RGBA", (7 * K, 4 * K))
    zufall = random.Random(1851)
    for (sp, ze), art in ORDNUNG.items():
        felder = [(2 + (sp + ze) % 2, (sp // 2 + ze) % 2), (2 + (sp + ze + 1) % 2, ze % 2)]
        schotter = _kachel(schotter_bogen, felder[0]).load()
        sand = _kachel(sand_bogen, felder[1]).load()
        kachel = Image.new("RGBA", (K, K))
        px = kachel.load()
        for y in range(K):
            for x in range(K):
                d = _abstand(art, x, y) + zufall.uniform(-0.8, 0.8)
                if d < 0:
                    px[x, y] = sand[x, y]
                elif d < BANKETT:
                    r, g, b, a = schotter[x, y]
                    px[x, y] = (round(r * ABDUNKELN), round(g * ABDUNKELN), round(b * ABDUNKELN), a)
                else:
                    px[x, y] = schotter[x, y]
        bild.paste(kachel, (sp * K, ze * K))
    return bild


def main() -> None:
    quelle = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    ziel = Path(sys.argv[2] if len(sys.argv) > 2 else ".")
    schotter = Image.open(quelle / "fels.png").convert("RGBA")
    sand = Image.open(quelle / "fels_rot.png").convert("RGBA")
    pistenbogen(schotter, sand).save(ziel / "piste_rot.png")
    print("Pistenbogen nach", ziel / "piste_rot.png")


if __name__ == "__main__":
    main()
