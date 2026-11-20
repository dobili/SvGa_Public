"""Vitrinen mit Tiefe: Ausstellungsstück aus einer flachen Vitrine in ein Gehäuse mit Deckel setzen.

Warum: Die Vitrinen im Museum Ironwood und im Antiquariat Desert Springs (``spiel/eigene/vitrine_*``)
sind Abziehbilder (R055, Regel 10.71, ``docs/spiel/auftraege/gutachten/ABZIEHBILDER.md``): reine
Front, kein Deckel. Die Gutachterin schlug das Gehäuse ``Museum_Singles_134`` von LimeZu vor (2 × 3
Kacheln, Glasdeckel von oben, Sockel) mit dem eigenen Inhalt darin. Die Stücke gehören zur
Geschichte (Zeitung von 1858, Glasfunke, Lokmodell), deshalb wird das Stück aus dem alten Bild
übernommen und nicht durch ein anderes ersetzt.

Aufruf (Bilder liegen nur im privaten Repository, Grafik ist gekauft):
``python -m pipeline.abenteuer.vitrinenbild PRIVAT`` schreibt je alter Vitrine
``PRIVAT/spiel/eigene/<name>_tief.png`` (32 × 48). ``--ziel ORDNER`` schreibt woandershin, etwa
zur Ansicht.

Verfahren: Hintergrund des alten Bilds sind Glas (hellblau) und Samt (rot). Ihre Farben werden aus
den vier Ecken des Fachs gelesen (oben Glas, unten Samt); entfernt wird nur,
was in diesen Farben vom Rand des Fachs aus zusammenhängt (Flutfüllung). Alles andere ist das
Stück, auch rote oder hellblaue Teile darin (Räder der Lok, Laterne). Das Stück kommt mittig unter
den Deckel, darüber ein leichter heller Glasschleier.
"""

import sys
from pathlib import Path

from PIL import Image

GEHAEUSE = Path(
    "modern-interiors/1_Interiors/16x16/Theme_Sorter_Singles/22_Museum_Singles/Museum_Singles_134.png"
)
VITRINEN = (
    "vitrine_lokmodell",
    "vitrine_zeitung",
    "vitrine_laterne",
    "vitrine_leer",
    "vitrine_fahrkarten",
    "vitrine_muetze",
    "vitrine_werkzeug",
    "vitrine_glasfunke",
)
# Im alten Bild (32 × 48): Fach mit Stück; Punkte in den Ecken des Fachs, an denen sicher Glas
# (oben) und Samt (unten) liegt; dort ist nie das Stück.
FACH = (4, 8, 28, 30)
HINTERGRUND_PUNKTE = ((4, 8), (27, 8), (4, 29), (27, 29))
# Im Gehäuse: Deckelfläche, unter der das Stück liegt, und Stärke des Glasschleiers.
DECKEL = (4, 4, 27, 17)
SCHLEIER = (255, 255, 255, 50)
UNDURCHSICHTIG = 255


def farben(bild: Image.Image, punkte=HINTERGRUND_PUNKTE) -> set[tuple[int, int, int]]:
    """Die deckenden Farben an den Hintergrundpunkten (RGB ohne Deckkraft)."""
    px = bild.load()
    return {px[x, y][:3] for x, y in punkte if px[x, y][3] == UNDURCHSICHTIG}


def hintergrund(fach: Image.Image, weg: set[tuple[int, int, int]]) -> set[tuple[int, int]]:
    """Pixel des Hintergrunds: vom Rand des Fachs aus erreichbar über Glas- und Samtfarben.

    Warum Flutfüllung statt Farbvergleich: Teile des Stücks haben dieselben Farben wie das Glas
    (graues Werkzeug, Lichter der Laterne); eingeschlossen bleiben sie Teil des Stücks.
    """
    px, (breite, hoehe) = fach.load(), fach.size
    gehoert = lambda x, y: px[x, y][3] == 0 or px[x, y][:3] in weg  # noqa: E731
    offen = [(x, y) for x in range(breite) for y in (0, hoehe - 1)]
    offen += [(x, y) for y in range(hoehe) for x in (0, breite - 1)]
    gesehen: set[tuple[int, int]] = set()
    while offen:
        x, y = offen.pop()
        if (x, y) in gesehen or not (0 <= x < breite and 0 <= y < hoehe) or not gehoert(x, y):
            continue
        gesehen.add((x, y))
        offen += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
    return gesehen


def stueck(alt: Image.Image) -> Image.Image | None:
    """Das Ausstellungsstück ohne Glas und Samt, auf seinen Umriss beschnitten; None, wenn leer.

    Beispiel: vitrine_lokmodell → die schwarze Lok mit roten Rädern, ohne blauen Glasgrund.
    """
    weg = farben(alt)
    fach = alt.crop(FACH)
    px = fach.load()
    for x, y in hintergrund(fach, weg):
        px[x, y] = (0, 0, 0, 0)
    rahmen = fach.getbbox()
    return fach.crop(rahmen) if rahmen else None


def vitrine(alt: Image.Image, gehaeuse: Image.Image) -> Image.Image:
    """Neues Vitrinenbild: Gehäuse mit Deckel, darin mittig das Stück, darüber der Glasschleier."""
    neu = gehaeuse.convert("RGBA").copy()
    teil = stueck(alt.convert("RGBA"))
    links, oben, rechts, unten = DECKEL
    if teil is not None:
        teil.thumbnail((rechts - links, unten - oben), Image.Resampling.NEAREST)
        x = links + (rechts - links - teil.width) // 2
        y = oben + (unten - oben - teil.height) // 2
        neu.alpha_composite(teil, (x, y))
    neu.alpha_composite(Image.new("RGBA", (rechts - links, unten - oben), SCHLEIER), (links, oben))
    return neu


def main(argv: list[str]) -> int:
    """Befehlszeile; Aufruf und Zweck im Dateikopf."""
    if not argv:
        print(__doc__)
        return 1
    privat = Path(argv[0])
    ziel = Path(argv[argv.index("--ziel") + 1]) if "--ziel" in argv else privat / "spiel" / "eigene"
    gehaeuse = Image.open(privat / GEHAEUSE)
    ziel.mkdir(parents=True, exist_ok=True)
    for name in VITRINEN:
        alt = Image.open(privat / "spiel" / "eigene" / f"{name}.png")
        vitrine(alt, gehaeuse).save(ziel / f"{name}_tief.png")
        print(f"{ziel / (name + '_tief.png')}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
