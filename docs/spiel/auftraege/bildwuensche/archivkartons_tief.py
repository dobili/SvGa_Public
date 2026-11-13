"""Bildwunsch: Archivkartons mit Tiefe aus Paketteilen (spiel/eigene/), Entwurf von mittel-1.

Warum: Der Autor fand die Kartons mit den Jahreszahlen im Keller der Bibliothek flach wie
Abziehbilder (Rückmeldung R067, R055). LimeZus Umzugskarton (Garage Sales, ``Box_2``) zeigt Deckel
und Front, ist aber nur 15 Pixel breit; eine vierstellige Jahreszahl passt nicht darauf. Das
Werkzeug verbreitert den Karton auf 23 Pixel, indem es je eine Spalte links und rechts der
Klebenaht vervielfacht, und klebt ein Papieretikett mit der Jahreszahl auf die Front. Der offene
Karton „1850“ bekommt das Innere von ``Box_4`` (ohne die abstehenden Klappen), ebenso verbreitert.

Bilder (je 96 × 32, vier Kartons nebeneinander, Ersatz für ``archivkartons_oben/_unten.png``):

- ``archivkartons_tief_oben.png``: 1810, 1820, 1830, 1840.
- ``archivkartons_tief_unten.png``: 1850 (offen), 1860, 1870, 1880.

Aufruf: ``python archivkartons_tief.py <Pfad zum privaten Repository>``. Nur PIL.
"""

import sys
from pathlib import Path

from PIL import Image

ORDNER = "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/6_Garage_Sales_Singles_16x16/"
ZU = (ORDNER + "ME_Singles_Garage_Sales_16x16_Box_2.png", (9, 11, 25, 32))  # Bild, Ausschnitt
OFFEN = (ORDNER + "ME_Singles_Garage_Sales_16x16_Box_4.png", (8, 11, 25, 32))
MEHR = 4  # so oft kommt die vervielfachte Spalte je Seite dazu
RASTER = 24  # Abstand der Kartons im Bild
PAPIER, TINTE = (236, 230, 212, 255), (58, 58, 80, 255)
ZIFFERN = {
    "0": ["###", "#.#", "#.#", "#.#", "###"],
    "1": [".#.", "##.", ".#.", ".#.", "###"],
    "2": ["###", "..#", "###", "#..", "###"],
    "3": ["###", "..#", ".##", "..#", "###"],
    "4": ["#.#", "#.#", "###", "..#", "..#"],
    "5": ["###", "#..", "###", "..#", "###"],
    "6": ["###", "#..", "###", "#.#", "###"],
    "7": ["###", "..#", ".#.", ".#.", ".#."],
    "8": ["###", "#.#", "###", "#.#", "###"],
}


def breiter(karton: Image.Image, links: int, rechts: int) -> Image.Image:
    """Vervielfacht die Spalten ``links`` und ``rechts`` je MEHR-mal; die Naht in der Mitte bleibt."""
    spalten = []
    for x in range(karton.width):
        spalten += [x] * (1 + MEHR if x in (links, rechts) else 1)
    ziel = Image.new("RGBA", (len(spalten), karton.height))
    for i, x in enumerate(spalten):
        ziel.paste(karton.crop((x, 0, x + 1, karton.height)), (i, 0))
    return ziel


def etikett(karton: Image.Image, jahr: str) -> None:
    """Papieretikett 17 × 7 mittig auf die Front (untere zehn Reihen), darauf die Jahreszahl."""
    x0, y0 = (karton.width - 1 - 17) // 2, karton.height - 9
    for x in range(x0, x0 + 17):
        for y in range(y0, y0 + 7):
            karton.putpixel((x, y), PAPIER)
    for i, ziffer in enumerate(jahr):
        for r, reihe in enumerate(ZIFFERN[ziffer]):
            for s, p in enumerate(reihe):
                if p == "#":
                    karton.putpixel((x0 + 1 + i * 4 + s, y0 + 1 + r), TINTE)


def karton(privat: Path, jahr: str, offen: bool) -> Image.Image:
    datei, ausschnitt = OFFEN if offen else ZU
    teil = Image.open(privat / datei).convert("RGBA").crop(ausschnitt)
    bild = breiter(teil, 4, teil.width - 6) if offen else breiter(teil, 3, 10)
    etikett(bild, jahr)
    return bild


def reihe(privat: Path, jahre: list[str], offen: str | None) -> Image.Image:
    ziel = Image.new("RGBA", (RASTER * len(jahre), 32))
    for i, jahr in enumerate(jahre):
        bild = karton(privat, jahr, jahr == offen)
        ziel.alpha_composite(bild, (i * RASTER + (RASTER - bild.width) // 2, 32 - bild.height))
    return ziel


def main() -> None:
    privat = Path(sys.argv[1])
    ziel = privat / "spiel" / "eigene"
    reihe(privat, ["1810", "1820", "1830", "1840"], None).save(ziel / "archivkartons_tief_oben.png")
    reihe(privat, ["1850", "1860", "1870", "1880"], "1850").save(ziel / "archivkartons_tief_unten.png")
    print("archivkartons_tief_oben.png, archivkartons_tief_unten.png geschrieben")


if __name__ == "__main__":
    main()
