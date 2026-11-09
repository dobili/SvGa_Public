"""Teilt die alte ``inhalte/abenteuer/moebel.json`` einmalig in eine Datei je Ort auf.

Warum: siehe ``pipeline/abenteuer/moebelliste.py`` (Merge-Konflikte, wenn alle Helfer in eine Datei
schreiben). Zuordnung nach der Vorsilbe des Namens (Kleinbuchstaben und Ziffern vor dem ersten
Großbuchstaben, etwa ``mf4`` in ``mf4Sofa``): ``mf``, ``mf2`` … und ``wz`` (Wohnzimmer) gehören zu
Maple Falls, ``cc`` … zu Cedar Creek, ``wg4`` zum Weg Maple Falls–Cedar Creek und so fort. Namen
ohne bekannte Vorsilbe (die ersten Platzhalter wie ``kiste`` oder ``sofa``, die über mehrere Orte
verteilten ``sv``-Teile) kommen nach ``allgemein.json``.

Aufruf: ``python -m pipeline.abenteuer.moebel_aufteilen`` (bricht ab, wenn die alte Datei fehlt).
Ausgabe: ``inhalte/abenteuer/moebel/<ort>.json``; die alte Datei wird gelöscht.
"""

import json
import re
import sys
from pathlib import Path

from pipeline.abenteuer.moebelliste import ORDNER

ALT = ORDNER.parent / "moebel.json"
ALLGEMEIN = "allgemein"
# Vorsilbe ohne Ziffer → Datei des Ortes (Kennung aus orte.json in Kleinschreibung mit Bindestrich).
ORT_JE_VORSILBE = {
    "mf": "maple-falls",
    "wz": "maple-falls",
    "cc": "cedar-creek",
    "wg": "weg-maple-cedar",
    "rv": "riverton",
    "iw": "ironwood",
    "ld": "erinnerung-london",
    "sb": "silicon-bay",
    "pd": "port-delacroix",
    "ds": "desert-springs",
    "he": "hochebene",
    "sc": "summit-city",
    "cr": "crossroads",
    "pw": "pinewood-camp",
    "gt": "ghost-town",
    "ca": "capital-arena",
}
VORSILBE = re.compile(r"^([a-z]+)\d*(?=[A-Z])")


def ort_fuer(name: str) -> str:
    """Datei (ohne Endung) für einen Möbelnamen; Beispiel: ``mf4Sofa`` → ``maple-falls``."""
    treffer = VORSILBE.match(name)
    return ORT_JE_VORSILBE.get(treffer.group(1), ALLGEMEIN) if treffer else ALLGEMEIN


def aufteilen(alt: dict[str, dict]) -> dict[str, dict[str, dict]]:
    """Ort → {Name: Angabe}, in der Reihenfolge der alten Datei."""
    orte: dict[str, dict[str, dict]] = {}
    for name, angabe in alt.items():
        orte.setdefault(ort_fuer(name), {})[name] = angabe
    return orte


def main() -> int:
    if not ALT.exists():
        print(f"{ALT} fehlt: schon aufgeteilt?", file=sys.stderr)
        return 1
    ORDNER.mkdir(exist_ok=True)
    alt = json.loads(ALT.read_text(encoding="utf-8"))["moebel"]
    for ort, moebel in sorted(aufteilen(alt).items()):
        ziel = ORDNER / f"{ort}.json"
        if ziel.exists():
            print(f"{ziel} gibt es schon, nichts überschrieben", file=sys.stderr)
            return 1
        ziel.write_text(json.dumps({"moebel": moebel}, ensure_ascii=False, indent=2) + "\n", "utf-8")
        print(f"{ziel.name}: {len(moebel)} Möbel")
    ALT.unlink()
    return 0


if __name__ == "__main__":
    sys.exit(main())
