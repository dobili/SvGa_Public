"""Prüfung der Blickpunkte: Stellen, an denen Ambrose etwas sagt, wenn der Held vorbeikommt.

Warum: Wunsch des Autors (24.11.2026): Ambrose kommentiert nicht das Betreten einer Karte, sondern
Stellen, an denen es für einen Mann von 1866 etwas Besonderes zu sehen gibt, mehrere je Karte. Die
Stellen stehen in ``inhalte/abenteuer/ambrose_blickpunkte.json``, ihre Texte als Knoten in
``inhalte/abenteuer/dialoge/de/ambrose-blick.ink``; die App löst sie aus
(app/src/abenteuer/regeln/blickpunkte.ts). Daten und Texte schreiben verschiedene Hände; diese
Prüfung hält sie zusammen.

Ein Eintrag: ``{"karte": "mapleFalls.park", "feld": [25, 13], "radius": 3,
"knoten": "blick_mapleFalls_park_kiosk", "wann": "<Bedingung, optional>"}``. Die Datei ist eine
Liste solcher Einträge (oder ``{"blickpunkte": [...]}``).

Befunde:
1. Form: Karte, Feld, Radius (2 bis 4), Knoten ``blick_<karte>_<stichwort>`` (Punkte als „_“),
   ``wann`` in der Sprache der Bedingungen (bedingung.py).
2. Jeder Eintrag hat genau einen Knoten in der Ink-Datei und jeder Knoten genau einen Eintrag.
3. Das Feld liegt auf der Karte (Grundszene aus ``szenen/``).
4. Im Radius (Luftlinie von Feld zu Feld, wie die App) liegt ein Feld, das der Held erreicht.
5. Nicht im Eingang: Kein Ankunftsfeld der Karte liegt im Radius (der Start, die Felder der
   Übergänge, ihre festgelegte ``ankunft`` und die freien Felder direkt daneben). Sonst spräche
   Ambrose, bevor man von der Karte etwas gesehen hat.

Grenze: Geprüft wird die Grundfassung jeder Karte; in einer Zustandskarte kann ein Möbel anders
stehen. Ob an der Stelle wirklich ein sichtbares Objekt steht, prüft der Mensch.

Aufruf: ``python -m pipeline.abenteuer.blickpunkte`` (druckt die Befunde, letzte Zeile „N Befunde“;
Rückgabe 1 bei Befunden). Dauertest: pipeline/tests/test_abenteuer_blickpunkte.py.
"""

import json
import re
import sys
from pathlib import Path

from pipeline.abenteuer.bedingung import Bedingungsfehler, variablen
from pipeline.abenteuer.durchgang import gesperrte_felder
from pipeline.abenteuer.figurensperre import NACHBARN, erreichbar, figurenfelder, uebergangsnamen
from pipeline.abenteuer.kartenbau import INHALTE, platziere, raster
from pipeline.abenteuer.moebelliste import lade_moebel

Feld = tuple[int, int]

DATEN = INHALTE / "ambrose_blickpunkte.json"
INK = INHALTE / "dialoge" / "de" / "ambrose-blick.ink"
# Radius in Feldern: groß genug, um die Stelle im Vorbeigehen zu treffen, klein genug, um nicht
# die halbe Karte zu füllen (Vertrag der Helfer, 24.11.2026).
RADIUS_MIN = 2
RADIUS_MAX = 4
KNOTENKOPF = re.compile(r"^=== (\w+) ===\s*$", re.MULTILINE)
START = "start"


def lade_blickpunkte(pfad: Path = DATEN) -> list[dict]:
    """Die Einträge der Datei: eine Liste oder ``{"blickpunkte": [...]}``; ohne Datei leer."""
    if not pfad.exists():
        return []
    roh = json.loads(pfad.read_text(encoding="utf-8"))
    return roh if isinstance(roh, list) else roh.get("blickpunkte", [])


