"""Bildwunsch: Münzfernglas und Bullaugen für die Küstenfähre (spiel/eigene/), Entwurf von mittel-1.

Warum: Im Gutachten ``gutachten/weg-silicon-delacroix-faehre-2.md`` sind die Münzferngläser an der
Reling nicht zu erkennen (LimeZus Fernglas ist ein Handfernglas von einer Kachel, Befund 2), und die
Bordwand ist ein heller Streifen ohne Bullaugen (Befund 3). LimeZus Paket hat weder ein
Aussichtsfernrohr auf Ständer noch Bullaugen für die schmale Bordwand der Draufsicht.

Bilder:

- ``muenzfernglas.png`` (16 × 32): Aussichtsfernglas auf einem Ständer mit Fußplatte, blauer Kopf
  mit zwei Rohren und dunklen Linsen, darunter der Münzkasten mit goldenem Schlitz.
- ``bullauge_links.png``, ``bullauge_rechts.png`` (16 × 16): ein dunkler Ring mit Glas, drei Pixel
  breit, genau auf dem weißen Streifen der Bordwand (``wasser_rumpf``): links in den Spalten
  12–14 der Wasserkachel neben dem Deck, rechts gespiegelt.

Aufruf: ``python faehre_deck.py <Pfad zum privaten Repository>``. Nur PIL.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

KONTUR, GRAU, GRAU_HELL = (40, 46, 66, 255), (120, 128, 146, 255), (176, 184, 200, 255)
BLAU, BLAU_HELL, GLAS = (58, 104, 176, 255), (110, 156, 216, 255), (150, 206, 232, 255)
GOLD, SCHATTEN = (222, 178, 60, 255), (0, 0, 0, 70)
# Der weiße Streifen der Bordwand liegt in der linken Wasserkachel in den Spalten 12 bis 14.
BORDWAND_LINKS = 12


def muenzfernglas() -> Image.Image:
    bild = Image.new("RGBA", (16, 32))
    z = ImageDraw.Draw(bild)
    z.ellipse((3, 27, 12, 31), fill=SCHATTEN)
    z.rectangle((4, 26, 11, 29), fill=KONTUR)  # Fußplatte
    z.rectangle((5, 27, 10, 28), fill=GRAU)
    z.rectangle((6, 14, 9, 26), fill=KONTUR)  # Ständer
    z.rectangle((7, 15, 8, 26), fill=GRAU_HELL)
    z.rectangle((5, 13, 10, 19), fill=KONTUR)  # Münzkasten
    z.rectangle((6, 14, 9, 18), fill=GRAU)
    z.line((7, 16, 8, 16), fill=GOLD)
    z.rectangle((1, 4, 14, 12), fill=KONTUR)  # Kopf mit zwei Rohren
    z.rectangle((2, 5, 13, 11), fill=BLAU)
    z.line((2, 5, 13, 5), fill=BLAU_HELL)
    z.line((7, 5, 8, 11), fill=KONTUR)
    for x in (3, 10):  # Linsen nach vorn
        z.rectangle((x, 8, x + 2, 10), fill=KONTUR)
        z.point((x + 1, 9), fill=GLAS)
    return bild


def bullauge(links: bool) -> Image.Image:
    bild = Image.new("RGBA", (16, 16))
    z = ImageDraw.Draw(bild)
    x = BORDWAND_LINKS if links else 16 - BORDWAND_LINKS - 3
    z.rectangle((x, 6, x + 2, 8), fill=KONTUR)
    z.point((x + 1, 7), fill=GLAS)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1]) / "spiel" / "eigene"
    muenzfernglas().save(ziel / "muenzfernglas.png")
    bullauge(True).save(ziel / "bullauge_links.png")
    bullauge(False).save(ziel / "bullauge_rechts.png")
    print("muenzfernglas.png, bullauge_links.png, bullauge_rechts.png geschrieben")


if __name__ == "__main__":
    main()
