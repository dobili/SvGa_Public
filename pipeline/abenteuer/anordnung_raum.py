"""Anordnungsregeln, die das Raster lesen (KARTENREGELN 10.83 zweiter Teil, 10.86, 10.87).

Warum: Kartennotizen des Autors vom 15.11.2026 (Diner: „Tresen näher an die Wand“, „Die zweite
Fußmatte fehlt“; Cedar Creek: „Die Straße ist teilweise nach unten versetzt, nicht gerade“). Diese
Regeln brauchen keine Bilder, nur Raster, Auslöser und Lage der Möbel.

Rolle im Gesamtbild: Teil von ``anordnung.py``.
"""

import re

from pipeline.abenteuer.kartenbau import K, sperrfelder

WAND = "#"
# Höchstens so viele freie Reihen liegen zwischen Theke und Rückwand (Gang für das Personal).
THEKENGANG = 2
STRASSENBELAG = {"asphalt", "landstrasse"}
MINDESTBREITE_STRASSE = 2
# Ein Versatz, der nach so vielen Linien zurückspringt, gilt als Fehler (keine Kurve).
VERSATZ_LAENGE = 20
THEKE = re.compile(r"theke|tresen", re.I)
MATTE = re.compile(r"matte", re.I)
HOCKER = re.compile(r"hocker", re.I)


def pruefe_theke_an_wand(szene: dict, gesetzt: list[dict], moebel: dict, zeilen: list[str]) -> list[str]:
    """10.83 (zweiter Teil): Hinter einer Theke (Blick nach Süden, Hocker im Raum) liegt bis zur Wand
    höchstens ein Gang von zwei Reihen.
    Beispiel: Falls Diner, Theke in Reihe 4, Gang in den Reihen 3 und 4 (vorher 3 bis 5)."""
    # Nur Theken mit Hockern davor (Bar, Diner); ein Schalter in einer Halle steht frei im Raum.
    if szene.get("art") != "innen" or not any(HOCKER.search(s["name"]) for s in gesetzt):
        return []
    for s in gesetzt:
        angabe = moebel.get(s["name"], {})
        if not THEKE.search(s["name"]) or angabe.get("blick") != "unten":
            continue
        for x, y in sorted(sperrfelder(s)):
            gang = 0
            while y - gang - 1 >= 0 and zeilen[y - gang - 1][x] != WAND:
                gang += 1
            if gang > THEKENGANG:
                return [f"10.83 {s['name']} ({x}, {y}): {gang} Reihen bis zur Rückwand (Theke an die Wand)"]
    return []


def _auf_feld(stueck: dict, x: int, y: int) -> bool:
    return (
        stueck["x"] < (x + 1) * K
        and x * K < stueck["x"] + stueck["breite"]
        and stueck["y"] < (y + 1) * K
        and (y * K < stueck["y"] + stueck["hoehe"])
    )


def pruefe_fussmatten(szene: dict, gesetzt: list[dict], moebel: dict, zeilen: list[str]) -> list[str]:
    """10.86: Innen liegt vor jedem Feld einer Tür in der Südwand eine Fußmatte.

    Beispiel: Falls Diner, Glastür über zwei Felder (4, 12) und (5, 12): Matten auf (4, 11) und (5, 11).
    """
    if szene.get("art") != "innen":
        return []
    unten = len(zeilen) - 1
    tueren = [s for s in gesetzt if moebel.get(s["name"], {}).get("art") == "tuer"]
    matten = [
        s
        for s in gesetzt
        if MATTE.search(s["name"]) or MATTE.search(moebel.get(s["name"], {}).get("hinweis", ""))
    ]
    befunde = []
    for punkt in szene.get("ausloeser", []):
        x, y = punkt["feld"]
        if y != unten or not any(_auf_feld(t, x, y) for t in tueren):
            continue
        if not any(_auf_feld(m, x, y - 1) for m in matten):
            befunde.append(f"10.86 Tür {punkt['name']} ({x}, {y}): keine Fußmatte auf ({x}, {y - 1})")
    return befunde


def _laeufe(zellen: list[bool]) -> list[tuple[int, int]]:
    """Zusammenhängende Läufe (Anfang, Länge) in einer Spalte oder Reihe."""
    laeufe, anfang = [], None
    for i, wert in enumerate([*zellen, False]):
        if wert and anfang is None:
            anfang = i
        elif not wert and anfang is not None:
            laeufe.append((anfang, i - anfang))
            anfang = None
    return laeufe


def _kanten(gitter: list[list[bool]]) -> list[tuple[int, str, int, int]]:
    """Stufen einer Straßenkante zwischen zwei Nachbarlinien: (Linie, Kante, von, nach).

    Kante „anfang“ ist die obere (linke) Kante eines Laufs, „ende“ die untere (rechte). Gezählt wird
    nur eine Stufe von genau einer Kachel zwischen Läufen, die sich überlappen und breit genug sind.
    """
    stufen = []
    for i in range(1, len(gitter)):
        for a1, l1 in _laeufe(gitter[i - 1]):
            for a2, l2 in _laeufe(gitter[i]):
                if min(l1, l2) < MINDESTBREITE_STRASSE or a1 >= a2 + l2 or a2 >= a1 + l1:
                    continue
                if abs(a1 - a2) == 1:
                    stufen.append((i, "anfang", a1, a2))
                if abs((a1 + l1) - (a2 + l2)) == 1:
                    stufen.append((i, "ende", a1 + l1, a2 + l2))
    return stufen


def _spruenge(gitter: list[list[bool]]) -> list[tuple[int, int]]:
    """Versätze: Eine Kante springt um eine Kachel und kurz darauf (höchstens ``VERSATZ_LAENGE``
    Linien später) wieder zurück. Ausgabe: (erste Linie, Lage der versetzten Kante)."""
    stufen = _kanten(gitter)
    spruenge = []
    for i, kante, von, nach in stufen:
        zurueck = any(
            k == kante and v == nach and n == von and i < j <= i + VERSATZ_LAENGE for j, k, v, n in stufen
        )
        if zurueck:
            spruenge.append((i, nach))
    return spruenge


def pruefe_strassen(szene: dict, zeilen: list[str]) -> list[str]:
    """10.87: Ein Straßenzug (Asphalt, Landstraße) springt nicht um eine Kachel zur Seite.

    Beispiel: Cedar Creek, die Hauptstraße lag in den Spalten 5 bis 17 eine Reihe tiefer als links und
    rechts davon. Gemeldet wird die erste Spalte (Reihe) des Versatzes. Eine Kurve oder eine Straße, die
    breiter wird, springt nicht zurück und wird nicht gemeldet.
    """
    if szene.get("art") != "aussen" or not zeilen:
        return []
    zeichen = {z for z, belag in szene.get("boeden", {}).items() if belag in STRASSENBELAG}
    if not zeichen:
        return []
    breite, hoehe = len(zeilen[0]), len(zeilen)
    spalten = [[zeilen[y][x] in zeichen for y in range(hoehe)] for x in range(breite)]
    reihen = [[zeilen[y][x] in zeichen for x in range(breite)] for y in range(hoehe)]
    befunde = [
        f"10.87 Straße springt bei Spalte {x}, Reihe {y} um eine Kachel" for x, y in _spruenge(spalten)
    ]
    befunde += [
        f"10.87 Straße springt bei Reihe {y}, Spalte {x} um eine Kachel" for y, x in _spruenge(reihen)
    ]
    return befunde
