"""Freie Endspielaufgaben für den Endspieltrainer aus der Lichess-Puzzle-Datenbank (CC0; P4, R47).

Wozu diese Datei da ist:
    Die 79 Buchstellungen reichen für den Trainer, aber nicht für viele Runden; der Autor
    wünscht kuratierte freie Aufgaben dazu. Lichess führt Endspielaufgaben nach Figurenart
    (pawnEndgame, rookEndgame, queenEndgame, bishopEndgame, knightEndgame) mit einer Wertung aus
    echten Lösungsversuchen. Der Leser spielt sie wie die Buchstellungen gegen die Engine aus:
    Gewinnaufgaben (die Lösung gewinnt klar) und Remisaufgaben (Thema „equality“: die Lösung
    rettet aus schlechterer Stellung das Remis). Kuratiert heißt hier: höchstens acht Steine,
    genau eine Figurenart, von der Engine bestätigt (Tiefe 18: Gewinn ab +2,0 oder Matt, Remis
    bis ±0,8), und nicht trivial (mindestens ein Zug des Lesers verfehlt das Ziel, Tiefe 12).
    Je Thema, Stufe (Lichess-Wertung) und Ziel eine feste Zahl, zufällig mit festem Startwert.
"""

from __future__ import annotations

import json
import pickle
import random
import sys
from pathlib import Path

import chess

from pipeline.trainer.daten import HAUPTORDNER
from pipeline.trainer.engine import Engine
from pipeline.trainer.lichess import ENDSPIEL_THEMEN, REMIS_THEMA, Puzzle
from pipeline.trainer.schwierigkeit import stufe_von_wertung

TEILORDNER = HAUPTORDNER / "buch" / "arbeit" / "endspiel"
THEMA_JE_LICHESS = {
    "pawnEndgame": "bauernendspiel",
    "rookEndgame": "turmendspiel",
    "queenEndgame": "damenendspiel",
    "bishopEndgame": "leichtfiguren",
    "knightEndgame": "leichtfiguren",
}
THEMEN = ("bauernendspiel", "turmendspiel", "damenendspiel", "leichtfiguren")
ZIELE = ("gewinn", "remis")
STUFEN = (1, 2, 3, 4, 5)
HOECHSTENS_STEINE = 8
JE_GRUPPE = 5
KANDIDATENFAKTOR = 4
STARTWERT = 20261023
TIEFE = 18
TIEFE_FEHLZUEGE = 12
GEWINN_AB = 2.0
REMIS_BIS = 0.8
# Spielraum wie in der App (training/endspieltrainer.ts): erst darunter ist das Ziel verfehlt.
SPIELRAUM_GEWINN = 0.5
SPIELRAUM_REMIS = 0.7

Gruppe = tuple[str, int, str]  # Thema, Stufe, Ziel


def thema_von(themen: tuple[str, ...]) -> str | None:
    """Das Thema der App aus den Lichess-Themen, wenn genau eine Figurenart dabei ist."""
    arten = {t for t in themen if t in ENDSPIEL_THEMEN}
    if len(arten) != 1:
        return None
    return THEMA_JE_LICHESS[next(iter(arten))]


def kandidaten(
    puzzles: list[Puzzle], je_gruppe: int, startwert: int = STARTWERT
) -> dict[Gruppe, list[Puzzle]]:
    """Kandidaten je Gruppe (Thema, Stufe, Ziel): wenige Steine, eine Figurenart, zufällig gemischt."""
    zufall = random.Random(startwert)
    gruppen: dict[Gruppe, list[Puzzle]] = {}
    for p in sorted(puzzles, key=lambda p: p.kennung):
        thema = thema_von(p.themen)
        if thema is None:
            continue
        brett = chess.Board(p.fen)
        if len(brett.piece_map()) > HOECHSTENS_STEINE or brett.is_check():
            continue
        ziel = "remis" if REMIS_THEMA in p.themen else "gewinn"
        gruppen.setdefault((thema, stufe_von_wertung(p.wertung), ziel), []).append(p)
    for schluessel in sorted(gruppen):
        zufall.shuffle(gruppen[schluessel])
        gruppen[schluessel] = gruppen[schluessel][: je_gruppe * KANDIDATENFAKTOR]
    return gruppen


