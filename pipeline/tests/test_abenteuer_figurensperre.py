"""Prüfung, dass Figuren und stehende Statisten keinen Übergang versperren (figurensperre.py).

Warum: Hinweis des Autors (13.11.2026): Eine Figur in einer Engstelle oder auf einem Übergang
hält den Helden auf, obwohl Wände und Möbel den Weg freilassen.
"""

import copy
import json

from pipeline.abenteuer.figurensperre import pruefe, pruefe_szene, uebergangsnamen
from pipeline.abenteuer.kartenbau import INHALTE
from pipeline.abenteuer.moebelliste import lade_moebel


def test_keine_figur_versperrt_einen_weg():
    """Alle Grundkarten und Zustände: kein Übergang durch Figuren gesperrt."""
    assert pruefe() == []


def test_figur_auf_uebergang_wird_gemeldet():
    """Beispiel: eine Figur auf weiterCamp (Weg 9, Riesenbäume) meldet den Übergang."""
    pfad = INHALTE / "szenen" / "weg-crossroads-pinewood-riesenbaeume.json"
    szene = copy.deepcopy(json.loads(pfad.read_text(encoding="utf-8")))
    feld = next(a["feld"] for a in szene["ausloeser"] if a["name"] == "weiterCamp")
    szene["figuren"].append({"name": "versuch", "feld": feld})
    namen = uebergangsnamen()[szene["karte"]]
    befunde = pruefe_szene(szene, lade_moebel(), namen)
    assert any("versuch steht auf weiterCamp" in b for b in befunde)
