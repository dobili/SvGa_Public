"""Andreaskreuz am Bahnübergang (Entwurf, mittel-4, Gutachten Ironwood außen).

Warum: Der Gutachter fand den Bahnübergang in Ironwood nicht; ohne Zeichen liest man die Bohlen
zwischen den Schienen nicht als Übergang. Kein gekauftes Paket hat ein Andreaskreuz.

- ``andreaskreuz.png`` (16 × 32): Pfosten mit rot-weißem Kreuz, Licht darunter.

Aufruf: ``python andreaskreuz.py <zielordner>`` (im privaten Repository: spiel/eigene/).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

RAND = (58, 58, 80, 255)
ROT, WEISS, GRAU = (206, 58, 58, 255), (246, 246, 246, 255), (140, 140, 150, 255)


def andreaskreuz() -> Image.Image:
    bild = Image.new("RGBA", (16, 32))
    z = ImageDraw.Draw(bild)
    z.rectangle((9, 31, 13, 31), fill=(58, 58, 80, 90))  # Schatten
    z.rectangle((7, 8, 9, 31), fill=RAND)  # Pfosten
    z.line((8, 9, 8, 30), fill=GRAU)
    for a, b in (((1, 1), (14, 12)), ((14, 1), (1, 12))):  # Kreuz
        z.line((a, b), fill=RAND, width=4)
        z.line((a, b), fill=WEISS, width=2)
    for p in ((3, 3), (12, 3), (5, 5), (10, 5), (10, 8), (5, 8), (3, 10), (12, 10)):
        z.point(p, fill=ROT)
    z.rectangle((5, 15, 11, 19), fill=RAND)  # Blinklicht
    z.rectangle((6, 16, 10, 18), fill=ROT)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    andreaskreuz().save(ziel / "andreaskreuz.png")
    print("Andreaskreuz nach", ziel)


if __name__ == "__main__":
    main()
