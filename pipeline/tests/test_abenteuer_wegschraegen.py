"""Wege in Bögen statt Stufen (Gutachter 10.11.2026): Schrägkacheln an Treppenecken.

Warum: Richtungswechsel von Wegen waren überall Stufen. ``bodenraster.bodenfeld`` nimmt an einer
Außenecke, über die die Kante diagonal weiterläuft, die Schrägkachel; ein Rechteck behält seine
runden Ecken. Die Randspur kennt die Schrägen und meldet dort keine Lücke.
"""

from pipeline.abenteuer.bodenraster import bodenfeld
from pipeline.abenteuer.randspur import randluecken

ERDE = {"feld": [1, 31], "rand": [0, 30], "diagonalen": True}
TREPPE = ["......", ".ee...", ".eee..", "..eee.", "...ee.", "......"]
RECHTECK = ["....", ".ee.", ".ee.", "...."]


def test_treppe_bekommt_schraegen():
    assert bodenfeld(ERDE, TREPPE, 1, 2) == [5, 33]  # Gras links unten, Treppe läuft nach rechts unten
    assert bodenfeld(ERDE, TREPPE, 3, 1) != [5, 30]


def test_rechteck_und_ohne_schalter_bleiben_rund():
    assert bodenfeld(ERDE, RECHTECK, 1, 2) == [0, 32]
    assert bodenfeld({**ERDE, "diagonalen": False}, TREPPE, 1, 2) == [0, 32]


def test_randspur_kennt_schraegen():
    gezeichnet = {}
    for y, zeile in enumerate(TREPPE):
        for x, z in enumerate(zeile):
            gezeichnet[(x, y)] = ("erde", bodenfeld(ERDE, TREPPE, x, y)) if z == "e" else ("gras", [3, 8])
    assert randluecken(gezeichnet, {"erde": [0, 30]}, {"gras"}) == []
