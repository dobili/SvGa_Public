"""Bildwunsch mittel-3 (Runde 9): große Schachfiguren für das Bodenbrett im Pavillon Riverton.

Warum: Das dritte Gutachten (riverton-innen-3.md, Pavillon Punkt 3) fand das in den Boden
eingelassene Brett „weiter ohne Figuren“; ein Besucher fragt, wo die großen Figuren sind. Im
Katalog gibt es keine Gartenschachfiguren. Dieses Skript zeichnet sie in unserer Ansicht (schräg von
oben, KARTENREGELN 10.60): je Figur ein runder Sockel auf dem Feld, darüber der Körper, kniehoch
für eine Spielfigur (eine Kachel breit, anderthalb hoch). Weiß aus hellem Holz, Schwarz aus
dunklem Holz, beide mit dunkler Umrisslinie wie bei LimeZu.

Dazu ``figurentruhe.png`` (32 × 32): Die Truhen für die Figuren lasen sich im vierten Gutachten als
Sitzbänke mit Kissen. Die neue Truhe hat einen gewölbten Deckel, Eisenbänder, ein Schloss und steht
halb offen, zwei Figurenköpfe schauen heraus.

Bilder: ``grossfigur_<farbe>_<figur>.png`` (16 × 24), Farbe ``weiss`` oder ``schwarz``, Figur
``bauer``, ``turm``, ``springer``, ``laeufer``, ``dame``, ``koenig``.
Eingabe: Pfad zum privaten Repository. Aufruf: python grosse_figuren.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

UMRISS = (40, 32, 36, 255)
FARBEN = {
    "weiss": ((236, 222, 196, 255), (252, 244, 226, 255), (196, 176, 146, 255)),
    "schwarz": ((70, 52, 46, 255), (104, 80, 70, 255), (44, 32, 30, 255)),
}
SCHATTEN = (0, 0, 0, 60)


def sockel(z: ImageDraw.ImageDraw, farbe: tuple) -> None:
    """Runder Fuß mit Schatten auf dem Feld."""
    z.ellipse((1, 19, 14, 23), fill=SCHATTEN)
    z.ellipse((2, 17, 13, 22), fill=farbe[0], outline=UMRISS)


def koerper(z: ImageDraw.ImageDraw, figur: str, f: tuple) -> None:
    """Körper je Figur über dem Sockel; Glanz links, Schatten rechts."""
    grund, hell, dunkel = f
    if figur == "bauer":
        z.polygon([(5, 19), (10, 19), (9, 12), (6, 12)], fill=grund, outline=UMRISS)
        z.ellipse((4, 6, 11, 13), fill=grund, outline=UMRISS)
    elif figur == "turm":
        z.rectangle((4, 7, 11, 19), fill=grund, outline=UMRISS)
        z.rectangle((3, 4, 12, 8), fill=grund, outline=UMRISS)
        for x in (4, 7, 10):
            z.rectangle((x, 2, x + 1, 4), fill=grund, outline=UMRISS)
    elif figur == "springer":
        z.polygon(
            [(4, 19), (11, 19), (11, 10), (12, 6), (9, 2), (5, 4), (3, 8), (6, 9), (5, 13)],
            fill=grund,
            outline=UMRISS,
        )
        z.point((8, 5), fill=UMRISS)
    elif figur == "laeufer":
        z.polygon([(5, 19), (10, 19), (9, 11), (6, 11)], fill=grund, outline=UMRISS)
        z.ellipse((4, 3, 11, 12), fill=grund, outline=UMRISS)
        z.line((6, 5, 9, 8), fill=dunkel)
        z.point((7, 1), fill=UMRISS)
    elif figur == "dame":
        z.polygon([(4, 19), (11, 19), (10, 9), (5, 9)], fill=grund, outline=UMRISS)
        z.polygon([(3, 9), (12, 9), (13, 3), (10, 6), (7, 2), (5, 6), (2, 3)], fill=grund, outline=UMRISS)
    elif figur == "koenig":
        z.polygon([(4, 19), (11, 19), (10, 8), (5, 8)], fill=grund, outline=UMRISS)
        z.rectangle((4, 5, 11, 8), fill=grund, outline=UMRISS)
        z.line((7, 0, 7, 4), fill=UMRISS, width=2)
        z.line((5, 2, 9, 2), fill=UMRISS)
    z.line((5, 17, 5, 10), fill=hell)


def figur(farbe: str, art: str) -> Image.Image:
    bild = Image.new("RGBA", (16, 24))
    z = ImageDraw.Draw(bild)
    sockel(z, FARBEN[farbe])
    koerper(z, art, FARBEN[farbe])
    return bild


HOLZ, HOLZ_HELL, HOLZ_DUNKEL = (146, 96, 58, 255), (178, 124, 78, 255), (104, 66, 42, 255)
EISEN, GOLD = (92, 96, 108, 255), (226, 188, 80, 255)


def figurentruhe() -> Image.Image:
    """Holztruhe mit Eisenbändern, Deckel nach hinten geklappt, darin ein weißer und ein schwarzer Kopf."""
    bild = Image.new("RGBA", (32, 32))
    z = ImageDraw.Draw(bild)
    z.ellipse((2, 26, 29, 31), fill=SCHATTEN)
    z.rectangle((3, 4, 28, 13), fill=HOLZ_DUNKEL, outline=UMRISS)  # offener Deckel von innen
    z.ellipse((11, 6, 15, 13), fill=FARBEN["weiss"][0], outline=UMRISS)  # Bauernkopf weiß
    z.ellipse((17, 6, 21, 13), fill=FARBEN["schwarz"][0], outline=UMRISS)  # Bauernkopf schwarz
    z.rectangle((3, 14, 28, 28), fill=HOLZ, outline=UMRISS)  # Kasten
    z.line((4, 15, 27, 15), fill=HOLZ_HELL)
    for x in (8, 22):
        z.rectangle((x, 4, x + 2, 28), fill=EISEN)  # Eisenbänder über Deckel und Kasten
    z.rectangle((14, 17, 17, 21), fill=GOLD, outline=UMRISS)  # Schloss
    return bild


def main() -> None:
    ziel = Path(sys.argv[1]) / "spiel" / "eigene"
    for farbe in FARBEN:
        for art in ("bauer", "turm", "springer", "laeufer", "dame", "koenig"):
            figur(farbe, art).save(ziel / f"grossfigur_{farbe}_{art}.png")
    figurentruhe().save(ziel / "figurentruhe.png")
    print("12 große Figuren und die Figurentruhe geschrieben")


if __name__ == "__main__":
    main()
