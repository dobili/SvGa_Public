"""Tests der Plan-Prüfung im Strukturerkenner (Nebenchat, 30.10.2026).

Warum: Der Autor meldete Pläne, die nicht zur Stellung passten (Abb. 5.28: „Kette“, obwohl d4
und e5 laut Buch in Spannung stehen). Ketten zählen nur noch blockiert und ohne Spannung,
Doppelbauern nur, wenn einer ungedeckt ist; reine Bauernstellungen und Stellungen im Schach
werden keine Aufgabe.
"""

import chess

from pipeline.trainer.struktur import (
    NICHT_ALS_AUFGABE,
    auch_passend,
    doppelbauer_angreifbar,
    in_spannung,
    kette_blockiert,
    merkmale,
    strukturen,
    taugt_als_aufgabe,
)

SPANISCH_5_28 = "r4rk1/2qbbppp/2np1n2/1p2p3/p2PP3/4BN1P/PPBN1PP1/R2QR1K1 w - - 2 17"
KETTE_VERKEILT = "4k3/8/3p4/3Pp3/4P3/5P2/8/4K3 w - - 0 1"


def test_spannung_in_abb_5_28():
    assert in_spannung(chess.Board(SPANISCH_5_28))
    assert "5.28" in NICHT_ALS_AUFGABE


def test_verkeilte_kette_ist_blockiert():
    brett = chess.Board(KETTE_VERKEILT)
    assert not in_spannung(brett)
    kette = merkmale(brett, chess.WHITE).ketten[0]
    assert kette_blockiert(brett, kette, chess.WHITE)
    assert ("kette", chess.WHITE) in strukturen(brett)
    assert auch_passend(brett, "w", "fluegelDerKette") == []


def test_gedeckte_doppelbauern_sind_kein_ziel():
    gedeckt = chess.Board("4k3/8/8/8/8/5P2/5PP1/4K3 w - - 0 1")  # f2/f3, g2 deckt f3
    m = merkmale(gedeckt, chess.WHITE)
    assert m.doppelte
    assert not doppelbauer_angreifbar(gedeckt, m, chess.WHITE)
    ungedeckt = chess.Board("4k3/8/8/8/2P5/2P5/8/4K3 w - - 0 1")  # c3/c4 wie Abb. 5.16
    assert doppelbauer_angreifbar(ungedeckt, merkmale(ungedeckt, chess.WHITE), chess.WHITE)


def test_reine_bauernstellung_und_schach_taugen_nicht():
    assert not taugt_als_aufgabe(chess.Board("4k3/pp6/8/8/8/8/PP6/4K3 w - - 0 1"))
    assert not taugt_als_aufgabe(chess.Board("6k1/8/8/8/8/8/5PPP/4r1K1 w - - 0 1"))
    assert taugt_als_aufgabe(chess.Board(SPANISCH_5_28))
