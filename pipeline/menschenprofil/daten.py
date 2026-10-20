"""Erzeugt aus den ausgewerteten Stellungen die Konstanten des Menschenprofils für die App.

Wozu: Brücke zwischen den Lichess-Daten (Schritt 1, nur lokal) und der Zugwahl der Bots
(app/src/engine/menschenprofil-daten.ts, erzeugt, nicht von Hand ändern). Je Wertungsband
(400 bis 2400 in 200er-Schritten, Mitte des Bandes) entstehen:

- ``gelegenheit``: Wahrscheinlichkeit je Fehlerart, eine angebotene Gelegenheit zu nutzen, dazu
  ein Faktor je Phase und der typische Verlust (Median, 90-%-Wert) als Höchstverlust;
- ``blind``: Zusatzwahrscheinlichkeit, einen klar besten Zug eines blinden Flecks zu verfehlen;
- ``temperatur``: Temperatur der Grundschicht (gewichtete Wahl unter den Kandidaten), so gewählt,
  dass die Fehler ohne erkannte Art so oft vorkommen wie bei Menschen des Bandes;
- ``bedenkzeit``: Anteil der Restzeit je Zug nach Zugnummer und Lage, Streuung, Zeitnot-Zeiten;
- ``zeitnot``: Faktoren für Fehler (ab einem Bauern) und Patzer (ab drei Bauern) bei weniger als
  60, 30 und 10 Sekunden Restzeit.

Aufruf (im Hauptordner): ``python -m pipeline.menschenprofil.daten``
"""

from __future__ import annotations

import argparse
import json
import math
from collections import defaultdict
from pathlib import Path
from statistics import median

from .auswerten import (
    FLECKEN,
    MINDESTVERLUST,
    OFFEN_BIS,
    OFFEN_VON,
    PATZER,
    gespielt,
    gewinnchance,
    ist_wiederschlag,
    lies,
)
from .sammeln import BAENDER, band_von

ZIEL = Path("app/src/engine/menschenprofil-daten.ts")
HUNDERTSTEL = 100
GLAETTUNG = 2.0
ZUGSTUFEN = (0, 5, 10, 15, 20, 30, 40)
ZEITNOT_STUFEN = ((0, 10), (10, 30), (30, 60))
TEMPERATUREN = [round(0.02 * i, 2) for i in range(1, 76)]
LAGEN = ("wiederschlag", "schach", "einzig", "eng", "offen")


def lage_von(z: dict, wiederschlag: bool) -> str:
    """Wie schwer die Wahl war: Wiederschlag, Schach, ein einziger guter Zug, wenige, viele."""
    if wiederschlag:
        return "wiederschlag"
    if z["sc"]:
        return "schach"
    breite = sum(1 for c in z["k"] if z["k"][0][1] - c[1] <= 0.3)
    return "einzig" if breite <= 1 else ("eng" if breite <= 3 else "offen")


def zugstufe(ply: int) -> int:
    zug = ply // 2 + 1
    return max(s for s in ZUGSTUFEN if s <= zug)


