"""Tests der Kachelwahl für Böden (pipeline/abenteuer/bodenraster.py), ohne Pillow."""

from pipeline.abenteuer.bodenraster import bodenfeld, ueberbrueckt

WASSER_ART = {"rand": [0, 0]}


def test_brücke_unterbricht_den_bach_nicht():
    zeilen = ["..~..", "..h..", "..h..", "..~.."]
    assert ueberbrueckt(zeilen, 2, 0, 0, 1)
    assert ueberbrueckt(zeilen, 2, 3, 0, -1)
    # Unter der Brücke und am Kartenrand kein Ufer oben oder unten: Mittelstück.
    assert bodenfeld(WASSER_ART, zeilen, 2, 3) == [1, 1]


def test_steg_ohne_wasser_dahinter_behält_das_ufer():
    zeilen = ["~~~", "~h.", "~~~"]
    assert not ueberbrueckt(zeilen, 0, 1, 1, 0)
