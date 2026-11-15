"""Freier Antritt einer Treppe: hinauf unten, beim Abgang (richtung „runter“) oben.

Warum: Die Kellertreppe der Bibliothek in Cedar Creek ist eine Öffnung mit Geländer, die man von
oben betritt; unter ihr liegt die Wand des Kellerschachts. Die Prüfung meldete sie als „Treppe ohne
freien Antritt unten“ (Karten 15.11.2026, KARTENREGELN 10.16 und 10.77).
"""

from pipeline.abenteuer.kartenbau import platziere
from pipeline.abenteuer.kartenregeln import pruefe_regeln

TREPPE = {"breite": 48, "hoehe": 48, "kollision": False, "art": "treppe", "quelle": "t.png"}
# Treppe auf den Spalten 1–3, Reihen 1–3: darüber frei, darunter Wand.
ZEILEN = ["#.....#", "#.....#", "#.....#", "#.....#", "#######"]


def befunde(angabe: dict) -> list[str]:
    szene = {"objekte": [{"moebel": "treppe", "feld": [1, 1]}]}
    moebel = {"treppe": angabe}
    gesetzt, _ = platziere(szene, moebel)
    return [b for b in pruefe_regeln(szene, ZEILEN, gesetzt, moebel) if "Antritt" in b]


def test_treppe_hinauf_braucht_freien_antritt_unten():
    assert befunde({**TREPPE, "richtung": "hoch"}) == ["treppe: Treppe ohne freien Antritt unten"]


def test_abgang_wird_von_oben_betreten():
    assert befunde({**TREPPE, "richtung": "runter"}) == []


def test_schacht_mit_gelaender_oben_wird_von_unten_betreten():
    # Treppenschacht im Dachboden (Maske oben geschlossen): Antritt unten, hier Wand.
    schacht = {**TREPPE, "richtung": "runter", "maske": ["###", "#.#", "#.#"]}
    assert befunde(schacht) == ["treppe: Treppe ohne freien Antritt unten"]
