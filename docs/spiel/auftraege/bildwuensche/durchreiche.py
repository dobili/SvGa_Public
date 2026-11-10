"""Bildwunsch mittel-3 (Runde 9): Durchreiche für Darlenes Raststätte in Crossroads.

Warum: Das Gutachten zur Raststätte (gutachten/crossroads.md, Punkt 1) las die Durchreiche als
Sprossenfenster in der Holzwand, durch das man nur die weiße Wand dahinter sähe. Eine Durchreiche
ist eine offene Luke: Man sieht in die Küche (helle Fliesen, die Wärmelampe), auf dem Brett davor
stehen fertige Teller und der Bestellzettel hängt an der Leiste. Gezeichnet für die Wandfläche
(``an_wand``), 32 × 32, im Stil von LimeZu.

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/durchreiche_offen.png.
Aufruf: python durchreiche.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

UMRISS = (44, 36, 36, 255)
HOLZ, HOLZ_DUNKEL = (150, 98, 60, 255), (108, 68, 42, 255)
FLIESE, FUGE = (214, 222, 226, 255), (170, 182, 188, 255)
STAHL, STAHL_HELL = (150, 156, 166, 255), (204, 210, 218, 255)
LAMPE, LICHT = (190, 60, 48, 255), (255, 214, 120, 160)
TELLER, ESSEN = (246, 246, 242, 255), (214, 150, 70, 255)
ZETTEL = (250, 246, 210, 255)


def kueche(z: ImageDraw.ImageDraw) -> None:
    """Blick in die Küche: Fliesen mit Fugen, oben die rote Wärmelampe mit Lichtkegel."""
    z.rectangle((4, 4, 27, 20), fill=FLIESE)
    for x in range(4, 28, 6):
        z.line((x, 4, x, 20), fill=FUGE)
    for y in range(4, 21, 5):
        z.line((4, y, 27, y), fill=FUGE)
    z.polygon([(10, 6), (21, 6), (26, 19), (5, 19)], fill=LICHT)
    z.rectangle((12, 4, 19, 7), fill=LAMPE, outline=UMRISS)


def rahmen(z: ImageDraw.ImageDraw) -> None:
    """Holzrahmen um die Luke, darunter das Stahlbrett mit Tellern, Leiste mit Zettel."""
    z.rectangle((2, 2, 29, 22), outline=HOLZ_DUNKEL, width=2)
    z.rectangle((1, 1, 30, 23), outline=UMRISS)
    z.rectangle((0, 21, 31, 26), fill=STAHL, outline=UMRISS)
    z.line((1, 22, 30, 22), fill=STAHL_HELL)
    for x in (5, 14, 23):
        z.ellipse((x, 18, x + 6, 22), fill=TELLER, outline=UMRISS)
        z.ellipse((x + 2, 19, x + 4, 21), fill=ESSEN)
    z.line((3, 3, 28, 3), fill=HOLZ)
    z.rectangle((22, 5, 26, 10), fill=ZETTEL, outline=UMRISS)


def main() -> None:
    bild = Image.new("RGBA", (32, 32))
    z = ImageDraw.Draw(bild)
    kueche(z)
    rahmen(z)
    bild.save(Path(sys.argv[1]) / "spiel" / "eigene" / "durchreiche_offen.png")
    print("durchreiche_offen.png geschrieben")


if __name__ == "__main__":
    main()
