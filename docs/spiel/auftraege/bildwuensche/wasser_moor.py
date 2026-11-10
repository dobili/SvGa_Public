"""Bildwunsch: schwarzes Sumpfwasser für das Bayou (spiel/eigene/wasser_moor.png), Entwurf von mittel-1.

Warum: Das Bayou soll schwarzes, stehendes Wasser zeigen, nicht das türkise Wasser der Flüsse
(variantenwahl.md, bayou-steg, Mangel 1; Hinweis des Haupt-Chats Runde 9). Das Werkzeug nimmt LimeZus
Uferblock aus dem Geländebogen (3 × 3 Rand und vier Innenecken rechts daneben, wie ``wasser_stein``)
und färbt nur das Wasser um: jede bläuliche Farbe wird nach ihrer Helligkeit ein dunkles Braunschwarz
mit grünlichem Schimmer. Das Grasufer bleibt, damit es zu den Inseln passt.

Bild: ``wasser_moor.png`` (80 × 48). Szenen wählen es mit ``"ufer": "moor"``; materialien.json
bekommt dazu den Bogen ``moor`` und den Boden ``wasser_moor`` (``feld`` [1, 1], ``rand`` [0, 0]).

Aufruf: ``python wasser_moor.py <Pfad zum privaten Repository>``.
"""

import sys
from pathlib import Path

from PIL import Image

GELAENDE = "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/1_Terrains_and_Fences_16x16.png"
K = 16
RAND_FELD = (0, 35)  # linke obere Kachel des Uferblocks im Geländebogen
DUNKEL, HELL = (18, 22, 20), (64, 74, 58)  # Sumpfwasser von tief bis Schimmer


def moorfarbe(r: int, g: int, b: int) -> tuple[int, int, int]:
    anteil = (r + g + b) / (3 * 255)
    return tuple(round(DUNKEL[i] + (HELL[i] - DUNKEL[i]) * anteil) for i in range(3))


def wasser_moor(bogen: Image.Image) -> Image.Image:
    x0, y0 = RAND_FELD
    block = bogen.crop((x0 * K, y0 * K, (x0 + 5) * K, (y0 + 3) * K)).convert("RGBA")
    px = block.load()
    for y in range(block.height):
        for x in range(block.width):
            r, g, b, a = px[x, y]
            if a and b > r + 20 and b >= g:
                px[x, y] = moorfarbe(r, g, b) + (a,)
    return block


def main() -> None:
    privat = Path(sys.argv[1])
    bild = wasser_moor(Image.open(privat / GELAENDE))
    bild.save(privat / "spiel" / "eigene" / "wasser_moor.png")
    print("wasser_moor.png geschrieben")


if __name__ == "__main__":
    main()
