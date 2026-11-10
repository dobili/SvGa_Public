"""Tests für ``pipeline/abenteuer/bodenvariation.py``.

Warum: Wunsch des Autors (10.11.2026): Beläge mit zufälligen Abweichungen, aber gleiches Bild bei
jedem Lauf, nur Innenkacheln, abschaltbar je Szene, Gullys nicht in Reihen.
"""

import pytest

pytest.importorskip("PIL.Image")

from PIL import Image  # noqa: E402

from pipeline.abenteuer.bodenvariation import GULLY_ABSTAND, K, aktiv, variiere, zufall  # noqa: E402

GRAU, ANDERS = (120, 120, 120, 255), (90, 60, 40, 255)
MATERIALIEN = {
    "bodenvariation_standard": False,
    "boeden": {
        "pflaster": {
            "bogen": "x",
            "feld": [0, 0],
            "variation": {"kacheln": [[0, 0, 1], [1, 0, 1]], "flecken": 0.3, "gullys": 1.0},
        }
    },
}


def _kachel(_art, feld):
    return Image.new("RGBA", (K, K), GRAU if feld == [0, 0] else ANDERS)


def _bild(breite=12, hoehe=12):
    grund = Image.new("RGBA", (breite * K, hoehe * K), GRAU)
    gezeichnet = {(x, y): ("pflaster", [0, 0]) for x in range(breite) for y in range(hoehe)}
    return grund, gezeichnet


def test_aus_ohne_schalter_und_an_mit_schalter():
    assert not aktiv({}, MATERIALIEN)
    assert aktiv({"bodenvariation": True}, MATERIALIEN)
    assert not aktiv({"bodenvariation": False}, {**MATERIALIEN, "bodenvariation_standard": True})
    grund, gezeichnet = _bild()
    assert variiere({"karte": "a.b"}, grund, gezeichnet, MATERIALIEN, _kachel) is grund


def test_gleiches_bild_bei_jedem_lauf_und_anders_je_karte():
    grund, gezeichnet = _bild()
    eins = variiere({"karte": "a.b", "bodenvariation": True}, grund, gezeichnet, MATERIALIEN, _kachel)
    zwei = variiere({"karte": "a.b", "bodenvariation": True}, grund, gezeichnet, MATERIALIEN, _kachel)
    drei = variiere({"karte": "c.d", "bodenvariation": True}, grund, gezeichnet, MATERIALIEN, _kachel)
    assert eins.tobytes() == zwei.tobytes()
    assert eins.tobytes() != drei.tobytes()
    assert zufall("a.b", 1, 2).random() == zufall("a.b", 1, 2).random()


def test_raender_bleiben():
    grund, gezeichnet = _bild(2, 1)
    gezeichnet[(1, 0)] = ("pflaster", [9, 9])  # Randkachel
    bild = variiere({"karte": "a.b", "bodenvariation": True}, grund, gezeichnet, MATERIALIEN, _kachel)
    assert bild.crop((K, 0, 2 * K, K)).tobytes() == grund.crop((K, 0, 2 * K, K)).tobytes()


def test_gullys_mit_abstand():
    grund, gezeichnet = _bild()
    bild = variiere({"karte": "a.b", "bodenvariation": True}, grund, gezeichnet, MATERIALIEN, _kachel)
    gitter = [
        (x, y)
        for x in range(12)
        for y in range(12)
        if bild.getpixel((x * K + 6, y * K + 7)) == (52, 50, 54, 255)
    ]
    assert gitter
    for i, (ax, ay) in enumerate(gitter):
        for bx, by in gitter[i + 1 :]:
            assert abs(ax - bx) + abs(ay - by) >= GULLY_ABSTAND
