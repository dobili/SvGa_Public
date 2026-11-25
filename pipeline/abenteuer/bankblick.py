"""Sitzrichtung auf Bänken und Sesseln mit Blick (Befund des Autors, 25.11.2026 abends, Park Maple Falls).

Prüft alle Sitzstellen aus Szenen, Tagesabläufen und Ink (verdeckung.stellen): Steht dort ein
Sitzmöbel mit Katalogangabe ``blick``, gilt dessen Blick so, wie das Möbel auf der Karte liegt
(gespiegelt tauschen links und rechts, die Drehung dreht mit; sitzplatz.blick_in_lage wie
sitzplatz.ts). Sitzende aus Tagesabläufen übernehmen diesen Blick in der App von selbst; eine
Figur mit eigener Sitzrichtung (``sitzt: links`` in der Szene) muss dazu passen, sonst schaut sie in
die Lehne. Bis zum 25.11.2026 kannte die App die Spiegelung nicht: Jo auf der gespiegelten
Seitenbank (22, 22) schaute in die Lehne.

Aufruf: ``python -m pipeline.abenteuer.bankblick`` → Befunde und ihre Zahl; Dauertest
„0 Befunde“ (pipeline/tests/test_abenteuer_bankblick.py), Ausnahmen mit Grund in GEPRUEFT.
"""

from __future__ import annotations

import json

from pipeline.abenteuer.sitzplatz import blick_in_lage, ist_sitzmoebel
from pipeline.abenteuer.verdeckung import KACHEL, WURZEL, katalog, stellen

# Sitzrichtungen, die nicht zum Möbel passen müssen, mit Grund („quelle@szene“ → Grund).
GEPRUEFT: dict[str, str] = {}
RICHTUNGEN = ("links", "rechts", "oben", "unten")


def _objekte(szene: str) -> list[dict]:
    pfad = WURZEL / "karten" / f"{szene}.json"
    if not pfad.exists():
        return []
    return [
        o
        for e in json.loads(pfad.read_text(encoding="utf-8")).get("layers", [])
        for o in e.get("objects", [])
    ]


def sitzblick(szene: str, feld: tuple[int, int], moebel: dict[str, dict]) -> str | None:
    """Blick des kleinsten Sitzmöbels unter der Feldmitte, wie es liegt; ohne Blick None."""
    mx, my = (feld[0] + 0.5) * KACHEL, (feld[1] + 0.5) * KACHEL
    treffer = []
    for o in _objekte(szene):
        name = o.get("name", "")
        angabe = moebel.get(name)
        if not angabe or not ist_sitzmoebel(name, angabe.get("art")):
            continue
        if o["x"] <= mx < o["x"] + o.get("width", 0) and o["y"] <= my < o["y"] + o.get("height", 0):
            form = {p["name"]: p["value"] for p in o.get("properties", [])}
            treffer.append((o.get("width", 0) * o.get("height", 0), angabe.get("blick"), form))
    if not treffer:
        return None
    _, blick, form = min(treffer, key=lambda t: t[0])
    return blick_in_lage(blick, form)


def befunde() -> list[str]:
    """Sitzende mit eigener Richtung gegen den Blick ihres Möbels."""
    moebel = katalog()
    gefunden = []
    for s in stellen():
        if s.haltung != "sitzt" or s.richtung not in RICHTUNGEN or f"{s.quelle}@{s.szene}" in GEPRUEFT:
            continue
        blick = sitzblick(s.szene, s.feld, moebel)
        if blick and blick != s.richtung:
            gefunden.append(f"{s.quelle} in {s.szene} {s.feld}: sitzt {s.richtung}, das Möbel blickt {blick}")
    return gefunden


def main() -> None:
    gefunden = befunde()
    for zeile in gefunden:
        print(zeile)
    print(f"{len(gefunden)} Befunde")


if __name__ == "__main__":
    main()
