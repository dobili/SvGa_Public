"""Bildwunsch von niedrig-1 (Runde 12): Rückmeldung des Autors.

Clubraum R014 und R016, Kürbishof R047 und R048.

Entwurf zum Übernehmen in ``werkzeuge/`` des privaten Repositorys. Nur Code, keine LimeZu-Dateien.
Nur Flaches und Zusammenbau aus Paketteilen (KARTENREGELN 10.71: selbst gezeichnet werden nur
Schilder, Markierungen, Böden und Plakate).

Bilder (in ``spiel/eigene/``, Breite × Höhe in Pixeln):
- ``plakat_erst_zaehlen_klein.png`` (32 × 24): das Plakat „ERST ZÄHLEN“ aus dem Clubraum, so
  niedrig, dass es ganz auf die Wand passt (die sichtbare Wand ist 26 Pixel hoch). Weißes Blatt mit
  dünnem Rand, zwei Zeilen rote Schrift, darunter das Zeichen aus zwei Feldern mit einem Pfeil.
  Warum: Das bisherige Plakat (32 × 32) ragte in die Decke (R014).
- ``acker_frei_13x18.png`` (208 × 288): Ackerboden ohne Rahmen für das Maislabyrinth des
  Kürbishofs, gekachelt aus LimeZus ``Topsoil_16x16.png`` (Modern Farm). Warum: Unter dem Mais lagen
  acht Beete mit Holzrahmen, die Ähren standen auf den Rahmen und in den Lücken (R048).
- ``acker_11x18.png`` (176 × 288): ein großes Beet mit Holzrahmen für das Kürbisfeld, aus LimeZus
  neun Teilen ``Topsoil_Arable_Big_Modular_*`` zusammengesetzt. Warum: Das Feld hatte den Boden der
  Wege (R047).

Aufruf: python niedrig1_runde12.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw
from schilder import RAHMEN, schreibe, textbreite  # im privaten Repository: werkzeuge/schilder.py

BLATT = (244, 238, 222, 255)
ROT = (190, 48, 48, 255)
PLAKAT_B, PLAKAT_H = 32, 24
BLATT_LINKS, BLATT_RECHTS = 2, 29


def _mittig(z: ImageDraw.ImageDraw, text: str, y: int) -> int:
    """Schreibt ``text`` rot und mittig auf das Blatt; gibt die linke Kante zurück."""
    links = BLATT_LINKS + (BLATT_RECHTS - BLATT_LINKS + 1 - textbreite(text)) // 2
    schreibe(z, text, links, y, ROT)
    return links


def plakat_erst_zaehlen_klein() -> Image.Image:
    """Plakat 32 × 24: Blatt mit Rand, „ERST“ und „ZAHLEN“ mit zwei Punkten über dem A, unten ein
    helles und ein dunkles Feld mit Pfeil dazwischen (erst zählen, dann schlagen)."""
    bild = Image.new("RGBA", (PLAKAT_B, PLAKAT_H))
    z = ImageDraw.Draw(bild)
    z.rectangle((BLATT_LINKS - 1, 0, BLATT_RECHTS + 1, PLAKAT_H - 1), fill=RAHMEN)
    z.rectangle((BLATT_LINKS, 1, BLATT_RECHTS, PLAKAT_H - 2), fill=BLATT)
    _mittig(z, "ERST", 2)
    links = _mittig(z, "ZAHLEN", 10)
    umlaut_x = links + textbreite("Z") + 1  # das A beginnt nach dem Z und einem Pixel Abstand
    z.point((umlaut_x, 8), fill=ROT)
    z.point((umlaut_x + 2, 8), fill=ROT)
    z.rectangle((9, 17, 12, 21), fill=BLATT, outline=RAHMEN)  # helles Feld
    z.line((14, 19, 17, 19), fill=RAHMEN)  # Pfeil
    z.point((16, 18), fill=RAHMEN)
    z.point((16, 20), fill=RAHMEN)
    z.rectangle((19, 17, 22, 21), fill=RAHMEN)  # dunkles Feld
    return bild


FARM = "modern-farm/Single_Files_16x16/0_Complete_Tileset_Singles_16x16"
KACHEL = 16
BEET_ZEILEN = ("Upper", "Middle", "Bottom")
BEET_SPALTEN = ("Left", "Middle", "Right")


def acker_frei(haupt: Path, breite: int, hoehe: int) -> Image.Image:
    """Ackerboden ohne Rahmen, ``breite`` × ``hoehe`` Kacheln aus LimeZus ``Topsoil_16x16.png``."""
    kachel = Image.open(haupt / FARM / "Topsoil_16x16.png").convert("RGBA")
    bild = Image.new("RGBA", (breite * KACHEL, hoehe * KACHEL))
    for y in range(hoehe):
        for x in range(breite):
            bild.alpha_composite(kachel, (x * KACHEL, y * KACHEL))
    return bild


def _beetteil(haupt: Path, zeile: str, spalte: str) -> Image.Image:
    """Ein Teil des Beets; das mittlere Teil der mittleren Zeile heißt bei LimeZu „Central“."""
    name = "Central" if (zeile, spalte) == ("Middle", "Middle") else spalte
    datei = haupt / FARM / f"Topsoil_Arable_Big_Modular_{zeile}_{name}_16x16.png"
    return Image.open(datei).convert("RGBA")


def acker(haupt: Path, breite: int, hoehe: int) -> Image.Image:
    """Beet mit Holzrahmen, ``breite`` × ``hoehe`` Kacheln: Ecken und Ränder außen, Erde innen."""
    bild = Image.new("RGBA", (breite * KACHEL, hoehe * KACHEL))
    for y in range(hoehe):
        zeile = BEET_ZEILEN[0 if y == 0 else 2 if y == hoehe - 1 else 1]
        for x in range(breite):
            spalte = BEET_SPALTEN[0 if x == 0 else 2 if x == breite - 1 else 1]
            bild.alpha_composite(_beetteil(haupt, zeile, spalte), (x * KACHEL, y * KACHEL))
    return bild


def main(haupt: Path) -> None:
    ziel = haupt / "spiel" / "eigene"
    acker_frei(haupt, 13, 18).save(ziel / "acker_frei_13x18.png")
    acker(haupt, 11, 18).save(ziel / "acker_11x18.png")
    plakat_erst_zaehlen_klein().save(ziel / "plakat_erst_zaehlen_klein.png")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
