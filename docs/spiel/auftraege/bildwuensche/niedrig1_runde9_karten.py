"""Bildwunsch von niedrig-1 (Runde 9): Bilder für die übrigen Karten (Ghost Town, Goldmine, Erinnerungen,
Kürbishof, Tankstelle), nach den Mängeln in ``variantenwahl.md``.

Entwurf zum Übernehmen in ``werkzeuge/`` des privaten Repositorys. Nur Code, keine LimeZu-Dateien:
Wo ein Bild aus einem Paket abgewandelt wird, lädt das Skript es aus dem privaten Repository.

Bilder (in ``spiel/eigene/``, Breite × Höhe in Pixeln):
- ``fenster_nacht.png`` (32 × 32): das Holzfenster ``spiel/generic/generic_087.png`` mit Nachthimmel
  statt Tageslicht (dunkelblaues Glas, drei Sterne). Siedlungshütte 1866: Die Erinnerung spielt nachts.
- ``tisch_rund_dunkel.png`` (32 × 32): der runde Tisch aus Modern Interiors (Basement 3) in dunklem
  Holz. Die Beschreibung der Hütte nennt einen dunklen Tisch; der helle wirkte wie ein Gartentisch.
- ``staub_boden.png`` (32 × 32): durchscheinender Staub- und Ölfleck für Böden verlassener Räume
  (Tankstelle Weg 10: „sieht nicht verlassen aus, sauber“). Flach, ohne Kollision.
- ``spinnennetz_ecke.png`` (16 × 16): Spinnennetz für die obere Ecke einer Wand, links oben
  angeschlagen (rechts oben gespiegelt verwenden).
- ``stollen_eingang_offen.png`` (64 × 64): ``stollen_eingang.png`` ohne Bretter und rotes Kreuz, die
  Öffnung dunkel mit dem Gleis, das hineinführt. Zustand ``mine-offen`` von Ghost Town (Sperre S11:
  nach Pruitts Geschichte ist die Goldmine offen).
- ``vogelscheuche_morphy.png`` (48 × 48): die Vogelscheuche aus Modern Farm mit schwarzem Zylinder und
  einem Schachbrettflicken auf der Brust: „Morphy“ im Maisirrgarten des Kürbishofs muss als solche zu
  erkennen sein (Paul Morphy trug Zylinder).

Aufruf: python niedrig1_runde9_karten.py /home/user/schach-abenteuer-inhalte
"""

import random
import sys
from pathlib import Path

from PIL import Image, ImageDraw

FENSTER = "spiel/generic/generic_087.png"
TISCH = (
    "modern-interiors/1_Interiors/16x16/Theme_Sorter_Black_Shadow_Singles/"
    "14_Basement_Black_Shadow_Singles_16x16/Basement_Shadow_Singles_3.png"
)
NACHT = (34, 44, 82, 255)
NACHT_HELL = (52, 66, 110, 255)
STERN = (236, 232, 190, 255)
STERNE = ((8, 9), (21, 12), (12, 18))
GLAS_HELL = 170  # ab dieser Helligkeit gehört ein Pixel zum Glas
GRAU_SPANNE = 40  # Glas ist fast farblos: höchster minus niedrigster Kanal
DUNKEL = 0.58  # Faktor für dunkles Holz


def _hell(p: tuple[int, int, int, int]) -> int:
    return (p[0] + p[1] + p[2]) // 3


def fenster_nacht(haupt: Path) -> Image.Image:
    """Holzfenster mit Nachthimmel: Jeder helle, fast farblose Glaspixel wird dunkelblau, die
    Spiegelstreifen etwas heller; Rahmen und Sprosse bleiben. Drei Sterne in den Scheiben."""
    bild = Image.open(haupt / FENSTER).convert("RGBA")
    px = bild.load()
    for y in range(bild.height):
        for x in range(bild.width):
            p = px[x, y]
            if p[3] and _hell(p) >= GLAS_HELL and max(p[:3]) - min(p[:3]) <= GRAU_SPANNE:
                px[x, y] = NACHT_HELL if _hell(p) > 225 else NACHT
    for x, y in STERNE:
        if px[x, y][:3] in (NACHT[:3], NACHT_HELL[:3]):
            px[x, y] = STERN
    return bild


def tisch_rund_dunkel(haupt: Path) -> Image.Image:
    """Runder Tisch in dunklem Holz: alle Farben mit ``DUNKEL`` multipliziert, Rot etwas weniger,
    damit das Holz warm bleibt; der Umriss (fast schwarz) ändert sich dabei kaum."""
    bild = Image.open(haupt / TISCH).convert("RGBA")
    px = bild.load()
    for y in range(bild.height):
        for x in range(bild.width):
            r, g, b, a = px[x, y]
            if a:
                px[x, y] = (int(r * (DUNKEL + 0.08)), int(g * DUNKEL), int(b * DUNKEL), a)
    return bild


