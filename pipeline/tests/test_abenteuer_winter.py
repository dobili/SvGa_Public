"""Tests für ``pipeline/abenteuer/winter.py`` und die Winterbefunde in ``kartenbild``.

Warum: Entscheidung Winter (10.11.2026). Dieselben Farben prüft app/src/abenteuer/oberwelt/winter.test.ts.
"""

import pytest

pytest.importorskip("PIL.Image")

from PIL import Image  # noqa: E402

from pipeline.abenteuer.winter import (  # noqa: E402
    winterbefunde,  # noqa: E402
    winterfarbe,
    winterlich,
)


def test_farben():
    assert winterfarbe(106, 170, 72) == (222, 221, 219)
    assert winterfarbe(150, 110, 70) == (130, 110, 90)
    assert winterfarbe(60, 120, 200) == (42, 96, 180)
    assert winterfarbe(60, 120, 200, wasser=False) == (60, 120, 200)
    assert winterfarbe(200, 40, 40) == (200, 40, 40)


def test_bild_behaelt_transparenz():
    bild = Image.new("RGBA", (2, 1))
    bild.putdata([(106, 170, 72, 128), (200, 40, 40, 255)])
    assert list(winterlich(bild).getdata()) == [(222, 221, 219, 128), (200, 40, 40, 255)]


def test_blumen_und_pilze_in_winterszenen():
    szene = {"objekte": [{"moebel": "wg4BlumeBlau"}, {"moebel": "n6Pilzkiosk"}, {"moebel": "wg4Pilze"}]}
    assert winterbefunde(szene) == []
    befunde = winterbefunde({**szene, "jahreszeit": "winter"})
    assert [b.split(":")[0] for b in befunde] == ["wg4BlumeBlau", "wg4Pilze"]


def test_baeume_bekommen_schneekappen_statt_schneebaellen():
    """Regel 10.67: dunkler Rand und 10 hellgrüne Pixel (Strecke 11, Kappe 4): Rand bleibt, 3 Schnee,
    7 Wintergrün."""
    from pipeline.abenteuer.winter import schneekappen, winterlaub

    rand, hell = (20, 50, 25, 255), (90, 170, 70, 255)
    aus = schneekappen(1, 11, [rand] + [hell] * 10)
    assert aus[0] == rand
    schnee = (*winterfarbe(*hell[:3]), 255)
    gruen = (*winterlaub(*hell[:3]), 255)
    assert aus[1:] == [schnee] * 3 + [gruen] * 7
    assert schneekappen(1, 10, [hell] * 10) == [schnee] * 4 + [gruen] * 6
