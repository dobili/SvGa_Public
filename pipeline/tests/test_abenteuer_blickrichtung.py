"""Tests für die Blickrichtung (``pipeline/abenteuer/blickrichtung.py``, Rückmeldung R008).

Warum: Stehende Figuren schauen in der App immer nach unten; der Autor fand eine Köchin mit dem
Gesicht zur Wand (R008). Die Tests halten die Regeln fest: Bezug unten ist richtig, seitlich ein
Befund, Wand unten innen ein Befund, laufende und sitzende Statisten zählen nicht.

Aufruf: ``python -m pytest pipeline/tests/test_abenteuer_blickrichtung.py``
"""

from pipeline.abenteuer.blickrichtung import (
    Person,
    personen,
    pruefe,
    pruefe_person,
    steht_still,
    ungueltige_angaben,
)
from pipeline.abenteuer.kartentiled import blickrichtung

RAUM = ["#####", "#...#", "#...#", "#####"]


def _pruefe(person, bezug=None, andere=frozenset(), innen=True):
    return pruefe_person(person, "test.raum", RAUM, (bezug or {}, {}, set(), set(andere), innen))


def test_bezug_unten_ist_richtig():
    assert _pruefe(Person("wirt", (2, 1), False), {(2, 2): "tresen"}) is None


def test_bezug_seitlich_mit_vorschlag():
    befund = _pruefe(Person("gast", (1, 2), False), {(2, 2): "tresen"})
    assert befund and "rechts neben ihr" in befund.text
    assert befund.vorschlag == "„blick“: „rechts“ setzen"


def test_blick_zum_bezug_ist_richtig():
    # Eigenschaft „blick“ (R008): Die Person schaut seitlich zum Tresen, ohne verschoben zu werden.
    assert _pruefe(Person("gast", (1, 2), False, blick="rechts"), {(2, 2): "tresen"}) is None


def test_wand_nur_innen():
    assert _pruefe(Person("koechin", (2, 2), False)).text == "schaut zur Wand (R008)"
    assert _pruefe(Person("kletterer", (2, 2), False), innen=False) is None


def test_gespraechspartner_nebeneinander():
    befund = _pruefe(Person("anna", (1, 1), False), andere={(2, 1)})
    assert befund and befund.text.startswith("Gesprächspartner")
    assert _pruefe(Person("anna", (1, 1), False, blick="rechts"), andere={(2, 1)}) is None


def test_personal_ohne_tresen():
    befund = _pruefe(Person("kellnerin", (2, 1), False))
    assert befund and befund.text == "Personal ohne Tresen in der Nähe"


def test_laufende_und_sitzende_zaehlen_nicht():
    assert not steht_still({"eigenschaften": {"von": "1,4", "bis": "9,4"}})
    assert not steht_still({"eigenschaften": {"sitzt": "oben"}})
    assert steht_still({"eigenschaften": {"von": "3,3", "bis": "3,3"}})
    szene = {"figuren": [{"name": "a", "feld": [1, 1], "sitzt": "oben"}], "belebung": []}
    assert personen(szene) == []


def test_bestand_laeuft():
    gezaehlt, befunde = pruefe("mapleFalls")
    assert gezaehlt > 0 and all(b.karte.startswith("mapleFalls.") for b in befunde)


def test_blick_lesen():
    szene = {
        "figuren": [{"name": "hector", "feld": [1, 1], "blick": "links"}],
        "belebung": [{"typ": "statist", "name": "gast", "feld": [2, 2], "eigenschaften": {"blick": "oben"}}],
    }
    assert [p.blick for p in personen(szene)] == ["links", "oben"]
    assert blickrichtung({"blick": "links"}) == "links"
    assert blickrichtung({"eigenschaften": {"blick": "rechts"}}) == "rechts"
    assert blickrichtung({"sitzt": True, "blick": "links"}) is None
    assert blickrichtung({"blick": "quer"}) is None


def test_tiled_traegt_blick_der_figur():
    # Kartenbau (kartentiled.py): Die Figur bekommt die Eigenschaft „blick“, die die App liest.
    from pipeline.abenteuer.kartentiled import tiled

    szene = {"karte": "test.raum", "figuren": [{"name": "hector", "feld": [1, 1], "blick": "links"}]}
    karte = tiled(szene, ["." * 4] * 3, [], {"tilesets": []})
    objekte = [o for e in karte["layers"] for o in e.get("objects", [])]
    hector = next(o for o in objekte if o["name"] == "hector")
    assert hector["properties"] == [{"name": "blick", "type": "string", "value": "links"}]


def test_unbekannte_blickrichtung():
    szene = {"figuren": [{"name": "jo", "feld": [1, 1], "blick": "quer"}], "belebung": []}
    assert [b.text for b in ungueltige_angaben("test.raum", szene)] == ["unbekannte Blickrichtung „quer“"]
