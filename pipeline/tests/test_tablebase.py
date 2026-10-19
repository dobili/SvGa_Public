"""Tests der Tablebase-Prüfung (ohne Netz: die Abfrage ist nachgestellt)."""

import chess

from pipeline.pruefen.tablebase import Tablebase, Urteil, pruefe_aufgaben

BAUER_GEGEN_KOENIG = "4k3/8/8/8/4P3/8/4K3/8 w - - 0 1"  # Abb. 8.25, remis


def _nachgestellt(antworten: dict[str, dict]):
    aufrufe = []

    def abfrage(fen: str) -> dict:
        aufrufe.append(fen)
        return antworten[" ".join(fen.split()[:4])]

    return abfrage, aufrufe


def test_urteil_aus_sicht_beider_seiten():
    assert Urteil("loss", ()).fuer(chess.BLACK, chess.WHITE) == "gewinn"
    assert Urteil("win", ()).fuer(chess.WHITE, chess.WHITE) == "gewinn"
    assert Urteil("cursed-win", ()).fuer(chess.WHITE, chess.WHITE) == "remis"


def test_zwischenspeicher_und_grenze_von_sieben_steinen(tmp_path):
    antwort = {"category": "draw", "moves": [{"san": "e5", "category": "draw"}]}
    abfrage, aufrufe = _nachgestellt({"4k3/8/8/8/4P3/8/4K3/8 w - -": antwort})
    tablebase = Tablebase(abfrage, tmp_path / "abfragen.json")
    assert tablebase.urteil(BAUER_GEGEN_KOENIG) == Urteil("draw", ("e5",))
    assert Tablebase(abfrage, tmp_path / "abfragen.json").urteil(BAUER_GEGEN_KOENIG) is not None
    assert len(aufrufe) == 1  # das zweite Mal aus dem Zwischenspeicher
    assert tablebase.urteil(chess.STARTING_FEN) is None


def test_widerspruch_zwischen_aufgabe_und_tablebase(tmp_path):
    abfrage, _ = _nachgestellt({"4k3/8/8/8/4P3/8/4K3/8 w - -": {"category": "draw", "moves": []}})
    tablebase = Tablebase(abfrage, tmp_path / "abfragen.json")
    halten = {
        "id": "a",
        "fen": BAUER_GEGEN_KOENIG,
        "leser": "b",
        "ziel": "remis",
        "herkunft": {"abbildung": "8.25"},
    }
    gewinnen = {**halten, "leser": "w", "ziel": "gewinn"}
    assert pruefe_aufgaben([halten], tablebase) == []
    (widerspruch,) = pruefe_aufgaben([gewinnen], tablebase)
    assert widerspruch.abbildung == "8.25" and widerspruch.tablebase == "remis"
