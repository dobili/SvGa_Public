"""Das Whitlock-Haus, älter und ungestrichen (Entwurf, mittel-4, Runde 12).

Warum: Im Roman (Kap. 1 und 5) und im Ortsblatt ist das Whitlock-Haus das einzige graue, ungestrichene
Haus zwischen den bunten Holzhäusern der Birch Lane. Bisher stand dort dieselbe Villa wie bei den
Nachbarn, nur mit orangem Dach. Das Bild ist dieselbe Villa (``Villa_2``, braunes Dach, mit dem runden
Giebelfenster des Dachbodens), verblasst: Farben stark entsättigt, Holz etwas dunkler, die Fenster
bleiben hell. Keine neue Form, also keine Stilfrage.

- ``villa_whitlock.png`` (144 × 128, wie Villa_2).

Aufruf im privaten Repository: ``python whitlock_haus.py <privat>`` schreibt nach ``spiel/eigene/``.
"""

import colorsys
import sys
from pathlib import Path

from PIL import Image

VILLA = (
    "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/7_Villas_Singles_16x16/"
    "ME_Singles_Villas_16x16_Villa_2.png"
)
SAETTIGUNG = 0.25  # Anteil der alten Sättigung
DUNKLER = 0.9  # Helligkeit des Holzes
GLAS_HELL = 0.8  # helle, bläuliche Pixel (Fenster) bleiben fast unverändert


def verblasse(farbe: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    r, g, b, a = farbe
    if a == 0:
        return farbe
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    glas = l > GLAS_HELL or (0.5 < h < 0.7 and s > 0.3)
    s *= 0.8 if glas else SAETTIGUNG
    l *= 1.0 if glas else DUNKLER
    r2, g2, b2 = colorsys.hls_to_rgb(h, l, s)
    return (round(r2 * 255), round(g2 * 255), round(b2 * 255), a)


def whitlock_haus(privat: Path) -> Image.Image:
    bild = Image.open(privat / VILLA).convert("RGBA")
    bild.putdata([verblasse(p) for p in bild.getdata()])
    return bild


def main() -> None:
    privat = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    whitlock_haus(privat).save(privat / "spiel" / "eigene" / "villa_whitlock.png")
    print("Whitlock-Haus nach", privat / "spiel" / "eigene")


if __name__ == "__main__":
    main()
