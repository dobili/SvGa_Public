"""Clubbrett mit Radiergummi statt der schwarzen Dame (Entwurf, mittel-4, Kartengutachten Akt 1).

Warum: Im Clubraum fehlt an einem Brett die schwarze Dame; auf d8 steht ein Radiergummi (Roman
Kap. 5, Ink ``ansehen-maple-falls.brett_ohne_dame``). Das alte Bild zeigte eine fehlende weiße Figur
und daneben einen Zettel mit Fragezeichen (Dokument 27, Clubraum Befund 1). Ein Brett mit Figuren
liegt flach auf dem Tisch, deshalb selbst gezeichnet; abgeleitet aus ``schachbrett_klein_figuren.png``.

- ``schachbrett_klein_radiergummi.png`` (12 × 9; bis 15.11.2026 ``brett_radiergummi.png``): seit der Kartennotiz vom 15.11.2026 genau das Clubbrett der
  anderen Tische, nur mit dem Radiergummi auf dem Feld der schwarzen Dame (vorher 16 × 12 und anders
  gezeichnet, der Autor hielt es für ein fremdes Brett).

Aufruf: ``python brett_radiergummi.py <zielordner>`` (im privaten Repository: spiel/eigene/, dort liegt
auch ``schachbrett_klein_figuren.png``).
"""

import sys
from pathlib import Path

from PIL import Image

ROSA, BLAU = (236, 140, 160, 255), (90, 130, 210, 255)
# Im Clubbrett (12 × 9) steht die schwarze Dame auf Pixel (5, 2): mittlere schwarze Figur.
DAME = (5, 2)


def brett_radiergummi(ziel: Path) -> Image.Image:
    """Das Clubbrett aus ``schachbrett_klein_figuren.png`` mit Radiergummi statt schwarzer Dame.

    Warum so (Kartennotiz des Autors, 15.11.2026, Clubraum: „Was ist das hier? Ein Schachbrett? Wenn
    ja, warum ist es ein anderes als auf den anderen Tischen?“): Das Brett ist dasselbe wie auf allen
    Clubtischen, nur liegt auf d8 der rosa-blaue Radiergummi (zwei Pixel quer). Was fehlt, erzählt der
    Text beim Ansehen; das Bild soll nicht nach einem fremden Brett aussehen.
    """
    bild = Image.open(ziel / "schachbrett_klein_figuren.png").convert("RGBA")
    x, y = DAME
    bild.putpixel((x, y), ROSA)
    bild.putpixel((x + 1, y), BLAU)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    brett_radiergummi(ziel).save(ziel / "schachbrett_klein_radiergummi.png")
    print("Brett mit Radiergummi nach", ziel)


if __name__ == "__main__":
    main()
