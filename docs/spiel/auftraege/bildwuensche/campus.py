"""Bildwunsch mittel-3 (Runde 9): Konzernturm, Tunnelportal und Hausschilder für Campus und Hafen.

Warum: Erstes Gutachten zu Campus und altem Hafen (gutachten/silicon-bay-aussen-hafen.md):
- Der Konzernturm von Perfect Move war „kein Turm“, nur so hoch wie die Akademie. ``konzernturm_hoch``
  stockt LimeZus Bürohaus (Office Example 1, 12 × 19 Kacheln) um vier Geschosse auf: Das Band der
  beiden mittleren Geschosse wird zweimal eingefügt, Dach und Erdgeschoss bleiben (12 × 29).
- Die Straßenbahn „kommt links aus dem Tunnel“, aber es gab keinen. ``tunnelportal_west`` zeichnet
  einen Betonbau quer über der Fahrbahn mit einem dunklen Bogen nach Osten, in dem Gleis und Asphalt
  verschwinden (5 × 5 Kacheln am Kartenrand; zweites Gutachten: Das erste Portal war eine graue
  Platte, links davon liefen Gleis und Asphalt weiter).
- Hotel, Fischhalle und Hafenmeisterei hatten kein Schild. ``schild_<name>`` sind dunkle
  Leuchtschilder wie das von Perfect Move (helle Schrift 5 × 7 auf dunklem Grund, 16 hoch).

Eingabe: Pfad zum privaten Repository. Ausgabe nach spiel/eigene/: konzernturm_hoch.png,
tunnelportal_west.png, schild_hotel_bayview.png, schild_fish_hall.png, schild_harbor_master.png,
schild_coming_soon.png.
Aufruf: python campus.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

TURM = (
    "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/16_Office_Singles_16x16/"
    "ME_Singles_Office_16x16_Example_1.png"
)
BAND = (184, 264)  # zwei mittlere Geschosse des Turms (Pixelreihen)
WIEDERHOLUNGEN = 2
UMRISS = (40, 42, 56, 255)
BETON, BETON_HELL, BETON_DUNKEL = (150, 152, 160, 255), (184, 186, 192, 255), (104, 106, 116, 255)
DUNKEL = (22, 22, 30, 255)
SCHILD, SCHRIFT, RAND = (24, 26, 40, 255), (236, 240, 250, 255), (90, 120, 200, 255)

# Schrift 5 × 7, nur die Buchstaben der Schilder.
ZEICHEN = {
    "A": ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    "B": ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
    "C": ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
    "E": ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
    "F": ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
    "G": ["01111", "10000", "10000", "10111", "10001", "10001", "01111"],
    "H": ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
    "I": ["111", "010", "010", "010", "010", "010", "111"],
    "L": ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
    "M": ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
    "N": ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
    "O": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
    "R": ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
    "S": ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    "T": ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
    "V": ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
    "W": ["10001", "10001", "10001", "10101", "10101", "11011", "10001"],
    "Y": ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
    " ": ["00", "00", "00", "00", "00", "00", "00"],
}
SCHILDER = {
    "hotel_bayview": "HOTEL BAYVIEW",
    "fish_hall": "FISH HALL",
    "harbor_master": "HARBOR MASTER",
    "coming_soon": "COMING SOON",
}


def konzernturm(privat: Path) -> Image.Image:
    """Bürohaus mit zweimal eingefügtem Geschossband: derselbe Bau, vier Geschosse höher."""
    quelle = Image.open(privat / TURM).convert("RGBA")
    band = quelle.crop((0, BAND[0], quelle.width, BAND[1]))
    hoehe = quelle.height + WIEDERHOLUNGEN * band.height
    bild = Image.new("RGBA", (quelle.width, hoehe))
    bild.alpha_composite(quelle.crop((0, 0, quelle.width, BAND[1])), (0, 0))
    y = BAND[1]
    for _ in range(WIEDERHOLUNGEN):
        bild.alpha_composite(band, (0, y))
        y += band.height
    bild.alpha_composite(quelle.crop((0, BAND[1], quelle.width, quelle.height)), (0, y))
    return bild


def tunnelportal() -> Image.Image:
    """Tunnelmund nach Osten: Betonbau quer über der Fahrbahn, darin ein dunkler Bogen mit Bogensteinen.

    Das Bild steht am Kartenrand (5 × 5 Kacheln: eine Reihe Gehweg, vier Reihen Fahrbahn). Links der
    Bau mit Dachkante und Südwand, rechts der Bogen: Die Öffnung ist durchsichtig-dunkel, sodass Gleis
    und Asphalt der Karte darunter zu sehen sind und nach links im Schwarz verschwinden.
    """
    bild = Image.new("RGBA", (80, 80))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 0, 79, 67), fill=BETON, outline=UMRISS)  # Dach des Baus
    z.rectangle((0, 68, 79, 79), fill=BETON_DUNKEL, outline=UMRISS)  # Südwand
    z.line((1, 1, 78, 1), fill=BETON_HELL)
    for x in range(16, 80, 16):
        z.line((x, 69, x, 78), fill=UMRISS)
    for y in range(4, 16, 4):  # Brüstung über dem Bogen
        z.line((2, y, 77, y), fill=BETON_DUNKEL)
    # Bogen: Öffnung von der Ostkante nach Westen, oben und unten rund (liegendes Tor)
    mund = Image.new("L", (80, 80), 0)
    ImageDraw.Draw(mund).pieslice((20, 22, 140, 66), 90, 270, fill=255)
    rand = Image.new("L", (80, 80), 0)
    ImageDraw.Draw(rand).pieslice((14, 17, 146, 71), 90, 270, fill=255)
    for y in range(80):
        for x in range(80):
            if mund.getpixel((x, y)):
                tiefe = min(1.0, (79 - x) / 30)  # nach Westen immer dunkler
                bild.putpixel((x, y), (*DUNKEL[:3], int(110 + 145 * tiefe)))
            elif rand.getpixel((x, y)):
                stein = BETON_HELL if (x // 6 + y // 6) % 2 else BETON
                bild.putpixel((x, y), stein)
    for y in range(17, 72):  # Umriss der Bogensteine
        for x in range(1, 80):
            if rand.getpixel((x, y)) and not rand.getpixel((x - 1, y)):
                bild.putpixel((x - 1, y), UMRISS)
    z.rectangle((70, 6, 77, 13), fill=BETON_DUNKEL, outline=UMRISS)  # Lampe über dem Scheitel
    z.point((73, 9), fill=(250, 220, 120, 255))
    z.point((74, 10), fill=(250, 220, 120, 255))
    return bild


def schild(text: str) -> Image.Image:
    """Dunkles Leuchtschild, Breite nach dem Text, 16 Pixel hoch."""
    breite = sum(len(ZEICHEN[c][0]) + 1 for c in text) + 7
    breite += -breite % 8
    bild = Image.new("RGBA", (breite, 16))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 1, breite - 1, 14), fill=SCHILD, outline=UMRISS)
    z.line((2, 13, breite - 3, 13), fill=RAND)
    x = (breite - sum(len(ZEICHEN[c][0]) + 1 for c in text) + 1) // 2
    for c in text:
        for dy, reihe in enumerate(ZEICHEN[c]):
            for dx, pixel in enumerate(reihe):
                if pixel == "1":
                    z.point((x + dx, 4 + dy), fill=SCHRIFT)
        x += len(ZEICHEN[c][0]) + 1
    return bild


def main() -> None:
    privat = Path(sys.argv[1])
    ziel = privat / "spiel" / "eigene"
    konzernturm(privat).save(ziel / "konzernturm_hoch.png")
    tunnelportal().save(ziel / "tunnelportal_west.png")
    for name, text in SCHILDER.items():
        schild(text).save(ziel / f"schild_{name}.png")
    print("konzernturm_hoch, tunnelportal_west und vier Schilder geschrieben")


if __name__ == "__main__":
    main()
