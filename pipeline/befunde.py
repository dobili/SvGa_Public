"""Befunde: alles, was die Pipeline dem Autor melden will.

Wozu diese Datei da ist:
    Die Pipeline ändert nie stillschweigend etwas an den Buchdaten (CLAUDE.md, Regel 1).
    Was ihr auffällt, wird ein Befund mit Fundstelle. Der Bericht (Schritt 9) listet
    alle Befunde nach Kapitel, damit der Autor sie im LaTeX prüfen kann.

Schwere:
    FEHLER    Daten wären falsch oder unvollständig. Der Bau bricht ab.
    WARNUNG   Wahrscheinlich ein Problem im Buch, die Daten sind aber erzeugbar.
    HINWEIS   Zur Kenntnis, etwa ein Diagrammbefehl ohne Bildunterschrift.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class Schwere(str, Enum):
    FEHLER = "fehler"
    WARNUNG = "warnung"
    HINWEIS = "hinweis"


@dataclass(frozen=True)
class Befund:
    """Ein einzelner Befund.

    ``kennung`` ist ein kurzer, fester Name der Prüfung (etwa ``zugseite``), damit
    gleiche Befunde im Bericht zusammenstehen und Tests sie gezielt prüfen können.
    ``fundstelle`` ist Datei und Zeile, ``abbildung`` die Abbildungsnummer, falls bekannt.
    """

    schwere: Schwere
    kennung: str
    text: str
    fundstelle: str
    abbildung: str | None = None

    def mit_abbildung(self, nummer: str) -> Befund:
        return Befund(self.schwere, self.kennung, self.text, self.fundstelle, nummer)
