"""Weltpuzzle: legt alle Außenkarten über ihre Zugänge aneinander und meldet, was nicht passt.

Warum: Rückmeldung des Autors (11.11.2026, R032 bis R034). Er hat die Karten auf einer großen
Fläche aneinandergelegt: Der Zedernpfad ist viel kürzer als Landstraße plus Flussweg, die zum
selben Ort führen, und legt man ihn an den Ortskern, liegt er auf dem Flussweg. „Die Weltkarte muss
konsistent sein, nichts darf überlappen“, und am Rand sollen Flüsse und Straßen auf der
Nachbarkarte weitergehen.

Verfahren:
- Ein Übergang über den Kartenrand (Ost ↔ West, Nord ↔ Süd) ist eine **Naht**: Die Zielkarte liegt
  bündig daneben, so verschoben, dass die Felder der beiden Auslöser aufeinandertreffen.
- Von einer Startkarte aus werden alle Karten über ihre Nähte gelegt (Breitensuche). Erreicht eine
  Naht eine Karte, die schon liegt, und verlangt eine andere Lage, **schließt der Ring nicht**.
- Zwei Karten derselben Insel, deren Rechtecke sich schneiden, **überlappen**.
- An jeder Naht werden die beiden Randstreifen Feld für Feld verglichen (Wasser, Straße, Weg,
  Natur): Ein Unterschied ist ein **Randbruch**.
- Übergänge ohne Rand (Fähre, Bus, Zug, Steg) verbinden Inseln nur lose und werden nicht gelegt.
- ``inhalte/abenteuer/weltpuzzle.json`` hält die erlaubten Ausnahmen fest: ein ``zwischenstueck``
  (ungezeichnetes Wegstück, die Naht darf springen; mit ``sprung`` um genau so viele Kacheln) und
  ``rand_ausnahmen``, je mit Begründung.

Aufruf: ``python -m pipeline.abenteuer.weltpuzzle [--bild PFAD] [--ort KENNUNG ...]``
(Liste der Befunde, Rückgabewert 1 bei Befunden; das Bild zeichnet ``weltpuzzle_bild.py``).
"""

import argparse
import json
import sys
from collections import deque
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer.uebergaenge import GEGENUEBER, INHALTE, felder, rand, regel_fuer

AUSNAHMEN = INHALTE / "weltpuzzle.json"
RANDTIEFE = 3  # so viele Felder hinter einem gesperrten Randfeld zählen noch zum Rand
FLAECHE_AB = 7  # ab dieser Länge ist ein Streifen eine Fläche (Stadtboden), kein Weg mehr
SPRUNG_HOECHSTENS = 60  # größter Sprung in Kacheln, den ein Zwischenstück erklären darf

# Bodenarten in Klassen: Nur Wechsel zwischen Klassen sind Randbrüche.
WASSER, STRASSE, WEG, NATUR, GESPERRT = "Wasser", "Straße", "Weg", "Natur", "gesperrt"
STRASSENBOEDEN = ("asphalt", "pflaster", "platten", "stein", "hallenboden")
WEGBOEDEN = ("erde", "schotter", "piste", "sandplatz", "holz", "dielen")


@dataclass(frozen=True)
class Naht:
    """Übergang über den Rand: Karte ``von`` grenzt mit ``seite`` an ``nach``; ``versatz`` ist die
    Lage von ``nach`` gegen ``von`` in Kacheln (x, y)."""

    von: str
    name: str
    nach: str
    seite: str
    versatz: tuple[int, int]


def groesse(szene: dict) -> tuple[int, int]:
    """Breite und Höhe einer Karte in Kacheln."""
    return max(len(z) for z in szene["raster"]), len(szene["raster"])


def aussenkarten(alle: dict[str, dict]) -> dict[str, dict]:
    """Nur die Außenkarten: Innenräume braucht das Puzzle nicht (R034)."""
    return {k: s for k, s in alle.items() if s.get("art") != "innen"}


def _versatz(szene: dict, ziel: dict, hier: list, dort: list, seite: str) -> tuple[int, int]:
    """Lage der Zielkarte, wenn das erste Feld des Auslösers auf sein Gegenstück trifft.

    Beispiel: Stadtpark „landstrasse“ am Ostrand (43, 15) trifft „zurueckPark“ am Westrand (0, 15)
    der Landstraße: Die Landstraße liegt 44 Kacheln rechts, 0 Kacheln tiefer.
    """
    breite, hoehe = groesse(szene)
    ziel_breite, ziel_hoehe = groesse(ziel)
    (x, y), (zx, zy) = min(hier), min(dort)
    if seite == "ost":
        return breite, y - zy
    if seite == "west":
        return -ziel_breite, y - zy
    if seite == "sued":
        return x - zx, hoehe
    return x - zx, -ziel_hoehe


