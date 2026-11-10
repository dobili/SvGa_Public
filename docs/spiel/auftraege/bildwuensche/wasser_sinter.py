"""Bildwunsch mittel-3 (Runde 9): Wasser mit Sinterrand (spiel/eigene/wasser_sinter.png).

Warum: Im Geysirbecken (Weg 8) waren die Becken nach dem Gutachten „exakte Rechtecke mit grauer
Mauerlinie statt natürlicher Sinterränder“. Die graue Linie kam vom Steinufer (``"ufer": "stein"``),
LimeZus eigenes Ufer ist Gras. Heiße Quellen haben einen hellen Sinterwulst, davor einen orangen
Saum aus Bakterienmatten und flaches, helles Wasser, bevor es tiefblau wird. Dieses Bild zeichnet
genau das, gewellt statt gerade, damit auch ein gerader Rand im Raster natürlich wirkt.

Aufbau wie ``werkzeuge/wasser_stein.py`` (Kacheln 16 × 16): links ein 3×3-Block (Ecken, Kanten,
Mitte), rechts daneben die vier Innenecken (Spalte 3/4, Reihe 0/1, Zuordnung wie INNENECKEN in
pipeline/abenteuer/bodenraster.py). Szenen wählen es mit ``"ufer": "sinter"``; der Kartenbauer nimmt
dann den Boden ``wasser_sinter`` aus materialien.json. Die Farben des Wulsts sind die des Bodens
``boden_sinter.png``, damit Rand und Sinterfläche ohne Naht ineinander übergehen.

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/wasser_sinter.png (80 × 48).
Aufruf: python wasser_sinter.py /home/user/schach-abenteuer-inhalte
"""

import math
import sys
from pathlib import Path

from PIL import Image

K = 16
WASSER_FELD = (1, 36)
GELAENDE = "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/1_Terrains_and_Fences_16x16.png"
SINTER, SINTER_HELL = (228, 222, 194, 255), (244, 240, 220, 255)
SAUM, SAUM_HELL = (224, 132, 56, 255), (240, 182, 92, 255)
FLACH, FLACH_HELL = (96, 186, 200, 255), (140, 210, 214, 255)
UMRISS = (176, 160, 120, 255)
RUND = 8.0  # Radius der äußeren Ecken in Pixeln

# Bänder vom Ufer aus: (bis Pixel, Farbe innen, Farbe Glanz)
BAENDER = [
    (3.2, SINTER, SINTER_HELL),
    (3.9, UMRISS, UMRISS),
    (5.4, SAUM, SAUM_HELL),
    (8.0, FLACH, FLACH_HELL),
]


def welle(t: float) -> float:
    """Wellung des Rands entlang der Kante; Periode 16 px, damit Kacheln nahtlos aneinanderpassen."""
    return 1.1 * math.sin(2 * math.pi * t / K) + 0.6 * math.sin(4 * math.pi * t / K + 1.3)


def abstand_kante(px: int, py: int, seiten: set[str]) -> tuple[float, float]:
    """Abstand eines Pixels zum Ufer und die Lage entlang der Kante (für die Wellung)."""
    werte = []
    if "n" in seiten:
        werte.append((py + 0.5, px))
    if "s" in seiten:
        werte.append((K - py - 0.5, px))
    if "w" in seiten:
        werte.append((px + 0.5, py))
    if "o" in seiten:
        werte.append((K - px - 0.5, py))
    if len(werte) == 2:  # äußere Ecke: runden
        (a, ta), (b, _) = werte
        if a < RUND and b < RUND:
            return RUND - math.hypot(RUND - a, RUND - b), ta
    return min(werte) if werte else (99.0, 0.0)


def farbe(abstand: float, t: float, px: int, py: int, wasser: tuple) -> tuple:
    """Farbe des Bands, in dem der Pixel liegt; einzelne Glanzpunkte für Körnung."""
    d = abstand - welle(t)
    for grenze, innen, glanz in BAENDER:
        if d < grenze:
            return glanz if (px * 7 + py * 3) % 11 == 0 else innen
    return wasser


def kachel(
    w: Image.Image, seiten: set[str] | None = None, ecke: tuple[int, int] | None = None
) -> Image.Image:
    """Eine Kachel: Wasser mit Rand an ``seiten`` oder mit Innenecke zum Nachbarn ``ecke``."""
    bild = w.copy()
    for py in range(K):
        for px in range(K):
            if ecke is not None:
                cx = 0 if ecke[0] < 0 else K
                cy = 0 if ecke[1] < 0 else K
                d, t = math.hypot(px + 0.5 - cx, py + 0.5 - cy), px + py
            else:
                d, t = abstand_kante(px, py, seiten or set())
            bild.putpixel((px, py), farbe(d, t, px, py, w.getpixel((px, py))))
    return bild


def main() -> None:
    privat = Path(sys.argv[1])
    bogen = Image.open(privat / GELAENDE).convert("RGBA")
    x, y = WASSER_FELD
    w = bogen.crop((x * K, y * K, (x + 1) * K, (y + 1) * K))
    bild = Image.new("RGBA", (5 * K, 3 * K))
    for sx in range(3):
        for sy in range(3):
            seiten = {"n"} if sy == 0 else {"s"} if sy == 2 else set()
            seiten |= {"w"} if sx == 0 else {"o"} if sx == 2 else set()
            bild.alpha_composite(kachel(w, seiten), (sx * K, sy * K))
    for ecke, (sx, sy) in {(1, 1): (3, 0), (-1, 1): (4, 0), (1, -1): (3, 1), (-1, -1): (4, 1)}.items():
        bild.alpha_composite(kachel(w, ecke=ecke), (sx * K, sy * K))
    ziel = privat / "spiel" / "eigene" / "wasser_sinter.png"
    bild.save(ziel)
    print(f"{ziel} (80 × 48)")


if __name__ == "__main__":
    main()
