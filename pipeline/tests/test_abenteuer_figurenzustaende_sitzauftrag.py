"""Tests für den Sitzauftrag der Bildmappe (figurenzustaende_sitzauftrag.py)."""

from pipeline.abenteuer.figurenort import DATEN
from pipeline.abenteuer.figurenzustaende import _bilder_je_figur, lade_orte
from pipeline.abenteuer.figurenzustaende_ablauf import WARTET_AUF_BILD
from pipeline.abenteuer.figurenzustaende_sitzauftrag import SEITLICH, Auftrag, sitzauftrag, sitzmoebel_auf
from pipeline.abenteuer.moebelliste import lade_moebel

KACHEL = 16


def test_sitzmoebel_im_bild():
    """Die Mitte der Kachel liegt im Bild des Stuhls darüber (16 × 32 auf (5, 7) trifft (5, 8))."""
    katalog = {"testStuhl": {"art": "stuhl", "breite": 16, "hoehe": 32, "blick": "links"}}
    objekte = [{"moebel": "testStuhl", "feld": [5, 7]}]
    assert sitzmoebel_auf([5, 8], objekte, katalog, KACHEL)[0] == "testStuhl"
    assert sitzmoebel_auf([6, 8], objekte, katalog, KACHEL) is None


def test_links_und_rechts_sind_ein_bild():
    """Links und rechts zeichnet der Autor einmal; die App spiegelt."""
    auftrag = Auftrag()
    auftrag.merke("ada", "ada", "links", "a", "bank")
    auftrag.merke("ada", "ada", "rechts", "b", "bank")
    auftrag.merke("ada", "ada", "unten", "c", "stuhl")
    daten = auftrag.als_daten({"ada", "bob"})
    assert daten["bilder"]["ada"]["zu_zeichnen"] == sorted([SEITLICH, "unten"])
    assert daten["ohne_sitzstelle"] == ["bob"]


def test_jedes_fehlende_stuhlbild_hat_eine_stelle():
    """Jedes Bild ohne Stuhlzustand hat mindestens eine Sitzstelle mit Richtung."""
    daten = sitzauftrag(DATEN, _bilder_je_figur(lade_orte(DATEN)), lade_moebel(DATEN / "moebel"), KACHEL)
    fehlend = {b for b, z in WARTET_AUF_BILD if z == "stuhl"}
    assert daten["ohne_sitzstelle"] == []
    assert set(daten["bilder"]) == fehlend
