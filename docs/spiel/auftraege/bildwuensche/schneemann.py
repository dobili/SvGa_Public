"""Bildwunsch mittel-3 (Runde 8): Schneemann für die Altstadt von Silicon Bay im Winter.

Warum: Im Gutachten zur Altstadt bauen die Kinder „einen Schneemann im Park“, aber es gibt keinen;
im Paket ist keiner. Gezeichnet im Stil von LimeZu: dunkle Umrisslinie, zwei Weißtöne, schwarzer
Hut, Möhrennase, Knopfaugen, ein roter Schal; 16 × 32 Pixel (eine Kachel breit, zwei hoch).

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/schneemann.png.
Aufruf: python schneemann.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

UMRISS, WEISS, SCHATTEN = (60, 64, 84, 255), (244, 246, 250, 255), (196, 206, 222, 255)
SCHWARZ, MOEHRE, SCHAL = (34, 34, 42, 255), (232, 128, 40, 255), (196, 52, 52, 255)


def schneemann() -> Image.Image:
    """Zwei Kugeln, Hut, Schal, Gesicht und Knöpfe."""
    bild = Image.new("RGBA", (16, 32))
    z = ImageDraw.Draw(bild)
    z.ellipse((1, 15, 14, 30), fill=WEISS, outline=UMRISS)  # Bauch
    z.arc((2, 16, 13, 29), 20, 160, fill=SCHATTEN)
    z.ellipse((3, 6, 12, 16), fill=WEISS, outline=UMRISS)  # Kopf
    z.rectangle((4, 1, 11, 6), fill=SCHWARZ)  # Hut
    z.rectangle((2, 6, 13, 7), fill=SCHWARZ)
    z.point((6, 10), fill=SCHWARZ)
    z.point((9, 10), fill=SCHWARZ)
    z.rectangle((8, 11, 10, 12), fill=MOEHRE)
    z.rectangle((4, 15, 11, 16), fill=SCHAL)
    z.rectangle((9, 16, 10, 19), fill=SCHAL)
    for y in (20, 23, 26):
        z.point((7, y), fill=SCHWARZ)
    return bild


def main() -> None:
    privat = Path(sys.argv[1])
    schneemann().save(privat / "spiel" / "eigene" / "schneemann.png")


if __name__ == "__main__":
    main()
