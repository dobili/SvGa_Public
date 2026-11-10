"""Vitrinen mit lesbaren Ausstellungsstücken für das Heimatmuseum Ironwood (Entwurf, mittel-4).

Warum: Das Gutachten (Runde 8, zweite Prüfung) fand in allen Vitrinen des Pakets Knochen, Muscheln
oder leere Bretter; die Zeitung von 1858, das freie Fach für Brief und Umschlag und der Glasfunke
waren nicht zu erkennen. Ein Heimatmuseum im Bahnhof zeigt Zeitung, Laterne, Werkzeug.

Je 32 × 48, Holzsockel, Glaskasten mit Lichtreflex, darin ein Stück:
- ``vitrine_zeitung.png``: aufgeschlagene Zeitung mit Spalten und Schlagzeile (1858);
- ``vitrine_laterne.png``: alte Eisenbahnlaterne mit rotem Glas;
- ``vitrine_werkzeug.png``: Hammer und Zange aus dem Werk;
- ``vitrine_glasfunke.png``: ein leuchtender Glassplitter auf Samt (der Glasfunke);
- ``vitrine_leer.png``: Samt mit einem leeren, beschrifteten Fach (für Brief und Umschlag).

Aufruf: ``python museum_vitrinen.py <privates Repository>`` (schreibt nach ``spiel/eigene/``).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

RAND, HOLZ, HOLZ_HELL = (58, 44, 40, 255), (122, 80, 50, 255), (160, 110, 70, 255)
GLAS, REFLEX, SAMT = (196, 222, 230, 255), (240, 250, 255, 255), (120, 40, 50, 255)


def gehaeuse() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    bild = Image.new("RGBA", (32, 48))
    z = ImageDraw.Draw(bild)
    z.rectangle((2, 30, 29, 46), fill=RAND)
    z.rectangle((3, 31, 28, 45), fill=HOLZ)
    z.line((4, 33, 27, 33), fill=HOLZ_HELL)
    z.rectangle((2, 6, 29, 30), fill=RAND)
    z.rectangle((3, 7, 28, 29), fill=GLAS)
    z.rectangle((4, 20, 27, 29), fill=SAMT)
    return bild, z


def glanz(z: ImageDraw.ImageDraw) -> None:
    z.line((5, 9, 9, 9), fill=REFLEX)
    z.line((5, 10, 7, 10), fill=REFLEX)


def zeitung() -> Image.Image:
    bild, z = gehaeuse()
    z.rectangle((7, 16, 24, 27), fill=(236, 230, 210, 255), outline=(150, 140, 120, 255))
    z.line((9, 18, 22, 18), fill=(40, 40, 40, 255))
    for x in (9, 16):
        for y in range(21, 26, 2):
            z.line((x, y, x + 5, y), fill=(130, 125, 115, 255))
    glanz(z)
    return bild


def laterne() -> Image.Image:
    bild, z = gehaeuse()
    z.rectangle((12, 14, 19, 26), fill=(50, 50, 60, 255))
    z.rectangle((13, 17, 18, 23), fill=(210, 60, 50, 255))
    z.line((14, 11, 17, 11), fill=(50, 50, 60, 255))
    z.line((15, 11, 15, 14), fill=(50, 50, 60, 255))
    glanz(z)
    return bild


def werkzeug() -> Image.Image:
    bild, z = gehaeuse()
    z.line((8, 26, 16, 18), fill=(140, 90, 50, 255), width=2)
    z.rectangle((14, 15, 19, 18), fill=(110, 110, 120, 255))
    z.line((19, 26, 24, 19), fill=(110, 110, 120, 255), width=2)
    z.line((24, 26, 19, 19), fill=(110, 110, 120, 255), width=2)
    glanz(z)
    return bild


def glasfunke() -> Image.Image:
    bild, z = gehaeuse()
    z.polygon(
        [(16, 15), (20, 21), (16, 26), (12, 21)], fill=(150, 230, 250, 255), outline=(60, 120, 160, 255)
    )
    for x, y in ((10, 16), (22, 16), (21, 25), (11, 25)):
        z.point((x, y), fill=(255, 255, 200, 255))
    glanz(z)
    return bild


def leer() -> Image.Image:
    bild, z = gehaeuse()
    z.rectangle((9, 19, 22, 26), outline=(200, 170, 110, 255))
    z.line((11, 28, 20, 28), fill=(236, 230, 210, 255))
    glanz(z)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".") / "spiel" / "eigene"
    for name, bild in (
        ("zeitung", zeitung()),
        ("laterne", laterne()),
        ("werkzeug", werkzeug()),
        ("glasfunke", glasfunke()),
        ("leer", leer()),
    ):
        bild.save(ziel / f"vitrine_{name}.png")
    print("Museumsvitrinen nach", ziel)


if __name__ == "__main__":
    main()
