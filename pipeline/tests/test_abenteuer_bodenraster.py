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


def test_innenecke_an_einer_ufer_stufe():
    # Wasser unten links, Stufe nach rechts oben: (1,1) hat Wasser ringsum, nur oben rechts Gras.
    zeilen = ["~~.", "~~~", "~~~"]
    assert bodenfeld(WASSER_ART, zeilen, 1, 1) == [3, 1]


def test_weg_ohne_grasnaht_am_pflaster():
    zeilen = ["....", "eegg", "...."]
    erde = {"rand": [0, 0]}
    # Rechts Pflaster: kein Rand nach rechts, oben und unten Gras.
    assert bodenfeld(erde, zeilen, 1, 1) == [1, 1]


def test_randwand_zeigt_das_feld_dahinter():
    # Weg verlässt die Karte links: Die Randwand über ihm zeigt Gras, also Grasrand oben.
    zeilen = ["#####", "#....", "eeeee", "eeeee", "#...."]
    erde = {"rand": [0, 0]}
    assert bodenfeld(erde, zeilen, 0, 2) == [1, 0]


def test_gras_zwischen_wasser_ist_keine_bruecke():
    # Bach versetzt um eine Spalte: (1,0) Wasser hat unten Gras, darunter wieder Wasser.
    zeilen = ["~~.", "~..", "~~."]
    assert not ueberbrueckt(zeilen, 1, 0, 0, 1)
    assert bodenfeld(WASSER_ART, zeilen, 1, 0) == [2, 2]


def test_schattenkachel_nur_direkt_unter_der_wand():
    """Room-Builder-Böden: Schattenreihe unter der Wand, sonst die gleichmäßige Kachel (Punkt e)."""
    dielen = {"feld": [5, 13], "unter_wand": [5, 12]}
    zeilen = ["####", "#..#", "#..#"]
    assert bodenfeld(dielen, zeilen, 1, 1) == [5, 12]
    assert bodenfeld(dielen, zeilen, 1, 2) == [5, 13]
