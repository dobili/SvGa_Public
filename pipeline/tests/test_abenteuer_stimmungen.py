"""Jede Stimmung aus den Ink-Dialogen hat eine Fassung im Porträtblatt.

Warum: Das Porträt wählt das Feld des Blatts über ``#stimmung`` (inhalte/abenteuer/portraetblatt.json,
app/src/abenteuer/dialog/portraetblatt.ts). Eine unbekannte Stimmung fällt still auf die Grundfassung
zurück; so blieben verschlossen, erzaehlt, denktNach und hatIhnGesehen aus den Ironwood-Dialogen
neutral (Meldung des Haupt-Chats, 13.11.2026). Diese Prüfung nennt jede Stimmung ohne Zuordnung.
"""

import json
import re
from pathlib import Path

INHALTE = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"
STIMMUNG = re.compile(r"#\s*stimmung\s*:\s*([A-Za-z]+)")


def _stimmungen_aus_ink() -> dict[str, str]:
    """Stimmung → erste Fundstelle (Datei), aus allen Ink-Dateien aller Sprachen."""
    funde: dict[str, str] = {}
    for datei in sorted((INHALTE / "dialoge").rglob("*.ink")):
        for stimmung in STIMMUNG.findall(datei.read_text(encoding="utf-8")):
            funde.setdefault(stimmung, str(datei.relative_to(INHALTE)))
    return funde


def test_jede_stimmung_hat_eine_fassung():
    blatt = json.loads((INHALTE / "portraetblatt.json").read_text(encoding="utf-8"))
    bekannt = set(blatt["stimmungen"]) | set(blatt["fassungen"])
    fehlend = {s: d for s, d in _stimmungen_aus_ink().items() if s not in bekannt}
    assert fehlend == {}, f"Stimmungen ohne Zuordnung in portraetblatt.json: {fehlend}"


def test_zuordnungen_zeigen_auf_fassungen():
    blatt = json.loads((INHALTE / "portraetblatt.json").read_text(encoding="utf-8"))
    falsch = {s: f for s, f in blatt["stimmungen"].items() if f not in blatt["fassungen"]}
    assert falsch == {}