class Sammler:
    def __init__(self) -> None:
        self.art_n: dict[tuple, float] = defaultdict(float)
        self.art_k: dict[tuple, float] = defaultdict(float)
        self.art_verlust: dict[str, list[float]] = defaultdict(list)
        self.fleck: dict[tuple, list[int]] = defaultdict(lambda: [0, 0])
        self.rest: dict[int, list[list[float]]] = defaultdict(list)
        self.anteil: dict[tuple, list[float]] = defaultdict(list)
        self.not_sek: dict[tuple, list[float]] = defaultdict(list)
        self.not_fehler: dict[tuple, list[int]] = defaultdict(lambda: [0, 0])
        self.not_patzer: dict[tuple, list[int]] = defaultdict(lambda: [0, 0])

    def stellung(self, z: dict, band: int, wiederschlag: bool) -> None:
        g = gespielt(z)
        if g is None:
            return
        best = z["k"][0][1]
        verlust = max(0.0, best - g[1])
        self._zeit(z, band, wiederschlag)
        if not OFFEN_VON <= gewinnchance(best) <= OFFEN_BIS:
            return
        angebot = {c[2] for c in z["k"][1:] + z["x"] if c[2] != "ungenau" and best - c[1] >= MINDESTVERLUST}
        for art in angebot:
            treffer = g[2] == art and verlust >= MINDESTVERLUST
            for schluessel in ((band, art, "alle"), (band, art, z["ph"])):
                self.art_n[schluessel] += 1
                self.art_k[schluessel] += treffer
            if treffer:
                self.art_verlust[art].append(verlust)
        self._flecken(z, band, g)
        if g[2] == "ungenau" or verlust < MINDESTVERLUST:
            self.rest[band].append([best - c[1] for c in z["k"]] + [verlust])
        sek = z["u"] / HUNDERTSTEL
        stufe = next((f"{a}" for a, b in ZEITNOT_STUFEN if a <= sek < b), "60")
        self.not_fehler[(band, stufe)][0] += 1
        self.not_fehler[(band, stufe)][1] += verlust >= 1.0
        self.not_patzer[(band, stufe)][0] += 1
        self.not_patzer[(band, stufe)][1] += verlust >= PATZER

    def _flecken(self, z: dict, band: int, g: list) -> None:
        k = z["k"]
        if len(k) < 2 or k[0][1] - k[1][1] < MINDESTVERLUST:
            return
        for fleck in FLECKEN:
            eintrag = self.fleck[(band, fleck, fleck in k[0][3])]
            eintrag[0] += 1
            eintrag[1] += g[0] != k[0][0]

    def _zeit(self, z: dict, band: int, wiederschlag: bool) -> None:
        if z["v"] is None or z["u"] <= 0 or z["t"] == "classical":
            return
        sek = z["u"] / HUNDERTSTEL
        verbraucht = max(0.0, z["v"] - z["z"] * HUNDERTSTEL)
        if sek < 60:
            stufe = next(f"{a}" for a, b in ZEITNOT_STUFEN if a <= sek < b)
            self.not_sek[(band, stufe)].append(verbraucht / HUNDERTSTEL)
            return
        self.anteil[(band, zugstufe(z["p"]), "alle")].append(verbraucht / z["u"])
        self.anteil[(band, "lage", lage_von(z, wiederschlag))].append(verbraucht / z["u"])


def geglaettet(werte: dict[int, tuple[float, float]], zielrate: float | None = None) -> list[float]:
    """Raten je Band, mit Nachbarbändern geglättet (Gewicht nach Zahl) und monoton fallend."""
    aus: list[float] = []
    for i in range(len(BAENDER)):
        n = k = 0.0
        for j in (i - 1, i, i + 1):
            if 0 <= j < len(BAENDER):
                gewicht = 1.0 if j == i else 0.5
                nj, kj = werte.get(BAENDER[j], (0.0, 0.0))
                n += gewicht * nj
                k += gewicht * kj
        aus.append((k + GLAETTUNG * (zielrate or 0.0)) / (n + GLAETTUNG) if n else (zielrate or 0.0))
    for i in range(1, len(aus)):
        aus[i] = min(aus[i], aus[i - 1])
    return [round(x, 4) for x in aus]


