"""Zusatzaufgaben aus der Lichess-Puzzle-Datenbank (CC0) je Buchthema → ``app/public/daten/``.

Wozu diese Datei da ist:
    Wunsch des Autors (30.10.2026): „Eine Auswahl Lichess-Aufgaben je Thema deines Buches als
    ‚Zusatzaufgaben (nicht aus dem Buch)‘ im Taktiktrainer, offline, etwa 1000 Stück nach Wertung
    gestaffelt.“ Der Taktiktrainer mischt schon 637 Lichess-Aufgaben unter die Buchaufgaben
    (lichess.py, taktik.py); diese Auswahl ist ein eigener, klar gekennzeichneter Vorrat mit mehr
    Themen (auch hängende Figur, Matt in 1 und 2, stiller Zug, Zugzwang) und ohne Engine-Lauf.

Auswahl:
    - sichere Wertung (Abweichung höchstens 80), oft gespielt (ab 300 Partien), beliebt (ab 80),
      Wertung 600 bis 2200 (Leser bis etwa 2000 Elo), höchstens vier eigene Züge;
    - je Thema (THEMEN) und Stufe (Stufengrenzen wie im Taktiktrainer, schwierigkeit.py) die
      beliebtesten zehn, bei Gleichstand die öfter gespielten; reicht eine Stufe nicht, füllen die
      übrigen Stufen auf. Jede Aufgabe kommt nur einmal vor, auch nicht doppelt zum Taktiktrainer;
    - Motivthemen nur, wenn unter den Lichess-Themen genau ein Motiv steht (die Aufgabe übt das
      Motiv sauber); Matt- und Mattbildthemen ohne diese Bedingung.

Format: Die Lichess-Stellung (vor dem Zug des Gegners) und die Züge in UCI wie in der Datenbank:
der erste ist der Gegnerzug, den die App vorspielt, danach kommt die Lösung. Die Partie-Adresse
bleibt weg (Auftrag: klein halten). Die Rohdaten (300 MB) bleiben lokal.

Aufruf (im Hauptordner):
    python -m pipeline.trainer.zusatzaufgaben --datenbank PFAD/lichess_db_puzzle.csv.zst
"""

from __future__ import annotations

import argparse
import csv
import io
import json
from collections.abc import Iterable
from dataclasses import dataclass
from datetime import date
from pathlib import Path

import chess

from pipeline.trainer.daten import HAUPTORDNER, TRAINERORDNER
from pipeline.trainer.schwierigkeit import STUFENGRENZEN, stufe_von_wertung

ZIELDATEI = HAUPTORDNER / "app" / "public" / "daten" / "zusatzaufgaben.json"
SCHEMAVERSION = 1
HOECHSTE_ABWEICHUNG = 80
MINDESTENS_PARTIEN = 300
MINDESTENS_BELIEBTHEIT = 80
NIEDRIGSTE_WERTUNG = 600
HOECHSTE_WERTUNG = 2200
HOECHSTENS_EIGENE_ZUEGE = 4
JE_STUFE = 10
STUFEN = tuple(range(1, len(STUFENGRENZEN) + 2))


@dataclass(frozen=True)
class Thema:
    """Ein Thema des Buches und die Lichess-Themen dazu (englische Namen, CC0)."""

    kennung: str
    lichess: tuple[str, ...]
    motivthema: bool  # True: nur Aufgaben mit genau einem Motiv unter den Themen


