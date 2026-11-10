"""Bildwunsch mittel-3 (Runde 9): Kleine Inselfähre zur Pelikaninsel, schräg von oben.

Warum: Im Gutachten zur Pelikaninsel war die Inselfähre „ein kleines Motorboot“ (5 × 3 Kacheln). Nach
KARTENREGELN 10.64 misst ein Kutter 9–12 × 3–4 Kacheln; eine Personenfähre für eine kleine Insel
liegt in dieser Größe, die große Küstenfähre (18 × 6, ``hafen_faehre.py``) passt nicht in die
schmale Rinne am Anleger. Gezeichnet wie die Küstenfähre (Regel 10.60): oben das helle Deck mit Bug
nach links, darunter die Bordwand, hinten ein kleines Steuerhaus mit Fensterband und Schornstein,
vorn offenes Deck mit zwei Bänken für die Fahrgäste, Reling als Punktreihe, ein Rettungsring.
Format 11 × 4 Kacheln (176 × 64 Pixel).

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/inselfaehre.png.
Aufruf: python inselfaehre.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

BREITE, HOEHE = 176, 64
UMRISS = (38, 38, 56, 255)
DECK, DECK_HELL = (196, 190, 176, 255), (220, 214, 200, 255)
RUMPF, RUMPF_HELL = (40, 96, 92, 255), (60, 128, 120, 255)
WEISS, WEISS_SCHATTEN = (240, 240, 236, 255), (200, 204, 210, 255)
FENSTER = (110, 160, 200, 255)
ROT, ROT_DUNKEL = (196, 60, 52, 255), (140, 40, 40, 255)
HOLZ, HOLZ_DUNKEL = (164, 112, 72, 255), (118, 78, 52, 255)
DECK_OBEN, DECK_UNTEN, BUG = 6, 46, 24
WAND = 14


def rumpf(z: ImageDraw.ImageDraw) -> None:
    """Deck in Draufsicht und darunter die Bordwand mit Wasserlinie."""
    mitte = (DECK_OBEN + DECK_UNTEN) // 2
    deck = [
        (BUG, DECK_OBEN),
        (BREITE - 5, DECK_OBEN),
        (BREITE - 2, DECK_OBEN + 4),
        (BREITE - 2, DECK_UNTEN),
        (BUG, DECK_UNTEN),
        (2, mitte),
    ]
    wand = [
        (BUG, DECK_UNTEN),
        (BREITE - 2, DECK_UNTEN),
        (BREITE - 2, DECK_UNTEN + WAND),
        (BUG + 4, DECK_UNTEN + WAND),
        (2, mitte),
    ]
    z.polygon(wand, fill=RUMPF, outline=UMRISS)
    z.line([(BUG + 4, DECK_UNTEN + 3), (BREITE - 4, DECK_UNTEN + 3)], fill=RUMPF_HELL)
    z.line([(BUG + 6, DECK_UNTEN + WAND - 3), (BREITE - 4, DECK_UNTEN + WAND - 3)], fill=WEISS_SCHATTEN)
    z.polygon(deck, fill=DECK, outline=UMRISS)
    z.line([(BUG + 2, DECK_OBEN + 2), (BREITE - 6, DECK_OBEN + 2)], fill=DECK_HELL)
    for x in range(BUG + 3, BREITE - 3, 5):  # Reling
        z.point((x, DECK_OBEN + 1), fill=UMRISS)
        z.point((x, DECK_UNTEN - 1), fill=UMRISS)


def baenke(z: ImageDraw.ImageDraw) -> None:
    """Zwei Holzbänke quer auf dem offenen Vorderdeck."""
    for x in (44, 64):
        z.rectangle((x, 14, x + 6, 38), fill=HOLZ, outline=UMRISS)
        z.line([(x + 2, 15), (x + 2, 37)], fill=HOLZ_DUNKEL)


def aufbau(z: ImageDraw.ImageDraw) -> None:
    """Steuerhaus hinten mit Fensterband, Tür, Schornstein; Rettungsring vorn."""
    x0, x1, y0, y1 = 92, 162, 2, 40
    z.rectangle((x0, y0 + 8, x1, y1), fill=WEISS_SCHATTEN, outline=UMRISS)
    z.rectangle((x0, y0, x1, y0 + 8), fill=WEISS, outline=UMRISS)
    for x in range(x0 + 5, x1 - 6, 10):
        z.rectangle((x, y0 + 13, x + 6, y0 + 20), fill=FENSTER, outline=UMRISS)
    z.rectangle((x0 + 30, y1 - 12, x0 + 40, y1), fill=RUMPF, outline=UMRISS)
    z.rectangle((140, 0, 149, 8), fill=ROT, outline=UMRISS)
    z.line([(141, 3), (148, 3)], fill=ROT_DUNKEL)
    z.ellipse((28, 20, 38, 30), outline=ROT, width=2)


def main() -> None:
    privat = Path(sys.argv[1])
    bild = Image.new("RGBA", (BREITE, HOEHE))
    z = ImageDraw.Draw(bild)
    rumpf(z)
    baenke(z)
    aufbau(z)
    bild.save(privat / "spiel" / "eigene" / "inselfaehre.png")
    print("inselfaehre.png geschrieben")


if __name__ == "__main__":
    main()
