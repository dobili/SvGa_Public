"""Bildwunsch: Wartehäuschen von hinten mit Bank hinter dem Glas (spiel/eigene/), Entwurf von mittel-1.

Warum: Ein Wartehäuschen, dessen Straße nördlich liegt, zeigt dem Betrachter seine Rückseite.
LimeZus Rückansicht (``Bus_Stop_2``) besteht nur aus Dach und Glasscheiben; der Gutachter las sie
als nach Süden offen, also „mit dem Rücken zur Straße“ (Gutachten Runde 8, Punkt g, Park). Dieses
Bild legt hinter die Glasrückwand eine Banklehne aus Holz, durch das Glas gesehen, und hängt das
Haltestellenschild an den Pfosten. So erkennt man: Die Bank steht auf der anderen Seite, die offene
Seite zeigt nach Norden zur Straße.

Bild: ``wartehaus_hinten.png`` (80 × 48, wie die Vorlagen). Regel für die Szenen: Liegt die Straße
südlich, ``Bus_Stop_1`` (offen nach Süden); liegt sie nördlich, ``wartehaus_hinten``.

Aufruf: ``python wartehaus.py <Pfad zum privaten Repository>``. Liest die Vorlagen aus
``modern-exteriors`` und schreibt nach ``spiel/eigene/``.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

ORDNER = "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/10_Vehicles_Singles_16x16/"
HINTEN = "ME_Singles_Vehicles_16x16_Bus_Stop_2.png"
LEHNE_Y = 33  # Oberkante der Banklehne hinter der Glaswand
DECKKRAFT_GLAS = 0.55  # wie stark die Scheibe über der Banklehne liegt


def wartehaus_hinten(hinten: Image.Image) -> Image.Image:
    """Banklehne aus Holz hinter der Glaswand (durch das Glas getönt), Haltestellenschild rechts."""
    bild = hinten.copy()
    px = bild.load()
    lehne, bein = (150, 104, 70), (70, 70, 94)
    for x in range(14, 66):
        for y, farbe in ((LEHNE_Y, lehne), (LEHNE_Y + 1, lehne), (LEHNE_Y + 3, lehne), (LEHNE_Y + 4, lehne)):
            r, g, b, a = px[x, y]
            k = DECKKRAFT_GLAS if a else 0
            px[x, y] = (
                round(r * k + farbe[0] * (1 - k)),
                round(g * k + farbe[1] * (1 - k)),
                round(b * k + farbe[2] * (1 - k)),
                255,
            )
    z = ImageDraw.Draw(bild)
    for x in (18, 61):
        z.line((x, LEHNE_Y + 5, x, LEHNE_Y + 9), fill=bein + (255,))
    # Haltestellenschild am rechten Pfosten: grüner Kreis mit gelbem H, zur Straße (Norden) gedreht.
    z.ellipse((70, 18, 78, 26), fill=(40, 120, 70, 255), outline=(58, 58, 80, 255))
    z.line((73, 20, 73, 24), fill=(240, 210, 60, 255))
    z.line((75, 20, 75, 24), fill=(240, 210, 60, 255))
    z.point((74, 22), fill=(240, 210, 60, 255))
    return bild


def main() -> None:
    privat = Path(sys.argv[1])
    hinten = Image.open(privat / ORDNER / HINTEN).convert("RGBA")
    wartehaus_hinten(hinten).save(privat / "spiel" / "eigene" / "wartehaus_hinten.png")
    print("wartehaus_hinten.png geschrieben")


if __name__ == "__main__":
    main()
