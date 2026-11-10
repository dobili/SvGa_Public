"""Bildwunsch mittel-3 (Runde 8): Küstenfähre für den alten Hafen von Silicon Bay, schräg von oben.

Warum: Der Autor fand die bisherige Fähre flach von der Seite gezeichnet und nur doppelt so lang wie
das Ruderboot (revision2_notizen, Regel 10.60). Im Paket gibt es kein Fährschiff in unserer Ansicht.
Dieses Skript zeichnet eine Fähre von 18 × 6 Kacheln (288 × 96 Pixel, KARTENREGELN 10.64: Personenfähre
16–20 × 6; das Motorboot misst 5 × 2):
oben das helle Deck mit Bug nach links, darunter die dunkelblaue Bordwand (sie gibt die Tiefe der
Draufsicht schräg von oben), auf dem Deck das weiße Steuerhaus mit Fensterband, ein roter Schornstein,
Reling mit Pfosten und zwei Rettungsringe. Runde 9: nach dem Gutachten zum alten Hafen mit Schattierung
(Schlagschatten, Scheuerleiste, Wasserpass, Decksplanken, Bullaugen, Gangway) statt glatter Flächen.
Farben und Umrisse folgen dem Stil von LimeZu (dunkle
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


SCHATTEN = (20, 40, 70, 70)
PLANKE = (176, 168, 152, 255)
DACH_SCHATTEN = (176, 180, 190, 255)
GLANZ = (176, 214, 240, 255)
POLLER = (70, 74, 88, 255)


def rumpf(z: ImageDraw.ImageDraw) -> None:
    """Schatten auf dem Wasser, Bordwand in drei Tönen mit Scheuerleiste, Deck mit Planken und Reling.

    Runde 9 (Gutachten zum alten Hafen): Die erste Fassung war „flach und glatt“. Jetzt hat jede
    Fläche Licht- und Schattenton und eine dunkle Umrisslinie wie bei LimeZu.
    """
    mitte = (DECK_OBEN + DECK_UNTEN) // 2
    z.polygon(
        [
            (BUG + 8, DECK_UNTEN + WAND),
            (BREITE - 1, DECK_UNTEN + WAND),
            (BREITE - 1, HOEHE - 1),
            (BUG + 14, HOEHE - 1),
        ],
        fill=SCHATTEN,
    )
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
    z.line([(BUG + 2, DECK_UNTEN + 2), (BREITE - 4, DECK_UNTEN + 2)], fill=WEISS)  # Scheuerleiste
    z.line([(BUG + 4, DECK_UNTEN + 5), (BREITE - 4, DECK_UNTEN + 5)], fill=RUMPF_HELL)
    z.line([(BUG + 6, DECK_UNTEN + 6), (BREITE - 4, DECK_UNTEN + 6)], fill=RUMPF_HELL)
    z.line(
        [(BUG + 8, DECK_UNTEN + WAND - 4), (BREITE - 4, DECK_UNTEN + WAND - 4)], fill=ROT_DUNKEL
    )  # Wasserpass
    z.line([(BUG + 8, DECK_UNTEN + WAND - 3), (BREITE - 4, DECK_UNTEN + WAND - 3)], fill=ROT)
    for x in range(BUG + 16, BREITE - 8, 24):  # Bullaugen
        z.ellipse((x, DECK_UNTEN + 8, x + 4, DECK_UNTEN + 12), fill=FENSTER, outline=UMRISS)
    z.polygon(deck, fill=DECK, outline=UMRISS)
    for y in range(DECK_OBEN + 6, DECK_UNTEN - 2, 6):  # Decksplanken
        z.line([(BUG + (4 if abs(y - mitte) < 20 else 10), y), (BREITE - 5, y)], fill=PLANKE)
    z.line([(BUG + 2, DECK_OBEN + 2), (BREITE - 8, DECK_OBEN + 2)], fill=DECK_HELL)
    for x in range(BUG + 4, BREITE - 4, 6):  # Reling mit Pfosten
        z.line([(x, DECK_OBEN + 1), (x, DECK_OBEN + 3)], fill=UMRISS)
        z.line([(x, DECK_UNTEN - 3), (x, DECK_UNTEN - 1)], fill=UMRISS)
    z.line([(BUG + 4, DECK_UNTEN - 3), (BREITE - 4, DECK_UNTEN - 3)], fill=WEISS_SCHATTEN)
    for x in (BUG + 10, BREITE - 22):  # Poller für die Leinen
        z.rectangle((x, DECK_UNTEN - 9, x + 4, DECK_UNTEN - 5), fill=POLLER, outline=UMRISS)


def aufbau(z: ImageDraw.ImageDraw) -> None:
    """Steuerhaus mit Dachkante und Schattenseite, Fensterband mit Glanz, Schornstein, Rettungsringe,
    Bänke auf dem Vordeck und die Gangway nach unten zum Kai."""
    x0, x1, y0, y1 = 120, 252, 2, 62
    z.rectangle((x0 + 3, y1, x1 + 3, y1 + 4), fill=PLANKE)  # Schlagschatten auf dem Deck
    z.rectangle((x0, y0 + 12, x1, y1), fill=WEISS_SCHATTEN, outline=UMRISS)  # Vorderwand
    z.rectangle((x0, y0 + 12, x1, y0 + 15), fill=DACH_SCHATTEN)
    z.rectangle((x0 - 2, y0, x1 + 2, y0 + 12), fill=WEISS, outline=UMRISS)  # Dach mit Überstand
    z.line([(x0, y0 + 10), (x1, y0 + 10)], fill=DACH_SCHATTEN)
    z.rectangle((x0 + 20, y0 + 3, x0 + 44, y0 + 8), fill=DACH_SCHATTEN, outline=UMRISS)  # Oberlicht
    for x in range(x0 + 6, x1 - 8, 12):
        z.rectangle((x, y0 + 20, x + 7, y0 + 30), fill=FENSTER, outline=UMRISS)
        z.line([(x + 1, y0 + 21), (x + 3, y0 + 21)], fill=GLANZ)
        z.point((x + 1, y0 + 22), fill=GLANZ)
    z.rectangle((x0 + 60, y1 - 18, x0 + 72, y1), fill=RUMPF, outline=UMRISS)  # Tür
    z.point((x0 + 70, y1 - 9), fill=WEISS)
    z.rectangle((176, 0, 190, 12), fill=ROT, outline=UMRISS)  # Schornstein
    z.rectangle((176, 0, 190, 3), fill=UMRISS)
    z.line([(178, 6), (188, 6)], fill=ROT_DUNKEL)
    z.line([(178, 9), (188, 9)], fill=WEISS)
    for x in (58, 262):  # Rettungsringe
        z.ellipse((x, 30, x + 11, 41), outline=ROT, width=3)
        z.arc((x, 30, x + 11, 41), 20, 70, fill=WEISS, width=3)
        z.arc((x, 30, x + 11, 41), 200, 250, fill=WEISS, width=3)
    for x in (78, 96):  # Bänke auf dem Vordeck
        z.rectangle((x, 18, x + 8, 54), fill=(164, 112, 72, 255), outline=UMRISS)
        z.line([(x + 3, 19), (x + 3, 53)], fill=(118, 78, 52, 255))
    z.rectangle((30, DECK_OBEN - 9, 44, DECK_OBEN + 2), fill=PLANKE, outline=UMRISS)  # Gangway zum Kai
    for y in range(DECK_OBEN - 7, DECK_OBEN + 2, 3):
        z.line([(31, y), (43, y)], fill=UMRISS)


def main() -> None:
    privat = Path(sys.argv[1])
    bild = Image.new("RGBA", (BREITE, HOEHE))
    z = ImageDraw.Draw(bild)
    rumpf(z)
    aufbau(z)
    bild.save(privat / "spiel" / "eigene" / "hafen_faehre.png")


if __name__ == "__main__":
    main()
