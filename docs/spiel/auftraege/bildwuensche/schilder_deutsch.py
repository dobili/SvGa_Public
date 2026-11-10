"""Bildwunsch: deutsche Schilder an Feuerwache, Polizei und Post (spiel/eigene/), Entwurf von mittel-1.

Warum: Im Gutachten Runde 9 (``gutachten/capital-arena-bayou.md``, Capital außen Befund 2) stehen
englische Schilder („FIRE STATION“, „POLICE“, „POST OFFICE“) neben deutschen Läden. LimeZus
Gebäude haben die Schrift im Bild. Das Werkzeug sucht im Schildfeld die Schriftpixel (heller als
der Schildgrund), übermalt sie mit dem Grund und schreibt den deutschen Namen in derselben Farbe
mittig hinein.

Bilder (Größe wie die Vorlage): ``feuerwache.png``, ``polizei.png``, ``post.png``, ``post_4.png``.

Aufruf: ``python schilder_deutsch.py <Pfad zum privaten Repository>``. Nur PIL.
"""

import sys
from collections import Counter
from pathlib import Path

from PIL import Image, ImageDraw

ORDNER = "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/"
# Name: (Vorlage, Schildfeld (x0, y0, x1, y1) in Pixeln, Text, Maß der Schrift, Schwelle „heller als Grund“)
SCHILDER = {
    "feuerwache": (
        "18_Fire_Station_Singles_16x16/ME_Singles_Fire_Station_16x16_Building.png",
        (14, 126, 82, 144),
        "FEUERWACHE",
        1,
        60,
    ),
    "polizei": (
        "15_Police_Station_Singles_16x16/ME_Singles_Police_Station_16x16_Police_Station_1.png",
        (32, 104, 128, 128),
        "POLIZEI",
        2,
        30,  # helle Schrift auf hellgrauem Grund
    ),
    "post": (
        "22_Post_Office_Singles_16x16/22_Post_Office_16x16_Building_1.png",
        (40, 166, 90, 178),
        "POST",
        1,
        60,
    ),
    "post_4": (
        "22_Post_Office_Singles_16x16/22_Post_Office_16x16_Building_4.png",
        (40, 166, 90, 178),
        "POST",
        1,
        60,
    ),
}
SCHRIFT = {
    "A": [".#.", "#.#", "###", "#.#", "#.#"],
    "C": ["###", "#..", "#..", "#..", "###"],
    "E": ["###", "#..", "##.", "#..", "###"],
    "F": ["###", "#..", "##.", "#..", "#.."],
    "H": ["#.#", "#.#", "###", "#.#", "#.#"],
    "I": ["###", ".#.", ".#.", ".#.", "###"],
    "L": ["#..", "#..", "#..", "#..", "###"],
    "O": ["###", "#.#", "#.#", "#.#", "###"],
    "P": ["###", "#.#", "###", "#..", "#.."],
    "R": ["##.", "#.#", "##.", "#.#", "#.#"],
    "S": ["###", "#..", "###", "..#", "###"],
    "T": ["###", ".#.", ".#.", ".#.", ".#."],
    "U": ["#.#", "#.#", "#.#", "#.#", "###"],
    "W": ["#...#", "#...#", "#.#.#", "##.##", "#...#"],
    "Z": ["###", "..#", ".#.", "#..", "###"],
}


def helligkeit(farbe: tuple) -> float:
    return sum(farbe[:3]) / 3


def textbreite(text: str, mass: int) -> int:
    return sum((len(SCHRIFT[z][0]) + 1) * mass for z in text) - mass


def schreibe(bild: Image.Image, feld: tuple, text: str, mass: int, heller: int) -> None:
    """Alte Schrift im Feld mit dem Schildgrund übermalen, neue Schrift mittig in ihrer Farbe setzen."""
    x0, y0, x1, y1 = feld
    px = bild.load()
    farben = Counter(px[x, y] for x in range(x0, x1) for y in range(y0, y1) if px[x, y][3])
    grund = farben.most_common(1)[0][0]
    schrift = [
        (x, y)
        for x in range(x0, x1)
        for y in range(y0, y1)
        if helligkeit(px[x, y]) > helligkeit(grund) + heller
    ]
    if not schrift:
        raise ValueError(f"keine Schrift im Feld {feld}")
    textfarbe = Counter(px[x, y] for x, y in schrift).most_common(1)[0][0]
    sx0, sy0 = min(x for x, _ in schrift), min(y for _, y in schrift)
    sx1, sy1 = max(x for x, _ in schrift), max(y for _, y in schrift)
    z = ImageDraw.Draw(bild)
    z.rectangle((sx0 - 1, sy0 - 1, sx1 + 1, sy1 + 1), fill=grund)  # mit dem Kontursaum der alten Schrift
    breite, hoehe = textbreite(text, mass), 5 * mass
    x = (sx0 + sx1 + 1 - breite) // 2
    y = (sy0 + sy1 + 1 - hoehe) // 2
    for zeichen in text:
        for r, reihe in enumerate(SCHRIFT[zeichen]):
            for s, p in enumerate(reihe):
                if p == "#":
                    z.rectangle(
                        (x + s * mass, y + r * mass, x + s * mass + mass - 1, y + r * mass + mass - 1),
                        fill=textfarbe,
                    )
        x += (len(SCHRIFT[zeichen][0]) + 1) * mass


def main() -> None:
    privat = Path(sys.argv[1])
    for name, (vorlage, feld, text, mass, heller) in SCHILDER.items():
        bild = Image.open(privat / ORDNER / vorlage).convert("RGBA")
        schreibe(bild, feld, text, mass, heller)
        bild.save(privat / "spiel" / "eigene" / f"{name}.png")
    print(f"{len(SCHILDER)} Schilder geschrieben")


if __name__ == "__main__":
    main()
