"""Variantenbaum eines Beispiels: Knoten mit Stellung, Zug, Zugzeichen und Abbildungen.

Wozu diese Datei da ist:
    Ein Beispiel des Buches (Konzept 4.2) ist eine Startstellung mit Hauptvariante und
    Abzweigungen. Jeder Knoten ist eine Stellung nach einem Zug; an Knoten hängen die Abbildungen,
    die genau diese Stellung zeigen. ``nachspielen.py`` baut die Bäume aus den Zugfolgen des
    Textes, ``pgn.py`` schreibt und liest sie.
"""

from __future__ import annotations

from collections.abc import Iterator
from dataclasses import dataclass, field

import chess

from pipeline.lesen.zugfolgen import auf_deutsch


def stellungsschluessel(brett: chess.Board) -> str:
    """Stellung ohne Rochaderecht, En-passant und Zähler: Figuren und Zugseite.

    Warum: Die FEN im Buch tragen bei Ausschnitten manchmal andere Rochaderechte oder Zähler als
    die nachgespielte Partie. Entscheidend ist, dass dieselbe Stellung gezeigt wird; Abweichungen
    bei den Rochaderechten meldet das Nachspielen gesondert.
    """
    return f"{brett.board_fen()} {'w' if brett.turn else 'b'}"


@dataclass
class Knoten:
    """Eine Stellung im Baum, erreicht durch ``zug`` aus der Elternstellung."""

    brett: chess.Board
    zug: chess.Move | None
    san: str  # englische Kurznotation, leer an der Wurzel
    buchtext: str  # Zug wie im Buch, etwa „Sxc7+!“
    zeichen: str  # Zugzeichen wie „!“ oder „??“
    fundstelle: str  # Zugfolge, die den Knoten erzeugt hat
    eltern: Knoten | None = None
    kinder: list[Knoten] = field(default_factory=list)
    abbildungen: list[str] = field(default_factory=list)
    zuletzt: int = 0  # laufende Nummer der letzten Berührung, für die Wahl des Anschlusses

    @property
    def schluessel(self) -> str:
        return stellungsschluessel(self.brett)

    def kind_mit(self, zug: chess.Move) -> Knoten | None:
        return next((k for k in self.kinder if k.zug == zug), None)

    def pfad(self) -> list[str]:
        """Die Züge von der Wurzel bis hierher in Kurznotation."""
        zuege: list[str] = []
        knoten: Knoten | None = self
        while knoten is not None and knoten.zug is not None:
            zuege.append(knoten.san)
            knoten = knoten.eltern
        return list(reversed(zuege))

    def halbzug(self) -> int:
        return len(self.pfad())


@dataclass
class Beispiel:
    """Ein Variantenbaum mit Kennung und Fundort im Buch."""

    id: str
    kapitel: int
    abschnitt: str | None
    titel: str
    wurzel: Knoten
    wurzel_abbildung: str | None = None  # Abbildung, deren Stellung die Wurzel ist

    def knoten(self) -> Iterator[Knoten]:
        """Alle Knoten in Vorordnung (Hauptvariante vor den Abzweigungen)."""
        stapel = [self.wurzel]
        while stapel:
            knoten = stapel.pop()
            yield knoten
            stapel.extend(reversed(knoten.kinder))

    def abbildungen(self) -> list[str]:
        return [nummer for knoten in self.knoten() for nummer in knoten.abbildungen]

    def anzahl_zuege(self) -> int:
        return sum(1 for k in self.knoten() if k.zug is not None)

    def anzahl_abzweigungen(self) -> int:
        return sum(max(0, len(k.kinder) - 1) for k in self.knoten())


def neuer_knoten(eltern: Knoten, zug: chess.Move, buchtext: str, zeichen: str, fundstelle: str) -> Knoten:
    """Hängt einen Zug an einen Knoten an und liefert den neuen Knoten (das Brett wird kopiert)."""
    brett = eltern.brett.copy()
    san = brett.san(zug)
    brett.push(zug)
    kind = Knoten(brett, zug, san, buchtext, zeichen, fundstelle, eltern)
    eltern.kinder.append(kind)
    return kind


def stabile_kennung(beispiel: Beispiel, vergeben: set[str]) -> str:
    """Kennung, die sich nicht verschiebt, wenn ein anderes Beispiel dazukommt oder wegfällt.

    Warum: Laufende Nummern (k10-01, k10-02 …) rückten nach, sobald die Pipeline ein Beispiel
    anders zuordnete; eine freigegebene Datei hätte dann einen fremden Entwurf blockiert.
    Regel: die Abbildung, an der das Beispiel beginnt, sonst seine kleinste Abbildungsnummer
    (Abb. 10.2 → „k10-a2“, Abb. 2.55 → „k02-a55“); ohne Abbildung die ersten drei Züge der
    Hauptlinie in deutscher Notation („k03-z-d4-d5-c4“). Ist die Kennung schon vergeben, folgt
    „-2“, „-3“ usw. Die Kennung wird in ``vergeben`` eingetragen.
    """
    abbildung = beispiel.wurzel_abbildung or min(beispiel.abbildungen(), key=_nummernschluessel, default=None)
    if abbildung is not None:
        grund = f"k{beispiel.kapitel:02d}-a{abbildung.split('.', 1)[-1]}"
    else:
        zuege = [auf_deutsch(k.san) for k in _hauptlinie(beispiel.wurzel)[:_ZUEGE_IN_DER_KENNUNG]]
        grund = f"k{beispiel.kapitel:02d}-z-" + "-".join(_als_kennung(z) for z in zuege)
    kennung, zaehler = grund, 1
    while kennung in vergeben:
        zaehler += 1
        kennung = f"{grund}-{zaehler}"
    vergeben.add(kennung)
    return kennung


_ZUEGE_IN_DER_KENNUNG = 3


def _nummernschluessel(nummer: str) -> tuple[int, ...]:
    """„2.132“ nach „2.55“: Abbildungsnummern als Zahlen vergleichen, nicht als Text."""
    return tuple(int(teil) for teil in nummer.split("."))


def _hauptlinie(wurzel: Knoten) -> list[Knoten]:
    linie, knoten = [], wurzel
    while knoten.kinder:
        knoten = knoten.kinder[0]
        linie.append(knoten)
    return linie


def _als_kennung(zug: str) -> str:
    """„Sxe5+“ → „sxe5“, „O-O“ → „o-o“, „e8=D“ → „e8d“: nur Kleinbuchstaben, Ziffern und „-“."""
    return "".join(z for z in zug.lower() if z.isalnum() or z == "-")