def staub_boden() -> Image.Image:
    """Staub und ein Ölfleck, 32 × 32, durchscheinend: graue Wolke aus versetzten Ellipsen, darin
    ein dunkler, unregelmäßiger Fleck. Fester Zufall, damit das Bild bei jedem Lauf gleich ist."""
    zufall = random.Random(9)
    bild = Image.new("RGBA", (32, 32))
    schicht = Image.new("RGBA", (32, 32))
    z = ImageDraw.Draw(schicht)
    for _ in range(14):
        x, y = zufall.randint(2, 24), zufall.randint(4, 24)
        z.ellipse((x, y, x + zufall.randint(4, 8), y + zufall.randint(3, 6)), fill=(120, 108, 92, 46))
    z.ellipse((11, 13, 21, 19), fill=(40, 36, 34, 110))
    z.ellipse((15, 16, 24, 21), fill=(40, 36, 34, 90))
    bild.alpha_composite(schicht)
    return bild


def spinnennetz_ecke() -> Image.Image:
    """Spinnennetz 16 × 16 links oben: fünf Speichen aus der Ecke, dazwischen drei Bögen, hellgrau
    und halb durchsichtig."""
    bild = Image.new("RGBA", (16, 16))
    z = ImageDraw.Draw(bild)
    faden = (225, 225, 230, 170)
    for ex, ey in ((15, 0), (14, 6), (11, 11), (6, 14), (0, 15)):
        z.line((0, 0, ex, ey), fill=faden)
    for r in (5, 9, 13):
        z.arc((-r, -r, r, r), 0, 90, fill=faden)
    return bild


STOLLEN = "spiel/eigene/stollen_eingang.png"
OEFFNUNG = (22, 23, 41, 50)  # links, oben, rechts, unten der Öffnung zwischen den Türstöcken
DUNKEL_OBEN = (18, 14, 14, 255)
DUNKEL_UNTEN = (52, 40, 34, 255)
SCHIENE = (120, 124, 140, 255)
SCHWELLE = (96, 70, 52, 255)


def stollen_eingang_offen(haupt: Path) -> Image.Image:
    """Stolleneingang ohne Absperrung: Die Öffnung zwischen den Türstöcken wird von oben nach unten
    dunkel (Verlauf), darin laufen Schwellen und zwei Schienen in die Tiefe; Rahmen und Fels bleiben."""
    bild = Image.open(haupt / STOLLEN).convert("RGBA")
    z = ImageDraw.Draw(bild)
    x0, y0, x1, y1 = OEFFNUNG
    for y in range(y0, y1 + 1):
        a = (y - y0) / (y1 - y0)
        farbe = tuple(int(o + (u - o) * a) for o, u in zip(DUNKEL_OBEN, DUNKEL_UNTEN, strict=False))
        z.line((x0, y, x1, y), fill=farbe)
    mitte = (x0 + x1) // 2
    for y in range(y1, y0 + 8, -4):
        breite = 3 + (y - y0) // 6
        z.line((mitte - breite - 1, y, mitte + breite + 1, y), fill=SCHWELLE)
    z.line((mitte - 3, y0 + 8, mitte - 7, y1), fill=SCHIENE)
    z.line((mitte + 3, y0 + 8, mitte + 7, y1), fill=SCHIENE)
    return bild


VOGELSCHEUCHE = "modern-farm/Single_Files_16x16/0_Complete_Tileset_Singles_16x16/Scarecrow_16x16.png"
ZYLINDER = (30, 28, 36, 255)
ZYLINDER_HELL = (70, 66, 80, 255)
HUTBAND = (150, 40, 40, 255)
FELD_HELL = (236, 230, 210, 255)


def vogelscheuche_morphy(haupt: Path) -> Image.Image:
    """Vogelscheuche mit Zylinder statt Schlapphut und einem Flicken aus 4 × 4 Schachfeldern auf der
    Brust. Der Zylinder sitzt auf dem Kopf (Krempe über dem alten Hut), mit rotem Band."""
    bild = Image.open(haupt / VOGELSCHEUCHE).convert("RGBA")
    z = ImageDraw.Draw(bild)
    z.rectangle((17, 1, 30, 12), fill=ZYLINDER)
    z.line((18, 2, 18, 11), fill=ZYLINDER_HELL)
    z.rectangle((17, 10, 30, 11), fill=HUTBAND)
    z.rectangle((13, 12, 34, 14), fill=ZYLINDER)
    for i in range(4):
        for j in range(4):
            farbe = FELD_HELL if (i + j) % 2 == 0 else ZYLINDER
            z.rectangle((19 + 2 * i, 22 + 2 * j, 20 + 2 * i, 23 + 2 * j), fill=farbe)
    return bild


def main(haupt: Path) -> None:
    ziel = haupt / "spiel" / "eigene"
    fenster_nacht(haupt).save(ziel / "fenster_nacht.png")
    tisch_rund_dunkel(haupt).save(ziel / "tisch_rund_dunkel.png")
    staub_boden().save(ziel / "staub_boden.png")
    spinnennetz_ecke().save(ziel / "spinnennetz_ecke.png")
    stollen_eingang_offen(haupt).save(ziel / "stollen_eingang_offen.png")
    vogelscheuche_morphy(haupt).save(ziel / "vogelscheuche_morphy.png")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
