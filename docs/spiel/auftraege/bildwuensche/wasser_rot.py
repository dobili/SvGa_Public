"""Wasser mit rotem Sandufer, mit Innenecken und Schrägen (mittel-2, 11.11.2026).

Warum: Gutachten Canyonrand, Punkt 3: „Fluss in rechtwinkligen Versätzen mit grünem Saum“. LimeZus
Wasser hat ein Grasufer; im roten Sand des Canyons wirkt das fremd, und ohne Schrägkacheln läuft
jeder Versatz des Flusses als Stufe. Dieser Bogen hat dieselbe Ordnung wie ``piste_rot.png`` (also
wie LimeZus Wege im Geländebogen): 3 × 3-Block, vier Innenecken, vier Schrägen. Der Kartenbauer
nimmt ihn mit ``"ufer": "rot"`` (Boden ``wasser_rot`` in materialien.json, mit ``diagonalen``).

Vom Ufer nach innen: roter Sand (fels_rot.png), ein schmaler Streifen nasser, dunklerer Sand, ein
Streifen helles Flachwasser, dann LimeZus Wasser. Die Kante ist leicht zufällig (fester Zufall,
gleiches Bild bei jedem Lauf).

Zweites Bild ``wasser_strand.png`` (Gutachten Pinewood Camp, Punkt 2: „das Ufer springt in
Rechtecken“): dasselbe mit LimeZus hellem Sand außen, für Seen mit Sandstrand (``"ufer": "strand"``,
Boden ``wasser_strand``). Auch dort macht erst die Schrägkachel aus zwei Stufen eine Bucht.

Aufruf: ``python wasser_rot.py <privates Repository>``; schreibt spiel/eigene/wasser_rot.png und
spiel/eigene/wasser_strand.png (je 112 × 64). Braucht ``piste_rot.py`` im selben Ordner (Form der
Kacheln).
"""

import random
import sys
from pathlib import Path

from PIL import Image
from piste_rot import ORDNUNG, K, _abstand, _kachel

GELAENDE = "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/1_Terrains_and_Fences_16x16.png"
WASSER_FELD = (1, 36)
SAND_FELD = (9, 31)  # LimeZus heller Sand im Geländebogen
NASS = 1.6  # Breite des nassen Sands in Pixeln
FLACH = 2.4  # Breite des hellen Flachwassers danach
ABDUNKELN = 0.74
FLACHWASSER = (132, 206, 214)
MISCHUNG = 0.55  # Anteil der hellen Farbe im Flachwasser


def _nass(farbe: tuple) -> tuple:
    r, g, b, a = farbe
    return (round(r * ABDUNKELN), round(g * ABDUNKELN), round(b * ABDUNKELN), a)


def _flach(farbe: tuple) -> tuple:
    r, g, b, a = farbe
    hell = FLACHWASSER
    return (
        round(r + (hell[0] - r) * MISCHUNG),
        round(g + (hell[1] - g) * MISCHUNG),
        round(b + (hell[2] - b) * MISCHUNG),
        a,
    )


def wasserbogen(wasser: Image.Image, sand_bogen: Image.Image) -> Image.Image:
    """Der Bogen 7 × 4 Kacheln: Wasserkachel innen, Sand aus den Feldern [2..3, 0..1] von fels_rot."""
    bild = Image.new("RGBA", (7 * K, 4 * K))
    zufall = random.Random(1866)
    w = wasser.load()
    for (sp, ze), art in ORDNUNG.items():
        sand = _kachel(sand_bogen, (2 + (sp + ze) % 2, ze % 2)).load()
        kachel = Image.new("RGBA", (K, K))
        px = kachel.load()
        for y in range(K):
            for x in range(K):
                d = _abstand(art, x, y) + zufall.uniform(-0.7, 0.7)
                if d < -NASS:
                    px[x, y] = sand[x, y]
                elif d < 0:
                    px[x, y] = _nass(sand[x, y])
                elif d < FLACH:
                    px[x, y] = _flach(w[x, y])
                else:
                    px[x, y] = w[x, y]
        bild.paste(kachel, (sp * K, ze * K))
    return bild


def sandbogen(gelaende: Image.Image) -> Image.Image:
    """Ein Bogen 4 × 2 Kacheln voll hellem Sand: ``wasserbogen`` liest den Sand aus [2..3, 0..1]."""
    sand = _kachel(gelaende, SAND_FELD)
    bild = Image.new("RGBA", (4 * K, 2 * K))
    for sp in range(4):
        for ze in range(2):
            bild.paste(sand, (sp * K, ze * K))
    return bild


def main() -> None:
    privat = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    gelaende = Image.open(privat / GELAENDE).convert("RGBA")
    wasser = _kachel(gelaende, WASSER_FELD)
    sand = Image.open(privat / "spiel" / "eigene" / "fels_rot.png").convert("RGBA")
    eigene = privat / "spiel" / "eigene"
    wasserbogen(wasser, sand).save(eigene / "wasser_rot.png")
    wasserbogen(wasser, sandbogen(gelaende)).save(eigene / "wasser_strand.png")
    print("Wasser mit rotem Ufer und mit Sandstrand nach", eigene)


if __name__ == "__main__":
    main()
