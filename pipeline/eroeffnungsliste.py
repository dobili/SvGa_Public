"""Eröffnungsliste von Lichess für das Werkzeug „Eröffnung“ (Vorschlag G, seit 0.2.32).

Aufruf (im Hauptordner des Repositorys):

    python -m pipeline.eroeffnungsliste            # schreibt app/public/daten/de/eroeffnungen-lichess.json

Rolle im Gesamtbild: Das Werkzeug „Eröffnung“ kennt die Eröffnungen des Buches (Kapitel 2 und 3).
Für Stellungen außerhalb des Buches nennt es seit 0.2.32 den Namen aus der freien Liste von
Lichess (``inhalte/lichess/``, gemeinfrei, CC0). Diese Datei spielt jede Zugfolge der Liste nach
und schreibt je Endstellung Schlüssel, ECO und Namen. Der Schlüssel besteht wie im
Eröffnungsindex der App (``app/src/schach/eroeffnungsindex.ts``, ``stellungsschluessel``) aus
Figurenstellung, Zugrecht und Rochaderechten; so findet die App eine Stellung auch nach
Zugumstellung. Den Teil des Namens vor dem Doppelpunkt (die Familie) übersetzt
``inhalte/de/eroeffnungsfamilien.json``; Varianten bleiben englisch (Entscheidung R12).
Führen zwei Zugfolgen zur selben Stellung, gilt der Eintrag, der in der Liste zuerst steht.
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
ZIEL = HAUPTORDNER / "app" / "public" / "daten" / "de" / "eroeffnungen-lichess.json"
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


def lies_liste(ordner: Path, familien: dict[str, str]) -> list[list[str]]:
    """Alle Zeilen der fünf Dateien als [Schlüssel, ECO, Name], je Stellung der erste Eintrag."""
    gesehen: set[str] = set()
    stellungen: list[list[str]] = []
    for datei in DATEIEN:
        with (ordner / datei).open(encoding="utf-8") as tsv:
            for zeile in csv.DictReader(tsv, delimiter="\t"):
                schluessel = stellungsschluessel(endstellung(zeile["pgn"]))
                if schluessel in gesehen:
                    continue
                gesehen.add(schluessel)
                stellungen.append([schluessel, zeile["eco"], deutscher_name(zeile["name"], familien)])
    return stellungen


def baue(ordner: Path = LICHESS, familien_datei: Path = FAMILIEN) -> dict[str, object]:
    """Die Datei für die App, gegen ihr Schema geprüft."""
    familien = json.loads(familien_datei.read_text(encoding="utf-8"))["familien"]
    daten: dict[str, object] = {
        "schemaVersion": 1,
        "quelle": QUELLE,
        "lizenz": LIZENZ,
        "stellungen": lies_liste(ordner, familien),
    }
    jsonschema.validate(daten, json.loads(SCHEMA.read_text(encoding="utf-8")))
    return daten


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--ziel", type=Path, default=ZIEL)
    argumente = parser.parse_args()
    daten = baue()
    text = json.dumps(daten, ensure_ascii=False, separators=(",", ":"))
    argumente.ziel.write_text(text + "\n", encoding="utf-8")
    print(f"Eröffnungsliste nach {argumente.ziel} geschrieben.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
