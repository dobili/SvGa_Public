"""Tests für ``pipeline/abenteuer/bodenvariation.py``.

Warum: Wunsch des Autors (10.11.2026): Beläge mit zufälligen Abweichungen, aber gleiches Bild bei
jedem Lauf, nur Innenkacheln, abschaltbar je Szene, Gullys nicht in Reihen.
"""

import pytest

pytest.importorskip("PIL.Image")

from PIL import Image  # noqa: E402

from pipeline.abenteuer.bodenvariation import (  # noqa: E402
    GULLY_ABSTAND,
    K,
    aktiv,
    innenkachel,
    variiere,
    zufall,
)

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


# --- Variation über die ganze Fläche (Kartenblick M01, 24.11.2026) ---

GRAS, HALM = (71, 151, 87, 255), (55, 133, 78, 255)
VERBAND = {"richtung": "quer", "brett": 4, "kern": [3, 11], "laenge": [24, 56]}
FLAECHIG = {
    "bodenvariation_standard": True,
    "boeden": {
        "gras": {
            "bogen": "x",
            "feld": [0, 0],
            "varianten": [[0, 0], [1, 0]],
            "variation": {"eben": True, "streu": 2},
        },
        "holz": {"bogen": "x", "feld": [5, 13], "unter_wand": [5, 12], "variation": {"verband": VERBAND}},
    },
}


def _graskachel(_art, feld):
    """Variante [1, 0] trägt ein Büschel immer an derselben Stelle (das Gitter)."""
    teil = Image.new("RGBA", (K, K), GRAS)
    if list(feld) == [1, 0]:
        for ort in ((4, 5), (5, 4), (5, 5)):
            teil.putpixel(ort, HALM)
    return teil


def test_innenkachel_kennt_varianten():
    gras = FLAECHIG["boeden"]["gras"]
    assert innenkachel(gras, [0, 0]) and innenkachel(gras, (1, 0)) and not innenkachel(gras, [9, 9])


def test_innenkachel_kennt_jede_kachel_einer_textur():
    """Regel: Kartenblick Paket A, Texturböden (Sand am See, Acker) bekommen auf jeder Kachel Variation."""
    acker = {"feld": [0, 0], "textur": [3, 3]}
    assert innenkachel(acker, [2, 2]) and innenkachel(acker, [0, 1]) and not innenkachel(acker, [3, 0])


def test_standard_an_schaltet_alle_szenen_ein():
    assert aktiv({}, FLAECHIG) and not aktiv({"bodenvariation": False}, FLAECHIG)


def test_bueschel_stehen_nicht_mehr_im_gitter():
    breite, hoehe = 10, 8
    grund = Image.new("RGBA", (breite * K, hoehe * K))
    gezeichnet = {(x, y): ("gras", [(x + y) % 2, 0]) for x in range(breite) for y in range(hoehe)}
    for (x, y), (_, feld) in gezeichnet.items():
        grund.paste(_graskachel(None, feld), (x * K, y * K))
    bild = variiere({"karte": "a.b"}, grund, gezeichnet, FLAECHIG, _graskachel)
    assert set(bild.get_flattened_data()) == {GRAS, HALM}
    halme = [(x, y) for x in range(breite * K) for y in range(hoehe * K) if bild.getpixel((x, y)) == HALM]
    assert len({(x % K, y % K) for x, y in halme}) > 30  # vorher: genau drei Stellen je Kachel


def test_holz_wird_als_verband_verlegt_auch_unter_der_wand():
    grund = Image.new("RGBA", (6 * K, 3 * K), (170, 142, 115, 255))
    for x in range(K - 1, 6 * K, K):  # Fuge am rechten Kachelrand in jeder Reihe
        for y in range(3 * K):
            grund.putpixel((x, y), (120, 100, 80, 255))
    gezeichnet = {(x, y): ("holz", [5, 12] if y == 0 else [5, 13]) for x in range(6) for y in range(3)}
    bild = variiere({"karte": "a.b"}, grund, gezeichnet, FLAECHIG, _graskachel)
    spalte = [bild.getpixel((K - 1, y)) for y in range(3 * K)]
    assert len(set(spalte)) > 1  # keine durchgehende Linie mehr an der Kachelgrenze
    assert bild.tobytes() != grund.tobytes()
