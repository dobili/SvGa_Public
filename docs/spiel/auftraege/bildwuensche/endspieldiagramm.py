"""Gerahmte Endspieldiagramme für Wards Hütte (Entwurf, mittel-4, Auftrag Runde 9).

Warum: Die Variantenwahl fand die „Endspieldiagramme an der Wand“ der Hütte nicht: zu sehen waren ein
kleines grünes Karo und ein Landschaftsbild. Kein gekauftes Paket hat ein Schachdiagramm im Rahmen.

- ``endspieldiagramm_a.png`` und ``endspieldiagramm_b.png`` (je 32 × 32): Holzrahmen, helles Papier,
  ein Brett mit 8 × 8 Feldern und wenigen Steinen (Turmendspiel und Bauernendspiel), darunter eine
  Zeile „Schrift“.

Aufruf: ``python endspieldiagramm.py <privates Repository>`` (schreibt nach ``spiel/eigene/``).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

RAHMEN, RAHMEN_HELL = (110, 70, 40, 255), (150, 100, 60, 255)
PAPIER, HELL, DUNKEL = (240, 234, 214, 255), (226, 214, 186, 255), (150, 120, 90, 255)
WEISS, SCHWARZ, SCHRIFT = (252, 252, 252, 255), (30, 30, 36, 255), (120, 110, 100, 255)
# Steine je Diagramm: (Spalte, Reihe, weiß?, Turm?)
STEINE = {
    "a": [(1, 1, False, False), (6, 6, True, False), (5, 2, True, True), (2, 6, False, True)],
    "b": [(3, 2, False, False), (4, 5, True, False), (4, 4, True, False), (3, 1, False, False)],
}


def diagramm(steine: list[tuple[int, int, bool, bool]]) -> Image.Image:
    bild = Image.new("RGBA", (32, 32))
    z = ImageDraw.Draw(bild)
    z.rectangle((1, 1, 30, 30), fill=RAHMEN)
    z.rectangle((2, 2, 29, 29), outline=RAHMEN_HELL)
    z.rectangle((4, 4, 27, 27), fill=PAPIER)
    for r in range(8):
        for s in range(8):
            x, y = 7 + s * 2, 6 + r * 2
            z.rectangle((x, y, x + 1, y + 1), fill=DUNKEL if (r + s) % 2 else HELL)
    for s, r, weiss, turm in steine:
        x, y = 7 + s * 2, 6 + r * 2
        z.rectangle((x, y, x + 1, y + 1), fill=WEISS if weiss else SCHWARZ)
        if turm:
            z.point((x, y - 1), fill=WEISS if weiss else SCHWARZ)
    z.line((8, 24, 23, 24), fill=SCHRIFT)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".") / "spiel" / "eigene"
    for name, steine in STEINE.items():
        diagramm(steine).save(ziel / f"endspieldiagramm_{name}.png")
    print("Endspieldiagramme nach", ziel)


if __name__ == "__main__":
    main()
