"""Stockfish für die Trainerdaten: alle Züge einer Stellung bewerten, Tiefe bis zur Lösung messen.

Wozu diese Datei da ist:
    Dieselbe Engine wie in der App (Stockfish 19 lite, ein Kern, aus dem npm-Paket, unter Node),
    gestartet wie in ``pipeline/zugfolgen/zugzeichen.py``. Jede Suche beginnt als neue Partie,
    damit jeder Lauf dieselben Werte liefert (Konzept 5, Engine-Prüfung).

Werte: Bauerneinheiten aus Sicht der Seite am Zug; ein Matt zählt 100 minus der Züge bis zum Matt
(wie engine/spielbewerter.ts in der App), ein Matt gegen sich entsprechend negativ.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import chess
import chess.engine

HAUPTORDNER = Path(__file__).resolve().parents[2]
ENGINE_DATEI = HAUPTORDNER / "app" / "node_modules" / "stockfish" / "bin" / "stockfish-19-lite-single.js"
MATTWERT = 100.0
HASH_MB = 16


@dataclass(frozen=True)
class Zugwert:
    """Ein Zug mit seinem Wert aus Sicht der Seite am Zug."""

    zug: chess.Move
    san: str  # englische Kurznotation
    wert: float  # Bauerneinheiten, Matt als ±(100 − Züge)
    matt: int | None  # Züge bis zum Matt (positiv: eigenes Matt), sonst None
    tiefe: int
    # Die Hauptvariante der Engine ab diesem Zug (er selbst zuerst); seit P4 für die Widerlegung
    # einer Falle (falle.py), ohne weitere Suchen je Halbzug.
    linie: tuple[chess.Move, ...] = ()


def bauern(wert: chess.engine.PovScore) -> float:
    """Wert aus Sicht der Seite am Zug in Bauerneinheiten (Matt als großer Wert)."""
    relativ = wert.relative
    matt = relativ.mate()
    if matt is not None:
        return (MATTWERT - abs(matt)) if matt > 0 else -(MATTWERT - abs(matt))
    return (relativ.score() or 0) / 100


def engine_vorhanden() -> bool:
    """Liegt die Engine vor (``cd app && npm ci``)? Tests ohne Engine überspringen sich."""
    return ENGINE_DATEI.exists()


class Engine:
    """Hält Stockfish offen; ``schliesse()`` nicht vergessen (oder als Kontext nutzen)."""

    def __init__(self, engine_datei: Path = ENGINE_DATEI) -> None:
        self.engine = chess.engine.SimpleEngine.popen_uci(["node", str(engine_datei)])
        self.engine.configure({"Hash": HASH_MB})

    def __enter__(self) -> Engine:
        return self

    def __exit__(self, *_: object) -> None:
        self.schliesse()

    def schliesse(self) -> None:
        self.engine.quit()

    def alle_zuege(
        self, brett: chess.Board, tiefe: int, nur: list[chess.Move] | None = None
    ) -> list[Zugwert]:
        """Jeder legale Zug mit Wert, bester zuerst (MultiPV über alle Züge, oder nur ``nur``).

        Beispiel: Übung 7.44 (Weiß am Zug) → [Te7+ (−2,1), Tg1+ (Matt in 2 gegen Weiß), …].
        Sonderfall: ohne legalen Zug (Matt, Patt) leere Liste.
        """
        zuege = list(brett.legal_moves) if nur is None else nur
        if not zuege:
            return []
        infos = self.engine.analyse(
            brett,
            chess.engine.Limit(depth=tiefe),
            multipv=len(zuege),
            root_moves=zuege,
            game=object(),
        )
        werte = [_zugwert(brett, info) for info in infos if info.get("pv")]
        return sorted(werte, key=lambda z: z.wert, reverse=True)

    def bester(self, brett: chess.Board, tiefe: int) -> Zugwert | None:
        """Der beste Zug mit Wert; None ohne legalen Zug."""
        if not any(brett.legal_moves):
            return None
        info = self.engine.analyse(brett, chess.engine.Limit(depth=tiefe), game=object())
        return _zugwert(brett, info) if info.get("pv") else None

    def tiefe_bis_loesung(self, brett: chess.Board, zug: chess.Move, hoechsttiefe: int) -> int | None:
        """Ab welcher Suchtiefe die Engine den Zug für den besten hält und dabei bleibt.

        Warum: Ein Maß für die Schwierigkeit einer Aufgabe, unabhängig vom Gerät. Ein Zug, den
        schon Tiefe 1 findet (eine hängende Figur schlagen), ist leicht; einer, der erst bei
        Tiefe 12 auftaucht (stilles Opfer), schwer. Ausgabe: kleinste Tiefe, ab der bis zur
        Höchsttiefe durchgehend dieser Zug vorn liegt; None, wenn er am Ende nicht vorn liegt.
        """
        beste_je_tiefe: dict[int, chess.Move] = {}
        with self.engine.analysis(brett, chess.engine.Limit(depth=hoechsttiefe), game=object()) as lauf:
            for info in lauf:
                pv = info.get("pv")
                tiefe = info.get("depth")
                if pv and tiefe is not None and info.get("multipv", 1) == 1:
                    beste_je_tiefe[tiefe] = pv[0]
        if not beste_je_tiefe or beste_je_tiefe[max(beste_je_tiefe)] != zug:
            return None
        stabil_ab = max(beste_je_tiefe)
        for tiefe in sorted(beste_je_tiefe, reverse=True):
            if beste_je_tiefe[tiefe] != zug:
                break
            stabil_ab = tiefe
        return stabil_ab


def _zugwert(brett: chess.Board, info: chess.engine.InfoDict) -> Zugwert:
    pv = tuple(info["pv"])
    zug = pv[0]
    wert = info["score"]
    return Zugwert(
        zug, brett.san(zug), bauern(wert), wert.relative.mate(), int(info.get("depth", 0)), pv
    )
