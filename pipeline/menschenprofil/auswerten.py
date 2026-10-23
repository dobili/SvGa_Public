"""Rechnet aus den ausgewerteten Stellungen die Übersetzungstabellen des Menschenprofils.

Wozu: Schritt 1b des Plans „menschlichere Bots und Uhr der Bots“ (20.10.2026). Eingabe sind die
Zeilen aus app/src/engine/menschenprofil.messung.ts (eine je Stellung). Ausgabe je Wertungsband
(200er-Schritte), Tempo und Phase:

- Fehlerarten je Gelegenheit: Wie oft spielt ein Mensch einen Zug der Art, wenn die Stellung einen
  solchen Fehlerzug anbietet (Verlust mindestens ein halber Bauer)? Dazu der typische Verlust.
- Blinde Flecken: Wie oft verfehlt er einen klar besten Zug, der zu einem blinden Fleck gehört,
  verglichen mit klar besten Zügen ohne diesen Fleck (Blindheitsfaktor).
- Allgemeines: Anteil des besten Zuges, Verlustverteilung, Genauigkeit nach Lichess.
- Bedenkzeit je Zug (Anteil an der Restzeit) nach Phase, Schwierigkeit, Wiederschlag.
- Zeitnot: Fehlerquoten nach Restzeit (unter 10 s, 10 bis 30 s, 30 bis 60 s, darüber).
- Zeitverluste je Band und Tempo.

Nur entschiedene Stellungen fallen heraus (Gewinnchance des besten Zuges unter 10 % oder über
90 %), wie bei der Spielstärke (spiel/entscheidung.ts). Ergebnis: ``tabellen.json`` und
``bericht.md`` im Ordner (nur lokal).

Aufruf (im Hauptordner): ``python -m pipeline.menschenprofil.auswerten``
"""

from __future__ import annotations

import argparse
import json
import math
from collections import defaultdict
from pathlib import Path
from statistics import median

import chess

from .sammeln import band_von

MINDESTVERLUST = 0.5
GROBER_FEHLER = 1.0
PATZER = 3.0
OFFEN_VON, OFFEN_BIS = 10.0, 90.0
FAKTOR_LICHESS = 0.00368208
DECKEL_CP = 1000
NAH_AM_BESTEN = 0.3
FLECKEN = (
    "rueckzug",
    "diagonale",
    "springer",
    "dame",
    "turm",
    "ruhig",
    "abzug",
    "bauer",
    "roentgen",
    "zwischenzug",
    "grundreihe",
)
ZEITNOT = ((0, 10), (10, 30), (30, 60), (60, 10**9))
HUNDERTSTEL = 100


def gewinnchance(bauern: float) -> float:
    """Gewinnchance in Prozent aus dem Wert in Bauern (Lichess). Beispiel: 0 → 50, +1 → etwa 59."""
    cp = max(-DECKEL_CP, min(DECKEL_CP, bauern * HUNDERTSTEL))
    return 50 + 50 * (2 / (1 + math.exp(-FAKTOR_LICHESS * cp)) - 1)


def zuggenauigkeit(verlust_prozent: float) -> float:
    """Genauigkeit eines Zuges nach Lichess aus dem Verlust an Gewinnchance."""
    roh = 103.1668 * math.exp(-0.04354 * max(0.0, verlust_prozent)) - 3.1669
    return max(0.0, min(100.0, roh))


class Zaehler:
    """Zählt Treffer je Schlüssel: n Gelegenheiten, k Treffer, dazu gesammelte Werte."""

    def __init__(self) -> None:
        self.n: dict[tuple, int] = defaultdict(int)
        self.k: dict[tuple, int] = defaultdict(int)
        self.werte: dict[tuple, list[float]] = defaultdict(list)

    def zaehle(self, schluessel: tuple, treffer: bool, wert: float | None = None) -> None:
        self.n[schluessel] += 1
        if treffer:
            self.k[schluessel] += 1
            if wert is not None:
                self.werte[schluessel].append(wert)

    def tabelle(self) -> dict[str, dict]:
        aus: dict[str, dict] = {}
        for s, n in sorted(self.n.items(), key=lambda e: str(e[0])):
            w = sorted(self.werte.get(s, []))
            eintrag = {"n": n, "k": self.k.get(s, 0), "rate": round(self.k.get(s, 0) / n, 4)}
            if w:
                eintrag["median"] = round(median(w), 2)
                eintrag["p90"] = round(w[int(0.9 * (len(w) - 1))], 2)
            aus["|".join(str(x) for x in s)] = eintrag
        return aus


