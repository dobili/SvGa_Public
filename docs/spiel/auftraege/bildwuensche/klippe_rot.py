"""Rote Felskanten für Canyon und Sternwarte (Entwurf, mittel-4, Auftrag Runde 9).

Warum: Die Felskanten aus LimeZus Klippenkacheln (Szene ``"kante": "klippe"``) gibt es nur mit Gras-
und Erdfuß in Braun. Canyonpfad, Felsbogen, Sternwarte und der Diner liegen auf rotem Sandstein
(``fels_rot.png``); dort wirkte die braune Wand mit grünem Fuß fremd, also zeichneten die Karten Höhen
weiter als Grundriss mit dunkler Linie (Variantenwahl, Muster „Höhen als Grundriss“).

- ``klippe_rot.png``: derselbe Zuschnitt wie der Geländebogen ``1_Terrains_and_Fences_16x16.png``
  (gleiche Größe, gleiche Kachellage), aber nur mit den Kacheln der Erdklippe (Spalten 14–16,
  Reihen 42–46) und der Felstreppe (Spalte 25, Reihen 46–48), umgefärbt auf die Farben von
  ``fels_rot.png``: helle Flächen werden roter Sand, die Wand roter Fels, der grüne Fuß roter Sand.
  Alles andere bleibt durchsichtig. So kann ``pipeline/abenteuer/klippe.py`` dieselben Koordinaten
  benutzen.

Aufruf: ``python klippe_rot.py <privates Repository>`` (liest den Geländebogen und ``fels_rot.png``,
schreibt nach ``spiel/eigene/klippe_rot.png``).
"""

import colorsys
import sys
from pathlib import Path

from PIL import Image

K = 16
GELAENDE = "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/1_Terrains_and_Fences_16x16.png"
FELS_ROT = "spiel/eigene/fels_rot.png"
KACHELN = [(x, y) for x in (14, 15, 16) for y in range(42, 47)] + [(25, y) for y in (46, 47, 48)]
# Farben aus fels_rot.png: Sand für die obere Fläche und den Fuß, dunklere Rottöne für die Wand.
SAND = [(186, 112, 74), (198, 124, 82), (206, 128, 88), (218, 146, 104)]
WANDROT = [(84, 34, 32), (112, 46, 38), (138, 62, 46), (160, 74, 52), (178, 88, 60)]
# Grenze der Helligkeit zwischen Wand und oberer Fläche im braunen Original.
GRENZE, DUNKEL = 0.55, 0.22


def _helligkeit(farbe: tuple[int, int, int]) -> float:
    r, g, b = farbe
    return (0.3 * r + 0.59 * g + 0.11 * b) / 255


def umfaerben(farbe: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    """Ein Pixel der braunen Klippe in den roten Fels: nach Helligkeit auf die Rot-Palette.
    Grün (Grasfuß, Grasbüschel) wird heller Sand, sehr dunkle Umrisse bleiben dunkel."""
    r, g, b, a = farbe
    if a == 0:
        return farbe
    h, _, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    if 0.2 < h < 0.45 and s > 0.2:  # Grün
        return (*SAND[1], a)
    hell = _helligkeit((r, g, b))
    if hell < DUNKEL:
        return farbe  # Umriss bleibt wie bei LimeZu
    if hell >= GRENZE:
        stufe = min(len(SAND) - 1, int((hell - GRENZE) / (1 - GRENZE) * len(SAND) * 1.6))
        return (*SAND[stufe], a)
    stufe = min(len(WANDROT) - 1, int((hell - DUNKEL) / (GRENZE - DUNKEL) * len(WANDROT)))
    return (*WANDROT[stufe], a)


def klippe_rot(privat: Path) -> Image.Image:
    """Erdklippe rot umgefärbt; helle Flächen bekommen die Struktur aus fels_rot.png: die
    Hochfläche den rissigen Felsboden (Kachel 1, 0), der Fuß den roten Sand (Kachel 2, 0)."""
    bogen = Image.open(privat / GELAENDE).convert("RGBA")
    fels = Image.open(privat / FELS_ROT).convert("RGBA")
    felsboden, sand = fels.crop((K, 0, 2 * K, K)), fels.crop((2 * K, 0, 3 * K, K))
    ziel = Image.new("RGBA", bogen.size)
    for sx, sy in KACHELN:
        kachel = bogen.crop((sx * K, sy * K, (sx + 1) * K, (sy + 1) * K))
        neu = Image.new("RGBA", (K, K))
        for py in range(K):
            for px in range(K):
                alt = kachel.getpixel((px, py))
                farbe = umfaerben(alt)
                if farbe[:3] in SAND and alt[3]:
                    gruen = alt[1] > alt[0]
                    farbe = (*(sand if gruen else felsboden).getpixel((px, py))[:3], alt[3])
                neu.putpixel((px, py), farbe)
        ziel.alpha_composite(neu, (sx * K, sy * K))
    return ziel


def main() -> None:
    privat = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    klippe_rot(privat).save(privat / "spiel" / "eigene" / "klippe_rot.png")
    print("Rote Klippe nach", privat / "spiel" / "eigene")


if __name__ == "__main__":
    main()
