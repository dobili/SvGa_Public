"""Offener Kuppelspalt mit Nachthimmel für die Sternwarte (Entwurf, mittel-4, Gutachten Kuppel).

Warum: Der Gutachter sah den Kuppelspalt weiter als gewöhnliches Fenster. Das Teleskop zeigt auf die
Nordwand; dort muss man den offenen Spalt der Kuppel und den Himmel dahinter erkennen.

- ``kuppelspalt.png`` (32 × 32): senkrechter, oben gerundeter Spalt in der Wand, rostige
  Schienen links und rechts, dahinter nachtschwarzer Himmel mit Sternen und einem hellen Stern.

Aufruf: ``python kuppelspalt.py <privates Repository>`` (schreibt nach ``spiel/eigene/``).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

RAND, ROST, ROST_HELL = (40, 34, 44, 255), (132, 70, 44, 255), (176, 104, 60, 255)
HIMMEL, HIMMEL_TIEF, STERN, HELL = (
    (16, 22, 52, 255),
    (8, 10, 30, 255),
    (220, 226, 250, 255),
    (255, 244, 190, 255),
)
STERNE = ((13, 6), (18, 9), (15, 13), (19, 17), (12, 19), (17, 23), (14, 27))


def kuppelspalt() -> Image.Image:
    bild = Image.new("RGBA", (32, 32))
    z = ImageDraw.Draw(bild)
    z.rounded_rectangle((7, 1, 24, 31), radius=6, fill=RAND)  # Laibung
    z.rectangle((8, 3, 10, 31), fill=ROST)  # Schienen der Spaltklappe
    z.rectangle((21, 3, 23, 31), fill=ROST)
    z.line((9, 4, 9, 30), fill=ROST_HELL)
    z.line((22, 4, 22, 30), fill=ROST_HELL)
    z.rounded_rectangle((11, 2, 20, 31), radius=4, fill=HIMMEL)  # offener Himmel
    z.rectangle((11, 20, 20, 31), fill=HIMMEL_TIEF)
    for x, y in STERNE:
        z.point((x, y), fill=STERN)
    z.point((16, 11), fill=HELL)  # heller Stern mit Kreuz
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        z.point((16 + dx, 11 + dy), fill=STERN)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".") / "spiel" / "eigene"
    kuppelspalt().save(ziel / "kuppelspalt.png")
    print("Kuppelspalt nach", ziel)


if __name__ == "__main__":
    main()
