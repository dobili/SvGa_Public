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


def main(haupt: Path) -> None:
    ziel = haupt / "spiel" / "eigene"
    fenster_nacht(haupt).save(ziel / "fenster_nacht.png")
    tisch_rund_dunkel(haupt).save(ziel / "tisch_rund_dunkel.png")
    staub_boden().save(ziel / "staub_boden.png")
    spinnennetz_ecke().save(ziel / "spinnennetz_ecke.png")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
