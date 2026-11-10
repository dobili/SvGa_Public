"""Tests für den Schleier der Tönung in der Vorschau (pipeline/abenteuer/toenung.py)."""

import pytest

pytest.importorskip("PIL.Image")  # Pillow fehlt in Actions

from PIL import Image  # noqa: E402

from pipeline.abenteuer.toenung import schleier  # noqa: E402


def test_nacht_dunkelt_die_vorschau_ab():
    bild = Image.new("RGBA", (2, 2), (200, 200, 200, 255))
    nacht = schleier(bild, "nacht").getpixel((0, 0))
    assert nacht[0] < 120 and nacht[2] < 140


def test_ohne_toenung_bleibt_das_bild():
    bild = Image.new("RGBA", (2, 2), (200, 200, 200, 255))
    assert schleier(bild, None) is bild
    assert schleier(bild, "sepia") is bild
