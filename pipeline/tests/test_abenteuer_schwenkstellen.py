"""Dauertest der Kameraschwenks (pipeline/abenteuer/schwenkstellen.py, App: oberwelt/schwenk.ts).

Warum: Wunsch des Autors (26.11.2026). Beschreibt ein Ankunfts- oder Eingangstext, was auf der Karte
zu sehen ist, fährt die Kamera mit ``#schwenk:ZIEL`` dorthin. Die Tests halten fest: Jeder gesetzte
Tag trifft ein Ziel auf der Karte, auf der der Dialog spielt; jede beschreibende Zeile in Ankunfts-
und Eingangsknoten hat einen Schwenk oder steht mit Grund in GEPRUEFT; die Ankünfte zu Fuß laufen
auf der Zielkarte (``nachher`` in orte.json); die übrigen Vorschläge (``--alle``) werden nicht mehr.
"""

import json

from pipeline.abenteuer.schwenkstellen import DATEN, GEPRUEFT, Kartenobjekte, aufloesbar, stellen

# Vorschläge und Stellen ohne Ziel in allen Dialogen (--alle), Stand 26.11.2026; darf nur sinken.
OBERGRENZE_ALLE = 335


def test_jeder_schwenk_trifft_ein_ziel():
    """Ein Tag, den die Karte nicht auflöst, ließe die Kamera stehen: ein Befund."""
    befunde = [f"{s.datei}.ink:{s.zeile} [{s.karte}] {s.ziel}" for s in stellen(True) if s.status == "befund"]
    assert befunde == [], "Schwenkziel fehlt auf der Karte:\n" + "\n".join(befunde)


def test_ankunftstexte_sind_vollstaendig():
    """In Ankunfts- und Eingangsknoten ist jede beschreibende Zeile geschwenkt oder geprüft."""
    offen = [
        f"{s.status} {s.datei}.ink:{s.zeile} [{s.karte}] {s.ziel}: {s.text[:70]}"
        for s in stellen(False)
        if s.status in ("vorschlag", "ohne_ziel", "verlegen")
    ]
    assert offen == [], "Schwenk setzen oder in GEPRUEFT mit Grund:\n" + "\n".join(offen)


def test_uebrige_vorschlaege_werden_nicht_mehr():
    """Alle anderen Erzählzeilen mit Sichtbarem: die Zahl darf nur sinken."""
    offen = [s for s in stellen(True) if s.status in ("vorschlag", "ohne_ziel")]
    assert len(offen) <= OBERGRENZE_ALLE, f"{len(offen)} > {OBERGRENZE_ALLE}: neue Stelle ansehen"


def test_gepruefte_gibt_es_noch():
    """Jeder Eintrag in GEPRUEFT trifft noch eine Zeile (sonst ist er veraltet)."""
    gesehen = {s.datei for s in stellen(False) if s.status == "geprueft"}
    for schluessel in GEPRUEFT:
        assert schluessel.split(":", 1)[0] in gesehen, schluessel


def test_ankunft_zu_fuss_laeuft_nach_dem_wechsel():
    """Jede Ankunft zu Fuß läuft auf der Zielkarte: mit ``nachher`` am Übergang, oder die Zielkarte
    spielt die Ankunft selbst als Eingang (Cedar Creek, mittel-4, 25.11.2026); dann bleibt am
    Übergang nur die kurze Zeile vor dem Wechsel."""
    orte = json.loads((DATEN / "orte.json").read_text(encoding="utf-8"))["orte"]
    mit_eingang = {k["kennung"] for o in orte for k in o["karten"] if k.get("eingang")}
    ohne = [
        f"{ort['kennung']}.{a['name']}"
        for ort in orte
        for a in ort["ausloeser"]
        if str(a.get("dialog", "")).endswith(".ankunft_zu_fuss")
        and not a.get("nachher")
        and a["ziel"]["karte"] not in mit_eingang
    ]
    assert ohne == []


def test_aufloesung_wie_in_der_app():
    """Held, Feld, Figur, Auslöser, Kartenobjekt; Statisten und Tiere tragen keinen Namen."""
    karte = Kartenobjekte({"steg"}, {"rosa"}, ["mf2Bibliothek"], 60, 50)
    for ziel in ("held", "3,4", "rosa", "steg", "mf2Bibliothek"):
        assert aufloesbar(ziel, karte), ziel
    assert not aufloesbar("kirchturm", karte)
    assert not aufloesbar("70,4", karte)
