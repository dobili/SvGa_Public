"""Buchquellen für „Falle oder Köder“: Fallenchecks (Kapitel 4) und Schläge mit „?“ (Kapitel 2, 3).

Wozu diese Datei da ist:
    Seit P4 (R50) braucht jede Aufgabe den Köder-Zug: den Zug des Gegners, der das Material
    anbietet (Abb. 4.18: 6. Sxe5!! bietet die Dame an; Klammerfalle: 5. axb5 stellt den Bauern
    hin). Dieses Modul läuft die Zugfolgen des Buches entlang und liefert zu jedem Schlag mit
    Fragezeichen die Stellung davor, den Köder-Zug, den Schlag und die Fortsetzung des Buches
    (die Widerlegung). Das Engine-Urteil fällt falle.py.
    Regel: Kapitel 4, Fallencheck („Wer tappt in die Falle? Mit welchem Zug?“).
"""

from __future__ import annotations

import sys
from dataclasses import dataclass
from pathlib import Path

import chess

from pipeline.trainer.daten import DATENORDNER, lies_json

FORTSETZUNG_HALBZUEGE = 6
EROEFFNUNGSKAPITEL = ("kap02", "kap03")


@dataclass(frozen=True)
class Buchangebot:
    """Ein Schlag mit Fragezeichen aus einer Zugfolge des Buches, mit dem Köder-Zug davor."""

    vorher: chess.Board  # Stellung vor dem Köder-Zug (der Gegner des Lesers ist am Zug)
    vorzug: chess.Move
    brett: chess.Board  # Stellung nach dem Köder-Zug (der Leser ist am Zug)
    schlag: chess.Move
    buchlinie: list[str]  # Schlag und Fortsetzung des Buches (die Widerlegung), englisch
    abbildung: str
    beispiel: str
    fallencheck: str | None = None


def _buchlinie(knoten: dict) -> list[str]:
    """Der Zug des Knotens und die Hauptvariante dahinter, höchstens sechs Halbzüge."""
    linie = [knoten["zug"]]
    weiter = knoten["weiter"]
    while weiter and len(linie) < FORTSETZUNG_HALBZUEGE:
        linie.append(weiter[0]["zug"])
        weiter = weiter[0]["weiter"]
    return linie


def _knoten_entlang(zuege: list[dict], pfad: list[str]) -> list[dict] | None:
    """Die Knoten entlang eines Pfads vom Anfang der Zugfolge; None, wenn der Pfad nicht passt."""
    knoten: list[dict] = []
    aktuell = zuege
    for zug in pfad:
        naechster = next((k for k in aktuell if k["zug"] == zug), None)
        if naechster is None:
            return None
        knoten.append(naechster)
        aktuell = naechster["weiter"]
    return knoten


def erster_schlag_mit_fragezeichen(
    beispiel: dict, pfad: list[str], abbildung: str, fallencheck: str
) -> Buchangebot | None:
    """Folgt der Hauptvariante ab dem Stopp-Knoten bis zum ersten Schlag mit „?“.

    Der Köder-Zug ist der Zug unmittelbar davor, auch wenn er noch vor dem Stopp liegt (Klammer-
    falle: Stopp nach 5. axb5, der Schlag 5... cxb5 ist der erste Zug danach). Ohne Zug davor
    (der Schlag ist der erste Zug der Zugfolge) None.
    """
    entlang = _knoten_entlang(beispiel["zuege"], pfad)
    if entlang is None:
        return None
    brett = chess.Board(beispiel["startFen"])
    vorher: tuple[chess.Board, chess.Move] | None = None
    for knoten in entlang:
        zug = brett.parse_san(knoten["zug"])
        vorher = (brett.copy(), zug)
        brett.push(zug)
    aktuell = entlang[-1]["weiter"] if entlang else beispiel["zuege"]
    while aktuell:
        knoten = aktuell[0]
        zug = brett.parse_san(knoten["zug"])
        if "?" in knoten["zeichen"] and brett.is_capture(zug):
            if vorher is None:
                return None
            return Buchangebot(
                vorher[0],
                vorher[1],
                brett.copy(),
                zug,
                _buchlinie(knoten),
                abbildung,
                beispiel["id"],
                fallencheck,
            )
        vorher = (brett.copy(), zug)
        brett.push(zug)
        aktuell = knoten["weiter"]
    return None


def alle_schlaege_mit_fragezeichen(beispiel: dict) -> list[Buchangebot]:
    """Alle Schläge mit „?“ in einer Zugfolge (alle Äste), je mit dem Zug davor als Köder-Zug.

    Die Abbildung ist die letzte vor dem Schlag in diesem Ast, sonst die erste des Beispiels
    oder „“. Beispiel: k03-a28 (Schottisches Gambit): 7... Sxd4?? nach 7. Sxe5, Abb. 3.33.
    """
    funde: list[Buchangebot] = []
    erste = next(iter(beispiel.get("abbildungen", [])), "")

    def lauf(
        knoten: list[dict], brett: chess.Board, abbildung: str, vorher: tuple[chess.Board, chess.Move] | None
    ) -> None:
        for k in knoten:
            zug = brett.parse_san(k["zug"])
            hier = k["abbildungen"][0] if k["abbildungen"] else abbildung
            if "?" in k["zeichen"] and brett.is_capture(zug) and vorher is not None:
                funde.append(
                    Buchangebot(vorher[0], vorher[1], brett.copy(), zug, _buchlinie(k), hier, beispiel["id"])
                )
            kopie = brett.copy()
            kopie.push(zug)
            lauf(k["weiter"], kopie, hier, (brett.copy(), zug))

    lauf(beispiel["zuege"], chess.Board(beispiel["startFen"]), erste, None)
    return funde


def angebote_der_fallenchecks(datenordner: Path = DATENORDNER) -> list[Buchangebot]:
    """Die Fallenchecks aus Kapitel 4, deren Zugfolge einen Schlag mit Fragezeichen enthält."""
    daten = lies_json(datenordner / "kap04.json")
    abbildungen = {a["id"]: a for a in daten["abbildungen"]}
    beispiele = {b["id"]: b for b in daten["beispiele"]}
    angebote = []
    for check in daten["fallenchecks"]:
        abbildung = abbildungen.get(check["stopp"])
        verweis = (abbildung or {}).get("beispiel")
        if not abbildung or not verweis or verweis["id"] not in beispiele:
            continue
        gefunden = erster_schlag_mit_fragezeichen(
            beispiele[verweis["id"]], verweis["pfad"], abbildung["id"], check["name"]
        )
        if gefunden is None:
            print(
                f"Fallencheck „{check['name']}“: kein Schlag mit Fragezeichen (mit Zug davor)",
                file=sys.stderr,
            )
            continue
        angebote.append(gefunden)
    return angebote


def angebote_der_eroeffnungen(datenordner: Path = DATENORDNER) -> list[Buchangebot]:
    """Alle Schläge mit „?“ in den Zugfolgen der Kapitel 2 und 3 (alle Äste)."""
    angebote = []
    for kapitel in EROEFFNUNGSKAPITEL:
        daten = lies_json(datenordner / f"{kapitel}.json")
        for beispiel in daten["beispiele"]:
            angebote.extend(alle_schlaege_mit_fragezeichen(beispiel))
    return angebote
