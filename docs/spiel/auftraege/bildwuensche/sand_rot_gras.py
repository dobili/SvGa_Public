"""Roter Wüstensand mit Rand zu Gras, mit Innenecken und Schrägen (mittel-2, 11.11.2026).

Warum: Gutachten Canyonrand, Punkt 4: „Grenze Wald–Fels als Treppe“. Roter Sand (fels_rot.png) hat
keine Randkacheln; wo er an Gras stößt, entstehen Kachelstufen. Dieser Bogen hat dieselbe Ordnung
wie ``piste_rot.png`` (3 × 3-Block, vier Innenecken, vier Schrägen), innen roter Sand, außen
LimeZus Gras. Eine Grenze, die je Reihe um eine Spalte wandert, zeichnet der Kartenbauer damit als
schräge Linie (Boden ``sandRotRand`` in materialien.json, mit ``diagonalen``). Gedacht ist er für
einen schmalen Saum an der Grenze; die Fläche dahinter bleibt ``sandRot`` mit seinen Varianten.

Aufruf: ``python sand_rot_gras.py <privates Repository>``; schreibt
spiel/eigene/sand_rot_gras.png (112 × 64). Braucht ``piste_rot.py`` im selben Ordner.
"""

import sys
from pathlib import Path

from PIL import Image
from piste_rot import K, _kachel, pistenbogen

GELAENDE = "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/1_Terrains_and_Fences_16x16.png"
GRAS_FELD = (3, 8)


def grasbogen(gelaende: Image.Image) -> Image.Image:
    """Ein Bogen 4 × 2 Kacheln voll Gras: ``pistenbogen`` liest die Außenfläche aus [2..3, 0..1]."""
    gras = _kachel(gelaende, GRAS_FELD)
    bild = Image.new("RGBA", (4 * K, 2 * K))
    for sp in range(4):
        for ze in range(2):
            bild.paste(gras, (sp * K, ze * K))
    return bild


def main() -> None:
    privat = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    gelaende = Image.open(privat / GELAENDE).convert("RGBA")
    sand = Image.open(privat / "spiel" / "eigene" / "fels_rot.png").convert("RGBA")
    ziel = privat / "spiel" / "eigene" / "sand_rot_gras.png"
    pistenbogen(sand, grasbogen(gelaende)).save(ziel)
    print("Roter Sand mit Grasrand nach", ziel)


if __name__ == "__main__":
    main()
