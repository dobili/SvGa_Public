"""Bildwunsch: Boje und Pfahl ohne Wasserkachel (spiel/eigene/), Entwurf von mittel-1.

Warum: LimeZus Boje (``Buoy_1``) und Pfahl (``Pier_Pole_1``) haben ein Stück türkises Wasser im
Bild. Auf dem grauen Wintermeer am Deich sitzen sie deshalb auf helleren blauen Quadraten
(Gutachten ``mittel-1-runde9-2.md``, Deich Befund 2). Das Werkzeug macht jede bläuliche oder
türkise Farbe durchsichtig; Rot, Weiß, Holz und Umriss bleiben.

Bilder: ``boje_frei.png`` (16 × 16), ``pfahl_frei.png`` (16 × 32).

Aufruf: ``python boje_frei.py <Pfad zum privaten Repository>``. Nur PIL.
"""

import colorsys
import sys
from pathlib import Path

from PIL import Image

ORDNER = "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/11_Camping_Singles_16x16/"
BILDER = {
    "boje_frei": "ME_Singles_Camping_16x16_Buoy_1.png",
    "pfahl_frei": "ME_Singles_Camping_16x16_Pier_Pole_1.png",
}


def ist_wasser(r: int, g: int, b: int) -> bool:
    """Türkis bis Blau (Farbton 160 bis 250 Grad) mit Sättigung; Grau und Weiß bleiben."""
    h, _, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    return 160 <= h * 360 <= 250 and s > 0.2


def freistellen(bild: Image.Image) -> Image.Image:
    neu = bild.convert("RGBA")
    px = neu.load()
    for y in range(neu.height):
        for x in range(neu.width):
            r, g, b, a = px[x, y]
            if a and ist_wasser(r, g, b):
                px[x, y] = (0, 0, 0, 0)
    return neu


def main() -> None:
    privat = Path(sys.argv[1])
    for name, datei in BILDER.items():
        freistellen(Image.open(privat / ORDNER / datei)).save(privat / "spiel" / "eigene" / f"{name}.png")
    print("boje_frei.png, pfahl_frei.png geschrieben")


if __name__ == "__main__":
    main()
