"""Bildwunsch: Rollgitter über dem Treppenausgang des U-Bahnhofs (spiel/eigene/), Entwurf von mittel-1.

Warum: Im U-Bahnhof Capital Arena war der Ausgang eine braune Holztür in der Südwand; die
Beschreibung und die Geschichte (Kreidenacht: „das Rollgitter geht um Mitternacht herunter“) brauchen
eine Treppe nach oben mit Rollgitter (variantenwahl.md, capital-arena-ubahnhof, Mangel 1). LimeZus
Paket hat Treppen (``Stairs_1``), aber kein Rollgitter für einen Treppenabgang; die Ladenrollos
(``Shutter_*``) sind ganze Fassaden.

Bild: ``rollgitter_offen.png`` (48 × 16): Stahlrahmen über drei Kacheln, das Gitter halb
hochgezogen (Lamellen oben), darunter dunkel der Treppenaufgang. Es hängt an der Südwand über der
Treppe (``an_wand``).

Aufruf: ``python ubahn_rollgitter.py <Pfad zum privaten Repository>``. Nur PIL.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

RAND = (58, 58, 80, 255)
STAHL, STAHL_HELL, STAHL_DUNKEL = (150, 156, 170, 255), (200, 206, 216, 255), (100, 104, 120, 255)
DUNKEL = (36, 36, 50, 255)


def rollgitter() -> Image.Image:
    bild = Image.new("RGBA", (48, 16))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 0, 47, 15), fill=RAND)
    z.rectangle((3, 3, 44, 15), fill=DUNKEL)  # Öffnung zur Treppe
    z.rectangle((1, 1, 46, 2), fill=STAHL_HELL)  # Rahmen oben
    z.rectangle((1, 3, 2, 15), fill=STAHL)  # Seiten
    z.rectangle((45, 3, 46, 15), fill=STAHL)
    for y in range(3, 9, 2):  # halb hochgezogene Lamellen
        z.line((3, y, 44, y), fill=STAHL)
        z.line((3, y + 1, 44, y + 1), fill=STAHL_DUNKEL)
    z.line((3, 9, 44, 9), fill=STAHL_HELL)  # Unterkante des Gitters
    return bild


def main() -> None:
    ziel = Path(sys.argv[1]) / "spiel" / "eigene"
    rollgitter().save(ziel / "rollgitter_offen.png")
    print("rollgitter_offen.png geschrieben")


if __name__ == "__main__":
    main()
