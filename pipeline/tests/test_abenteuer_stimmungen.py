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


# Ein Abschnitt einer Ink-Zeile mit Sprecher (bei Bedingungen getrennt durch |).
SPRECHER = re.compile(r"#\s*sprecher\s*:\s*([A-Za-z]+)")
ERZAEHLER = "erzaehler"


def test_jede_redezeile_hat_eine_stimmung():
    # RO14 (15.11.2026): Alle Redezeilen tragen eine Stimmung, damit die Gesichter mitspielen;
    # der Erzähler hat kein Porträt und braucht keine.
    ohne = []
    for datei in sorted((INHALTE / "dialoge").rglob("*.ink")):
        for nummer, zeile in enumerate(datei.read_text(encoding="utf-8").split("\n"), 1):
            if zeile.lstrip().startswith("//"):
                continue
            for teil in zeile.split("|"):
                sprecher = SPRECHER.search(teil)
                if sprecher and sprecher.group(1) != ERZAEHLER and not STIMMUNG.search(teil):
                    ohne.append(f"{datei.name}:{nummer}")
    assert ohne == [], f"Redezeilen ohne #stimmung: {ohne}"
