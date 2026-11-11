"""Kasse und Speiseplan für die Werkskantine Ironwood (Entwurf, mittel-4, Gutachten Kantine 3).

Warum: Der Gutachter fand die Kasse nicht („Wo zahlt man?“): Die Marktkasse des Pakets ist 16 × 16
und dunkel, auf dem Tresen geht sie unter. Der Speiseplan war eine Schultafel und las sich nicht als
Speiseplan.

- ``kantine_kasse.png`` (32 × 32): Registrierkasse von vorn, heller Kasten mit Anzeige, Tasten,
  Bonrolle und offener Geldlade; steht auf dem Tresen der Essensausgabe.
- ``kantine_speiseplan.png`` (32 × 16): Tafel im Holzrahmen mit Überschriftbalken und drei Zeilen
  mit Preis; hängt an der Nordwand des Gastraums.

Aufruf: ``python kantine_kasse.py <privates Repository>`` (schreibt nach ``spiel/eigene/``).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

UMRISS, KASTEN, KASTEN_HELL, KASTEN_DUNKEL = (44, 40, 52, 255), (196, 190, 178, 255), (226, 222, 212, 255), (150, 144, 136, 255)
ANZEIGE, ZIFFER, TASTE, TASTE_ROT, PAPIER = (38, 60, 52, 255), (140, 232, 150, 255), (92, 96, 110, 255), (200, 66, 56, 255), (246, 244, 236, 255)
LADE, GELD, MUENZE = (120, 112, 104, 255), (118, 170, 108, 255), (230, 196, 84, 255)
RAHMEN, RAHMEN_HELL, TAFEL, KREIDE, KREIDE_GELB = (112, 70, 40, 255), (160, 106, 62, 255), (40, 70, 58, 255), (232, 236, 226, 255), (240, 214, 120, 255)


def kasse() -> Image.Image:
    """Registrierkasse 32 × 32; die unteren 10 Pixel sind die offene Geldlade."""
    bild = Image.new("RGBA", (32, 32))
    z = ImageDraw.Draw(bild)
    z.rectangle((13, 1, 19, 6), fill=UMRISS)  # Bonrolle
    z.rectangle((14, 2, 18, 6), fill=PAPIER)
    z.rectangle((6, 5, 25, 12), fill=UMRISS)  # Kopf mit Anzeige
    z.rectangle((7, 6, 24, 11), fill=KASTEN_HELL)
    z.rectangle((9, 7, 22, 10), fill=ANZEIGE)
    for x in (12, 15, 18, 21):
        z.line((x, 8, x, 9), fill=ZIFFER)
    z.rectangle((4, 12, 27, 23), fill=UMRISS)  # Tastenfeld
    z.rectangle((5, 13, 26, 22), fill=KASTEN)
    z.line((5, 13, 26, 13), fill=KASTEN_HELL)
    for reihe in range(3):
        for spalte in range(5):
            farbe = TASTE_ROT if (reihe, spalte) == (2, 4) else TASTE
            x, y = 7 + spalte * 4, 15 + reihe * 3
            z.rectangle((x, y, x + 1, y + 1), fill=farbe)
    z.rectangle((3, 23, 28, 31), fill=UMRISS)  # Geldlade, herausgezogen
    z.rectangle((4, 24, 27, 30), fill=LADE)
    z.rectangle((5, 25, 14, 28), fill=GELD)
    z.line((10, 25, 10, 28), fill=LADE)
    for x in (17, 20, 23):
        z.rectangle((x, 26, x + 1, 27), fill=MUENZE)
    z.line((4, 30, 27, 30), fill=KASTEN_DUNKEL)
    return bild


def speiseplan() -> Image.Image:
    """Speiseplan 32 × 16: Überschrift in Gelb, drei Gerichte mit Preis in Kreide."""
    bild = Image.new("RGBA", (32, 16))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 0, 31, 15), fill=UMRISS)
    z.rectangle((1, 1, 30, 14), fill=RAHMEN)
    z.line((1, 1, 30, 1), fill=RAHMEN_HELL)
    z.rectangle((3, 3, 28, 12), fill=TAFEL)
    z.line((9, 4, 22, 4), fill=KREIDE_GELB)  # Überschrift
    for i, laenge in enumerate((12, 9, 14)):
        y = 6 + i * 2
        z.line((5, y, 5 + laenge, y), fill=KREIDE)
        z.line((23, y, 26, y), fill=KREIDE_GELB)  # Preis
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".") / "spiel" / "eigene"
    kasse().save(ziel / "kantine_kasse.png")
    speiseplan().save(ziel / "kantine_speiseplan.png")
    print("Kasse und Speiseplan nach", ziel)


if __name__ == "__main__":
    main()
