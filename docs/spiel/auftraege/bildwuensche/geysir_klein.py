"""Bildwunsch mittel-3 (Runde 9): kleiner Geysirkegel für das Geysirbecken (Weg 8).

Warum: Das Gutachten (mittel-3-runde9-2.md, Geysirbecken Punkt 2) fand über zwanzig gleiche Kegel:
ein Bild in gleicher Größe mit gleichem Dampf. Zwei Größen brechen das Muster. Der kleine Kegel
entsteht aus ``geysir.png`` (48 × 64, ``werkzeuge/praerie.py``): mit Flächenmittel auf zwei
Drittel verkleinert und auf die Farben des Originals zurückgesetzt, damit die Pixelkanten scharf
bleiben; die Fontäne ist dadurch niedriger.

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/geysir_klein.png (32 × 48, Kegel
32 × 43, unten bündig).
Aufruf: python geysir_klein.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image

LEINWAND = (32, 48)
GROESSE = (32, 43)
DECKKRAFT = 110  # ab hier gilt ein gemittelter Pixel als Teil des Kegels


def verkleinern(bild: Image.Image, groesse: tuple[int, int]) -> Image.Image:
    """Flächenmittel, dann Farben des Originals ohne Rastern, harte Kante im Alphakanal."""
    farben = bild.convert("RGB").quantize(colors=24)
    klein = bild.resize(groesse, Image.Resampling.BOX)
    alpha = klein.getchannel("A").point(lambda v: 255 if v > DECKKRAFT else 0)
    ergebnis = klein.convert("RGB").quantize(palette=farben, dither=Image.Dither.NONE).convert("RGBA")
    ergebnis.putalpha(alpha)
    return ergebnis


def main() -> None:
    eigene = Path(sys.argv[1]) / "spiel" / "eigene"
    kegel = verkleinern(Image.open(eigene / "geysir.png").convert("RGBA"), GROESSE)
    leinwand = Image.new("RGBA", LEINWAND)
    leinwand.alpha_composite(kegel, (0, LEINWAND[1] - kegel.height))
    leinwand.save(eigene / "geysir_klein.png")
    print("geysir_klein.png geschrieben")


if __name__ == "__main__":
    main()
