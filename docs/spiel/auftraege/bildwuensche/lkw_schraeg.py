"""Bildwunsch: Sattelzug in unserer Ansicht, schräg von oben (spiel/eigene/), Entwurf von mittel-1.

Warum: Der Sattelzug vor der Tankstelle der Raststätte (``sattelzug_blau.png``) ist eine reine
Seitenansicht und wirkt flach (Revision 2 des Autors, 10.11.2026: „LKW ohne Tiefe“, KARTENREGELN
10.60). Die Autos des Katalogs zeigen von der Seite das Dach als große helle Fläche, darunter die
Seitenwand und einen weichen Schatten. Dieser Sattelzug folgt dem: Dach des Aufliegers und der
Kabine von oben, Seitenwand mit Rippen, Räder, Schatten unter dem Fahrzeug.

Bilder (Fahrtrichtung im Namen, Kabine vorn):
- ``lkw_links_blau.png``, ``lkw_links_rot.png`` (176 × 80): Kabine links.
- ``lkw_rechts_blau.png``, ``lkw_rechts_rot.png``: gespiegelt, Kabine rechts.
Kollision für die Möbelangabe: unterste drei Kachelreihen (``frei_unten`` nicht nötig; Standard
sperrt alles außer der obersten Reihe, das passt, weil das Dach oben liegt).

Aufruf: ``python lkw_schraeg.py <Pfad zum privaten Repository>``. Nur PIL.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

RAND = (58, 58, 80, 255)
SCHATTEN = (30, 34, 52, 90)
DACH, DACH_HELL = (226, 230, 236, 255), (246, 248, 250, 255)
WAND, WAND_DUNKEL = (180, 186, 196, 255), (138, 144, 158, 255)
SCHEIBE, SCHEIBE_HELL = (96, 150, 184, 255), (170, 214, 236, 255)
REIFEN, FELGE = (44, 44, 56, 255), (150, 150, 162, 255)
FARBEN = {
    "blau": ((60, 104, 196, 255), (110, 156, 236, 255)),
    "rot": ((196, 62, 62, 255), (236, 120, 110, 255)),
}
BREITE, HOEHE = 176, 80


def auflieger(z: ImageDraw.ImageDraw) -> None:
    """Kofferaufbau x 50–172: Dach 22 px tief (von oben), Seitenwand 30 px mit Rippen."""
    z.rectangle((50, 8, 172, 62), fill=RAND)
    z.rectangle((51, 9, 171, 30), fill=DACH)
    z.line((52, 10, 170, 10), fill=DACH_HELL)
    for x in range(60, 171, 16):
        z.line((x, 11, x, 29), fill=WAND)
    z.rectangle((51, 31, 171, 61), fill=WAND)
    z.line((51, 31, 171, 31), fill=DACH_HELL)
    for x in range(58, 171, 8):
        z.line((x, 33, x, 59), fill=WAND_DUNKEL)
    z.rectangle((51, 58, 171, 61), fill=WAND_DUNKEL)


def kabine(z: ImageDraw.ImageDraw, farbe: tuple, hell: tuple) -> None:
    """Kabine x 4–48: Dach von oben, Windschutzscheibe schräg, Seitenfenster, Tür."""
    z.polygon([(4, 34), (10, 12), (48, 12), (48, 64), (4, 64)], fill=RAND)
    z.polygon([(11, 13), (47, 13), (47, 28), (9, 28)], fill=hell)  # Dach
    z.line((12, 14, 46, 14), fill=DACH_HELL)
    z.polygon([(5, 35), (9, 29), (20, 29), (20, 40), (5, 40)], fill=SCHEIBE)  # Frontscheibe
    z.line((7, 34, 11, 30), fill=SCHEIBE_HELL)
    z.rectangle((22, 29, 46, 63), fill=farbe)
    z.rectangle((5, 41, 21, 63), fill=farbe)
    z.rectangle((24, 31, 36, 40), fill=SCHEIBE)  # Seitenfenster
    z.line((25, 32, 29, 32), fill=SCHEIBE_HELL)
    z.rectangle((24, 42, 37, 60), outline=RAND)  # Tür
    z.rectangle((34, 50, 35, 51), fill=RAND)
    z.rectangle((40, 4, 43, 13), fill=RAND)  # Auspuff
    z.rectangle((4, 56, 9, 60), fill=(240, 220, 120, 255))  # Scheinwerfer


def raeder(z: ImageDraw.ImageDraw) -> None:
    z.rectangle((4, 62, 172, 66), fill=RAND)
    for x in (18, 38, 120, 138, 156):
        z.ellipse((x - 8, 58, x + 8, 74), fill=REIFEN)
        z.ellipse((x - 4, 62, x + 4, 70), fill=FELGE)


def sattelzug(farbe: str) -> Image.Image:
    bild = Image.new("RGBA", (BREITE, HOEHE))
    z = ImageDraw.Draw(bild)
    z.ellipse((0, 66, BREITE - 1, HOEHE - 1), fill=SCHATTEN)
    auflieger(z)
    kabine(z, *FARBEN[farbe])
    raeder(z)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1]) / "spiel" / "eigene"
    for farbe in FARBEN:
        bild = sattelzug(farbe)
        bild.save(ziel / f"lkw_links_{farbe}.png")
        ImageOps.mirror(bild).save(ziel / f"lkw_rechts_{farbe}.png")
    print(f"{2 * len(FARBEN)} Bilder nach {ziel}")


if __name__ == "__main__":
    main()
