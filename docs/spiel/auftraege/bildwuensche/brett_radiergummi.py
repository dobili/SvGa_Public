"""Clubbrett mit Radiergummi statt der schwarzen Dame (Entwurf, mittel-4, Kartengutachten Akt 1).

Warum: Im Clubraum fehlt an einem Brett die schwarze Dame; auf d8 steht ein Radiergummi (Roman
Kap. 5, Ink ``ansehen-maple-falls.brett_ohne_dame``). Das alte Bild zeigte eine fehlende weiße Figur
und daneben einen Zettel mit Fragezeichen (Dokument 27, Clubraum Befund 1). Ein Brett mit Figuren
liegt flach auf dem Tisch, deshalb selbst gezeichnet, im Stil von ``schachbrett_klein_figuren.png``,
nur etwas größer, damit Lücke und Radiergummi zu erkennen sind.

- ``brett_radiergummi.png`` (16 × 12): Brett mit Rand, oben drei schwarze Figuren und eine Lücke,
  in der ein rosa-blauer Radiergummi steht, unten vier weiße Figuren.

Aufruf: ``python brett_radiergummi.py <zielordner>`` (im privaten Repository: spiel/eigene/).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

RAND = (58, 58, 80, 255)
HELL, DUNKEL = (232, 220, 188, 255), (120, 150, 96, 255)
SCHWARZ, WEISS = (36, 34, 44, 255), (250, 248, 242, 255)
ROSA, BLAU = (236, 140, 160, 255), (90, 130, 210, 255)
FELD = 2  # Pixel je Feld
LINKS, OBEN, SPALTEN, REIHEN = 1, 1, 7, 5


def brett_radiergummi() -> Image.Image:
    bild = Image.new("RGBA", (16, 12))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 0, 15, 11), fill=RAND)
    for r in range(REIHEN):
        for s in range(SPALTEN):
            x, y = LINKS + s * FELD, OBEN + r * FELD
            z.rectangle((x, y, x + FELD - 1, y + FELD - 1), fill=HELL if (r + s) % 2 == 0 else DUNKEL)
    # Schwarze Figuren oben (Spalten 1, 2, 5), die Lücke auf Spalte 3 hat den Radiergummi.
    for s in (1, 2, 5):
        z.rectangle((LINKS + s * FELD, OBEN, LINKS + s * FELD + 1, OBEN + 2), fill=SCHWARZ)
    x = LINKS + 3 * FELD
    z.rectangle((x, OBEN + 1, x + 1, OBEN + 1), fill=ROSA)
    z.rectangle((x, OBEN + 2, x + 1, OBEN + 2), fill=BLAU)
    # Weiße Figuren unten.
    for s in (1, 2, 4, 5):
        y = OBEN + (REIHEN - 1) * FELD - 1
        z.rectangle((LINKS + s * FELD, y, LINKS + s * FELD + 1, y + 2), fill=WEISS)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    brett_radiergummi().save(ziel / "brett_radiergummi.png")
    print("Brett mit Radiergummi nach", ziel)


if __name__ == "__main__":
    main()
