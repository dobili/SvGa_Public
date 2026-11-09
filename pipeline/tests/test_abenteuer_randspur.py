"""Tests der Randspur (pipeline/abenteuer/randspur.py): fehlende Ufer- und Wegränder in der Zeichnung."""

from pipeline.abenteuer.bodenraster import bodenfeld
from pipeline.abenteuer.randspur import randluecken

RAENDER = {"wasser": [0, 0], "erde": [0, 0]}


def _gezeichnet(zeilen: list[str]) -> dict:
    """Zeichnet ein Raster so, wie kartenbild es tut (Wasser „~“, Erde „e“, Gras „.“)."""
    ergebnis = {}
    for y, zeile in enumerate(zeilen):
        for x, z in enumerate(zeile):
            if z == "~":
                ergebnis[(x, y)] = ("wasser", bodenfeld({"rand": [0, 0]}, zeilen, x, y))
            elif z == "e":
                ergebnis[(x, y)] = ("erde", bodenfeld({"rand": [0, 0]}, zeilen, x, y))
            else:
                ergebnis[(x, y)] = ("gras", [0, 0])
    return ergebnis


def test_richtig_gezeichnet_hat_keine_luecke():
    zeilen = ["......", ".~~~..", ".~~~~.", "..~~~.", "......"]
    assert randluecken(_gezeichnet(zeilen), RAENDER, {"gras"}) == []


def test_falsche_kachel_wird_gemeldet():
    zeilen = ["......", ".~~~..", ".~~~..", "......"]
    gezeichnet = _gezeichnet(zeilen)
    gezeichnet[(3, 2)] = ("wasser", [1, 1])  # Mittelstück statt Ecke unten rechts
    befunde = randluecken(gezeichnet, RAENDER, {"gras"})
    assert befunde and "(3, 2)" in befunde[0]


def test_weg_braucht_rand_nur_zum_gras():
    zeilen = ["......", "eeeepp", "eeeepp", "......"]
    gezeichnet = _gezeichnet(zeilen)
    for f in ((4, 1), (5, 1), (4, 2), (5, 2)):
        gezeichnet[f] = ("pflaster", [0, 0])
    # Der Weg (Erde) stößt rechts an Pflaster: dort kein Rand nötig (bodenraster läuft weiter).
    assert randluecken(gezeichnet, RAENDER, {"gras"}) == []
