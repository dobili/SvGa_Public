"""Stärkewechsel durch Dialog (begegnungen.json, `staerkeNach`) gelten nur für die laufende Partie.

Warum (Balance-Prüfung 27.11.2026): Miras Wechsel hing an `atmeGesagt`, das nach dem ersten
„Atme“ für immer wahr blieb. Die App wendet einen Wechsel an, sobald seine Bedingung gilt, also in
jeder Revanche schon vor dem ersten Zug: Mira spielte nach einer Niederlage in jedem weiteren
Versuch eine Stufe stärker (etwa 300 Elo), gerade für den, der freundlich war.
Regel: Jede Variable einer Bedingung in `staerkeNach` setzt der Dialog unmittelbar vor jedem
`beginnePartie` dieser Begegnung auf false.
Beispiel: ``~ atmeInDieserPartie = false`` direkt über ``~ beginnePartie("desertSprings.clubkampf")``.
"""

import json
import re
from pathlib import Path

HAUPTORDNER = Path(__file__).resolve().parents[2]
INHALTE = HAUPTORDNER / "inhalte" / "abenteuer"
NAME = re.compile(r"[A-Za-z_][A-Za-z0-9_]*")
SCHLUESSELWOERTER = {"and", "or", "not", "true", "false"}


def _wechselvariablen() -> dict[str, set[str]]:
    """Begegnung → Variablen in den Bedingungen ihrer Stärkewechsel."""
    daten = json.loads((INHALTE / "begegnungen.json").read_text(encoding="utf-8"))
    ergebnis: dict[str, set[str]] = {}
    for begegnung in daten["begegnungen"]:
        for wechsel in begegnung.get("staerkeNach", []):
            namen = set(NAME.findall(str(wechsel["wenn"]))) - SCHLUESSELWOERTER
            ergebnis.setdefault(begegnung["kennung"], set()).update(namen)
    return ergebnis


def test_staerkewechsel_vor_jeder_partie_zurueckgesetzt():
    befunde = []
    for kennung, variablen in _wechselvariablen().items():
        aufruf = f'~ beginnePartie("{kennung}")'
        for datei in sorted((INHALTE / "dialoge" / "de").glob("*.ink")):
            zeilen = datei.read_text(encoding="utf-8").splitlines()
            for nummer, zeile in enumerate(zeilen):
                if zeile.strip() != aufruf:
                    continue
                davor = {z.strip() for z in zeilen[max(0, nummer - len(variablen)) : nummer]}
                for name in variablen:
                    if f"~ {name} = false" not in davor:
                        befunde.append(f"{datei.name}:{nummer + 1} {kennung}: {name} nicht zurückgesetzt")
    assert not befunde, "\n".join(befunde)
