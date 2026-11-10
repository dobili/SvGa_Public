"""Bildwunsch: LimeZus Ladenzeilen mit eigener Aufschrift statt „STORE“ und „MARKET“ (spiel/eigene/).

Entwurf von mittel-1, Runde 9.

Warum: In fast allen Städten stehen dieselben Läden „MARKET“ und „STORE“ mehrfach, englisch und
ohne erkennbaren Zweck (variantenwahl.md, Muster „Gleiche Läden stehen mehrfach“; Port Delacroix,
Capital Arena). Das Werkzeug sucht in der Vorlage die graue Schildtafel über der Tür, übermalt sie
und schreibt den Zweck des Ladens darauf. Größe, Tür und Schaufenster bleiben gleich (Market_Small
80 × 128, Market_Medium 112 × 144), daher ändert sich in den Szenen nur die Bildquelle. Das
Vorhängeschloss an der Tür wird durch eine Türklinke ersetzt: Die Läden sind geöffnet.

Bilder: ``laden_<zweck>.png`` laut ``LAEDEN`` unten. Weitere Läden: Eintrag ergänzen.
Aufruf: ``python laeden_schilder.py <Pfad zum privaten Repository>``.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

ORDNER = (
    "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/"
    "9_Shopping_Center_and_Markets_Singles_16x16/"
)
VORLAGE = "ME_Singles_Shopping_Center_and_Markets_16x16_{}.png"
RAND = (58, 58, 80, 255)
TAFEL_LIMEZU, SCHRIFT_LIMEZU = (131, 136, 151), (235, 228, 242)
SCHLOSS_LIMEZU = (208, 190, 156)  # Messing des Vorhängeschlosses an der Ladentür
SCHLOSS_GROESSTE = 10  # größerer Rahmen: die Farbe gehört zur Fassade, nicht zum Schloss
TAFEL, SCHRIFT_FARBE = (131, 136, 151, 255), (235, 228, 242, 255)
# Name → (Vorlage, Aufschrift)
LAEDEN = {
    "laden_fisch": ("Market_Small_1", "FISCH"),
    "laden_apotheke": ("Market_Medium_6", "APOTHEKE"),
    "laden_baeckerei": ("Market_Small_7", "BROT"),
    "laden_musik": ("Market_Small_5", "MUSIK"),
    "laden_hafenbedarf": ("Market_Medium_2", "HAFENBEDARF"),
    "laden_tabak": ("Market_Small_4", "TABAK"),
    "laden_buecher": ("Market_Medium_5", "BÜCHER"),
    "laden_blumen": ("Market_Small_2", "BLUMEN"),
    "laden_kaffee": ("Market_Medium_3", "KAFFEE"),
    "laden_mode": ("Market_Small_3", "MODE"),
    "laden_spielwaren": ("Market_Medium_4", "SPIELWAREN"),
    "laden_schuhe": ("Market_Small_8", "SCHUHE"),
    "laden_uhren": ("Market_Small_10", "UHREN"),
    "laden_feinkost": ("Market_Medium_1", "FEINKOST"),
    "laden_kaufhaus": ("Market_Big_1", "KAUFHAUS"),
    "laden_elektro": ("Market_Big_2", "ELEKTRO"),
    "laden_sport": ("Market_Big_3", "SPORT"),
    "laden_wohnen": ("Market_Big_4", "WOHNEN"),
    "laden_galerie": ("Market_Big_5", "GALERIE"),
    "laden_warenhaus": ("Market_Big_6", "WARENHAUS"),
}
SCHRIFT = {
    "A": [".#.", "#.#", "###", "#.#", "#.#"],
    "B": ["##.", "#.#", "##.", "#.#", "##."],
    "C": ["###", "#..", "#..", "#..", "###"],
    "D": ["##.", "#.#", "#.#", "#.#", "##."],
    "E": ["###", "#..", "##.", "#..", "###"],
    "F": ["###", "#..", "##.", "#..", "#.."],
    "H": ["#.#", "#.#", "###", "#.#", "#.#"],
    "I": ["#", "#", "#", "#", "#"],
    "K": ["#.#", "#.#", "##.", "#.#", "#.#"],
    "L": ["#..", "#..", "#..", "#..", "###"],
    "M": ["#...#", "##.##", "#.#.#", "#...#", "#...#"],
    "N": ["#..#", "##.#", "#.##", "#..#", "#..#"],
    "O": ["###", "#.#", "#.#", "#.#", "###"],
    "P": ["##.", "#.#", "##.", "#..", "#.."],
    "R": ["##.", "#.#", "##.", "#.#", "#.#"],
    "S": ["###", "#..", "###", "..#", "###"],
    "T": ["###", ".#.", ".#.", ".#.", ".#."],
    "U": ["#.#", "#.#", "#.#", "#.#", "###"],
    "W": ["#...#", "#...#", "#.#.#", "##.##", "#...#"],
    "Ä": ["#.#", ".#.", "#.#", "###", "#.#"],
    "Ü": ["#.#", "...", "#.#", "#.#", "###"],
    "G": ["###", "#..", "#.#", "#.#", "###"],
}


def rahmen(bild: Image.Image, farbe: tuple, oben: int, unten: int) -> tuple[int, int, int, int]:
    """Rahmen aller Pixel genau dieser Farbe zwischen den Zeilen ``oben`` und ``unten``."""
    px = bild.load()
    punkte = [(x, y) for y in range(oben, unten) for x in range(bild.width) if px[x, y][:3] == farbe]
    xs, ys = [p[0] for p in punkte], [p[1] for p in punkte]
    return min(xs), min(ys), max(xs), max(ys)


def tafel(bild: Image.Image) -> tuple[int, int, int, int]:
    """Die graue Schildtafel über der Tür: die zusammenhängende Fläche aus Tafel- und Schriftfarbe
    mit den meisten Schriftpixeln (Fensterrahmen haben dieselbe Grautönung, aber keine Schrift)."""
    px = bild.load()
    farben = {TAFEL_LIMEZU, SCHRIFT_LIMEZU}
    gesehen: set[tuple[int, int]] = set()
    beste: list[tuple[int, int]] = []
    for y in range(bild.height // 2, bild.height * 4 // 5):
        for x in range(bild.width):
            if (x, y) in gesehen or px[x, y][:3] not in farben:
                continue
            teil, offen = [], [(x, y)]
            gesehen.add((x, y))
            while offen:
                cx, cy = offen.pop()
                teil.append((cx, cy))
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < bild.width and 0 <= ny < bild.height and (nx, ny) not in gesehen:
                        if px[nx, ny][:3] in farben:
                            gesehen.add((nx, ny))
                            offen.append((nx, ny))
            schrift = sum(px[p][:3] == SCHRIFT_LIMEZU for p in teil)
            if schrift > sum(px[p][:3] == SCHRIFT_LIMEZU for p in beste):
                beste = teil
    xs, ys = [p[0] for p in beste], [p[1] for p in beste]
    return min(xs), min(ys), max(xs), max(ys)


def breite(text: str) -> int:
    return sum(len(SCHRIFT[z][0]) + 1 for z in text) - 1


def beschrifte(bild: Image.Image, text: str) -> None:
    x0, y0, x1, y1 = tafel(bild)
    z = ImageDraw.Draw(bild)
    z.rectangle((x0, y0, x1, y1), fill=TAFEL)
    x = (x0 + x1 + 1 - breite(text)) // 2
    y = (y0 + y1 + 1 - 5) // 2
    for zeichen in text:
        for r, reihe in enumerate(SCHRIFT[zeichen]):
            for s, p in enumerate(reihe):
                if p == "#":
                    z.point((x + s, y + r), fill=SCHRIFT_FARBE)
        x += len(SCHRIFT[zeichen][0]) + 1


def ohne_schloss(bild: Image.Image) -> None:
    """Das Vorhängeschloss in der Glastür wird Glas: Rahmen um die Messingpixel des Schlosses
    (samt Umriss) mit der Glasfarbe links daneben füllen, dazu eine dunkle Klinke."""
    px = bild.load()
    messing = [
        (x, y)
        for y in range(bild.height // 2, bild.height)
        for x in range(bild.width)
        if px[x, y][3] and px[x, y][:3] == SCHLOSS_LIMEZU
    ]
    if not messing:
        return
    x0, x1 = min(p[0] for p in messing) - 1, max(p[0] for p in messing) + 1
    y0, y1 = min(p[1] for p in messing) - 3, max(p[1] for p in messing) + 1
    if x1 - x0 > SCHLOSS_GROESSTE or y1 - y0 > SCHLOSS_GROESSTE:
        return  # dieselbe Farbe steht auch in der Fassade: Schloss lieber stehen lassen
    for y in range(y0, y1 + 1):
        glas = px[x0 - 1, y]
        for x in range(x0, x1 + 1):
            px[x, y] = glas
    mitte = (y0 + y1) // 2
    ImageDraw.Draw(bild).rectangle((x1 + 2, mitte, x1 + 3, mitte + 1), fill=RAND)


def main() -> None:
    privat = Path(sys.argv[1])
    ziel = privat / "spiel" / "eigene"
    for name, (vorlage, text) in LAEDEN.items():
        if (ziel / f"{name}.png").exists() and "--ueberschreiben" not in sys.argv:
            print(f"{name}.png gibt es schon, übersprungen")
            continue
        bild = Image.open(privat / ORDNER / VORLAGE.format(vorlage)).convert("RGBA")
        beschrifte(bild, text)
        ohne_schloss(bild)
        bild.save(ziel / f"{name}.png")
    print(f"{len(LAEDEN)} Läden geprüft")


if __name__ == "__main__":
    main()
