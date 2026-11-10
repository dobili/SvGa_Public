"""Bildwunsch mittel-3 (Runde 8, Gutachten): Bahnhof und Brückenschatten für Riverton außen.

Warum: Das Gutachten fand den Bahnhof als bloßen Uhrturm ohne Halle und ohne Tür und die Brücke
als flachen Streifen ohne Schatten. Der Bahnhof wird aus dem Baukasten „Floor Modular Building“
gebaut: drei Teile nebeneinander, je rotes Ziegeldach über einem Backsteingeschoss; links und
rechts mit großem Bogenfenster (Middle_Floor_6), in der Mitte mit der Eingangstür (Middle_Floor_3).
Der Brückenschatten ist ein halbdurchsichtiger dunkler Streifen, der östlich der Brücke auf dem
Wasser liegt (Licht von Westen).

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/riverton_bahnhof.png (352 × 240),
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


TURM = (
    "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/13_School_Singles_16x16/"
    "ME_Singles_School_16x16_Clock_Tower_1.png"
)
# Tür aus dem Mittelstück mit Eingang (Middle_Floor_3), unter den Rundbogen des Turms gesetzt.
TUER_AUSSCHNITT = (40, 22, 72, 64)
TUER_ORT = (48, 186)


def fluegel(privat: Path) -> Image.Image:
    """Seitenflügel: rotes Ziegeldach über dem Backsteingeschoss mit Bogenfenster (112 × 160)."""
    dach = Image.open(privat / ORDNER.format(DACH)).convert("RGBA")
    teil = Image.open(privat / ORDNER.format(TEILE[0])).convert("RGBA")
    bild = Image.new("RGBA", (teil.width, dach.height + teil.height))
    bild.alpha_composite(dach, (0, 0))
    bild.alpha_composite(teil, (0, dach.height))
    return bild


def bahnhof(privat: Path) -> Image.Image:
    """Uhrturm in der Mitte mit Bogenportal (Tür unter dem Rundbogen), links und rechts ein Flügel.

    Gutachten Riverton außen, zweite Prüfung: „Bahnhof ohne Uhrturm und Bogenportal, flache Front“.
    """
    turm = Image.open(privat / TURM).convert("RGBA")
    tuer = Image.open(privat / ORDNER.format(TEILE[1])).convert("RGBA").crop(TUER_AUSSCHNITT)
    turm.alpha_composite(tuer, TUER_ORT)
    seite = fluegel(privat)
    bild = Image.new("RGBA", (2 * seite.width + turm.width, turm.height))
    unten = turm.height - seite.height
    bild.alpha_composite(seite, (0, unten))
    bild.alpha_composite(seite, (seite.width + turm.width, unten))
    bild.alpha_composite(turm, (seite.width, 0))
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
