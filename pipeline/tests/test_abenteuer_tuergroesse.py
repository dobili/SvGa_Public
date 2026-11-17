"""Tests: Türen in Menschengröße (KARTENREGELN 10.92, pipeline/abenteuer/tuergroesse.py)."""

from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.tuergroesse import FIGUR_HOEHE, pruefe_szene, tuermasse

MOEBEL = lade_moebel()


def _szene(massstab: float | None) -> dict:
    eintrag = {"moebel": "mf11HausHintenBBlau", "feld": [3, 33]}
    if massstab:
        eintrag["massstab"] = massstab
    return {"art": "aussen", "objekte": [eintrag]}


def test_haus_hinten_braucht_den_massstab_des_autors():
    # Regel: KARTENREGELN 10.92; der Autor hat die Häuser auf 125 % gesetzt (16.11.2026).
    assert pruefe_szene(_szene(None), MOEBEL)
    assert pruefe_szene(_szene(1.25), MOEBEL) == []


def test_innenraum_und_masse():
    assert pruefe_szene({**_szene(None), "art": "innen"}, MOEBEL) == []
    _, o, _, u = tuermasse()["haus_hinten_b_blau.png"]
    assert u - o < FIGUR_HOEHE <= (u - o) * 1.25


def test_herkunft_und_bericht():
    # tuermasse.json kennt „von Hand“, „gemessen“ (tuermessung.py), „verworfen“ und „nicht messbar“.
    from pipeline.abenteuer.tuergroesse import bericht, tuerangaben

    angaben = tuerangaben()
    assert angaben["haus_hinten_b_blau.png"]["herkunft"] == "von Hand"
    assert {e["herkunft"] for e in angaben.values()} <= {"von Hand", "gemessen", "verworfen", "nicht messbar"}
    assert all("rahmen" in e for e in angaben.values() if e["herkunft"] in ("von Hand", "gemessen"))
    assert all("grund" in e for e in angaben.values() if e["herkunft"] in ("verworfen", "nicht messbar"))
    assert not any(n for n, e in angaben.items() if e["herkunft"] == "verworfen" and n in tuermasse())
    text = bericht(MOEBEL)
    assert "## Türen kleiner als die Figur" in text and "mf4Diner" in text
