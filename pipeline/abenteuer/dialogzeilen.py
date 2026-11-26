"""Zeilen je Dialogdatei: keine Dialogzeile geht still verloren.

Warum: Wunsch des Autors (26.11.2026): „Ich hoffe, es wurden keine Dialoge gestrichen. Im Idealfall
bleiben alle Dialoge erhalten.“ Behebungen von Ort und Anwesenheit (anwesenheit.py) verlegen Zeilen
an den richtigen Ort oder lassen sie auslösen, wenn die Figuren zu sehen sind; sie streichen sie
nicht. Dieses Werkzeug zählt je Ink-Datei die Zeilen mit ``#sprecher`` (Erzähler und Figuren) und
vergleicht mit dem festgehaltenen Stand ``dialogzeilen_stand.json``. Sinkt eine Zahl, braucht die
Datei einen Eintrag mit Grund in ``GESENKT`` (etwa: Zeilen in eine andere Datei verlegt); danach
wird der Stand mit ``--merken`` neu geschrieben.

Aufruf: ``python -m pipeline.abenteuer.dialogzeilen [--merken]``. Rückgabe 1, wenn eine Datei ohne
Grund weniger Zeilen hat. Dauertest: pipeline/tests/test_abenteuer_dialogzeilen.py.
Abhängigkeiten: Standardbibliothek.
"""

import json
import re
import sys
from pathlib import Path

DIALOGE = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer" / "dialoge" / "de"
STAND = Path(__file__).with_name("dialogzeilen_stand.json")
SPRECHER = re.compile(r"#sprecher:\w+")

# Datei → Grund, warum sie weniger Zeilen hat als im Stand (verlegt in welche Datei, gestrichen weil).
# Nach dem Eintrag den Stand mit --merken neu schreiben; der Eintrag bleibt als Beleg.
GESENKT: dict[str, str] = {
    "maple-falls-dachboden.ink": (
        "26.11.2026: Mamas erster Morgen (zwei Zeilen) nach maple-falls-wohnzimmer.ink verlegt "
        "(morgen_mama), wo Mama steht; Wortlaut erhalten, im Zimmer bleibt „Unten klappern Schlüssel“"
    ),
}


def zaehle(ordner: Path = DIALOGE) -> dict[str, int]:
    """Zeilen mit ``#sprecher`` je Ink-Datei (ohne Kommentare)."""
    ergebnis = {}
    for datei in sorted(ordner.glob("*.ink")):
        zeilen = datei.read_text(encoding="utf-8").splitlines()
        ergebnis[datei.name] = sum(
            1 for z in zeilen if SPRECHER.search(z) and not z.lstrip().startswith("//")
        )
    return ergebnis


def gesunken(jetzt: dict[str, int], stand: dict[str, int]) -> list[str]:
    """Dateien mit weniger Zeilen als im Stand und ohne Grund in ``GESENKT``."""
    return [
        f"{datei}: {stand[datei]} → {jetzt.get(datei, 0)}"
        for datei in sorted(stand)
        if jetzt.get(datei, 0) < stand[datei] and datei not in GESENKT
    ]


def main(argumente: list[str] | None = None) -> int:
    """Vergleicht mit dem Stand; ``--merken`` schreibt den Stand neu."""
    argumente = sys.argv[1:] if argumente is None else argumente
    jetzt = zaehle()
    if "--merken" in argumente:
        STAND.write_text(json.dumps(jetzt, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"Stand gemerkt: {sum(jetzt.values())} Zeilen in {len(jetzt)} Dateien")
        return 0
    stand = json.loads(STAND.read_text(encoding="utf-8"))
    fehlt = gesunken(jetzt, stand)
    for zeile in fehlt:
        print(f"weniger Zeilen ohne Grund: {zeile}")
    print(f"{sum(jetzt.values())} Zeilen in {len(jetzt)} Dateien, {len(fehlt)} gesunken ohne Grund")
    return 1 if fehlt else 0


if __name__ == "__main__":
    sys.exit(main())
