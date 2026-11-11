"""Bildwunsch von niedrig-1 (Runde 10): Anbindebalken, Weiche im Stollen, helle Läden in London.

Entwurf zum Übernehmen in ``werkzeuge/`` des privaten Repositorys. Nur Code, keine LimeZu-Dateien.
Stil wie ``schilder.py``: LimeZus Umriss ``RAHMEN``, durchscheinender Schatten unten, Schrägansicht
von oben (KARTENREGELN 10.60).

Bilder (in ``spiel/eigene/``, Breite × Höhe in Pixeln):
- ``anbindebalken.png`` (48 × 16): Balken zum Anbinden der Pferde, wie er vor jedem Mietstall im
  Westen stand: zwei Pfosten, darauf ein runder Querbalken, daran ein Strick. Warum: Im Gutachten
  ``gemini-fahrzeuge-teil2.md`` stand das Pferd in Ghost Town frei auf der Straße.
- ``weiche_stollen.png`` (64 × 64): Weiche der Grubenbahn. Das Hauptgleis läuft links senkrecht
  durch (zwei Kacheln breit, vier hoch), von unten biegt ein Gleis im Viertelkreis nach rechts ab
  und endet am rechten Rand auf der Höhe eines Quergleises (oberste zwei Reihen). Farben und
  Schwellen kommen aus LimeZus braunem Gleis, damit die Weiche zu den geraden Stücken passt.
  Warum: Gutachten ``niedrig-1-5.md``, der Abzweig stieß stumpf an den Hauptgang.
- ``london_<buchladen|schneider|kaffeehaus|schachsalon|pub>_hell.png`` (112 × 192): die fünf
  Gemini-Fronten vom Strand mit beleuchteter Ladenzone. Die unteren 51 Pixel werden heller, das
  dunkle Glas der Schaufenster und Türen bekommt warmes Gaslicht. Warum: Gutachten
  ``niedrig-1-5.md``, Schaufenster und Türen waren unter der Sepia-Tönung kaum zu erkennen.

Aufruf: python niedrig1_runde10.py /home/user/schach-abenteuer-inhalte
"""

import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw
from schilder import RAHMEN  # im privaten Repository: werkzeuge/schilder.py

SCHATTEN = (58, 58, 80, 90)
HOLZ_HELL = (176, 132, 88, 255)
HOLZ = (142, 100, 66, 255)
HOLZ_DUNKEL = (104, 70, 48, 255)
STRICK = (214, 196, 150, 255)

GLEIS_SENKRECHT = (
    "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/"
    "20_Subway_and_Train_Station_Singles_16x16/"
    "ME_Singles_Subway_and_Train_Station_16x16_Brown_Rail_Modular_Vertical.png"
)
SCHIENE = (198, 189, 213, 255)
SCHIENE_RAND = (139, 139, 171, 255)
SCHWELLE = (113, 100, 103, 255)
SCHWELLE_RAND = (58, 58, 80, 255)
WEICHE_B, WEICHE_H = 64, 64
# Mittelpunkt des Viertelkreises: rechter Bildrand, unterer Bildrand. Die Halbmesser treffen die
# Schienen des senkrechten Gleises (x = 5 und 24) und die des Quergleises (y = 4 und 24).
BOGEN_MITTE = (64, 64)
HALBMESSER_AUSSEN, HALBMESSER_INNEN = 59, 40
SCHWELLEN_IM_BOGEN = 9

LONDON = ("buchladen", "schneider", "kaffeehaus", "schachsalon", "pub")
LADENZONE_AB = 141  # erste Pixelreihe der Ladenzone (Erdgeschoss) in den 192 Pixel hohen Fronten
HELLER_FAKTOR, HELLER_PLUS = 1.2, 14
GASLICHT = (236, 190, 112)
GLAS_DUNKEL = 62  # Helligkeit, unter der bläuliches Glas als unbeleuchtet gilt
LICHT_ANTEIL = 0.5
BLAUSTICH = 8  # so viel stärker als Rot und Grün ist Blau im Glas (Rahmen sind grau oder farbig)


