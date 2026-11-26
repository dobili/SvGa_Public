"""Dauertest: Keine Dialogdatei verliert Zeilen ohne Grund (pipeline/abenteuer/dialogzeilen.py).

Warum: Wunsch des Autors (26.11.2026): Dialoge bleiben erhalten; Behebungen verlegen Zeilen oder
lassen sie zur richtigen Zeit auslösen, statt sie zu streichen.
"""

import json

from pipeline.abenteuer.dialogzeilen import GESENKT, STAND, gesunken, zaehle


def test_keine_datei_verliert_zeilen_ohne_grund():
    """Jede Datei hat mindestens so viele Zeilen wie im Stand, sonst ein Eintrag in GESENKT."""
    stand = json.loads(STAND.read_text(encoding="utf-8"))
    assert gesunken(zaehle(), stand) == []


def test_gruende_sind_belegt():
    """Jeder Eintrag in GESENKT nennt eine Datei, die es gibt, und einen Grund."""
    dateien = set(zaehle())
    assert [d for d, grund in GESENKT.items() if d not in dateien or len(grund) < 20] == []


def test_erkennt_gestrichene_zeile():
    """Eine Datei mit einer Zeile weniger als im Stand fällt auf."""
    assert gesunken({"a.ink": 4}, {"a.ink": 5}) == ["a.ink: 5 → 4"]
    assert gesunken({"a.ink": 6}, {"a.ink": 5}) == []
