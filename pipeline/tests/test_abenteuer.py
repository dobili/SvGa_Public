"""Die Beispieldaten des Schach-Abenteuers müssen zu ihren Schemas passen und zueinander.

Warum: ``schemas/abenteuer-*.schema.json`` sind der Vertrag für die Spieldaten in
``inhalte/abenteuer/`` (docs/spiel/04_Architektur.md, Abschnitt 12). Die App erzeugt ihre Typen aus
denselben Schemas; dieser Test prüft die eingecheckten Beispiele gegen die Schemas und die
Querverweise zwischen den Dateien (Gegner der Orte, Karten der Quests, Textschlüssel), damit ein
Tippfehler in einer Kennung nicht erst im Spiel auffällt.
"""

import json
import re
from pathlib import Path

import pytest

from pipeline.bauen.__main__ import pruefe_schema

HAUPTORDNER = Path(__file__).resolve().parents[2]
INHALTE = HAUPTORDNER / "inhalte" / "abenteuer"

DATEIEN = {
    "gegner.json": "abenteuer-gegner.schema.json",
    "karten.json": "abenteuer-karten.schema.json",
    "quests.json": "abenteuer-quests.schema.json",
    "orte.json": "abenteuer-orte.schema.json",
    "begegnungen.json": "abenteuer-begegnungen.schema.json",
    "texte/de.json": "abenteuer-texte.schema.json",
}


def _lade(name: str) -> dict:
    return json.loads((INHALTE / name).read_text(encoding="utf-8"))


@pytest.mark.parametrize(("datei", "schema"), sorted(DATEIEN.items()))
def test_beispiel_passt_zum_schema(datei: str, schema: str):
    assert pruefe_schema(_lade(datei), schema) == []


def test_querverweise_stimmen():
    """Jede Kennung, die eine Datei nennt, gibt es in der Datei, auf die sie zeigt."""
    gegner = {g["kennung"] for g in _lade("gegner.json")["gegner"]}
    karten = {k["kennung"] for k in _lade("karten.json")["karten"]}
    texte = set(_lade("texte/de.json"))
    orte = _lade("orte.json")["orte"]
    quests = _lade("quests.json")["quests"]
    fehler: list[str] = []

    for ort in orte:
        kartenkennungen = {k["kennung"] for k in ort["karten"]}
        figuren = {f["kennung"] for f in ort["figuren"]}
        for figur in ort["figuren"]:
            if "gegner" in figur and figur["gegner"] not in gegner:
                fehler.append(f"{ort['kennung']}: Gegner {figur['gegner']} fehlt in gegner.json")
        club = ort.get("club")
        if club:
            for kennung in [club["chef"], *club["mitglieder"]]:
                if kennung not in figuren or kennung not in gegner:
                    fehler.append(f"{ort['kennung']}: Clubmitglied {kennung} fehlt")
        for ausloeser in ort["ausloeser"]:
            ziel = ausloeser.get("ziel")
            if ziel and ziel["karte"] not in kartenkennungen:
                fehler.append(f"{ort['kennung']}: Übergang nach unbekannter Karte {ziel['karte']}")

    for begegnung in _lade("begegnungen.json")["begegnungen"]:
        if begegnung["gegner"] not in gegner:
            fehler.append(f"{begegnung['kennung']}: Gegner {begegnung['gegner']} fehlt")

    questkennungen = {q["kennung"] for q in quests}
    for quest in quests:
        for voraussetzung in quest.get("voraussetzung", []):
            if voraussetzung not in questkennungen:
                fehler.append(f"{quest['kennung']}: Voraussetzung {voraussetzung} fehlt")
        for schritt in quest["schritte"]:
            for wirkung in schritt.get("wirkungen", []):
                if wirkung["art"] == "karte" and wirkung["karte"] not in karten:
                    fehler.append(f"{quest['kennung']}: Karte {wirkung['karte']} fehlt")
                if wirkung["art"] in ("steckbrief", "zustand") and wirkung["gegner"] not in gegner:
                    fehler.append(f"{quest['kennung']}: Gegner {wirkung['gegner']} fehlt")

    for datei in ("gegner.json", "karten.json", "quests.json", "orte.json"):
        for schluessel in _textschluessel(_lade(datei)):
            if schluessel not in texte:
                fehler.append(f"{datei}: Textschlüssel {schluessel} fehlt in texte/de.json")

    assert fehler == []


TEXTSCHLUESSEL = re.compile(r"^(ort|club|figur|karte|quest|zustand|nadel)\.[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$")


def _textschluessel(daten: object) -> set[str]:
    """Alle Zeichenketten, die wie Textschlüssel aussehen, aus beliebig verschachtelten Daten."""
    if isinstance(daten, str):
        return {daten} if TEXTSCHLUESSEL.match(daten) else set()
    if isinstance(daten, dict):
        return set().union(*(_textschluessel(w) for w in daten.values()))
    if isinstance(daten, list):
        return set().union(*(_textschluessel(w) for w in daten))
    return set()


def test_ink_szene_und_tiled_karte_liegen_bereit():
    """Die Beispielszene und die Beispielkarte existieren und nennen die Auslöser aus orte.json."""
    szene = (INHALTE / "dialoge" / "de" / "maple-falls-dachboden.ink").read_text(encoding="utf-8")
    assert "=== ambrose_erwacht ===" in szene
    assert 'beginnePartie("mapleFalls.ersteLektion")' in szene
    karte = json.loads((INHALTE / "karten" / "maple-falls-dachboden.json").read_text(encoding="utf-8"))
    assert karte["width"] * karte["height"] == len(karte["layers"][0]["data"])
    objekte = next(e for e in karte["layers"] if e["type"] == "objectgroup")
    namen = {o["name"] for o in objekte["objects"]}
    ausloeser = {a["name"] for a in _lade("orte.json")["orte"][0]["ausloeser"]}
    assert namen <= ausloeser
