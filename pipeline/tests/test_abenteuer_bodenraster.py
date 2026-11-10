"""Tests der Kachelwahl für Böden (pipeline/abenteuer/bodenraster.py), ohne Pillow."""

from pipeline.abenteuer.bodenraster import bodenfeld, brueckenzeichen, ueberbrueckt

WASSER_ART = {"rand": [0, 0]}
HOLZ = frozenset({"h"})


def test_brücke_unterbricht_den_bach_nicht():
    zeilen = ["..~..", "..h..", "..h..", "..~.."]
    assert ueberbrueckt(zeilen, 2, 0, 0, 1, HOLZ)
    assert ueberbrueckt(zeilen, 2, 3, 0, -1, HOLZ)
    # Unter der Brücke und am Kartenrand kein Ufer oben oder unten: Mittelstück.
    assert bodenfeld(WASSER_ART, zeilen, 2, 3, HOLZ) == [1, 1]


def test_steg_ohne_wasser_dahinter_behält_das_ufer():
    zeilen = ["~~~", "~h.", "~~~"]
    assert not ueberbrueckt(zeilen, 0, 1, 1, 0, HOLZ)


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


def test_nur_holzboeden_sind_bruecken():
    """Sinter, Erde, Pflaster zwischen zwei Wassern sind keine Brücke (auch nicht schräg)."""
    zeilen = ["..~..", "..s..", "..~.."]
    assert not ueberbrueckt(zeilen, 2, 0, 0, 1, HOLZ)
    # Ohne Brücke hat das obere Wasser unten sein Ufer.
    assert bodenfeld(WASSER_ART, zeilen, 2, 0, HOLZ) == [1, 2]
    schraeg = ["~..", ".s.", "..~"]
    assert not ueberbrueckt(schraeg, 0, 0, 1, 1, HOLZ)
    assert ueberbrueckt(["~", "h", "~"], 0, 0, 0, 1, HOLZ)


def test_brueckenzeichen_aus_den_holzboeden_der_szene():
    szene = {"boeden": {"b": "holzDunkel", "s": "sinter", "d": "dielen", "e": "erde"}}
    assert brueckenzeichen(szene) == {"b", "d"}
    assert brueckenzeichen({}) == frozenset()
