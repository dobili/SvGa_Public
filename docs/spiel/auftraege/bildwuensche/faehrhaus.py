"""Bildwunsch: hölzernes Fährhaus am Seeufer (spiel/eigene/faehrhaus.png), Entwurf von mittel-1.

Warum: Auf ``weg-ghost-capital-seeufer`` war das Fährhaus ein moderner Glasbau mit Flachdach auf
einem eckigen Vorsprung (variantenwahl.md, Mangel 2). Am Strand eines Sees passt ein kleines
Holzhaus mit Satteldach, Fahrkartenschalter und Uhr im Giebel besser; LimeZus Paket hat dafür nur
Stadtfassaden.

Bild: ``faehrhaus.png`` (96 × 112, 6 × 7 Kacheln): rotes Satteldach mit Uhr im Giebel, weiße
Bretterwand, links der Schalter mit blauem Schild und Markise, rechts die Tür, davor eine Stufe.
Kollision wie üblich ohne die oberste Kachelreihe.

Aufruf: ``python faehrhaus.py <Pfad zum privaten Repository>``. Nur PIL.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

KONTUR = (52, 40, 44, 255)
DACH, DACH_HELL, DACH_DUNKEL = (176, 64, 52, 255), (206, 92, 72, 255), (128, 44, 40, 255)
WAND, WAND_FUGE = (236, 230, 214, 255), (200, 192, 172, 255)
BLAU, GLAS, GLAS_HELL = (52, 92, 160, 255), (60, 84, 116, 255), (140, 176, 210, 255)
HOLZ, HOLZ_DUNKEL, STEIN = (140, 96, 58, 255), (100, 66, 40, 255), (150, 150, 156, 255)


def dach(z: ImageDraw.ImageDraw) -> None:
    """Satteldach von vorn: Giebeldreieck mit Ziegelreihen und runder Uhr."""
    z.polygon([(0, 52), (48, 6), (95, 52)], fill=KONTUR)
    z.polygon([(4, 50), (48, 10), (91, 50)], fill=DACH)
    for y in range(18, 50, 6):
        breite = (y - 10) * 44 // 40
        z.line((48 - breite, y, 48 + breite, y), fill=DACH_DUNKEL)
    z.line((48, 10, 4, 50), fill=DACH_HELL)
    z.ellipse((40, 22, 56, 38), fill=KONTUR)  # Uhr
    z.ellipse((42, 24, 54, 36), fill=WAND)
    z.line((48, 30, 48, 25), fill=KONTUR)
    z.line((48, 30, 52, 30), fill=KONTUR)


def wand(z: ImageDraw.ImageDraw) -> None:
    """Bretterwand mit Schalter (Markise, Schild) und Tür."""
    z.rectangle((6, 52, 89, 107), fill=KONTUR)
    z.rectangle((8, 52, 87, 105), fill=WAND)
    for y in range(57, 105, 5):
        z.line((8, y, 87, y), fill=WAND_FUGE)
    z.rectangle((12, 56, 49, 63), fill=BLAU)  # Schild über dem Schalter
    for x in range(16, 46, 5):
        z.point((x, 59), fill=WAND)
    for i, x in enumerate(range(12, 50, 6)):  # Markise
        z.rectangle((x, 64, x + 5, 69), fill=BLAU if i % 2 else WAND)
    z.rectangle((14, 70, 47, 89), fill=KONTUR)  # Schalterfenster
    z.rectangle((16, 72, 45, 87), fill=GLAS)
    z.line((18, 74, 18, 85), fill=GLAS_HELL)
    z.rectangle((12, 89, 49, 93), fill=HOLZ)  # Brett unter dem Schalter
    z.rectangle((58, 66, 81, 105), fill=KONTUR)  # Tür
    z.rectangle((60, 68, 79, 105), fill=HOLZ)
    z.rectangle((63, 72, 76, 82), fill=GLAS)
    z.point((76, 90), fill=HOLZ_DUNKEL)
    z.rectangle((54, 106, 85, 111), fill=STEIN)  # Stufe


def faehrhaus() -> Image.Image:
    bild = Image.new("RGBA", (96, 112))
    z = ImageDraw.Draw(bild)
    wand(z)
    dach(z)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1]) / "spiel" / "eigene"
    faehrhaus().save(ziel / "faehrhaus.png")
    print("faehrhaus.png geschrieben")


if __name__ == "__main__":
    main()
