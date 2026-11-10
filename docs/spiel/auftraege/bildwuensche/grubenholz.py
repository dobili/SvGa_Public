"""Türstock aus Grubenholz für den Stollen: zwei Stempel und eine Kappe (Entwurf, mittel-4).

Warum: Im Stollen standen die Holzstämme in den Wänden (Notiz des Autors, Revision 2; allgemeiner
Punkt 28 „Holz in Stollen steht im Gang“). Ein Türstock stützt den Gang: links und rechts je ein
Stempel am Rand des Gangs, darüber quer die Kappe. Das Bild ist so breit wie der zwei Kacheln breite
Gang; die Stempel stehen an seinen Rändern, die Mitte bleibt frei zum Gehen.

- ``tuerstock_2.png`` (32 × 32): Türstock für einen Gang von zwei Kacheln.

Aufruf: ``python grubenholz.py <zielordner>`` (im privaten Repository: spiel/eigene/).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

RAND = (58, 58, 80, 255)
HOLZ, HOLZ_HELL, HOLZ_DUNKEL = (138, 96, 60, 255), (184, 136, 88, 255), (98, 66, 42, 255)
SCHATTEN = (20, 20, 30, 90)


def tuerstock() -> Image.Image:
    bild = Image.new("RGBA", (32, 32))
    z = ImageDraw.Draw(bild)
    for x in (1, 26):                                   # Stempel
        z.rectangle((x + 2, 8, x + 6, 31), fill=SCHATTEN)
        z.rectangle((x, 4, x + 4, 30), fill=RAND)
        z.rectangle((x + 1, 5, x + 3, 29), fill=HOLZ)
        z.line((x + 1, 5, x + 1, 29), fill=HOLZ_HELL)
        z.line((x + 3, 12, x + 3, 16), fill=HOLZ_DUNKEL)
    z.rectangle((0, 1, 31, 7), fill=RAND)               # Kappe
    z.rectangle((1, 2, 30, 6), fill=HOLZ)
    z.line((1, 2, 30, 2), fill=HOLZ_HELL)
    z.line((1, 6, 30, 6), fill=HOLZ_DUNKEL)
    for x in (6, 14, 22):
        z.point((x, 4), fill=HOLZ_DUNKEL)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    ziel.mkdir(parents=True, exist_ok=True)
    tuerstock().save(ziel / "tuerstock_2.png")
    print("Türstock nach", ziel)


if __name__ == "__main__":
    main()
