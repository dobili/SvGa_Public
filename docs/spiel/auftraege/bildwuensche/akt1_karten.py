"""Bilder zu den Kartennotizen des Autors für Akt 1 (Prüfmappe 15.11.2026, Maple Falls und Cedar Creek).

Warum: Der Autor fand an mehreren Stellen kein passendes Bild im Katalog:
- „Das Stegasset hat Wasser drunter, steht aber teilweise auf dem Gras“ (Park): Der morsche Steg
  aus dem Paket hat eingemaltes Wasser; hier ohne das Wasser, damit er am Ufer ansetzen kann.
- „Auf dem Asset des Tischs liegt schon ein Buch, jetzt das Brett auf dem Buch“ (Zimmer): derselbe
  Schreibtisch ohne das aufgeschlagene Buch und die Flasche.
- „Soll da unter dem Tischbein etwas stecken?“ (Wohnzimmer): Ja, der gefaltete Pizzakarton (Ink
  ``tisch_pizzakarton``). Statt eines flachen Kartons unter dem Tisch ein kleiner, zusammengefalteter
  Kartonkeil genau unter dem rechten vorderen Tischbein, damit man sieht, wozu er dort liegt
  (mit dem Bein selbst im Bild, damit der Schatten des Tischs ihn nicht verdeckt).
- „Getränke und Essen auf den Tischen“ (Diner): kommen aus LimeZus Küchenbogen (Teller, Tassen),
  hier nichts zu zeichnen.
Treppenloch (Zimmer, Dachboden) und Wasserfall zwischen Felsen (Park) kommen als Gemini-Bilder des
Autors (Hauptchat, 15.11.2026) und werden hier nicht gezeichnet.

Selbst gezeichnet ist nur Flaches (KARTENREGELN 10.71): der Kartonkeil; alles andere ist aus
Paketteilen retuschiert.

Aufruf: ``python akt1_karten.py <privat>`` schreibt nach ``<privat>/spiel/eigene/``.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

INNEN = "modern-interiors/1_Interiors/16x16/Theme_Sorter_Black_Shadow_Singles/"
STEG = (
    "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/11_Camping_Singles_16x16/"
    "ME_Singles_Camping_16x16_Pier_26.png"
)
SCHREIBTISCH = INNEN + (
    "5_Classroom_and_Library_Black_Shadow_Singles_16x16/Classroom_and_Library_Singles_25.png"
)
ESSTISCH = INNEN + "14_Basement_Black_Shadow_Singles_16x16/Basement_Shadow_Singles_3.png"
# Ausschnitt um das rechte vordere Bein des runden Esstischs: links oben, Spalten des Beins.
TISCHBEIN = (19, 27)
BEIN_SPALTEN = (22, 25)
RAND = (58, 58, 80, 255)


def steg_ohne_wasser(privat: Path) -> Image.Image:
    """Der morsche Steg aus dem Paket ohne das eingemalte Wasser (blaue Pixel werden durchsichtig)."""
    bild = Image.open(privat / STEG).convert("RGBA")
    pixel = bild.load()
    for y in range(bild.size[1]):
        for x in range(bild.size[0]):
            r, g, b, a = pixel[x, y]
            if a and b > r + 30 and b >= g - 10:
                pixel[x, y] = (0, 0, 0, 0)
    return bild


def schreibtisch_leer(privat: Path) -> Image.Image:
    """Der grüne Schreibtisch des Pakets ohne aufgeschlagenes Buch und Flasche.

    Die Platte reicht im Bild von Reihe 10 bis 20 und Spalte 3 bis 28; Buch und Flasche liegen darauf
    und ragen oben bis Reihe 7 hinaus. Sie werden mit den Farben der Platte übermalt.
    """
    bild = Image.open(privat / SCHREIBTISCH).convert("RGBA")
    z = ImageDraw.Draw(bild)
    platte, schatten, kante = (68, 126, 112, 255), (50, 103, 90, 255), RAND
    z.rectangle((0, 0, 31, 9), fill=(0, 0, 0, 0))
    z.line((3, 10, 28, 10), fill=kante)
    z.rectangle((4, 11, 26, 19), fill=platte)
    z.line((27, 11, 27, 19), fill=schatten)
    return bild


def tischbein_pizzakarton(privat: Path) -> Image.Image:
    """Der gefaltete Pizzakarton unter dem rechten vorderen Tischbein (10 × 6), mit dem Bein darüber.

    Warum mit Bein: Der Karton liegt flach unter dem Tisch, und dort deckt der Schatten des Tischs
    ihn zu. Deshalb zeigt das Bild den Karton und darüber die Pixel des Tischbeins aus dem Tischbild
    selbst; es liegt vor dem Tisch (``vorn``) genau auf dem Bein (Tischbild Spalte 19, Reihe 27).
    """
    tisch = Image.open(privat / ESSTISCH).convert("RGBA")
    links, oben = TISCHBEIN
    bild = Image.new("RGBA", (10, 6))
    z = ImageDraw.Draw(bild)
    z.rectangle((1, 2, 8, 5), fill=RAND)
    z.rectangle((2, 3, 7, 4), fill=(214, 186, 140, 255))
    z.point((7, 4), fill=(196, 64, 52, 255))  # Rest des Aufdrucks
    for y in range(5):
        for x in range(10):
            pixel = tisch.getpixel((links + x, oben + y))
            if pixel[3] == 255 and links + x >= BEIN_SPALTEN[0] and links + x <= BEIN_SPALTEN[1]:
                bild.putpixel((x, y), pixel)
    return bild


def main() -> None:
    privat = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    ziel = privat / "spiel" / "eigene"
    steg_ohne_wasser(privat).save(ziel / "steg_morsch_ohne_wasser.png")
    schreibtisch_leer(privat).save(ziel / "schreibtisch_leer.png")
    tischbein_pizzakarton(privat).save(ziel / "tischbein_pizzakarton.png")
    print("Bilder zu den Kartennotizen Akt 1 nach", ziel)


if __name__ == "__main__":
    main()
