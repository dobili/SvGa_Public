"""Bildwunsch: Gartenhaus und Bootsschuppen in Menschengröße (spiel/eigene/), Entwurf von mittel-1.

Warum: Die kleine Holzkiste aus LimeZus Garten (``*_Wood_Storage``, 48 × 64) hat eine Tür mit rundem
Einschlupfloch; der Gutachter sah darin auf acht Karten eine Hundehütte, obwohl sie als Schuppen,
Gartenhaus, Pegelhaus, Fährhaus und Bootsschuppen dient (Gutachten Runde 8, Punkt h). Der Katalog
hat keinen kleinen Schuppen mit Menschentür. Diese Bilder haben dieselbe Größe (48 × 64), damit in
den Szenen nur die Bildquelle getauscht wird: Satteldach schräg von oben, Bretterwand, eine Tür
16 × 26 px mit Rahmen und Klinke (Tür x 16–31, KARTENREGELN 10.54), daneben ein Fenster.

Bilder (48 × 64):
- ``gartenhaus_braun``, ``gartenhaus_blau``, ``gartenhaus_rot``, ``gartenhaus_weiss``: Gartenhaus,
  Schuppen, Pegelhaus.
- ``bootsschuppen``: breites Brettertor über die ganze Front (zwei Flügel), Rettungsring an der Wand.

Aufruf: ``python gartenhaus.py <Pfad zum privaten Repository>``. Nur PIL.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

RAND = (58, 58, 80, 255)
SCHATTEN = (58, 58, 80, 90)
GLAS, GLAS_HELL = (120, 170, 200, 255), (200, 228, 240, 255)
DACH, DACH_HELL, DACH_DUNKEL = (120, 64, 52, 255), (156, 90, 70, 255), (92, 46, 40, 255)
# Wandfarbe (Grund, hell, dunkel) je Fassung
FARBEN = {
    "braun": ((168, 112, 66, 255), (200, 146, 94, 255), (120, 78, 46, 255)),
    "blau": ((92, 132, 176, 255), (130, 168, 206, 255), (62, 94, 132, 255)),
    "rot": ((170, 70, 62, 255), (204, 104, 90, 255), (122, 48, 44, 255)),
    "weiss": ((224, 222, 214, 255), (246, 244, 238, 255), (176, 174, 168, 255)),
}
B, H = 48, 64


def dach(z: ImageDraw.ImageDraw) -> None:
    """Satteldach von schräg oben: First oben, Schindelreihen, Traufe ragt seitlich über."""
    z.polygon([(1, 26), (8, 4), (39, 4), (46, 26)], fill=RAND)
    z.polygon([(3, 25), (9, 6), (38, 6), (44, 25)], fill=DACH)
    for y in range(9, 25, 4):
        z.line((4 + (25 - y) // 3, y, 43 - (25 - y) // 3, y), fill=DACH_DUNKEL)
    z.line((10, 6, 37, 6), fill=DACH_HELL)
    z.rectangle((1, 25, 46, 27), fill=DACH_DUNKEL)


def wand(z: ImageDraw.ImageDraw, farbe: tuple) -> None:
    grund, hell, dunkel = farbe
    z.rectangle((4, 27, 43, 60), fill=RAND)
    z.rectangle((5, 28, 42, 59), fill=grund)
    for x in range(8, 42, 5):
        z.line((x, 28, x, 59), fill=dunkel)
    z.line((5, 28, 42, 28), fill=hell)


def tuer(z: ImageDraw.ImageDraw, farbe: tuple) -> None:
    """Menschentür x 16–31, y 33–59, mit Rahmen, Füllung und Klinke."""
    _, hell, dunkel = farbe
    z.rectangle((16, 33, 31, 59), fill=RAND)
    z.rectangle((17, 34, 30, 59), fill=dunkel)
    z.rectangle((19, 36, 28, 45), outline=hell)
    z.rectangle((19, 48, 28, 57), outline=hell)
    z.rectangle((27, 46, 28, 47), fill=(230, 210, 120, 255))


def fenster(z: ImageDraw.ImageDraw, x: int) -> None:
    z.rectangle((x, 34, x + 9, 43), fill=RAND)
    z.rectangle((x + 1, 35, x + 8, 42), fill=GLAS)
    z.line((x + 1, 38, x + 8, 38), fill=RAND)
    z.line((x + 4, 35, x + 4, 42), fill=RAND)
    z.point((x + 2, 36), fill=GLAS_HELL)


def sockel(z: ImageDraw.ImageDraw) -> None:
    z.rectangle((3, 60, 44, 61), fill=RAND)
    z.rectangle((2, 62, 45, 63), fill=SCHATTEN)


def gartenhaus(farbe: tuple) -> Image.Image:
    bild = Image.new("RGBA", (B, H))
    z = ImageDraw.Draw(bild)
    wand(z, farbe)
    dach(z)
    tuer(z, farbe)
    fenster(z, 33)
    sockel(z)
    return bild


def bootsschuppen() -> Image.Image:
    """Brettertor mit zwei Flügeln über fast die ganze Front, Rettungsring links oben."""
    farbe = FARBEN["braun"]
    _, hell, dunkel = farbe
    bild = Image.new("RGBA", (B, H))
    z = ImageDraw.Draw(bild)
    wand(z, farbe)
    dach(z)
    z.rectangle((8, 32, 39, 59), fill=RAND)
    for x0 in (9, 24):
        z.rectangle((x0, 33, x0 + 14, 59), fill=dunkel)
        for x in range(x0 + 3, x0 + 14, 4):
            z.line((x, 33, x, 59), fill=farbe[0])
        z.line((x0, 45, x0 + 14, 45), fill=hell)
    z.line((23, 33, 23, 59), fill=RAND)
    z.ellipse((3, 28, 9, 34), fill=(232, 80, 70, 255))
    z.ellipse((5, 30, 7, 32), fill=farbe[0])
    sockel(z)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1]) / "spiel" / "eigene"
    for name, farbe in FARBEN.items():
        gartenhaus(farbe).save(ziel / f"gartenhaus_{name}.png")
    bootsschuppen().save(ziel / "bootsschuppen.png")
    print(f"{len(FARBEN) + 1} Bilder nach {ziel}")


if __name__ == "__main__":
    main()
