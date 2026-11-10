"""Bildwunsch: große Seefähre und alte Leuchtturmlinse für Weg 11 (spiel/eigene/), Entwurf von mittel-1.

Warum: Im Gutachten Runde 9 (``gutachten/weg-ghost-capital.md``) ist die Fähre am Seeufer mit
9,5 × 2,5 Kacheln so groß wie ein Schlepper (Befund 1, Regel 10.64: Fähre 16–20 × 6), und die alte
Linse am Leuchtturm ist eine kleine braune Kiste (Leuchtturm, Befund 3). LimeZus Paket hat keine
große Fähre und keine Leuchtturmlinse.

Bilder:

- ``seefaehre.png`` (320 × 96, 20 × 6 Kacheln): weiße Fähre in Seitenansicht wie LimeZus Boote,
  Bug nach rechts. Rumpf mit blauem Streifen und Bullaugen, zwei Decks mit Fensterband, Brücke
  vorn, Schornstein in der Mitte, Rettungsringe, Heckklappe links.
- ``alte_linse.png`` (32 × 32): eine Fresnel-Linse aus Glasringen in einem Messinggestell auf
  einer Holzpalette, wie sie vor dem Turm zum Abholen bereitsteht.

Aufruf: ``python weg11_bilder.py <Pfad zum privaten Repository>``. Nur PIL.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

KONTUR, WEISS, GRAU = (40, 46, 66, 255), (238, 242, 246, 255), (196, 204, 220, 255)
BLAU, GLAS, GLAS_HELL = (52, 92, 170, 255), (110, 170, 210, 255), (176, 216, 236, 255)
ROT, SCHWARZ = (204, 52, 46, 255), (40, 40, 50, 255)
MESSING, MESSING_DUNKEL, HOLZ = (206, 168, 72, 255), (150, 112, 44, 255), (150, 104, 60, 255)


def rumpf(z: ImageDraw.ImageDraw) -> None:
    """Rumpf von der Seite: unten schmaler, Bug rechts schräg, blauer Streifen, Bullaugen."""
    z.polygon([(4, 56), (300, 56), (318, 60), (304, 92), (14, 92), (4, 80)], fill=KONTUR)
    z.polygon([(6, 58), (299, 58), (315, 61), (302, 90), (16, 90), (6, 79)], fill=WEISS)
    z.rectangle((8, 78, 306, 85), fill=BLAU)
    for x in range(24, 296, 18):
        z.ellipse((x, 64, x + 6, 70), fill=KONTUR)
        z.ellipse((x + 1, 65, x + 5, 69), fill=GLAS)
    z.rectangle((6, 60, 14, 76), fill=GRAU)  # Heckklappe
    z.line((6, 56, 316, 56), fill=GRAU)  # Reling am Hauptdeck


def aufbauten(z: ImageDraw.ImageDraw) -> None:
    """Zwei Decks mit Fensterband, Brücke vorn rechts, Schornstein, Rettungsringe."""
    z.rectangle((40, 30, 270, 56), fill=KONTUR)
    z.rectangle((42, 32, 268, 55), fill=WEISS)
    for x in range(48, 262, 14):
        z.rectangle((x, 37, x + 10, 47), fill=GLAS)
        z.line((x + 1, 38, x + 1, 46), fill=GLAS_HELL)
    z.rectangle((80, 14, 250, 30), fill=KONTUR)
    z.rectangle((82, 16, 248, 30), fill=WEISS)
    for x in range(86, 200, 12):
        z.rectangle((x, 19, x + 8, 26), fill=GLAS)
    z.rectangle((206, 12, 250, 30), fill=KONTUR)  # Brücke mit breitem Fensterband
    z.rectangle((208, 14, 248, 30), fill=WEISS)
    z.rectangle((210, 18, 246, 24), fill=GLAS)
    z.rectangle((140, 0, 160, 16), fill=KONTUR)  # Schornstein
    z.rectangle((142, 2, 158, 16), fill=BLAU)
    z.rectangle((142, 2, 158, 5), fill=SCHWARZ)
    for x in (60, 190):
        z.ellipse((x, 46, x + 8, 54), fill=ROT)
        z.ellipse((x + 3, 49, x + 5, 51), fill=WEISS)


def seefaehre() -> Image.Image:
    bild = Image.new("RGBA", (320, 96))
    z = ImageDraw.Draw(bild)
    aufbauten(z)
    rumpf(z)
    return bild


def alte_linse() -> Image.Image:
    bild = Image.new("RGBA", (32, 32))
    z = ImageDraw.Draw(bild)
    z.rectangle((3, 26, 28, 31), fill=KONTUR)  # Palette
    z.rectangle((4, 27, 27, 30), fill=HOLZ)
    z.ellipse((7, 2, 24, 27), fill=MESSING_DUNKEL)  # Gestell
    for rand, farbe in ((1, GLAS), (3, GLAS_HELL), (5, GLAS), (7, GLAS_HELL)):
        z.ellipse((7 + rand, 2 + rand, 24 - rand, 27 - rand), fill=farbe)
    z.line((15, 2, 15, 27), fill=MESSING)
    z.line((7, 14, 24, 14), fill=MESSING)
    z.ellipse((13, 12, 18, 17), fill=WEISS)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1]) / "spiel" / "eigene"
    seefaehre().save(ziel / "seefaehre.png")
    alte_linse().save(ziel / "alte_linse.png")
    print("seefaehre.png, alte_linse.png geschrieben")


if __name__ == "__main__":
    main()
