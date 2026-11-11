"""Hängende Holzschilder mit Aufschrift für Hütten ohne Kennzeichen (mittel-2, 11.11.2026).

Warum: Gutachten Pinewood Camp, Punkt 4 und die Frage des Besuchers: „Welche Hütte ist das
Waschhaus?“ Sieben gleiche Blockhütten, keine mit Schild. Ein braunes Holzschild an zwei Haken,
wie das des Antiquariats (``schild_antiquariat.png``), sagt, was die Hütte ist. Die Schrift ist
die der Ladenschilder (``laeden_schilder.py``, 3 × 5 Pixel). Weitere Schilder: Eintrag in
``SCHILDER`` ergänzen.

Aufruf: ``python holzschilder.py <Pfad zum privaten Repository>``; schreibt je Eintrag
spiel/eigene/<name>.png (48 × 16). Braucht ``laeden_schilder.py`` im selben Ordner.
"""

import sys
from pathlib import Path

from laeden_schilder import SCHRIFT, breite
from PIL import Image, ImageDraw

BREITE, HOEHE = 48, 16
RAND = (58, 58, 80, 255)
HOLZ, HOLZ_HELL = (172, 118, 70, 255), (196, 144, 92, 255)
SCHRIFT_FARBE = (70, 44, 34, 255)
TAFEL_OBEN = 4  # darüber die zwei Haken
# Name der Bilddatei → Aufschrift
SCHILDER = {"schild_waschhaus": "WASCHHAUS"}


def schild(text: str) -> Image.Image:
    """Ein Holzschild: zwei Haken oben, Tafel mit hellem Oberrand, Aufschrift mittig."""
    bild = Image.new("RGBA", (BREITE, HOEHE))
    z = ImageDraw.Draw(bild)
    for x in (4, BREITE - 6):
        z.rectangle((x, 0, x + 1, TAFEL_OBEN), fill=RAND)
    z.rectangle((0, TAFEL_OBEN, BREITE - 1, HOEHE - 2), fill=HOLZ, outline=RAND)
    z.line((1, TAFEL_OBEN + 1, BREITE - 2, TAFEL_OBEN + 1), fill=HOLZ_HELL)
    x = (BREITE - breite(text)) // 2
    for zeichen in text:
        for r, reihe in enumerate(SCHRIFT[zeichen]):
            for s, p in enumerate(reihe):
                if p == "#":
                    z.point((x + s, TAFEL_OBEN + 3 + r), fill=SCHRIFT_FARBE)
        x += len(SCHRIFT[zeichen][0]) + 1
    return bild


def main() -> None:
    privat = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    for name, text in SCHILDER.items():
        schild(text).save(privat / "spiel" / "eigene" / f"{name}.png")
    print("Holzschilder nach", privat / "spiel" / "eigene")


if __name__ == "__main__":
    main()