def anbindebalken() -> Image.Image:
    """Anbindebalken 48 × 16: zwei Pfosten mit Schatten, oben der Querbalken mit Glanzkante, in der
    Mitte ein umgeschlungener Strick."""
    bild = Image.new("RGBA", (48, 16))
    z = ImageDraw.Draw(bild)
    z.rectangle((3, 13, 44, 15), fill=SCHATTEN)
    for x in (5, 39):  # Pfosten
        z.rectangle((x, 3, x + 3, 14), fill=RAHMEN)
        z.rectangle((x + 1, 4, x + 2, 13), fill=HOLZ_DUNKEL)
    z.rectangle((1, 2, 46, 7), fill=RAHMEN)  # Querbalken
    z.rectangle((2, 3, 45, 6), fill=HOLZ)
    z.line((2, 3, 45, 3), fill=HOLZ_HELL)
    z.line((2, 6, 45, 6), fill=HOLZ_DUNKEL)
    z.rectangle((21, 2, 24, 7), fill=STRICK, outline=RAHMEN)  # Strick
    z.line((23, 8, 25, 11), fill=STRICK)
    return bild


def _bogenpunkt(halbmesser: float, winkel: float) -> tuple[float, float]:
    """Punkt auf dem Viertelkreis um ``BOGEN_MITTE``; Winkel 0 liegt links, 90 Grad oben."""
    bogen = math.radians(winkel)
    return (
        BOGEN_MITTE[0] - halbmesser * math.cos(bogen),
        BOGEN_MITTE[1] - halbmesser * math.sin(bogen),
    )


def weiche_stollen(haupt: Path) -> Image.Image:
    """Weiche 64 × 64: links das senkrechte LimeZu-Gleis viermal untereinander, darüber der Bogen
    aus Schwellen (quer zur Fahrtrichtung) und zwei Schienen, die im Hauptgleis beginnen."""
    bild = Image.new("RGBA", (WEICHE_B, WEICHE_H))
    gleis = Image.open(haupt / GLEIS_SENKRECHT).convert("RGBA")
    for y in range(0, WEICHE_H, gleis.height):
        bild.alpha_composite(gleis, (0, y))
    z = ImageDraw.Draw(bild)
    for i in range(SCHWELLEN_IM_BOGEN):  # Schwellen, erst ab dem Rand des Hauptgleises
        winkel = 22 + i * (90 - 22) / (SCHWELLEN_IM_BOGEN - 1)
        innen = _bogenpunkt(HALBMESSER_INNEN - 3, winkel)
        aussen = _bogenpunkt(HALBMESSER_AUSSEN + 3, winkel)
        z.line((*innen, *aussen), fill=SCHWELLE_RAND, width=4)
        z.line((*innen, *aussen), fill=SCHWELLE, width=2)
    for halbmesser in (HALBMESSER_AUSSEN, HALBMESSER_INNEN):  # Schienen
        punkte = [_bogenpunkt(halbmesser, w) for w in range(0, 91, 3)]
        z.line(punkte, fill=SCHIENE_RAND, width=3)
        z.line(punkte, fill=SCHIENE, width=1)
    return bild


def _ist_glas(farbe: tuple[int, int, int, int]) -> bool:
    """Dunkles, bläuliches Glas: wenig Licht und deutlich mehr Blau als Rot und Grün."""
    rot, gruen, blau, deckung = farbe
    dunkel = (rot + gruen + blau) / 3 < GLAS_DUNKEL
    return deckung > 0 and dunkel and blau >= rot + BLAUSTICH and blau >= gruen + BLAUSTICH


def laden_hell(haupt: Path, name: str) -> Image.Image:
    """Front ``london_<name>.png`` mit heller Ladenzone: unterhalb von ``LADENZONE_AB`` wird jede
    Farbe aufgehellt; dunkles Glas mischt sich mit Gaslicht, oben im Fenster stärker als unten."""
    bild = Image.open(haupt / "spiel" / "eigene" / f"london_{name}.png").convert("RGBA")
    pixel = bild.load()
    hoehe_zone = bild.height - LADENZONE_AB
    for y in range(LADENZONE_AB, bild.height):
        for x in range(bild.width):
            farbe = pixel[x, y]
            if farbe[3] == 0:
                continue
            if _ist_glas(farbe):
                anteil = LICHT_ANTEIL * (1 - 0.4 * (y - LADENZONE_AB) / hoehe_zone)
                neu = [round(farbe[i] * (1 - anteil) + GASLICHT[i] * anteil) for i in range(3)]
            else:
                neu = [min(255, round(farbe[i] * HELLER_FAKTOR + HELLER_PLUS)) for i in range(3)]
            pixel[x, y] = (*neu, farbe[3])
    return bild


def main(haupt: Path) -> None:
    ziel = haupt / "spiel" / "eigene"
    anbindebalken().save(ziel / "anbindebalken.png")
    weiche_stollen(haupt).save(ziel / "weiche_stollen.png")
    for name in LONDON:
        laden_hell(haupt, name).save(ziel / f"london_{name}_hell.png")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
