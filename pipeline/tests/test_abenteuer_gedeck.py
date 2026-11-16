"""Tests: frisches Essen nur an Tischen mit Gast (KARTENREGELN 10.91, pipeline/abenteuer/gedeck.py)
und der Hinweis auf sperrende Bodenkacheln (10.90, bauweisen.py)."""

import copy

from pipeline.abenteuer.bauweisen import bodenkacheln_mit_kollision
from pipeline.abenteuer.gedeck import pruefe_szene, sitzende
from pipeline.abenteuer.kartenbau import INHALTE, lade, platziere
from pipeline.abenteuer.moebelliste import lade_moebel

MOEBEL = lade_moebel()
DINER = lade(INHALTE / "szenen" / "maple-falls-diner.json")


def _befunde(szene: dict) -> list[str]:
    return pruefe_szene(szene, platziere(szene, MOEBEL)[0], MOEBEL)


def test_diner_hat_nur_an_besetzten_tischen_frisches_essen():
    # Regel: KARTENREGELN 10.91; die Rentnerinnen sitzen an n2, der Lkw-Fahrer an der Theke (t7).
    assert _befunde(DINER) == []
    assert {name for name, _ in sitzende(DINER)} == {"lkwFahrer", "rentnerinnen"}


def test_frischer_teller_ohne_gast_ist_ein_befund():
    szene = copy.deepcopy(DINER)
    szene["objekte"].append({"moebel": "mf14TellerPfannkuchen", "auf": "n3_2"})
    assert any("auf n3_2" in b for b in _befunde(szene))


def test_benutzter_teller_ohne_gast_ist_erlaubt():
    szene = copy.deepcopy(DINER)
    szene["objekte"].append({"moebel": "mf16TellerBenutzt", "auf": "n3_2"})
    assert _befunde(szene) == []


def test_gast_gehoert_nur_zum_naechsten_tisch():
    # Die Rentnerinnen (14, 7) sitzen an n2 (12, 6), nicht am Tisch darunter (n3_2 auf (12, 8)).
    szene = copy.deepcopy(DINER)
    szene["objekte"].append({"moebel": "mf14TellerKuchen", "auf": "n3_2"})
    assert len(_befunde(szene)) == 1


def test_bodenkachel_mit_kollision_ist_ein_hinweis():
    # Regel: KARTENREGELN 10.90 (Jukebox im Diner, 16.11.2026).
    szene = {"objekte": [{"moebel": "bkFliesenWeiss", "feld": [8, 6], "kollision": True}]}
    assert bodenkacheln_mit_kollision(szene, MOEBEL)
    assert bodenkacheln_mit_kollision(DINER, MOEBEL) == []
