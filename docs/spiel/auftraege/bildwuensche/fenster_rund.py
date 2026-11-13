"""Rundes Giebelfenster für den Dachboden des Whitlock-Hauses (Entwurf, mittel-4, Runde 12).

Warum: Im Roman (Kap. 2 und 4) fällt das Licht durch ein rundes Fenster im Giebel auf den niedrigen
Tisch mit dem Brett; die erste Nacht spielt „unter dem runden Fenster“. Der Katalog hat runde
Fenster nur als Außenansicht mit Giebel (Villa_Round_Window). Ein Fenster hängt flach an der Wand,
deshalb selbst gezeichnet, im Stil von ``fenster_ahorn.png``.

- ``fenster_rund.png`` (32 × 32): Holzring mit Sprossenkreuz, dahinter Himmel und rotes Ahornlaub.
- ``lichtkegel.png`` (48 × 64, bis auf Tisch und Teppich): flacher, halb durchsichtiger Lichtkegel vom Fenster auf den Boden
  (unter Tisch und Teppich gezeichnet, ohne Kollision); der Staub (T8) tanzt darin.

Aufruf: ``python fenster_rund.py <zielordner>`` (im privaten Repository: spiel/eigene/).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

RAND = (58, 58, 80, 255)
HOLZ, HOLZ_HELL, HOLZ_DUNKEL = (176, 120, 70, 255), (206, 154, 96, 255), (120, 78, 44, 255)
HIMMEL, HIMMEL_HELL = (150, 196, 232, 255), (196, 224, 244, 255)
LAUB = ((196, 64, 40, 255), (226, 112, 48, 255), (240, 168, 64, 255), (160, 44, 36, 255))
MITTE, AUSSEN, INNEN = 15.5, 14, 10


def im_kreis(x: int, y: int, r: float) -> bool:
    return (x - MITTE) ** 2 + (y - MITTE) ** 2 <= r * r


def scheibe(x: int, y: int) -> tuple[int, int, int, int]:
    """Himmel mit Laub von oben rechts; ein heller Streifen als Spiegelung."""
    if (x + y) % 7 == 0 and x < MITTE and y < MITTE:
        return HIMMEL_HELL
    if x + (31 - y) > 36 and y < 20:
        return LAUB[(x * 3 + y * 5) % len(LAUB)]
    return HIMMEL


def fenster() -> Image.Image:
    bild = Image.new("RGBA", (32, 32))
    for y in range(32):
        for x in range(32):
            if not im_kreis(x, y, AUSSEN + 1):
                continue
            if not im_kreis(x, y, AUSSEN):
                farbe = RAND
            elif not im_kreis(x, y, INNEN + 1):
                farbe = HOLZ_HELL if y < MITTE else HOLZ if y < MITTE + 6 else HOLZ_DUNKEL
            elif not im_kreis(x, y, INNEN):
                farbe = HOLZ_DUNKEL
            else:
                farbe = scheibe(x, y)
            bild.putpixel((x, y), farbe)
    z = ImageDraw.Draw(bild)
    z.line((15, 5, 15, 26), fill=HOLZ_DUNKEL)  # Sprossenkreuz
    z.line((16, 5, 16, 26), fill=HOLZ)
    z.line((5, 15, 26, 15), fill=HOLZ_DUNKEL)
    z.line((5, 16, 26, 16), fill=HOLZ)
    return bild


def lichtkegel() -> Image.Image:
    """Ein Kegel, oben schmal, unten breit; die Deckkraft nimmt nach unten ab."""
    bild = Image.new("RGBA", (48, 64))
    for y in range(64):
        halb = 8 + y * 15 // 63
        deckkraft = 90 - y * 50 // 63
        for x in range(24 - halb, 24 + halb):
            rand = min(x - (24 - halb), (24 + halb - 1) - x)
            bild.putpixel((x, y), (255, 236, 170, deckkraft if rand > 1 else deckkraft // 2))
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    fenster().save(ziel / "fenster_rund.png")
    lichtkegel().save(ziel / "lichtkegel.png")
    print("Rundes Fenster nach", ziel)


if __name__ == "__main__":
    main()
