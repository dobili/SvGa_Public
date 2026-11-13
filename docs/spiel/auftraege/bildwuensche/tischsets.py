"""Stapel ungelöster Tischsets im Falls Diner (Entwurf, mittel-4, Runde 12).

Warum: Hector legt jedem Gast ein Tischset mit einer Schachaufgabe hin; die ungelösten liegen als
Stapel neben der Kasse, das gelöste kommt ab Stufe B gerahmt an die Wand (Roman Kap. 7,
Ortsblatt Maple Falls). Kein Paket hat einen Papierstapel in dieser Größe. Flach gezeichnet, wie
es die Regel für eigene Bilder erlaubt.

- ``tischsets_stapel.png`` (16 × 16): drei leicht versetzte weiße Blätter mit rotem Rand, oben ein
  kleines Brett aus vier mal vier Feldern.
- ``tischset_gerahmt.png`` (16 × 16): ein Tischset im schmalen Holzrahmen für die Wand.

Aufruf: ``python tischsets.py <zielordner>`` (im privaten Repository: spiel/eigene/).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

RAND = (58, 58, 80, 255)
PAPIER, SCHATTEN = (246, 244, 236, 255), (210, 206, 196, 255)
ROT, DUNKEL, HELL = (196, 60, 60, 255), (90, 80, 76, 255), (226, 214, 190, 255)
HOLZ, HOLZ_DUNKEL = (160, 110, 64, 255), (112, 74, 42, 255)


def brett(z: ImageDraw.ImageDraw, x: int, y: int) -> None:
    """Ein Brett aus 4 × 4 Feldern zu je einem Pixel, ab (x, y)."""
    for a in range(4):
        for b in range(4):
            z.point((x + a, y + b), fill=DUNKEL if (a + b) % 2 else HELL)


def blatt(z: ImageDraw.ImageDraw, x: int, y: int, oben: bool) -> None:
    z.rectangle((x, y, x + 11, y + 8), fill=RAND)
    z.rectangle((x + 1, y + 1, x + 10, y + 7), fill=PAPIER if oben else SCHATTEN)
    if oben:
        z.rectangle((x + 1, y + 1, x + 10, y + 1), fill=ROT)
        brett(z, x + 2, y + 3)
        z.line((x + 7, y + 4, x + 9, y + 4), fill=DUNKEL)
        z.line((x + 7, y + 6, x + 8, y + 6), fill=DUNKEL)


def stapel() -> Image.Image:
    bild = Image.new("RGBA", (16, 16))
    z = ImageDraw.Draw(bild)
    z.rectangle((4, 15, 15, 15), fill=(58, 58, 80, 90))  # Schatten
    blatt(z, 4, 6, False)
    blatt(z, 2, 4, False)
    blatt(z, 0, 2, True)
    return bild


def gerahmt() -> Image.Image:
    bild = Image.new("RGBA", (16, 16))
    z = ImageDraw.Draw(bild)
    z.rectangle((1, 2, 14, 13), fill=RAND)
    z.rectangle((2, 3, 13, 12), fill=HOLZ)
    z.rectangle((2, 12, 13, 12), fill=HOLZ_DUNKEL)
    z.rectangle((3, 4, 12, 11), fill=PAPIER)
    z.rectangle((3, 4, 12, 4), fill=ROT)
    brett(z, 4, 6)
    z.line((9, 7, 11, 7), fill=DUNKEL)
    z.line((9, 9, 10, 9), fill=DUNKEL)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    stapel().save(ziel / "tischsets_stapel.png")
    gerahmt().save(ziel / "tischset_gerahmt.png")
    print("Tischsets nach", ziel)


if __name__ == "__main__":
    main()
