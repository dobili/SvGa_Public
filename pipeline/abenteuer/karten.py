"""Reine Prüffunktionen für die Tiled-Karten des Schach-Abenteuers.

Wozu diese Datei da ist:
    Die Oberwelt der App (``app/src/abenteuer/oberwelt/szene.ts``) liest die Karten aus
    ``inhalte/abenteuer/karten/`` und braucht feste Ebenen, einen Startpunkt, Kollision am
    Kachelsatz und erreichbare Auslöser. Die Regeln stehen in ``inhalte/abenteuer/README.md``
    (Abschnitt Tiled-Karten). Diese Funktionen machen sie prüfbar; der Test
    ``pipeline/tests/test_abenteuer_karten.py`` wendet sie bei jedem Push auf alle Karten an.
"""

from __future__ import annotations

import json
from collections import deque
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer.maske import maskenfelder
from pipeline.abenteuer.moebelliste import lade_moebel

KACHELEBENEN = ("boden", "waende", "objekte")
OBJEKTEBENE = "ausloeser"
KACHELGROESSE = 16
RICHTUNGEN = ("oben", "unten", "links", "rechts")
NACHBARN = ((1, 0), (-1, 0), (0, 1), (0, -1))

Feld = tuple[int, int]


@dataclass(frozen=True)
class Kartenobjekt:
    """Ein Objekt der Ebene ``ausloeser`` mit Kachelkoordinaten.

    ``figur`` ist wahr bei ``type = "figur"``; ``eigenschaften`` sind die Tiled-Eigenschaften
    als Wörterbuch (etwa ``{"richtung": "oben"}`` beim Start).
    """

    name: str
    figur: bool
    feld: Feld
    eigenschaften: dict[str, object]
    belebung: bool = False
    moebel: bool = False
    groesse: tuple[int, int] = (1, 1)


def lade_karte(pfad: Path) -> dict:
    """Liest eine Tiled-Karte (JSON) ein.

    Beispiel: ``lade_karte(Path("inhalte/abenteuer/karten/maple-falls-dachboden.json"))``.
    """
    return json.loads(pfad.read_text(encoding="utf-8"))


def ebene(karte: dict, name: str) -> dict | None:
    """Die Ebene mit diesem Namen oder None, wenn es sie nicht gibt."""
    return next((e for e in karte.get("layers", []) if e.get("name") == name), None)


def kollisionskacheln(karte: dict) -> set[int]:
    """Globale Kachelnummern mit ``kollision = true`` aus den eingebetteten Kachelsätzen.

    Warum: Kollision steht am Kachelsatz (README, Tiled-Karten), nicht an der Karte.
    Beispiel Platzhalter: Wand, Kiste, Brett, Lampe, Fenster → ``{2, 3, 5, 7, 8}``.
    """
    ergebnis: set[int] = set()
    for satz in karte.get("tilesets", []):
        for kachel in satz.get("tiles", []):
            for eig in kachel.get("properties", []):
                if eig.get("name") == "kollision" and eig.get("value") is True:
                    ergebnis.add(satz["firstgid"] + kachel["id"])
    return ergebnis


