"""Sitzende Figuren (Wunsch des Autors R020, „Schachspieler sitzen“): Kartenbau und Regel 10.55.

Warum: Eine Figur auf einem Stuhl galt als „zugestellt“. Mit ``"sitzt"`` (Richtung oder true) darf
sie auf einem Sitzmöbel stehen; der Kartenbau schreibt die Richtung als Eigenschaft ``sitzt``,
die App zeichnet sie sitzend (app/src/abenteuer/oberwelt/sitzrichtung.ts).
"""

from pipeline.abenteuer.kartenbau import ist_sitzmoebel, pruefe, sitzrichtung

STUHL = {"name": "cc4StuhlVorn", "x": 32, "y": 32, "breite": 16, "hoehe": 16, "tiefe": 48, "kollision": True}
ZEILEN = ["######", "#....#", "#....#", "#....#", "######"]


def test_sitzrichtung():
    assert sitzrichtung({"sitzt": True}) == "unten"
    assert sitzrichtung({"sitzt": "links"}) == "links"
    assert sitzrichtung({"sitzt": "quer"}) is None
    assert sitzrichtung({}) is None


def test_sitzmoebel():
    assert ist_sitzmoebel("cc4StuhlVorn") and ist_sitzmoebel("rv5Wartebank")
    assert not ist_sitzmoebel("cc5Tisch")


def test_sitzende_figur_ist_nicht_zugestellt():
    stehend = pruefe(ZEILEN, [STUHL], [{"name": "leserin", "feld": [2, 2]}])
    sitzend = pruefe(ZEILEN, [STUHL], [{"name": "leserin", "feld": [2, 2], "sitzt": "unten"}])
    assert any("zugestellt" in b for b in stehend)
    assert not any("zugestellt" in b for b in sitzend)
