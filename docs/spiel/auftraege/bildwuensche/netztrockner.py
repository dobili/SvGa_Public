"""Bildwunsch mittel-3 (Runde 9): Netztrockner für den Dorfplatz der Pelikaninsel.

Warum: Das Gutachten las das bisherige Netzgestell als „Zaunstück“: zwei senkrechte Pfosten mit
einem flachen Netzfeld dazwischen sehen aus wie ein Gatter. Fischer trocknen Netze über einer
Stange auf zwei Böcken; das Netz hängt in einem Bogen durch, an der Oberleine sitzen Schwimmer, am
Boden liegt der Rest des Netzes in Falten. Dieses Bild zeichnet genau das im Stil von LimeZu
(dunkle Umrisslinie, Holz in zwei Tönen), 48 × 32 Pixel (3 × 2 Kacheln).

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/netztrockner.png.
Aufruf: python netztrockner.py /home/user/schach-abenteuer-inhalte
"""

import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw

UMRISS = (52, 44, 48, 255)
HOLZ, HOLZ_DUNKEL = (150, 104, 66, 255), (110, 74, 48, 255)
NETZ, NETZ_HELL = (64, 110, 110, 255), (104, 156, 150, 255)
SCHWIMMER = (232, 128, 48, 255)
SCHATTEN = (0, 0, 0, 50)
STANGE_Y = 6


def bock(z: ImageDraw.ImageDraw, x: int) -> None:
    """Ein Bock aus zwei gekreuzten Beinen; die Stange liegt in der Gabel."""
    z.line([(x - 4, 30), (x + 3, STANGE_Y - 2)], fill=UMRISS, width=3)
    z.line([(x + 4, 30), (x - 3, STANGE_Y - 2)], fill=UMRISS, width=3)
    z.line([(x - 4, 29), (x + 3, STANGE_Y - 1)], fill=HOLZ)
    z.line([(x + 4, 29), (x - 3, STANGE_Y - 1)], fill=HOLZ_DUNKEL)


def netz(z: ImageDraw.ImageDraw) -> None:
    """Durchhängendes Netz mit Rautenmaschen und Schwimmern an der Oberleine."""
    links, rechts = 8, 40
    for x in range(links, rechts + 1):
        t = (x - links) / (rechts - links)
        unten = STANGE_Y + 12 + round(8 * math.sin(math.pi * t))
        for y in range(STANGE_Y + 1, unten + 1):
            if (x + y) % 4 == 0 or (x - y) % 4 == 0:  # nur die Maschen, dazwischen frei
                z.point((x, y), fill=NETZ_HELL if y < unten - 2 else NETZ)
        z.point((x, unten), fill=NETZ)
    for x in range(links + 2, rechts, 6):
        z.rectangle((x, STANGE_Y + 1, x + 2, STANGE_Y + 3), fill=SCHWIMMER, outline=UMRISS)


def falten(z: ImageDraw.ImageDraw) -> None:
    """Der Rest des Netzes in Falten am Boden unter dem Bogen."""
    z.ellipse((10, 26, 38, 31), fill=SCHATTEN)
    for x0 in (14, 22, 30):
        z.arc((x0 - 4, 24, x0 + 4, 30), 180, 360, fill=NETZ, width=2)


def netztrockner() -> Image.Image:
    bild = Image.new("RGBA", (48, 32))
    z = ImageDraw.Draw(bild)
    falten(z)
    netz(z)
    z.line([(2, STANGE_Y), (46, STANGE_Y)], fill=UMRISS, width=3)  # Stange
    z.line([(2, STANGE_Y - 1), (46, STANGE_Y - 1)], fill=HOLZ)
    bock(z, 6)
    bock(z, 42)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1]) / "spiel" / "eigene" / "netztrockner.png"
    netztrockner().save(ziel)
    print("netztrockner.png geschrieben")


if __name__ == "__main__":
    main()
