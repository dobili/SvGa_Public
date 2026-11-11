"""Bildwunsch mittel-3: Kaffeekiosk in Bechergestalt, kleiner (Campus Silicon Bay).

Warum: Gutachten silicon-bay-3-gemini-teil2-mittel-3-4.md, Campus Punkt 1: Der Kaffeebecher
(LimeZu, Kiosk_Coffee_Cup, 6 × 9 Kacheln) ist so hoch wie die Läden der Ladenzeile. Ein Kiosk soll
kleiner sein als ein Haus (10.64): hier auf zwei Drittel verkleinert (4 × 6 Kacheln), mit den
Farben des Originals und harter Kante, wie bei ``geysir_klein``.

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/kaffeebecher_klein.png (64 × 96).
Aufruf: python kaffeebecher_klein.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image

QUELLE = (
    "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/3_City_Props_Singles_16x16/"
    "ME_Singles_City_Props_16x16_Kiosk_Coffee_Cup.png"
)
GROESSE = (64, 96)
FARBEN = 48
DECKKRAFT = 110  # ab hier gilt ein gemittelter Pixel als Teil des Kiosks


def verkleinern(bild: Image.Image, groesse: tuple[int, int]) -> Image.Image:
    """Flächenmittel, dann Farben des Originals ohne Rastern, harte Kante im Alphakanal."""
    farben = bild.convert("RGB").quantize(colors=FARBEN)
    klein = bild.resize(groesse, Image.Resampling.BOX)
    alpha = klein.getchannel("A").point(lambda v: 255 if v > DECKKRAFT else 0)
    ergebnis = klein.convert("RGB").quantize(palette=farben, dither=Image.Dither.NONE).convert("RGBA")
    ergebnis.putalpha(alpha)
    return ergebnis


def main() -> None:
    privat = Path(sys.argv[1])
    kiosk = verkleinern(Image.open(privat / QUELLE).convert("RGBA"), GROESSE)
    kiosk.save(privat / "spiel" / "eigene" / "kaffeebecher_klein.png")
    print("kaffeebecher_klein.png geschrieben")


if __name__ == "__main__":
    main()
