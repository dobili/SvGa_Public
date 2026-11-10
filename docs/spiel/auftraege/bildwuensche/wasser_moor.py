"""Bildwunsch: schwarzes Sumpfwasser für das Bayou (spiel/eigene/wasser_moor.png), Entwurf von mittel-1.

Warum: Das Bayou soll schwarzes, stehendes Wasser zeigen, nicht das türkise Wasser der Flüsse
(variantenwahl.md, bayou-steg, Mangel 1; Hinweis des Haupt-Chats Runde 9). Das Werkzeug nimmt LimeZus
Uferblock aus dem Geländebogen (3 × 3 Rand und vier Innenecken rechts daneben, wie ``wasser_stein``)
und färbt nur das Wasser um: jede bläuliche Farbe wird nach ihrer Helligkeit ein dunkles Braunschwarz
mit grünlichem Schimmer. Das Grasufer bleibt, damit es zu den Inseln passt.

Seerosen (Gutachten Runde 9: „Wasser ohne Struktur, keine Seerosen“): LimeZus Wasserkacheln mit
Seerosenblättern (``Props_Water_11`` bis ``_13``) werden genauso umgefärbt und als
``seerosen_moor_1.png`` bis ``_3.png`` (je 16 × 16) gespeichert; materialien.json streut sie als
``wellen`` über das Sumpfwasser.

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
DUNKEL, HELL = (12, 15, 13), (44, 52, 40)  # Sumpfwasser von tief bis Schimmer (Runde 9: dunkler)


def moorfarbe(r: int, g: int, b: int) -> tuple[int, int, int]:
    anteil = (r + g + b) / (3 * 255)
    return tuple(round(DUNKEL[i] + (HELL[i] - DUNKEL[i]) * anteil) for i in range(3))


SEEROSEN = "modern-exteriors/Modern_Exteriors_16x16/Modern_Exteriors_Complete_Singles_16x16/"
SEEROSEN_BILDER = ("ME_Singles_Terrains_and_Fences_16x16_Props_Water_11.png", "_12.png", "_13.png")


def umfaerben(block: Image.Image) -> Image.Image:
    """Jede bläuliche Farbe nach ihrer Helligkeit ins Sumpfwasser; Grün und Erde bleiben."""
    px = block.load()
    for y in range(block.height):
        for x in range(block.width):
            r, g, b, a = px[x, y]
            if a and b > r + 20 and b >= g:
                px[x, y] = moorfarbe(r, g, b) + (a,)
    return block


def wasser_moor(bogen: Image.Image) -> Image.Image:
    x0, y0 = RAND_FELD
    return umfaerben(bogen.crop((x0 * K, y0 * K, (x0 + 5) * K, (y0 + 3) * K)).convert("RGBA"))


def main() -> None:
    privat = Path(sys.argv[1])
    bild = wasser_moor(Image.open(privat / GELAENDE))
    bild.save(privat / "spiel" / "eigene" / "wasser_moor.png")
    erstes = SEEROSEN_BILDER[0]
    for nummer, ende in enumerate(SEEROSEN_BILDER, start=1):
        name = erstes if nummer == 1 else erstes.replace("_11.png", ende)
        rose = umfaerben(Image.open(privat / SEEROSEN / name).convert("RGBA"))
        rose.save(privat / "spiel" / "eigene" / f"seerosen_moor_{nummer}.png")
    print("wasser_moor.png und drei Seerosenbilder geschrieben")


if __name__ == "__main__":
    main()
