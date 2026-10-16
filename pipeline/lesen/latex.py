"""Grundwerkzeuge zum Lesen der LaTeX-Quellen des Buches.

Wozu diese Datei da ist:
    Die Kapitel des Buches sind LaTeX-Dateien. Diese Datei stellt die kleinen
    Bausteine bereit, mit denen die Pipeline darin liest: Kommentare entfernen,
    Klammerinhalte sicher auslesen (auch verschachtelt) und Zeilennummern
    bestimmen, damit jeder Befund auf eine Fundstelle zeigt.

Rolle im Gesamtbild:
    Schritt 1 „Lesen“ der Pipeline (Konzept Abschnitt 5). ``diagramme.py`` baut
    darauf auf und findet die Diagrammbefehle, ``text.py`` wandelt Bildunterschriften.

Bewusst nicht enthalten:
    Ein vollständiger LaTeX-Parser. Das Buch nutzt einen festen, kleinen Satz eigener
    Befehle (preamble.tex). Die Pipeline versteht genau diese und meldet alles
    Unbekannte als Befund, statt zu raten.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

# Ein Prozentzeichen beginnt einen Kommentar, außer es ist mit \ maskiert (\%).
_KOMMENTAR = re.compile(r"(?<!\\)%.*")


class LatexFehler(ValueError):
    """Die Quelle ist an einer Stelle nicht so aufgebaut wie erwartet."""

    def __init__(self, meldung: str, position: int) -> None:
        super().__init__(meldung)
        self.position = position


def entferne_kommentare(quelltext: str) -> str:
    """Entfernt LaTeX-Kommentare, lässt aber jede Zeile an ihrem Platz.

    Warum zeilenweise: Die Zeilennummern der Befunde sollen auf die Originaldatei
    zeigen. Deshalb wird nur der Kommentar abgeschnitten, der Zeilenumbruch bleibt.

    Beispiel: ``"Text % Notiz\\nweiter"`` wird zu ``"Text \\nweiter"``.
    """
    return "\n".join(_KOMMENTAR.sub("", zeile) for zeile in quelltext.split("\n"))


def zeile_von(quelltext: str, position: int) -> int:
    """Liefert die Zeilennummer (ab 1) zu einer Zeichenposition."""
    return quelltext.count("\n", 0, position) + 1


def lies_gruppe(quelltext: str, position: int, auf: str = "{", zu: str = "}") -> tuple[str, int]:
    """Liest den Inhalt einer Klammergruppe ab ``position``.

    Eingabe: Quelltext und die Position der öffnenden Klammer (Leerraum davor
    wird übersprungen).
    Ausgabe: der Inhalt ohne die äußeren Klammern und die Position direkt danach.

    Verschachtelte geschweifte Klammern werden mitgezählt. Bei eckigen Klammern
    (optionales Argument) zählen nur eckige Klammern außerhalb geschweifter
    Gruppen, damit eine Bildunterschrift wie ``[Abb. 1.1: {[}Text{]}]`` nicht
    zu früh endet.

    Beispiel: ``lies_gruppe("{a{b}c}d", 0)`` liefert ``("a{b}c", 7)``.
    """
    position = _ueberspringe_leerraum(quelltext, position)
    if position >= len(quelltext) or quelltext[position] != auf:
        raise LatexFehler(f"„{auf}“ erwartet", position)
    tiefe_eigen = 0
    tiefe_geschweift = 0
    start = position + 1
    index = position
    while index < len(quelltext):
        zeichen = quelltext[index]
        if zeichen == "\\":
            index += 2  # maskiertes Zeichen wie \{ oder \] überspringen
            continue
        if auf == "[":
            if zeichen == "{":
                tiefe_geschweift += 1
            elif zeichen == "}":
                tiefe_geschweift -= 1
        if tiefe_geschweift == 0 or auf == "{":
            if zeichen == auf:
                tiefe_eigen += 1
            elif zeichen == zu:
                tiefe_eigen -= 1
                if tiefe_eigen == 0:
                    return quelltext[start:index], index + 1
        index += 1
    raise LatexFehler(f"„{zu}“ fehlt", position)


def lies_optionales_argument(quelltext: str, position: int) -> tuple[str | None, int]:
    """Liest ``[...]``, falls vorhanden; sonst ``None`` und die unveränderte Position."""
    naechste = _ueberspringe_leerraum(quelltext, position)
    if naechste < len(quelltext) and quelltext[naechste] == "[":
        return lies_gruppe(quelltext, naechste, "[", "]")
    return None, position


def lies_argumente(quelltext: str, position: int, anzahl: int) -> tuple[list[str], int]:
    """Liest ``anzahl`` Pflichtargumente ``{...}`` hintereinander."""
    argumente: list[str] = []
    for _ in range(anzahl):
        inhalt, position = lies_gruppe(quelltext, position)
        argumente.append(inhalt)
    return argumente, position


def _ueberspringe_leerraum(quelltext: str, position: int) -> int:
    while position < len(quelltext) and quelltext[position] in " \t\r\n":
        position += 1
    return position


@dataclass(frozen=True)
class Treffer:
    """Ein gefundener Befehl mit Position im Quelltext."""

    name: str
    start: int
    ende_name: int


def finde_befehle(quelltext: str, namen: list[str]) -> list[Treffer]:
    """Findet alle Vorkommen der genannten Befehle, in der Reihenfolge des Textes.

    Ein Befehl zählt nur als ganzes Wort: ``\\diagrammschritt`` passt nicht auf
    ``\\diagrammschritttaktik``. Deshalb darf hinter dem Namen kein Buchstabe folgen.
    """
    muster = re.compile(r"\\(" + "|".join(map(re.escape, namen)) + r")(?![A-Za-z])")
    return [Treffer(m.group(1), m.start(), m.end()) for m in muster.finditer(quelltext)]
