"""Tests der Notationswandlung für die Trainerdaten (deutsche Lösungsangaben des Buches)."""

import chess

from pipeline.trainer.notation import deutsch, erster_zug, san_auf_englisch, spiele_linie, zuege_aus_text

# Übung 43 (Abb. 7.55), Weiß am Zug: Philidors Vermächtnis.
ABB_7_55 = "r3r2k/pp4pp/8/6N1/2Q5/q7/PP3PPP/6K1 w - - 0 1"


def test_einzelne_zuege():
    assert san_auf_englisch("Sxc7+!") == "Nxc7+"
    assert san_auf_englisch("e8=D") == "e8=Q"
    assert san_auf_englisch("Sh6++") == "Nh6+"
    assert san_auf_englisch("O-O-O") == "O-O-O"
    assert san_auf_englisch("Dg8+!!") == "Qg8+"


def test_zuege_aus_loesungsangabe():
    assert zuege_aus_text("1. Sf7+ Kg8 2. Sh6++ Kh8 3. Dg8+!! Txg8 4. Sf7#") == [
        "Nf7+",
        "Kg8",
        "Nh6+",
        "Kh8",
        "Qg8+",
        "Rxg8",
        "Nf7#",
    ]
    assert zuege_aus_text("4... Sf6") == ["Nf6"]
    assert zuege_aus_text("1...Kf6!") == ["Kf6"]
    assert zuege_aus_text("") == []


def test_linie_auf_dem_brett():
    brett = chess.Board(ABB_7_55)
    linie = spiele_linie(brett, zuege_aus_text("1. Sf7+ Kg8 2. Sh6++ Kh8 3. Dg8+!! Txg8 4. Sf7#"))
    assert linie is not None and len(linie) == 7
    assert erster_zug(brett, "1. Sf7+ Kg8") == brett.parse_san("Nf7+")
    assert erster_zug(brett, None) is None
    assert spiele_linie(brett, ["Qh9"]) is None
    assert deutsch(brett, brett.parse_san("Nf7+")) == "Sf7+"
