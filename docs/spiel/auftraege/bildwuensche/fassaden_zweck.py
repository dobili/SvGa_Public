"""Bildwunsch: eine Fassade je Zweck aus LimeZus Flachdachladen (spiel/eigene/), Entwurf von mittel-1.

Warum: Dasselbe graue Flachdachhaus mit rot-weißer Markise (``Hardware_Store``) stand als Diner,
Waschsalon, Rasthaus, Café, Laden und Eisenwaren in sieben Orten (Gutachten Runde 8, Punkt h). Man
erkennt nicht, was drin ist, und es wirkt kopiert. Dieses Werkzeug macht aus der Vorlage je Zweck
eine eigene Fassade: andere Markisenfarbe, andere Dachfarbe und ein Schild mit dem Zweck auf der
Dachkante. Größe, Tür und Schaufenster bleiben gleich (128 × 144, Tür x 16–47 wie im Original),
deshalb ändern sich in den Szenen weder Lage noch Übergänge, nur die Bildquelle der Möbel.

Bilder (128 × 144): ``fassade_diner``, ``fassade_waschsalon``, ``fassade_rasthaus``,
``fassade_cafe``, ``fassade_laden``, ``fassade_eisenwaren``.

Aufruf: ``python fassaden_zweck.py <Pfad zum privaten Repository>``. Liest die Vorlage aus
``modern-exteriors`` (nicht im öffentlichen Repository) und schreibt nach ``spiel/eigene/``.
"""

import colorsys
import sys
from pathlib import Path

from PIL import Image, ImageDraw

VORLAGE = (
    "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/4_Generic_Building_Singles_16x16/"
    "ME_Singles_Generic_Building_16x16_Hardware_Store.png"
)
RAND = (58, 58, 80, 255)
# Farben der Vorlage: Markise rot und creme, Dachfläche graublau.
MARKISE_ROT = {(167, 96, 74), (161, 79, 68), (157, 67, 62), (148, 60, 63)}
MARKISE_HELL = {(208, 190, 156), (224, 208, 178), (195, 172, 144)}
DACH = {(125, 127, 153), (108, 110, 133), (113, 111, 121), (126, 125, 134)}
SCHILD_Y = 78  # Oberkante des Schilds auf der vorderen Dachkante

SCHRIFT = {
    "A": [".#.", "#.#", "###", "#.#", "#.#"],
    "C": ["###", "#..", "#..", "#..", "###"],
    "D": ["##.", "#.#", "#.#", "#.#", "##."],
    "E": ["###", "#..", "##.", "#..", "###"],
    "F": ["###", "#..", "##.", "#..", "#.."],
    "H": ["#.#", "#.#", "###", "#.#", "#.#"],
    "I": ["###", ".#.", ".#.", ".#.", "###"],
    "L": ["#..", "#..", "#..", "#..", "###"],
    "N": ["#..#", "##.#", "#.##", "#..#", "#..#"],
    "O": ["###", "#.#", "#.#", "#.#", "###"],
    "R": ["##.", "#.#", "##.", "#.#", "#.#"],
    "S": ["###", "#..", "###", "..#", "###"],
    "T": ["###", ".#.", ".#.", ".#.", ".#."],
    "U": ["#.#", "#.#", "#.#", "#.#", "###"],
    "W": ["#...#", "#...#", "#.#.#", "##.##", "#...#"],
    "É": ["###", "#..", "##.", "#..", "###"],
}

# Zweck: (Markise dunkel, Markise hell, Farbton Dach in Grad oder None, Schildgrund, Schrift, Text)
ZWECKE = {
    "diner": ((196, 40, 52), (246, 246, 240), 175, (40, 34, 48), (255, 120, 140), "DINER"),
    "waschsalon": ((52, 112, 196), (236, 244, 252), 205, (246, 248, 252), (40, 90, 170), "WASCHSALON"),
    "rasthaus": ((52, 128, 72), (226, 220, 180), 95, (60, 96, 60), (246, 240, 210), "RASTHAUS"),
    "cafe": ((120, 78, 52), (232, 214, 182), 25, (92, 60, 44), (246, 230, 200), "CAFÉ"),
    "laden": ((216, 168, 40), (250, 244, 220), 45, (246, 240, 220), (120, 80, 30), "LADEN"),
    "eisenwaren": ((167, 96, 74), (208, 190, 156), None, (70, 70, 94), (230, 230, 236), "EISENWAREN"),
}


def faerben(bild: Image.Image, dunkel: tuple, hell: tuple, farbton: float | None) -> Image.Image:
    """Markise in die neuen Farben (Helligkeit der Vorlage bleibt), Dach im neuen Farbton."""
    neu = bild.copy()
    px = neu.load()
    for y in range(neu.height):
        for x in range(neu.width):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if (r, g, b) in MARKISE_ROT:
                faktor = (r + g + b) / (167 + 96 + 74)
                px[x, y] = tuple(min(255, round(c * faktor)) for c in dunkel) + (a,)
            elif (r, g, b) in MARKISE_HELL:
                faktor = (r + g + b) / (224 + 208 + 178)
                px[x, y] = tuple(min(255, round(c * faktor)) for c in hell) + (a,)
            elif farbton is not None and (r, g, b) in DACH:
                _, hell_wert, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
                rr, gg, bb = colorsys.hls_to_rgb(farbton / 360, hell_wert, min(0.18, s + 0.06))
                px[x, y] = (round(rr * 255), round(gg * 255), round(bb * 255), a)
    return neu


def textbreite(text: str, mass: int) -> int:
    return sum((len(SCHRIFT[z][0]) + 1) * mass for z in text) - mass


def schild(bild: Image.Image, grund: tuple, schrift: tuple, text: str) -> None:
    """Schild mittig auf der Dachkante: Rahmen, Grund, Schrift (doppelt groß, wenn sie passt)."""
    mass = 2 if textbreite(text, 2) <= 96 else 1
    breite, hoehe = textbreite(text, mass) + 8, 5 * mass + 6
    x0, y0 = (bild.width - breite) // 2, SCHILD_Y - (hoehe - 11) // 2
    z = ImageDraw.Draw(bild)
    z.rectangle((x0, y0, x0 + breite - 1, y0 + hoehe - 1), fill=grund + (255,), outline=RAND)
    x = x0 + 4
    for zeichen in text:
        muster = SCHRIFT[zeichen]
        for r, reihe in enumerate(muster):
            for s, p in enumerate(reihe):
                if p == "#":
                    z.rectangle(
                        (
                            x + s * mass,
                            y0 + 3 + r * mass,
                            x + s * mass + mass - 1,
                            y0 + 3 + r * mass + mass - 1,
                        ),
                        fill=schrift + (255,),
                    )
        if zeichen == "É":
            z.rectangle((x + mass, y0 + 1, x + 2 * mass - 1, y0 + 1), fill=schrift + (255,))
        x += (len(muster[0]) + 1) * mass


def main() -> None:
    privat = Path(sys.argv[1])
    vorlage = Image.open(privat / VORLAGE).convert("RGBA")
    ziel = privat / "spiel" / "eigene"
    for name, (dunkel, hell, farbton, grund, schrift, text) in ZWECKE.items():
        bild = faerben(vorlage, dunkel, hell, farbton)
        schild(bild, grund, schrift, text)
        bild.save(ziel / f"fassade_{name}.png")
    print(f"{len(ZWECKE)} Fassaden nach {ziel}")


if __name__ == "__main__":
    main()
