"""Bildwunsch: Farbfassungen der Holzhäuser für Port Delacroix (spiel/eigene/), Entwurf von mittel-1.

Warum: Im Gutachten Port Delacroix (``gutachten/port-delacroix.md``, Befunde 4 und 5) stehen fünf
gleiche Holzhäuser mit rotem Dach (LimeZus ``Farmer_House_1`` und ``_2``) und ein hellblauer
Flachdachblock. Andere Holzhäuser mit Satteldach in passender Größe (Regel 10.66) hat das Paket
nicht; in einer Hafenstadt am Golf sind die Häuser aber bunt gestrichen. Das Werkzeug färbt das
rote Dach und die orange Holzwand um, Fenster, Türen und Rahmen bleiben.

Bilder (Größe wie die Vorlage):

- ``haus_farm1_blau.png``: schiefergraues Dach, weiß gestrichene Wand.
- ``haus_farm1_gruen.png``: dunkelgrünes Dach, cremegelbe Wand.
- ``haus_farm2_grau.png``: graues Blechdach, hellblaue Wand.
- ``haus_farm2_gruen.png``: dunkelgrünes Dach, weiße Wand.

Aufruf: ``python haeuser_varianten.py <Pfad zum privaten Repository>``. Nur PIL.
"""

import colorsys
import sys
from pathlib import Path

from PIL import Image

ORDNER = "modern-farm/Single_Files_16x16/Props_and_Buildings_16x16/"
# Fassung: (Vorlage, Dach (Farbton in Grad, Sättigung), Wand (Farbton, Sättigung, Aufhellung))
FASSUNGEN = {
    "haus_farm1_blau": ("Farmer_House_1_16x16.png", (215, 0.18), (210, 0.04, 0.22)),
    "haus_farm1_gruen": ("Farmer_House_1_16x16.png", (140, 0.35), (48, 0.45, 0.12)),
    "haus_farm2_grau": ("Farmer_House_2_16x16.png", (210, 0.06), (200, 0.30, 0.15)),
    "haus_farm2_gruen": ("Farmer_House_2_16x16.png", (140, 0.35), (40, 0.05, 0.22)),
}


def ist_dach(farbton: float, saettigung: float) -> bool:
    """Ziegelrot: Farbton bis 20 Grad (oder ab 340), mehr als blass."""
    return (farbton <= 20 or farbton >= 340) and saettigung > 0.2


def ist_wand(farbton: float, saettigung: float) -> bool:
    """Orange Holzwand und Schornstein: 21 bis 45 Grad, gesättigt."""
    return 21 <= farbton <= 45 and saettigung > 0.3


def umfaerben(bild: Image.Image, dach: tuple, wand: tuple) -> Image.Image:
    neu = bild.convert("RGBA")
    px = neu.load()
    for y in range(neu.height):
        for x in range(neu.width):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            h, hell, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
            grad = h * 360
            if ist_dach(grad, s):
                ziel = colorsys.hls_to_rgb(dach[0] / 360, hell * 0.9, dach[1])
            elif ist_wand(grad, s):
                ziel = colorsys.hls_to_rgb(wand[0] / 360, min(0.92, hell + wand[2]), wand[1])
            else:
                continue
            px[x, y] = tuple(round(c * 255) for c in ziel) + (a,)
    return neu


def main() -> None:
    privat = Path(sys.argv[1])
    ziel = privat / "spiel" / "eigene"
    for name, (vorlage, dach, wand) in FASSUNGEN.items():
        umfaerben(Image.open(privat / ORDNER / vorlage), dach, wand).save(ziel / f"{name}.png")
    print(f"{len(FASSUNGEN)} Hausfassungen geschrieben")


if __name__ == "__main__":
    main()
