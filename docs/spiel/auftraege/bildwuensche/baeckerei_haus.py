"""Bildwunsch mittel-3 (Runde 8): Bäckerei von Riverton als ganzes Haus in Draufsicht.

Warum: Der Autor fand die Bäckerei in riverton.aussen als flache Fassade ohne Gebäude dahinter
(revision2_notizen, KARTENREGELN 10.60). Das Bild setzt das Ziegeldach (Roof_2, 112 × 96) über das
Ladengeschoss der Bäckerei (Ground_Floor_Bakery_1, 112 × 80). Das Ladengeschoss ist oben 32 Pixel
durchsichtig (Schild ragt hinein), deshalb liegt es bei y = 64 über der Traufe des Dachs.

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/baeckerei_haus.png (112 × 144), im
Möbelkatalog als rv8Baeckerei (inhalte/abenteuer/moebel/riverton.json).

Aufruf: python baeckerei_haus.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image

QUELLE = (
    "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/5_Floor_Modular_Building_Singles_16x16/"
    "ME_Singles_Floor_Modular_Building_16x16_"
)
BREITE, HOEHE = 112, 144
# Oberkante des Ladengeschosses: Dachhöhe 96 minus die 32 durchsichtigen Pixel über der Wand.
LADEN_Y = 64


def main() -> None:
    privat = Path(sys.argv[1])
    dach = Image.open(privat / f"{QUELLE}Roof_2.png").convert("RGBA")
    laden = Image.open(privat / f"{QUELLE}Ground_Floor_Bakery_1.png").convert("RGBA")
    haus = Image.new("RGBA", (BREITE, HOEHE))
    haus.alpha_composite(dach, (0, 0))
    haus.alpha_composite(laden, (0, LADEN_Y))
    haus.save(privat / "spiel" / "eigene" / "baeckerei_haus.png")


if __name__ == "__main__":
    main()
