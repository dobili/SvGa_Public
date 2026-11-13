"""Kein Textschlüssel steht in einer Sprachdatei des Abenteuers zweimal.

Warum: JSON erlaubt doppelte Schlüssel, beim Laden gilt still der spätere Wert. In
inhalte/abenteuer/texte/de.json standen sieben Schlüssel der Hülle und des Tagebuchs doppelt
(Meldung des Haupt-Chats, 13.11.2026); ändert jemand nur die erste Stelle, wirkt die Änderung nie.
"""

import json
from pathlib import Path

import pytest

TEXTE = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer" / "texte"


def _doppelte(datei: Path) -> list[str]:
    """Schlüssel, die in der Datei mehr als einmal vorkommen (auf jeder Ebene)."""
    doppelt: list[str] = []

    def merke(paare: list[tuple[str, object]]) -> dict[str, object]:
        gesehen: set[str] = set()
        for schluessel, _ in paare:
            if schluessel in gesehen:
                doppelt.append(schluessel)
            gesehen.add(schluessel)
        return dict(paare)

    json.loads(datei.read_text(encoding="utf-8"), object_pairs_hook=merke)
    return doppelt


@pytest.mark.parametrize("datei", sorted(TEXTE.glob("*.json")), ids=lambda d: d.name)
def test_keine_doppelten_schluessel(datei: Path):
    assert _doppelte(datei) == []
