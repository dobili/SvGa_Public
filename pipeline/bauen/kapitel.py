"""Macht aus den gelesenen Diagrammen eines Kapitels die Daten der App.

Wozu diese Datei da ist:
    Schritt 8 „Bauen“ der Pipeline (Konzept Abschnitt 5) für die Abbildungen:
    Rohdiagramme werden geprüft, in das Format von ``schemas/abbildung.schema.json``
    gebracht und mit einer Prüfsumme versehen.

Rolle im Gesamtbild:
    ``__main__.py`` ruft diese Funktionen je Kapitel auf, schreibt die Dateien und
    prüft sie gegen die Schemas. Die App liest das Ergebnis aus
    ``app/public/daten/de/a1/``.
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from typing import Any

from pipeline.befunde import Befund
from pipeline.lesen.diagramme import Kapitelquelle, Rohdiagramm
from pipeline.lesen.text import als_klartext, wandle_text
from pipeline.pruefen.abbildungen import (
    pruefe_fen,
    pruefe_matt,
    pruefe_nummern,
    pruefe_verweise,
    pruefe_zugseite,
)

# Länge der Prüfsumme in Hexadezimalzeichen (64 Bit). Reicht, um Änderungen an
# einzelnen Abbildungen zwischen zwei Datenläufen zu erkennen.
PRUEFSUMMEN_LAENGE = 16


@dataclass
class Kapitelergebnis:
    """Die Daten eines Kapitels und alle Befunde dazu."""

    daten: dict[str, Any]
    befunde: list[Befund] = field(default_factory=list)


def baue_kapitel(quelle: Kapitelquelle, auflage: int) -> Kapitelergebnis:
    """Prüft alle Diagramme eines Kapitels und baut daraus die Kapiteldaten.

    Diagramme ohne Abbildungsnummer werden nicht übernommen (Befund „ohne-nummer“),
    weil die Nummer der Schlüssel für alles ist (Konzept 4.1).
    """
    befunde = list(quelle.befunde)
    nummerierte = [d for d in quelle.diagramme if d.nummer]
    for diagramm in quelle.diagramme:
        befunde.extend(b.mit_abbildung(diagramm.nummer) if diagramm.nummer else b for b in diagramm.befunde)
    reihen = _reihen(nummerierte)
    abbildungen = []
    verweise: list[tuple[str, str, str]] = []
    for diagramm in nummerierte:
        abbildung, neue_befunde, neue_verweise = _baue_abbildung(diagramm, quelle.nummer, auflage, reihen)
        abbildungen.append(abbildung)
        befunde.extend(neue_befunde)
        verweise.extend(neue_verweise)
    befunde.extend(pruefe_nummern(quelle.nummer, [(d.nummer, d.fundstelle) for d in nummerierte]))
    befunde.extend(pruefe_verweise(quelle.nummer, verweise, {d.nummer for d in nummerierte}))
    daten = {
        "schemaVersion": 1,
        "kapitel": quelle.nummer,
        "titel": quelle.titel,
        "abschnitte": [vars(a) for a in quelle.abschnitte],
        "abbildungen": abbildungen,
        # Übungen, Steckbriefe, Bilanzen und Fallenchecks ergänzt bauen/inhalte.py (ganzes Buch).
        "uebungen": [],
        "steckbriefe": [],
        "bilanzen": [],
        "fallenchecks": [],
        "beispiele": [],  # freigegebene Zugfolgen, ergänzt bauen/__main__.py
    }
    return Kapitelergebnis(daten, befunde)


def _baue_abbildung(
    diagramm: Rohdiagramm, kapitel: int, auflage: int, reihen: dict[int, list[str]]
) -> tuple[dict[str, Any], list[Befund], list[tuple[str, str, str]]]:
    """Baut eine Abbildung, prüft sie und sammelt ihre Verweise."""
    nummer = diagramm.nummer or ""
    umwandlung = wandle_text(diagramm.unterschrift_latex, diagramm.fundstelle)
    befunde = [b.mit_abbildung(nummer) for b in umwandlung.befunde]
    befunde += [b.mit_abbildung(nummer) for b in pruefe_fen(diagramm.fen, diagramm.fundstelle)]
    klartext = als_klartext(umwandlung.teile)
    befunde += [b.mit_abbildung(nummer) for b in pruefe_zugseite(diagramm.fen, klartext, diagramm.fundstelle)]
    befunde += [b.mit_abbildung(nummer) for b in pruefe_matt(diagramm.fen, klartext, diagramm.fundstelle)]
    verweise = [
        (teil.abbildung, nummer, diagramm.fundstelle)
        for teil in umwandlung.teile
        if teil.art == "verweis" and teil.abbildung
    ]
    nachbarn = [n for n in reihen.get(diagramm.reihe, []) if n != nummer] if diagramm.reihe else []
    abbildung: dict[str, Any] = {
        "id": nummer,
        "auflage": auflage,
        "kapitel": kapitel,
        "abschnitt": vars(diagramm.abschnitt) if diagramm.abschnitt else None,
        "unterabschnitt": diagramm.unterabschnitt,
        "fen": diagramm.fen,
        "pfeile": [vars(p) for p in diagramm.pfeile],
        "felder": [vars(f) for f in diagramm.felder],
        "unterschrift": [teil.als_daten() for teil in umwandlung.teile],
        "art": diagramm.art,
        "reihe": nachbarn,
        "beispiel": None,
        "quelle": {"datei": diagramm.datei, "zeile": diagramm.zeile},
    }
    abbildung["pruefsumme"] = pruefsumme(abbildung)
    return abbildung, befunde, verweise


def _reihen(diagramme: list[Rohdiagramm]) -> dict[int, list[str]]:
    """Ordnet jeder Diagrammreihe die Nummern ihrer Abbildungen zu."""
    reihen: dict[int, list[str]] = {}
    for diagramm in diagramme:
        if diagramm.reihe is not None and diagramm.nummer:
            reihen.setdefault(diagramm.reihe, []).append(diagramm.nummer)
    return reihen


def pruefsumme(abbildung: dict[str, Any]) -> str:
    """Prüfsumme über den Inhalt, der für den Leser zählt.

    Fundstelle und Abschnitt gehen nicht ein: Verschiebt sich eine Abbildung nur um
    ein paar Zeilen, bleibt die Prüfsumme gleich, und die freigegebenen
    Referenzergebnisse der Werkzeuge (Konzept 13) bleiben gültig.
    """
    inhalt = {schluessel: abbildung[schluessel] for schluessel in ("fen", "pfeile", "felder", "unterschrift")}
    text = json.dumps(inhalt, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:PRUEFSUMMEN_LAENGE]
