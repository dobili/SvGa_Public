"""Tests der Eröffnungsstatistik (pipeline/menschenprofil/eroeffnungen.py)."""

import chess

from pipeline.menschenprofil.eroeffnungen import benannte_eroeffnungen, kategorie, schluessel


def test_kategorie():
    assert kategorie(1234) == 1200
    assert kategorie(399) is None
    assert kategorie(2600) is None


def test_schluessel_ohne_zugzaehler():
    brett = chess.Board()
    for san in ("Nf3", "Nf6", "Ng1", "Ng8"):
        brett.push_san(san)
    assert schluessel(brett) == schluessel(chess.Board())


def test_benannte_eroeffnung_aus_der_lichess_liste():
    brett = chess.Board()
    for san in ("e4", "e5", "Qh5"):
        brett.push_san(san)
    eco, name = benannte_eroeffnungen()[schluessel(brett)]
    assert eco == "C20" and "Wayward Queen" in name
