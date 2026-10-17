"""Deutsche Kurznotation des Buches in Züge wandeln („1. Te7+!“, „4... Sf6“, „16. Db8+!! Sxb8 17. Td8#“).

Wozu diese Datei da ist:
    Die Lösungen der Übungen (``inhalte/de/texte/loesungen-kapNN.json``, Feld „loesung“ und
    „akzeptiert“) stehen so, wie der Autor sie schreibt: deutsche Figurenbuchstaben, Zugnummern,
    Zugzeichen, „++“ für Doppelschach. Die Engine braucht Züge auf einem Brett.

Abhängigkeiten: python-chess, pipeline.lesen.zugfolgen (Figurenbuchstaben).
"""

from __future__ import annotations

import re

import chess

from pipeline.lesen.zugfolgen import FIGURENBUCHSTABEN, auf_deutsch

_ZUGNUMMER = re.compile(r"^\d+\.(\.\.)?$")
_ZEICHEN = re.compile(r"[!?]+$")


def san_auf_englisch(zug: str) -> str:
    """Ein einzelner Zug des Buches in englischer Kurznotation ohne Zugzeichen.

    Beispiel: „Sxc7+!“ → „Nxc7+“, „e8=D“ → „e8=Q“, „Sh6++“ → „Nh6+“, „O-O“ bleibt.
    """
    zug = _ZEICHEN.sub("", zug.strip()).replace("++", "+")
    return "".join(
        FIGURENBUCHSTABEN.get(z, z) if i == 0 or zug[i - 1] == "=" else z for i, z in enumerate(zug)
    )


def zuege_aus_text(text: str) -> list[str]:
    """Alle Züge einer Lösungsangabe, englisch, ohne Zugnummern und Zugzeichen.

    Beispiel: „1. Sf7+ Kg8 2. Sh6++ Kh8 3. Dg8+!! Txg8 4. Sf7#“ →
    [„Nf7+“, „Kg8“, „Nh6+“, „Kh8“, „Qg8+“, „Rxg8“, „Nf7#“].
    Sonderfall: Leerer Text oder nur Zugnummern → leere Liste.
    """
    zuege: list[str] = []
    for wort in text.replace("…", "...").split():
        if _ZUGNUMMER.match(wort):
            continue
        # „1...Kf6“ ohne Leerzeichen: Nummer und Zug trennen.
        rest = re.sub(r"^\d+\.(\.\.)?", "", wort)
        if rest:
            zuege.append(san_auf_englisch(rest))
    return zuege


def spiele_linie(brett: chess.Board, zuege: list[str]) -> list[chess.Move] | None:
    """Spielt die Züge auf einer Kopie nach; None, wenn ein Zug in der Stellung nicht geht."""
    kopie = brett.copy()
    gespielt: list[chess.Move] = []
    for san in zuege:
        try:
            zug = kopie.parse_san(san)
        except ValueError:
            return None
        gespielt.append(zug)
        kopie.push(zug)
    return gespielt


def erster_zug(brett: chess.Board, text: str | None) -> chess.Move | None:
    """Der erste Zug einer Lösungsangabe auf dem Brett, oder None (keine Zugaufgabe, unlesbar)."""
    if not text:
        return None
    zuege = zuege_aus_text(text)
    linie = spiele_linie(brett, zuege[:1])
    return linie[0] if linie else None


def deutsch(brett: chess.Board, zug: chess.Move) -> str:
    """Ein Zug in der deutschen Kurznotation des Buches, mit Schach- und Mattzeichen."""
    return auf_deutsch(brett.san(zug))
