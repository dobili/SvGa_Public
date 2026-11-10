"""Bildwunsch mittel-3 (Runde 9): Postkartenständer für Darlenes Laden in der Raststätte Crossroads.

Warum: Die Story-Bibel nennt den „Ständer an der Kasse“ mit der Postkarte aller Städte, und das
Gutachten zur Raststätte vermisst ihn. Im Katalog gibt es keinen Drehständer; das Zeitungsregal
liest sich als Zeitungen. Gezeichnet im Stil von LimeZu: dunkle Umrisslinie, Drahtgestell auf
rundem Fuß, drei Etagen mit bunten Karten (Himmel, Wüste, Wald, Meer), 16 × 32 Pixel.

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/postkartenstaender.png.
Aufruf: python postkartenstaender.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

UMRISS, DRAHT, DRAHT_HELL = (52, 56, 72, 255), (120, 128, 146, 255), (186, 192, 206, 255)
SCHATTEN = (0, 0, 0, 60)
KARTEN = [
    (110, 176, 228, 255),  # Himmel über Summit City
    (228, 168, 84, 255),  # Wüste bei Desert Springs
    (96, 168, 96, 255),  # Wald von Pinewood
    (64, 120, 196, 255),  # Meer vor Silicon Bay
    (220, 96, 96, 255),  # rote Scheune von Crossroads
    (240, 220, 120, 255),  # Weizen der Prärie
]
KARTE_HELL = (250, 250, 244, 255)


def karte(z: ImageDraw.ImageDraw, x: int, y: int, farbe: tuple[int, int, int, int]) -> None:
    """Eine Postkarte 4 × 5 Pixel: weißer Rand, farbiges Bild, Umriss."""
    z.rectangle((x, y, x + 3, y + 4), fill=KARTE_HELL, outline=UMRISS)
    z.rectangle((x + 1, y + 1, x + 2, y + 2), fill=farbe)


def postkartenstaender() -> Image.Image:
    """Fuß, Stange, drei Etagen mit je drei Karten, Schild oben."""
    bild = Image.new("RGBA", (16, 32))
    z = ImageDraw.Draw(bild)
    z.ellipse((2, 28, 13, 31), fill=SCHATTEN)
    z.ellipse((3, 27, 12, 30), fill=DRAHT, outline=UMRISS)  # Fuß
    z.line((7, 3, 7, 28), fill=UMRISS)
    z.line((8, 3, 8, 28), fill=DRAHT_HELL)  # Stange
    for etage, y in enumerate((5, 12, 19)):
        z.line((1, y + 5, 14, y + 5), fill=DRAHT)  # Drahtablage
        for spalte, x in enumerate((1, 6, 11)):
            karte(z, x, y, KARTEN[(etage * 3 + spalte) % len(KARTEN)])
    z.rectangle((4, 0, 11, 3), fill=(196, 52, 52, 255), outline=UMRISS)  # Schild
    z.line((6, 1, 9, 1), fill=KARTE_HELL)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1]) / "spiel" / "eigene"
    postkartenstaender().save(ziel / "postkartenstaender.png")
    print("postkartenstaender.png geschrieben")


if __name__ == "__main__":
    main()