# Zuordnung Lichess-Thema → Thema des Buches, mit Fundstelle im Buch (Glossar):
THEMEN: tuple[Thema, ...] = (
    Thema("haengend", ("hangingPiece",), True),  # Kapitel 1, „Hängen“: angegriffen und ungedeckt
    Thema("doppelangriff", ("fork",), True),  # Kapitel 1 und 7, „Gabel“, Abschnitt 7.2
    Thema("fesselung", ("pin",), True),  # Kapitel 7, „Fesselung“
    Thema("spiess", ("skewer",), True),  # Kapitel 7, „Spieß“
    Thema("abzug", ("discoveredAttack", "discoveredCheck"), True),  # Kapitel 2 und 7, „Abzugsschach“
    Thema("doppelschach", ("doubleCheck",), True),  # Kapitel 7, „Doppelschach“
    Thema("hinlenkung", ("attraction",), True),  # Kapitel 7, „Hinlenkung“ (Köder)
    Thema("raeumung", ("clearance",), True),  # Kapitel 7, „Räumung“, Abschnitt 7.2
    Thema("beseitigung", ("capturingDefender",), True),  # Kapitel 7, „Beseitigung der Verteidigung“
    Thema("ablenkung", ("deflection",), True),  # Kapitel 4 und 7, „Ablenkung“, Abschnitt 7.2
    Thema("zwischenzug", ("intermezzo",), True),  # Kapitel 4 und 7, „Zwischenzug“
    Thema("gefangen", ("trappedPiece",), True),  # Kapitel 7, „Gefangene Figur“
    Thema("umwandlung", ("promotion", "underPromotion"), True),  # Kapitel 0 und 7, „Umwandlung“
    Thema("wegversperrung", ("interference",), True),  # Kapitel 10, „Wegversperrung“, Abschnitt 10.4
    Thema("stillerzug", ("quietMove",), True),  # Kapitel 10, „Stiller Zug“, Abschnitt 10.1
    Thema("zugzwang", ("zugzwang",), True),  # Kapitel 8, „Zugzwang“, Abschnitt 8.2
    Thema("grundreihenmatt", ("backRankMate",), False),  # Kapitel 5 und 7, „Grundreihenmatt“
    # Kapitel 4 und 7, Abschnitt 7.4 „Mattbilder“: Erstickungs-, Anastasia-, Arabisches, Boden-Matt
    Thema("mattbilder", ("smotheredMate", "anastasiaMate", "arabianMate", "bodenMate"), False),
    Thema("matt1", ("mateIn1",), False),  # Kapitel 0, „Matt“
    Thema("matt2", ("mateIn2",), False),  # Kapitel 0 und 7, Matt in zwei Zügen
)
MOTIVTHEMEN = frozenset(t for thema in THEMEN if thema.motivthema for t in thema.lichess)


@dataclass(frozen=True)
class Kandidat:
    """Eine passende Zeile der Datenbank."""

    kennung: str
    fen: str
    zuege: str
    wertung: int
    beliebtheit: int
    partien: int
    themen: frozenset[str]


def ist_legal(fen: str, zuege: str) -> bool:
    """True, wenn alle Züge (UCI) ab der Stellung legal sind und es mindestens zwei sind."""
    liste = zuege.split()
    if len(liste) < 2:
        return False
    try:
        brett = chess.Board(fen)
        for uci in liste:
            zug = chess.Move.from_uci(uci)
            if zug not in brett.legal_moves:
                return False
            brett.push(zug)
    except ValueError:
        return False
    return True


def lies_zeile(zeile: dict[str, str]) -> Kandidat | None:
    """Ein Kandidat aus einer Zeile der Datenbank; None, wenn die Zeile nicht passt."""
    try:
        wertung, abweichung = int(zeile["Rating"]), int(zeile["RatingDeviation"])
        beliebt, partien = int(zeile["Popularity"]), int(zeile["NbPlays"])
    except (KeyError, ValueError):
        return None
    if abweichung > HOECHSTE_ABWEICHUNG or partien < MINDESTENS_PARTIEN or beliebt < MINDESTENS_BELIEBTHEIT:
        return None
    if not NIEDRIGSTE_WERTUNG <= wertung <= HOECHSTE_WERTUNG:
        return None
    zuege = zeile.get("Moves", "")
    # Erster Zug: Gegner; danach eigene und gegnerische Züge im Wechsel.
    eigene = len(zuege.split()) // 2
    if eigene < 1 or eigene > HOECHSTENS_EIGENE_ZUEGE:
        return None
    themen = frozenset(zeile["Themes"].split())
    return Kandidat(zeile["PuzzleId"], zeile["FEN"], zuege, wertung, beliebt, partien, themen)


def passt(kandidat: Kandidat, thema: Thema) -> bool:
    """Gehört der Kandidat zum Thema? Motivthemen nur mit genau einem Motiv unter den Themen."""
    if not kandidat.themen & set(thema.lichess):
        return False
    if not thema.motivthema:
        return True
    return kandidat.themen & MOTIVTHEMEN <= set(thema.lichess)


