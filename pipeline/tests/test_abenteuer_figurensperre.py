"""Prüfung, dass Figuren und stehende Statisten keinen Übergang versperren (figurensperre.py).

Warum: Hinweis des Autors (13.11.2026): Eine Figur in einer Engstelle oder auf einem Übergang
hält den Helden auf, obwohl Wände und Möbel den Weg freilassen.
"""

import copy
import json

from pipeline.abenteuer.figurensperre import pruefe, pruefe_szene, sitzkacheln, uebergangsnamen
from pipeline.abenteuer.kartenbau import INHALTE, platziere
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


def _szene(datei: str) -> dict:
    return copy.deepcopy(json.loads((INHALTE / "szenen" / f"{datei}.json").read_text(encoding="utf-8")))


def test_statist_im_einzigen_durchlass_wird_gemeldet():
    """Befund vom 18.11.2026: Der Zuschauer im Londoner Kaffeehaus stand auf (3, 7), dem einzigen
    Durchlass zur Theke; Kellner und Rückkehr waren nicht mehr zu erreichen."""
    szene = _szene("erinnerung-london-kaffeehaus")
    zuschauer = next(b for b in szene["belebung"] if b["name"] == "zuschauer")
    zuschauer["feld"] = [3, 7]
    zuschauer["eigenschaften"].update({"von": "3,7", "bis": "3,7"})
    befunde = pruefe_szene(szene, lade_moebel(), uebergangsnamen()[szene["karte"]])
    assert any("Weg zu kellner" in b for b in befunde)
    assert any("Weg zu rueckkehr" in b for b in befunde)


def test_sitzende_sperren_das_feld_ueber_sich():
    """Sam sitzt im Clubraum auf (5, 8) auf dem Schulstuhl: auch (5, 7) ist zu. Lily sitzt in
    Maple Falls am Boden (Bordstein): Sie sperrt nur ihr Feld."""
    moebel = lade_moebel()
    club = _szene("maple-falls-clubraum")
    gesetzt, _ = platziere(club, moebel)
    assert sitzkacheln(club, gesetzt, moebel).get((5, 7)) == "sam"
    aussen = _szene("maple-falls-aussen")
    gesetzt, _ = platziere(aussen, moebel)
    assert "lily" not in sitzkacheln(aussen, gesetzt, moebel).values()


def test_sitzende_bleibt_von_oben_ansprechbar():
    """Dash sitzt in Silicon Bay auf der Bank vor Rosies Wagen und ist nur von oben zu erreichen;
    das Feld über ihm zählt für das Ansprechen (im Browser geprüft), also kein Befund."""
    szene = _szene("silicon-bay-aussen")
    befunde = pruefe_szene(szene, lade_moebel(), uebergangsnamen()[szene["karte"]])
    assert not any("dash" in b for b in befunde)


def test_sitzende_ueber_niedriger_bank_sperrt_nicht_darueber():
    """Ward abends in Summit City: Die Bank reicht unter ihre Fußlinie, ihr Bild rückt nach unten,
    und der Held kommt von oben an sie heran (Ansprechprobe 24.11.2026). Wie begehbar.ts."""
    szene = {"figuren": [{"name": "ward", "feld": [1, 1], "sitzt": "unten"}]}
    moebel = {"bank": {"breite": 32, "hoehe": 24, "art": "bank"}}
    assert sitzkacheln(szene, [{"name": "bank", "x": 8, "y": 24}], moebel) == {}
    assert sitzkacheln(szene, [{"name": "bank", "x": 8, "y": 8}], moebel) == {(1, 0): "ward"}
