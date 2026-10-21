"""Eicht die Zugwahl der Bots an den Zügen der Menschen (Teil von ``daten.py``).

Wozu: Die menschliche Zugwahl der App (app/src/engine/menschenwahl.ts) hat zwei Schichten. Die
Fehlerschicht würfelt je Fehlerart, ob der Bot eine angebotene Gelegenheit nutzt, und wählt dann
einen Zug dieser Art; die Restschicht wählt unter den übrigen Kandidaten mit einem Potenzkern.
Hier entstehen die Zahlen dazu, je Wertungsband:

- ``kern``: tau und Exponent des Kerns (1 + Verlust/tau)^(-Exponent) der Restschicht, angepasst an
  die Züge ohne erkannte Fehlerart, nur unter Kandidaten ohne Fehlerart (wie in der App);
- ``wahl_in_art``: beta der Wahl innerhalb einer Art (Gewicht Verlust^(-beta)), größte
  Wahrscheinlichkeit der gespielten Fehlerzüge; starke Spieler wählen den billigeren Fehler;
- ``verlustfaktoren``: Faktor auf die Gelegenheitsrate nach der Verlustklasse des gewählten Zuges,
  so geeicht, dass die nachgespielten Fehler je Klasse so oft vorkommen wie bei den Menschen.

Warum (Messung vom 20.10.2026): Ein Bot, der je Art immer den typischen Verlust spielt und unter
allen Kandidaten mit einer Temperatur wählt, machte in schwachen Bändern halb so viele grobe
Fehler wie Menschen und in starken doppelt so viele.
"""

from __future__ import annotations

import math
import random

from .auswerten import MINDESTVERLUST
from .sammeln import BAENDER

KERN_TAUS = (
    0.04,
    0.06,
    0.08,
    0.1,
    0.13,
    0.16,
    0.2,
    0.25,
    0.3,
    0.4,
    0.5,
    0.6,
    0.8,
    1.0,
    1.3,
    1.6,
    2.0,
    2.5,
    3.0,
    4.0,
)
KERN_EXPONENTEN = (0.25, 0.35, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0)
# Schwellen in Bauern (0,05: praktisch der beste Zug) und ihr Gewicht in der Abweichung
KERN_SCHWELLEN = (0.05, 0.5, 1.0, 3.0)
KERN_GEWICHTE = (1.0, 4.0, 4.0, 16.0)
BETAS = tuple(x / 4 for x in range(-8, 25))
# Verlustklassen der Fehlerzüge (Untergrenzen in Bauern)
KLASSEN = (0.5, 1.0, 2.0, 3.0, 5.0)
DURCHGAENGE = 10
MITTEL_UEBER = 4
DAEMPFUNG = 0.7
FAKTOR_GRENZEN = (0.02, 4.0)
HOECHSTE_WAHRSCHEINLICHKEIT = 0.95
SAAT = 20261020


def ist_artzug(c: list, best: float) -> bool:
    """Ein Kandidat mit erkannter Fehlerart und mindestens einem halben Bauern Verlust."""
    return c[2] != "ungenau" and best - c[1] >= MINDESTVERLUST


def klasse(verlust: float) -> int:
    """Index der Verlustklasse. Beispiel: 2,4 Bauern → 2 (Klasse ab 2)."""
    return max(i for i, grenze in enumerate(KLASSEN) if verlust >= grenze)


def kern_anteile(verluste: list[float], tau: float, exponent: float) -> list[float]:
    """Wahrscheinlichkeiten der Kandidaten im Kern (1 + Verlust/tau)^(-Exponent).

    Warum dieser Kern statt e^(-Verlust/tau): Menschen schwacher Bänder stellen öfter grob ein,
    als eine Exponentialwahl mit passender Quote kleiner Fehler hergibt; der Potenzkern hat dafür
    den längeren Schwanz. Beispiel: Verluste [0, 3], tau 0,25, Exponent 1 → Gewichte 1 und 1/13.
    """
    gewichte = [(1 + v / tau) ** -exponent for v in verluste]
    summe = sum(gewichte)
    return [g / summe for g in gewichte]


