"""Prüft die eingecheckten Trainerdaten (``inhalte/de/trainer/``) gegen die Schemas und auf Spielbarkeit.

Ohne Engine und ohne Buchquellen: Jede Datei muss zu ihrem Schema passen, jede Stellung lesbar
sein, jeder Zug in seiner Stellung gehen, jede Kennung nur einmal vorkommen.
"""

import json
from pathlib import Path

import chess
import pytest

from pipeline.bauen.__main__ import pruefe_schema

TRAINER = Path(__file__).resolve().parents[2] / "inhalte" / "de" / "trainer"
DATEIEN = {
    "uebungen-engine.json": "trainer-uebungen-engine.schema.json",
    "taktik.json": "trainer-taktik.schema.json",
    "falle.json": "trainer-falle.schema.json",
    "struktur.json": "trainer-struktur.schema.json",
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
        if a["ziel"] == "matt":
            assert brett.is_checkmate() or a["herkunft"]["quelle"] == "lichess", a["id"]
        start = chess.Board(a["fen"])
        assert chess.square_name(start.parse_san(a["loesung"][0]).from_square) == a["schluesselfeld"]
        for san in a["akzeptiert"]:
            start.parse_san(san)


def test_falle_angebote_gehen():
    daten = _lies("falle.json")
    for a in daten["aufgaben"]:
        brett = chess.Board(a["fen"])
        assert brett.is_capture(brett.parse_san(a["angebot"])), a["id"]
        assert a["fortsetzung"][0] == a["angebot"]
        _spiele(a["fen"], a["fortsetzung"])
        if a["antwort"] == "falle":
            assert a["verlustBeimNehmen"] >= daten["massstab"]["falleAbVerlust"]
        else:
            assert a["verlustBeimNehmen"] <= daten["massstab"]["geschenkBisVerlust"]


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
