"""Bildwunsch mittel-3 (Runde 8): Küstenfähre für den alten Hafen von Silicon Bay, schräg von oben.

Warum: Der Autor fand die bisherige Fähre flach von der Seite gezeichnet und nur doppelt so lang wie
das Ruderboot (revision2_notizen, Regel 10.60). Im Paket gibt es kein Fährschiff in unserer Ansicht.
Dieses Skript zeichnet eine Fähre von 18 × 6 Kacheln (288 × 96 Pixel, KARTENREGELN 10.64: Personenfähre
16–20 × 6; das Motorboot misst 5 × 2):
oben das helle Deck mit Bug nach links, darunter die dunkelblaue Bordwand (sie gibt die Tiefe der
Draufsicht schräg von oben), auf dem Deck das weiße Steuerhaus mit Fensterband, ein roter Schornstein,
Reling als Punktreihe und ein Rettungsring. Farben und Umrisse folgen dem Stil von LimeZu (dunkle
Umrisslinie, je Fläche ein hellerer und ein dunklerer Ton).

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/hafen_faehre.png.
Aufruf: python hafen_faehre.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

BREITE, HOEHE = 288, 96
UMRISS = (38, 38, 56, 255)
DECK, DECK_HELL = (196, 190, 176, 255), (220, 214, 200, 255)
RUMPF, RUMPF_HELL = (44, 72, 120, 255), (64, 98, 150, 255)
WEISS, WEISS_SCHATTEN = (240, 240, 236, 255), (200, 204, 210, 255)
FENSTER = (110, 160, 200, 255)
ROT, ROT_DUNKEL = (196, 60, 52, 255), (140, 40, 40, 255)
# Deckfläche: Oberkante, Unterkante; Bug läuft links spitz zu.
DECK_OBEN, DECK_UNTEN, BUG = 10, 72, 36
WAND = 18  # Höhe der sichtbaren Bordwand unter dem Deck


def rumpf(z: ImageDraw.ImageDraw) -> None:
    """Deck (Draufsicht) und darunter die Bordwand mit Wasserlinie."""
    mitte = (DECK_OBEN + DECK_UNTEN) // 2
    deck = [
        (BUG, DECK_OBEN),
        (BREITE - 6, DECK_OBEN),
        (BREITE - 2, DECK_OBEN + 6),
        (BREITE - 2, DECK_UNTEN),
        (BUG, DECK_UNTEN),
        (2, mitte),
    ]
    wand = [
        (BUG, DECK_UNTEN),
        (BREITE - 2, DECK_UNTEN),
        (BREITE - 2, DECK_UNTEN + WAND),
        (BUG + 6, DECK_UNTEN + WAND),
        (2, mitte),
    ]
    z.polygon(wand, fill=RUMPF, outline=UMRISS)
    z.line([(BUG + 6, DECK_UNTEN + 3), (BREITE - 4, DECK_UNTEN + 3)], fill=RUMPF_HELL)
    z.line([(BUG + 8, DECK_UNTEN + WAND - 3), (BREITE - 4, DECK_UNTEN + WAND - 3)], fill=WEISS_SCHATTEN)
    z.polygon(deck, fill=DECK, outline=UMRISS)
    z.line([(BUG + 2, DECK_OBEN + 2), (BREITE - 8, DECK_OBEN + 2)], fill=DECK_HELL)
    for x in range(BUG + 4, BREITE - 4, 6):  # Reling
        z.point((x, DECK_OBEN + 1), fill=UMRISS)
        z.point((x, DECK_UNTEN - 1), fill=UMRISS)


def aufbau(z: ImageDraw.ImageDraw) -> None:
    """Steuerhaus mit Fensterband, Schornstein und Rettungsring."""
    x0, x1, y0, y1 = 120, 252, 2, 62
    z.rectangle((x0, y0 + 10, x1, y1), fill=WEISS_SCHATTEN, outline=UMRISS)  # Vorderwand
    z.rectangle((x0, y0, x1, y0 + 10), fill=WEISS, outline=UMRISS)  # Dach
    for x in range(x0 + 6, x1 - 8, 12):
        z.rectangle((x, y0 + 18, x + 7, y0 + 27), fill=FENSTER, outline=UMRISS)
    z.rectangle((x0 + 60, y1 - 16, x0 + 72, y1), fill=RUMPF, outline=UMRISS)  # Tür
    z.rectangle((176, 0, 188, 10), fill=ROT, outline=UMRISS)  # Schornstein
    z.line([(177, 3), (187, 3)], fill=ROT_DUNKEL)
    z.ellipse((60, 30, 72, 42), outline=ROT, width=3)  # Rettungsring


def main() -> None:
    privat = Path(sys.argv[1])
    bild = Image.new("RGBA", (BREITE, HOEHE))
    z = ImageDraw.Draw(bild)
    rumpf(z)
    aufbau(z)
    bild.save(privat / "spiel" / "eigene" / "hafen_faehre.png")


if __name__ == "__main__":
    main()
