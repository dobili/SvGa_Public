"""Fensterbank im Zimmer des Helden (Entwurf, mittel-4, Runde 12, Wunsch des Hauptchats).

Warum: Auf der Fensterbank sammeln sich die Funde der Reise (T15, Roman Kap. 23). Eine Kommode unter
dem Fenster las sich nicht als Fensterbank. Ein Brett unter dem Fenster ist flach, deshalb selbst
gezeichnet. Die Funde selbst zeigt die Ansicht ``zeigeFensterbank``; auf der Karte bleibt das Brett
zunächst leer bis auf einen Springer mit abgestoßener Mähne (der erste Fund, Roman).

- ``fensterbank.png`` (32 × 16): Holzbrett mit Kante, das unter einem Fenster von 32 Pixeln Breite
  an der Wand hängt; links ein kleiner weißer Springer.

Aufruf: ``python fensterbank.py <zielordner>`` (im privaten Repository: spiel/eigene/).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

RAND = (58, 58, 80, 255)
HOLZ_HELL, HOLZ, HOLZ_DUNKEL = (214, 168, 110, 255), (180, 128, 76, 255), (126, 84, 48, 255)
WEISS, GRAU = (240, 238, 230, 255), (176, 172, 168, 255)
SCHATTEN = (58, 58, 80, 70)


def springer(z: ImageDraw.ImageDraw, x: int, y: int) -> None:
    """Ein Springer, 5 × 7 Pixel, Fuß auf Zeile y + 6."""
    z.rectangle((x, y + 5, x + 4, y + 6), fill=RAND)
    z.rectangle((x + 1, y + 1, x + 3, y + 5), fill=RAND)
    z.rectangle((x, y + 2, x + 1, y + 3), fill=RAND)
    z.rectangle((x + 1, y + 2, x + 2, y + 4), fill=WEISS)
    z.point((x + 3, y + 2), fill=GRAU)  # abgestoßene Mähne
    z.line((x + 1, y + 5, x + 3, y + 5), fill=WEISS)


def fensterbank() -> Image.Image:
    bild = Image.new("RGBA", (32, 16))
    z = ImageDraw.Draw(bild)
    z.rectangle((1, 13, 30, 15), fill=SCHATTEN)
    z.rectangle((0, 8, 31, 12), fill=RAND)
    z.rectangle((1, 9, 30, 9), fill=HOLZ_HELL)
    z.rectangle((1, 10, 30, 10), fill=HOLZ)
    z.rectangle((1, 11, 30, 11), fill=HOLZ_DUNKEL)
    springer(z, 4, 2)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    fensterbank().save(ziel / "fensterbank.png")
    print("Fensterbank nach", ziel)


if __name__ == "__main__":
    main()
