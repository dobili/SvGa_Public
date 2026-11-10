"""Bildwunsch: Werbetafel von ZERO und verlorene Ohrstöpsel (spiel/eigene/), Entwurf von mittel-1.

Warum: Auf der Glasbrücke steht die Werbetafel von ZERO (Auslöser ``werbetafelZero``, „ZERO – Nie
wieder Fehler.“), aber LimeZus Tafel ist leer und weiß; der Gutachter fragte, wofür sie wirbt
(Gutachten Glasbrücke, Befund 11). Unter der Bank auf dem Deck liegt der verlorene Ohrstöpsel
(``fundOhrstoepsel``), den man nicht sah (Befund 7).

Bilder:
- ``werbetafel_zero.png`` (80 × 96, wie ``Billboard_1``): dunkelblaue Fläche, groß „ZERO“ in Weiß
  mit hellblauem Schein, darunter klein „NIE WIEDER FEHLER“.
- ``ohrstoepsel.png`` (16 × 16): zwei weiße Ohrstöpsel mit Kabel, klein auf dem Boden.

Aufruf: ``python zero_werbung.py <Pfad zum privaten Repository>``. Liest ``Billboard_1`` aus
``modern-exteriors`` und schreibt nach ``spiel/eigene/``.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

VORLAGE = (
    "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/3_City_Props_Singles_16x16/"
    "ME_Singles_City_Props_16x16_Billboard_1.png"
)
RAND = (58, 58, 80, 255)
GRUND, SCHEIN, WEISS = (28, 40, 92, 255), (110, 190, 255, 255), (246, 248, 252, 255)
SCHRIFT = {
    "Z": ["###", "..#", ".#.", "#..", "###"],
    "E": ["###", "#..", "##.", "#..", "###"],
    "R": ["##.", "#.#", "##.", "#.#", "#.#"],
    "O": ["###", "#.#", "#.#", "#.#", "###"],
    "N": ["#..#", "##.#", "#.##", "#..#", "#..#"],
    "I": ["#", "#", "#", "#", "#"],
    "W": ["#...#", "#...#", "#.#.#", "##.##", "#...#"],
    "D": ["##.", "#.#", "#.#", "#.#", "##."],
    "F": ["###", "#..", "##.", "#..", "#.."],
    "H": ["#.#", "#.#", "###", "#.#", "#.#"],
    "L": ["#..", "#..", "#..", "#..", "###"],
    " ": ["..", "..", "..", "..", ".."],
}


def breite(text: str, mass: int) -> int:
    return sum((len(SCHRIFT[z][0]) + 1) * mass for z in text) - mass


def schreibe(z: ImageDraw.ImageDraw, text: str, x: int, y: int, mass: int, farbe: tuple) -> None:
    for zeichen in text:
        for r, reihe in enumerate(SCHRIFT[zeichen]):
            for s, p in enumerate(reihe):
                if p == "#":
                    z.rectangle(
                        (x + s * mass, y + r * mass, x + s * mass + mass - 1, y + r * mass + mass - 1),
                        fill=farbe,
                    )
        x += (len(SCHRIFT[zeichen][0]) + 1) * mass


def tafelflaeche(bild: Image.Image) -> tuple[int, int, int, int]:
    """Rahmen der hellen Werbefläche: alle fast weißen Pixel der oberen Bildhälfte."""
    px = bild.load()
    punkte = [
        (x, y)
        for y in range(bild.height // 2)
        for x in range(bild.width)
        if px[x, y][3] and min(px[x, y][:3]) > 225
    ]
    xs, ys = [p[0] for p in punkte], [p[1] for p in punkte]
    return min(xs), min(ys), max(xs), max(ys)


def werbetafel(vorlage: Image.Image) -> Image.Image:
    bild = vorlage.copy()
    x0, y0, x1, y1 = tafelflaeche(bild)
    z = ImageDraw.Draw(bild)
    z.rectangle((x0, y0, x1, y1), fill=GRUND)
    mitte = (x0 + x1) // 2
    gross = breite("ZERO", 3)
    schreibe(z, "ZERO", mitte - gross // 2 + 1, y0 + 3, 3, SCHEIN)
    schreibe(z, "ZERO", mitte - gross // 2, y0 + 2, 3, WEISS)
    for text, zeile in (("NIE WIEDER", y0 + 19), ("FEHLER", y0 + 25)):
        schreibe(z, text, mitte - breite(text, 1) // 2, zeile, 1, SCHEIN)
    return bild


def ohrstoepsel() -> Image.Image:
    bild = Image.new("RGBA", (16, 16))
    z = ImageDraw.Draw(bild)
    z.line((4, 11, 7, 8, 9, 8, 12, 11), fill=(200, 204, 214, 255))
    for x in (3, 11):
        z.ellipse((x, 10, x + 2, 12), fill=WEISS, outline=RAND)
    return bild


def main() -> None:
    privat = Path(sys.argv[1])
    ziel = privat / "spiel" / "eigene"
    werbetafel(Image.open(privat / VORLAGE).convert("RGBA")).save(ziel / "werbetafel_zero.png")
    ohrstoepsel().save(ziel / "ohrstoepsel.png")
    print("werbetafel_zero.png und ohrstoepsel.png geschrieben")


if __name__ == "__main__":
    main()
