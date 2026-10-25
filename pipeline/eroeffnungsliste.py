"""Eröffnungsliste von Lichess für das Werkzeug „Eröffnung“ (Vorschlag G, seit 0.2.32).

Aufruf (im Hauptordner des Repositorys):

    python -m pipeline.eroeffnungsliste   # schreibt app/public/daten/{de,en}/eroeffnungen-lichess.json

Rolle im Gesamtbild: Das Werkzeug „Eröffnung“ kennt die Eröffnungen des Buches (Kapitel 2 und 3).
Für Stellungen außerhalb des Buches nennt es seit 0.2.32 den Namen aus der freien Liste von
Lichess (``inhalte/lichess/``, gemeinfrei, CC0). Diese Datei spielt jede Zugfolge der Liste nach
und schreibt je Endstellung Schlüssel, ECO und Namen. Der Schlüssel besteht wie im
Eröffnungsindex der App (``app/src/schach/eroeffnungsindex.ts``, ``stellungsschluessel``) aus
Figurenstellung, Zugrecht und Rochaderechten; so findet die App eine Stellung auch nach
Zugumstellung. Den Teil des Namens vor dem Doppelpunkt (die Familie) übersetzt
``inhalte/de/eroeffnungsfamilien.json``; Varianten bleiben englisch (Entscheidung R12).
Führen zwei Zugfolgen zur selben Stellung, gilt der Eintrag, der in der Liste zuerst steht.
Seit R25 (P6-Abschluss, 24.10.2026) gibt es die Liste auch englisch: mit den Namen von Lichess,
ohne Übersetzung (``app/public/daten/en/``).
Seit dem Theoriezug (Wunsch des Autors, 25.10.2026, Schema-Version 2) steht je Eintrag auch die
Zugfolge (englische Kurznotation ohne Zugnummern, durch Leerzeichen getrennt). Die App baut daraus
den Theoriebaum (``app/src/schach/theorie.ts``): Theorie sind alle Stellungen auf diesen Zugfolgen,
auch die unbenannten Zwischenstellungen, und der Rückblick nennt die Eröffnungen, deren Zugfolge
durch eine Stellung führt.
"""

from __future__ import annotations

import argparse
import csv
import io
import json
from pathlib import Path

import chess
import chess.pgn
import jsonschema

HAUPTORDNER = Path(__file__).resolve().parent.parent
LICHESS = HAUPTORDNER / "inhalte" / "lichess"
FAMILIEN = HAUPTORDNER / "inhalte" / "de" / "eroeffnungsfamilien.json"
DATEN = HAUPTORDNER / "app" / "public" / "daten"
ZIELNAME = "eroeffnungen-lichess.json"
SPRACHEN = ("de", "en")
SCHEMA = HAUPTORDNER / "schemas" / "eroeffnungsliste.schema.json"
DATEIEN = ("a.tsv", "b.tsv", "c.tsv", "d.tsv", "e.tsv")
# Figurenstellung, Zugrecht, Rochaderechte (wie SCHLUESSELFELDER in der App).
SCHLUESSELFELDER = 3
QUELLE = "Lichess, freie Eröffnungsliste (https://github.com/lichess-org/chess-openings)"
LIZENZ = "gemeinfrei, CC0 1.0 (https://creativecommons.org/publicdomain/zero/1.0/)"


def stellungsschluessel(brett: chess.Board) -> str:
    """Schlüssel einer Stellung wie in der App: „rnbqkbnr/… w KQkq“."""
    return " ".join(brett.fen().split()[:SCHLUESSELFELDER])


def deutscher_name(name: str, familien: dict[str, str]) -> str:
    """Übersetzt die Familie vor dem Doppelpunkt; Beispiel: „Sicilian Defense: Najdorf Variation“
    → „Sizilianische Verteidigung: Najdorf Variation“. Unbekannte Familien bleiben englisch."""
    familie, trenner, rest = name.partition(":")
    return familien.get(familie.strip(), familie.strip()) + (trenner + rest if trenner else "")


def endstellung(pgn: str) -> chess.Board:
    """Spielt die Zugfolge einer Zeile nach; ein ungültiger Zug bricht mit ValueError ab."""
    spiel = chess.pgn.read_game(io.StringIO(pgn))
    if spiel is None or spiel.errors:
        raise ValueError(f"Zugfolge nicht lesbar: {pgn}")
    return spiel.end().board()


def zugfolge(brett: chess.Board) -> str:
    """Die Züge bis zur Stellung in englischer Kurznotation ohne Zugnummern.

    Beispiel: nach „1. e4 e5 2. Nf3 Nc6 3. Bb5“ → „e4 e5 Nf3 Nc6 Bb5“ (so liest die App sie mit
    chessops; Zugnummern bräuchte sie nicht).
    """
    nachspiel = chess.Board()
    zuege: list[str] = []
    for zug in brett.move_stack:
        zuege.append(nachspiel.san(zug))
        nachspiel.push(zug)
    return " ".join(zuege)


def lies_liste(ordner: Path, familien: dict[str, str] | None) -> list[list[str]]:
    """Alle Zeilen der fünf Dateien als [Schlüssel, ECO, Name, Zugfolge], je Stellung der erste.

    Ohne ``familien`` (englische Liste) bleiben die Namen, wie Lichess sie schreibt.
    """
    gesehen: set[str] = set()
    stellungen: list[list[str]] = []
    for datei in DATEIEN:
        with (ordner / datei).open(encoding="utf-8") as tsv:
            for zeile in csv.DictReader(tsv, delimiter="\t"):
                brett = endstellung(zeile["pgn"])
                schluessel = stellungsschluessel(brett)
                if schluessel in gesehen:
                    continue
                gesehen.add(schluessel)
                name = zeile["name"] if familien is None else deutscher_name(zeile["name"], familien)
                stellungen.append([schluessel, zeile["eco"], name, zugfolge(brett)])
    return stellungen


def baue(ordner: Path = LICHESS, familien_datei: Path = FAMILIEN, sprache: str = "de") -> dict[str, object]:
    """Die Datei für die App in einer Sprache, gegen ihr Schema geprüft."""
    familien = json.loads(familien_datei.read_text(encoding="utf-8"))["familien"] if sprache == "de" else None
    daten: dict[str, object] = {
        "schemaVersion": 2,
        "quelle": QUELLE,
        "lizenz": LIZENZ,
        "stellungen": lies_liste(ordner, familien),
    }
    jsonschema.validate(daten, json.loads(SCHEMA.read_text(encoding="utf-8")))
    return daten


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--daten", type=Path, default=DATEN, help="Ordner app/public/daten")
    argumente = parser.parse_args()
    for sprache in SPRACHEN:
        ziel = argumente.daten / sprache / ZIELNAME
        ziel.parent.mkdir(parents=True, exist_ok=True)
        text = json.dumps(baue(sprache=sprache), ensure_ascii=False, separators=(",", ":"))
        ziel.write_text(text + "\n", encoding="utf-8")
        print(f"Eröffnungsliste nach {ziel} geschrieben.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