def gespielt(zeile: dict) -> list | None:
    """Der gespielte Zug als [uci, wert, art, flecke] aus Kandidaten oder gezielten Zügen."""
    return next((z for z in zeile["k"] + zeile["x"] if z[0] == zeile["m"]), None)


class Auswertung:
    """Sammelt alle Tabellen beim Durchlauf über die Stellungen."""

    def __init__(self) -> None:
        self.arten = Zaehler()
        self.flecken = Zaehler()
        self.allgemein = Zaehler()
        self.zeit: dict[tuple, list[float]] = defaultdict(list)
        self.zeitnot = Zaehler()
        self.genauigkeit: dict[tuple, list[float]] = defaultdict(list)

    def stellung(self, z: dict, gruppe: tuple, wiederschlag: bool) -> None:
        best = z["k"][0]
        g = gespielt(z)
        if g is None:
            return
        verlust = max(0.0, best[1] - g[1])
        verlust_prozent = max(0.0, gewinnchance(best[1]) - gewinnchance(g[1]))
        self.genauigkeit[(z["g"], z["p"] % 2, gruppe[0], gruppe[1])].append(zuggenauigkeit(verlust_prozent))
        self._zeit(z, gruppe, wiederschlag)
        if not OFFEN_VON <= gewinnchance(best[1]) <= OFFEN_BIS:
            return
        self._allgemein(z, gruppe, g, verlust)
        self._arten(z, gruppe, g, verlust)
        self._flecken(z, gruppe, g)
        self._zeitnot(z, gruppe, verlust)

    def _allgemein(self, z: dict, gruppe: tuple, g: list, verlust: float) -> None:
        self.allgemein.zaehle(gruppe + ("bester",), g[0] == z["k"][0][0])
        for grenze in (MINDESTVERLUST, GROBER_FEHLER, PATZER):
            self.allgemein.zaehle(gruppe + (f"verlust>={grenze}",), verlust >= grenze, verlust)
        if verlust >= MINDESTVERLUST:
            self.allgemein.zaehle(gruppe + ("fehler_mit_art",), g[2] != "ungenau")

    def _arten(self, z: dict, gruppe: tuple, g: list, verlust: float) -> None:
        best = z["k"][0][1]
        angebot = {c[2] for c in z["k"][1:] + z["x"] if c[2] != "ungenau" and best - c[1] >= MINDESTVERLUST}
        for art in angebot:
            self.arten.zaehle(gruppe + (art,), g[2] == art and verlust >= MINDESTVERLUST, verlust)

    def _flecken(self, z: dict, gruppe: tuple, g: list) -> None:
        """Verfehlen eines klar besten Zuges (Abstand zum zweitbesten mindestens ein halber
        Bauer), getrennt danach, ob der beste Zug zu einem blinden Fleck gehört („mit|f“) oder
        nicht („ohne|f“). Das Verhältnis ist der Blindheitsfaktor des Flecks."""
        k = z["k"]
        if len(k) < 2 or k[0][1] - k[1][1] < MINDESTVERLUST:
            return
        verfehlt = g[0] != k[0][0]
        for fleck in FLECKEN:
            seite = "mit" if fleck in k[0][3] else "ohne"
            self.flecken.zaehle((gruppe[0], gruppe[1], seite, fleck), verfehlt)

    def _zeit(self, z: dict, gruppe: tuple, wiederschlag: bool) -> None:
        if z["v"] is None or z["u"] <= 0:
            return
        breite = sum(1 for c in z["k"] if z["k"][0][1] - c[1] <= NAH_AM_BESTEN)
        art = "wiederschlag" if wiederschlag else ("schach" if z["sc"] else f"breite{min(breite, 4)}")
        anteil = max(0.0, z["v"] - z["z"] * HUNDERTSTEL) / z["u"]
        self.zeit[gruppe + (art,)].append(round(anteil, 4))
        self.zeit[gruppe[:2] + ("alle", "sekunden")].append(z["v"] / HUNDERTSTEL)
        self.zeit[gruppe[:2] + (f"zug{min(z['p'] // 2 + 1, 41) // 5 * 5}", "sekunden")].append(
            z["v"] / HUNDERTSTEL
        )

    def _zeitnot(self, z: dict, gruppe: tuple, verlust: float) -> None:
        sekunden = z["u"] / HUNDERTSTEL
        stufe = next(f"{a}-{b}" for a, b in ZEITNOT if a <= sekunden < b)
        schluessel = (gruppe[0], gruppe[1], stufe)
        self.zeitnot.zaehle(schluessel + ("verlust>=1",), verlust >= GROBER_FEHLER)
        self.zeitnot.zaehle(schluessel + ("verlust>=3",), verlust >= PATZER)
        self.zeitnot.zaehle(schluessel + ("verlust>=0.5",), verlust >= MINDESTVERLUST)


