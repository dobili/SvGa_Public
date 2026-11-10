"""Grashang statt Felskante für Deiche (spiel/eigene/klippe_gras.png), Entwurf von mittel-1.

Warum: Im Gutachten Runde 9 (``gutachten/weg-silicon-delacroix.md``, Deich Befund 4) ist die
Deichböschung eine rotbraune Felswand wie in den Canyons; ein Deich hat einen grünen Hang. Die
Felskanten aus LimeZus Klippenkacheln (Szene ``"kante": "klippe"``) gibt es nur als Erdwand. Das
Werkzeug färbt die Kacheln der Klippe (Spalten 8–10 mit Grasoberkante und 14–16 mit Erde, Reihen
42–46) in strohfarbenes Wintergras um: Die Wand wird ein schattiger Hang, die Umrisse bleiben. Die
Treppe (Spalte 25, Reihen 46–48) bleibt aus Stein.

- ``klippe_gras.png``: derselbe Zuschnitt wie der Geländebogen, nur diese Kacheln, sonst
  durchsichtig. ``pipeline/abenteuer/klippe.py`` nimmt sie mit Szene ``"fels": "gras"``.

Aufruf: ``python klippe_gras.py <privates Repository>``.
"""

import colorsys
import sys
from pathlib import Path

from PIL import Image

K = 16
GELAENDE = "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/1_Terrains_and_Fences_16x16.png"
WAND = [(x, y) for x in (8, 9, 10, 14, 15, 16) for y in range(42, 47)]  # Gras- und Erdvariante
TREPPE = [(25, y) for y in (46, 47, 48)]
# Hang von schattig bis hell in Strohfarben: verdorrtes Wintergras. Grün würde die Winterfärbung der
# Karte weiß machen, und der Hang wäre im Schnee nicht mehr zu sehen.
HANG = [(84, 76, 50), (104, 96, 62), (124, 114, 74), (144, 134, 88), (162, 152, 102)]
DUNKEL = 0.18


def umfaerben(farbe: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    """Ein Pixel der braunen Klippe nach Helligkeit auf die Grüntöne; Grün und Umriss bleiben."""
    r, g, b, a = farbe
    if a == 0:
        return farbe
    h, hell, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    if 0.2 < h < 0.45 and s > 0.2:
        return farbe  # schon Gras
    if hell < DUNKEL:
        return farbe
    stufe = min(len(HANG) - 1, int((hell - DUNKEL) / (1 - DUNKEL) * len(HANG) * 1.3))
    return (*HANG[stufe], a)


def klippe_gras(privat: Path) -> Image.Image:
    bogen = Image.open(privat / GELAENDE).convert("RGBA")
    ziel = Image.new("RGBA", bogen.size)
    for sx, sy in WAND + TREPPE:
        kachel = bogen.crop((sx * K, sy * K, (sx + 1) * K, (sy + 1) * K))
        if (sx, sy) in WAND:
            daten = bytes(c for y in range(K) for x in range(K) for c in umfaerben(kachel.getpixel((x, y))))
            kachel = Image.frombytes("RGBA", kachel.size, daten)
        ziel.alpha_composite(kachel, (sx * K, sy * K))
    return ziel


def main() -> None:
    privat = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    klippe_gras(privat).save(privat / "spiel" / "eigene" / "klippe_gras.png")
    print("Grashang nach", privat / "spiel" / "eigene")


if __name__ == "__main__":
    main()
