"""Tests für die Eröffnungen nach Elo-Band (Eröffnungspaket, Stufe 1)."""

from __future__ import annotations

from pipeline.praxisbuch.baender import familie, ist_gambit, je_band, seite_der_familie


def test_familie_vor_dem_doppelpunkt() -> None:
    assert familie("Sicilian Defense: Najdorf Variation") == "Sicilian Defense"


def test_sammelname_zaehlt_mit_dem_ersten_teil() -> None:
    assert familie("Queen's Pawn Game: London System") == "London System"
    assert familie("Queen's Pawn Game: Accelerated London System") == "London System"
    assert familie("King's Pawn Game: Wayward Queen Attack") == "Wayward Queen Attack"


def test_sammelname_allein_oder_mit_bloesser_variante_ist_keine_wahl() -> None:
    assert familie("King's Pawn Game") is None
    assert familie("King's Knight Opening: Normal Variation") is None


def test_damengambit_ist_kein_gambit() -> None:
    assert not ist_gambit("Queen's Gambit Declined: Orthodox Defense")
    assert ist_gambit("Sicilian Defense: Smith-Morra Gambit")
    assert ist_gambit("Englund Gambit")


def test_seite() -> None:
    assert seite_der_familie("Caro-Kann Defense", 2) == "s"
    assert seite_der_familie("King's Gambit Accepted", 4) == "s"
    assert seite_der_familie("Italian Game", 5) == "w"
    assert seite_der_familie("Englund Gambit", 2) == "s"


def test_je_band_summiert_die_zeitklassen() -> None:
    # Zelle = Zeitklasse · 13 + Band: Band 0 in Blitz (0) und Schnellschach (13)
    zahlen = je_band({0: 5, 13: 7, 1: 2})
    assert zahlen[0] == 12
    assert zahlen[1] == 2
