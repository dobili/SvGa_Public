"""Lesen, Schreiben und Prüfen der Trainerdaten (``inhalte/de/trainer/``) gegen die Schemas.

Wozu diese Datei da ist:
    Die Dateien sind der Vertrag mit der App (AP 13, Opus). Jede wird vor dem Schreiben gegen ihr
    Schema geprüft; die Tests prüfen die eingecheckten Dateien noch einmal ohne Engine.
"""

from __future__ import annotations

import json
from pathlib import Path

from pipeline.bauen.__main__ import pruefe_schema

HAUPTORDNER = Path(__file__).resolve().parents[2]
DATENORDNER = HAUPTORDNER / "app" / "public" / "daten" / "de" / "a1"
INHALTE = HAUPTORDNER / "inhalte" / "de"
TRAINERORDNER = INHALTE / "trainer"


def lies_json(pfad: Path) -> dict:
    return json.loads(pfad.read_text(encoding="utf-8"))


def schreibe_daten(ziel: Path, daten: dict, schema: str) -> None:
    """Prüft gegen das Schema und schreibt die Datei (UTF-8, eingerückt, Umlaute lesbar)."""
    fehler = pruefe_schema(daten, schema)
    if fehler:
        raise ValueError(f"{ziel.name} passt nicht zu {schema}:\n" + "\n".join(fehler[:20]))
    ziel.parent.mkdir(parents=True, exist_ok=True)
    ziel.write_text(json.dumps(daten, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
