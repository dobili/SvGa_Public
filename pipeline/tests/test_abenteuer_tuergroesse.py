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
