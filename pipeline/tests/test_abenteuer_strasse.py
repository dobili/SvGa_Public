"""Tests für Straßenmarkierungen (pipeline/abenteuer/strasse.py)."""

import pytest

pytest.importorskip("PIL.Image")  # Pillow fehlt in Actions

from PIL import Image  # noqa: E402

from pipeline.abenteuer.strasse import GELB, WEISS, K, markiere  # noqa: E402


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


def test_mittellinie_laeuft_durch_die_kehre():
    """Regel: Gutachten Bergstraße (Runde 9): Die Mittellinie hört an der Kehre nicht auf."""
    zeilen = [
        "ssssssss..",
        "ssssssss..",
        "......ss..",
        "......ss..",
        "......ss..",
        "......ss..",
        "......ss..",
    ]
    bild = Image.new("RGBA", (10 * K, 7 * K))
    markiere(bild, zeilen, {"markierung": ["s"]})
    assert bild.getpixel((7 * K, K - 1)) == GELB  # Mitte des Eckstücks


def test_randlinie_um_die_haltebucht_offen_zur_fahrbahn():
    """Regel: Gutachten Schule (Runde 9): Die Bucht des Schulbusses hat eine Randlinie."""
    zeilen = ["ppbbpp", "ppbbpp", "ssssss", "ssssss"]
    bild = Image.new("RGBA", (6 * K, 4 * K))
    markiere(bild, zeilen, {"randlinie": ["b"], "markierung": ["s"]})
    assert bild.getpixel((2 * K + 1, 8)) == WEISS  # linke Seite der Bucht
    assert bild.getpixel((2 * K + 8, 1)) == WEISS  # Oberkante
    assert bild.getpixel((2 * K + 8, 2 * K - 2)) != WEISS  # zur Fahrbahn offen