def naehte(aussen: dict[str, dict], liste: list[dict]) -> list[Naht]:
    """Alle Übergänge zwischen zwei Außenkarten, die auf gegenüberliegenden Rändern liegen."""
    ergebnis = []
    for karte, szene in aussen.items():
        for name in sorted({a["name"] for a in szene.get("ausloeser", [])}):
            regel = regel_fuer(liste, karte, name)
            if not regel or regel.get("art") != "uebergang" or "ziel" not in regel:
                continue
            ziel = aussen.get(regel["ziel"]["karte"])
            hier = felder(szene, name)
            dort = felder(ziel, regel["ziel"]["ausloeser"]) if ziel else []
            seiten = {rand(szene, f) for f in hier}
            if not dort or len(seiten) != 1 or None in seiten:
                continue
            seite = seiten.pop()
            if {rand(ziel, f) for f in dort} != {GEGENUEBER[seite]}:
                continue
            versatz = _versatz(szene, ziel, hier, dort, seite)
            ergebnis.append(Naht(karte, name, regel["ziel"]["karte"], seite, versatz))
    return ergebnis


def ausnahmen() -> dict:
    """Erlaubte Sprünge und Randbrüche aus ``weltpuzzle.json`` (fehlt die Datei: keine)."""
    if not AUSNAHMEN.exists():
        return {"zwischenstuecke": [], "rand_ausnahmen": []}
    return json.loads(AUSNAHMEN.read_text(encoding="utf-8"))


def _ist_ausnahme(eintraege: list[dict], naht: Naht, hin: dict[tuple, Naht]) -> dict | None:
    """Eintrag, der diese Naht oder ihre Gegenrichtung nennt."""
    for e in eintraege:
        if (e["karte"], e["ausloeser"]) == (naht.von, naht.name):
            return e
        gegen = hin.get((e["karte"], e["ausloeser"]))
        if gegen and gegen.nach == naht.von and gegen.von == naht.nach:
            return e
    return None


def legen(
    aussen: dict[str, dict], alle_naehte: list[Naht], frei: list[dict]
) -> tuple[list[dict[str, tuple[int, int]]], list[str]]:
    """Legt die Karten zu Inseln. Rückgabe: je Insel Karte → Lage (x, y), dazu die Befunde.

    Nähte mit Zwischenstück (``frei``) legen nichts fest; ihr Sprung wird gemeldet, wenn er größer
    ist als ``SPRUNG_HOECHSTENS`` oder die Karten in verschiedenen Inseln liegen bleiben.
    """
    hin = {(n.von, n.name): n for n in alle_naehte}
    fest = [n for n in alle_naehte if not _ist_ausnahme(frei, n, hin)]
    fest += _mit_sprung(alle_naehte, frei)
    # Rückweg ergänzen, wo er nicht über den Rand führt (Desert Springs: hin über den Rand,
    # zurück am Bahnhof), damit jede Naht in beiden Richtungen legt.
    paare = {(n.von, n.nach) for n in fest}
    fest += [
        Naht(n.nach, n.name, n.von, GEGENUEBER[n.seite], (-n.versatz[0], -n.versatz[1]))
        for n in fest
        if (n.nach, n.von) not in paare
    ]
    inseln, befunde, gelegt = [], [], set()
    for start in aussen:
        if start in gelegt:
            continue
        lage = {start: (0, 0)}
        schlange = deque([start])
        while schlange:
            karte = schlange.popleft()
            for n in (n for n in fest if n.von == karte):
                soll = (lage[karte][0] + n.versatz[0], lage[karte][1] + n.versatz[1])
                if n.nach not in lage:
                    lage[n.nach] = soll
                    schlange.append(n.nach)
                elif lage[n.nach] != soll and n.von < n.nach:
                    dx, dy = soll[0] - lage[n.nach][0], soll[1] - lage[n.nach][1]
                    befunde.append(
                        f"Ring schließt nicht: {n.von} „{n.name}“ → {n.nach} "
                        f"verlangt die Karte {dx:+d} Kacheln waagerecht, {dy:+d} senkrecht versetzt"
                    )
        gelegt |= set(lage)
        inseln.append(lage)
    return inseln, befunde + _spruenge(inseln, alle_naehte, frei, hin)


