"""Tests der Auswahl der Zusatzaufgaben (Lichess, CC0) ohne die große Datenbank."""

import re

from pipeline.trainer.daten import HAUPTORDNER
from pipeline.trainer.zusatzaufgaben import (
    THEMEN,
    Kandidat,
    als_text,
    ist_legal,
    lies_zeile,
    passt,
    waehle,
    ziel,
)

# Lichess 00008 (CC0): Stellung vor dem Gegnerzug Lxg3, danach die Lösung.
ZEILE = {
    "PuzzleId": "00008",
    "FEN": "r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24",
    "Moves": "f2g3 e6e7 b2b1 b3c1 b1c1 h6c1",
    "Rating": "1800",
    "RatingDeviation": "75",
    "Popularity": "95",
    "NbPlays": "500",
    "Themes": "crushing hangingPiece long middlegame",
    "GameUrl": "https://lichess.org/787zsVup/black#47",
    "OpeningTags": "",
}


FESSELUNG = frozenset({"pin"})


def _thema(kennung):
    return next(t for t in THEMEN if t.kennung == kennung)


def test_zeile_wird_gelesen_und_gefiltert():
    kandidat = lies_zeile(ZEILE)
    assert kandidat is not None and kandidat.wertung == 1800
    assert ist_legal(kandidat.fen, kandidat.zuege)
    assert lies_zeile({**ZEILE, "RatingDeviation": "120"}) is None
    assert lies_zeile({**ZEILE, "NbPlays": "50"}) is None
    assert lies_zeile({**ZEILE, "Rating": "2400"}) is None
    # fünf eigene Züge sind zu lang
    assert lies_zeile({**ZEILE, "Moves": " ".join(["a1a2"] * 11)}) is None
    assert not ist_legal(ZEILE["FEN"], "e1e2 e6e7")


def test_zuordnung_nur_mit_einem_motiv():
    kandidat = lies_zeile(ZEILE)
    assert passt(kandidat, _thema("haengend"))
    assert not passt(kandidat, _thema("doppelangriff"))
    zwei = lies_zeile({**ZEILE, "Themes": "fork pin"})
    assert not passt(zwei, _thema("doppelangriff"))
    matt = lies_zeile({**ZEILE, "Themes": "fork mate mateIn2"})
    assert passt(matt, _thema("matt2")) and passt(matt, _thema("doppelangriff"))
    assert ziel(matt.themen) == "matt" and ziel(kandidat.themen) == "gewinn"


def test_auswahl_je_stufe_und_ohne_doppelte():
    kandidaten = [
        Kandidat(f"k{i}", ZEILE["FEN"], ZEILE["Moves"], 700 + 100 * (i % 15), 90 - i % 7, 400, FESSELUNG)
        for i in range(60)
    ]
    auswahl = waehle(kandidaten, ausgeschlossen={"k0"}, je_stufe=2)
    assert {a["thema"] for a in auswahl} == {"fesselung"}
    assert len(auswahl) == 10 and "k0" not in {a["id"] for a in auswahl}
    text = als_text(auswahl)
    assert "GameUrl" not in text and "lichess.org/" not in text.split('"aufgaben"')[1]


def test_themen_wie_in_der_app():
    quelle = (HAUPTORDNER / "app" / "src" / "training" / "zusatzaufgaben.ts").read_text(encoding="utf-8")
    block = quelle.split("export const ZUSATZTHEMEN = {")[1].split("} as const")[0]
    assert re.findall(r"^\s+(\w+):", block, re.MULTILINE) == [t.kennung for t in THEMEN]
