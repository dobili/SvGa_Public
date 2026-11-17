"""Prüft die Startstellungen der kurzen Partieformen des Schach-Abenteuers mit der Engine.

Warum: Ein Stellungsduell, ein Endspiel oder „Vorteil herausarbeiten“ ist nur fair, wenn die
Startstellung zum Ziel passt (Regelwerk R13 bis R13c, docs/spiel/06_Regelwerk.md). Die App rechnet
den Startvorteil nicht zur Laufzeit; diese Prüfung bewertet jede vorgemerkte Stellung einmal mit
derselben Engine wie die App (Stockfish 19 lite, pipeline/trainer/engine.py) und meldet, was aus
dem Fenster fällt.

Fenster aus Sicht des Lesers, der am Zug ist (Bauerneinheiten, Tiefe 12):

- ``stellungsduell``: +0,8 bis +2,5 und kein Matt in drei oder weniger (R13).
- ``vorteil``: −0,5 bis +0,5 (R13b, ausgeglichene Stellung).
- ``endspiel``, Ziel Sieg: +1,5 bis +8 ohne kurzes Matt (R13a, gewinnbar, nicht geschenkt).
- ``endspiel``, Ziel Remis: −1,5 bis +0,3 (R13a, haltbar, aber nicht bequem).

Die Bretter einer Simultanvorstellung (partieformen.json) folgen eigenen Regeln und sind ausgenommen.
Bei „Eröffnung fremd“ (Startstellung ``eroeffnung``) müssen die Züge legal sein; ist der Leser
nicht am Zug, wird aus Sicht der Seite am Zug geprüft und das Vorzeichen gedreht.

Aufruf: ``python -m pipeline.abenteuer.kurzformate`` (braucht ``cd app && npm ci``); Rückgabe 1 bei
Funden. Abbildungen liest es aus den Buchdaten der App (app/public/daten/de/a1/kapNN.json).
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from pathlib import Path

import chess

HAUPTORDNER = Path(__file__).resolve().parents[2]
BEGEGNUNGEN = HAUPTORDNER / "inhalte" / "abenteuer" / "begegnungen.json"
BUCHDATEN = HAUPTORDNER / "app" / "public" / "daten" / "de" / "a1"
TIEFE = 12
KURZES_MATT = 3
# Spielraum der Engine: Dieselbe Stellung schwankt zwischen Läufen um einige Hundertstel.
TOLERANZ = 0.1
PARTIEFORMEN = HAUPTORDNER / "inhalte" / "abenteuer" / "partieformen.json"
# Fenster je Format (unten, oben) aus Sicht des Lesers.
FENSTER = {
    "stellungsduell": (0.8, 2.5),
    "vorteil": (-0.5, 0.5),
    ("endspiel", "sieg"): (1.5, 8.0),
    ("endspiel", "remis"): (-1.5, 0.3),
}


@dataclass(frozen=True)
class Fund:
    """Eine Begegnung, deren Startstellung nicht zum Format passt."""

    kennung: str
    text: str


def fen_der_abbildung(nummer: str) -> str | None:
    """FEN einer Buchabbildung aus den Buchdaten der App. Beispiel: „8.27“ → FEN aus kap08.json."""
    kapitel = int(nummer.split(".")[0])
    datei = BUCHDATEN / f"kap{kapitel:02d}.json"
    if not datei.exists():
        return None
    for abbildung in json.loads(datei.read_text(encoding="utf-8"))["abbildungen"]:
        if abbildung["id"] == nummer:
            return abbildung["fen"]
    return None


def startbrett(startstellung: dict) -> chess.Board | None:
    """Brett der Startstellung; None, wenn sie sich nicht auflösen lässt (Meisterpartie, Fehler)."""
    art = startstellung["art"]
    if art == "fen":
        return chess.Board(startstellung["fen"])
    if art == "abbildung":
        fen = fen_der_abbildung(startstellung["nummer"])
        return chess.Board(fen) if fen else None
    if art == "eroeffnung":
        brett = chess.Board()
        for san in startstellung["zuege"]:
            brett.push_san(san)
        return brett
    return None


def fenster(format_: dict) -> tuple[float, float] | None:
    """Das Fenster eines Formats; None für ganze Partien."""
    if format_["art"] == "endspiel":
        return FENSTER[("endspiel", format_["ziel"])]
    return FENSTER.get(format_["art"])


def leserwert(wert: float, brett: chess.Board, farbe: str) -> float:
    """Wert aus Sicht der Seite am Zug in den Wert aus Sicht des Lesers („zufall“: Seite am Zug)."""
    leser_am_zug = farbe == "zufall" or (farbe == "white") == brett.turn
    return wert if leser_am_zug else -wert


def pruefe_begegnung(begegnung: dict, bewerte) -> Fund | None:
    """Prüft eine Begegnung; ``bewerte(brett) -> (wert, matt)`` aus Sicht der Seite am Zug."""
    grenzen = fenster(begegnung["format"])
    eroeffnung = begegnung["startstellung"]["art"] == "eroeffnung"
    if grenzen is None and not eroeffnung:
        return None
    try:
        brett = startbrett(begegnung["startstellung"])
    except ValueError as fehler:
        return Fund(begegnung["kennung"], f"Startstellung nicht spielbar: {fehler}")
    if brett is None or grenzen is None:
        return None
    wert, matt = bewerte(brett)
    wert = leserwert(wert, brett, begegnung["farbe"])
    if matt is not None and 0 < matt <= KURZES_MATT:
        return Fund(begegnung["kennung"], f"Matt in {matt}: zu leicht")
    unten, oben = grenzen
    if not unten - TOLERANZ <= wert <= oben + TOLERANZ:
        return Fund(begegnung["kennung"], f"Bewertung {wert:+.2f} außerhalb {unten:+.1f} bis {oben:+.1f}")
    return None


def simultanbretter() -> set[str]:
    """Begegnungen der Simultanvorstellungen (partieformen.json): eigene Regel, hier nicht geprüft."""
    daten = json.loads(PARTIEFORMEN.read_text(encoding="utf-8"))
    return {b for s in daten.get("simultan", []) for b in s["begegnungen"]}


def pruefe_alle(begegnungen: list[dict], bewerte) -> list[Fund]:
    """Alle Funde in der Reihenfolge der Daten; Simultanbretter zählen nicht (eigene Regel)."""
    ausgenommen = simultanbretter()
    return [f for b in begegnungen if b["kennung"] not in ausgenommen and (f := pruefe_begegnung(b, bewerte))]


def main() -> int:
    """Liest die Begegnungen, bewertet und meldet; Rückgabe 1 bei Funden."""
    argparse.ArgumentParser(description=__doc__.splitlines()[0]).parse_args()
    from pipeline.trainer.engine import Engine

    begegnungen = json.loads(BEGEGNUNGEN.read_text(encoding="utf-8"))["begegnungen"]
    with Engine() as engine:

        def bewerte(brett: chess.Board) -> tuple[float, int | None]:
            zug = engine.bester(brett, TIEFE)
            return (zug.wert, zug.matt) if zug else (0.0, None)

        funde = pruefe_alle(begegnungen, bewerte)
    for fund in funde:
        print(f"{fund.kennung}: {fund.text}")
    print(f"{len(funde)} Funde")
    return 1 if funde else 0


if __name__ == "__main__":
    sys.exit(main())
