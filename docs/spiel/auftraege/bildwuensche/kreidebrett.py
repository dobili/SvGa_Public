"""Lilys Kreidebrett auf dem Gehweg der Birch Lane (Entwurf, mittel-4, Runde 12).

Warum: Roman Kap. 6 und Ink ``ansehen-maple-falls.kreidebrett``: ein schiefes Schachbrett aus Kreide
auf dem Gehweg vor Lilys Haus, mit neun Feldern in einer Reihe, darauf ein Plastikpferd. Es bleibt
als Spur liegen. Kreide auf Pflaster ist flach, deshalb selbst gezeichnet.

- ``kreidebrett.png`` (48 × 16, eine Gehwegreihe hoch): weiße Kreidelinien, schief, eine Reihe mit neun Feldern, einzelne
  Felder schraffiert, ein kleines braunes Pferd aus Plastik.
- ``kreidebrett_springer.png`` (48 × 16): dasselbe Brett nach Lilys Lektion (``lilyGeholfen``),
  rechts daneben Springerzüge als L in Weiß und Gelb bis zum Rand (Ink ``kreidebrett``).

Aufruf: ``python kreidebrett.py <zielordner>`` (im privaten Repository: spiel/eigene/).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

KREIDE = (246, 246, 240, 210)
KREIDE_SCHWACH = (246, 246, 240, 120)
PFERD, PFERD_DUNKEL = (150, 96, 56, 255), (98, 60, 34, 255)


def kreidebrett() -> Image.Image:
    bild = Image.new("RGBA", (48, 16))
    z = ImageDraw.Draw(bild)
    # Drei Reihen zu je 8 Feldern von 4 Pixeln, jede Reihe um einen Pixel nach rechts gerutscht.
    for reihe in range(3):
        y = 2 + reihe * 4
        x0 = 3 + reihe
        felder = 9 if reihe == 1 else 8  # die Reihe mit neun Feldern
        z.line((x0, y, x0 + felder * 4, y), fill=KREIDE)
        for feld in range(felder + 1):
            z.line((x0 + feld * 4, y, x0 + feld * 4 + 1, y + 4), fill=KREIDE)
        for feld in range(felder):
            if (feld + reihe) % 2:
                z.point((x0 + feld * 4 + 2, y + 2), fill=KREIDE_SCHWACH)
    z.line((6, 14, 41, 14), fill=KREIDE)
    # Das Plastikpferd auf dem dritten Feld der mittleren Reihe.
    z.rectangle((14, 4, 16, 9), fill=PFERD)
    z.rectangle((13, 5, 14, 6), fill=PFERD)
    z.point((16, 4), fill=PFERD_DUNKEL)
    z.line((14, 9, 16, 9), fill=PFERD_DUNKEL)
    return bild


GELB = (250, 226, 120, 220)


def mit_springerzuegen() -> Image.Image:
    """Das Brett mit dazugemalten L-Zügen rechts davon, abwechselnd weiß und gelb."""
    bild = kreidebrett()
    z = ImageDraw.Draw(bild)
    for nummer, x in enumerate((38, 42)):
        farbe = KREIDE if nummer % 2 == 0 else GELB
        z.line((x, 2, x, 10), fill=farbe)  # zwei Felder hinunter …
        z.line((x, 10, x + 4, 10), fill=farbe)  # … und eins zur Seite
    z.point((46, 10), fill=GELB)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    kreidebrett().save(ziel / "kreidebrett.png")
    mit_springerzuegen().save(ziel / "kreidebrett_springer.png")
    print("Kreidebrett nach", ziel)


if __name__ == "__main__":
    main()
