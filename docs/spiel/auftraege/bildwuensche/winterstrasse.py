"""Bildwunsch mittel-3 (Runde 9): Schneewälle und Zebrastreifen für die Altstadt im Winter.

Warum: Das zweite Gutachten zur Altstadt (silicon-bay-altstadt-2.md, Punkte 1 und 20) fand Straße
und Parkweg „ohne Winter“: Asphalt und Weg sind die einzigen Flächen ohne Schnee, ohne Markierung,
ohne Zebrastreifen an den Gassen. Eine geräumte Straße ist dunkel, aber an ihren Rändern liegt der
zur Seite geschobene Schnee als Wall. Diese Bilder legen sich als Streifen auf die Kante; die
Winterfärbung (pipeline/abenteuer/winter.py) lässt Weiß und Grau unverändert.

Bilder (L = Länge in Kacheln, 1 bis 16):
- ``schneewall_unten_L`` (L × 16 breit, 16 hoch): Wall am unteren Bildrand, 7 px hoch, gewellt,
  für die Nordkante einer Fahrbahn oder eines Wegs (in die Reihe darüber legen).
- ``schneewall_oben_L``: derselbe Wall am oberen Bildrand, für die Südkante (in die Reihe darunter).
- ``zebrastreifen_3`` (32 × 48): fünf weiße Balken quer über drei Fahrspurreihen, für einen
  Übergang zwei Kacheln breit über eine Straße von West nach Ost.

Aufruf: ``python winterstrasse.py <Pfad zum privaten Repository>`` schreibt nach ``spiel/eigene/``.
"""

import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw

K = 16
SCHNEE, SCHNEE_HELL, SCHNEE_SCHATTEN = (236, 240, 246, 255), (252, 252, 255, 255), (184, 194, 210, 255)
MATSCH = (150, 152, 160, 255)
WEISS = (238, 238, 232, 255)
WALL = 7


def schneewall(laenge: int, unten: bool) -> Image.Image:
    """Gewellter Schneewall entlang einer Kante, mit Glanzkante oben und Schatten zur Fahrbahn."""
    bild = Image.new("RGBA", (laenge * K, K))
    z = ImageDraw.Draw(bild)
    for x in range(laenge * K):
        hoehe = WALL + round(1.4 * math.sin(x * 0.45) + 0.8 * math.sin(x * 1.3 + 1))
        if unten:
            y0, y1 = K - hoehe, K - 1
            z.line((x, y0, x, y1), fill=SCHNEE)
            z.point((x, y0), fill=SCHNEE_HELL)
            z.point((x, y1), fill=SCHNEE_SCHATTEN)
            z.point((x, y1 - 1), fill=MATSCH if x % 5 == 0 else SCHNEE_SCHATTEN)
        else:
            y0, y1 = 0, hoehe - 1
            z.line((x, y0, x, y1), fill=SCHNEE)
            z.point((x, y0), fill=SCHNEE_SCHATTEN)
            z.point((x, y1), fill=SCHNEE_HELL)
            z.point((x, y0 + 1), fill=MATSCH if x % 5 == 0 else SCHNEE_SCHATTEN)
    return bild


def zebrastreifen() -> Image.Image:
    """Fünf Balken quer zur Gehrichtung, gleichmäßig über drei Reihen verteilt."""
    bild = Image.new("RGBA", (2 * K, 3 * K))
    z = ImageDraw.Draw(bild)
    for i in range(5):
        y = 3 + i * 9
        z.rectangle((2, y, 2 * K - 3, y + 4), fill=WEISS)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1]) / "spiel" / "eigene"
    bilder = {"zebrastreifen_3": zebrastreifen()}
    for n in range(1, 17):
        bilder[f"schneewall_unten_{n}"] = schneewall(n, True)
        bilder[f"schneewall_oben_{n}"] = schneewall(n, False)
    for name, bild in bilder.items():
        bild.save(ziel / f"{name}.png")
    print(f"{len(bilder)} Bilder nach {ziel}")


if __name__ == "__main__":
    main()
