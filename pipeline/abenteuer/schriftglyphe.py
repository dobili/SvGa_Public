"""Glyphe „Z“ der Pixelschrift Pixelify Sans durch ein eindeutiges Z ersetzen.

Warum: In Pixelify Sans ist das große Z wie die Ziffer 2 gezeichnet (Haken oben links, Querstrich
in der Mitte); der Umriss unterscheidet sich von der 2 nur in zwei Ecken. Im Namensschild des
Dialogs las der Autor „2oe“ statt „Zoe“ (18.11.2026); dasselbe gilt für ZERO, Zedernwald und jede
Überschrift mit Z. Die Schrift steht unter der SIL Open Font License 1.1 ohne „Reserved Font
Name“: Ändern und unter dem Namen weitergeben ist erlaubt, Urheberzeile und Lizenz bleiben
(``app/public/lizenzen/ofl-pixelify-sans.txt``, ``docs/LIZENZEN.md``).

Das neue Z folgt dem Raster der Schrift (fünf Spalten, sieben Reihen bis zur Versalhöhe) und dem
kleinen z, das schon eine Schräge hat: oben und unten ein voller Balken, dazwischen eine Treppe von
rechts oben nach links unten. Breite, Abstände und alle anderen Glyphen bleiben, wie sie sind.

Rolle im Gesamtbild: einmaliges Werkzeug für ``app/src/abenteuer/schrift/``; die geänderte Datei
liegt im Repository. Nach einem Tausch der Schriftdatei (neue Fassung von Fontsource) erneut laufen
lassen; der Dauertest ``pipeline/tests/test_abenteuer_schriftglyphe.py`` meldet ein Z, das wieder
wie die 2 aussieht.
Abhängigkeiten: fonttools, brotli (woff2).
Aufruf: ``python -m pipeline.abenteuer.schriftglyphe`` (ändert die Datei, wenn nötig).
"""

import sys
from pathlib import Path

from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

SCHRIFT = Path(__file__).resolve().parents[2] / "app/src/abenteuer/schrift/pixelify-sans-latin-600.woff2"

Punkt = tuple[int, int]

# Raster der Schrift im Schnitt 600 (aus den Glyphen „2“ und „z“ gelesen): linke und rechte Kante
# der fünf Spalten, untere und obere Kante der sieben Reihen. Nachbarn überlappen, weil der fette
# Schnitt jedes Pixel nach allen Seiten wachsen lässt.
SPALTE_LINKS = (61, 150, 238, 328, 417)
SPALTE_RECHTS = (179, 268, 358, 446, 536)
REIHE_UNTEN = (-11, 75, 163, 251, 337, 424, 511)
REIHE_OBEN = (113, 200, 288, 374, 461, 548, 636)
REIHEN = len(REIHE_UNTEN)
SPALTEN = len(SPALTE_LINKS)


def z_umriss() -> list[Punkt]:
    """Der Umriss des neuen Z im Uhrzeigersinn, beginnend unten links.

    Ausgabe: Eckpunkte in Schrifteinheiten. Das Pixelbild dazu (Reihe 6 oben, Reihe 0 unten):
    ``#####``, ``....#``, ``...#.``, ``..#..``, ``.#...``, ``#....``, ``#####``.
    Die Treppe steht in Reihe r (1 bis 5) auf Spalte r − 1.
    """
    oben, unten, rand = REIHEN - 1, 0, SPALTEN - 1
    links: list[Punkt] = [(SPALTE_LINKS[0], REIHE_UNTEN[unten])]
    for reihe in range(1, oben - 1):
        links += [(SPALTE_LINKS[reihe - 1], REIHE_OBEN[reihe]), (SPALTE_LINKS[reihe], REIHE_OBEN[reihe])]
    balken_oben: list[Punkt] = [
        (SPALTE_LINKS[rand], REIHE_UNTEN[oben]),
        (SPALTE_LINKS[0], REIHE_UNTEN[oben]),
        (SPALTE_LINKS[0], REIHE_OBEN[oben]),
        (SPALTE_RECHTS[rand], REIHE_OBEN[oben]),
    ]
    rechts: list[Punkt] = []
    for reihe in range(oben - 1, 1, -1):
        rechts += [
            (SPALTE_RECHTS[reihe - 1], REIHE_UNTEN[reihe]),
            (SPALTE_RECHTS[reihe - 2], REIHE_UNTEN[reihe]),
        ]
    balken_unten: list[Punkt] = [
        (SPALTE_RECHTS[0], REIHE_OBEN[unten]),
        (SPALTE_RECHTS[rand], REIHE_OBEN[unten]),
        (SPALTE_RECHTS[rand], REIHE_UNTEN[unten]),
    ]
    return links + balken_oben + rechts + balken_unten


def umriss(schrift: TTFont, glyphe: str) -> list[Punkt]:
    """Die Eckpunkte des ersten Umrisses einer Glyphe (Beispiel: ``umriss(schrift, "Z")``)."""
    stift = RecordingPen()
    schrift.getGlyphSet()[glyphe].draw(stift)
    return [punkte[0] for befehl, punkte in stift.value if befehl in ("moveTo", "lineTo")]


def ersetze_z(schrift: TTFont) -> bool:
    """Setzt das neue Z ein. Ausgabe: wahr, wenn sich die Schrift geändert hat."""
    neu = z_umriss()
    if umriss(schrift, "Z") == neu:
        return False
    stift = TTGlyphPen(None)
    stift.moveTo(neu[0])
    for punkt in neu[1:]:
        stift.lineTo(punkt)
    stift.closePath()
    schrift["glyf"]["Z"] = stift.glyph()
    return True


def haupt() -> int:
    """Liest die Schrift des Spiels, ersetzt das Z und schreibt sie zurück."""
    schrift = TTFont(SCHRIFT)
    if not ersetze_z(schrift):
        print("Das Z ist schon ersetzt.")
        return 0
    schrift.save(SCHRIFT)
    print(f"Z ersetzt in {SCHRIFT}")
    return 0


if __name__ == "__main__":
    sys.exit(haupt())
