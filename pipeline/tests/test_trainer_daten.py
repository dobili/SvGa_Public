"""Prüft die eingecheckten Trainerdaten (``inhalte/de/trainer/``) gegen die Schemas und auf Spielbarkeit.

Ohne Engine und ohne Buchquellen: Jede Datei muss zu ihrem Schema passen, jede Stellung lesbar
sein, jeder Zug in seiner Stellung gehen, jede Kennung nur einmal vorkommen.
"""

import json
from pathlib import Path

import chess
import pytest

from pipeline.bauen.__main__ import pruefe_schema
from pipeline.trainer.endspiel import KANDIDATEN

# Remisaufgaben nach dem Urteil des Buches, wo die Engine ohne Endspieldatenbank unklar bleibt (9.41).
BUCHURTEIL = {k.abbildung for k in KANDIDATEN if k.buch == "remis"}

TRAINER = Path(__file__).resolve().parents[2] / "inhalte" / "de" / "trainer"
DATEIEN = {
    "uebungen-engine.json": "trainer-uebungen-engine.schema.json",
    "taktik.json": "trainer-taktik.schema.json",
    "falle.json": "trainer-falle.schema.json",
    "struktur.json": "trainer-struktur.schema.json",
    "endspiel.json": "trainer-endspiel.schema.json",
}


def _lies(name: str) -> dict:
    pfad = TRAINER / name
    if not pfad.exists():
        pytest.skip(f"{name} noch nicht gebaut")
    return json.loads(pfad.read_text(encoding="utf-8"))


def _spiele(fen: str, zuege: list[str]) -> chess.Board:
    brett = chess.Board(fen)
    for san in zuege:
        brett.push_san(san)
    return brett


@pytest.mark.parametrize("name", sorted(DATEIEN))
def test_schema(name):
    assert pruefe_schema(_lies(name), DATEIEN[name]) == []


def test_struktur_vorhanden_und_eindeutig():
    daten = _lies("struktur.json")
    kennungen = [a["id"] for a in daten["aufgaben"]]
    assert len(kennungen) == len(set(kennungen)) and len(kennungen) >= 48
    for a in daten["aufgaben"]:
        chess.Board(a["fen"])


def test_taktik_loesungen_gehen():
    daten = _lies("taktik.json")
    kennungen = [a["id"] for a in daten["aufgaben"]]
    assert len(kennungen) == len(set(kennungen))
    for a in daten["aufgaben"]:
        brett = _spiele(a["fen"], a["loesung"])
        if brett.is_checkmate():
            assert a["ziel"] == "matt", a["id"]
        start = chess.Board(a["fen"])
        assert chess.square_name(start.parse_san(a["loesung"][0]).from_square) == a["schluesselfeld"]
        for san in a["akzeptiert"]:
            start.parse_san(san)


def test_falle_angebote_gehen():
    """Köder-Zug führt zur Stellung, Angebot ist ein Schlag, Fallen stehen klar schlechter (R50)."""
    daten = _lies("falle.json")
    massstab = daten["massstab"]
    kennungen = [a["id"] for a in daten["aufgaben"]]
    assert len(kennungen) == len(set(kennungen))
    for a in daten["aufgaben"]:
        vorher = chess.Board(a["fenVorher"])
        vorher.push_san(a["vorzug"])
        assert vorher.fen() == a["fen"], a["id"]
        brett = chess.Board(a["fen"])
        assert brett.is_capture(brett.parse_san(a["angebot"])), a["id"]
        assert a["fortsetzung"][0] == a["angebot"]
        _spiele(a["fen"], a["fortsetzung"])
        abfall = a["wertVorher"] - a["wertNachher"]
        assert abs(abfall - a["verlustBeimNehmen"]) < 0.02, a["id"]
        if a["antwort"] == "falle":
            assert abfall >= massstab["falleAbVerlust"], a["id"]
            assert a["wertNachher"] <= -massstab["falleSchlechterAb"], a["id"]
        else:
            assert abfall <= massstab["geschenkBisVerlust"], a["id"]
            assert a["wertNachher"] > -massstab["falleSchlechterAb"], a["id"]


def test_uebungen_engine_zuege_gehen():
    daten = _lies("uebungen-engine.json")
    assert len(daten["uebungen"]) == 86
    for u in daten["uebungen"]:
        if u["art"] != "zug":
            continue
        brett = chess.Board(u["fen"])
        brett.parse_san(u["buchzug"])
        for z in u["zuege"]:
            brett.parse_san(z["san"])
        assert any(z["status"] == "buch" for z in u["zuege"])


def test_endspiel_stellungen_spielbar_und_stimmig():
    daten = _lies("endspiel.json")
    kennungen = [a["id"] for a in daten["aufgaben"]]
    assert len(kennungen) == len(set(kennungen)) and len(kennungen) >= 40
    for a in daten["aufgaben"]:
        brett = chess.Board(a["fen"])
        assert brett.is_valid() and not brett.is_game_over(), a["id"]
        # Der beste Zug gehört der Seite am Zug; der Wert aus Sicht des Lesers passt zum Ziel.
        brett.parse_san(a["pruefung"]["bester"])
        if a["ziel"] == "gewinn":
            assert a["pruefung"]["wert"] >= daten["massstab"]["gewinnAb"], a["id"]
        elif a["herkunft"].get("abbildung") not in BUCHURTEIL:
            assert abs(a["pruefung"]["wert"]) <= daten["massstab"]["remisBis"], a["id"]
        if a["herkunft"]["quelle"] == "lichess":
            # Freie Aufgaben (R47): der Leser ist am Zug, Stufe nach der Lichess-Wertung.
            assert a["id"].startswith("endspiel-l-") and a["leser"] == ("w" if brett.turn else "b"), a["id"]
            assert a["thema"] in {"bauernendspiel", "turmendspiel", "damenendspiel", "leichtfiguren"}, a["id"]
