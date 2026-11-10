"""Feldbahn im Steinbruch: schmales Gleis, Lore und Prellbock in derselben Spurweite (Entwurf, mittel-4).

Warum: In der Steinbruchgrube waren die Gleise viel breiter als die Loren, die Loren saßen auf einer
Schiene, ein Absperrschild stand statt eines Prellbocks (Notizen des Autors, Revision 2; allgemeiner
Punkt 19 „Spurweite passt zu den Loren“). Die gekauften Gleise sind Normalspur aus dem U-Bahn-Paket.
Hier eine Feldbahn mit 600 mm Spur in LimeZus Farben und dunklem Rand, alles auf eine Kachel genau:

- ``feldbahn_laengs.png`` (16 × 16): Gleis von Nord nach Süd, Schienen bei x 4 und x 11 (Spur 7 px),
  Schwellen quer alle 8 px.
- ``feldbahn_quer.png`` (16 × 16): dasselbe von West nach Ost, Schienen bei y 6 und y 13.
- ``lore_laengs.png`` (16 × 24): Kipplore aus Stahl auf dem Längsgleis, Räder genau auf den Schienen
  (x 4 und x 11), mit Bruchsteinen gefüllt.
- ``prellbock_feldbahn.png`` (16 × 16): Prellbock aus Holzbalken quer zum Längsgleis, mit Schwelle.

Aufruf: ``python feldbahn.py <zielordner>`` (im privaten Repository: spiel/eigene/).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

K = 16
RAND = (58, 58, 80, 255)
SCHIENE, SCHIENE_HELL = (120, 124, 138, 255), (176, 180, 192, 255)
SCHWELLE, SCHWELLE_DUNKEL = (122, 86, 58, 255), (88, 60, 42, 255)
STAHL, STAHL_HELL, STAHL_DUNKEL = (94, 100, 112, 255), (140, 146, 158, 255), (64, 68, 80, 255)
STEIN, STEIN_HELL = (150, 146, 140, 255), (196, 192, 184, 255)
HOLZ, HOLZ_HELL = (156, 104, 64, 255), (204, 148, 96, 255)
LINKS, RECHTS = 4, 11


def laengs() -> Image.Image:
    bild = Image.new("RGBA", (K, K))
    z = ImageDraw.Draw(bild)
    for y in (2, 10):
        z.rectangle((1, y, K - 2, y + 3), fill=SCHWELLE_DUNKEL)
        z.rectangle((1, y, K - 2, y + 2), fill=SCHWELLE)
    for x in (LINKS, RECHTS):
        z.line((x, 0, x, K - 1), fill=SCHIENE)
        z.line((x + 1, 0, x + 1, K - 1), fill=SCHIENE_HELL)
    return bild


def quer() -> Image.Image:
    return laengs().rotate(90, expand=False)


def lore() -> Image.Image:
    """Kipplore von oben schräg: Kasten 14 × 14 über den Rädern, oben Bruchsteine."""
    bild = Image.new("RGBA", (K, 24))
    z = ImageDraw.Draw(bild)
    for y in (6, 18):                                   # Räder auf den Schienen
        for x in (LINKS, RECHTS):
            z.rectangle((x - 1, y, x + 2, y + 4), fill=RAND)
    z.rectangle((1, 2, K - 2, 20), fill=RAND)
    z.rectangle((2, 3, K - 3, 19), fill=STAHL)
    z.line((2, 3, K - 3, 3), fill=STAHL_HELL)
    z.rectangle((2, 15, K - 3, 19), fill=STAHL_DUNKEL)
    for x, y in ((4, 5), (8, 6), (11, 5), (6, 9), (10, 10), (4, 12)):
        z.rectangle((x, y, x + 2, y + 2), fill=STEIN)
        z.point((x, y), fill=STEIN_HELL)
    return bild


def prellbock() -> Image.Image:
    bild = laengs()
    z = ImageDraw.Draw(bild)
    z.rectangle((1, 6, K - 2, 12), fill=RAND)
    z.rectangle((2, 7, K - 3, 11), fill=HOLZ)
    z.line((2, 7, K - 3, 7), fill=HOLZ_HELL)
    for x in (3, K - 5):
        z.rectangle((x, 4, x + 2, 13), fill=RAND)
        z.rectangle((x + 1, 5, x + 1, 12), fill=HOLZ_HELL)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    ziel.mkdir(parents=True, exist_ok=True)
    for name, bauer in (("feldbahn_laengs", laengs), ("feldbahn_quer", quer), ("lore_laengs", lore),
                        ("prellbock_feldbahn", prellbock)):
        bauer().save(ziel / f"{name}.png")
    print("Feldbahn nach", ziel)


if __name__ == "__main__":
    main()