def _mit_sprung(alle_naehte: list[Naht], frei: list[dict]) -> list[Naht]:
    """Zwischenstücke mit festem ``sprung`` (dx, dy in Kacheln): Die Naht legt die Zielkarte um
    diesen Sprung versetzt. Beispiel: Vom Stadtpark steigt der Pfad ungezeichnet am Kürbishof
    vorbei, der Zedernpfad liegt deshalb 34 Kacheln höher als bündig."""
    ergebnis = []
    for e in frei:
        naht = next((n for n in alle_naehte if (n.von, n.name) == (e["karte"], e["ausloeser"])), None)
        if naht and "sprung" in e:
            versatz = (naht.versatz[0] + e["sprung"][0], naht.versatz[1] + e["sprung"][1])
            ergebnis.append(Naht(naht.von, naht.name, naht.nach, naht.seite, versatz))
    return ergebnis


def _spruenge(inseln: list[dict], alle_naehte: list[Naht], frei: list[dict], hin: dict) -> list[str]:
    """Prüft die Zwischenstücke: Der Sprung zwischen Soll- und Ist-Lage bleibt klein."""
    befunde = []
    for n in alle_naehte:
        eintrag = _ist_ausnahme(frei, n, hin)
        if not eintrag or (eintrag["karte"], eintrag["ausloeser"]) != (n.von, n.name):
            continue
        insel = next((i for i in inseln if n.von in i), {})
        if n.nach not in insel:
            continue  # Das freie Zwischenstück ist die einzige Verbindung: Es legt nichts fest.
        dx = insel[n.nach][0] - insel[n.von][0] - n.versatz[0]
        dy = insel[n.nach][1] - insel[n.von][1] - n.versatz[1]
        if max(abs(dx), abs(dy)) > SPRUNG_HOECHSTENS:
            befunde.append(
                f"Zwischenstück zu groß: {n.von} „{n.name}“ → {n.nach} springt {dx:+d} Kacheln "
                f"waagerecht, {dy:+d} senkrecht (erlaubt bis {SPRUNG_HOECHSTENS})"
            )
    return befunde


def ueberlappungen(insel: dict[str, tuple[int, int]], aussen: dict[str, dict]) -> list[str]:
    """Karten einer Insel, deren Rechtecke sich schneiden."""
    befunde, namen = [], sorted(insel)
    for i, a in enumerate(namen):
        ax, ay = insel[a]
        ab, ah = groesse(aussen[a])
        for b in namen[i + 1 :]:
            bx, by = insel[b]
            bb, bh = groesse(aussen[b])
            breit = min(ax + ab, bx + bb) - max(ax, bx)
            hoch = min(ay + ah, by + bh) - max(ay, by)
            if breit > 0 and hoch > 0:
                befunde.append(f"Überlappung: {a} und {b} liegen {breit} × {hoch} Kacheln aufeinander")
    return befunde


def bodenklasse(szene: dict, x: int, y: int) -> str:
    """Klasse des Bodens auf einem Feld: Wasser, Straße, Weg, Natur oder gesperrt."""
    zeile = szene["raster"][y]
    zeichen = zeile[x] if x < len(zeile) else "#"
    if zeichen == "#":
        return GESPERRT
    if zeichen == "~":
        return WASSER
    boden = szene.get("boeden", {}).get(zeichen, szene.get("boden", "")).lower()
    if boden.startswith("wasser"):
        return WASSER
    if boden.startswith(STRASSENBOEDEN):
        return STRASSE
    return WEG if boden.startswith(WEGBOEDEN) else NATUR


def randklasse(szene: dict, seite: str, stelle: int) -> str:
    """Bodenklasse am Rand: Ist das Randfeld gesperrt, zählt das erste freie Feld dahinter (bis
    ``RANDTIEFE``), weil viele Karten ringsum eine Reihe Wald oder Fels haben."""
    breite, hoehe = groesse(szene)
    for tiefe in range(RANDTIEFE):
        x, y = {
            "west": (tiefe, stelle),
            "ost": (breite - 1 - tiefe, stelle),
            "nord": (stelle, tiefe),
            "sued": (stelle, hoehe - 1 - tiefe),
        }[seite]
        klasse = bodenklasse(szene, x, y)
        if klasse != GESPERRT:
            return klasse
    return GESPERRT


