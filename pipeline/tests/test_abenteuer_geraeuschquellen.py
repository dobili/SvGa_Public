"""Tests für pipeline/abenteuer/geraeuschquellen.py: Ableitung der Geräuschquellen aus der Szene
(Wasserkacheln, Möbel, Angaben von Hand) und der Dauertest, dass jede Karte die Eigenschaft trägt,
die der Kartenbau heute schreiben würde (räumliche Geräusche, 22.11.2026)."""

import json

import pytest

from pipeline.abenteuer import geraeuschquellen as gq
from pipeline.abenteuer.geraeuschquellen_bild import anteil, zeichne

PARK = {
    "layers": [
        {
            "objects": [
                {"type": "moebel", "name": "mf12WasserfallBand", "x": 480, "y": 16, "width": 64, "height": 64}
            ]
        }
    ]
}


def test_wasser_als_laeufe_je_zeile_bruecken_zaehlen_mit():
    assert gq.wasserlaeufe(["..~~~.~", "..h~..."], ["h"]) == [[2, 0, 3, 1], [6, 0, 1, 1], [2, 1, 2, 1]]


def test_objektarten_nach_namen_bilder_und_baenke_stumm():
    assert gq.objektart("mf12WasserfallBand") == "wasserfall"
    assert gq.objektart("rv5Bahnhofsuhr") == "uhr_ticken"
    assert gq.objektart("rv5Brunnen") == "brunnen"
    assert gq.objektart("rvBahnsteigbank") is None
    assert gq.objektart("iw9FotoBahnhofA") is None
    assert gq.objektart("mfBank") is None


def test_wasserfall_nur_vom_moebel_teich_zaehlt_nicht():
    szene = {"raster": ["~~~~"]}
    assert gq.ableiten(szene, szene["raster"], PARK, "wasserfall") == [
        {"art": "wasserfall", "felder": [[30, 1, 4, 4]]}
    ]


def test_flaechenwasser_und_ohne_geraeusch():
    szene = {"raster": [".~~."]}
    assert gq.ableiten(szene, szene["raster"], {}, "fluss") == [{"art": "fluss", "felder": [[1, 0, 2, 1]]}]
    assert gq.ableiten(szene, szene["raster"], PARK, None) == []


def test_angaben_von_hand_ohne_dazu_und_aus():
    szene = {
        "raster": [".~~."],
        "geraeuschquellen": {
            "ohne": ["wasser"],
            "dazu": [{"feld": [5, 6]}, {"bereich": [1, 2, 3, 4]}, {"art": "grill", "feld": [0, 0]}],
        },
    }
    assert gq.ableiten(szene, szene["raster"], {}, "fluss") == [
        {"art": "fluss", "felder": [[5, 6, 1, 1], [1, 2, 3, 4]]}
    ]
    assert gq.ableiten({**szene, "geraeuschquellen": False}, szene["raster"], PARK, "wasserfall") == []


def test_eigenschaft_ersetzt_und_entfernt():
    karte = {"properties": [{"name": "kennung", "value": "a"}, {"name": gq.EIGENSCHAFT, "value": "alt"}]}
    neu = gq.mit_eigenschaft(karte, [{"art": "bach", "felder": [[0, 0, 1, 1]]}])
    assert [p["name"] for p in neu["properties"]] == ["kennung", gq.EIGENSCHAFT]
    assert json.loads(neu["properties"][1]["value"]) == [{"art": "bach", "felder": [[0, 0, 1, 1]]}]
    assert gq.mit_eigenschaft(karte, [])["properties"] == [{"name": "kennung", "value": "a"}]


def test_kurve_wie_in_der_app():
    assert anteil(0) == 1 and anteil(12) == 0
    assert anteil(7) == pytest.approx(0.5)


def test_park_und_flussweg_haben_quellen():
    orte = gq.lade(gq.ORTE)
    _, _, park, _ = gq.fuer_szene(gq.SZENEN / "maple-falls-park.json", orte)
    _, _, fluss, _ = gq.fuer_szene(gq.SZENEN / "weg-maple-cedar-flussweg.json", orte)
    assert park == [{"art": "wasserfall", "felder": [[30, 1, 4, 4]]}]
    assert fluss and fluss[0]["art"] == "fluss"


def test_dauertest_jede_karte_traegt_ihre_quellen():
    """Wer eine Szene ändert, baut die Karte neu (kartenbau schreibt die Eigenschaft mit) oder ruft
    ``python -m pipeline.abenteuer.geraeuschquellen --schreiben``."""
    orte = gq.lade(gq.ORTE)
    falsch = []
    for pfad in gq.szenen():
        szene, karte, quellen, _ = gq.fuer_szene(pfad, orte)
        if gq.mit_eigenschaft(karte, quellen) != karte:
            falsch.append(szene["datei"])
    assert falsch == []


def test_vorschau_ohne_pillow_kein_fehler(tmp_path):
    pytest.importorskip("PIL")
    szene = {"karte": "a.b", "datei": "x.json", "raster": ["#..~", "...."]}
    assert zeichne([(szene, [{"art": "bach", "felder": [[3, 0, 1, 1]]}])], tmp_path / "v.png")
    assert (tmp_path / "v.png").exists()
