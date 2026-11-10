"""Bildwunsch: graues Wintermeer mit Steinschüttung (spiel/eigene/wasser_see.png), Entwurf von mittel-1.

Warum: Am Deich (``weg-silicon-delacroix-deich``) war das Meer ein schmaler türkiser Streifen statt
grau mit Steinschüttung (variantenwahl.md, Mangel 2). Das Werkzeug nimmt das eigene Steinufer
``wasser_stein.png`` (3 × 3 Rand und vier Innenecken, wie ``wasser_moor``) und färbt nur das
Wasser um: jede bläuliche Farbe wird nach ihrer Helligkeit ein kaltes Graublau. Die Steine des
Ufers bleiben und lesen sich als Steinschüttung am Deichfuß.

Bild: ``wasser_see.png`` (80 × 48). Szenen wählen es mit ``"ufer": "see"``; materialien.json
bekommt dazu den Bogen ``see`` und den Boden ``wasser_see`` (``feld`` [1, 1], ``rand`` [0, 0]).

Aufruf: ``python wasser_see.py <Pfad zum privaten Repository>``.
"""

import sys
from pathlib import Path

from PIL import Image

QUELLE = "spiel/eigene/wasser_stein.png"
TIEF, HELL = (58, 70, 82), (150, 162, 170)  # Wintermeer von tief bis Gischt


def seefarbe(r: int, g: int, b: int) -> tuple[int, int, int]:
    anteil = (r + g + b) / (3 * 255)
    return tuple(round(TIEF[i] + (HELL[i] - TIEF[i]) * anteil) for i in range(3))


def wasser_see(ufer: Image.Image) -> Image.Image:
    bild = ufer.convert("RGBA")
    px = bild.load()
    for y in range(bild.height):
        for x in range(bild.width):
            r, g, b, a = px[x, y]
            if a and b > r + 20 and b >= g - 10:
                px[x, y] = seefarbe(r, g, b) + (a,)
    return bild


def main() -> None:
    privat = Path(sys.argv[1])
    wasser_see(Image.open(privat / QUELLE)).save(privat / "spiel" / "eigene" / "wasser_see.png")
    print("wasser_see.png geschrieben")


if __name__ == "__main__":
    main()
