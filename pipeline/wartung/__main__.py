"""Einstieg: ``python -m pipeline.wartung [--warten SEKUNDEN] [--ausgabe DATEI]``.

Ablauf: alle Prüfungen, Bericht als JSON (``--ausgabe``), Zusammenfassung in die Seite des
Actions-Laufs (GITHUB_STEP_SUMMARY), Bericht an das Dashboard (nur mit BERICHT_SCHLUESSEL).
Rückgabe 1, wenn ein Punkt rot ist oder das Hochladen scheitert: Dann schickt GitHub dem
Autor eine Mail.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import UTC, datetime
from pathlib import Path

from .links import pruefe_links
from .live import SEITE, erwartete_version, pruefe_ablauf, pruefe_seiten, pruefe_version
from .netz import abrufen
from .projekt import pruefe_audit, pruefe_aufgaben, pruefe_ci, pruefe_hauptversionen, pruefe_lichess
from .punkte import Ampel, Pruefpunkt, markdown

HAUPTORDNER = Path(__file__).resolve().parents[2]
ERFOLG = 200


def alle_pruefungen(warten_s: int, jetzt: datetime) -> list[Pruefpunkt]:
    punkte = [pruefe_version(erwartete_version(HAUPTORDNER), warten_s)]
    punkte += pruefe_seiten()
    punkte += pruefe_ablauf(jetzt)
    punkte += pruefe_links(HAUPTORDNER)
    punkte += pruefe_ci(jetzt)
    punkte += [
        pruefe_audit(HAUPTORDNER),
        pruefe_hauptversionen(HAUPTORDNER),
        pruefe_lichess(HAUPTORDNER),
        pruefe_aufgaben(HAUPTORDNER),
    ]
    return punkte


def bericht(punkte: list[Pruefpunkt], jetzt: datetime) -> dict[str, object]:
    server = os.environ.get("GITHUB_SERVER_URL", "https://github.com")
    lauf_nr = os.environ.get("GITHUB_RUN_ID")
    lauf = f"{server}/{os.environ.get('GITHUB_REPOSITORY', '')}/actions/runs/{lauf_nr}" if lauf_nr else None
    return {
        "zeit": jetzt.isoformat(timespec="seconds").replace("+00:00", "Z"),
        "stand": os.environ.get("GITHUB_SHA"),
        "lauf": lauf,
        "punkte": [p.als_json() for p in punkte],
    }


def lade_hoch(daten: dict[str, object]) -> bool:
    """Schickt den Bericht an /api/bericht; ohne Schlüssel nichts (gilt als erfolgreich)."""
    schluessel = os.environ.get("BERICHT_SCHLUESSEL")
    if not schluessel:
        print("BERICHT_SCHLUESSEL fehlt: Bericht nicht hochgeladen.")
        return True
    antwort = abrufen(
        f"{SEITE}/api/bericht",
        "POST",
        kopf={"Authorization": f"Bearer {schluessel}", "Content-Type": "application/json"},
        daten=json.dumps(daten).encode("utf-8"),
    )
    if antwort.status != ERFOLG:
        print(f"Hochladen gescheitert: {antwort.status or antwort.fehler}", file=sys.stderr)
        return False
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description="Wartungsprüfungen (R57)")
    parser.add_argument(
        "--warten", type=int, default=0, help="Sekunden, die auf die neue Version gewartet wird"
    )
    parser.add_argument("--ausgabe", type=Path, help="Bericht als JSON hierhin schreiben")
    argumente = parser.parse_args()
    jetzt = datetime.now(UTC)
    punkte = alle_pruefungen(argumente.warten, jetzt)
    daten = bericht(punkte, jetzt)
    if argumente.ausgabe:
        argumente.ausgabe.write_text(json.dumps(daten, ensure_ascii=False, indent=2), encoding="utf-8")
    zusammenfassung = markdown(punkte, str(daten["zeit"]))
    print(zusammenfassung)
    if pfad := os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(pfad, "a", encoding="utf-8") as datei:
            datei.write(zusammenfassung)
    hochgeladen = lade_hoch(daten)
    rot = [p for p in punkte if p.ampel == Ampel.ROT]
    return 1 if rot or not hochgeladen else 0


if __name__ == "__main__":
    sys.exit(main())
