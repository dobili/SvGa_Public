"""Bildwunsch: Möbel für den Clubraum Maple Falls, dritte Prüfung (spiel/eigene/), Entwurf von mittel-1.

Warum (Gutachten maple-falls-clubraum-3.md):
- Befund 2: Das „Pokalregal“ war ein Glastisch, der Pokal von 1994 stand davor in der Luft. Der
  Katalog hat kein Pokalregal.
- Befund 8: Der Doppelspind aus dem Bahnhof ist kniehoch. Der Katalog hat keine hohen Schulspinde.
- Befund 9: Links und rechts standen zwei verschiedene schmale Regale. Das neue Regal nach links
  (``buecherregal_schmal_links``, niedrig-1) gibt es jetzt auch gespiegelt nach rechts.
- Befund 1: Das Brett ohne weiße Dame ist auf 12 × 9 Pixeln nicht von den anderen zu
  unterscheiden. Ein Zettel mit rotem Fragezeichen daneben zeigt: Hier fehlt etwas.

Bilder (Namen vorher geprüft, keiner war belegt):
- ``pokalregal.png`` (32 × 48): Holzregal mit Glastüren, zwei Böden mit Pokalen, unten vorn
  der Pokal von 1994 mit Schild.
- ``spinde_hoch.png`` (48 × 48): drei hohe, schmale Schulspinde, Lüftungsschlitze oben, Schloss.
- ``buecherregal_schmal_rechts.png`` (16 × 48): Spiegelbild von ``buecherregal_schmal_links``.
- ``zettel_fragezeichen.png`` (8 × 8): weißer Zettel mit rotem Fragezeichen.

Aufruf: ``python clubraum_moebel.py <Pfad zum privaten Repository>``. Liest ``pokal_1994.png`` und
``buecherregal_schmal_links.png`` aus ``spiel/eigene/``.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

RAND = (58, 58, 80, 255)
HOLZ, HOLZ_HELL, HOLZ_DUNKEL = (150, 96, 58, 255), (190, 132, 82, 255), (104, 64, 40, 255)
GLAS, GLANZ = (190, 226, 240, 70), (255, 255, 255, 150)
GOLD, GOLD_HELL, GOLD_DUNKEL = (232, 184, 56, 255), (252, 226, 120, 255), (168, 120, 30, 255)
BLECH, BLECH_HELL, BLECH_DUNKEL = (96, 128, 160, 255), (132, 164, 196, 255), (66, 92, 120, 255)


def pokal(z: ImageDraw.ImageDraw, x: int, y: int) -> None:
    """Kleiner Pokal 6 × 7 px mit Fuß, Henkeln und Glanz; (x, y) ist die linke obere Ecke."""
    z.rectangle((x + 1, y, x + 4, y + 3), fill=GOLD)
    z.point((x, y + 1), fill=GOLD_DUNKEL)
    z.point((x + 5, y + 1), fill=GOLD_DUNKEL)
    z.line((x + 2, y + 4, x + 3, y + 4), fill=GOLD_DUNKEL)
    z.line((x + 1, y + 5, x + 4, y + 5), fill=GOLD)
    z.line((x + 1, y + 6, x + 4, y + 6), fill=GOLD_DUNKEL)
    z.point((x + 2, y + 1), fill=GOLD_HELL)


def pokalregal(pokal_1994: Image.Image) -> Image.Image:
    bild = Image.new("RGBA", (32, 48))
    z = ImageDraw.Draw(bild)
    z.rectangle((1, 2, 30, 46), fill=RAND)
    z.rectangle((2, 3, 29, 45), fill=HOLZ_DUNKEL)
    z.rectangle((1, 2, 30, 4), fill=HOLZ_HELL)  # Deckplatte
    for boden in (16, 29):
        z.rectangle((2, boden, 29, boden + 1), fill=HOLZ)
    for x, y in ((5, 9), (13, 8), (21, 9), (7, 22), (18, 22)):
        pokal(z, x, y)
    # Glastüren über den beiden oberen Fächern, mit Glanzstrich
    glas = Image.new("RGBA", bild.size)
    g = ImageDraw.Draw(glas)
    g.rectangle((3, 5, 28, 28), fill=GLAS)
    g.line((15, 5, 15, 28), fill=RAND)
    g.line((6, 26, 12, 7), fill=GLANZ)
    g.line((19, 26, 25, 7), fill=GLANZ)
    bild.alpha_composite(glas)
    # Unten offen: der Pokal von 1994 ganz vorn auf dem untersten Boden, darunter ein Schild.
    bild.alpha_composite(pokal_1994, (8, 30))
    z.rectangle((10, 42, 21, 44), fill=GOLD_DUNKEL)
    z.line((11, 43, 20, 43), fill=GOLD_HELL)
    z.rectangle((1, 45, 30, 46), fill=HOLZ_HELL)
    return bild


def spinde() -> Image.Image:
    bild = Image.new("RGBA", (48, 48))
    z = ImageDraw.Draw(bild)
    z.rectangle((1, 2, 46, 46), fill=RAND)
    for i in range(3):
        x0 = 2 + i * 15
        z.rectangle((x0, 3, x0 + 13, 45), fill=BLECH)
        z.line((x0, 3, x0 + 13, 3), fill=BLECH_HELL)
        for y in (7, 9, 11):
            z.line((x0 + 3, y, x0 + 10, y), fill=BLECH_DUNKEL)
        z.rectangle((x0 + 10, 24, x0 + 11, 28), fill=(200, 200, 210, 255))  # Griff und Schloss
        z.line((x0 + 13, 3, x0 + 13, 45), fill=BLECH_DUNKEL)
    z.rectangle((1, 44, 46, 46), fill=BLECH_DUNKEL)
    return bild


def zettel() -> Image.Image:
    bild = Image.new("RGBA", (8, 8))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 0, 7, 7), fill=(250, 250, 244, 255), outline=RAND)
    rot = (210, 40, 40, 255)
    z.line((2, 2, 4, 1), fill=rot)
    z.line((5, 2, 4, 4), fill=rot)
    z.point((4, 6), fill=rot)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1]) / "spiel" / "eigene"
    pokalregal(Image.open(ziel / "pokal_1994.png").convert("RGBA")).save(ziel / "pokalregal.png")
    spinde().save(ziel / "spinde_hoch.png")
    links = Image.open(ziel / "buecherregal_schmal_links.png").convert("RGBA")
    ImageOps.mirror(links).save(ziel / "buecherregal_schmal_rechts.png")
    zettel().save(ziel / "zettel_fragezeichen.png")
    print("4 Bilder nach", ziel)


if __name__ == "__main__":
    main()
