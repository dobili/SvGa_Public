"""Tests für den Wertungsvergleich (Profile kürzen, Namensabgleich, Quantile, Bänder)."""

import random

from pipeline.wertungsvergleich.abgleich import treffer, woerter
from pipeline.wertungsvergleich.auswerten import fide_paare, monoton, quantil, tabelle
from pipeline.wertungsvergleich.sammeln import chesscom_name, kurzprofil

JETZT_MS = 1_800_000_000_000


def test_chesscom_name_aus_dem_linkfeld():
    assert chesscom_name("https://www.chess.com/member/Hikaru") == "hikaru"
    assert chesscom_name("youtube.com/x chess.com/players/Abc_1") == "abc_1"
    assert chesscom_name("lichess.org/@/x") is None


def test_kurzprofil_nur_mit_fide_oder_chesscom_und_ohne_klarnamen():
    nutzer = {
        "id": "a",
        "perfs": {"blitz": {"rating": 1800, "rd": 60, "games": 300, "prog": 5}},
        "profile": {"fideRating": 1650, "realName": "Max Muster", "flag": "DE"},
        "seenAt": JETZT_MS,
    }
    kurz = kurzprofil(nutzer)
    assert kurz is not None
    assert kurz["fide"] == 1650
    assert "Max" not in str(kurz)
    assert kurzprofil({**nutzer, "tosViolation": True}) is None
    assert kurzprofil({**nutzer, "profile": {"flag": "DE"}}) is None


def test_namensabgleich_eindeutig_und_mit_zahl():
    index = {
        woerter("Carlsen, Magnus"): [{"fide_id": 1, "standard": 2830, "schnell": 0, "blitz": 0}],
        woerter("Muster, Max"): [
            {"fide_id": 2, "standard": 1500, "schnell": 0, "blitz": 0},
            {"fide_id": 3, "standard": 1520, "schnell": 0, "blitz": 0},
        ],
    }
    assert woerter("Magnus Carlsen") == woerter("Carlsen, Magnus")
    assert treffer(index, "Magnus Carlsen", 2800)["fide_id"] == 1
    # Zahl weicht mehr als 150 ab: kein Treffer.
    assert treffer(index, "Magnus Carlsen", 2500) is None
    # Zwei Kandidaten: nicht eindeutig.
    assert treffer(index, "Max Muster", 1510) is None


def test_quantil_und_monoton():
    assert quantil([1, 2, 3, 4, 5], 0.5) == 3
    assert quantil([0, 10], 0.25) == 2.5
    assert monoton([1, 3, 2, 4]) == [1, 2.5, 2.5, 4]


def test_filter_runde_zahlen_und_unsichere_wertung():
    profil = {
        "fide": 1600,
        "gesehen": JETZT_MS,
        "perfs": {"blitz": {"rating": 1900, "rd": 60, "games": 100, "prov": False}},
    }
    assert fide_paare([profil], "blitz", JETZT_MS) == []
    profil["fide"] = 1613
    assert fide_paare([profil], "blitz", JETZT_MS) == [(1900, 1613)]
    profil["perfs"]["blitz"]["rd"] = 160
    assert fide_paare([profil], "blitz", JETZT_MS) == []


def test_tabelle_trifft_eine_bekannte_streuung():
    # Ziel = Lichess − 300 plus Normalrauschen σ = 100: Viertel bei ±67, Mitte bei x − 300.
    zufall = random.Random(3)
    paare = [(x, round(x - 300 + zufall.gauss(0, 100))) for x in range(1200, 2400) for _ in range(3)]
    zeilen = {z[0]: z for z in tabelle(paare)}
    _, von, mitte, bis, anzahl = zeilen[1800]
    assert abs(mitte - 1500) <= 15
    assert 55 <= (bis - von) / 2 <= 95
    assert anzahl > 500
