"""Die Quelldateien des Buches in Buchreihenfolge.

Wozu diese Datei da ist:
    Mehrere Schritte brauchen alle Kapitel und Anhänge auf einmal: die buchweiten Prüfungen
    (``pruefen/buch.py``), das Verweisverzeichnis (``lesen/verzeichnis.py``), Übungen und
    Glossar. Diese Datei liest sie einmal, ohne Kommentare und mit unveränderten Zeilen.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

from pipeline.lesen.latex import entferne_kommentare

_KAPITELDATEI = re.compile(r"kap(\d+)_")


@dataclass(frozen=True)
class Quelldatei:
    """Eine Kapitel- oder Anhangdatei ohne Kommentare (Zeilen bleiben erhalten)."""

    name: str
    text: str

    @property
    def kapitel(self) -> int | None:
        """Kapitelnummer aus dem Dateinamen (``kap07_taktik.tex`` → 7), bei Anhängen None."""
        treffer = _KAPITELDATEI.match(self.name)
        return int(treffer.group(1)) if treffer else None


def lies_quellen(buchordner: Path) -> list[Quelldatei]:
    """Liest alle Kapitel und dann die Anhänge, wie in main.tex (``_markiert``-Kopien ausgenommen)."""
    ordner = buchordner / "chapters"
    dateien = sorted(ordner.glob("kap*.tex")) + sorted(ordner.glob("anhang_*.tex"))
    return [
        Quelldatei(d.name, entferne_kommentare(d.read_text(encoding="utf-8")))
        for d in dateien
        if "_markiert" not in d.name
    ]


def abschnittsnummer(quelle: Quelldatei, position: int) -> str | None:
    """Nummer des gezählten Abschnitts an einer Stelle („2.1“), None vor dem ersten Abschnitt."""
    anzahl = len(re.findall(r"\\section(?:\[[^\]]*\])?\{", quelle.text[:position]))
    return f"{quelle.kapitel}.{anzahl}" if anzahl and quelle.kapitel is not None else None
