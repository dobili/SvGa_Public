"""Tests für die Eröffnungsliste von Lichess (Vorschlag G, seit 0.2.32)."""

from __future__ import annotations

import chess

from pipeline.eroeffnungsliste import baue, deutscher_name, stellungsschluessel


def test_familie_deutsch_variante_englisch() -> None:
    familien = {"Sicilian Defense": "Sizilianische Verteidigung"}
    assert (
        deutscher_name("Sicilian Defense: Najdorf Variation", familien)
        == "Sizilianische Verteidigung: Najdorf Variation"
    )
    assert deutscher_name("Amar Opening", familien) == "Amar Opening"


def test_schluessel_wie_in_der_app() -> None:
    brett = chess.Board()
    brett.push_san("e4")
    assert stellungsschluessel(brett) == "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq"


def test_liste_enthaelt_bekannte_eroeffnungen_und_ist_eindeutig() -> None:
    daten = baue()
    stellungen = daten["stellungen"]
    assert isinstance(stellungen, list)
    schluessel = [s[0] for s in stellungen]
    assert len(schluessel) == len(set(schluessel))
    namen = {s[2] for s in stellungen}
    assert "Sizilianische Verteidigung: Najdorf Variation" in namen
    assert any(n.startswith("Spanische Partie") for n in namen)


def test_englische_liste_behaelt_die_namen_von_lichess() -> None:
    namen = {s[2] for s in baue(sprache="en")["stellungen"]}  # type: ignore[union-attr]
    assert "Sicilian Defense: Najdorf Variation" in namen
    assert any(n.startswith("Ruy Lopez") for n in namen)
    assert not any(n.startswith("Spanische Partie") for n in namen)
