"""Tests für ``pipeline.abenteuer.belebungsbilder``: Tierbögen im Spielformat.

Warum: Die App liest die Tierbögen mit festen Rahmen (Reihe 0 Stand, Reihe 1 Laufen, 24 breit).
Die Vorlagen sind unterschiedlich gebaut; die Tests prüfen jede Art mit kleinen Kunstbildern,
weil die gekaufte Grafik nicht im öffentlichen Repository liegt.
"""

from PIL import Image

from pipeline.abenteuer.belebungsbilder import RAHMEN_JE_REIHE, _baender, tierbogen

ROT = (255, 0, 0, 255)
BLAU = (0, 0, 255, 255)


def _streifen(farbe_y0: tuple, farbe_y1: tuple, breite: int, hoehe: int) -> Image.Image:
    """Vorlage mit zwei Reihen: oben ``farbe_y0``, darunter ``farbe_y1``."""
    bild = Image.new("RGBA", (RAHMEN_JE_REIHE * breite, 2 * hoehe))
    bild.paste(farbe_y0, (0, 0, bild.width, hoehe))
    bild.paste(farbe_y1, (0, hoehe, bild.width, 2 * hoehe))
    return bild


def test_reihen_vorlage_ergibt_stand_und_laufen():
    bogen = tierbogen(_streifen(ROT, BLAU, 16, 16), 16, 16, "reihen")
    assert bogen.size == (RAHMEN_JE_REIHE * 16, 32)
    assert bogen.getpixel((0, 0)) == ROT
    assert bogen.getpixel((5 * 16, 0))[3] == 0  # nur vier Standbilder
    assert bogen.getpixel((23 * 16, 16)) == BLAU


def test_streifen_vorlage_wiederholt_die_bewegung():
    quelle = Image.new("RGBA", (6 * 16, 16), ROT)
    bogen = tierbogen(quelle, 16, 16, "streifen")
    assert bogen.getpixel((3 * 16, 0)) == ROT
    assert bogen.getpixel((23 * 16 + 8, 24)) == ROT


def test_feste_hoehen_lesen_die_genannten_reihen():
    quelle = Image.new("RGBA", (RAHMEN_JE_REIHE * 8, 40))
    quelle.paste(ROT, (0, 0, quelle.width, 8))
    quelle.paste(BLAU, (0, 32, quelle.width, 40))
    bogen = tierbogen(quelle, 8, 8, "fest:0:32")
    assert bogen.getpixel((0, 0)) == ROT
    assert bogen.getpixel((0, 8)) == BLAU


def test_baender_finden_belegte_streifen():
    bild = Image.new("RGBA", (10, 20))
    bild.paste(ROT, (0, 2, 10, 5))
    bild.paste(ROT, (0, 10, 10, 20))
    assert _baender(bild) == [(2, 5), (10, 20)]
