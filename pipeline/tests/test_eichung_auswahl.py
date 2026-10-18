"""Tests der Auswahl der Eichpartien (ohne Netz): Bänder, Zählstand, Ablage, Prüfung je Plattform."""

from __future__ import annotations

from pipeline.eichung import chesscom, lichess
from pipeline.eichung.auswahl import (
    BAENDER,
    Eichpartie,
    Seite,
    Zaehlstand,
    als_zeile,
    aus_zeile,
    band_von,
    genug_zuege,
    haenge_an,
    lies_partien,
)

ZUEGE = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Nb8 d4 Nbd7".split()
PGN = (
    "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O "
    "9. h3 Nb8 10. d4 Nbd7 *"
)


def _partie(band: int) -> Eichpartie:
    return Eichpartie(
        "lichess", "x", "600+0", Seite(band, 80.0), Seite(band, 70.5), ("e4",), "mate-white", band, "white"
    )


def test_baender_und_grenzen() -> None:
    assert BAENDER[0] == 400 and BAENDER[-1] == 2200 and len(BAENDER) == 10
    assert band_von(1234) == 1200
    assert band_von(400) == 400
    assert band_von(399) is None
    assert band_von(2399) == 2200
    assert band_von(2400) is None


def test_mindestens_zehn_zuege_je_seite() -> None:
    assert genug_zuege(20)
    assert not genug_zuege(19)


def test_zaehlstand_verteilt_und_setzt_fort() -> None:
    stand = Zaehlstand(300, [_partie(1200), _partie(1200)])
    assert stand.soll == 30
    assert stand.ist[1200] == 2
    assert stand.braucht(1200) and not stand.braucht(None)
    for _ in range(28):
        stand.zaehle(1200)
    assert not stand.braucht(1200)
    assert not stand.fertig()
    assert "1200–1399: 30/30" in stand.tabelle()


def test_ablage_hin_und_zurueck(tmp_path) -> None:
    partie = _partie(800)
    assert aus_zeile(als_zeile(partie)) == partie
    datei = tmp_path / "lichess.jsonl"
    haenge_an(datei, partie)
    haenge_an(datei, _partie(1000))
    assert [p.band for p in lies_partien(datei)] == [800, 1000]
    assert lies_partien(tmp_path / "fehlt.jsonl") == []


def _cc_spiel(**anders) -> dict:
    spiel = {
        "url": "https://www.chess.com/game/live/123",
        "uuid": "abc",
        "pgn": PGN,
        "time_control": "600",
        "time_class": "rapid",
        "rules": "chess",
        "rated": True,
        "accuracies": {"white": 81.2, "black": 74.9},
        "white": {"username": "Anna", "rating": 1250, "result": "win"},
        "black": {"username": "Ben", "rating": 1220, "result": "resigned"},
    }
    spiel.update(anders)
    return spiel


def test_chesscom_taugliche_partie() -> None:
    partie = chesscom.eichpartie(_cc_spiel(), "ben")
    assert partie is not None
    assert partie.seite == "black" and partie.band == 1200
    assert partie.weiss == Seite(1250, 81.2)
    assert list(partie.zuege) == ZUEGE
    assert "Anna" not in als_zeile(partie) and "Ben" not in als_zeile(partie)


def test_chesscom_untaugliche_partien() -> None:
    assert chesscom.eichpartie(_cc_spiel(accuracies=None), "anna") is None
    assert chesscom.eichpartie(_cc_spiel(time_class="blitz"), "anna") is None
    assert chesscom.eichpartie(_cc_spiel(rated=False), "anna") is None
    assert chesscom.eichpartie(_cc_spiel(pgn="1. e4 e5 *"), "anna") is None
    verlassen = {"username": "Ben", "rating": 1220, "result": "abandoned"}
    assert chesscom.eichpartie(_cc_spiel(black=verlassen), "anna") is None


def _li_spiel(**anders) -> dict:
    spiel = {
        "id": "aMpfEfmT",
        "rated": True,
        "variant": "standard",
        "speed": "rapid",
        "status": "resign",
        "winner": "white",
        "clock": {"initial": 600, "increment": 5},
        "moves": " ".join(ZUEGE),
        "players": {
            "white": {"user": {"id": "anna"}, "rating": 1789, "analysis": {"accuracy": 78}},
            "black": {"user": {"id": "ben"}, "rating": 1802, "analysis": {"accuracy": 71}},
        },
    }
    spiel.update(anders)
    return spiel


def test_lichess_taugliche_und_untaugliche_partien() -> None:
    partie = lichess.eichpartie(_li_spiel(), "anna")
    assert partie is not None
    assert partie.seite == "white" and partie.band == 1600 and partie.bedenkzeit == "600+5"
    assert partie.schwarz == Seite(1802, 71.0)
    assert lichess.eichpartie(_li_spiel(status="aborted"), "anna") is None
    assert lichess.eichpartie(_li_spiel(moves="e4 e5"), "anna") is None
    vorlaeufig = {"user": {"id": "ben"}, "rating": 1500, "provisional": True, "analysis": {"accuracy": 70}}
    spiel = _li_spiel()
    spiel["players"]["black"] = vorlaeufig
    assert lichess.eichpartie(spiel, "anna") is None
