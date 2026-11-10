"""Bildwunsch mittel-3 (Runde 8): Läden der Altstadt von Silicon Bay als ganze Häuser.

Warum: In der Altstadt stand dasselbe Market-Gebäude vier- bis sechsmal (revision2_notizen,
allgemeiner Punkt 25: höchstens zweimal dasselbe Gebäudebild). Die Statisten sind Bäckerin,
Metzger, Musikhändler und Eisverkäuferin; ihre Läden baut dieses Skript aus dem Baukasten
„Floor Modular Building“: Dach oben, wahlweise ein Obergeschoss, unten das Ladengeschoss. Das
Ladengeschoss ist oben teilweise durchsichtig (Schild ragt hinein); es wird so gesetzt, dass seine
Wand genau unter dem Geschoss darüber beginnt.

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/altstadt_*.png, 112 Pixel breit.
Aufruf: python altstadt.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image

ORDNER = (
    "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/5_Floor_Modular_Building_Singles_16x16/"
    "ME_Singles_Floor_Modular_Building_16x16_{}.png"
)
BREITE = 112
# Spalte, an der die Oberkante der Wand des Ladengeschosses gemessen wird (links, ohne Schild).
MESSSPALTE = 2

# Name → (Dach, Obergeschosse, Ladengeschoss)
LAEDEN = {
    "baeckerei": ("Roof_2", ["Middle_Floor_5"], "Ground_Floor_Bakery_5"),
    "metzgerei": ("Roof_4", [], "Ground_Floor_Butchery_1"),
    "musikladen": ("Roof_1", ["Middle_Floor_10"], "Ground_Floor_Music_Store_1"),
    "eisdiele": ("Roof_5", [], "Ground_Floor_Ice_Cream_Shop_1"),
    "angelladen": ("Roof_6", [], "Ground_Floor_Bait_Shop_1"),
}


def lade(privat: Path, name: str) -> Image.Image:
    return Image.open(privat / ORDNER.format(name)).convert("RGBA")


def wandoberkante(bild: Image.Image) -> int:
    """Erste deckende Zeile in der Messspalte: Beginn der Wand unter dem durchsichtigen Rand."""
    alpha = bild.getchannel("A")
    return next(y for y in range(bild.height) if alpha.getpixel((MESSSPALTE, y)) > 0)


def haus(privat: Path, dach: str, obergeschosse: list[str], laden: str) -> Image.Image:
    """Dach, Obergeschosse und Ladengeschoss übereinander, unten bündig ohne Lücke."""
    teile = [lade(privat, dach)] + [lade(privat, n) for n in obergeschosse]
    unten = lade(privat, laden)
    oben = sum(t.height for t in teile)
    rand = wandoberkante(unten)
    bild = Image.new("RGBA", (BREITE, oben + unten.height - rand))
    y = 0
    for teil in teile:
        bild.alpha_composite(teil, (0, y))
        y += teil.height
    bild.alpha_composite(unten, (0, oben - rand))
    return bild


def main() -> None:
    privat = Path(sys.argv[1])
    for name, (dach, obergeschosse, laden) in LAEDEN.items():
        haus(privat, dach, obergeschosse, laden).save(privat / "spiel" / "eigene" / f"altstadt_{name}.png")


if __name__ == "__main__":
    main()
