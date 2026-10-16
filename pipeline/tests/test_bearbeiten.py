"""Tests für das Bearbeiten von PGN-Dateien bei der Freigabe (zusammenführen, Vorlauf, aufteilen)."""

import chess

from pipeline.zugfolgen.bearbeiten import (
    abbildungen,
    ergaenze,
    fuehre_zusammen,
    knoten_am_pfad,
    lies,
    loesche_zweig,
    mit_vorlauf,
    neues_beispiel,
    trenne_ab,
    zur_hauptlinie,
)
from pipeline.zugfolgen.pgn import lies_status

KOPF = (
    '[Event "Kapitel 10: Test"]\n[Beispiel "{id}"]\n[Kapitel "10"]\n[Abschnitt "10.1"]\n[Status "entwurf"]\n'
)


def _datei(tmp_path, kennung, zuege, fen=None):
    kopf = KOPF.format(id=kennung)
    if fen:
        kopf += f'[FEN "{fen}"]\n[SetUp "1"]\n'
    pfad = tmp_path / f"{kennung}.pgn"
    pfad.write_text(kopf + "\n" + zuege + " *\n", encoding="utf-8")
    return pfad


def _fen_nach(zuege):
    brett = chess.Board()
    for zug in zuege:
        brett.push_san(zug)
    return brett.fen()


def test_zusammenfuehren_haengt_an_der_gleichen_stellung_an(tmp_path):
    ziel = _datei(tmp_path, "k10-a1", "1. e4 e5 2. Nf3 { Abb. 10.1 } Nc6")
    quelle = _datei(
        tmp_path, "k10-a2", "{ Abb. 10.2 } 2... Nc6 3. Bb5 { Abb. 10.3 }", _fen_nach(["e4", "e5", "Nf3"])
    )
    fuehre_zusammen(ziel, quelle)
    spiel = lies(ziel)
    assert abbildungen(spiel) == ["10.1", "10.2", "10.3"]
    assert knoten_am_pfad(spiel, ["e4", "e5", "Nf3", "Nc6", "Bb5"]).comment == "Abb. 10.3"
    assert spiel.headers["Abbildungen"] == "10.1 10.2 10.3"
    assert lies_status(quelle) == "verworfen"


def test_vorlauf_macht_ein_beispiel_ab_der_grundstellung_spielbar(tmp_path):
    vorlauf = lies(_datei(tmp_path, "k04-a6", "1. e4 e5 2. Nf3 { Abb. 4.1 } Nc6 3. Bb5"))
    quelle = _datei(
        tmp_path, "k04-a32", "{ Abb. 4.32 } 3... a6", _fen_nach(["e4", "e5", "Nf3", "Nc6", "Bb5"])
    )
    mit_vorlauf(quelle, vorlauf)
    spiel = lies(quelle)
    assert spiel.board().fen() == chess.STARTING_FEN and "FEN" not in spiel.headers
    assert abbildungen(spiel) == ["4.32"]
    assert knoten_am_pfad(spiel, ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6"]) is not None


def test_aufteilen_und_zweig_loeschen(tmp_path):
    quelle = _datei(
        tmp_path, "k04-a6", "1. e4 e5 ( 1... c5 2. d4 { Abb. 4.27 } ) 2. Nf3 { Abb. 4.6 } ( 2. c4 )"
    )
    neu = tmp_path / "k04-a27.pgn"
    trenne_ab(quelle, ["e4", "c5"], neu, "k04-a27", "4.3")
    assert abbildungen(lies(neu)) == ["4.27"] and lies(neu).headers["Beispiel"] == "k04-a27"
    assert abbildungen(lies(quelle)) == ["4.6"]
    loesche_zweig(quelle, ["e4", "e5", "c4"])
    assert [v.san() for v in knoten_am_pfad(lies(quelle), ["e4", "e5"]).variations] == ["Nf3"]


def test_neues_beispiel_ab_einer_abbildung(tmp_path):
    ziel = tmp_path / "k00-a12.pgn"
    fen = "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1"
    kopf = {"Event": "Kapitel 0: Rochade", "Beispiel": "k00-a12", "Kapitel": "0", "Abschnitt": "0.3"}
    neues_beispiel(ziel, fen, [("O-O", "Abb. 0.13")], kopf, "Abb. 0.12")
    spiel = lies(ziel)
    assert spiel.comment == "Abb. 0.12" and abbildungen(spiel) == ["0.12", "0.13"]
    assert lies_status(ziel) == "geprueft"


def test_ergaenzen_und_zur_hauptlinie_machen(tmp_path):
    datei = _datei(tmp_path, "k10-a1", "1. e4 e5 2. Nf3 { Abb. 10.1 } ( 2. f4 )")
    ergaenze(datei, ["e4", "e5"], "2. Bc4 $1 Nf6 { Abb. 10.5 } ( 2... Bc5 3. c3 )")
    zur_hauptlinie(datei, ["e4", "e5", "Bc4"])
    spiel = lies(datei)
    assert [v.san() for v in knoten_am_pfad(spiel, ["e4", "e5"]).variations] == ["Bc4", "Nf3", "f4"]
    assert knoten_am_pfad(spiel, ["e4", "e5", "Bc4"]).nags == {1}
    assert knoten_am_pfad(spiel, ["e4", "e5", "Bc4", "Bc5", "c3"]) is not None
    assert "10.5" in spiel.headers["Abbildungen"]
