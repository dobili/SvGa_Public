"""Eingangsdialoge mit Partie oder Runde springen beim zweiten Öffnen weiter (Dauertest).

Warum: Nach einer Partie oder Runde öffnet die App den Dialog wieder, mit dem sie begann. War das
ein Eingangsdialog (orte.json, Feld „eingang“), lief er von vorn: Mamas Ankunft in der Kantine
kam nach der Partie ein zweites Mal, ohne Wort zum Ergebnis (schwacher Spieler-Durchlauf Akt 2,
24.11.2026). Der Knoten muss deshalb mit einer Weiche anfangen, die die Variable prüft, die er
selbst setzt: ``{mamaInKantine: -> mama}`` vor ``~ mamaInKantine = true``.
"""

import json
import re
from pathlib import Path

WURZEL = Path(__file__).resolve().parents[2]
ORTE = WURZEL / "inhalte" / "abenteuer" / "orte.json"
DIALOGE = WURZEL / "inhalte" / "abenteuer" / "dialoge" / "de"
START = re.compile(r"beginne(Partie|Aufgaben|Simultan|Gedaechtnis)\(")
UMLEITUNG = re.compile(r"-> (\w+)")


def _eingaenge() -> list[str]:
    """Alle Eingangsdialoge aus orte.json als „datei.knoten“."""
    gefunden: list[str] = []

    def suche(wert: object) -> None:
        if isinstance(wert, dict):
            eingang = wert.get("eingang")
            if isinstance(eingang, dict) and "dialog" in eingang:
                gefunden.append(eingang["dialog"])
            for teil in wert.values():
                suche(teil)
        elif isinstance(wert, list):
            for teil in wert:
                suche(teil)

    suche(json.loads(ORTE.read_text(encoding="utf-8")))
    return gefunden


def _knoten(text: str, name: str) -> str:
    """Rumpf eines Ink-Knotens bis zum nächsten Knoten, sonst leer."""
    treffer = re.search(rf"^=== {re.escape(name)} ===\n(.*?)(?=^=== |\Z)", text, re.S | re.M)
    return treffer.group(1) if treffer else ""


def _startet_spiel(text: str, name: str, gesehen: set[str]) -> bool:
    """Startet der Knoten (oder ein Knoten, zu dem er springt) eine Partie oder Runde?"""
    if name in gesehen:
        return False
    gesehen.add(name)
    rumpf = _knoten(text, name)
    if START.search(rumpf):
        return True
    return any(_startet_spiel(text, ziel, gesehen) for ziel in UMLEITUNG.findall(rumpf))


def _erste_anweisung(rumpf: str) -> str:
    """Erste Zeile des Rumpfs, die kein Kommentar und nicht leer ist."""
    for zeile in rumpf.splitlines():
        zeile = zeile.strip()
        if zeile and not zeile.startswith("//"):
            return zeile
    return ""


def test_eingangsdialoge_mit_spiel_beginnen_mit_weiche():
    befunde = []
    for dialog in _eingaenge():
        datei, knoten = dialog.split(".", 1)
        text = (DIALOGE / f"{datei}.ink").read_text(encoding="utf-8")
        if not _startet_spiel(text, knoten, set()):
            continue
        rumpf = _knoten(text, knoten)
        gesetzt = re.search(r"~\s*(\w+)\s*=\s*true", rumpf)
        weiche = _erste_anweisung(rumpf)
        if not gesetzt or not re.fullmatch(rf"\{{\s*{gesetzt.group(1)}\s*:\s*->\s*\w+\s*\}}", weiche):
            befunde.append(f"{dialog}: beginnt nicht mit einer Weiche über die eigene Variable")
    assert befunde == []


def test_mamas_ankunft_ist_erfasst():
    """Der Fall, der den Test begründet, muss erkannt werden (sonst prüft er nichts)."""
    text = (DIALOGE / "ironwood-kantine.ink").read_text(encoding="utf-8")
    assert "ironwood-kantine.mama_ankunft" in _eingaenge()
    assert _startet_spiel(text, "mama_ankunft", set())