def ziel(themen: frozenset[str]) -> str:
    """matt, rettung (Lichess „equality“: aus schlechterer Lage zum Ausgleich) oder gewinn."""
    if "mate" in themen:
        return "matt"
    return "rettung" if "equality" in themen else "gewinn"


def waehle(kandidaten: Iterable[Kandidat], ausgeschlossen: set[str], je_stufe: int = JE_STUFE) -> list[dict]:
    """Je Thema und Stufe die beliebtesten ``je_stufe`` Aufgaben, jede nur einmal.

    Reicht eine Stufe nicht, füllen die übrigen Stufen bis ``je_stufe`` mal Stufenzahl auf.
    """
    rangfolge = sorted(kandidaten, key=lambda k: (-k.beliebtheit, -k.partien, k.kennung))
    vergeben = set(ausgeschlossen)
    auswahl: list[dict] = []
    for thema in THEMEN:
        passende = [k for k in rangfolge if passt(k, thema) and k.kennung not in vergeben]
        gewaehlt: list[Kandidat] = []
        for stufe in STUFEN:
            gewaehlt += [k for k in passende if stufe_von_wertung(k.wertung) == stufe][:je_stufe]
        rest = [k for k in passende if k not in gewaehlt]
        gewaehlt += rest[: je_stufe * len(STUFEN) - len(gewaehlt)]
        for k in sorted(gewaehlt, key=lambda k: (k.wertung, k.kennung)):
            vergeben.add(k.kennung)
            eintrag = {"id": k.kennung, "fen": k.fen, "zuege": k.zuege, "wertung": k.wertung}
            auswahl.append({**eintrag, "thema": thema.kennung, "ziel": ziel(k.themen)})
    return auswahl


def lies_datenbank(pfad: Path) -> list[Kandidat]:
    """Alle passenden, legalen Zeilen der gepackten Datenbank (Streaming, einige Minuten)."""
    import zstandard

    passende: list[Kandidat] = []
    with pfad.open("rb") as roh:
        text = io.TextIOWrapper(zstandard.ZstdDecompressor().stream_reader(roh), encoding="utf-8")
        for zeile in csv.DictReader(text):
            kandidat = lies_zeile(zeile)
            if kandidat is None or not any(passt(kandidat, t) for t in THEMEN):
                continue
            if ist_legal(kandidat.fen, kandidat.zuege):
                passende.append(kandidat)
    return passende


def schon_im_trainer() -> set[str]:
    """Lichess-Kennungen, die Taktiktrainer, „Falle oder Köder“ und Endspieltrainer schon haben."""
    kennungen: set[str] = set()
    for pfad in TRAINERORDNER.glob("*.json"):
        for aufgabe in json.loads(pfad.read_text(encoding="utf-8")).get("aufgaben", []):
            puzzle = aufgabe.get("herkunft", {}).get("puzzle")
            if puzzle:
                kennungen.add(puzzle)
    return kennungen


def als_text(aufgaben: list[dict]) -> str:
    """Die Datei: Kopf eingerückt, je Aufgabe eine Zeile (kleine Datei, lesbare Unterschiede)."""
    kopf = {
        "schemaVersion": SCHEMAVERSION,
        "erzeugt": date.today().isoformat(),
        "quelle": {
            "name": "Lichess-Puzzle-Datenbank",
            "lizenz": "CC0 1.0",
            "adresse": "https://database.lichess.org/#puzzles",
        },
    }
    zeilen = ",\n".join("  " + json.dumps(a, ensure_ascii=False) for a in aufgaben)
    kopftext = json.dumps(kopf, ensure_ascii=False)[:-1]
    return f'{kopftext}, "aufgaben": [\n{zeilen}\n]}}\n'


def main() -> None:
    teiler = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teiler.add_argument("--datenbank", type=Path, required=True, help="lichess_db_puzzle.csv.zst")
    teiler.add_argument("--ziel", type=Path, default=ZIELDATEI)
    teiler.add_argument("--je-stufe", type=int, default=JE_STUFE)
    argumente = teiler.parse_args()
    aufgaben = waehle(lies_datenbank(argumente.datenbank), schon_im_trainer(), argumente.je_stufe)
    argumente.ziel.write_text(als_text(aufgaben), encoding="utf-8")
    print(f"{len(aufgaben)} Zusatzaufgaben → {argumente.ziel}")


if __name__ == "__main__":
    main()
