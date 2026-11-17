"""Tests für die kurzen Partieformen (pipeline/abenteuer/kurzformate.py, Regelwerk R13 bis R13c).

Warum: Die Fenster der Formate und die Texte des erzählten Einstiegs sollen nicht unbemerkt
brechen. Ohne Engine laufen die Regeln mit einem festen Bewerter; mit Engine (``cd app && npm
ci``) bewertet ein Test alle vorgemerkten Startstellungen wie die Prüfung von Hand.
"""

import json
from pathlib import Path

import chess
import pytest

from pipeline.abenteuer import kurzformate
from pipeline.trainer.engine import engine_vorhanden

HAUPT = Path(__file__).resolve().parents[2]
TEXTE = json.loads((HAUPT / "inhalte" / "abenteuer" / "texte" / "de.json").read_text(encoding="utf-8"))
BEGEGNUNGEN = json.loads((HAUPT / "inhalte" / "abenteuer" / "begegnungen.json").read_text(encoding="utf-8"))[
    "begegnungen"
]


def fest(wert, matt=None):
    """Ein Bewerter, der immer denselben Wert aus Sicht der Seite am Zug liefert."""
    return lambda _brett: (wert, matt)


def begegnung(format_, startstellung, farbe="white"):
    return {"kennung": "a.b", "format": format_, "startstellung": startstellung, "farbe": farbe}


ENDSPIEL = {"art": "abbildung", "nummer": "8.27"}


def test_fenster_je_format():
    sieg = begegnung({"art": "endspiel", "zuege": 15, "ziel": "sieg"}, ENDSPIEL)
    assert kurzformate.pruefe_begegnung(sieg, fest(5.0)) is None
    assert kurzformate.pruefe_begegnung(sieg, fest(0.5)) is not None
    halten = begegnung({"art": "endspiel", "zuege": 15, "ziel": "remis"}, ENDSPIEL)
    assert kurzformate.pruefe_begegnung(halten, fest(-0.8)) is None
    assert kurzformate.pruefe_begegnung(halten, fest(-3.0)) is not None


def test_kurzes_matt_ist_zu_leicht():
    duell = begegnung({"art": "stellungsduell", "zuege": 10, "mindestvorteil": 1}, ENDSPIEL)
    fund = kurzformate.pruefe_begegnung(duell, fest(99.0, matt=2))
    assert fund is not None and "Matt" in fund.text


def test_eroeffnung_wird_gespielt_und_aus_sicht_des_lesers_bewertet():
    start = {"art": "eroeffnung", "zuege": ["e4", "c6", "d4", "d5"]}
    brett = kurzformate.startbrett(start)
    assert brett is not None and brett.turn == chess.WHITE
    assert kurzformate.leserwert(0.4, brett, "black") == -0.4
    vorteil = begegnung({"art": "vorteil", "zuege": 12, "mindestvorteil": 1}, start, "zufall")
    assert kurzformate.pruefe_begegnung(vorteil, fest(0.3)) is None


def test_ganze_partie_wird_nicht_geprueft():
    partie = begegnung({"art": "partie"}, {"art": "grundstellung"})
    assert kurzformate.pruefe_begegnung(partie, fest(9.0)) is None


def test_texte_der_erzaehlung_gibt_es():
    fehlend = [
        f"{b['kennung']}: {schluessel}"
        for b in BEGEGNUNGEN
        if "erzaehlung" in b
        for schluessel in [b["erzaehlung"]["vorher"], *b["erzaehlung"].get("nachher", {}).values()]
        if schluessel not in TEXTE
    ]
    assert fehlend == []


@pytest.mark.skipif(not engine_vorhanden(), reason="Engine fehlt (cd app && npm ci)")
def test_alle_startstellungen_passen_zum_format():
    from pipeline.trainer.engine import Engine

    with Engine() as engine:

        def bewerte(brett):
            zug = engine.bester(brett, kurzformate.TIEFE)
            return (zug.wert, zug.matt) if zug else (0.0, None)

        funde = kurzformate.pruefe_alle(BEGEGNUNGEN, bewerte)
    assert [f"{f.kennung}: {f.text}" for f in funde] == []
