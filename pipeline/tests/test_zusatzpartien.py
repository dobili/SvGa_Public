"""Tests für die Auswahl der Zusatzpartien (pipeline/zusatzpartien.py, 30.10.2026)."""

from __future__ import annotations

import json

from pipeline.zusatzpartien import (
    ZIEL,
    auswahl,
    buchfamilie,
    geprueft,
    klassisch,
    lies_partien,
    minuten_aus_zeitkontrolle,
    taugt,
)

# 15 Züge je Seite: Spanische Partie, geschlossene Variante (Züge legal, Partie erfunden).
SPANISCH = (
    "1. e4 { [%clk 1:30:30] } 1... e5 { [%clk 1:30:30] } 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 "
    "6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7 11. Nbd2 Bb7 12. Bc2 Re8 13. Nf1 Bf8 "
    "14. Ng3 g6 15. a4 c5 1-0"
)
KOPF = {
    "Event": "Olympiade",
    "Result": "1-0",
    "WhiteElo": "2700",
    "BlackElo": "2600",
    "White": "A",
    "Black": "B",
    "GameURL": "https://lichess.org/broadcast/x/runde-1/abc/def",
}
FAMILIEN = [
    {"name": "Ruy Lopez", "folge": "e4 e5 Nf3 Nc6 Bb5", "buch": "2.2"},
    {"name": "King's Pawn Game", "folge": "e4", "buch": None},
]


def test_zeitkontrolle_in_minuten() -> None:
    assert minuten_aus_zeitkontrolle("90+30") == 90
    assert minuten_aus_zeitkontrolle("5400+30") == 90
    assert minuten_aus_zeitkontrolle("1:30:30") == 90
    assert minuten_aus_zeitkontrolle("90' + 30'' each move") == 90
    assert minuten_aus_zeitkontrolle("-") is None


def test_klassisch_nach_uhr_und_name() -> None:
    assert klassisch(KOPF, SPANISCH)
    schnell = SPANISCH.replace("1:30:30", "0:15:10")
    assert not klassisch(KOPF, schnell)
    assert not klassisch({**KOPF, "BroadcastName": "TCEC S30"}, SPANISCH)
    assert klassisch({**KOPF, "TimeControl": "90+30"}, "1. e4 e5")


def test_partien_lesen_und_pruefen() -> None:
    zeilen = [f'[{k} "{v}"]\n' for k, v in KOPF.items()] + ["\n", SPANISCH + "\n"]
    [(kopf, zugtext)] = list(lies_partien(zeilen * 2))[:1]
    zuege = taugt(kopf, zugtext)
    assert zuege is not None and len(zuege) == 30 and zuege[8] == "O-O"
    assert taugt({**KOPF, "Result": "1/2-1/2"}, SPANISCH) is None
    assert taugt({**KOPF, "BlackElo": "2499"}, SPANISCH) is None
    assert geprueft(["e4", "e5", "Ke3"]) is None


def test_buchfamilie_und_auswahl() -> None:
    zuege = taugt(KOPF, SPANISCH)
    assert zuege is not None
    assert buchfamilie(zuege, FAMILIEN) == "Ruy Lopez"
    assert buchfamilie(["d4"], FAMILIEN) is None
    # Derselbe Spieler höchstens zweimal.
    liste = [({**KOPF, "GameURL": f"u{i}"}, zuege) for i in range(4)]
    assert len(auswahl(liste, FAMILIEN)) == 2


def test_datei_der_app_hat_quelle_und_lizenz() -> None:
    daten = json.loads(ZIEL.read_text(encoding="utf-8"))
    for partie in daten["partien"]:
        assert partie["quelle"] and partie["lizenz"]
        assert geprueft(partie["zuege"].split()) == partie["zuege"].split()
