"""Eiserne Fachwerkbrücke für den Treidelpfad (spiel/eigene/bruecke_eisen_laengs_L.png).

Warum: Die Karte „Eisenbrücke“ (Weg 3, wegRivertonIronwood.bruecke) hatte nur eine Holzbrücke; der
Autor fragte, wo die Brücke aus Eisen ist (Revision 2, 10.11.2026). Die Geschichte (Story-Bibel 10.3,
Ortsdokument riverton.md 1.5) verlangt genietete Träger, Bohlenbelag und ein Geländer, auf dem
Corwin Lund die Farbe erneuert. Kein gekauftes Paket hat so etwas.

Aufbau (Draufsicht schräg von oben, Licht von links oben wie bei LimeZu):
- 4 Kacheln breit: links und rechts je ein Fachwerkträger (eine Kachel), dazwischen zwei Kacheln
  Bohlenbelag zum Gehen (Spalten 1 und 2 des Bildes).
- L Kacheln lang über dem Wasser, dazu oben und unten je ein steinerner Brückenkopf (eine Kachel),
  also L + 2 Kacheln hoch; darunter 4 px Schatten auf dem Wasser.
- Träger: Ober- und Untergurt, Pfosten alle 16 px, Diagonalen im Wechsel, Nieten an den Knoten.
Aufruf: ``python werkzeuge/eisenbruecke.py`` (Längen 6 bis 12).
"""

from pathlib import Path

from PIL import Image, ImageDraw

HAUPT = Path(__file__).resolve().parents[1]
ZIEL = HAUPT / "spiel" / "eigene"
CAMPING = HAUPT / "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/11_Camping_Singles_16x16"
K = 16
RAND = (58, 58, 80, 255)
SCHATTEN = (58, 58, 80, 100)
EISEN, EISEN_HELL, EISEN_DUNKEL = (96, 104, 122, 255), (138, 148, 166, 255), (66, 72, 90, 255)
NIET = (176, 184, 198, 255)
STEIN, STEIN_HELL, STEIN_DUNKEL = (150, 150, 160, 255), (190, 190, 198, 255), (108, 108, 122, 255)
LAENGEN = range(6, 13)


def planke(nummer: int) -> Image.Image:
    return Image.open(CAMPING / f"ME_Singles_Camping_16x16_Pier_{nummer}.png").convert("RGBA")


def brueckenkopf(z: ImageDraw.ImageDraw, y: int) -> None:
    """Steinerner Brückenkopf über die ganze Breite, eine Kachel hoch, Quader mit Fugen."""
    z.rectangle((0, y, 4 * K - 1, y + K - 1), fill=RAND)
    z.rectangle((1, y + 1, 4 * K - 2, y + K - 2), fill=STEIN)
    z.line((1, y + 1, 4 * K - 2, y + 1), fill=STEIN_HELL)
    z.line((1, y + 8, 4 * K - 2, y + 8), fill=STEIN_DUNKEL)
    for x in range(8, 4 * K - 1, 12):
        z.line((x, y + 2, x, y + 7), fill=STEIN_DUNKEL)
        z.line((x + 6, y + 9, x + 6, y + K - 2), fill=STEIN_DUNKEL)


def traeger(z: ImageDraw.ImageDraw, x0: int, y0: int, laenge: int) -> None:
    """Fachwerkträger von oben: zwei Gurte, Pfosten alle 16 px, Diagonalen im Wechsel, Nieten."""
    x1, y1 = x0 + K - 1, y0 + laenge * K - 1
    z.rectangle((x0, y0, x1, y1), fill=RAND)
    z.rectangle((x0 + 1, y0, x1 - 1, y1), fill=EISEN_DUNKEL)
    for gx in (x0 + 2, x1 - 4):                       # Ober- und Untergurt
        z.rectangle((gx, y0, gx + 2, y1), fill=EISEN)
        z.line((gx, y0, gx, y1), fill=EISEN_HELL)
    for i in range(laenge):
        y = y0 + i * K
        z.rectangle((x0 + 2, y, x1 - 2, y + 2), fill=EISEN)          # Pfosten
        z.line((x0 + 2, y, x1 - 2, y), fill=EISEN_HELL)
        a, b = ((x0 + 4, y + 3), (x1 - 4, y + K - 1)) if i % 2 == 0 else ((x1 - 4, y + 3), (x0 + 4, y + K - 1))
        z.line((a, b), fill=EISEN, width=2)                           # Diagonale
        for nx in (x0 + 3, x1 - 3):
            z.point((nx, y + 1), fill=NIET)
    z.rectangle((x0 + 2, y1 - 2, x1 - 2, y1), fill=EISEN)


def eisen_laengs(laenge: int) -> Image.Image:
    """Brücke von Nord nach Süd: Brückenköpfe oben und unten, dazwischen L Kacheln Fachwerk."""
    hoehe = (laenge + 2) * K
    bild = Image.new("RGBA", (4 * K, hoehe + 4))
    for i in range(laenge + 2):                            # Bohlen: Pier 11–13 sind 2 Kacheln breit
        bild.alpha_composite(planke((11, 12, 13)[i % 3]), (K, i * K))
    z = ImageDraw.Draw(bild)
    z.rectangle((K, hoehe, 3 * K - 1, hoehe + 3), fill=SCHATTEN)
    z.rectangle((3 * K, K + 4, 4 * K + 3, hoehe - K), fill=SCHATTEN)
    brueckenkopf(z, 0)
    brueckenkopf(z, hoehe - K)
    bild.alpha_composite(planke(12), (K, 0))               # Belag auf den Köpfen wieder frei
    bild.alpha_composite(planke(11), (K, hoehe - K))
    traeger(z, 0, K, laenge)
    traeger(z, 3 * K, K, laenge)
    return bild


def main() -> None:
    ZIEL.mkdir(parents=True, exist_ok=True)
    for laenge in LAENGEN:
        eisen_laengs(laenge).save(ZIEL / f"bruecke_eisen_laengs_{laenge}.png")
    print(f"{len(LAENGEN)} Eisenbrücken nach spiel/eigene/")


if __name__ == "__main__":
    main()
