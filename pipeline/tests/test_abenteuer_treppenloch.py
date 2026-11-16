"""Tests der Bauweise Treppenloch aus Bildern (KARTENREGELN 10.89, pipeline/abenteuer/treppenloch.py).

Grundlage ist die Bibliothek in Cedar Creek: Loch (21..22, 4..6) über der Kellertreppe, Zugang von
Norden, Geländer links, rechts und unten. Die Tests bauen davon abgewandelte Fassungen.
"""

import copy

from pipeline.abenteuer.kartenbau import INHALTE, lade, platziere, raster
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.treppenloch import abgaenge, loch, pruefe_szene, zugaenge

MOEBEL = lade_moebel()
BIBLIOTHEK = lade(INHALTE / "szenen" / "cedar-creek-bibliothek.json")


def _befunde(szene: dict) -> list[str]:
    return pruefe_szene(szene, raster(szene), platziere(szene, MOEBEL)[0], MOEBEL)


def test_abgaenge_nur_nach_unten():
    # Regel: KARTENREGELN 10.89, Abgang = Übergang auf eine tiefere Karte (Keller, Zimmer → Wohnzimmer).
    assert set(abgaenge(BIBLIOTHEK)) == {"kellertreppe"}
    wohnzimmer = lade(INHALTE / "szenen" / "maple-falls-wohnzimmer.json")
    assert abgaenge(wohnzimmer) == {}  # die Treppe dort führt hinauf


def test_bibliothek_ist_nach_der_bauweise_gebaut():
    assert _befunde(BIBLIOTHEK) == []


def test_loch_und_zugang():
    felder = {(21, 4), (22, 4)}
    assert loch(raster(BIBLIOTHEK), felder) == {(x, y) for x in (21, 22) for y in (4, 5, 6)}
    assert zugaenge(BIBLIOTHEK, "kellertreppe", set()) == {"nord"}


def test_lochbild_und_fehlendes_loch_werden_gemeldet():
    szene = copy.deepcopy(BIBLIOTHEK)
    szene["raster"] = [z.replace(" ", ".") for z in szene["raster"]]
    szene["objekte"].append({"moebel": "cc12TreppeAb", "feld": [19, 3]})
    befunde = " ".join(_befunde(szene))
    assert "cc12TreppeAb ist ein Lochbild" in befunde
    assert "liegt nicht im Loch" in befunde


def test_fehlendes_gelaender_und_treppe_werden_gemeldet():
    szene = copy.deepcopy(BIBLIOTHEK)
    szene["objekte"] = [
        o
        for o in szene["objekte"]
        if not o["moebel"].startswith("cc15GelaenderSeiteRechts") and o["moebel"] != "cc4Treppe"
    ]
    befunde = " ".join(_befunde(szene))
    assert "keine Treppe mit Deckkraft 25" in befunde
    assert "(22, 5) ost" in befunde


def test_treppe_muss_aus_dem_unteren_raum_stammen():
    szene = copy.deepcopy(BIBLIOTHEK)
    for o in szene["objekte"]:
        if o["moebel"] == "cc4Treppe":
            o["moebel"] = "ca9Treppe"
    assert any("kein Ausschnitt der Treppe im unteren Raum" in b for b in _befunde(szene))
