"""Bilder für den Kanalweg (Entwurf, mittel-4, Gutachten Runde 8 und Regel 10.64).

- ``lastkahn_laengs.png``: Frachtkahn von Nord nach Süd, 5 × 26 Kacheln. LimeZus Kahn
  (Boat_3_Left_1, 6 × 4) ist nur gut zwei Figuren lang und liegt quer; Regel 10.64 verlangt 24–30 × 5
  und erlaubt, den Rumpf an einer gleichförmigen Stelle zu schneiden und das Mittelstück zu
  wiederholen. Der Kahn wird um 90° gedreht, auf 5 Kacheln Breite gezogen und in der Mitte verlängert.
- ``silo_kurz.png``: Silo des Hofs, 5 × 9 statt 5 × 14 Kacheln (das Gutachten fand es doppelt so hoch
  wie Scheune und Farmhaus). Aus Silos_2 werden Dach (oben) und Sockel (unten) behalten, die
  gleichförmige Mitte wird gekürzt.
- ``graffiti_springer.png`` und ``graffiti_turm.png`` (je 48 × 32): Noors Schachfiguren an der freien
  Wand, gesprühte Silhouetten mit farbigem Rand; die gekauften Graffiti zeigen keine Figuren.

Aufruf: ``python kanalbilder.py <privates Repository>`` (schreibt nach spiel/eigene/).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

K = 16
KAHN = "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/10_Vehicles_Singles_16x16/ME_Singles_Vehicles_16x16_Boat_3_Left_1.png"
SILO = "modern-farm/Single_Files_16x16/Props_and_Buildings_16x16/Silos_2_16x16.png"


def lastkahn(privat: Path, laenge: int = 26, breite: int = 5) -> Image.Image:
    """Frachtkahn längs, selbst gezeichnet (LimeZus einziger großer Kahn ist ein Fischerboot):
    stählerner Rumpf mit Spitze am Bug (oben), Ladeluken mit Planen in der Mitte, Steuerhaus am Heck
    (unten) mit sichtbarer Vorderwand und Fenstern, Schatten aufs Wasser rechts."""
    del privat
    w, h = breite * K, laenge * K
    bild = Image.new("RGBA", (w + 4, h + 4))
    z = ImageDraw.Draw(bild)
    rand, rumpf, rumpf_hell = (58, 58, 80, 255), (150, 62, 52, 255), (184, 88, 72, 255)
    deck, plane, plane_hell = (122, 112, 100, 255), (86, 112, 86, 255), (112, 140, 106, 255)
    haus, haus_dach, fenster = (226, 222, 210, 255), (96, 96, 112, 255), (120, 180, 210, 255)
    z.rectangle((4, 12, w + 3, h + 3), fill=(58, 58, 80, 70))  # Schatten
    bug = [(w // 2, 0), (w - 1, 22), (w - 1, h - 1), (0, h - 1), (0, 22)]
    z.polygon(bug, fill=rand)
    z.polygon([(w // 2, 3), (w - 4, 23), (w - 4, h - 4), (3, h - 4), (3, 23)], fill=rumpf)
    z.line((4, 24, 4, h - 6), fill=rumpf_hell)
    z.polygon([(w // 2, 9), (w - 9, 26), (w - 9, h - 10), (8, h - 10), (8, 26)], fill=deck)
    for y in range(32, h - 64, 34):  # Ladeluken mit Plane
        z.rectangle((10, y, w - 11, y + 28), fill=rand)
        z.rectangle((11, y + 1, w - 12, y + 27), fill=plane)
        for x in range(14, w - 12, 8):
            z.line((x, y + 2, x, y + 26), fill=plane_hell)
    hy = h - 60  # Steuerhaus
    z.rectangle((12, hy, w - 13, hy + 34), fill=rand)
    z.rectangle((13, hy + 1, w - 14, hy + 14), fill=haus_dach)
    z.rectangle((13, hy + 15, w - 14, hy + 33), fill=haus)
    for x in range(17, w - 18, 10):
        z.rectangle((x, hy + 19, x + 6, hy + 25), fill=fenster)
    for y in (40, h // 2, h - 80):  # Poller an Deck
        for x in (6, w - 8):
            z.rectangle((x, y, x + 2, y + 2), fill=rand)
    return bild


def silo_kurz(privat: Path, hoehe: int = 9) -> Image.Image:
    silo = Image.open(privat / SILO).convert("RGBA")
    oben, unten = (
        silo.crop((0, 0, silo.width, 4 * K)),
        silo.crop((0, silo.height - 4 * K, silo.width, silo.height)),
    )
    mitte = silo.crop((0, 6 * K, silo.width, 7 * K))
    bild = Image.new("RGBA", (silo.width, hoehe * K))
    bild.alpha_composite(oben, (0, 0))
    for y in range(4 * K, (hoehe - 4) * K, K):
        bild.alpha_composite(mitte, (0, y))
    bild.alpha_composite(unten, (0, (hoehe - 4) * K))
    return bild


def graffiti(figur: str) -> Image.Image:
    """Gesprühte Schachfigur: weiße Silhouette, farbiger Rand, Sprühpunkte."""
    bild = Image.new("RGBA", (48, 32))
    z = ImageDraw.Draw(bild)
    rand, fuell = (
        ((230, 90, 160, 255), (250, 250, 250, 255))
        if figur == "springer"
        else ((80, 170, 240, 255), (250, 250, 250, 255))
    )
    if figur == "springer":
        form = [
            (14, 29),
            (34, 29),
            (32, 24),
            (29, 21),
            (31, 14),
            (33, 9),
            (27, 3),
            (20, 4),
            (15, 10),
            (13, 15),
            (18, 15),
            (21, 13),
            (17, 21),
            (16, 24),
        ]
    else:
        form = [
            (14, 29),
            (34, 29),
            (32, 24),
            (30, 24),
            (30, 11),
            (33, 11),
            (33, 4),
            (29, 4),
            (29, 7),
            (26, 7),
            (26, 4),
            (22, 4),
            (22, 7),
            (19, 7),
            (19, 4),
            (15, 4),
            (15, 11),
            (18, 11),
            (18, 24),
            (16, 24),
        ]
    z.polygon(form, fill=fuell, outline=rand)
    z.line(form + [form[0]], fill=rand, width=2)
    for x, y in ((8, 26), (40, 6), (38, 27), (10, 8), (42, 18)):
        z.point((x, y), fill=rand)
    return bild


def main() -> None:
    privat = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    ziel = privat / "spiel" / "eigene"
    lastkahn(privat).save(ziel / "lastkahn_laengs.png")
    silo_kurz(privat).save(ziel / "silo_kurz.png")
    for figur in ("springer", "turm"):
        graffiti(figur).save(ziel / f"graffiti_{figur}.png")
    print("Kanalbilder nach", ziel)


if __name__ == "__main__":
    main()
