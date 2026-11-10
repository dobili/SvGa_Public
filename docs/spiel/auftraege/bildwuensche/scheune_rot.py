"""Bildwunsch mittel-3 (Runde 9): Rote Scheune für die Prärie (Weg 8) aus LimeZus kleiner Scheune.

Warum: Die Story-Bibel und die Beschreibung der Prärie nennen die rote Scheune, unter der Ray
Castillo den Sturmkeller hat; das Gutachten fand nur Farmhaus und Silo. Im Katalog gibt es nur
``Barn_Small`` mit hellen Brettern und orangem Fachwerk. Eine amerikanische Scheune ist rot mit
weißen Balken. Das Bild färbt deshalb nur um: Bretter nach Helligkeit in vier Rottöne, Fachwerk
nach Helligkeit in Weiß und Hellgrau; Dach, Tor, Fensterladen und Umriss bleiben.

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/scheune_rot.png (128 × 160).
Aufruf: python scheune_rot.py /home/user/schach-abenteuer-inhalte
"""

import colorsys
import sys
from pathlib import Path

from PIL import Image

QUELLE = "modern-farm/Single_Files_16x16/Props_and_Buildings_16x16/Barn_Small_16x16.png"
ROT = [(112, 36, 38), (146, 46, 44), (176, 58, 50), (204, 82, 66)]
WEISS = [(176, 176, 186), (214, 214, 220), (240, 240, 244)]
WAND_AB = 95  # ab dieser Pixelreihe beginnt die Wand unter dem Dach


def stufe(farben: list[tuple[int, int, int]], helligkeit: float, unten: float, oben: float) -> tuple:
    """Farbe aus ``farben`` nach Helligkeit zwischen ``unten`` und ``oben``."""
    anteil = min(0.999, max(0.0, (helligkeit - unten) / (oben - unten)))
    return farben[int(anteil * len(farben))]


def umfaerben(px: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    """Bretter (warmes Beige) werden rot, Fachwerk (Orange) wird weiß, alles andere bleibt."""
    r, g, b, a = px
    if a == 0:
        return px
    farbton, saettigung, hell = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    warm = farbton < 0.12 or farbton > 0.95
    if warm and saettigung > 0.4 and hell > 0.5:  # Fachwerk
        return (*stufe(WEISS, hell, 0.5, 0.7), a)
    if warm and 0.08 < saettigung <= 0.4 and hell > 0.55:  # Bretter
        return (*stufe(ROT, hell, 0.55, 0.82), a)
    return px


def scheune_rot(privat: Path) -> Image.Image:
    bild = Image.open(privat / QUELLE).convert("RGBA")
    for y in range(WAND_AB, bild.height):
        for x in range(bild.width):
            bild.putpixel((x, y), umfaerben(bild.getpixel((x, y))))
    return bild


def main() -> None:
    privat = Path(sys.argv[1])
    scheune_rot(privat).save(privat / "spiel" / "eigene" / "scheune_rot.png")
    print("scheune_rot.png geschrieben")


if __name__ == "__main__":
    main()
