"""Bildwunsch von niedrig-1 (Runde 8): Entwurf zum Übernehmen in ``werkzeuge/schilder.py`` des privaten
Repositorys. Nur Code, keine LimeZu-Dateien.

Bilder (in ``spiel/eigene/``):
- ``absperrbock_breit.png`` (48 × 32): Absperrbock mit Tafel „GESPERRT“ und Rand rings um die
  Schrift (Park Maple Falls, Möbel ``mf9AbsperrbockBreit``; auf dem 32 Pixel breiten Bock war das T
  angeschnitten).
- ``kegelbande.png`` (16 × 16): Holzleiste als Bande der Kegelbahn (Gasthaus Lockport, ``ld8Kegelbande``).
- ``kugelregal.png`` (16 × 32): Regal mit vier Kegelkugeln neben dem Abwurf (``ld8Kugelregal``).

Die Funktionen nutzen ``schreibe``, ``textbreite``, ``RAHMEN`` und ``K`` aus ``schilder.py``.
Aufruf dort in ``main()``:
    absperrbock_breit().save(ZIEL / "absperrbock_breit.png")
    kegelbande().save(ZIEL / "kegelbande.png")
    kugelregal().save(ZIEL / "kugelregal.png")
"""

from PIL import Image, ImageDraw
from schilder import RAHMEN, K, schreibe, textbreite  # im privaten Repository: werkzeuge/schilder.py

HOLZ_HELL = (176, 128, 84, 255)
HOLZ_DUNKEL = (124, 84, 56, 255)


def absperrbock_breit() -> Image.Image:
    """Breiter Absperrbock mit Schild „GESPERRT“, 48 × 32: Tafel mit Rahmen und Rand rings um die
    Schrift (Rückmeldung des Autors, Runde 8: auf dem schmalen Bock war das T noch angeschnitten)."""
    bild = Image.new("RGBA", (48, 32))
    z = ImageDraw.Draw(bild)
    for x in (6, 41):
        z.line((x, 18, x - 3, 30), fill=RAHMEN, width=2)
        z.line((x, 18, x + 3, 30), fill=RAHMEN, width=2)
    z.rectangle((1, 16, 46, 21), fill=RAHMEN)
    for i, x in enumerate(range(2, 46, 4)):
        z.rectangle(
            (x, 17, min(x + 3, 45), 20), fill=(214, 52, 52, 255) if i % 2 == 0 else (240, 240, 240, 255)
        )
    z.rectangle((5, 1, 42, 12), fill=RAHMEN)
    z.rectangle((6, 2, 41, 11), fill=(245, 245, 240, 255))
    schreibe(z, "GESPERRT", (48 - textbreite("GESPERRT")) // 2, 4, (190, 30, 30, 255))
    z.rectangle((22, 12, 25, 16), fill=RAHMEN)
    z.rectangle((2, 30, 45, 31), fill=(58, 58, 80, 100))
    return bild


def kegelbande() -> Image.Image:
    """Bande der Kegelbahn (16 × 16, Stück zum Aneinanderreihen): niedrige Holzleiste unten in der
    Kachel, trennt die Bahn vom Gastraum (Rückmeldung des Autors, Runde 8)."""
    bild = Image.new("RGBA", (K, K))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 8, 15, 13), fill=RAHMEN)
    z.rectangle((0, 9, 15, 10), fill=HOLZ_HELL)
    z.rectangle((0, 11, 15, 12), fill=HOLZ_DUNKEL)
    z.rectangle((0, 14, 15, 15), fill=(58, 58, 80, 90))
    return bild


def kugelregal() -> Image.Image:
    """Regal für Kegelkugeln neben dem Abwurf (16 × 32): Holzgestell mit zwei Böden, darauf je zwei
    Kugeln (Farben wie ``kegelkugel``)."""
    bild = Image.new("RGBA", (K, 2 * K))
    z = ImageDraw.Draw(bild)
    z.rectangle((1, 4, 14, 29), fill=RAHMEN)
    z.rectangle((2, 5, 13, 28), fill=HOLZ_DUNKEL)
    for boden in (14, 27):
        z.rectangle((2, boden, 13, boden + 1), fill=HOLZ_HELL)
        for x, farbe in ((3, (40, 60, 120, 255)), (8, (140, 40, 40, 255))):
            z.ellipse((x, boden - 5, x + 4, boden - 1), fill=farbe, outline=RAHMEN)
            z.point((x + 1, boden - 4), fill=(230, 230, 240, 255))
    z.rectangle((1, 30, 14, 31), fill=(58, 58, 80, 90))
    return bild


# Plakatwand mit Werbung von Perfect Move (Bahndamm vor Riverton, Story-Bibel Szene 29: „Überall
# Plakate: Perfect Move …“). 80 × 96 wie ``Billboard_1`` aus Modern Exteriors; das Werkzeug lädt
# dieses Bild im privaten Repository und schreibt auf die leere Platte (x 4–75, y 8–44).
# Ziel: ``spiel/eigene/plakatwand_perfect_move.png``, Möbel ``wc8PlakatwandPM`` statt ``wc5Plakatwand``.
BILLBOARD = (
    "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/3_City_Props_Singles_16x16/"
    "ME_Singles_City_Props_16x16_Billboard_1.png"
)


def plakatwand_perfect_move(haupt) -> Image.Image:
    """Plakatwand mit blauer Platte, Springer-Logo, „PERFECT MOVE“ und „AUCH HIER“.

    Sonderfall: Die 3×5-Schrift aus ``schilder.py`` hat kein B, darum nicht „BALD“.
    """
    bild = Image.open(haupt / BILLBOARD).convert("RGBA")
    z = ImageDraw.Draw(bild)
    z.rectangle((5, 9, 74, 43), fill=(30, 60, 140, 255))
    z.rectangle((9, 14, 17, 30), fill=(245, 245, 240, 255))
    z.polygon([(10, 29), (16, 29), (15, 22), (12, 18), (10, 22)], fill=(30, 60, 140, 255))
    schreibe(z, "PERFECT", 22, 14, (245, 245, 240, 255))
    schreibe(z, "MOVE", 22, 21, (245, 245, 240, 255))
    schreibe(z, "AUCH HIER", 22, 33, (250, 200, 60, 255))
    return bild
