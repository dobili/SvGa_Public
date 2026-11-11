"""Bildwunsch mittel-3: Steinbrücke längs mit Bogenansicht und Schatten (Riverton außen).

Warum: Gutachten silicon-bay-3-gemini-teil2-mittel-3-4.md, Riverton Punkt 1: Die Steinbrücke
(Gemini-Bild ``steinbruecke_laengs.png``) liest sich als graue Platte ohne Höhe; kein Bogen, kein
Schatten auf dem Wasser. Dieses Skript setzt an die Ostseite einen Streifen Mauerwerk mit zwei
dunklen Bögen und einem Pfeiler (die Seitenwand, zur Kamera geklappt wie bei ``steinbruecke_quer``)
und daneben einen weichen Schatten auf dem Wasser.

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/steinbruecke_laengs_bogen.png
(112 × 116: 80 Fahrbahn, 16 Bogenstreifen, 16 Schatten).
Aufruf: python steinbruecke_hoehe.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

FAHRBAHN = 80  # Breite des Gemini-Bildes
STREIFEN = 16  # Breite der Seitenwand und des Schattens
WASSER = (34, 90)  # Pixelreihen, in denen die Brücke über dem Wasser liegt
BOEGEN = ((36, 60), (64, 88))  # zwei Bögen (Reihe von, bis), dazwischen der Pfeiler
STEIN, STEIN_HELL, FUGE = (112, 104, 112, 255), (150, 142, 146, 255), (60, 54, 66, 255)
DUNKEL = (30, 28, 40)
SCHATTEN_DECKKRAFT = 110


def bogenstreifen() -> Image.Image:
    """Seitenwand der Brücke: Mauerwerk mit zwei Bögen, Scheitel zur Fahrbahn, Fuß zum Wasser."""
    hoehe = WASSER[1] - WASSER[0]
    bild = Image.new("RGBA", (STREIFEN, hoehe), STEIN)
    z = ImageDraw.Draw(bild)
    for y in range(0, hoehe, 6):  # Lagerfugen
        z.line((0, y, STREIFEN - 1, y), fill=FUGE)
    z.line((0, 0, 0, hoehe - 1), fill=STEIN_HELL)  # Gesims an der Fahrbahn
    for von, bis in BOEGEN:
        oben, unten = von - WASSER[0], bis - WASSER[0]
        z.pieslice((1, oben - 2, 2 * STREIFEN + 1, unten + 2), 90, 270, fill=STEIN_HELL, outline=FUGE)
        z.pieslice((5, oben + 2, 2 * STREIFEN - 3, unten - 2), 90, 270, fill=(*DUNKEL, 255))
    return bild


def schatten() -> Image.Image:
    """Schatten der Brücke auf dem Wasser: nach Osten auslaufend."""
    hoehe = WASSER[1] - WASSER[0]
    bild = Image.new("RGBA", (STREIFEN, hoehe))
    for x in range(STREIFEN):
        kraft = int(SCHATTEN_DECKKRAFT * (1 - x / STREIFEN))
        for y in range(hoehe):
            bild.putpixel((x, y), (*DUNKEL, kraft))
    return bild


def main() -> None:
    privat = Path(sys.argv[1])
    eigene = privat / "spiel" / "eigene"
    bruecke = Image.open(eigene / "steinbruecke_laengs.png").convert("RGBA")
    bild = Image.new("RGBA", (FAHRBAHN + 2 * STREIFEN, bruecke.height))
    bild.alpha_composite(bruecke, (0, 0))
    bild.alpha_composite(bogenstreifen(), (FAHRBAHN, WASSER[0]))
    bild.alpha_composite(schatten(), (FAHRBAHN + STREIFEN, WASSER[0]))
    bild.save(eigene / "steinbruecke_laengs_bogen.png")
    print("steinbruecke_laengs_bogen geschrieben")


if __name__ == "__main__":
    main()
