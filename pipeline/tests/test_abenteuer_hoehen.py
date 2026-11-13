"""Tests der Höhenprüfung (pipeline/abenteuer/hoehen.py, KARTENREGELN 10.74)."""

from pipeline.abenteuer.hoehen import hoehenhinweise

SZENE = {"kante": "klippe"}
LEER = "............"


def test_wand_von_rand_zu_rand_ist_in_ordnung():
    assert hoehenhinweise(SZENE, [LEER, "#" * 12, "#" * 12, "#" * 12, LEER]) == []


def test_wand_endet_frei_im_gras():
    """Regel: Rückmeldung R028: Ein Gebirgszug hört mitten im Bild auf, man geht daran vorbei."""
    band = "#######....."
    hinweise = hoehenhinweise(SZENE, [LEER, band, band, band, LEER])
    assert len(hinweise) == 1 and "(6, 1)" in hinweise[0]
    assert hoehenhinweise({}, [LEER, band, band, band, LEER]) == []


def test_seitenkante_bis_zum_rand_schliesst_die_hochflaeche():
    band, kante = "#######.....", "......#....."
    assert hoehenhinweise(SZENE, [kante, kante, band, band, band, LEER]) == []
    hinweise = hoehenhinweise(SZENE, [LEER, kante, band, band, band, LEER])
    assert len(hinweise) == 1 and "Seitenkante endet frei bei (6, 1)" in hinweise[0]


def test_treppe_und_versatz_sind_kein_ende():
    luecke = "####...#####"
    assert hoehenhinweise(SZENE, [LEER, luecke, luecke, luecke, LEER]) == []
    versatz = [LEER, "######......", "############", "############", "......######", LEER]
    assert hoehenhinweise(SZENE, versatz) == []