def gelegenheiten(s: Sammler) -> dict:
    arten = sorted({a for (_, a, _) in s.art_n})
    tabelle = {}
    for art in arten:
        je_band = {b: (s.art_n[(b, art, "alle")], s.art_k[(b, art, "alle")]) for b in BAENDER}
        gesamt_n = sum(n for n, _ in je_band.values())
        if gesamt_n < 50:
            continue
        gesamt = sum(k for _, k in je_band.values()) / gesamt_n
        phasen = {}
        for phase in ("eroeffnung", "mittelspiel", "endspiel"):
            n = sum(s.art_n[(b, art, phase)] for b in BAENDER)
            k = sum(s.art_k[(b, art, phase)] for b in BAENDER)
            phasen[phase] = (
                round(min(3.0, max(0.3, ((k + 1) / (n + 1 / gesamt)) / gesamt)), 2) if gesamt else 1.0
            )
        verluste = sorted(s.art_verlust[art]) or [1.0]
        tabelle[art] = {
            "rate": geglaettet(je_band, gesamt),
            "phase": phasen,
            "median": round(median(verluste), 2),
            "p90": round(verluste[int(0.9 * (len(verluste) - 1))], 2),
        }
    return tabelle


def blind(s: Sammler) -> dict:
    tabelle = {}
    for fleck in FLECKEN:
        zusatz = []
        for i in range(len(BAENDER)):
            werte = [0, 0, 0, 0]
            for j in (i - 1, i, i + 1):
                if 0 <= j < len(BAENDER):
                    mit = s.fleck[(BAENDER[j], fleck, True)]
                    ohne = s.fleck[(BAENDER[j], fleck, False)]
                    werte = [werte[0] + mit[0], werte[1] + mit[1], werte[2] + ohne[0], werte[3] + ohne[1]]
            q_mit = (werte[1] + 1) / (werte[0] + 2)
            q_ohne = (werte[3] + 1) / (werte[2] + 2)
            zusatz.append(round(max(0.0, (q_mit - q_ohne) / (1 - q_ohne)), 3))
        tabelle[fleck] = zusatz
    return tabelle


def temperatur(s: Sammler) -> list[float]:
    """Je Band die Temperatur, bei der die gewichtete Wahl unter den Kandidaten im Mittel so oft
    einen Verlust ab einem halben Bauern hat wie Menschen bei Zügen ohne erkannte Fehlerart."""
    aus = []
    for band in BAENDER:
        zeilen = s.rest[band]
        ziel = sum(1 for z in zeilen if z[-1] >= MINDESTVERLUST) / max(1, len(zeilen))
        beste, besterfehler = TEMPERATUREN[0], 1.0
        for tau in TEMPERATUREN:
            summe = 0.0
            for z in zeilen:
                verluste = z[:-1]
                gewichte = [math.exp(-v / tau) for v in verluste]
                summe += sum(g for g, v in zip(gewichte, verluste, strict=True) if v >= MINDESTVERLUST) / sum(
                    gewichte
                )
            abweichung = abs(summe / max(1, len(zeilen)) - ziel)
            if abweichung < besterfehler:
                beste, besterfehler = tau, abweichung
        aus.append(beste)
    for i in range(1, len(aus)):
        aus[i] = min(aus[i], aus[i - 1])
    return aus


def bedenkzeit(s: Sammler) -> dict:
    def med(werte: list[float]) -> float:
        return round(median(werte), 4) if werte else 0.0

    nach_zug = {b: [med(s.anteil[(b, z, "alle")]) for z in ZUGSTUFEN] for b in BAENDER}
    lagen_alle = {lage: [] for lage in LAGEN}
    for b in BAENDER:
        for lage in LAGEN:
            lagen_alle[lage] += s.anteil[(b, "lage", lage)]
    gesamt = median([x for werte in lagen_alle.values() for x in werte]) or 1.0
    faktor = {lage: round(med(w) / gesamt, 2) for lage, w in lagen_alle.items()}
    logs = [math.log(x) for w in lagen_alle.values() for x in w if x > 0]
    mittel = sum(logs) / len(logs)
    streuung = round(math.sqrt(sum((x - mittel) ** 2 for x in logs) / len(logs)), 2)

    def mittel_von(werte: list[float]) -> float:
        return round(sum(werte) / len(werte), 2) if werte else 1.0

    not_sek = {f"{a}": [mittel_von(s.not_sek[(b, f"{a}")]) for b in BAENDER] for a, _ in ZEITNOT_STUFEN}
    return {
        "zugstufen": list(ZUGSTUFEN),
        "anteil": nach_zug,
        "lage": faktor,
        "streuung": streuung,
        "zeitnotSekunden": not_sek,
    }


