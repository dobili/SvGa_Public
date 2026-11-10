"""Bildwunsch: Matschsaum an der Autobahn und Lieferroboter (spiel/eigene/), Entwurf von mittel-1.

Warum: Im zweiten Gutachten der Glasbrücke (``weg-ironwood-silicon-glasbruecke-2.md``) ist der
Schnitt von trockenem Asphalt zur weißen Wiese hart (Befund 1, „ein grauer Matschsaum würde
genügen“), und der Lieferroboter der Beschreibung fehlt (Befund 5): LimeZus Paket hat keinen
Roboter, und eine Belebung mit unbekannter Art wird nicht gezeichnet.

Bilder:

- ``matschsaum_links.png`` und ``matschsaum_rechts.png`` (je 16 × 384, 24 Reihen): grauer,
  zur Wiese hin ausfransender Schneematsch mit Spritzern; links liegt der Saum westlich der
  Fahrbahn (zur Fahrbahn rechts dicht), rechts gespiegelt.
- ``lieferroboter.png`` (16 × 16): kleiner weißer Kastenroboter auf sechs Rädern mit
  orangefarbenem Fähnchen, von schräg oben wie LimeZus Fahrzeuge.

Aufruf: ``python matschsaum.py <Pfad zum privaten Repository>``. Nur PIL.
"""

import random
import sys
from pathlib import Path

from PIL import Image, ImageDraw

MATSCH, MATSCH_HELL, SPRITZER = (122, 124, 130, 255), (168, 170, 176, 255), (96, 96, 102, 255)
KONTUR, WEISS, GRAU = (44, 48, 62, 255), (236, 240, 244, 255), (180, 186, 196, 255)
ORANGE, RAD = (232, 132, 44, 255), (36, 36, 42, 255)
HOEHE = 24 * 16


def matschsaum() -> Image.Image:
    """Saum für die Westseite: rechts dicht, nach links ausfransend; fest gesät, damit er gleich bleibt."""
    zufall = random.Random(4)
    bild = Image.new("RGBA", (16, HOEHE))
    for y in range(HOEHE):
        breite = 9 + zufall.randint(0, 4)
        for x in range(16 - breite, 16):
            farbe = MATSCH_HELL if x < 16 - breite + 2 else MATSCH
            bild.putpixel((x, y), farbe)
    for _ in range(90):
        x, y = zufall.randint(2, 15), zufall.randint(0, HOEHE - 1)
        bild.putpixel((x, y), SPRITZER)
    return bild


def lieferroboter() -> Image.Image:
    bild = Image.new("RGBA", (16, 16))
    z = ImageDraw.Draw(bild)
    z.line((11, 1, 11, 6), fill=KONTUR)  # Fahnenstange
    z.rectangle((12, 1, 14, 3), fill=ORANGE)
    z.rectangle((2, 5, 13, 13), fill=KONTUR)  # Kasten
    z.rectangle((3, 6, 12, 8), fill=WEISS)  # Deckel
    z.rectangle((3, 9, 12, 12), fill=GRAU)
    z.rectangle((5, 10, 10, 10), fill=KONTUR)  # Lichtleiste
    for x in (3, 7, 11):
        z.rectangle((x, 13, x + 1, 15), fill=RAD)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1]) / "spiel" / "eigene"
    links = matschsaum()
    links.save(ziel / "matschsaum_links.png")
    links.transpose(Image.Transpose.FLIP_LEFT_RIGHT).save(ziel / "matschsaum_rechts.png")
    lieferroboter().save(ziel / "lieferroboter.png")
    print("matschsaum_links.png, matschsaum_rechts.png, lieferroboter.png geschrieben")


if __name__ == "__main__":
    main()
