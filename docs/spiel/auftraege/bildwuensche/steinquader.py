"""Gesägte Granitquader für die Abbaustufe im Steinbruch (Entwurf, mittel-4).

Warum: Auf der Abbaustufe standen statt gesägter Blöcke Felsnadeln und graue Gitterstapel (Gutachten
Steinbruchgrube, 10.11.2026). Ein gesägter Quader in der Ansicht schräg von oben: helle Oberseite,
dunklere Vorderseite mit Sägespuren, Rand und Schatten wie bei LimeZu.

- ``granitquader.png`` (32 × 32): ein Block, 2 × 2 Kacheln.
- ``granitquader_stapel.png`` (32 × 48): zwei Blöcke übereinander, leicht versetzt.

Aufruf: ``python steinquader.py <zielordner>`` (im privaten Repository: spiel/eigene/).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

RAND = (58, 58, 80, 255)
SCHATTEN = (58, 58, 80, 90)
OBEN, OBEN_HELL = (178, 176, 172, 255), (206, 204, 200, 255)
VORN, VORN_DUNKEL = (138, 134, 132, 255), (112, 108, 108, 255)
KORN = (160, 156, 152, 255)


def quader(z: ImageDraw.ImageDraw, x: int, y: int, b: int = 30, oben: int = 12, vorn: int = 14) -> None:
    """Block mit Oberseite (``oben`` px) und Vorderseite (``vorn`` px) ab (x, y)."""
    z.rectangle((x + 2, y + oben + vorn - 1, x + b + 1, y + oben + vorn + 2), fill=SCHATTEN)
    z.rectangle((x, y, x + b - 1, y + oben + vorn - 1), fill=RAND)
    z.rectangle((x + 1, y + 1, x + b - 2, y + oben - 1), fill=OBEN)
    z.line((x + 1, y + 1, x + b - 2, y + 1), fill=OBEN_HELL)
    z.rectangle((x + 1, y + oben, x + b - 2, y + oben + vorn - 2), fill=VORN)
    for i in range(y + oben + 3, y + oben + vorn - 2, 4):  # Sägespuren
        z.line((x + 2, i, x + b - 3, i), fill=VORN_DUNKEL)
    for px, py in ((5, 4), (13, 7), (21, 3), (25, 8), (9, 9)):  # Körnung der Oberseite
        if px < b - 2 and py < oben - 1:
            z.point((x + px, y + py), fill=KORN)


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    ziel.mkdir(parents=True, exist_ok=True)
    einzel = Image.new("RGBA", (32, 32))
    quader(ImageDraw.Draw(einzel), 1, 3)
    einzel.save(ziel / "granitquader.png")
    stapel = Image.new("RGBA", (32, 48))
    z = ImageDraw.Draw(stapel)
    quader(z, 1, 17)
    quader(z, 3, 4, b=26, oben=10, vorn=12)
    stapel.save(ziel / "granitquader_stapel.png")
    print("Quader nach", ziel)


if __name__ == "__main__":
    main()
