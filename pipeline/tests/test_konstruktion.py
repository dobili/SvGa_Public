"""Tests der konstruierten Partien ohne Engine: Abstand, Zugfilter, Kennung und PGN."""

import chess

from pipeline.zugfolgen.konstruieren import Abbildung, als_pgn, eroeffnungszuege, kennung
from pipeline.zugfolgen.konstruktion import Einstellung, Ergebnis, Zugurteil, erlaubt
from pipeline.zugfolgen.pgn import lies_freigegebene
from pipeline.zugfolgen.zielabstand import UNERREICHBAR, abstand, bauernweg, figurenweg, zuordnung

ABB_825 = "4k3/8/8/8/4P3/8/4K3/8 w - - 0 1"


def test_wege_der_figuren_und_bauern():
    assert figurenweg(chess.BISHOP, chess.C1, chess.H6) == 1
    assert figurenweg(chess.BISHOP, chess.C1, chess.C3) == 2
    assert figurenweg(chess.BISHOP, chess.C1, chess.C2) == UNERREICHBAR
    assert figurenweg(chess.KNIGHT, chess.G1, chess.F3) == 1
    assert bauernweg(chess.WHITE, chess.E2, chess.E4) == 2
    assert bauernweg(chess.WHITE, chess.E4, chess.E2) == UNERREICHBAR
    assert bauernweg(chess.BLACK, chess.E7, chess.D6) == 4  # ein Schritt, ein Linienwechsel (3)


def test_eindeutige_zuordnung():
    # Zwei Ziele, zwei Quellen: Die billigere Zuordnung kreuzt nicht.
    assert zuordnung(((1, 5), (5, 1))) == (2, 0, 0b11)
    # Ein Ziel ohne erreichbare Quelle bleibt offen.
    assert zuordnung(((UNERREICHBAR,),)) == (0, 1, 0)


def test_abstand_zur_grundstellung_und_zu_abb_825():
    assert abstand(chess.Board(), chess.Board()).summe == 0
    a = abstand(chess.Board(), chess.Board(ABB_825))
    assert a.fehlt == 0 and a.ueberzahl == 29  # 14 weiße und 15 schwarze Steine zu viel
    # Schwarz hat einen Bauern mehr übrig als Weiß: Er muss ihn ohne Gegenwert hergeben.
    assert a.abzugeben(chess.BLACK) == 1 and a.abzugeben(chess.WHITE) == -1


def test_zugestaendnis_nur_spaet_und_mit_schlag():
    einstellung = Einstellung()
    gut = Zugurteil(chess.Move.null(), 2.0, False)
    teuer = Zugurteil(chess.Move.null(), 20.0, True)
    frueh = abstand(chess.Board(), chess.Board(ABB_825))
    assert erlaubt(gut, frueh, chess.BLACK, einstellung)
    assert not erlaubt(teuer, frueh, chess.BLACK, einstellung)  # Weiß hat noch viel zum Tauschen
    spaet = abstand(chess.Board("4k3/7p/8/8/4P3/8/4K3/8 w - - 0 1"), chess.Board(ABB_825))
    assert erlaubt(teuer, spaet, chess.BLACK, einstellung)
    assert not erlaubt(Zugurteil(chess.Move.null(), 20.0, False), spaet, chess.BLACK, einstellung)


def test_pgn_einer_konstruierten_partie(tmp_path):
    abbildung = Abbildung(
        "10.1", 10, "10.1", "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", ()
    )
    zuege = [chess.Move.from_uci(u) for u in ("e2e4", "e7e5", "g1f3")]
    pgn = str(als_pgn(abbildung, Ergebnis(zuege, [0.0, 0.0, 0.0], "Königsspringer")))
    assert kennung(abbildung) == "k10-a1-k"
    assert '[Status "konstruiert"]' in pgn and "2. Nf3 { Abb. 10.1 }" in pgn
    pfad = tmp_path / "kap10" / "k10-a1-k.pgn"
    pfad.parent.mkdir()
    pfad.write_text(pgn, encoding="utf-8")
    (gelesen,) = lies_freigegebene(tmp_path, 10, {"10.1": abbildung.fen})
    assert gelesen.befunde == [] and gelesen.daten["status"] == "konstruiert"


def test_eigener_vorlauf():
    assert eroeffnungszuege("Semi-Tarrasch|d4 d5 c4") == ["d4", "d5", "c4"]
    assert eroeffnungszuege("Ruy Lopez: Exchange Variation")[-1] == "Bxc6"
