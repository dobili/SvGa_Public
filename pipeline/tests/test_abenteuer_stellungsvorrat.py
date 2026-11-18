"""Tests für den Stellungsvorrat Bot gegen Bot (pipeline/abenteuer/stellungsvorrat.py).

Warum: Phase, Fenster und Band entscheiden, welche Stellung der Leser in einer kurzen Partieform
bekommt. Ohne Engine laufen die Regeln; mit Engine (``cd app && npm ci``) prüft ein Test eine
Stichprobe des eingecheckten Vorrats wie ``--pruefen``.
"""

import json

import chess
import pytest

from pipeline.abenteuer import stellungsvorrat as vorrat
from pipeline.trainer.engine import engine_vorhanden

ENDSPIEL = chess.Board("8/5k2/8/8/3R4/8/4K3/r7 w - - 0 1")


def test_material_und_phase():
    assert vorrat.material(chess.Board()) == 62
    assert vorrat.phase(chess.Board()) == "mittelspiel"
    assert vorrat.material(ENDSPIEL) == 10
    assert vorrat.phase(ENDSPIEL) == "endspiel"


def test_passende_formate_nach_fenster_und_matt():
    assert vorrat.passende_formate(chess.Board(), 0.2, None) == ["vorteil"]
    assert vorrat.passende_formate(chess.Board(), 1.2, None) == ["stellungsduell"]
    assert vorrat.passende_formate(ENDSPIEL, 3.0, None) == ["endspielSieg"]
    assert vorrat.passende_formate(ENDSPIEL, -0.5, None) == ["endspielRemis"]
    assert vorrat.passende_formate(ENDSPIEL, 98.0, 2) == []


def test_band_von_elo():
    assert vorrat.band_von(500) == "band1"
    assert vorrat.band_von(1300) == "band3"
    assert vorrat.band_von(2500) == "band5"


def test_eintrag_mit_zugfolge_zur_fen():
    brett = chess.Board()
    for san in ("e4", "e5", "Nf3"):
        brett.push_san(san)
    e = vorrat.eintrag("band2", "vorteil", 1, brett, 0.123)
    assert e == {
        "kennung": "band2.vorteil1",
        "fen": brett.fen(),
        "zuege": ["e4", "e5", "Nf3"],
        "bewertung": 0.12,
    }


def test_eintrag_mit_herkunft_und_halbzug():
    brett = chess.Board()
    for san in ("d4", "d5"):
        brett.push_san(san)
    herkunft = {"quelle": "bots", "weiss": {"bot": "igor", "stil": "taktiker"}}
    e = vorrat.eintrag("band4", "vorteil", 2, brett, 0.0, herkunft)
    assert e["herkunft"] == {**herkunft, "halbzug": 2}


class FesterBewerter:
    """Bewertet jede Stellung gleich (ohne Engine), damit nur Phase und Ablauf zählen."""

    def __init__(self, wert: float):
        self.wert = wert
        self.aufrufe = 0

    def bester(self, brett, tiefe):
        self.aufrufe += 1
        return type("Zug", (), {"wert": self.wert, "matt": None})()


ITALIENISCH = ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d3", "d6", "O-O", "O-O"]


def test_sammle_aus_zuegen_erst_ab_erstem_halbzug(monkeypatch):
    monkeypatch.setattr(vorrat, "ERSTER_HALBZUG", 10)
    bewerter = FesterBewerter(0.1)
    funde = vorrat.sammle_aus_zuegen(ITALIENISCH, bewerter, {"vorteil", "endspielSieg"})
    assert list(funde) == ["vorteil"]
    assert funde["vorteil"].ply() == 10
    # Danach fehlt nur noch das Endspiel: Im Mittelspiel wird nicht mehr bewertet.
    assert bewerter.aufrufe == 1


def test_lies_partien_je_band(tmp_path):
    partie = {"weiss": {"bot": "a", "stil": "x"}, "schwarz": {"bot": "b", "stil": "y"}, "zuege": []}
    (tmp_path / "band2.json").write_text(json.dumps({"band": "band2", "partien": [partie]}))
    (tmp_path / "band2-60.json").write_text(json.dumps({"band": "band2", "partien": [partie]}))
    je_band = vorrat.lies_partien(tmp_path)
    assert len(je_band["band2"]) == 2
    assert je_band["band1"] == []


def test_vorrat_hat_alle_baender_und_formate():
    daten = json.loads(vorrat.VORRAT.read_text(encoding="utf-8"))
    assert [b["kennung"] for b in daten["baender"]] == [b[0] for b in vorrat.BAENDER]
    for band in daten["baender"]:
        for format_ in vorrat.FORMATE:
            assert band["formate"][format_], f"{band['kennung']}: {format_} leer"


def test_zugfolgen_fuehren_zur_fen():
    daten = json.loads(vorrat.VORRAT.read_text(encoding="utf-8"))
    falsch = vorrat.pruefe(daten, lambda brett: (FORMAT_MITTE[vorrat.phase(brett)], None))
    assert [f for f in falsch if "Zugfolge" in f or "Phase" in f] == []


# Ein Wert, der in jedes Fenster der Phase fällt, damit nur Zugfolge und Phase geprüft werden.
FORMAT_MITTE = {"mittelspiel": 0.0, "endspiel": 0.0}


@pytest.mark.skipif(not engine_vorhanden(), reason="Engine fehlt (cd app && npm ci)")
def test_stichprobe_der_bewertungen():
    from pipeline.trainer.engine import Engine

    daten = json.loads(vorrat.VORRAT.read_text(encoding="utf-8"))
    stichprobe = {
        "schemaVersion": 1,
        "baender": [{**b, "formate": {f: e[:1] for f, e in b["formate"].items()}} for b in daten["baender"]],
    }
    with Engine() as engine:

        def bewerte(brett):
            zug = engine.bester(brett, vorrat.TIEFE)
            return (zug.wert, zug.matt) if zug else (0.0, None)

        assert vorrat.pruefe(stichprobe, bewerte) == []
