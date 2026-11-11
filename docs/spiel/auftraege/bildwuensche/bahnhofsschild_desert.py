"""Stationsschild „DESERT SPRINGS“ für den alten Bahnhof (mittel-2, 11.11.2026).

Warum: Gutachten Desert Springs außen, Punkt 1 und die Frage des Besuchers: „Welches Haus ist der
Bahnhof?“ Das Bahnhofsgebäude trägt nur das braune Schild des Antiquariats; nichts sagt „Bahnhof“.
Ein Stationsschild auf zwei Pfosten am Bahnsteig, wie es an jeder Strecke steht (Vorbild
``schild_cedar_creek.png``), beantwortet die Frage: weiße Tafel mit dunklem Rand, der Ortsname in
zwei Zeilen. Die Schrift ist die der Ladenschilder (``laeden_schilder.py``, 3 × 5 Pixel).

Aufruf: ``python bahnhofsschild_desert.py <Pfad zum privaten Repository>``; schreibt
spiel/eigene/schild_desert_springs.png (48 × 32). Braucht ``laeden_schilder.py`` im selben Ordner.
"""

import sys
from pathlib import Path

from laeden_schilder import SCHRIFT, breite
from PIL import Image, ImageDraw

BREITE, HOEHE = 48, 32
RAND = (58, 58, 80, 255)
TAFEL = (238, 236, 226, 255)
SCHRIFT_FARBE = (58, 58, 80, 255)
PFOSTEN = (116, 82, 52, 255)
SCHATTEN = (0, 0, 0, 60)
ZEILEN = ("DESERT", "SPRINGS")
TAFEL_UNTEN = 18  # letzte Pixelreihe der Tafel; darunter stehen die Pfosten
ZEILENHOEHE = 7


def schreibe(z: ImageDraw.ImageDraw, text: str, y: int) -> None:
    """Eine Zeile mittig auf die Tafel."""
    x = (BREITE - breite(text)) // 2
    for zeichen in text:
        for r, reihe in enumerate(SCHRIFT[zeichen]):
            for s, p in enumerate(reihe):
                if p == "#":
                    z.point((x + s, y + r), fill=SCHRIFT_FARBE)
        x += len(SCHRIFT[zeichen][0]) + 1


def schild() -> Image.Image:
    """Das Stationsschild: Tafel oben, zwei Pfosten, ein Schatten am Fuß."""
    bild = Image.new("RGBA", (BREITE, HOEHE))
    z = ImageDraw.Draw(bild)
    for x in (6, BREITE - 9):
        z.rectangle((x, TAFEL_UNTEN, x + 2, HOEHE - 3), fill=PFOSTEN, outline=RAND)
        z.rectangle((x - 1, HOEHE - 2, x + 3, HOEHE - 1), fill=SCHATTEN)
    z.rectangle((1, 1, BREITE - 2, TAFEL_UNTEN), fill=TAFEL, outline=RAND)
    for i, text in enumerate(ZEILEN):
        schreibe(z, text, 4 + i * ZEILENHOEHE)
    return bild


def main() -> None:
    privat = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    ziel = privat / "spiel" / "eigene" / "schild_desert_springs.png"
    schild().save(ziel)
    print("Stationsschild nach", ziel)


if __name__ == "__main__":
    main()
