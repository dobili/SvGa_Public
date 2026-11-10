"""Übergänge decken ihren ganzen Durchgang: Luke, Treppe, Tür, Wegbreite am Rand, Lücke in der Wand.

Warum: Der Autor kam beim ersten Spielen (10.11.2026) kaum durch Übergänge. Viele Durchgänge sind
breiter als ihr Auslöser: Die Luke im Dachboden ist zwei Kacheln breit, der Auslöser lag nur auf
einer; ein Spieler tritt aber auf irgendeine Kachel der Luke. Ein Übergang löst in der App nur
aus, wenn der Held AUF einer Kachel des Auslösers steht (oberwelt/ausloeserebene.ts).

Regeln je Übergang (Auslöser mit ``art: uebergang`` in orte.json):
1. Kein Feld des Auslösers ist gesperrt (Wand, Wasser, Möbel mit Kollision).
2. Liegt er unter einer Treppe, Luke oder Leiter, trägt jede begehbare Kachel dieses Möbels den
   Auslöser (man betritt sie irgendwo). Unter Tür, Steg, Brücke oder Fußmatte trägt ihn jede
   begehbare Kachel der Reihen des Möbels, in denen er liegt (oder jede der Spalten: ein Steg, den
   man von der Seite betritt).
3. Liegt er am Kartenrand, trägt ihn die ganze begehbare Strecke des Rands, in der er liegt (die
   volle Breite des Wegs oder der Straße).
4. Liegt er in einer Lücke der Wand (links und rechts Wand, höchstens LUECKE_MAX Kacheln, auf einer
   Seite zu, auf der anderen ein breiterer Raum: die Schwelle einer Tür), trägt ihn die ganze Lücke; ebenso
   senkrecht.

Mehrere Felder bekommt ein Auslöser in der Szene durch mehrere Einträge gleichen Namens; der
Kartenbau schreibt je Feld ein Objekt, die App nimmt für die Ankunft das erste.
Aufruf über ``python -m pipeline.abenteuer.uebergaenge``.
"""

import json
import re

from pipeline.abenteuer.kartenbau import GESPERRT, INHALTE, WAND, K, platziere, raster
from pipeline.abenteuer.maske import maskenfelder
from pipeline.abenteuer.moebelliste import lade_moebel

# Möbel, durch die man geht: nach ``art`` oder nach dem Namen.
DURCHGANGSART = {"tuer", "treppe", "luke", "leiter", "steg", "bruecke"}
DURCHGANGSNAME = re.compile(r"treppe|luke|tuer|leiter|steg|bruecke|fussmatte|rampe", re.I)
# Breiteste Lücke in einer Wand, die noch als Tür gilt (darüber ist es ein Raum).
# Möbel, die man auf jeder Kachel betritt (nicht nur in einer Reihe).
GANZ = re.compile(r"treppe|luke|leiter", re.I)
LUECKE_MAX = 4
Feld = tuple[int, int]