def verfehlt(ziel: str, wert: float) -> bool:
    """Verfehlt ein Zug mit diesem Wert (Sicht des Lesers) das Ziel, mit dem Spielraum der App?"""
    if ziel == "gewinn":
        return wert < GEWINN_AB - SPIELRAUM_GEWINN
    return wert < -(REMIS_BIS + SPIELRAUM_REMIS)


def pruefe(engine: Engine, p: Puzzle, thema: str, stufe: int, ziel: str) -> dict | None:
    """Die Aufgabe, wenn die Engine Ziel und Nichttrivialität bestätigt, sonst None.

    Beispiel: Bauernendspiel, Wertung 1450, Lösung Kd5 → Gewinn +4,2, zwölf von dreizehn Zügen
    verfehlen das Ziel → Aufgabe der Stufe 3.
    """
    brett = chess.Board(p.fen)
    bester = engine.bester(brett, TIEFE)
    if bester is None:
        return None
    gewonnen = bester.wert >= GEWINN_AB or (bester.matt is not None and bester.matt > 0)
    if ziel == "gewinn" and not gewonnen:
        return None
    if ziel == "remis" and abs(bester.wert) > REMIS_BIS:
        return None
    alle = engine.alle_zuege(brett, TIEFE_FEHLZUEGE)
    fehlzuege = [z for z in alle if verfehlt(ziel, z.wert)]
    if not fehlzuege:
        return None
    einziger = len(alle) - len(fehlzuege) <= 1
    return {
        "id": f"endspiel-l-{p.kennung}",
        "fen": p.fen,
        "leser": "w" if brett.turn else "b",
        "ziel": ziel,
        "thema": thema,
        "stichwort": None,
        "schwierigkeit": stufe,
        "herkunft": {
            "quelle": "lichess",
            "puzzle": p.kennung,
            "wertung": p.wertung,
            "partie": p.partie,
            "themen": list(p.themen),
        },
        "pruefung": {
            "wert": round(bester.wert, 2),
            "mattIn": bester.matt if bester.matt is not None and bester.matt > 0 else None,
            "bester": bester.san,
            "einzigerZug": einziger,
            "tiefe": TIEFE,
        },
    }


def alle_gruppen() -> list[Gruppe]:
    return [(thema, stufe, ziel) for thema in THEMEN for stufe in STUFEN for ziel in ZIELE]


def _teil(gruppen: list[Gruppe], teil: str | None) -> list[Gruppe]:
    if teil is None:
        return gruppen
    nummer, anzahl = (int(x) for x in teil.split("/"))
    return [g for i, g in enumerate(gruppen) if i % anzahl == nummer - 1]


def _teildatei(gruppe: Gruppe) -> Path:
    return TEILORDNER / f"{gruppe[0]}-stufe{gruppe[1]}-{gruppe[2]}.json"


def rechne(lichess_pfad: Path, je_gruppe: int, teil: str | None) -> None:
    """Rechnet die Gruppen eines Teils und legt je Gruppe eine Zwischendatei ab (nur lokal)."""
    puzzles: list[Puzzle] = pickle.load(lichess_pfad.open("rb"))
    gruppen = kandidaten(puzzles, je_gruppe)
    TEILORDNER.mkdir(parents=True, exist_ok=True)
    with Engine() as engine:
        for gruppe in _teil(alle_gruppen(), teil):
            thema, stufe, ziel = gruppe
            aufgaben: list[dict] = []
            for p in gruppen.get(gruppe, []):
                if len(aufgaben) >= je_gruppe:
                    break
                aufgabe = pruefe(engine, p, thema, stufe, ziel)
                if aufgabe:
                    aufgaben.append(aufgabe)
                    print(f"Lichess {p.kennung} {thema} {ziel} Stufe {stufe}", file=sys.stderr)
            text = json.dumps(aufgaben, ensure_ascii=False, indent=1)
            _teildatei(gruppe).write_text(text, encoding="utf-8")
            print(f"Gruppe {gruppe}: {len(aufgaben)} Aufgaben", file=sys.stderr)


def aus_teilen() -> list[dict]:
    """Die Lichess-Aufgaben aller Zwischendateien (fehlende Gruppen bleiben leer)."""
    aufgaben: list[dict] = []
    for gruppe in alle_gruppen():
        pfad = _teildatei(gruppe)
        if pfad.exists():
            aufgaben.extend(json.loads(pfad.read_text(encoding="utf-8")))
    return aufgaben
