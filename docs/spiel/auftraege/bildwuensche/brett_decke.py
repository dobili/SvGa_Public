"""Das alte Brett unter der staubfreien Decke (Entwurf, mittel-4, Kartengutachten Akt 1).

Warum: Auf dem Dachboden lag nur ein kleines leeres Reisebrett. Roman Kap. 2 und Kartenliste: unter
einer Decke liegt etwas Flaches, Schweres; die Decke ist das Einzige ohne Staub, leicht glänzend;
darunter steht die Stellung, die niemand anrührt. Das Gutachten (Dokument 27, Dachboden Befund 1)
verlangt ein eigenes, erkennbares Bild. Es liegt flach auf dem Tisch, deshalb selbst gezeichnet.

- ``brett_decke.png`` (22 × 14, seit 15.11.2026; vorher 24 × 16 ohne Tiefe): helles Tuch mit Falten
  über einem Holzbrett mit sichtbarer Stirn; rechts schaut eine Ecke des Bretts mit zwei Figuren
  heraus, das Tuch hängt vorn über die Kante, darunter ein Schatten.

Aufruf: ``python brett_decke.py <zielordner>`` (im privaten Repository: spiel/eigene/).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

RAND = (58, 58, 80, 255)
TUCH, TUCH_SCHATTEN, TUCH_TIEF = (232, 222, 200, 255), (200, 186, 160, 255), (168, 152, 128, 255)
GLANZ = (255, 252, 240, 255)
HOLZ, HOLZ_STIRN = (128, 84, 50, 255), (86, 54, 32, 255)
HELL, DUNKEL = (228, 214, 180, 255), (120, 84, 56, 255)
WEISS, SCHWARZ = (248, 246, 240, 255), (40, 36, 44, 255)
SCHATTEN = (20, 14, 10, 90)
BREITE, HOEHE = 22, 14


def _brett(z: ImageDraw.ImageDraw) -> None:
    """Das Brett: Oberseite (Reihen 1–8) und vorn die Stirn (Reihen 9–10), darunter der Schatten."""
    z.rectangle((2, 11, 21, 12), fill=SCHATTEN)
    z.rectangle((1, 1, 19, 10), fill=RAND)
    z.rectangle((2, 2, 18, 8), fill=HOLZ)
    z.rectangle((2, 9, 18, 9), fill=HOLZ_STIRN)
    # Sichtbare Ecke rechts hinten: vier Felder, ein weißer und ein schwarzer Bauer mit Kopf.
    for reihe in range(3):
        for spalte in range(4):
            x, y = 11 + 2 * spalte, 2 + 2 * reihe
            z.rectangle((x, y, x + 1, y + 1), fill=HELL if (reihe + spalte) % 2 == 0 else DUNKEL)
    z.rectangle((13, 3, 13, 4), fill=WEISS)
    z.point((13, 2), fill=RAND)
    z.rectangle((17, 5, 17, 6), fill=SCHWARZ)
    z.point((17, 4), fill=RAND)


def _tuch(z: ImageDraw.ImageDraw) -> None:
    """Das Tuch liegt über dem größeren linken Teil und hängt vorn über die Stirn hinab."""
    z.polygon(((0, 0), (10, 0), (11, 4), (8, 9), (9, 13), (0, 13)), fill=RAND)
    z.polygon(((1, 1), (9, 1), (10, 4), (7, 9), (8, 12), (1, 12)), fill=TUCH)
    # Was über die Kante hängt, liegt im Schatten; Falten laufen schräg zur Kante.
    z.rectangle((1, 10, 7, 12), fill=TUCH_SCHATTEN)
    z.line((1, 12, 7, 12), fill=TUCH_TIEF)
    for x0, x1 in ((3, 2), (6, 5)):
        z.line((x0, 2, x1, 9), fill=TUCH_SCHATTEN)
        z.line((x1, 10, x1, 12), fill=TUCH_TIEF)
    z.line((2, 2, 5, 2), fill=GLANZ)
    z.point((2, 3), fill=GLANZ)


def brett_decke() -> Image.Image:
    """Das alte Brett unter der Decke (22 × 14), mit Tiefe: Brettstirn, überhängendes Tuch, Schatten.

    Warum neu (Kartennotiz des Autors, 15.11.2026, Dachboden: „Stil passt nicht; flach wie
    Abziehbild, ohne Tiefe“): Das alte Bild war eine Fläche ohne Kante. Jetzt hat das Brett eine
    dunkle Stirn, das Tuch hängt vorn darüber und wirft Falten, und unter allem liegt ein Schatten.
    Es ist kleiner, damit es ganz auf der Platte des runden Tischs liegt.
    """
    bild = Image.new("RGBA", (BREITE, HOEHE))
    z = ImageDraw.Draw(bild)
    _brett(z)
    _tuch(z)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    brett_decke().save(ziel / "brett_decke.png")
    print("Brett unter der Decke nach", ziel)


if __name__ == "__main__":
    main()
