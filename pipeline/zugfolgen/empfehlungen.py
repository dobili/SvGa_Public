"""Von Hand gepflegte Notizen zur Freigabe: Einschätzungen zu Befunden und Empfehlungen.

Wozu diese Datei da ist:
    Die Pipeline findet; Claude prüft von Hand und schreibt sein Urteil in zwei Dateien, die die
    Prüfhilfe (``freigabe.py``) beim passenden Befund oder Beispiel anzeigt:

    - ``inhalte/de/einschaetzungen.json``: je Befund Urteil, Begründung, Vorschlag
    - ``inhalte/de/empfehlungen.json``: je Beispiel eine Empfehlung (zusammenführen, getrennt
      lassen, Vorlauf übernehmen, aufteilen, verwerfen) und für die Abbildungen ohne Zugfolge eine
      Einordnung (Lehrbild, Mattbild, Endspiel-Lehrstellung …) mit Vorschlag

    Beide nennen keine Buchsätze, nur Züge, Nummern und Kennungen (Repository wird öffentlich).
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path

from pipeline.befunde import Befund


@dataclass(frozen=True)
class Einschaetzung:
    """Von Hand geprüfte Einschätzung zu einem Befund, mit Korrekturvorschlag für das Buch.

    Ein Befund passt, wenn Datei und Kennung gleich sind und sein Text ``enthaelt`` enthält.
    Zeilennummern fehlen absichtlich: Sie verschieben sich, sobald das Buch geändert wird.
    """

    datei: str
    kennung: str
    enthaelt: str
    urteil: str  # „Buchfehler“, „kein Buchfehler“, „Ermessen des Autors“, „Entscheidung des Autors“
    begruendung: str
    vorschlag: str

    def passt(self, befund: Befund) -> bool:
        return (
            befund.fundstelle.partition(":")[0] == self.datei
            and befund.kennung == self.kennung
            and self.enthaelt in befund.text
        )


def lies_einschaetzungen(pfad: Path) -> list[Einschaetzung]:
    """Liest ``inhalte/de/einschaetzungen.json``; fehlt die Datei, gibt es keine Einschätzungen."""
    if not pfad.exists():
        return []
    daten = json.loads(pfad.read_text(encoding="utf-8"))
    return [Einschaetzung(**eintrag) for eintrag in daten["einschaetzungen"]]


@dataclass(frozen=True)
class Beispielempfehlung:
    """Was mit einem Beispiel geschehen soll, etwa „zusammenführen“ mit ``mit``."""

    beispiel: str
    empfehlung: str
    begruendung: str
    mit: str | None = None


@dataclass(frozen=True)
class Abbildungseinordnung:
    """Warum Abbildungen keine Zugfolge haben, und was zu tun wäre."""

    abbildungen: list[str]
    art: str  # etwa „Lehrbild“, „Mattbild“, „Endspiel-Lehrstellung“, „Zugfolge möglich“
    begruendung: str
    vorschlag: str


@dataclass
class Empfehlungen:
    """Inhalt von ``inhalte/de/empfehlungen.json``, nach Kennung und Abbildung nachschlagbar."""

    beispiele: dict[str, Beispielempfehlung] = field(default_factory=dict)
    abbildungen: dict[str, Abbildungseinordnung] = field(default_factory=dict)


def lies_empfehlungen(pfad: Path) -> Empfehlungen:
    """Liest ``inhalte/de/empfehlungen.json``; fehlt die Datei, gibt es keine Empfehlungen.

    Beispiel: {"beispiele": [{"beispiel": "k10-a2", "empfehlung": "zusammenführen", "mit": "k10-a1",
    "begruendung": "…"}], "abbildungen": [{"abbildungen": ["0.12", "0.13"], "art": "Zugfolge möglich",
    "begruendung": "…", "vorschlag": "1. O-O"}]}
    """
    if not pfad.exists():
        return Empfehlungen()
    daten = json.loads(pfad.read_text(encoding="utf-8"))
    ergebnis = Empfehlungen()
    for eintrag in daten.get("beispiele", []):
        empfehlung = Beispielempfehlung(**eintrag)
        ergebnis.beispiele[empfehlung.beispiel] = empfehlung
    for eintrag in daten.get("abbildungen", []):
        einordnung = Abbildungseinordnung(**eintrag)
        for nummer in einordnung.abbildungen:
            ergebnis.abbildungen[nummer] = einordnung
    return ergebnis


def zeilen_zum_beispiel(kennung: str, empfehlungen: Empfehlungen) -> list[str]:
    """Die Empfehlung zu einem Beispiel als Absatz der Prüfhilfe (leer ohne Empfehlung)."""
    empfehlung = empfehlungen.beispiele.get(kennung)
    if empfehlung is None:
        return []
    mit = f" mit [{empfehlung.mit}](#{empfehlung.mit})" if empfehlung.mit else ""
    return [f"**Empfehlung: {empfehlung.empfehlung}**{mit}. {empfehlung.begruendung}", ""]


def tabelle_ohne_zugfolge(nummern: list[str], empfehlungen: Empfehlungen) -> list[str]:
    """Tabelle der Abbildungen ohne Zugfolge mit Einordnung und Vorschlag.

    Beispiel: „| 0.12 | Zugfolge möglich | Vor und nach der kurzen Rochade | 1. O-O führt zu Abb. 0.13 |“.
    Noch nicht eingeordnete Abbildungen stehen mit „–“ in der Tabelle.
    """
    zeilen = ["| Abb. | Einordnung | Begründung | Vorschlag |", "|---|---|---|---|"]
    for nummer in nummern:
        einordnung = empfehlungen.abbildungen.get(nummer)
        if einordnung is None:
            zeilen.append(f"| {nummer} | – | noch nicht eingeordnet | – |")
        else:
            zeilen.append(
                f"| {nummer} | {einordnung.art} | {einordnung.begruendung} | {einordnung.vorschlag} |"
            )
    return [*zeilen, ""]


__all__ = [
    "Abbildungseinordnung",
    "Beispielempfehlung",
    "Einschaetzung",
    "Empfehlungen",
    "lies_einschaetzungen",
    "lies_empfehlungen",
    "tabelle_ohne_zugfolge",
    "zeilen_zum_beispiel",
]
