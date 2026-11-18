"""Tests der Gegenprobe zweier Stellungsvorräte (pipeline/abenteuer/vorratsvergleich.py).

Warum: Die Kennzahlen stehen im Bericht; hängende Figuren und Ungleichgewicht müssen stimmen.
"""

import chess

from pipeline.abenteuer import vorratsvergleich as vergleich


def test_haengende_figur():
    # Springer e5 vom Turm e8 angegriffen und ungedeckt; der Turm ist ungedeckt, aber nicht angegriffen
    assert vergleich.haengende(chess.Board("4r1k1/8/8/4N3/8/8/8/6K1 w - - 0 1")) == 1
    assert vergleich.haengende(chess.Board()) == 0


def test_ungleichgewicht():
    assert vergleich.ungleichgewicht(chess.Board()) == 0
    assert vergleich.ungleichgewicht(chess.Board("4r1k1/8/8/4N3/8/8/8/6K1 w - - 0 1")) == 2


def test_tabelle_je_band():
    eintrag = {"fen": chess.STARTING_FEN, "zuege": ["e4", "e5", "Nf3", "Nc6", "Bb5"]}
    vorrat = {"baender": [{"kennung": "band1", "formate": {"vorteil": [eintrag]}}]}
    text = vergleich.tabelle(vorrat, vorrat)
    assert "| band1 | 1 → 1 | 0% → 0% |" in text
    assert "| alle |" in text
