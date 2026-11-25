"""Schwimmer bleiben im Wasser (Befund des Autors, 25.11.2026 abends: drei Enten auf der Wiese im Park).

Prüft jede Szene: Jedes Feld der Laufwege eines Tiers mit ``verhalten: schwimmen`` liegt auf Wasser:
vom Startfeld zu ``bis``, von ``von`` nach ``bis`` und zurück, jeder Gang erst waagerecht, dann
senkrecht wie in der App (belebungsbewegung.ts, geheZu); ein L-förmiger Weg muss also in beiden
Richtungen im Wasser liegen (``~`` im
gezeichneten Raster, Brückenfelder zählen als Wasser). Die App setzt die Tiere einer Schar auf
diesen Weg (tiere.ts, scharplatz), also bleibt die ganze Schar im Wasser. Eine Art mit Gehbildern an
Land dürfte das Wasser verlassen; die App kennt das Wasser zur Laufzeit aber nicht, darum gilt die
Regel für alle Schwimmer.

Aufruf: ``python -m pipeline.abenteuer.schwimmweg [--alle]`` (ohne ``--alle`` nur Befunde).
Ausgabe: je Befund Szene, Tier und erstes Feld an Land; Dauertest „0 Befunde“
(pipeline/tests/test_abenteuer_schwimmweg.py).
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from pipeline.abenteuer.klippenbild import gezeichnetes_raster

SZENEN = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer" / "szenen"
WASSER = "~"


def _feld(text: str) -> tuple[int, int]:
    x, y = text.split(",")
    return int(x), int(y)


def laufweg(von: tuple[int, int], bis: tuple[int, int]) -> list[tuple[int, int]]:
    """Die Felder des Wegs, erst waagerecht, dann senkrecht (wie tiere.ts, laufwegfelder)."""
    felder = []
    x, y = von
    while x != bis[0]:
        felder.append((x, y))
        x += 1 if bis[0] > x else -1
    while y != bis[1]:
        felder.append((x, y))
        y += 1 if bis[1] > y else -1
    return [*felder, bis]


def befunde(szene: dict) -> list[str]:
    """Schwimmer mit einem Wegfeld an Land: „enten: (30, 27) an Land“."""
    zeilen = gezeichnetes_raster(szene)

    def wasser(x: int, y: int) -> bool:
        return 0 <= y < len(zeilen) and 0 <= x < len(zeilen[y]) and zeilen[y][x] == WASSER

    gefunden = []
    for b in szene.get("belebung", []):
        e = b.get("eigenschaften", {})
        if b.get("typ") != "tier" or e.get("verhalten") != "schwimmen":
            continue
        feld = tuple(b.get("feld", (0, 0)))
        # Ohne Laufweg bleibt der Schwimmer auf seinem Feld (wie belebung.ts in der App).
        von = _feld(e["von"]) if e.get("von") else (feld[0], feld[1])
        bis = _feld(e["bis"]) if e.get("bis") else von
        gaenge = [laufweg((feld[0], feld[1]), bis), laufweg(von, bis), laufweg(bis, von)]
        an_land = sorted({f for gang in gaenge for f in gang if not wasser(*f)})
        if an_land:
            gefunden.append(f"{b.get('name')}: {an_land[0]} an Land ({len(an_land)} Felder)")
    return gefunden


def alle_befunde() -> dict[str, list[str]]:
    """Befunde je Szenendatei (nur Szenen mit Befund)."""
    ergebnis = {}
    for pfad in sorted(SZENEN.glob("*.json")):
        gefunden = befunde(json.loads(pfad.read_text(encoding="utf-8")))
        if gefunden:
            ergebnis[pfad.name] = gefunden
    return ergebnis


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--alle", action="store_true", help="auch Szenen ohne Befund nennen")
    args = parser.parse_args()
    ergebnis = alle_befunde()
    for datei, gefunden in ergebnis.items():
        for zeile in gefunden:
            print(f"{datei}: {zeile}")
    if args.alle:
        print(f"{len(list(SZENEN.glob('*.json')))} Szenen geprüft")
    print(f"{sum(len(g) for g in ergebnis.values())} Befunde")


if __name__ == "__main__":
    main()