def lade_knoten(pfad: Path = INK) -> list[str]:
    """Die Knoten der Ink-Datei in ihrer Reihenfolge; ohne Datei leer."""
    return KNOTENKOPF.findall(pfad.read_text(encoding="utf-8")) if pfad.exists() else []


def grundszenen() -> dict[str, dict]:
    """Je Kartenkennung die Szene ihrer Grundfassung (die Datei, die orte.json als Karte nennt)."""
    orte = json.loads((INHALTE / "orte.json").read_text(encoding="utf-8"))["orte"]
    dateien = {k["kennung"]: k["datei"] for o in orte for k in o["karten"]}
    szenen = {}
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        if dateien.get(szene.get("karte")) == szene.get("datei"):
            szenen[szene["karte"]] = szene
    return szenen


def knotenvorsilbe(karte: str) -> str:
    """Womit die Knoten einer Karte beginnen. Beispiel: mapleFalls.park → blick_mapleFalls_park_."""
    return "blick_" + karte.replace(".", "_") + "_"


def formbefunde(p: dict) -> list[str]:
    """Befunde zur Form eines Eintrags (Punkt 1); leer, wenn er sich weiter prüfen lässt."""
    feld = p.get("feld")
    if not isinstance(p.get("karte"), str) or not isinstance(p.get("knoten"), str):
        return [f"Eintrag ohne Karte oder Knoten: {json.dumps(p, ensure_ascii=False)}"]
    name = p["knoten"]
    befunde = []
    if not (isinstance(feld, list) and len(feld) == 2 and all(isinstance(z, int) for z in feld)):
        befunde.append(f"{name}: Feld fehlt oder ist kein [x, y] aus ganzen Zahlen")
    radius = p.get("radius")
    if not isinstance(radius, (int, float)) or not RADIUS_MIN <= radius <= RADIUS_MAX:
        befunde.append(f"{name}: Radius {radius!r} liegt nicht zwischen {RADIUS_MIN} und {RADIUS_MAX}")
    vorsilbe = knotenvorsilbe(p["karte"])
    if not name.startswith(vorsilbe) or len(name) == len(vorsilbe):
        befunde.append(f"{name}: Knoten heißt nicht {vorsilbe}<stichwort>")
    if "wann" in p:
        try:
            variablen(p["wann"])
        except (Bedingungsfehler, TypeError) as fehler:
            befunde.append(f"{name}: Bedingung „{p['wann']}“ ist unlesbar ({fehler})")
    return befunde


def paarbefunde(punkte: list[dict], knoten: list[str]) -> list[str]:
    """Befunde zu Punkt 2: Eintrag ohne Knoten, Knoten ohne Eintrag, doppelte Namen."""
    namen = [p["knoten"] for p in punkte if isinstance(p.get("knoten"), str)]
    befunde = [f"{n}: Knoten fehlt in ambrose-blick.ink" for n in namen if n not in knoten]
    befunde += [f"{k}: Knoten ohne Eintrag in ambrose_blickpunkte.json" for k in knoten if k not in namen]
    doppelt = sorted({n for n in namen if namen.count(n) > 1})
    befunde += [f"{n}: steht mehrfach in ambrose_blickpunkte.json" for n in doppelt]
    doppelt = sorted({k for k in knoten if knoten.count(k) > 1})
    befunde += [f"{k}: Knoten steht mehrfach in ambrose-blick.ink" for k in doppelt]
    return befunde


def im_radius(mitte: Feld, radius: float, feld: Feld) -> bool:
    """Liegt ``feld`` im Radius um ``mitte`` (Luftlinie, wie abstandQuadrat in der App)?"""
    return (mitte[0] - feld[0]) ** 2 + (mitte[1] - feld[1]) ** 2 <= radius**2


