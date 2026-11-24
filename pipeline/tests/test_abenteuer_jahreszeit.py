"""Dauertest der Jahreszeiten (pipeline/abenteuer/jahreszeit.py, RO53.5 vom 24.11.2026).

Warum: Winter ohne Schnee im Süden, Schnee nur im Norden und in den Bergen, kein Sprung vom Schnee in
den Sommer an einer Kartengrenze. Ohne privates Paket.
"""

from pipeline.abenteuer import jahreszeit as J


def test_keine_befunde():
    befunde = J.pruefe()
    assert befunde == [], befunde[:5]


def test_raststaette_und_glasbruecke_sind_nachbarn():
    orte = J.json.loads((J.INHALTE / "orte.json").read_text(encoding="utf-8"))
    paare = J.nachbarn(orte, J.lade_szenen())
    assert ("wegIronwoodSilicon.glasbruecke", "wegIronwoodSilicon.raststaette") in paare
    # Die Busfahrt von Ironwood zur Raststätte ist kein Ausgang am Rand.
    assert ("ironwood.aussen", "wegIronwoodSilicon.raststaette") not in paare


def test_sprung_wird_gemeldet(monkeypatch):
    szenen = J.lade_szenen()
    rast = "weg-ironwood-silicon-raststaette"
    szenen[rast] = {**szenen[rast], "jahreszeit": "winter"}
    szenen["weg-ironwood-silicon-glasbruecke"] = {
        k: v for k, v in szenen["weg-ironwood-silicon-glasbruecke"].items() if k != "jahreszeit"
    }
    monkeypatch.setattr(J, "lade_szenen", lambda: szenen)
    befunde = J.pruefe()
    assert any("Sprung" in b for b in befunde)
    assert any("nicht im Norden" in b for b in befunde)
