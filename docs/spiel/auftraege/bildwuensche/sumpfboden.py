"""Bildwunsch: nasser, dunkler Sumpfboden für die Bayou-Inseln (spiel/eigene/sumpfboden.png), mittel-1.

Warum: Im Gutachten Runde 9 (``gutachten/capital-arena-bayou.md``, Bayou Befund 7) haben die
Inseln hellen Rasen, Sumpfboden fehlt. Das Werkzeug nimmt LimeZus Erdblock aus dem Geländebogen
(3 × 3 Rand mit Grasrand und vier Innenecken rechts daneben, wie ``erde`` in materialien.json)
und färbt nur den olivbraunen Boden in nassen, dunklen Schlamm mit moosgrünen Flecken um. Der
Grasrand bleibt, er liest sich am schwarzen Wasser als Ufersaum.

Bild: ``sumpfboden.png`` (80 × 48). materialien.json bekommt den Bogen ``sumpfboden`` und den Boden
``sumpfboden`` (``feld`` [1, 1], ``rand`` [0, 0]).

Aufruf: ``python sumpfboden.py <Pfad zum privaten Repository>``. Nur PIL.
"""

import colorsys
import sys
from pathlib import Path

from PIL import Image

GELAENDE = "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/1_Terrains_and_Fences_16x16.png"
K = 16
RAND_FELD = (0, 30)  # linke obere Kachel des Erdblocks
SCHLAMM, MOOS = (58, 52, 38), (62, 74, 44)  # dunkel nass, Moosflecken


def ist_erde(r: int, g: int, b: int) -> bool:
    """Olivbraun der Vorlage: Farbton 35 bis 60 Grad, mäßig gesättigt (Gras ist grüner, über 80 Grad)."""
    h, _, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    return 30 <= h * 360 <= 62 and s > 0.15


def sumpfboden(bogen: Image.Image) -> Image.Image:
    x0, y0 = RAND_FELD
    block = bogen.crop((x0 * K, y0 * K, (x0 + 5) * K, (y0 + 3) * K)).convert("RGBA")
    px = block.load()
    for y in range(block.height):
        for x in range(block.width):
            r, g, b, a = px[x, y]
            if a and ist_erde(r, g, b):
                anteil = (r + g + b) / (3 * 255)
                ziel = MOOS if (x * 7 + y * 3) % 11 == 0 else SCHLAMM
                px[x, y] = tuple(round(c * (0.75 + anteil * 0.6)) for c in ziel) + (a,)
    return block


def main() -> None:
    privat = Path(sys.argv[1])
    sumpfboden(Image.open(privat / GELAENDE)).save(privat / "spiel" / "eigene" / "sumpfboden.png")
    print("sumpfboden.png geschrieben")


if __name__ == "__main__":
    main()
