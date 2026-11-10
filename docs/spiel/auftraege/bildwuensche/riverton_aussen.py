"""Bildwunsch mittel-3 (Runde 8, Gutachten): Bahnhof und Brückenschatten für Riverton außen.

Warum: Das Gutachten fand den Bahnhof als bloßen Uhrturm ohne Halle und ohne Tür und die Brücke
als flachen Streifen ohne Schatten. Der Bahnhof wird aus dem Baukasten „Floor Modular Building“
gebaut: drei Teile nebeneinander, je rotes Ziegeldach über einem Backsteingeschoss; links und
rechts mit großem Bogenfenster (Middle_Floor_6), in der Mitte mit der Eingangstür (Middle_Floor_3).
Der Brückenschatten ist ein halbdurchsichtiger dunkler Streifen, der östlich der Brücke auf dem
Wasser liegt (Licht von Westen).

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/riverton_bahnhof.png (336 × 160),
spiel/eigene/riverton_brueckenschatten.png (16 × 96).
Aufruf: python riverton_aussen.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image

ORDNER = (
    "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/5_Floor_Modular_Building_Singles_16x16/"
    "ME_Singles_Floor_Modular_Building_16x16_{}.png"
)
TEILE = ("Middle_Floor_6", "Middle_Floor_3", "Middle_Floor_6")
DACH = "Roof_2"
SCHATTEN_BREITE, SCHATTEN_HOEHE = 16, 96
# Deckkraft des Schattens auf dem Wasser (0 bis 255).
SCHATTEN_ALPHA = 90


def bahnhof(privat: Path) -> Image.Image:
    """Drei Hausteile mit Dach nebeneinander, Dach oben, Geschoss direkt darunter."""
    dach = Image.open(privat / ORDNER.format(DACH)).convert("RGBA")
    teile = [Image.open(privat / ORDNER.format(n)).convert("RGBA") for n in TEILE]
    bild = Image.new("RGBA", (sum(t.width for t in teile), dach.height + teile[0].height))
    x = 0
    for teil in teile:
        bild.alpha_composite(dach, (x, 0))
        bild.alpha_composite(teil, (x, dach.height))
        x += teil.width
    return bild


def brueckenschatten() -> Image.Image:
    """Dunkler Streifen, links kräftig, nach rechts auslaufend."""
    bild = Image.new("RGBA", (SCHATTEN_BREITE, SCHATTEN_HOEHE))
    for x in range(SCHATTEN_BREITE):
        alpha = SCHATTEN_ALPHA * (SCHATTEN_BREITE - x) // SCHATTEN_BREITE
        for y in range(SCHATTEN_HOEHE):
            bild.putpixel((x, y), (10, 20, 40, alpha))
    return bild


def main() -> None:
    privat = Path(sys.argv[1])
    ziel = privat / "spiel" / "eigene"
    bahnhof(privat).save(ziel / "riverton_bahnhof.png")
    brueckenschatten().save(ziel / "riverton_brueckenschatten.png")


if __name__ == "__main__":
    main()