def randbrueche(naht: Naht, aussen: dict[str, dict]) -> list[str]:
    """Vergleicht die Randstreifen einer Naht. Gemeldet wird, wo Wasser, Straße oder Weg auf der
    einen Seite liegt und auf der anderen etwas anderes; Natur gegen gesperrt (Wiese gegen Wald)
    ist kein Bruch. Zusammenhängende Stellen werden zu einem Bereich zusammengefasst. Wasser zählt
    immer (R034: „plötzlich kein Wasser mehr“); Straße und Weg nur als schmaler Streifen, weil eine
    breite befestigte Fläche der Stadtrand ist, den ein Zwischenstück erklärt."""
    von, nach = aussen[naht.von], aussen[naht.nach]
    laengs = naht.seite in ("ost", "west")
    schub = naht.versatz[1] if laengs else naht.versatz[0]
    laenge = groesse(von)[1] if laengs else groesse(von)[0]
    ziel_laenge = groesse(nach)[1] if laengs else groesse(nach)[0]
    bereiche: list[list] = []
    for stelle in range(max(0, schub), min(laenge, schub + ziel_laenge)):
        hier = randklasse(von, naht.seite, stelle)
        dort = randklasse(nach, GEGENUEBER[naht.seite], stelle - schub)
        if hier == dort or {hier, dort} <= {NATUR, GESPERRT}:
            continue
        if bereiche and bereiche[-1][1] == stelle - 1 and bereiche[-1][2:] == [hier, dort]:
            bereiche[-1][1] = stelle
        else:
            bereiche.append([stelle, stelle, hier, dort])
    achse = "y" if laengs else "x"
    return [
        f"Randbruch: {naht.von} „{naht.name}“ ({naht.seite}) {achse} {a}–{b}: {hier}, "
        f"auf {naht.nach} ({achse} {a - schub}–{b - schub}): {dort}"
        for a, b, hier, dort in bereiche
        if WASSER in (hier, dort) or b - a < FLAECHE_AB
    ]


def pruefe(alle: dict[str, dict], liste: list[dict], orte: list[str] | None = None):
    """Ganzes Puzzle. Rückgabe: Inseln (Karte → Lage), Nähte und Befunde.

    ``orte`` beschränkt die Befunde auf Karten dieser Orte (Kennung vor dem Punkt), etwa
    ``["mapleFalls", "wegMapleCedar", "kuerbishof", "cedarCreek"]`` für Akt 1.
    """
    aussen = aussenkarten(alle)
    alle_naehte = naehte(aussen, liste)
    erlaubt = ausnahmen()
    inseln, befunde = legen(aussen, alle_naehte, erlaubt["zwischenstuecke"])
    for insel in inseln:
        befunde += ueberlappungen(insel, aussen)
    hin = {(n.von, n.name): n for n in alle_naehte}
    frei = erlaubt["zwischenstuecke"] + erlaubt["rand_ausnahmen"]
    for n in alle_naehte:
        if n.von < n.nach and not _ist_ausnahme(frei, n, hin):
            befunde += randbrueche(n, aussen)
    if orte:
        befunde = [b for b in befunde if any(f"{o}." in b for o in orte)]
    return inseln, alle_naehte, befunde


def main() -> int:
    from pipeline.abenteuer.uebergaenge import szenen, uebergaenge

    eingabe = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    eingabe.add_argument("--bild", type=Path, help="Übersichtsbild (PNG) schreiben")
    eingabe.add_argument("--ort", nargs="*", help="nur Befunde zu diesen Orten")
    wahl = eingabe.parse_args()
    alle = szenen()
    inseln, alle_naehte, befunde = pruefe(alle, uebergaenge(), wahl.ort)
    print(f"{sum(len(i) for i in inseln)} Außenkarten in {len(inseln)} Inseln, {len(alle_naehte)} Nahtseiten")
    for b in befunde:
        print(f"- {b}")
    if wahl.bild:
        from pipeline.abenteuer.weltpuzzle_bild import zeichne

        zeichne(inseln, aussenkarten(alle), alle_naehte).save(wahl.bild)
        print(f"Übersichtsbild: {wahl.bild}")
    print("Weltpuzzle in Ordnung" if not befunde else f"{len(befunde)} Befunde")
    return 1 if befunde else 0


if __name__ == "__main__":
    sys.exit(main())
