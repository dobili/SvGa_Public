"""Roter Wüstensand mit Rand zu Gras, mit Innenecken und Schrägen (mittel-2, 11.11.2026).

Warum: Gutachten Canyonrand, Punkt 4: „Grenze Wald–Fels als Treppe“. Roter Sand (fels_rot.png) hat
keine Randkacheln; wo er an Gras stößt, entstehen Kachelstufen. Dieser Bogen hat dieselbe Ordnung
wie ``piste_rot.png`` (3 × 3-Block, vier Innenecken, vier Schrägen), innen roter Sand, außen
LimeZus Gras. Eine Grenze, die je Reihe um eine Spalte wandert, zeichnet der Kartenbauer damit als
schräge Linie (Boden ``sandRotRand`` in materialien.json, mit ``diagonalen``). Gedacht ist er für
einen schmalen Saum an der Grenze; die Fläche dahinter bleibt ``sandRot`` mit seinen Varianten.

Dazu zwei Bilder für die Nachprüfung des Canyonrands (11.11.2026, „es fehlen Bögen“, „Canyonboden
nur wenig dunkler“):
- ``weg_rot.png``: LimeZus Erdweg innen, roter Sand außen, gleiche Ordnung. Damit bekommt der Weg
  auch im roten Sand Ränder und Schrägen (Boden ``erdeRot`` mit ``rand_gegen``).
- ``fels_rot_dunkel.png``: ``fels_rot.png`` abgedunkelt, für den Canyonboden im Schatten der Wand
  (Boden ``felsbodenRotDunkel``).

Aufruf: ``python sand_rot_gras.py <privates Repository>``; schreibt spiel/eigene/sand_rot_gras.png,
weg_rot.png (je 112 × 64) und fels_rot_dunkel.png (Größe wie fels_rot.png). Braucht ``piste_rot.py``
im selben Ordner.
"""

import sys
from pathlib import Path

from PIL import Image
from piste_rot import K, _kachel, pistenbogen

GELAENDE = "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/1_Terrains_and_Fences_16x16.png"
GRAS_FELD = (3, 8)
ERDE_FELD = (1, 31)
SCHATTEN = 0.62  # Helligkeit des Canyonbodens gegenüber der Hochfläche


def flaechenbogen(gelaende: Image.Image, feld: tuple[int, int]) -> Image.Image:
    """Ein Bogen 4 × 2 Kacheln voll der Kachel ``feld``: ``pistenbogen`` liest aus [2..3, 0..1]."""
    gras = _kachel(gelaende, feld)
    bild = Image.new("RGBA", (4 * K, 2 * K))
    for sp in range(4):
        for ze in range(2):
            bild.paste(gras, (sp * K, ze * K))
    return bild


def main() -> None:
    privat = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    gelaende = Image.open(privat / GELAENDE).convert("RGBA")
    sand = Image.open(privat / "spiel" / "eigene" / "fels_rot.png").convert("RGBA")
    eigene = privat / "spiel" / "eigene"
    pistenbogen(sand, flaechenbogen(gelaende, GRAS_FELD)).save(eigene / "sand_rot_gras.png")
    pistenbogen(flaechenbogen(gelaende, ERDE_FELD), sand).save(eigene / "weg_rot.png")
    dunkel = Image.eval(sand, lambda wert: round(wert * SCHATTEN))
    dunkel.putalpha(sand.getchannel("A"))
    dunkel.save(eigene / "fels_rot_dunkel.png")
    print("Sandsaum, Weg im roten Sand und dunkler Canyonboden nach", eigene)


if __name__ == "__main__":
    main()
