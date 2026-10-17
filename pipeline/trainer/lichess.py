"""Stichprobe aus der Lichess-Puzzle-Datenbank (CC0) für den Taktiktrainer und „Falle oder Köder“.

Wozu diese Datei da ist:
    Die Buchaufgaben allein reichen nicht für Themenblöcke nach Motiv und Schwierigkeit
    (Pflichtenheft 7, Taktiktrainer: „Buchaufgaben und Zusatzaufgaben“). Die Datenbank
    https://database.lichess.org/lichess_db_puzzle.csv.zst (CC0 1.0, über vier Millionen
    Aufgaben mit Wertung aus Partien echter Spieler) liefert Zusatzaufgaben; ihre Wertung ist
    ein gemessenes Maß für die Schwierigkeit (siehe schwierigkeit.py).

Auswahl: nur Aufgaben mit sicherer Wertung (Abweichung höchstens 80), genug Partien (ab 200),
Beliebtheit ab 70, kurze Lösungen (höchstens drei eigene Züge), und genau ein Motiv aus der
Tabelle des Buches unter den Themen (damit die Aufgabe das Motiv sauber übt). Je Motiv und
Schwierigkeitsstufe eine feste Zahl, zufällig mit festem Startwert, damit der Lauf
wiederholbar ist. Die Datei selbst bleibt lokal (300 MB), nur die Stichprobe kommt ins Repository.

Format der Datenbank (Kopfzeile): PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,
Themes,GameUrl,OpeningTags. Die FEN ist die Stellung vor dem Zug des Gegners; der erste Zug in
„Moves“ ist dieser Gegnerzug, danach kommt die Lösung (UCI).
"""

from __future__ import annotations

import csv
import io
import random
from dataclasses import dataclass
from pathlib import Path

import chess

# Themen von Lichess → Motiv des Buches (Kapitel 7, „Die zwölf Grundmotive“: Doppelangriff und
# Gabel, Fesselung, Spieß, Batterie und Abzug, Doppelschach, Köder/Hinlenkung/Räumung, Beseitigung
# der Verteidigung, Überlastung und Ablenkung, Zwischenzug, gefangene Figur, Umwandlung, Rettung)
# oder ein Mattbild (schach/mattbilder.ts der App).
MOTIV_JE_THEMA: dict[str, str] = {
    "fork": "doppelangriff",
    "pin": "fesselung",
    "skewer": "spiess",
    "discoveredAttack": "abzug",
    "discoveredCheck": "abzug",
    "doubleCheck": "doppelschach",
    "attraction": "hinlenkung",
    "clearance": "hinlenkung",
    "capturingDefender": "beseitigung",
    "deflection": "ueberlastung",
    "intermezzo": "zwischenzug",
    "trappedPiece": "gefangen",
    "promotion": "umwandlung",
    "underPromotion": "umwandlung",
}
# Für „Falle oder Köder“: Aufgaben, in denen Material wirklich zu nehmen ist (Geschenk).
GESCHENK_THEMA = "hangingPiece"
MATTBILD_JE_THEMA: dict[str, str] = {
    "backRankMate": "grundreihe",
    "anastasiaMate": "anastasia",
    "arabianMate": "arabisch",
    "smotheredMate": "erstickung",
    "bodenMate": "boden",
}
HOECHSTE_ABWEICHUNG = 80
MINDESTENS_PARTIEN = 200
MINDESTENS_BELIEBTHEIT = 70
HOECHSTENS_EIGENE_ZUEGE = 3
STARTWERT = 20261016


@dataclass(frozen=True)
class Puzzle:
    kennung: str
    fen: str  # Stellung, in der der Leser am Zug ist (nach dem Gegnerzug)
    loesung: list[str]  # Lösung in englischer Kurznotation, eigene und gegnerische Züge im Wechsel
    wertung: int
    themen: tuple[str, ...]
    motiv: str | None
    mattbild: str | None
    partie: str


def _motiv(themen: set[str]) -> str | None:
    motive = {MOTIV_JE_THEMA[t] for t in themen if t in MOTIV_JE_THEMA}
    return next(iter(motive)) if len(motive) == 1 else None


def _mattbild(themen: set[str]) -> str | None:
    bilder = {MATTBILD_JE_THEMA[t] for t in themen if t in MATTBILD_JE_THEMA}
    return next(iter(bilder)) if len(bilder) == 1 else None


def lies_zeile(zeile: dict[str, str]) -> Puzzle | None:
    """Ein Puzzle aus einer Zeile der Datenbank; None, wenn es nicht in die Auswahl passt."""
    try:
        wertung, abweichung = int(zeile["Rating"]), int(zeile["RatingDeviation"])
        beliebt, partien = int(zeile["Popularity"]), int(zeile["NbPlays"])
    except (KeyError, ValueError):
        return None
    if abweichung > HOECHSTE_ABWEICHUNG or partien < MINDESTENS_PARTIEN or beliebt < MINDESTENS_BELIEBTHEIT:
        return None
    themen = set(zeile["Themes"].split())
    motiv, mattbild = _motiv(themen), _mattbild(themen)
    if motiv is None and mattbild is None and GESCHENK_THEMA not in themen:
        return None
    zuege = zeile["Moves"].split()
    if len(zuege) < 2 or (len(zuege) - 1 + 1) // 2 > HOECHSTENS_EIGENE_ZUEGE:
        return None
    brett = chess.Board(zeile["FEN"])
    try:
        brett.push_uci(zuege[0])
        fen = brett.fen()
        loesung = []
        for uci in zuege[1:]:
            zug = chess.Move.from_uci(uci)
            loesung.append(brett.san(zug))
            brett.push(zug)
    except ValueError:
        return None
    return Puzzle(
        zeile["PuzzleId"], fen, loesung, wertung, tuple(sorted(themen)), motiv, mattbild, zeile["GameUrl"]
    )


def lies_datenbank(pfad: Path) -> list[Puzzle]:
    """Alle passenden Puzzles aus der gepackten Datenbank (Streaming, einige Minuten)."""
    import zstandard

    passende: list[Puzzle] = []
    with pfad.open("rb") as roh:
        text = io.TextIOWrapper(zstandard.ZstdDecompressor().stream_reader(roh), encoding="utf-8")
        for zeile in csv.DictReader(text):
            puzzle = lies_zeile(zeile)
            if puzzle is not None:
                passende.append(puzzle)
    return passende


def stichprobe(
    puzzles: list[Puzzle], je_gruppe: int, stufe_von_wertung, startwert: int = STARTWERT
) -> list[Puzzle]:
    """Je (Motiv oder Mattbild, Stufe) höchstens ``je_gruppe`` Puzzles, zufällig mit festem Startwert."""
    zufall = random.Random(startwert)
    gruppen: dict[tuple[str, int], list[Puzzle]] = {}
    for p in puzzles:
        schluessel = (p.motiv or f"matt:{p.mattbild}", stufe_von_wertung(p.wertung))
        gruppen.setdefault(schluessel, []).append(p)
    auswahl: list[Puzzle] = []
    for schluessel in sorted(gruppen):
        kandidaten = sorted(gruppen[schluessel], key=lambda p: p.kennung)
        zufall.shuffle(kandidaten)
        auswahl.extend(kandidaten[:je_gruppe])
    return auswahl
