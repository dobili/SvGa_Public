"""Das alte Brett unter der staubfreien Decke (Entwurf, mittel-4, Kartengutachten Akt 1).

Warum: Auf dem Dachboden lag nur ein kleines leeres Reisebrett. Roman Kap. 2 und Kartenliste: unter
einer Decke liegt etwas Flaches, Schweres; die Decke ist das Einzige ohne Staub, leicht glänzend;
darunter steht die Stellung, die niemand anrührt. Das Gutachten (Dokument 27, Dachboden Befund 1)
verlangt ein eigenes, erkennbares Bild. Es liegt flach auf dem Tisch, deshalb selbst gezeichnet.

- ``brett_decke.png`` (24 × 16): helles Tuch mit Falten über einem dunklen Holzbrett; vorn rechts
  schaut eine Ecke des Bretts mit zwei Figuren heraus, oben links ein Glanzpunkt.

Aufruf: ``python brett_decke.py <zielordner>`` (im privaten Repository: spiel/eigene/).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

RAND = (58, 58, 80, 255)
TUCH, TUCH_SCHATTEN, GLANZ = (232, 222, 200, 255), (196, 182, 156, 255), (255, 252, 240, 255)
HOLZ, HELL, DUNKEL = (110, 70, 40, 255), (228, 214, 180, 255), (120, 84, 56, 255)
WEISS, SCHWARZ = (248, 246, 240, 255), (40, 36, 44, 255)


def brett_decke() -> Image.Image:
    bild = Image.new("RGBA", (24, 16))
    z = ImageDraw.Draw(bild)
    # Brett darunter: Rand und eine sichtbare Ecke mit vier Feldern.
    z.rectangle((1, 2, 22, 14), fill=RAND)
    z.rectangle((2, 3, 21, 13), fill=HOLZ)
    for i, (x, y) in enumerate(((15, 8), (18, 8), (15, 11), (18, 11))):
        z.rectangle((x, y, x + 2, y + 1), fill=HELL if i in (0, 3) else DUNKEL)
    z.rectangle((16, 6, 16, 8), fill=WEISS)  # ein weißer Bauer
    z.point((16, 5), fill=WEISS)
    z.rectangle((19, 9, 19, 11), fill=SCHWARZ)  # ein schwarzer Bauer
    z.point((19, 8), fill=SCHWARZ)
    # Tuch über dem größeren Teil, mit zwei Falten und einem Glanz.
    z.polygon(((0, 1), (17, 1), (13, 7), (10, 15), (0, 15)), fill=RAND)
    z.polygon(((1, 2), (16, 2), (12, 7), (9, 14), (1, 14)), fill=TUCH)
    z.line((4, 4, 3, 13), fill=TUCH_SCHATTEN)
    z.line((9, 3, 7, 13), fill=TUCH_SCHATTEN)
    z.line((3, 3, 5, 3), fill=GLANZ)
    z.point((2, 4), fill=GLANZ)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    brett_decke().save(ziel / "brett_decke.png")
    print("Brett unter der Decke nach", ziel)


if __name__ == "__main__":
    main()
