"""Tests für den Wertungsvergleich (Profile kürzen, Namensabgleich, Quantile, Bänder)."""

import json
import random

from pipeline.wertungsvergleich.abgleich import treffer, woerter
from pipeline.wertungsvergleich.auswerten import fide_paare, monoton, quantil, tabelle
from pipeline.wertungsvergleich.sammeln import SPIELERZEILE, chesscom_name, kurzprofil, zahlenprofil

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


def test_zahlenprofil_alle_zahlen_ohne_klarnamen_und_freitext():
    nutzer = {
        "id": "b",
        "title": "FM",
        "perfs": {
            "bullet": {"rating": 2000, "rd": 50, "games": 900, "prog": 3},
            "puzzle": {"rating": 2400, "rd": 80, "games": 3000, "prog": 0},
        },
        "profile": {
            "fideRating": 2210,
            "dsbRating": 2190,
            "realName": "Erika Muster",
            "bio": "Hallo",
            "location": "Berlin",
            "links": "https://chess.com/member/Erika",
            "flag": "DE",
        },
        "playTime": {"total": 12345},
        "tosViolation": True,
    }
    z = zahlenprofil(nutzer)
    assert z["perfs"]["bullet"]["rating"] == 2000
    assert z["perfs"]["puzzle"]["games"] == 3000
    assert z["verbaende"] == {"fideRating": 2210, "dsbRating": 2190}
    assert z["chesscom"] == "erika"
    assert z["regelverstoss"] is True
    for verboten in ("Erika Muster", "Hallo", "Berlin"):
        assert verboten not in str(z)


def test_spielerzeile_der_partiendatenbank():
    assert SPIELERZEILE.match(b'[White "DrNykterstein"]').group(1) == b"DrNykterstein"
    assert SPIELERZEILE.match(b'[WhiteElo "2900"]') is None


def test_oeffentliche_form_ohne_kennung_fide_id_und_chesscom_name():
    from pipeline.wertungsvergleich.veroeffentlichen import monat, oeffentlich, pseudonym

    profil = {
        "id": "erika",
        "perfs": {"blitz": {"rating": 1900, "rd": 60, "games": 500}},
        "verbaende": {"fideRating": 1750},
        "chesscom": "erika_cc",
        "erstellt": 1_700_000_000_000,
        "gesehen": 1_793_000_000_000,
    }
    fide = {"id": "erika", "fide_id": 4711, "standard": 1748, "schnell": 0, "blitz": 0, "aktiv": True}
    konto = {"chesscom": "erika_cc", "perfs": {"blitz": {"rating": 1700, "rd": 40, "games": 900, "datum": 1}}}
    z = oeffentlich(profil, "salz", fide, konto)
    text = json.dumps(z)
    for verboten in ("erika", "4711", "erika_cc"):
        assert verboten not in text
    assert z["p"] == pseudonym("salz", "erika") != pseudonym("anders", "erika")
    assert z["fide_offiziell"]["standard"] == 1748
    assert z["chesscom"]["blitz"] == {"rating": 1700, "rd": 40, "games": 900}
    assert z["erstellt"] == monat(1_700_000_000_000) == "2023-11"
    assert z["verbaende"] == {"fideRating": 1750}