def _mischung(zeile: dict, blind: dict[str, list[float]], i: int) -> list[tuple[float, list[float]]]:
    """Die Lagen der Restschicht mit ihrer Wahrscheinlichkeit: ohne blinden Fleck alle Kandidaten,
    mit Fleck nur die ohne ihn (wie in der App: der erste getroffene Fleck des besten Zuges)."""
    verluste, flecke = zeile["v"], zeile["f"]
    noch, aus = 1.0, []
    for fleck in flecke[0]:
        if fleck not in blind:
            continue
        q = noch * min(HOECHSTE_WAHRSCHEINLICHKEIT, blind[fleck][i])
        sichtbar = [v for v, f in zip(verluste, flecke, strict=True) if fleck not in f]
        aus.append((q, sichtbar or verluste))
        noch -= q
    return [(noch, verluste), *aus]


def _kernfehler(zeilen: list, tau: float, exponent: float, ziel: list[float]) -> float:
    """Abweichung des Kerns von den Menschen: bester Zug, Verlust ab 0,5, ab 1, ab 3 (gewichtet)."""
    summe = [0.0] * len(KERN_SCHWELLEN)
    for mischung in zeilen:
        for gewicht, verluste in mischung:
            anteile = kern_anteile(verluste, tau, exponent)
            for i, schwelle in enumerate(KERN_SCHWELLEN):
                summe[i] += gewicht * sum(a for a, v in zip(anteile, verluste, strict=True) if v >= schwelle)
    n = max(1, len(zeilen))
    return sum(g * (m / n - zi) ** 2 for g, m, zi in zip(KERN_GEWICHTE, summe, ziel, strict=True))


def kern(rest: dict[int, list[dict]], blind: dict[str, list[float]]) -> dict[str, list[float]]:
    """Je Band tau und Exponent der Restschicht; der Exponent steigt mit der Stärke.

    Warum steigend: tau und Exponent gleichen sich teilweise aus; frei je Band springen sie
    zwischen Nachbarbändern, und die App mittelt zwischen Bändern. Ein mit der Stärke nicht
    fallender Exponent (schwache Spieler: langer Schwanz grober Fehler) hält die Werte glatt.
    Die blinden Flecken rechnet die Anpassung mit, wie die App sie anwendet; sonst zählten sie
    doppelt (in den Zügen der Menschen stecken sie schon).
    Eingabe: je Band Zeilen {"v": Verluste der Kandidaten ohne Fehlerart, "f": ihre Flecke,
    "g": gespielter Verlust} (jede zweite Zeile genügt); Zusatz je Fleck und Band.
    Ausgabe: {"tau": [...], "exponent": [...]} in der Reihenfolge der Bänder.
    """
    daten = {}
    for i, band in enumerate(BAENDER):
        zeilen = rest[band][::2]
        n = max(1, len(zeilen))
        ziel = [sum(1 for z in zeilen if z["g"] >= schwelle) / n for schwelle in KERN_SCHWELLEN]
        daten[band] = ([_mischung(z, blind, i) for z in zeilen], ziel)

    def bestes_tau(band: int, exponent: float) -> tuple[float, float]:
        zeilen, ziel = daten[band]
        return min((_kernfehler(zeilen, t, exponent, ziel), t) for t in KERN_TAUS)

    fehler = {(b, a): bestes_tau(b, a) for b in BAENDER for a in KERN_EXPONENTEN}
    exponenten = _steigend(fehler)
    return {
        "tau": [fehler[(b, a)][1] for b, a in zip(BAENDER, exponenten, strict=True)],
        "exponent": exponenten,
    }


def _steigend(fehler: dict[tuple[int, float], tuple[float, float]]) -> list[float]:
    """Exponent je Band, mit der Stärke nicht fallend, kleinste Summe der Abweichungen.

    Dynamische Programmierung über die Bänder: je Band und Exponent die beste Summe bis hier.
    """
    beste = {a: (fehler[(BAENDER[0], a)][0], [a]) for a in KERN_EXPONENTEN}
    for band in BAENDER[1:]:
        neu = {}
        for a in KERN_EXPONENTEN:
            summe, weg = min((beste[v] for v in KERN_EXPONENTEN if v <= a), key=lambda x: x[0])
            neu[a] = (summe + fehler[(band, a)][0], [*weg, a])
        beste = neu
    return min(beste.values(), key=lambda x: x[0])[1]


def _artkandidaten(z: dict, art: str, best: float) -> list[list]:
    return [c for c in z["k"][1:] + z["x"] if c[2] == art and best - c[1] >= MINDESTVERLUST]


