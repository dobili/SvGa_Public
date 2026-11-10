"""Bildwunsch mittel-3 (Runde 8, Gutachten): eigene Bilder für Riverton innen.

Warum: Das Gutachten zu Slicks Wohnwagen fand die Pokale auf einem hohen Bücherregal am Boden statt
über dem Bett. Ein Wohnwagen hat ein schmales Wandbord. Das Paket hat nur das linke Ende einer
Wandleiste (Grocery 369, Schattenfassung 460); gespiegelt ergibt es das rechte Ende, beide zusammen
ein Wandbord von vier Kacheln.

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/wohnwagen_wandbord.png (64 × 16).
Aufruf: python riverton_innen.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image, ImageOps

LEISTE = (
    "modern-interiors/1_Interiors/16x16/Theme_Sorter_Black_Shadow_Singles/"
    "16_Grocery_Store_Black_Shadow_Singles_16x16/Grocery_Store_Black_Shadow_Singles_460.png"
)


def wandbord(privat: Path) -> Image.Image:
    """Linkes Ende und gespiegeltes linkes Ende nebeneinander."""
    links = Image.open(privat / LEISTE).convert("RGBA")
    bord = Image.new("RGBA", (2 * links.width, links.height))
    bord.alpha_composite(links, (0, 0))
    bord.alpha_composite(ImageOps.mirror(links), (links.width, 0))
    return bord


def main() -> None:
    privat = Path(sys.argv[1])
    wandbord(privat).save(privat / "spiel" / "eigene" / "wohnwagen_wandbord.png")


if __name__ == "__main__":
    main()