def gesperrte_felder(zeilen: list[str], gesetzt: list[dict]) -> set[Feld]:
    """Alle gesperrten Kacheln: Raster (Wand, Wasser, Leere) und Möbel mit Kollision.

    Wie app/src/abenteuer/oberwelt/begehbar.ts: Ein Möbel sperrt jede Kachel, die seine
    Sperrfläche in Pixeln berührt (ein Feinschub von 8 Pixeln sperrt die Nachbarkachel mit).
    """
    gesperrt = {(x, y) for y, zeile in enumerate(zeilen) for x, z in enumerate(zeile) if z in GESPERRT}
    for s in gesetzt:
        if not s["kollision"]:
            continue
        for a, b in maskenfelder(s):
            x0, y0 = s["x"] + a * K, s["y"] + b * K
            for x in range(x0 // K, (x0 + K - 1) // K + 1):
                for y in range(y0 // K, (y0 + K - 1) // K + 1):
                    gesperrt.add((x, y))
    return gesperrt


def _flaeche(stueck: dict) -> set[Feld]:
    """Die Kacheln, die das Bild eines Möbels berührt."""
    return {
        (x, y)
        for x in range(stueck["x"] // K, (stueck["x"] + stueck["breite"] - 1) // K + 1)
        for y in range(stueck["y"] // K, (stueck["y"] + stueck["hoehe"] - 1) // K + 1)
    }


def _strecke(frei, feld: Feld, dx: int, dy: int) -> list[Feld]:
    """Die zusammenhängende begehbare Strecke durch ``feld`` in Richtung ±(dx, dy)."""
    strecke = [feld]
    for vz in (1, -1):
        x, y = feld[0] + vz * dx, feld[1] + vz * dy
        while frei(x, y):
            strecke.append((x, y))
            x, y = x + vz * dx, y + vz * dy
    return sorted(strecke)


def _tuerluecke(zeilen: list[str], frei, feld: Feld, dx: int, dy: int) -> list[Feld]:
    """Die Lücke in einer Wand, in der ``feld`` liegt (Regel 4), sonst eine leere Liste.

    Schwelle einer Tür: beide Enden der Strecke sind Wand, auf einer Seite ist alles zu, auf der
    anderen liegt ein Raum, der breiter ist als die Lücke. Ohne die letzte Bedingung wäre jede
    Reihe eines schmalen Raums oder die Spalte neben einer Wand eine „Lücke“.
    """
    strecke = _strecke(frei, feld, dx, dy)
    (ax, ay), (ex, ey) = strecke[0], strecke[-1]
    enden = ((ax - dx, ay - dy), (ex + dx, ey + dy))
    hoehe, breite = len(zeilen), len(zeilen[0])
    wand = all(0 <= q < breite and 0 <= p < hoehe and zeilen[p][q] == WAND for q, p in enden)
    if not wand or len(strecke) > LUECKE_MAX:
        return []
    for vz in (1, -1):
        zu = all(not frei(q + vz * dy, p + vz * dx) for q, p in strecke)
        offen = all(frei(q - vz * dy, p - vz * dx) for q, p in (enden[0], *strecke, enden[1]))
        if zu and offen:
            return strecke
    return []


def _fehlend_im_moebel(felder: set[Feld], flaeche: set[Feld], frei, ganz: bool) -> set[Feld]:
    """Begehbare Kacheln eines Durchgangsmöbels ohne Auslöser: bei ``ganz`` alle, sonst ganze
    Reihen oder ganze Spalten."""
    if ganz:
        return {f for f in flaeche if frei(*f)} - felder
    reihen = {(x, y) for x, y in flaeche if frei(x, y) and any(fy == y for _, fy in felder & flaeche)}
    spalten = {(x, y) for x, y in flaeche if frei(x, y) and any(fx == x for fx, _ in felder & flaeche)}
    return min(reihen - felder, spalten - felder, key=len)


def fehlende_felder(szene: dict, name: str, moebel: dict) -> tuple[set[Feld], set[Feld]]:
    """(gesperrte Felder des Auslösers, begehbare Felder des Durchgangs ohne Auslöser).

    Beispiel: Dachboden, „treppe“ nur auf (1, 4), Luke auf (1..2, 3..5) → fehlt (2, 4).
    """
    zeilen = raster(szene)
    gesetzt, _ = platziere(szene, moebel)
    gesperrt = gesperrte_felder(zeilen, gesetzt)
    hoehe, breite = len(zeilen), len(zeilen[0])

    def frei(x: int, y: int) -> bool:
        return 0 <= x < breite and 0 <= y < hoehe and (x, y) not in gesperrt

    felder = {tuple(a["feld"]) for a in szene.get("ausloeser", []) if a["name"] == name}
    fehlt: set[Feld] = set()
    for s in gesetzt:
        art = moebel.get(s["name"], {}).get("art")
        durchgang = art in DURCHGANGSART or DURCHGANGSNAME.search(s["name"])
        if durchgang and not s["kollision"] and felder & _flaeche(s):
            ganz = bool(GANZ.search(f"{art} {s['name']}"))
            fehlt |= _fehlend_im_moebel(felder, _flaeche(s), frei, ganz)
    for x, y in felder:
        if x in (0, breite - 1):
            fehlt |= set(_strecke(frei, (x, y), 0, 1)) - felder
        if y in (0, hoehe - 1):
            fehlt |= set(_strecke(frei, (x, y), 1, 0)) - felder
        for dx, dy in ((1, 0), (0, 1)):
            fehlt |= set(_tuerluecke(zeilen, frei, (x, y), dx, dy)) - felder
    return {f for f in felder if not frei(*f)}, fehlt


def alle_fassungen(grund: dict[str, dict]) -> list[tuple[str, dict]]:
    """(Name für den Befund, Szene) für jede Grundkarte und jeden Zustand aus orte.json.

    Die Paarprüfung in ``uebergaenge`` braucht nur die Grundkarten; ein Durchgang muss aber in
    jeder Fassung stimmen, die ein Spieler betritt (Dachboden ohne Brett, Wohnzimmer ausgepackt).
    """
    orte = json.loads((INHALTE / "orte.json").read_text(encoding="utf-8"))["orte"]
    zustaende = {d for o in orte for k in o["karten"] for d in k.get("zustaende", {}).values()}
    fassungen = list(grund.items())
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        if szene.get("datei") in zustaende:
            fassungen.append((f"{szene['karte']} ({pfad.stem})", szene))
    return fassungen


def pruefe_durchgaenge(alle: dict[str, dict], liste: list[dict]) -> list[str]:
    """Befunde aller Karten: gesperrte Auslöserfelder und Durchgänge, die breiter sind als ihr
    Auslöser. ``alle`` und ``liste`` wie in ``uebergaenge.pruefe``."""
    from pipeline.abenteuer.uebergaenge import regel_fuer

    moebel = lade_moebel()
    befunde = []
    for marke, szene in alle_fassungen(alle):
        karte = szene["karte"]
        for name in sorted({a["name"] for a in szene.get("ausloeser", [])}):
            regel = regel_fuer(liste, karte, name)
            if not regel or regel.get("art") != "uebergang":
                continue
            zu, fehlt = fehlende_felder(szene, name, moebel)
            if zu:
                befunde.append(f"{marke} {name}: Feld {sorted(zu)} ist gesperrt")
            if fehlt:
                befunde.append(
                    f"{marke} {name}: Durchgang breiter als der Auslöser, es fehlt {sorted(fehlt)}"
                )
    return befunde