def wahl_in_art(offen: dict[int, list[tuple[dict, list]]]) -> list[float]:
    """Je Band beta der Wahl innerhalb einer Art (größte Wahrscheinlichkeit, Raster).

    Nur Stellungen, in denen der Mensch einen Fehlerzug spielte und die Art mehrere Züge bot.
    Beispiel: beta 0 wählt gleich verteilt, beta 1,5 meist den billigsten Fehler.
    """
    aus = []
    for band in BAENDER:
        faelle = []
        for z, g in offen[band]:
            best = z["k"][0][1]
            if ist_artzug(g, best):
                verluste = [best - c[1] for c in _artkandidaten(z, g[2], best)]
                if len(verluste) > 1:
                    faelle.append((verluste, best - g[1]))

        def wahrscheinlichkeit(beta: float, faelle: list = faelle) -> float:
            return sum(math.log(v**-beta / sum(x**-beta for x in vs)) for vs, v in faelle)

        aus.append(max(BETAS, key=wahrscheinlichkeit))
    return aus


def _gewichtet(liste: list, gewichte: list[float], zufall: random.Random):
    rest = zufall.random() * sum(gewichte)
    for eintrag, gewicht in zip(liste, gewichte, strict=True):
        rest -= gewicht
        if rest < 0:
            return eintrag
    return liste[-1]


def _fehlerklassen(zeilen, i: int, daten: dict, faktoren: list[float], zufall) -> list[int]:
    """Spielt die Fehlerschicht eines Bandes nach; zählt die gewählten Fehlerzüge je Klasse."""
    zaehler = [0] * len(KLASSEN)
    beta = daten["KERN"]["beta"][i]
    for z, _ in zeilen:
        best = z["k"][0][1]
        treffer = []
        for art, dat in daten["GELEGENHEIT"].items():
            kandidaten = _artkandidaten(z, art, best)
            if not kandidaten:
                continue
            c = _gewichtet(kandidaten, [(best - k[1]) ** -beta for k in kandidaten], zufall)
            roh = dat["rate"][i] * dat["phase"][z["ph"]] * faktoren[klasse(best - c[1])]
            p = min(HOECHSTE_WAHRSCHEINLICHKEIT, roh)
            if zufall.random() < p:
                treffer.append((p, c))
        if treffer:
            _, c = _gewichtet(treffer, [p for p, _ in treffer], zufall)
            zaehler[klasse(best - c[1])] += 1
    return zaehler


def verlustfaktoren(offen: dict[int, list[tuple[dict, list]]], daten: dict) -> dict:
    """Faktoren je Band und Verlustklasse, durch wiederholtes Nachspielen geeicht.

    Je Durchgang: Faktor × ((Menschen + 1) / (Bot + 1))^0,7 je Klasse; Ergebnis ist das Mittel der
    letzten Durchgänge, mit den Nachbarbändern leicht geglättet. Ausgabe:
    {"klassen": [0.5, 1, 2, 3, 5], "faktor": [[…5 Werte…] je Band]}.
    """
    zufall = random.Random(SAAT)
    jeband = []
    for i, band in enumerate(BAENDER):
        zeilen = offen[band]
        mensch = [0] * len(KLASSEN)
        for z, g in zeilen:
            best = z["k"][0][1]
            if ist_artzug(g, best):
                mensch[klasse(best - g[1])] += 1
        faktoren = [1.0] * len(KLASSEN)
        verlauf = []
        for _ in range(DURCHGAENGE):
            bot = _fehlerklassen(zeilen, i, daten, faktoren, zufall)
            faktoren = [
                min(FAKTOR_GRENZEN[1], max(FAKTOR_GRENZEN[0], f * ((m + 1) / (b + 1)) ** DAEMPFUNG))
                for f, m, b in zip(faktoren, mensch, bot, strict=True)
            ]
            verlauf.append(faktoren)
        letzte = verlauf[-MITTEL_UEBER:]
        jeband.append([sum(v[k] for v in letzte) / len(letzte) for k in range(len(KLASSEN))])
    geglaettet = []
    for i, werte in enumerate(jeband):
        nachbarn = [jeband[j] for j in (i - 1, i + 1) if 0 <= j < len(jeband)]
        geglaettet.append(
            [
                round((2 * w + sum(n[k] for n in nachbarn)) / (2 + len(nachbarn)), 3)
                for k, w in enumerate(werte)
            ]
        )
    return {"klassen": list(KLASSEN), "faktor": geglaettet}
