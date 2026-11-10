"""Bildwunsch mittel-3 (Runde 9): Konzernturm, Tunnelportal und Hausschilder für Campus und Hafen.

Warum: Erstes Gutachten zu Campus und altem Hafen (gutachten/silicon-bay-aussen-hafen.md):
- Der Konzernturm von Perfect Move war „kein Turm“, nur so hoch wie die Akademie. ``konzernturm_hoch``
  stockt LimeZus Bürohaus (Office Example 1, 12 × 19 Kacheln) um vier Geschosse auf: Das Band der
  beiden mittleren Geschosse wird zweimal eingefügt, Dach und Erdgeschoss bleiben (12 × 29).
- Die Straßenbahn „kommt links aus dem Tunnel“, aber es gab keinen. ``tunnelportal_west`` zeichnet
  ein Betonportal in unserer Ansicht (schräg von oben, 10.60): oben die Decke des Tunnels mit Kante,
  rechts die dunkle Mündung, aus der die Gleise kommen (4 × 4 Kacheln, genau über den vier Reihen der
  Fahrbahn, damit der Gehweg daneben frei bleibt).
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
    """Betonportal: Tunneldecke von oben, davor die Stirnwand mit dunkler Mündung nach Osten."""
    bild = Image.new("RGBA", (64, 64))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 0, 50, 63), fill=BETON, outline=UMRISS)  # Decke des Tunnels
    for y in range(8, 64, 16):
        z.line((1, y, 49, y), fill=BETON_DUNKEL)
    z.line((1, 1, 49, 1), fill=BETON_HELL)
    z.rectangle((50, 0, 63, 63), fill=BETON_DUNKEL, outline=UMRISS)  # Stirnwand
    z.rectangle((53, 18, 63, 58), fill=DUNKEL)  # Mündung über den Gleisen
    z.line((50, 0, 50, 63), fill=BETON_HELL)
    z.rectangle((52, 4, 62, 14), fill=BETON, outline=UMRISS)  # Kämpferstein mit Lampe
    z.point((57, 9), fill=(250, 220, 120, 255))
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
