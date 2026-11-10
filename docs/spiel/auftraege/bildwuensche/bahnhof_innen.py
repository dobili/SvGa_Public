"""Bildwunsch mittel-3 (Runde 9): Bogenfenster und Abfahrtsmonitor für die Bahnhofshalle Riverton.

Warum: Das dritte Gutachten (riverton-innen-3.md, Halle Punkte 1 und 5) fand keine Bogenfenster
(das einzige Fenster stand hinter dem Getränkeautomaten und war ein gerades Sprossenfenster) und
einen Abfahrtsmonitor, der wie eine leere weiße Tafel aussieht. Beschrieben sind hohe Bogenfenster
in Backsteinwänden und ein Monitor mit den Abfahrten.

Bilder (im Stil von LimeZu, dunkle Umrisslinie):
- ``bogenfenster_halle.png`` (32 × 32): hohes Fenster mit Rundbogen, weißer Rahmen, Sprossen,
  hellblaues Glas mit Glanz, steinerne Fensterbank; für die Wandfläche (``an_wand``).
- ``abfahrtsmonitor_halle.png`` (32 × 32): schwarzer Bildschirm an zwei Haltern, darauf vier
  Zeilen in Gelb (Uhrzeit, Ziel, Gleis) und eine blaue Kopfzeile.

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/bogenfenster_halle.png,
spiel/eigene/abfahrtsmonitor_halle.png.
Aufruf: python bahnhof_innen.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

UMRISS = (48, 44, 56, 255)
RAHMEN, RAHMEN_SCHATTEN = (236, 232, 222, 255), (190, 184, 172, 255)
GLAS, GLAS_HELL = (128, 176, 214, 255), (196, 226, 244, 255)
STEIN = (170, 160, 148, 255)
SCHIRM, KOPF = (24, 26, 34, 255), (52, 96, 170, 255)
GELB, GELB_HELL = (232, 196, 64, 255), (250, 228, 120, 255)
METALL = (120, 124, 136, 255)


def bogenfenster() -> Image.Image:
    """Rundbogenfenster: Rahmen, Glas, Sprossen, Glanzstreifen, Fensterbank."""
    bild = Image.new("RGBA", (32, 32))
    z = ImageDraw.Draw(bild)
    z.rectangle((5, 12, 26, 28), fill=RAHMEN, outline=UMRISS)
    z.pieslice((5, 1, 26, 22), 180, 360, fill=RAHMEN, outline=UMRISS)
    z.rectangle((8, 12, 23, 26), fill=GLAS)
    z.pieslice((8, 4, 23, 19), 180, 360, fill=GLAS)
    z.line((15, 4, 15, 26), fill=RAHMEN_SCHATTEN, width=2)  # senkrechte Sprosse
    z.line((8, 18, 23, 18), fill=RAHMEN_SCHATTEN, width=1)  # waagerechte Sprosse
    z.line((10, 24, 13, 8), fill=GLAS_HELL)  # Glanz
    z.line((18, 24, 21, 14), fill=GLAS_HELL)
    z.rectangle((3, 28, 28, 30), fill=STEIN, outline=UMRISS)  # Fensterbank
    return bild


def abfahrtsmonitor() -> Image.Image:
    """Bildschirm mit Kopfzeile und vier gelben Zeilen, an zwei Haltern unter der Decke."""
    bild = Image.new("RGBA", (32, 32))
    z = ImageDraw.Draw(bild)
    z.line((8, 0, 8, 6), fill=METALL, width=2)
    z.line((23, 0, 23, 6), fill=METALL, width=2)
    z.rectangle((1, 6, 30, 26), fill=SCHIRM, outline=UMRISS)
    z.rectangle((3, 8, 28, 10), fill=KOPF)
    for i, y in enumerate((13, 16, 19, 22)):
        z.line((4, y, 8, y), fill=GELB_HELL)  # Uhrzeit
        z.line((11, y, 22 - (i % 2) * 4, y), fill=GELB)  # Ziel
        z.point((26, y), fill=GELB_HELL)  # Gleis
        z.point((27, y), fill=GELB_HELL)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1]) / "spiel" / "eigene"
    bogenfenster().save(ziel / "bogenfenster_halle.png")
    abfahrtsmonitor().save(ziel / "abfahrtsmonitor_halle.png")
    print("bogenfenster_halle.png, abfahrtsmonitor_halle.png geschrieben")


if __name__ == "__main__":
    main()
