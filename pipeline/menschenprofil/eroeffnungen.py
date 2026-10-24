"""Häufigste Eröffnungszüge und Eröffnungen je Elo-Band und Zeitklasse aus Lichess-Partien.

Wozu: Plan „Zugwahl der Bots“ (Freigabe des Autors, 23.10.2026): Bots sollen bevorzugt die
Eröffnungen spielen, die Menschen ihrer Stärke spielen, und die Einschränkung „Eröffnung“ für Bots
bekommt diese Varianten. Quelle sind die gesammelten gewerteten Lichess-Partien (offene Datenbank,
CC0) in `buch/arbeit/spielerprofil/spielerpartien.jsonl` und `buch/arbeit/menschenprofil2/
partien.jsonl` (nur lokal). Bullet bleibt außen vor (Entscheidung des Autors, 23.10.2026).

Je Stellung der ersten 16 Halbzüge zählt das Skript je Zeitklasse und Kategorie der ziehenden
Seite, welche Züge Menschen spielen; dazu je Partie die längste benannte Eröffnung der
Lichess-Liste (`inhalte/lichess/*.tsv`). Ausgabe ohne Spielernamen: `eroeffnungsbuch.json`
(Stellung → Zug → Anzahl, nur Stellungen ab MINDEST Partien je Zelle) und `eroeffnungen.json`
(je Zelle die häufigsten benannten Eröffnungen mit Anteil).

Aufruf (im Hauptordner):

    python -m pipeline.menschenprofil.eroeffnungen --ziel buch/arbeit/eroeffnungen
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

import chess

QUELLEN = (
    Path("buch/arbeit/spielerprofil/spielerpartien.jsonl"),
    Path("buch/arbeit/menschenprofil2/partien.jsonl"),
)
LISTE = Path("inhalte/lichess")
KATEGORIEN = (400, 800, 1200, 1600, 2000, 2200, 2400)
OBERGRENZE = 2600
TEMPI = ("blitz", "rapid", "classical")
HALBZUEGE = 16
MINDEST = 20
EROEFFNUNGEN_JE_ZELLE = 40


def kategorie(wertung: int) -> int | None:
    """Kategorie (Untergrenze) einer Wertung, oder None außerhalb von 400 bis 2599. 1234 → 1200."""
    if wertung >= OBERGRENZE:
        return None
    passend = [k for k in KATEGORIEN if wertung >= k]
    return passend[-1] if passend else None


def schluessel(brett: chess.Board) -> str:
    """Stellung ohne Zugzähler (Zugumstellungen zählen zusammen)."""
    return " ".join(brett.fen().split()[:4])


def benannte_eroeffnungen() -> dict[str, tuple[str, str]]:
    """Stellung nach der Zugfolge einer benannten Eröffnung → (ECO, Name)."""
    namen: dict[str, tuple[str, str]] = {}
    for datei in sorted(LISTE.glob("*.tsv")):
        with datei.open(encoding="utf-8") as f:
            for zeile in csv.DictReader(f, delimiter="\t"):
                brett = chess.Board()
                try:
                    for san in zeile["pgn"].split():
                        if not san[0].isdigit():
                            brett.push_san(san)
                except ValueError:
                    continue
                namen[schluessel(brett)] = (zeile["eco"], zeile["name"])
    return namen


def partien():
    """Alle Partien ohne Bullet, jede Kennung einmal."""
    gesehen: set[str] = set()
    for quelle in QUELLEN:
        if not quelle.exists():
            continue
        for zeile in quelle.read_text(encoding="utf-8").splitlines():
            try:
                p = json.loads(zeile)
            except ValueError:
                continue
            if p["tempo"] in TEMPI and p["kennung"] not in gesehen:
                gesehen.add(p["kennung"])
                yield p


def main(argumente: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--ziel", type=Path, default=Path("buch/arbeit/eroeffnungen"))
    args = parser.parse_args(argumente)
    namen = benannte_eroeffnungen()
    buch: dict = defaultdict(lambda: defaultdict(Counter))
    eroeffnung: dict = defaultdict(Counter)
    anzahl: Counter = Counter()
    for p in partien():
        brett = chess.Board()
        letzte = None
        for i, san in enumerate(p["zuege"][:HALBZUEGE]):
            k = kategorie(p["weiss"] if i % 2 == 0 else p["schwarz"])
            vorher = schluessel(brett)
            try:
                brett.push_san(san)
            except ValueError:
                break
            if k is not None:
                buch[f"{p['tempo']}|{k}"][vorher][san] += 1
            letzte = namen.get(schluessel(brett), letzte)
        if letzte:
            for seite in ("weiss", "schwarz"):
                k = kategorie(p[seite])
                if k is not None:
                    eroeffnung[f"{p['tempo']}|{k}"][f"{letzte[0]} {letzte[1]}"] += 1
                    anzahl[f"{p['tempo']}|{k}"] += 1
    args.ziel.mkdir(parents=True, exist_ok=True)
    gefiltert = {
        zelle: {s: dict(z) for s, z in stellungen.items() if sum(z.values()) >= MINDEST}
        for zelle, stellungen in buch.items()
    }
    (args.ziel / "eroeffnungsbuch.json").write_text(json.dumps(gefiltert), encoding="utf-8")
    haeufig = {
        zelle: [
            {"eroeffnung": e, "anteil": round(n / anzahl[zelle], 4)}
            for e, n in c.most_common(EROEFFNUNGEN_JE_ZELLE)
        ]
        for zelle, c in eroeffnung.items()
    }
    (args.ziel / "eroeffnungen.json").write_text(
        json.dumps(haeufig, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    for zelle in sorted(gefiltert):
        print(zelle, len(gefiltert[zelle]), "Stellungen", anzahl[zelle], "Partieseiten")
    return 0


if __name__ == "__main__":
    sys.exit(main())