def gruppe_von(band: int) -> int:
    """Zeitnot-Gruppe: unter 1000, 1000 bis 1799, ab 1800 (je Band zu wenige Zeitnot-Züge)."""
    return 0 if band < 1000 else (1 if band < 1800 else 2)


def zeitnot(zaehler: dict[tuple, list[int]]) -> dict:
    """Faktor der Fehler je Restzeitstufe gegenüber 60 s und mehr, je Gruppe gerechnet (Blitz und
    Schnellschach zusammen) und auf die Bänder verteilt. ``zaehler``: Fehler ab einem Bauern
    (``not_fehler``) oder Patzer ab drei Bauern (``not_patzer``)."""
    aus = {}
    for a, _ in ZEITNOT_STUFEN:
        je_gruppe = {}
        for gruppe in (0, 1, 2):
            baender = [b for b in BAENDER if gruppe_von(b) == gruppe]
            n0 = sum(zaehler[(b, "60")][0] for b in baender)
            k0 = sum(zaehler[(b, "60")][1] for b in baender)
            n1 = sum(zaehler[(b, f"{a}")][0] for b in baender)
            k1 = sum(zaehler[(b, f"{a}")][1] for b in baender)
            basis = (k0 + 1) / (n0 + 2)
            je_gruppe[gruppe] = round(max(1.0, ((k1 + basis * 20) / (n1 + 20)) / basis), 2)
        aus[f"{a}"] = [je_gruppe[gruppe_von(b)] for b in BAENDER]
    return aus


def als_ts(daten: dict) -> str:
    kopf = (
        "/**\n * Menschenprofil je Wertungsband aus Lichess-Partien (erzeugt von\n"
        " * pipeline/menschenprofil/daten.py, nicht von Hand ändern).\n *\n"
        " * Rolle im Gesamtbild: Datengrundlage der menschlichen Zugwahl (engine/menschenwahl.ts) und\n"
        " * der Bedenkzeit der Bots (engine/bedenkzeit.ts); Herleitung in docs/ENTSCHEIDUNGEN.md,\n"
        " * „Menschliche Bots und Uhr“. Quelle: offene Lichess-Datenbank (CC0), Monat 2026-09.\n"
        " * Abhängigkeiten: keine.\n */\n"
    )
    zeilen = [kopf, "/* eslint-disable */"]
    zeilen.append(f"export const BAENDER = {json.dumps(list(BAENDER))} as const;")
    for name, wert in daten.items():
        zeilen.append(f"export const {name} = {json.dumps(wert, ensure_ascii=False)} as const;")
    return "\n".join(zeilen) + "\n"


def main(argumente: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--ordner", type=Path, default=Path("buch/arbeit/menschenprofil"))
    parser.add_argument("--ziel", type=Path, default=ZIEL)
    args = parser.parse_args(argumente)
    s = Sammler()
    vorher = None
    for z in lies(args.ordner):
        band = band_von(z["w"])
        if band is not None and z["k"]:
            s.stellung(z, band, ist_wiederschlag(vorher, z))
        vorher = z
    daten = {
        "GELEGENHEIT": gelegenheiten(s),
        "BLIND": blind(s),
        "TEMPERATUR": temperatur(s),
        "BEDENKZEIT": bedenkzeit(s),
        "ZEITNOT": zeitnot(s.not_fehler),
        "ZEITNOT_PATZER": zeitnot(s.not_patzer),
    }
    args.ziel.write_text(als_ts(daten), encoding="utf-8")
    (args.ordner / "daten.json").write_text(json.dumps(daten, indent=1, ensure_ascii=False))
    print(json.dumps({"TEMPERATUR": daten["TEMPERATUR"], "ZEITNOT": daten["ZEITNOT"]}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
