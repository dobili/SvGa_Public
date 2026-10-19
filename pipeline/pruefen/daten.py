"""Prüft fertige App-Daten gegen die Schemas, ohne die Buchquellen zu brauchen.

Warum: Die Buchquellen liegen nie im Repository (CLAUDE.md, Regel 2). Die automatischen
Prüfungen auf GitHub können den Datenlauf deshalb nicht wiederholen. Sie prüfen stattdessen,
ob die eingecheckten Daten in ``app/public/daten/`` zum Vertrag (``schemas/``) passen und ob
Verzeichnis und Kapiteldateien zusammenpassen.

Aufruf (im Hauptordner):

    python -m pipeline.pruefen.daten app/public/daten/de/a1
    python -m pipeline.pruefen.daten --veroeffentlichung app/public/daten/de/a1   # vor 1.0 (AP 17)

Mit ``--veroeffentlichung`` gilt zusätzlich jeder Eintrag mit Status „entwurf“ als Fehler: Die
Fassung für die Leser darf keine Entwürfe enthalten (Lauf ohne ``--mit-entwuerfen`` und
``--text-entwuerfe``). Ohne den Schalter sind Entwürfe erlaubt (Testfassung bis AP 17).

Rückgabewert: 0, wenn alles passt, sonst 1 mit einer Zeile je Fehler.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from pipeline.bauen.__main__ import pruefe_schema


def pruefe_datenordner(ordner: Path) -> list[str]:
    """Prüft index.json und alle darin genannten Kapiteldateien.

    Eingabe: Datenordner einer Sprache und Auflage. Ausgabe: Fehlermeldungen (leer = gültig).
    Beispiel: ``app/public/daten/de/a1`` mit ``index.json``, ``kap00.json`` bis ``kap12.json``
    (765 Abbildungen, 86 Übungen), ``glossar.json`` und ``nachschlagen.json``.
    """
    index_pfad = ordner / "index.json"
    if not index_pfad.exists():
        return [f"{index_pfad}: fehlt"]
    index = json.loads(index_pfad.read_text(encoding="utf-8"))
    fehler = [f"index.json: {meldung}" for meldung in pruefe_schema(index, "index.schema.json")]
    for eintrag in index.get("kapitel", []):
        fehler += _pruefe_kapitel(ordner, eintrag)
    for schluessel, schema in (
        ("glossar", "glossar.schema.json"),
        ("nachschlagen", "nachschlagen.schema.json"),
    ):
        datei = ordner / index.get(schluessel, f"{schluessel}.json")
        if not datei.exists():
            fehler.append(f"{datei.name}: fehlt")
            continue
        inhalt = json.loads(datei.read_text(encoding="utf-8"))
        fehler += [f"{datei.name}: {m}" for m in pruefe_schema(inhalt, schema)]
    return fehler


def _pruefe_kapitel(ordner: Path, eintrag: dict) -> list[str]:
    """Prüft eine Kapiteldatei gegen ihr Schema und gegen den Eintrag im Verzeichnis."""
    pfad = ordner / eintrag["datei"]
    if not pfad.exists():
        return [f"{eintrag['datei']}: im Verzeichnis genannt, aber nicht vorhanden"]
    kapitel = json.loads(pfad.read_text(encoding="utf-8"))
    fehler = [f"{pfad.name}: {meldung}" for meldung in pruefe_schema(kapitel, "kapitel.schema.json")]
    nummern = [abbildung["id"] for abbildung in kapitel.get("abbildungen", [])]
    if nummern != eintrag["abbildungen"]:
        fehler.append(f"{pfad.name}: Abbildungen weichen vom Verzeichnis ab")
    if kapitel.get("kapitel") != eintrag["kapitel"]:
        fehler.append(f"{pfad.name}: Kapitelnummer weicht vom Verzeichnis ab")
    return fehler


def finde_entwuerfe(ordner: Path) -> list[str]:
    """Findet Einträge mit Status „entwurf“ in allen JSON-Dateien eines Datenordners.

    Warum: Vor der Veröffentlichung (AP 17) darf kein Entwurf in die Fassung für die Leser.
    Ausgabe: je Fund eine Meldung mit Datei und Kennung. Beispiel: ein Lauf mit
    ``--mit-entwuerfen`` setzt bei nicht freigegebenen Zugfolgen ``"status": "entwurf"``.
    """
    funde: list[str] = []
    for pfad in sorted(ordner.rglob("*.json")):
        for kennung in _entwurfskennungen(json.loads(pfad.read_text(encoding="utf-8"))):
            funde.append(f"{pfad.name}: Entwurf {kennung}")
    return funde


def _entwurfskennungen(wert: object) -> list[str]:
    """Kennungen aller Objekte mit ``"status": "entwurf"`` in einem JSON-Wert (rekursiv)."""
    if isinstance(wert, list):
        return [k for teil in wert for k in _entwurfskennungen(teil)]
    if not isinstance(wert, dict):
        return []
    eigene = [str(wert.get("id", "?"))] if wert.get("status") == "entwurf" else []
    return eigene + [k for teil in wert.values() for k in _entwurfskennungen(teil)]


def main(argumente: list[str] | None = None) -> int:
    liste = list(argumente if argumente is not None else sys.argv[1:])
    veroeffentlichung = "--veroeffentlichung" in liste
    ordner = [Path(a) for a in liste if a != "--veroeffentlichung"]
    if not ordner:
        print("Aufruf: python -m pipeline.pruefen.daten [--veroeffentlichung] <datenordner> …")
        return 1
    fehler = [meldung for o in ordner for meldung in pruefe_datenordner(o)]
    if veroeffentlichung:
        fehler += [meldung for o in ordner for meldung in finde_entwuerfe(o)]
    for meldung in fehler:
        print(meldung)
    print("Daten passen zu den Schemas." if not fehler else f"{len(fehler)} Fehler.")
    return 1 if fehler else 0


if __name__ == "__main__":
    sys.exit(main())
