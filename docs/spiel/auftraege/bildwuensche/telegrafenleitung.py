"""Telegrafenleitung zwischen zwei Masten (Entwurf, mittel-2, Runde 9, Staubstraße).

Warum: Gutachten zu weg-pinewood-ghost-staubstrasse: Die Telegrafenmasten (iwStrommast) stehen ohne
Draht da. Kein gekauftes Paket hat eine Leitung. Die Masten stehen jetzt in gleichen Abständen von
14 Kacheln (224 Pixel) am Nordrand der Piste; ein Stück Leitung überspannt genau einen Abstand.

- ``telegrafenleitung.png`` (224 × 16): zwei durchhängende Drähte, links und rechts auf Höhe des
  Querarms (oben), in der Mitte 6 Pixel tiefer. Als Möbel ohne Kollision über den Masten setzen
  (Feld des linken Mastes, Versatz [8, 3], „vorn“).

Aufruf: ``python telegrafenleitung.py <zielordner>`` (im privaten Repository: spiel/eigene/).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

BREITE, HOEHE = 224, 16
DRAHT = (44, 40, 48, 255)
SCHIMMER = (120, 116, 124, 160)
DURCHHANG = 6
DRAEHTE = (2, 6)  # Höhe der beiden Drähte am Mast


def leitung() -> Image.Image:
    bild = Image.new("RGBA", (BREITE, HOEHE))
    z = ImageDraw.Draw(bild)
    for oben in DRAEHTE:
        punkte = []
        for x in range(BREITE):
            t = x / (BREITE - 1)
            punkte.append((x, oben + round(DURCHHANG * 4 * t * (1 - t))))
        z.line(punkte, fill=DRAHT, width=1)
        z.line([(x, y - 1) for x, y in punkte[::7]], fill=SCHIMMER, width=1)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    leitung().save(ziel / "telegrafenleitung.png")
    print("Telegrafenleitung nach", ziel)


if __name__ == "__main__":
    main()
