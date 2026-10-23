"""Englische App-Daten aus den deutschen und den Übersetzungstabellen bauen (Paket P6, R25).

Aufruf (im Hauptordner des Repositorys):

    python -m pipeline.uebersetzen                       # baut app/public/daten/en/a1/, Bericht
    python -m pipeline.uebersetzen --nur kap01.json      # nur diese Datei(en)
    python -m pipeline.uebersetzen --einspielen buch/arbeit/uebersetzung/fertig/kap01.json
    python -m pipeline.uebersetzen --streng              # Rückgabe 1, wenn noch etwas offen ist

Rolle im Gesamtbild:
    Die deutschen App-Daten (``app/public/daten/de/a1/``, aus dem LaTeX gebaut) sind die Quelle.
    Die englischen Sätze stehen in ``inhalte/en/a1/<datei>`` (``tabellen.py``), ohne deutschen
    Text. Dieser Lauf schreibt ``app/public/daten/en/a1/`` und nach ``buch/arbeit/uebersetzung/``
    (nur lokal, nie ins Repository): ``offen/<datei>`` mit allen noch nicht übersetzten Vorlagen
    zum Übersetzen und ``<datei>.md`` mit Deutsch und Englisch nebeneinander zum Durchsehen.

    Übersetzt wird eine offene Datei als ``{"datei": "kap01.json", "texte": {Kennung: Englisch}}``;
    ``--einspielen`` prüft jede Zeile gegen die heutige deutsche Vorlage (Platzhalter, Züge) und
    übernimmt nur, was passt. Ein Satz, der in mehreren Dateien gleich steht, wird einmal übersetzt
    und überall genutzt (die eigene Tabelle zuerst).
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from pipeline.uebersetzen.pruefhilfe import pruefhilfe
from pipeline.uebersetzen.tabellen import kennung, lies_tabelle, schreibe_json, schreibe_tabelle
from pipeline.uebersetzen.uebertragen import Bericht, begriffsuebersetzer, uebersetze
from pipeline.uebersetzen.vorlage import platzhaltertexte

HAUPTORDNER = Path(__file__).resolve().parents[2]
QUELLE = HAUPTORDNER / "app/public/daten/de/a1"
ZIEL = HAUPTORDNER / "app/public/daten/en/a1"
TABELLEN = HAUPTORDNER / "inhalte/en/a1"
ARBEIT = HAUPTORDNER / "buch/arbeit/uebersetzung"
GLOSSAR = "glossar.json"


def _lies(pfad: Path) -> Any:
    return json.loads(pfad.read_text(encoding="utf-8"))


_schreibe = schreibe_json


def datendateien(quelle: Path) -> list[str]:
    """Alle Dateien eines Datenordners in fester Reihenfolge: Glossar zuerst (für die Verweise).

    Beispiel: [„glossar.json“, „index.json“, „kap00.json“ … „kap12.json“, „nachschlagen.json“].
    """
    index = _lies(quelle / "index.json")
    kapitel = [eintrag["datei"] for eintrag in index["kapitel"]]
    return [index.get("glossar", GLOSSAR), "index.json", *kapitel, index.get("nachschlagen")]


def alle_tabellen(tabellen: Path, dateien: list[str]) -> dict[str, dict[str, str]]:
    """Die Tabellen aller Dateien (fehlende sind leer)."""
    return {datei: lies_tabelle(tabellen / datei) for datei in dateien}


def _nachschlagen(eigene: dict[str, str], alle: dict[str, dict[str, str]]) -> dict[str, str]:
    """Eigene Tabelle zuerst, dann gleiche Sätze aus den anderen Dateien."""
    gemeinsam: dict[str, str] = {}
    for tabelle in alle.values():
        gemeinsam.update(tabelle)
    return {**gemeinsam, **eigene}


def baue(quelle: Path, ziel: Path, tabellen: Path, nur: list[str] | None = None) -> list[Bericht]:
    """Schreibt die englischen Daten und liefert je Datei den Bericht.

    Beispiel: ohne Tabellen ist jede Datei eine Kopie mit „sprache“: „en“ und alles offen.
    """
    dateien = datendateien(quelle)
    alle = alle_tabellen(tabellen, dateien)
    begriffe = begriffsuebersetzer(_lies(quelle / GLOSSAR), alle[GLOSSAR])
    berichte = []
    for datei in dateien:
        if nur and datei not in nur:
            continue
        tabelle = _nachschlagen(alle[datei], alle)
        daten, bericht = uebersetze(_lies(quelle / datei), datei, tabelle, begriffe)
        _schreibe(ziel / datei, daten)
        berichte.append(bericht)
    return berichte


def einspielen(quelle: Path, tabellen: Path, arbeitsdatei: Path) -> list[str]:
    """Übernimmt geprüfte Übersetzungen einer Arbeitsdatei in die Tabelle ihrer Datendatei.

    Ausgabe: Meldungen zu abgelehnten Zeilen (leer = alles übernommen).
    Sonderfälle: Kennung, die es in der Datei nicht (mehr) gibt → abgelehnt; Übersetzung, die nicht
    zur Vorlage passt → abgelehnt, die Tabelle behält den alten Stand dieser Zeile.
    """
    arbeit = _lies(arbeitsdatei)
    datei, neu = arbeit["datei"], arbeit["texte"]
    dateien = datendateien(quelle)
    alle = alle_tabellen(tabellen, dateien)
    glossartabelle = {**alle[GLOSSAR], **neu} if datei == GLOSSAR else alle[GLOSSAR]
    begriffe = begriffsuebersetzer(_lies(quelle / GLOSSAR), glossartabelle)
    _, probe = uebersetze(_lies(quelle / datei), datei, neu, begriffe)
    bekannt = set(probe.reihenfolge)
    abgelehnt = [f"{k}: gibt es in {datei} nicht" for k in neu if k not in bekannt]
    abgelehnt += probe.fehler
    tabelle = dict(alle[datei])
    for einheit_kennung, text in neu.items():
        if einheit_kennung in bekannt and einheit_kennung not in probe.abgelehnt:
            tabelle[einheit_kennung] = text
    schreibe_tabelle(tabellen / datei, tabelle, probe.reihenfolge)
    return abgelehnt


def schreibe_arbeitsdateien(arbeit: Path, bericht: Bericht) -> None:
    """Offene Vorlagen zum Übersetzen und die Prüfhilfe Deutsch/Englisch (nur lokal)."""
    offen: dict[str, dict[str, Any]] = {}
    for einheit in bericht.offen:
        eintrag: dict[str, Any] = {"ort": einheit.ort, "de": einheit.vorlage}
        if einheit.teile:
            eintrag["platzhalter"] = platzhaltertexte(einheit.teile)
        offen.setdefault(kennung(einheit.vorlage), eintrag)
    eintraege = [{"kennung": k, **v} for k, v in offen.items()]
    _schreibe(arbeit / "offen" / bericht.datei, {"datei": bericht.datei, "einheiten": eintraege})
    text = pruefhilfe(bericht)
    (arbeit / f"{bericht.datei.removesuffix('.json')}.md").write_text(text, encoding="utf-8")


def _melde(berichte: list[Bericht]) -> None:
    for bericht in berichte:
        offen = len({kennung(e.vorlage) for e in bericht.offen})
        print(f"{bericht.datei}: {bericht.uebersetzt}/{bericht.gesamt} übersetzt, {offen} Sätze offen")
        for meldung in bericht.fehler:
            print(f"  FEHLER {meldung}")
        for meldung in bericht.warnungen:
            print(f"  Warnung {meldung}")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Englische App-Daten aus den Übersetzungstabellen bauen.")
    parser.add_argument("--quelle", type=Path, default=QUELLE)
    parser.add_argument("--ziel", type=Path, default=ZIEL)
    parser.add_argument("--tabellen", type=Path, default=TABELLEN)
    parser.add_argument("--arbeit", type=Path, default=ARBEIT)
    parser.add_argument("--nur", nargs="+", help="nur diese Dateien, etwa kap01.json")
    parser.add_argument("--einspielen", nargs="+", type=Path, help="Arbeitsdateien übernehmen")
    parser.add_argument("--streng", action="store_true", help="Rückgabe 1, wenn etwas offen ist")
    args = parser.parse_args(argv)
    for arbeitsdatei in args.einspielen or []:
        abgelehnt = einspielen(args.quelle, args.tabellen, arbeitsdatei)
        print(f"{arbeitsdatei.name}: {len(abgelehnt)} Zeilen abgelehnt")
        for meldung in abgelehnt:
            print(f"  {meldung}")
    berichte = baue(args.quelle, args.ziel, args.tabellen, args.nur)
    for bericht in berichte:
        schreibe_arbeitsdateien(args.arbeit, bericht)
    _melde(berichte)
    fehler = any(bericht.fehler for bericht in berichte)
    offen = any(bericht.offen for bericht in berichte)
    return 1 if fehler or (args.streng and offen) else 0


if __name__ == "__main__":
    raise SystemExit(main())