def ist_wiederschlag(vorher: dict | None, z: dict) -> bool:
    """Schlägt der Zug auf dem Feld zurück, auf dem der Gegner gerade geschlagen hat?"""
    if vorher is None or vorher["g"] != z["g"] or vorher["p"] != z["p"] - 1:
        return False
    brett = chess.Board(vorher["f"])
    zug = chess.Move.from_uci(vorher["m"])
    if not brett.is_capture(zug):
        return False
    jetzt = chess.Board(z["f"])
    antwort = chess.Move.from_uci(z["m"])
    return antwort.to_square == zug.to_square and jetzt.is_capture(antwort)


def lies(ordner: Path) -> list[dict]:
    zeilen: dict[tuple, dict] = {}
    for datei in sorted(ordner.glob("stellungen-*.jsonl")):
        for text in datei.read_text(encoding="utf-8").splitlines():
            z = json.loads(text)
            zeilen[(z["g"], z["p"])] = z
    return [zeilen[s] for s in sorted(zeilen)]


def zeitverluste(ordner: Path) -> dict[str, dict]:
    """Je Tempo, Band und Zuschlag (mit/ohne): Anteil der Partien, die eine Seite auf Zeit verlor."""
    zaehler = Zaehler()
    for text in (ordner / "partien.jsonl").read_text(encoding="utf-8").splitlines():
        p = json.loads(text)
        zeit = p["ende"] == "Time forfeit"
        verlierer = {"1-0": "schwarz", "0-1": "weiss"}.get(p["ergebnis"])
        for seite in ("weiss", "schwarz"):
            band = band_von(p[seite])
            if band is not None:
                schluessel = (p["tempo"], band, "mit" if p["zuschlag"] else "ohne")
                zaehler.zaehle(schluessel, zeit and verlierer == seite)
    return zaehler.tabelle()


def auswerten(ordner: Path) -> dict:
    a = Auswertung()
    vorher: dict | None = None
    for z in lies(ordner):
        band = band_von(z["w"])
        if band is not None and z["k"]:
            a.stellung(z, (band, z["t"], z["ph"]), ist_wiederschlag(vorher, z))
        vorher = z
    genau: dict[tuple, list[float]] = defaultdict(list)
    for (_, _, band, tempo), werte in a.genauigkeit.items():
        if len(werte) >= 10:
            genau[(band, tempo)].append(sum(werte) / len(werte))
    return {
        "arten": a.arten.tabelle(),
        "flecken": a.flecken.tabelle(),
        "allgemein": a.allgemein.tabelle(),
        "zeitnot": a.zeitnot.tabelle(),
        "zeit": {
            "|".join(str(x) for x in s): {"n": len(w), "median": round(median(w), 4)}
            for s, w in sorted(a.zeit.items(), key=lambda e: str(e[0]))
            if w
        },
        "genauigkeit": {f"{b}|{t}": round(median(w), 1) for (b, t), w in sorted(genau.items())},
        "zeitverluste": zeitverluste(ordner),
    }


def main(argumente: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--ordner", type=Path, default=Path("buch/arbeit/menschenprofil"))
    args = parser.parse_args(argumente)
    tabellen = auswerten(args.ordner)
    (args.ordner / "tabellen.json").write_text(json.dumps(tabellen, indent=1, ensure_ascii=False))
    print({k: len(v) for k, v in tabellen.items()})
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