def objekte(karte: dict) -> list[Kartenobjekt]:
    """Alle Objekte der Ebene ``ausloeser`` mit Kachelkoordinaten (Pixel / 16)."""
    schicht = ebene(karte, OBJEKTEBENE) or {}
    return [
        Kartenobjekt(
            name=o.get("name", ""),
            figur=o.get("type") == "figur",
            belebung=o.get("type") in ("statist", "tier"),
            moebel=o.get("type") == "moebel",
            feld=(int(o["x"]) // KACHELGROESSE, int(o["y"]) // KACHELGROESSE),
            eigenschaften={e["name"]: e.get("value") for e in o.get("properties", [])},
        )
        for o in schicht.get("objects", [])
    ]


MOEBEL = lade_moebel()


def moebelfelder(karte: dict) -> set[Feld]:
    """Felder unter Möbeln mit ``kollision`` (inhalte/abenteuer/moebel/): alles außer der obersten
    Kachelreihe.

    Beispiel: ein Bett 32 × 48 bei (64, 32) sperrt die Felder (4, 3), (5, 3), (4, 4), (5, 4).
    """
    felder: set[Feld] = set()
    for o in (ebene(karte, OBJEKTEBENE) or {}).get("objects", []):
        angabe = MOEBEL.get(o.get("name", "")) if o.get("type") == "moebel" else None
        eigene = {e["name"]: e.get("value") for e in o.get("properties", [])}
        # Der Kartenbauer schreibt die Kollision an das Objekt (an der Wand, auf dem Tisch: keine).
        if not angabe or not eigene.get("kollision", angabe.get("kollision")):
            continue
        x0, y0 = int(o["x"]) // KACHELGROESSE, int(o["y"]) // KACHELGROESSE
        # Regel in maske.py: ohne oberste Reihe, „frei_unten“ oder eigene „maske“.
        felder |= {(x0 + dx, y0 + dy) for dx, dy in maskenfelder(angabe)}
    return felder


def blockiert(karte: dict) -> set[Feld]:
    """Alle Felder, auf denen in einer Kachelebene eine Kollisionskachel oder ein Möbel steht."""
    breite, kollision = karte["width"], kollisionskacheln(karte)
    felder: set[Feld] = moebelfelder(karte)
    for name in KACHELEBENEN:
        daten = (ebene(karte, name) or {}).get("data", [])
        for index, kachel in enumerate(daten):
            if kachel in kollision:
                felder.add((index % breite, index // breite))
    return felder


def erreichbar(karte: dict, start: Feld) -> set[Feld]:
    """Breitensuche zu Fuß von ``start`` über alle nicht blockierten Felder der Karte.

    Sonderfall: Ist ``start`` selbst blockiert, ist die Menge leer.
    """
    breite, hoehe, gesperrt = karte["width"], karte["height"], blockiert(karte)
    if start in gesperrt:
        return set()
    gesehen, offen = {start}, deque([start])
    while offen:
        x, y = offen.popleft()
        for dx, dy in NACHBARN:
            feld = (x + dx, y + dy)
            if 0 <= feld[0] < breite and 0 <= feld[1] < hoehe:
                if feld not in gesehen and feld not in gesperrt:
                    gesehen.add(feld)
                    offen.append(feld)
    return gesehen


def objekt_erreichbar(objekt: Kartenobjekt, begehbar: set[Feld], gesperrt: set[Feld]) -> bool:
    """Ob man ein Objekt betreten oder von einem Nachbarfeld aus ansehen kann.

    Figuren und Objekte auf blockierten Feldern (Brett, Bank) gelten als erreichbar, wenn ein
    freies Nachbarfeld erreichbar ist; andere Auslöser muss man betreten können.
    """
    x, y = objekt.feld
    nachbar = any((x + dx, y + dy) in begehbar for dx, dy in NACHBARN)
    if objekt.figur or objekt.feld in gesperrt:
        return nachbar
    return objekt.feld in begehbar


def offene_randfelder(karte: dict, erlaubt: set[Feld]) -> list[Feld]:
    """Randfelder der Ebene ``waende`` ohne Kollision, die kein Übergang sind.

    Beispiel: Tür im unteren Rand mit Auslöser ``haustuer`` → erlaubt, keine Meldung.
    """
    breite, hoehe = karte["width"], karte["height"]
    daten = (ebene(karte, "waende") or {}).get("data", [])
    kollision = kollisionskacheln(karte)
    rand = [
        (x, y) for y in range(hoehe) for x in range(breite) if x in (0, breite - 1) or y in (0, hoehe - 1)
    ]
    return [f for f in rand if daten[f[1] * breite + f[0]] not in kollision and f not in erlaubt]
