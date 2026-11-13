"""Wandhohe Innentür aus dem Paket (Ausschnitt, mittel-4, Runde 12, R005 und R005a).

Warum: Innentüren (Diner zu Küche und Toiletten, Clubraum zum Schulflur, Bibliothek) benutzen das
Bild der Haustür. Die Innenwand ist aber fast doppelt so hoch wie diese Tür, deshalb sieht sie falsch
aus (Rückmeldung des Autors R005). LimeZu hat wandhohe Türen nur als Animationsbogen
(``animated_door_big_N.png``, fünf Bilder zu 16 × 48 vom Zuklappen bis offen). Das erste Bild ist die
geschlossene Tür.

- ``innentuer_holz.png`` (16 × 48): Bild 1 aus ``animated_door_big_1.png`` (helles Holz).
- ``innentuer_dunkel.png`` (16 × 48): Bild 1 aus ``animated_door_big_3.png`` (rotbraun).
- ``innentuer_glas.png`` (16 × 48): Bild 1 aus ``animated_door_big_5.png`` (Holz mit Glas, Küche).

Aufruf im privaten Repository: ``python innentuer.py <privat>`` schreibt nach ``spiel/eigene/``.
"""

import sys
from pathlib import Path

from PIL import Image

BOGEN = "modern-interiors/3_Animated_objects/16x16/spritesheets/animated_door_big_{}.png"
BREITE, HOEHE = 16, 48
TUEREN = {"innentuer_holz.png": 1, "innentuer_dunkel.png": 3, "innentuer_glas.png": 5}


def innentuer(privat: Path, nummer: int) -> Image.Image:
    """Das geschlossene erste Bild eines Türbogens."""
    bogen = Image.open(privat / BOGEN.format(nummer)).convert("RGBA")
    return bogen.crop((0, 0, BREITE, HOEHE))


def main() -> None:
    privat = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    ziel = privat / "spiel" / "eigene"
    for name, nummer in TUEREN.items():
        innentuer(privat, nummer).save(ziel / name)
    print("Innentüren nach", ziel)


if __name__ == "__main__":
    main()
