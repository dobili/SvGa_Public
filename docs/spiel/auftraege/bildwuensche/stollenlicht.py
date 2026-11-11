"""Tageslicht am Stolleneingang als weicher Schein (Entwurf, mittel-4, Gutachten Steinbruch 4).

Warum: Das Eingangslicht im Stollen war ein Stück Sandboden, also eine orange Fläche mit harter
Kante. Tageslicht fällt aber als Schein in den Gang und verliert sich nach wenigen Schritten.

- ``stollenlicht.png`` (32 × 64): warmes, durchscheinendes Licht, unten (am Eingang) am hellsten,
  nach oben in vier Feldern auslaufend, an den Seiten leicht schwächer. Liegt als Bild über dem
  Felsboden und dem Gleis.

Aufruf: ``python stollenlicht.py <privates Repository>`` (schreibt nach ``spiel/eigene/``).
"""

import sys
from pathlib import Path

from PIL import Image

BREITE, HOEHE = 32, 64
FARBE = (255, 214, 150)
# Deckkraft am Eingang (unten); nach oben fällt sie quadratisch auf null.
STAERKE = 180
# Stufen der Deckkraft: Pixelkunst hat Bänder statt eines glatten Verlaufs.
STUFE = 12


def stollenlicht() -> Image.Image:
    bild = Image.new("RGBA", (BREITE, HOEHE))
    for y in range(HOEHE):
        nach_unten = (y + 1) / HOEHE
        for x in range(BREITE):
            zur_mitte = 1 - abs(x - (BREITE - 1) / 2) / BREITE
            deckkraft = STAERKE * nach_unten**2 * zur_mitte
            bild.putpixel((x, y), (*FARBE, int(deckkraft) // STUFE * STUFE))
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".") / "spiel" / "eigene"
    stollenlicht().save(ziel / "stollenlicht.png")
    print("Stollenlicht nach", ziel)


if __name__ == "__main__":
    main()
