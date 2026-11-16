"""Wasserfall als reines Wasserband für eine Lücke in der Felswand (spiel/eigene/wasserfall_band.png).

Warum: Im Stadtpark von Maple Falls fiel der Wasserfall (Gemini-Bild ``wasserfall_felsen.png``,
15.11.2026) zwischen zwei grauen Felsblöcken herab, die links und rechts einfach aufhörten; daneben
lag Gras (Rückmeldung des Autors, mehrfach). Jetzt baut die Karte die Felswand aus Klippenkacheln
(Szene ``"kante": "klippe"``, ``"fels": "grau"``, Bogen ``klippe_grau.png``), und der Wasserfall
füllt nur die Lücke darin. Das Werkzeug schneidet aus dem Gemini-Bild das fallende Wasser (Spalten
32–63, genau zwei Kacheln) ohne die Felsen und streckt den Fall auf die Höhe der Wand.

Aufbau des Bilds (64 × 64 Pixel, vier Kacheln breit, vier hoch), oben an der Kantenreihe:
- Mitte (Pixel 16–47): Lippe des Bachs über der Kante, der Fall über Kante, Wand und Fuß (drei
  Reihen, ``"klippenhoehe": 3``), unten die Gischt auf dem Fluss;
- links und rechts (je eine Kachel) nur die Gischt der untersten Reihe, alles Graue fällt weg.

Aufruf: ``python wasserfall_band.py <privates Repository>``.
"""

import sys
from pathlib import Path

from PIL import Image

K = 16
QUELLE = "spiel/eigene/wasserfall_felsen.png"
ZIEL = "spiel/eigene/wasserfall_band.png"
BAND_LINKS, BAND_BREITE = 32, 2 * K  # Wasserspalten im Gemini-Bild
BREITE, HOEHE = 4 * K, 4 * K
VERSATZ = K  # das Band beginnt eine Kachel vom linken Rand
# Zeilen der Quelle für jede Zielzeile: Becken und Lippe (22–45), ein wiederholter Streifen des
# Falls (40–45), damit der Fall drei Reihen hoch ist, dann Rest des Falls und Gischt (46–79).
ZEILEN = list(range(22, 46)) + list(range(40, 46)) + list(range(46, 80))
GISCHT_AB = 46  # ab dieser Zielzeile darf Gischt neben dem Band stehen
BLAU_VOR_ROT = 40  # Gischt und Wasser: deutlich mehr Blau als Rot; Fels ist grau


def _ist_wasser(farbe: tuple[int, int, int, int]) -> bool:
    r, _, b, a = farbe
    return a > 0 and b > r + BLAU_VOR_ROT


def wasserfall_band(privat: Path) -> Image.Image:
    """Das Wasserband mit Gischt; alles Graue und Grüne der Felsen wird durchsichtig."""
    quelle = Image.open(privat / QUELLE).convert("RGBA")
    ziel = Image.new("RGBA", (BREITE, HOEHE))
    for zy, qy in enumerate(ZEILEN):
        for zx in range(BREITE):
            qx = zx - VERSATZ + BAND_LINKS
            if not 0 <= qx < quelle.width:
                continue
            farbe = quelle.getpixel((qx, qy))
            im_band = VERSATZ <= zx < VERSATZ + BAND_BREITE
            if im_band and farbe[3] or zy >= GISCHT_AB and _ist_wasser(farbe):
                ziel.putpixel((zx, zy), farbe)
    return ziel


def main() -> None:
    privat = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    wasserfall_band(privat).save(privat / ZIEL)
    print("Wasserband nach", privat / ZIEL)


if __name__ == "__main__":
    main()
