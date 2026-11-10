"""Waren für den Bergladen von Summit City (Entwurf, mittel-4, Auftrag Runde 9).

Warum: Die Variantenwahl fand im Bergladen Supermarktregale mit bunten Dosen und Gießkannen; Seile,
Karabiner, Laternen, Wanderkarten und der Ständer mit Seilbahnkarten aus der Beschreibung fehlten.
Kein gekauftes Paket hat ein Bergsportregal.

- ``regal_bergsport.png`` (32 × 48): Holzregal mit drei Böden: aufgerollte Seile, Karabiner am
  Haken, zwei Laternen.
- ``kartenstaender.png`` (16 × 32): drehbarer Ständer mit bunten Seilbahn- und Wanderkarten.
- ``wanderkarte.png`` (24 × 16): aufgefaltete Wanderkarte mit Höhenlinien, für den Kartentisch.

Aufruf: ``python bergladen.py <privates Repository>`` (schreibt nach ``spiel/eigene/``).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

RAND = (58, 46, 40, 255)
HOLZ, HOLZ_HELL = (132, 86, 52, 255), (168, 116, 72, 255)
SEILE = [(200, 60, 50, 255), (60, 120, 200, 255), (230, 180, 40, 255)]
METALL, GLAS = (170, 176, 186, 255), (250, 214, 120, 255)


def regal() -> Image.Image:
    bild = Image.new("RGBA", (32, 48))
    z = ImageDraw.Draw(bild)
    z.rectangle((1, 2, 30, 46), fill=RAND)
    z.rectangle((2, 3, 29, 45), fill=HOLZ)
    for y in (15, 29, 43):  # Böden
        z.rectangle((2, y, 29, y + 2), fill=HOLZ_HELL)
    for i, farbe in enumerate(SEILE):  # oben: Seilrollen
        x = 4 + i * 9
        z.ellipse((x, 6, x + 7, 14), outline=farbe, width=2)
    for x in range(5, 28, 4):  # Mitte: Karabiner an einer Stange
        z.line((x, 18, x, 19), fill=METALL)
        z.arc((x - 1, 19, x + 2, 26), 0, 360, fill=METALL)
    for x in (6, 19):  # unten: Laternen
        z.rectangle((x, 34, x + 6, 42), fill=RAND)
        z.rectangle((x + 1, 35, x + 5, 41), fill=GLAS)
        z.line((x + 2, 32, x + 4, 32), fill=METALL)
    return bild


def kartenstaender() -> Image.Image:
    bild = Image.new("RGBA", (16, 32))
    z = ImageDraw.Draw(bild)
    z.rectangle((7, 4, 8, 30), fill=METALL)
    z.rectangle((3, 29, 12, 31), fill=RAND)
    farben = [(90, 160, 220, 255), (240, 240, 230, 255), (120, 180, 90, 255), (230, 120, 60, 255)]
    for r in range(3):
        for s, x in enumerate((2, 9)):
            y = 4 + r * 8
            z.rectangle((x, y, x + 4, y + 6), fill=RAND)
            z.rectangle((x + 1, y + 1, x + 3, y + 5), fill=farben[(r + s) % len(farben)])
    return bild


def wanderkarte() -> Image.Image:
    bild = Image.new("RGBA", (24, 16))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 1, 23, 15), fill=(236, 230, 200, 255))
    z.line((8, 1, 8, 15), fill=(200, 190, 160, 255))
    z.line((16, 1, 16, 15), fill=(200, 190, 160, 255))
    for i, (x, y) in enumerate(((5, 5), (13, 8), (19, 4))):  # Höhenlinien um drei Gipfel
        z.ellipse((x - 3 - i % 2, y - 2, x + 3, y + 3), outline=(160, 120, 80, 255))
        z.point((x, y), fill=(120, 80, 50, 255))
    z.line((2, 13, 7, 10, 12, 12, 20, 9), fill=(200, 60, 50, 255))  # Weg
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".") / "spiel" / "eigene"
    regal().save(ziel / "regal_bergsport.png")
    kartenstaender().save(ziel / "kartenstaender.png")
    wanderkarte().save(ziel / "wanderkarte.png")
    print("Bergladen nach", ziel)


if __name__ == "__main__":
    main()
