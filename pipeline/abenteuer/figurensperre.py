"""Figuren und stehende Statisten versperren keinen Weg zwischen Start und Übergängen.

Warum: In der App sperren Figuren und Statisten, die an einem Fleck stehen, ihre Kachel
(app/src/abenteuer/oberwelt/begehbar.ts, ``sperrkacheln``). Steht eine Figur in einer Engstelle
oder auf einem Übergang, kommt der Held nicht weiter, obwohl Wände und Möbel den Weg freilassen.
Hinweis des Autors bei der Fehlersuche vor Pinewood Camp (13.11.2026): Diese Prüfung fehlte.

Regel: Jedes Übergangsfeld, das ohne Figuren vom Start aus erreichbar ist, bleibt es auch mit
Figuren und stehenden Statisten; keine Figur und kein stehender Statist steht auf einem Feld
eines Übergangs oder des Starts. Wandernde Statisten und Tiere zählen nicht (sie geben den Weg
wieder frei, wie in der App).
Aufruf: ``python -m pipeline.abenteuer.figurensperre`` (druckt die Befunde, Rückgabe 1 bei Befund).
"""

import json
import sys
from collections import deque

from pipeline.abenteuer.durchgang import gesperrte_felder
from pipeline.abenteuer.kartenbau import INHALTE, platziere, raster
from pipeline.abenteuer.moebelliste import lade_moebel

Feld = tuple[int, int]
NACHBARN = ((1, 0), (-1, 0), (0, 1), (0, -1))


def steht_fest(b: dict) -> bool:
    """Ein Statist ohne Strecke oder mit ``von`` gleich ``bis`` (wie ``stehtFest`` in der App)."""
    if b.get("typ") != "statist":
        return False
    e = b.get("eigenschaften", {})
    return e.get("von") == e.get("bis")


def figurenfelder(szene: dict) -> dict[Feld, str]:
    """Felder, die Figuren und stehende Statisten sperren, mit ihrem Namen."""
    felder = {tuple(f["feld"]): f["name"] for f in szene.get("figuren", [])}
    for b in szene.get("belebung", []):
        if steht_fest(b):
            felder[tuple(b["feld"])] = b["name"]
    return felder


def erreichbar(start: set[Feld], gesperrt: set[Feld], breite: int, hoehe: int) -> set[Feld]:
    """Alle Felder, die von ``start`` aus über freie Nachbarfelder erreichbar sind."""
    gesehen = {f for f in start if f not in gesperrt}
    schlange = deque(gesehen)
    while schlange:
        x, y = schlange.popleft()
        for dx, dy in NACHBARN:
            n = (x + dx, y + dy)
            if 0 <= n[0] < breite and 0 <= n[1] < hoehe and n not in gesperrt and n not in gesehen:
                gesehen.add(n)
                schlange.append(n)
    return gesehen


def uebergangsnamen() -> dict[str, set[str]]:
    """Je Karte die Namen ihrer Übergänge aus orte.json (mit und ohne Kartenangabe)."""
    orte = json.loads((INHALTE / "orte.json").read_text(encoding="utf-8"))["orte"]
    namen: dict[str, set[str]] = {}
    for o in orte:
        for k in o["karten"]:
            for a in o.get("ausloeser", []):
                if a.get("art") == "uebergang" and a.get("karte", k["kennung"]) == k["kennung"]:
                    namen.setdefault(k["kennung"], set()).add(a["name"])
    return namen


def pruefe_szene(szene: dict, moebel: dict, uebergaenge: set[str]) -> list[str]:
    """Befunde einer Szene: gesperrte Übergänge und Figuren auf Übergangs- oder Startfeldern."""
    zeilen = raster(szene)
    gesetzt, _ = platziere(szene, moebel)
    grund = gesperrte_felder(zeilen, gesetzt)
    figuren = figurenfelder(szene)
    hoehe, breite = len(zeilen), len(zeilen[0])
    ziele: dict[str, set[Feld]] = {}
    for a in szene.get("ausloeser", []):
        if a["name"] == "start" or a["name"] in uebergaenge:
            ziele.setdefault(a["name"], set()).add(tuple(a["feld"]))
    befunde = []
    for name, felder in sorted(ziele.items()):
        for f in sorted(felder & figuren.keys()):
            befunde.append(f"{szene['karte']}: {figuren[f]} steht auf {name} {f}")
    start = ziele.get("start") or next(iter(ziele.values()), set())
    ohne = erreichbar(start, grund, breite, hoehe)
    mit = erreichbar(start, grund | figuren.keys(), breite, hoehe)
    for name, felder in sorted(ziele.items()):
        if felder & ohne and not felder & mit:
            befunde.append(f"{szene['karte']}: Figuren versperren den Weg zu {name}")
    return befunde


def pruefe() -> list[str]:
    """Befunde aller Grundkarten und Zustände (ohne Archivvarianten)."""
    moebel = lade_moebel()
    namen = uebergangsnamen()
    befunde = []
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        befunde += pruefe_szene(szene, moebel, namen.get(szene.get("karte", ""), set()))
    return befunde


if __name__ == "__main__":
    gefunden = pruefe()
    print("\n".join(gefunden) or "Keine Figur versperrt einen Weg.")
    sys.exit(1 if gefunden else 0)