def ankunftsfelder(szene: dict, uebergaenge: set[str], gesperrt: set[Feld]) -> set[Feld]:
    """Felder, auf denen der Held die Karte betritt (Punkt 5).

    Der Start, jedes freie Feld eines Übergangs, seine festgelegte ``ankunft`` („x,y“) und die
    freien Felder direkt neben einem Übergangsfeld (app/src/abenteuer/oberwelt/ankunft.ts wählt
    eines davon). Beispiel: Dachboden, Treppe auf (1, 8) und (2, 8) mit Ankunft „2,9“ → (2, 9) und
    die freien Nachbarn der Treppe.
    """
    felder: set[Feld] = set()
    for a in szene.get("ausloeser", []):
        if a["name"] != START and a["name"] not in uebergaenge:
            continue
        x, y = a["feld"]
        felder.add((x, y))
        fest = a.get("eigenschaften", {}).get("ankunft")
        if fest:
            fx, fy = (int(z) for z in fest.split(","))
            felder.add((fx, fy))
        if a["name"] != START:
            felder |= {(x + dx, y + dy) for dx, dy in NACHBARN}
    return felder - gesperrt


def ortsbefunde(p: dict, szene: dict, moebel: dict, uebergaenge: set[str]) -> list[str]:
    """Befunde zu den Punkten 3 bis 5 für einen Eintrag auf seiner Szene."""
    zeilen = raster(szene)
    hoehe, breite = len(zeilen), len(zeilen[0])
    mitte: Feld = (p["feld"][0], p["feld"][1])
    name, radius = p["knoten"], p["radius"]
    if not (0 <= mitte[0] < breite and 0 <= mitte[1] < hoehe):
        return [f"{name}: Feld {mitte} liegt nicht auf der Karte {p['karte']} ({breite} × {hoehe})"]
    gesetzt, _ = platziere(szene, moebel)
    gesperrt = gesperrte_felder(zeilen, gesetzt, szene) | figurenfelder(szene).keys()
    eingang = ankunftsfelder(szene, uebergaenge, gesperrt)
    begehbar = erreichbar(eingang, gesperrt, breite, hoehe)
    befunde = []
    if not any(im_radius(mitte, radius, f) for f in begehbar):
        befunde.append(f"{name}: im Radius {radius} um {mitte} liegt kein Feld, das der Held erreicht")
    nah = sorted(f for f in eingang if im_radius(mitte, radius, f))
    if nah:
        stelle = f"Ankunftsfeld {nah[0]} im Radius {radius} um {mitte}"
        befunde.append(f"{name}: löst im Eingang der Karte aus ({stelle})")
    return befunde


def pruefe(punkte: list[dict] | None = None, knoten: list[str] | None = None) -> list[str]:
    """Alle Befunde zu den Blickpunkten; leer heißt: Daten, Knoten und Karten passen zusammen.

    Eingaben nur für Tests; sonst die Dateien des Repositorys. Beispiel: Kiosk im Park von Maple
    Falls auf (25, 13) mit Radius 3 → kein Befund; derselbe Eintrag auf (1, 16) (am Parkeingang)
    → „löst im Eingang der Karte aus“.
    """
    punkte = lade_blickpunkte() if punkte is None else punkte
    knoten = lade_knoten() if knoten is None else knoten
    befunde = paarbefunde(punkte, knoten)
    szenen, moebel, namen = grundszenen(), lade_moebel(), uebergangsnamen()
    for p in punkte:
        form = formbefunde(p)
        befunde += form
        if form:
            continue
        szene = szenen.get(p["karte"])
        if szene is None:
            befunde.append(f"{p['knoten']}: Karte {p['karte']} gibt es nicht (keine Grundszene)")
            continue
        befunde += ortsbefunde(p, szene, moebel, namen.get(p["karte"], set()))
    return befunde


if __name__ == "__main__":
    gefunden = pruefe()
    print("\n".join([*gefunden, f"{len(gefunden)} Befunde"]))
    sys.exit(1 if gefunden else 0)
