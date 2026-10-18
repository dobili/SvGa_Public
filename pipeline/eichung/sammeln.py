"""Sammelt die Eichpartien von chess.com und Lichess (Schritt a der Eichung, Plan vom 18.10.2026).

Aufruf (im Hauptordner des Repositorys):

    python -m pipeline.eichung.sammeln --ziel buch/arbeit/eichung --je-plattform 300
    python -m pipeline.eichung.sammeln --ziel buch/arbeit/eichung --nur lichess --minuten 100

Der Lauf ist fortsetzbar: Partien stehen in ``<ziel>/<plattform>.jsonl``, schon besuchte Spieler in
``<ziel>/besucht-<plattform>.txt`` (beides nur lokal, nie ins Repository). Ein zweiter Aufruf macht
dort weiter. ``--minuten`` beendet den Lauf rechtzeitig (Hintergrundläufe dauern höchstens zwei
Stunden). Am Ende steht je Plattform die Zahl der Partien je Wertungsband.
"""

from __future__ import annotations

import argparse
import random
import sys
import time
from collections.abc import Callable, Iterator
from itertools import islice
from pathlib import Path

from . import chesscom, lichess
from .auswahl import Eichpartie, Zaehlstand, band_von, haenge_an, lies_partien
from .netz import Abfragefehler

PLATTFORMEN = ("chesscom", "lichess")
SEKUNDEN_JE_MINUTE = 60


class Lauf:
    """Zustand eines Laufs für eine Plattform: Zählstand, besuchte Spieler, Zeitgrenze."""

    def __init__(self, ziel: Path, plattform: str, gesamt: int, ende: float) -> None:
        self.partien = ziel / f"{plattform}.jsonl"
        self.besucht_datei = ziel / f"besucht-{plattform}.txt"
        self.stand = Zaehlstand(gesamt, lies_partien(self.partien))
        text = self.besucht_datei.read_text(encoding="utf-8") if self.besucht_datei.exists() else ""
        self.besucht = set(text.split())
        self.ende = ende

    def weiter(self) -> bool:
        return not self.stand.fertig() and time.monotonic() < self.ende

    def merke(self, name: str) -> None:
        self.besucht.add(name)
        with self.besucht_datei.open("a", encoding="utf-8") as datei:
            datei.write(name + "\n")

    def nimm(self, partien: list[Eichpartie]) -> int:
        """Legt die Partien ab, deren Band noch Partien braucht; Ausgabe: wie viele."""
        neu = 0
        for partie in partien:
            if self.stand.braucht(partie.band):
                haenge_an(self.partien, partie)
                self.stand.zaehle(partie.band)
                neu += 1
        return neu


def _sicher(abfrage: Callable[[], list[Eichpartie]], name: str) -> list[Eichpartie]:
    """Eine gescheiterte Abfrage überspringt nur diesen Spieler (mit Meldung)."""
    try:
        return abfrage()
    except Abfragefehler as fehler:
        print(f"  übersprungen ({name}): {fehler}", file=sys.stderr)
        return []


def sammle_chesscom(lauf: Lauf) -> None:
    for name in chesscom.spieler(random.Random(chesscom.STARTWERT)):
        if not lauf.weiter():
            return
        if name in lauf.besucht:
            continue
        lauf.merke(name)
        try:
            wertung = chesscom.schnellschach_wertung(name)
        except Abfragefehler as fehler:
            print(f"  übersprungen ({name}): {fehler}", file=sys.stderr)
            continue
        if wertung is not None and lauf.stand.braucht(band_von(wertung)):
            if lauf.nimm(_sicher(lambda n=name: chesscom.partien_von(n), name)):
                print(lauf.stand.tabelle().replace("\n", " · "), flush=True)


def _buendel(namen: Iterator[str], groesse: int) -> Iterator[list[str]]:
    while buendel := list(islice(namen, groesse)):
        yield buendel


def sammle_lichess(lauf: Lauf) -> None:
    neue = (n for n in lichess.spieler() if n not in lauf.besucht)
    for buendel in _buendel(neue, lichess.JE_ABFRAGE):
        if not lauf.weiter():
            return
        wertungen = lichess.schnellschach_wertungen(buendel)
        for name in buendel:
            lauf.merke(name)
            wertung = wertungen.get(name)
            if not lauf.weiter() or wertung is None or not lauf.stand.braucht(band_von(wertung)):
                continue
            if lauf.nimm(_sicher(lambda n=name: lichess.partien_von(n), name)):
                print(lauf.stand.tabelle().replace("\n", " · "), flush=True)


def main(argumente: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--ziel", type=Path, required=True, help="Ordner für die Rohdaten (lokal)")
    parser.add_argument("--je-plattform", type=int, default=300, help="Partien je Plattform")
    parser.add_argument("--nur", choices=PLATTFORMEN, help="nur eine Plattform")
    parser.add_argument("--minuten", type=float, default=110, help="spätestens dann aufhören")
    a = parser.parse_args(argumente)
    a.ziel.mkdir(parents=True, exist_ok=True)
    ende = time.monotonic() + a.minuten * SEKUNDEN_JE_MINUTE
    for plattform in [a.nur] if a.nur else PLATTFORMEN:
        lauf = Lauf(a.ziel, plattform, a.je_plattform, ende)
        print(f"== {plattform}", flush=True)
        (sammle_chesscom if plattform == "chesscom" else sammle_lichess)(lauf)
        print(f"{plattform}, Partien je Wertungsband:\n{lauf.stand.tabelle()}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
