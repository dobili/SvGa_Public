"""Sperrmengen einer Bedingung: Welche Variablen, einmal gesetzt, machen sie für immer falsch?

Warum: Teil der Prüfung „Quests verfehlen“ (questverfehlen.py, 20.11.2026). Eine Figur mit
``wenn: "nicht endeAkt3Gesehen oder (mamaSpielt und nicht feierGesehen)"`` verschwindet erst, wenn
endeAkt3Gesehen *und* feierGesehen gesetzt sind; eine Prüfung je verneinter Variable sähe hier zwei
Sperren, wo nur eine gemeinsame ist.

Annahme: Variablen der Spielwelt werden gesetzt und nie zurückgenommen (Merker, Zähler, Besitz).
Eine Menge S sperrt eine Bedingung, wenn sie mit allen Variablen aus S gesetzt bei keiner Belegung
der übrigen Variablen mehr gilt. Gemeldet werden die kleinsten solchen Mengen (bis drei Variablen).

Beispiel: ``sperrmengen("nicht a oder (b und nicht c)")`` → [{"a", "c"}];
``sperrmengen("nadelIronwood > 0 und nicht einladungGesehen")`` → [{"einladungGesehen"}].
Abhängigkeiten: bedingung.py.
"""

import re
from itertools import combinations, product

from pipeline.abenteuer.bedingung import erfuellt, variablen

# Variablen, die mit einer Zahl verglichen werden, bekommen Zahlen statt wahr/falsch.
ZAHLVERGLEICH = re.compile(r"\b(\w+)\s*(?:>=|<=|>|<|==|!=)\s*-?\d")
# Werte zum Durchprobieren: „nicht gesetzt“ und „gesetzt“.
WAHRHEIT = (False, True)
ZAHLEN = (0, 10)
# Größte Sperrmenge, die gesucht wird (mehr kommt in den Bedingungen nicht vor).
HOECHSTENS = 3
# Bei mehr freien Variablen wird nicht mehr durchprobiert (2^12 Belegungen).
FREI_HOECHSTENS = 12


def _werte(name: str, zahlen: set[str], gesetzt: bool) -> tuple:
    """Mögliche Werte einer Variablen; gesetzte Variablen haben nur den Wert „gesetzt“."""
    alle = ZAHLEN if name in zahlen else WAHRHEIT
    return (alle[-1],) if gesetzt else alle


def gilt_noch(wenn: str, gesetzt: frozenset[str]) -> bool:
    """Gibt es eine Belegung der übrigen Variablen, mit der die Bedingung gilt?"""
    namen = sorted(variablen(wenn))
    zahlen = set(ZAHLVERGLEICH.findall(wenn))
    frei = [n for n in namen if n not in gesetzt]
    if len(frei) > FREI_HOECHSTENS:
        return True
    auswahl = [_werte(n, zahlen, n in gesetzt) for n in namen]
    return any(erfuellt(wenn, dict(zip(namen, werte, strict=True))) for werte in product(*auswahl))


def sperrmengen(wenn: str | None) -> list[frozenset[str]]:
    """Die kleinsten Mengen von Variablen, mit denen die Bedingung nie mehr gilt (bis HOECHSTENS)."""
    if not wenn or not gilt_noch(wenn, frozenset()):
        return []
    namen = sorted(variablen(wenn))
    gefunden: list[frozenset[str]] = []
    for groesse in range(1, min(HOECHSTENS, len(namen)) + 1):
        for menge in map(frozenset, combinations(namen, groesse)):
            if any(g <= menge for g in gefunden):
                continue
            if not gilt_noch(wenn, menge):
                gefunden.append(menge)
    return gefunden
