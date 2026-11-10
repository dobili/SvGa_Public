"""Bildwunsch mittel-3 (Runde 9): Bisons in passender Größe für das Geysirbecken (Weg 8).

Warum: Das Gutachten zum Geysirbecken fand die Bisons „größer als das Ranger-Haus breit ist“. Ein
Bison ist etwa drei Meter lang, das Ranger-Haus rund acht; bei 6 Kacheln Hausbreite passen also
gut 2,5 Kacheln Bison (KARTENREGELN 10.64, Größen von Fahrzeugen sinngemäß für Tiere). Die
vorhandenen Bilder ``bison_rechts.png`` (64 × 48) und ``bison_liegend.png`` (64 × 32) aus
``werkzeuge/praerie.py`` werden mit Flächenmittel verkleinert und danach wieder auf die Farben des
Originals gesetzt, damit die Pixelkanten scharf bleiben und keine Mischfarben entstehen.

Runde 9, drittes Gutachten: Mit 40 Pixeln war der Bison so klein wie die Kuh der App; ein Bison ist
größer als ein Rind. Jetzt 52 Pixel lang (gut drei Kacheln), immer noch schmaler als das Ranger-Haus.

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/bison_klein_rechts.png (64 × 48,
Tier 52 × 39) und bison_klein_liegend.png (64 × 48, Tier 52 × 26), jeweils unten bündig.
Aufruf: python bison_klein.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image

LEINWAND = (64, 48)
DECKKRAFT = 110  # ab hier gilt ein gemittelter Pixel als Teil des Tiers


def verkleinern(bild: Image.Image, groesse: tuple[int, int]) -> Image.Image:
    """Flächenmittel, dann Farben des Originals ohne Rastern, harte Kante im Alphakanal."""
    farben = bild.convert("RGB").quantize(colors=24)
    klein = bild.resize(groesse, Image.Resampling.BOX)
    alpha = klein.getchannel("A").point(lambda v: 255 if v > DECKKRAFT else 0)
    ergebnis = klein.convert("RGB").quantize(palette=farben, dither=Image.Dither.NONE).convert("RGBA")
    ergebnis.putalpha(alpha)
    return ergebnis


def auf_leinwand(tier: Image.Image) -> Image.Image:
    """Mittig und unten bündig auf 4 × 3 Kacheln."""
    leinwand = Image.new("RGBA", LEINWAND)
    leinwand.alpha_composite(tier, ((LEINWAND[0] - tier.width) // 2, LEINWAND[1] - tier.height))
    return leinwand


def main() -> None:
    eigene = Path(sys.argv[1]) / "spiel" / "eigene"
    stehend = Image.open(eigene / "bison_rechts.png").convert("RGBA")
    liegend = Image.open(eigene / "bison_liegend.png").convert("RGBA")
    auf_leinwand(verkleinern(stehend, (52, 39))).save(eigene / "bison_klein_rechts.png")
    auf_leinwand(verkleinern(liegend, (52, 26))).save(eigene / "bison_klein_liegend.png")
    print("bison_klein_rechts.png, bison_klein_liegend.png geschrieben")


if __name__ == "__main__":
    main()
