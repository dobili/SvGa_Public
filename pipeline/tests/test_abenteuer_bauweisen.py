"""Tests der Bauweisen aus dem Karteneditor (pipeline/abenteuer/bauweisen.py) und der Uhr am Tischrand.

Beispiele nach den Karten des Autors vom 16.11.2026 (Whitlock-Haus, Clubraum): Treppenloch mit
Geländer, gedrehte Treppe, doppelt übertragene Teile, Sessel mit gemalter Sperre, Uhr hinter dem Brett.
"""

import pytest

from pipeline.abenteuer import tischlage_teile
from pipeline.abenteuer.bauweisen import (
    am_loch,
    antritt,
    darf_ueberlappen,
    doppelte_eintraege,
    gelaender_am_loch,
    gemalt_belegt,
    im_loch,
)
from pipeline.abenteuer.tischlage import pruefe_szene

# Zimmer im Kleinen: Loch „  “ auf (1..2, 4..5), Wand links.
ZIMMER = ["######", "#....#", "#....#", "#....#", "#  ..#", "#  ..#", "#....#", "######"]
MOEBEL = {
    "reling": {
        "quelle": "x/Fence_6_Top_Middle.png",
        "breite": 16,
        "hoehe": 16,
        "kollision": True,
        "art": "zaun",
    },
    "treppe": {"quelle": "x/treppe.png", "breite": 48, "hoehe": 64, "kollision": False, "art": "treppe"},
    "sessel": {"quelle": "x/sessel.png", "breite": 32, "hoehe": 32, "kollision": True, "art": "sessel"},
    "gras": {"quelle": "x/gras.png", "breite": 16, "hoehe": 16, "kollision": False, "art": "boden"},
}


def test_gelaender_steht_am_rand_des_lochs():
    assert am_loch(ZIMMER, (2, 4))
    assert not am_loch(ZIMMER, (3, 4))  # Boden
    assert not am_loch(ZIMMER, (0, 4))  # Wand
    assert gelaender_am_loch("reling", MOEBEL, ZIMMER, (2, 5))
    assert not gelaender_am_loch("sessel", MOEBEL, ZIMMER, (2, 5))


def test_gelaenderteile_duerfen_sich_ueberlappen():
    assert darf_ueberlappen("reling", "reling", MOEBEL)
    assert darf_ueberlappen("treppe", "reling", MOEBEL)
    assert not darf_ueberlappen("sessel", "reling", MOEBEL)
    assert not darf_ueberlappen("treppe", "treppe", MOEBEL)


def test_doppelt_uebertragene_teile():
    teil = {"moebel": "reling", "feld": [2, 4], "maske": ["#"]}
    gras = {"moebel": "gras", "feld": [5, 5]}
    szene = {"objekte": [teil, dict(teil), gras, dict(gras)]}
    assert doppelte_eintraege(szene, MOEBEL) == [
        "reling (2, 4) steht doppelt in der Szene (zweimal übertragen?)"
    ]
    assert doppelte_eintraege(szene, MOEBEL, mit_kollision=False) == [
        "gras (5, 5) steht doppelt in der Szene (zweimal übertragen?)"
    ]


def test_gedrehte_treppe_hat_den_antritt_oben():
    """Treppe zum Dachboden im Zimmer: um 180 Grad gedreht, man betritt sie von Norden."""
    stueck = {"x": 16, "y": 112, "breite": 48, "hoehe": 64}
    felder = (1, 8, 3, 10)
    assert antritt(stueck, felder, False, {}) == ("unten", [(1, 11), (2, 11), (3, 11)])
    assert antritt(stueck, felder, False, {"drehung": 180}) == ("oben", [(1, 6), (2, 6), (3, 6)])
    assert antritt(stueck, felder, True, {})[0] == "oben"
    assert antritt(stueck, felder, False, {"drehung": 90})[0] == "links"


def test_treppe_zum_betrachter_hat_den_antritt_oben():
    """Treppe zum Dachboden im Zimmer seit 16.11.2026: ``treppeZumBetrachter`` mit ``antritt`` „oben“."""
    stueck = {"x": 16, "y": 115, "breite": 48, "hoehe": 61}
    felder = (1, 7, 3, 10)
    assert antritt(stueck, felder, False, {}, "oben") == ("oben", [(1, 6), (2, 6), (3, 6)])
    assert antritt(stueck, felder, False, {"drehung": 180}, "oben")[0] == "unten"


def test_treppe_unter_dem_boden_liegt_im_loch():
    assert im_loch({"x": 16, "y": 61, "breite": 28, "hoehe": 24}, ZIMMER)
    assert not im_loch({"x": 48, "y": 16, "breite": 16, "hoehe": 32}, ZIMMER)


def test_gemalte_sperre_unter_einem_sessel_belegt_den_boden():
    sessel = {"name": "sessel", "x": 48, "y": 16, "breite": 32, "hoehe": 32, "tiefe": 40, "kollision": False}
    szene = {"sperren_fein": [[3, 2, "....############"], [1, 6, "################"]]}
    assert gemalt_belegt(szene, [sessel], MOEBEL) == {(3, 2)}


@pytest.fixture
def _ohne_grafikpaket():
    alt = tischlage_teile.BESTAND[0]
    tischlage_teile.BESTAND[0] = None
    yield
    tischlage_teile.BESTAND[0] = alt


@pytest.mark.usefixtures("_ohne_grafikpaket")
def test_uhr_hinter_dem_brett_darf_ueber_die_hintere_kante_ragen():
    """Clubraum (16.11.2026): Brett mittig auf dem Rundtisch, die Uhr dahinter steht mit dem Fuß auf
    der Platte und ragt oben 3 Pixel über die Kante. Ganz hinter der Platte bleibt es ein Befund."""
    katalog = {
        "tisch": {
            "quelle": "tisch.png",
            "breite": 32,
            "hoehe": 32,
            "kollision": True,
            "art": "tisch",
            "platte": [7, 10, 25, 24],
        },
        "brett": {
            "quelle": "x/schachbrett_klein.png",
            "breite": 12,
            "hoehe": 9,
            "kollision": True,
            "art": "deko",
        },
        "uhr": {"quelle": "x/schachuhr_klein.png", "breite": 8, "hoehe": 6, "kollision": True, "art": "deko"},
    }
    raum = ["#" * 12] * 3 + ["#" + "." * 10 + "#"] * 6 + ["#" * 12]
    objekte = [
        {"moebel": "tisch", "feld": [4, 4], "id": "t"},
        {"moebel": "brett", "auf": "t", "versatz": [0, 3]},
        {"moebel": "uhr", "auf": "t", "versatz": [0, -6]},
    ]
    szene = {"karte": "test.raum", "art": "innen", "raster": raum, "objekte": objekte}
    assert pruefe_szene(szene, katalog) == []
    objekte[2]["versatz"] = [0, -12]
    assert "liegt nicht ganz auf der Tischplatte" in [b.text for b in pruefe_szene(szene, katalog)]
