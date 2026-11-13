"""Treppenöffnung mit Geländer für das Whitlock-Haus (Entwurf, mittel-4, Kartengutachten Akt 1).

Warum: Das Gutachten (Dokument 27, Befund 3) fand den Aufgang im Whitlock-Haus uneinheitlich: unten
eine Treppe, im Obergeschoss ein breiter Lauf an anderer Stelle, zum Dachboden eine Leiter.
KARTENREGELN 10.76 will auf jeder Geschosskarte denselben Aufgang an derselben Stelle. LimeZu hat
dafür das „Visible Upstairs System“: dieselbe Holztreppe wie im Erdgeschoss und Geländerteile, die
man um die Öffnung im oberen Geschoss setzt. Dieses Skript setzt beides zu einem Bild zusammen: eine
Öffnung im Boden, in der man die obersten Stufen sieht, oben und an den Seiten das Geländer, unten
offen (dort tritt man auf die Treppe).

- ``treppenschacht.png`` (48 × 48, 3 × 3 Kacheln).

Aufruf im privaten Repository: ``python treppenschacht.py <privat>`` schreibt nach ``spiel/eigene/``.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

BOGEN = "modern-interiors/1_Interiors/16x16/Theme_Sorter/17_Visibile_Upstairs_System_16x16.png"
# Im Bogen: Holztreppe (3 × 4 Kacheln) unten links, Geländerrahmen (3 × 3,5 Kacheln) rechts daneben.
TREPPE = (8, 288, 40, 352)
RAHMEN_OHNE_UNTERKANTE = (144, 288, 192, 330)
LOCH = (52, 40, 34, 255)
# Fläche zwischen den Seitenholmen unter dem oberen Geländer (im Ausschnitt des Rahmens).
INNEN = (9, 15, 38, 41)


def treppenschacht(privat: Path) -> Image.Image:
    bogen = Image.open(privat / BOGEN).convert("RGBA")
    bild = Image.new("RGBA", (48, 48))
    z = ImageDraw.Draw(bild)
    z.rectangle((8, 6, 39, 47), fill=LOCH)
    # Die oberen drei Viertel der Stufen, damit die Treppe nach unten wegzuführen scheint.
    stufen = bogen.crop(TREPPE).crop((0, 16, 32, 64))
    bild.alpha_composite(stufen, (8, 0))
    z.rectangle((8, 6, 39, 9), fill=LOCH)  # Schatten unter dem oberen Geländer
    rahmen = bogen.crop(RAHMEN_OHNE_UNTERKANTE)
    # Im Bogen liegen innerhalb des Rahmens zwei kleine Einzelteile; sie gehören nicht dazu.
    ImageDraw.Draw(rahmen).rectangle(INNEN, fill=(0, 0, 0, 0))
    bild.alpha_composite(rahmen, (0, 0))
    return bild


def main() -> None:
    privat = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    treppenschacht(privat).save(privat / "spiel" / "eigene" / "treppenschacht.png")
    print("Treppenschacht nach", privat / "spiel" / "eigene")


if __name__ == "__main__":
    main()
