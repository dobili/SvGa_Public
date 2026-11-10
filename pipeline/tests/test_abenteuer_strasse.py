"""Tests für Straßenmarkierungen (pipeline/abenteuer/strasse.py)."""

from PIL import Image

from pipeline.abenteuer.strasse import GELB, WEISS, K, markiere


def test_waagerechte_strasse_bekommt_mittellinie_und_randlinien():
    """Regel: Runde 9, Muster „Asphalt ohne Markierung“ (KARTENPRUEFUNG, Straßen)."""
    zeilen = ["......", "ssssss", "ssssss", "......"]
    bild = Image.new("RGBA", (6 * K, 4 * K))
    markiere(bild, zeilen, {"markierung": ["s"]})
    assert bild.getpixel((2, 2 * K)) == GELB
    assert bild.getpixel((2, K + 2)) == WEISS


def test_platz_und_fremde_zeichen_bleiben_ohne_linie():
    zeilen = ["aaaaaa", "aaaaaa", "ssssss", "ssssss", "ssssss", "ssssss", "ssssss"]
    bild = Image.new("RGBA", (6 * K, 7 * K))
    markiere(bild, zeilen, {"markierung": ["s"]})
    assert bild.getpixel((2, int(4.5 * K))) == (0, 0, 0, 0)
    assert bild.getpixel((2, K)) == (0, 0, 0, 0)


def test_buchten_alle_vier_reihen():
    zeilen = ["bbb"] * 9
    bild = Image.new("RGBA", (3 * K, 9 * K))
    markiere(bild, zeilen, {"buchten": {"b": 4}})
    assert bild.getpixel((5, 4 * K)) == WEISS
    assert bild.getpixel((5, 2 * K)) == (0, 0, 0, 0)
