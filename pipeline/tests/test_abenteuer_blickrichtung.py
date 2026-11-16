"""Tests für die Blickrichtung (``pipeline/abenteuer/blickrichtung.py``, Rückmeldung R008).

Warum: Stehende Figuren schauen in der App immer nach unten; der Autor fand eine Köchin mit dem
Gesicht zur Wand (R008). Die Tests halten die Regeln fest: Bezug unten ist richtig, seitlich ein
Befund, Wand unten innen ein Befund, laufende und sitzende Statisten zählen nicht.

Aufruf: ``python -m pytest pipeline/tests/test_abenteuer_blickrichtung.py``
"""

from pipeline.abenteuer.blickrichtung import Person, personen, pruefe, pruefe_person, steht_still

RAUM = ["#####", "#...#", "#...#", "#####"]


def _pruefe(person, bezug=None, andere=frozenset(), innen=True):
    return pruefe_person(person, "test.raum", RAUM, (bezug or {}, {}, set(), set(andere), innen))


def test_bezug_unten_ist_richtig():
    assert _pruefe(Person("wirt", (2, 1), False), {(2, 2): "tresen"}) is None


def test_bezug_seitlich_mit_vorschlag():
    befund = _pruefe(Person("gast", (1, 2), False), {(2, 2): "tresen"})
    assert befund and "links" not in befund.text and "rechts neben ihr" in befund.text
    assert "(2, 1)" in befund.vorschlag


def test_wand_nur_innen():
    assert _pruefe(Person("koechin", (2, 2), False)).text == "schaut zur Wand (R008)"
    assert _pruefe(Person("kletterer", (2, 2), False), innen=False) is None


def test_gespraechspartner_nebeneinander():
    befund = _pruefe(Person("anna", (1, 1), False), andere={(2, 1)})
    assert befund and befund.text.startswith("Gesprächspartner")


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
