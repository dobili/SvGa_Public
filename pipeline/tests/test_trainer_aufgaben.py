"""Tests der Aufgaben-Bausteine für die Trainer ohne Engine: Motive, Zugfolgen, Schwierigkeit, Strukturen."""

import chess

from pipeline.trainer.falle import scheinbarer_gewinn
from pipeline.trainer.lichess import lies_zeile
from pipeline.trainer.schwierigkeit import Messung, eiche, klasse, stufe_von_messung, stufe_von_wertung
from pipeline.trainer.struktur import erkenne, merkmale, schwierigkeit
from pipeline.trainer.taktik import hauptlinie, motiv_aus_text, motiv_aus_unterabschnitt

# Abb. 5.18 (Schwarz am Zug): Isolani d5; Abb. 5.22: hängende Bauern c5/d5 (Schwarz).
ISOLANI = "r1bq1rk1/pp2bppp/2n5/1B1p4/3N4/1P2P3/PB2QPPP/R4RK1 b - - 0 12"
HAENGEND = "r2q1rk1/pb1nbpp1/5n1p/2pp4/7B/2NBPN2/PP3PPP/2RQ1RK1 w - - 0 13"
# Abb. 5.32: Minderheitsangriff (Karlsbad), Abb. 5.3: Französisch, festgefahrene Kette f7-e6-d5.
KARLSBAD = "6k1/pp3ppp/2p5/3p4/3P4/4P3/PP3PPP/6K1 w - - 0 1"
FRANZOESISCH = "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3"
# Klammerfalle nach 5. axb5, Schwarz am Zug: cxb5 nimmt einen ungedeckten Bauern.
KLAMMERFALLE = "rnbqkbnr/p3pppp/2p5/1P6/2pP4/4P3/1P3PPP/RNBQKBNR b KQkq - 0 5"


def test_motive_aus_texten_und_unterabschnitten():
    assert motiv_aus_text("Hinlenkung und Gabel") == ("hinlenkung", None)
    assert motiv_aus_text("Grundreihenmatt") == (None, "grundreihe")
    assert motiv_aus_text("Damenopfer und Grundreihenmatt") == (None, "grundreihe")
    assert motiv_aus_text("Rasender Turm und Patt") == ("rettung", None)
    assert motiv_aus_text("Opposition") == (None, None)
    assert motiv_aus_unterabschnitt("4. Batterie und Abzug") == ("abzug", None)
    assert motiv_aus_unterabschnitt("Das Grundreihenmatt") == (None, "grundreihe")
    assert motiv_aus_unterabschnitt("Arabisches Matt und Treppenmatt") == (None, None)


def test_hauptlinie_ab_pfad():
    zuege = [
        {
            "zug": "e4",
            "zeichen": "",
            "abbildungen": [],
            "weiter": [
                {
                    "zug": "e5",
                    "zeichen": "",
                    "abbildungen": [],
                    "weiter": [
                        {"zug": "Nf3", "zeichen": "", "abbildungen": [], "weiter": []},
                        {"zug": "Bc4", "zeichen": "", "abbildungen": [], "weiter": []},
                    ],
                },
            ],
        },
    ]
    assert hauptlinie(zuege, []) == ["e4", "e5", "Nf3"]
    assert hauptlinie(zuege, ["e4", "e5"]) == ["Nf3"]
    assert hauptlinie(zuege, ["d4"]) == []


def test_stufen_und_eichung():
    assert [stufe_von_wertung(w) for w in (800, 999, 1000, 1450, 1899, 1900, 2400)] == [1, 1, 2, 3, 4, 5, 5]
    assert (
        klasse(Messung(1, 1)) == "t0-l0"
        and klasse(Messung(6, 2)) == "t2-l1"
        and klasse(Messung(None, 3)) == "t3-l2"
    )
    eichung = eiche(
        [(Messung(1, 1), w) for w in (900, 950, 1000, 1100, 1150)]
        + [(Messung(12, 2), w) for w in (1700, 1750, 1800, 1850, 1900)]
        + [(Messung(5, 3), 2500)]  # eine einzelne Aufgabe eicht nichts
    )
    assert eichung == {"t0-l0": 2, "t3-l1": 4}
    assert stufe_von_messung(Messung(1, 1), eichung) == 2
    assert stufe_von_messung(Messung(12, 1), eichung) == 4  # Nachbarklasse t3-l1
    assert stufe_von_messung(Messung(5, 3), {}) == 3


def test_lichess_zeile_lesen():
    zeile = {
        "PuzzleId": "00008", "FEN": "r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24",
        "Moves": "f2g3 e6e7 b2b1 b3c1 b1c1 h6c1", "Rating": "1900", "RatingDeviation": "75",
        "Popularity": "95", "NbPlays": "5000", "Themes": "crushing hangingPiece long middlegame",
        "GameUrl": "https://lichess.org/787zsVup/black#48", "OpeningTags": "",
    }  # fmt: skip
    puzzle = lies_zeile(zeile)
    assert puzzle is not None and puzzle.loesung[0] == "Rxe7" and puzzle.wertung == 1900
    assert puzzle.motiv is None and puzzle.mattbild is None and "hangingPiece" in puzzle.themen
    assert lies_zeile({**zeile, "Themes": "fork pin"}) is None  # zwei Motive
    assert lies_zeile({**zeile, "RatingDeviation": "200"}) is None
    assert lies_zeile({**zeile, "Themes": "fork"}).motiv == "doppelangriff"


def test_strukturen_erkennen():
    assert erkenne(chess.Board(ISOLANI)) == ("isolani", chess.BLACK)
    assert erkenne(chess.Board(HAENGEND)) == ("haengendeBauern", chess.BLACK)
    assert erkenne(chess.Board(KARLSBAD)) == ("minderheitsangriff", chess.WHITE)
    assert erkenne(chess.Board(FRANZOESISCH)) == ("kette", chess.BLACK)
    assert erkenne(chess.Board()) is None
    schwarz = merkmale(chess.Board(ISOLANI), chess.BLACK)
    assert [chess.square_name(f) for f in schwarz.isolierte] == ["d5"] and schwarz.inseln == 3


def test_schwierigkeit_der_struktur():
    stufe, merkmale_anzahl, figuren = schwierigkeit(chess.Board(KARLSBAD))
    assert (stufe, merkmale_anzahl, figuren) == (1, 0, 0)
    assert schwierigkeit(chess.Board(HAENGEND))[0] >= 3


def test_scheinbarer_gewinn():
    brett = chess.Board(KLAMMERFALLE)
    assert scheinbarer_gewinn(brett, brett.parse_san("cxb5")) is True
    anfang = chess.Board()
    anfang.push_san("e4")
    anfang.push_san("d5")  # noqa: E702
    assert scheinbarer_gewinn(anfang, anfang.parse_san("exd5")) is False  # gedeckt, gleicher Wert
