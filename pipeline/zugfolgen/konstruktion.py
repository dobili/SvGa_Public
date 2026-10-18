"""Konstruierte Partien: von der Grundstellung genau zur Stellung einer Abbildung.

Wozu diese Datei da ist:
    Entscheidung des Autors (18.10.2026): Zu jeder Abbildung ohne Zugfolge im Buch, die aus einer
    realistischen Partie erwachsen kann, baut Claude eine Partie ab der Grundstellung. Beide Seiten
    sollen vernünftig spielen. Das Buch bleibt die einzige Quelle (Regel 1): Die Partien heißen
    „konstruiert“ und tragen in der App einen deutlichen Hinweis (``pipeline/zugfolgen/pgn.py``).

Verfahren (Strahlsuche mit Engine-Filter):
    Ab einer gängigen Eröffnung wird Halbzug für Halbzug erweitert. Zur Wahl stehen die besten
    Züge der Engine und die Züge, die dem Ziel am nächsten kommen (``zielabstand.py``). Ein Zug
    bleibt nur, wenn er höchstens ``grenze`` Prozentpunkte Gewinnwahrscheinlichkeit verschenkt
    (Lichess-Formel wie in app/src/spiel/genauigkeit.ts). Ausnahme: Verlangt das Ziel, dass eine
    Seite Material ohne Gegenwert hergibt, darf sie einen Zug mit größerem Verlust spielen, wenn
    die beste Antwort schlägt (das geplante Zugeständnis). Von allen Kindern bleiben die
    ``breite`` mit dem kleinsten Abstand; je Bauernstruktur höchstens ``je_struktur``, damit nicht
    alle Kandidaten an derselben irreversiblen Entscheidung hängen.

Ausgabe:
    Die Züge, der Verlust je Zug und die Eröffnung. Die endgültige Genauigkeit rechnet der
    Messlauf der App (Tiefe 18, app/src/spiel/konstruiert.messung.ts) nach.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field

import chess
import chess.engine

from pipeline.zugfolgen.pgn import genauer_schluessel
from pipeline.zugfolgen.zielabstand import Abstand, abstand

# Lichess: Gewinnwahrscheinlichkeit aus Centibauern (app/src/spiel/genauigkeit.ts, STEILHEIT).
STEILHEIT = 0.00368208
MATTWERT = 10_000
PROZENT_HALB = 50


@dataclass(frozen=True)
class Einstellung:
    """Stellschrauben der Suche (gemessen an den Abbildungen der Kapitel 8 und 9)."""

    breite: int = 12
    naechste: int = 6
    beste: int = 8
    tiefe: int = 10
    grenze: float = 4.0
    zugestaendnis: float = 40.0
    hoechstens: int = 220
    je_struktur: int = 3


def gewinnchance(wert: chess.engine.PovScore, farbe: chess.Color) -> float:
    """Gewinnwahrscheinlichkeit in Prozent aus Sicht von ``farbe`` (Matt als großer Wert)."""
    cp = wert.pov(farbe).score(mate_score=MATTWERT)
    return PROZENT_HALB + PROZENT_HALB * (2 / (1 + math.exp(-STEILHEIT * cp)) - 1)


@dataclass(frozen=True)
class Zugurteil:
    """Ein geprüfter Zug: Verlust in Prozentpunkten und ob die beste Antwort schlägt."""

    zug: chess.Move
    verlust: float
    antwort_schlaegt: bool


class Pruefer:
    """Bewertet Züge mit einer UCI-Engine und merkt sich Stellungen (Zugumstellungen)."""

    def __init__(self, motor: chess.engine.SimpleEngine, einstellung: Einstellung) -> None:
        self.motor = motor
        self.einstellung = einstellung
        self._beste: dict[str, float] = {}
        self._urteile: dict[str, dict[chess.Move, Zugurteil]] = {}

    def urteile(self, brett: chess.Board, zusaetzlich: list[chess.Move]) -> dict[chess.Move, Zugurteil]:
        """Urteile über die besten Züge der Engine und die zusätzlich genannten Züge.

        Der Verlust zählt gegen den besten Zug der ersten Suche (Mehrfachvarianten).
        """
        fen = brett.fen()
        grenze = chess.engine.Limit(depth=self.einstellung.tiefe)
        if fen not in self._beste:
            zeilen = self.motor.analyse(brett, grenze, multipv=self.einstellung.beste)
            self._beste[fen] = gewinnchance(zeilen[0]["score"], brett.turn)
            self._urteile[fen] = self._lies(brett, zeilen)
        bekannt = self._urteile[fen]
        offen = [z for z in zusaetzlich if z not in bekannt]
        if offen:
            zeilen = self.motor.analyse(brett, grenze, multipv=len(offen), root_moves=offen)
            bekannt.update(self._lies(brett, zeilen))
        return bekannt

    def _lies(self, brett: chess.Board, zeilen: list[chess.engine.InfoDict]) -> dict[chess.Move, Zugurteil]:
        bestwert = self._beste[brett.fen()]
        ergebnis = {}
        for zeile in zeilen:
            pv = zeile.get("pv") or []
            if not pv:
                continue
            verlust = max(0.0, bestwert - gewinnchance(zeile["score"], brett.turn))
            schlaegt = len(pv) > 1 and _schlaegt(brett, pv[0], pv[1])
            ergebnis[pv[0]] = Zugurteil(pv[0], verlust, schlaegt)
        return ergebnis


def _schlaegt(brett: chess.Board, zug: chess.Move, antwort: chess.Move) -> bool:
    danach = brett.copy(stack=False)
    danach.push(zug)
    return danach.is_capture(antwort)


@dataclass
class Knoten:
    """Ein Stand der Suche: Brett, Abstand zum Ziel und Summe der Verluste je Seite."""

    brett: chess.Board
    abstand: Abstand
    verluste: list[float] = field(default_factory=list)

    def rang(self, ziel: chess.Board) -> tuple[int, float]:
        """Kleiner ist besser: Abstand und falsches Zugrecht, dann die Summe der Verluste."""
        zugrecht = 0 if self.brett.turn == ziel.turn else 1
        return (self.abstand.summe + zugrecht, sum(self.verluste))


@dataclass
class Ergebnis:
    """Eine gefundene Partie: Züge ab der Grundstellung und Verlust je Halbzug."""

    zuege: list[chess.Move]
    verluste: list[float]
    eroeffnung: str


# Ein Zugeständnis erst, wenn der Gegner höchstens noch so viel Überzähliges hat (Bauerneinheiten):
# vorher lässt sich die Überzahl gleichwertig tauschen.
SPAETES_ZUGESTAENDNIS = 3


def erlaubt(urteil: Zugurteil, abstand_vorher: Abstand, farbe: chess.Color, einstellung: Einstellung) -> bool:
    """Darf der Zug gespielt werden? Gute Züge immer, ein Zugeständnis nur spät und mit Schlag.

    Ein Zugeständnis ist ein Zug, der mehr als ``grenze`` verschenkt. Es ist nur erlaubt, wenn
    das Ziel verlangt, dass diese Seite Material ohne Gegenwert hergibt, der Gegner kaum noch
    Überzähliges zum Tauschen hat und die beste Antwort schlägt.
    Beispiel: Für Abb. 5.29 (Weiß a2, b2, c2 gegen b7, c7) gibt Schwarz im Bauernendspiel seinen
    letzten überzähligen Bauern her, Weiß schlägt ihn.
    """
    if urteil.verlust <= einstellung.grenze:
        return True
    spaet = abstand_vorher.ueberschuss(not farbe) <= SPAETES_ZUGESTAENDNIS
    return (
        abstand_vorher.abzugeben(farbe) > 0
        and spaet
        and urteil.antwort_schlaegt
        and urteil.verlust <= einstellung.zugestaendnis
    )


def kinder(knoten: Knoten, ziel: chess.Board, pruefer: Pruefer, gesehen: set[str]) -> list[Knoten]:
    """Alle erlaubten Folgestellungen eines Knotens (beste Züge der Engine und die zielnächsten)."""
    brett = knoten.brett
    nahe = sorted(brett.legal_moves, key=lambda z: _abstand_nach(brett, z, ziel).summe)
    urteile = pruefer.urteile(brett, nahe[: pruefer.einstellung.naechste])
    ergebnis = []
    ziel_schluessel = genauer_schluessel(ziel)
    for zug, urteil in urteile.items():
        if not brett.is_legal(zug):
            continue
        kind = brett.copy()
        kind.push(zug)
        schluessel = genauer_schluessel(kind)
        # Der Zug, der die Abbildung erreicht, gilt immer: Verlangt sie einen Fehler (Patt aus
        # gewonnener Stellung, Abb. 0.11 und 8.7), ist er gewollt.
        gut = schluessel == ziel_schluessel or erlaubt(
            urteil, knoten.abstand, brett.turn, pruefer.einstellung
        )
        if not gut or schluessel in gesehen:
            continue
        ergebnis.append(Knoten(kind, abstand(kind, ziel), [*knoten.verluste, urteil.verlust]))
    return ergebnis


def _abstand_nach(brett: chess.Board, zug: chess.Move, ziel: chess.Board) -> Abstand:
    brett.push(zug)
    try:
        return abstand(brett, ziel)
    finally:
        brett.pop()


def waehle(
    kandidaten: list[Knoten], ziel: chess.Board, einstellung: Einstellung, gesehen: set[str]
) -> list[Knoten]:
    """Die besten Kandidaten, je Bauernstruktur höchstens ``je_struktur`` (Vielfalt im Strahl)."""
    strahl: list[Knoten] = []
    je_struktur: dict[int, int] = {}
    for knoten in sorted(kandidaten, key=lambda k: k.rang(ziel)):
        schluessel = genauer_schluessel(knoten.brett)
        struktur = int(knoten.brett.pawns)
        if schluessel in gesehen or je_struktur.get(struktur, 0) >= einstellung.je_struktur:
            continue
        gesehen.add(schluessel)
        je_struktur[struktur] = je_struktur.get(struktur, 0) + 1
        strahl.append(knoten)
        if len(strahl) >= einstellung.breite:
            break
    return strahl


def suche(ziel_fen: str, eroeffnung: str, start: list[str], pruefer: Pruefer) -> Ergebnis | None:
    """Sucht eine Partie ab der Grundstellung (nach den Zügen ``start``), die das Ziel exakt erreicht.

    Ausgabe: die Partie oder None, wenn der Strahl leer läuft oder die Höchstzahl der Halbzüge
    erreicht ist.
    Beispiel: suche(FEN von Abb. 8.25, "Spanisch", ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6"], …).
    """
    ziel = chess.Board(ziel_fen)
    ziel_schluessel = genauer_schluessel(ziel)
    brett = chess.Board()
    for san in start:
        brett.push_san(san)
    if genauer_schluessel(brett) == ziel_schluessel:  # von Hand vorgegebene Partie (Mittelspiele)
        return Ergebnis(list(brett.move_stack), [0.0] * len(start), eroeffnung)
    gesehen = {genauer_schluessel(brett)}
    strahl = [Knoten(brett, abstand(brett, ziel), [0.0] * len(start))]
    for _ in range(pruefer.einstellung.hoechstens - len(start)):
        alle = [k for knoten in strahl for k in kinder(knoten, ziel, pruefer, gesehen)]
        treffer = [k for k in alle if genauer_schluessel(k.brett) == ziel_schluessel]
        if treffer:
            beste = min(treffer, key=lambda k: sum(k.verluste))
            return Ergebnis(list(beste.brett.move_stack), beste.verluste, eroeffnung)
        strahl = waehle(alle, ziel, pruefer.einstellung, gesehen)
        if not strahl:
            return None
    return None
