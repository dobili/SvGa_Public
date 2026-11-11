"""Holzkiste voller Briefe für das Antiquariat in Desert Springs (mittel-2, 11.11.2026).

Warum: Gutachten Antiquariat, Punkt 1: „Kisten mit Briefen: eine offene leere Kiste“. In der Kiste
liegen die Briefe der Familie Hale (Quest „Der Brief“); der Besucher soll sie sehen, bevor er
hineingreift. LimeZus offener Karton ist leer. Dieses Bild zeigt eine Holzkiste, aus der drei
vergilbte Umschläge ragen, einer mit rotem Siegel, zusammengehalten von einer Schnur.

Aufruf: ``python kiste_briefe.py <Pfad zum privaten Repository>``; schreibt
spiel/eigene/kiste_briefe.png (32 × 32, Fuß auf der unteren Kachel wie der Karton zuvor).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

RAND = (58, 58, 80, 255)
HOLZ, HOLZ_HELL, HOLZ_DUNKEL = (146, 104, 66, 255), (176, 132, 88, 255), (104, 72, 46, 255)
INNEN = (62, 44, 34, 255)
PAPIER, PAPIER_SCHATTEN = (236, 224, 190, 255), (206, 190, 150, 255)
SIEGEL = (176, 44, 40, 255)
SCHNUR = (120, 96, 60, 255)
SCHATTEN = (0, 0, 0, 60)
# Umschläge: (links, oben, rechts, unten), von hinten nach vorn.
UMSCHLAEGE = ((6, 5, 15, 16), (12, 3, 21, 15), (18, 6, 26, 16))


def kiste() -> Image.Image:
    """Die Kiste von schräg oben: Öffnung, Umschläge, Vorderwand mit Brettern."""
    bild = Image.new("RGBA", (32, 32))
    z = ImageDraw.Draw(bild)
    z.rectangle((4, 29, 28, 31), fill=SCHATTEN)
    z.rectangle((3, 10, 28, 18), fill=INNEN, outline=RAND)  # Öffnung
    for links, oben, rechts, unten in UMSCHLAEGE:
        z.rectangle((links, oben, rechts, unten), fill=PAPIER, outline=RAND)
        z.line((links + 1, oben + 1, (links + rechts) // 2, oben + 4), fill=PAPIER_SCHATTEN)
        z.line((rechts - 1, oben + 1, (links + rechts) // 2, oben + 4), fill=PAPIER_SCHATTEN)
    z.rectangle((15, 7, 17, 9), fill=SIEGEL)  # Siegel auf dem mittleren Umschlag
    z.line((5, 12, 27, 12), fill=SCHNUR)  # Schnur um das Bündel
    z.rectangle((3, 16, 28, 29), fill=HOLZ, outline=RAND)  # Vorderwand
    for y in (20, 25):
        z.line((4, y, 27, y), fill=HOLZ_DUNKEL)
    z.line((4, 17, 27, 17), fill=HOLZ_HELL)
    for x in (6, 25):
        z.point((x, 18), fill=RAND)
        z.point((x, 27), fill=RAND)
    return bild


def main() -> None:
    privat = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    ziel = privat / "spiel" / "eigene" / "kiste_briefe.png"
    kiste().save(ziel)
    print("Kiste mit Briefen nach", ziel)


if __name__ == "__main__":
    main()
