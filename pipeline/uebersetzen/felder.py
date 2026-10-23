"""Findet in den deutschen App-Daten jede Stelle mit Buchtext, die übersetzt wird.

Wozu diese Datei da ist:
    Die Kapiteldateien mischen Buchtext (Bildunterschriften, Übungen, Fragen, Bilanzen) mit
    Daten, die die App als Schlüssel liest (Kennungen, FEN, Züge der Lösungen, Abschnittsnummern,
    Werkzeugkennungen). Übersetzt werden nur Felder aus einer festen Liste; jeder Text in einem
    unbekannten Feld wird gemeldet, damit nichts unbemerkt deutsch bleibt oder ein Schlüssel
    versehentlich übersetzt wird.

    Ausdrücklich NICHT übersetzt (die App liest sie als Schlüssel oder spielt sie als Züge):
    ``uebungen[].erklaerung.loesung`` und ``akzeptiert`` (Lösungszüge) und
    ``vorbereitet.fragen[].zug`` (der erfragte Zug) bekommen nur englische Figurenbuchstaben
    (``uebertragen.zuege_auf_englisch``), ``beispiele[].abschnitt``
    (Abschnittsnummer oder Übungsnummer als Schlüssel), ``einschaetzungen[].werkzeug``
    (Werkzeugkennung wie „k1-zaehlen“), alle Kennungen, Felder, Pfeile, FEN und Prüfsummen.

Rolle im Gesamtbild: Teil der Übersetzungsschicht ``pipeline/uebersetzen``.
"""

from __future__ import annotations

import re
from collections.abc import Callable, Iterator
from dataclasses import dataclass
from typing import Any

from pipeline.uebersetzen.vorlage import vorlage_aus_teilen

# Felder mit einem Satz oder Namen als Zeichenkette.
TEXTFELDER = frozenset(
    {
        "titel",
        "unterabschnitt",
        "frage",
        "erklaerung",
        "text",
        "motiv",
        "name",
        "kernfrage",
        "werkzeug",
        "fehlerart",
        "einleitung",
        "wann",
        "zuerst",
        "zurueck",
        "abschluss",
        "phasenTitel",
        "begriff",
    }
)
# Felder mit einer Liste von Sätzen.
LISTENFELDER = frozenset({"antworten", "hinweise", "spalten", "punkte"})
# Felder, die die App als Schlüssel, Zug oder Zahl liest: nie übersetzen, nicht melden.
SCHLUESSELFELDER = frozenset(
    {
        "schemaVersion",
        "id",
        "fen",
        "startFen",
        "label",
        "nummer",
        "abschnitt",
        "datei",
        "pruefsumme",
        "art",
        "stil",
        "farbe",
        "feld",
        "von",
        "nach",
        "status",
        "pfad",
        "zug",
        "zeichen",
        "loesung",
        "akzeptiert",
        "abbildung",
        "abbildungen",
        "reihe",
        "quelle",
        "anker",
        "kennung",
        "wertung",
        "stopp",
        "sprache",
        "datenstand",
        "glossar",
        "nachschlagen",
        "engineGeprueft",
        "kapitel",
        "richtig",
        "stellen",
        "verweise",
    }
)
_WERKZEUGKENNUNG = re.compile(r"^k\d+-[a-z0-9-]+$")
_TEXTARTEN = frozenset({"text", "zug", "verweis", "stelle", "zeichen", "begriff", "absatz"})


@dataclass
class Einheit:
    """Eine übersetzbare Stelle: deutsche Vorlage, Fundort für Menschen, Rückschreiben."""

    ort: str
    vorlage: str
    # Die deutschen Textteile; None bei einem einfachen Text.
    teile: list[dict[str, Any]] | None
    setze: Callable[[Any], None]


def ist_teilliste(wert: object) -> bool:
    """Ist der Wert eine Liste von Textteilen (``text.schema.json``)?"""
    return (
        isinstance(wert, list)
        and len(wert) > 0
        and all(
            isinstance(teil, dict) and teil.get("art") in _TEXTARTEN and isinstance(teil.get("text"), str)
            for teil in wert
        )
    )


def _ortsname(ort: str, wert: dict[str, Any]) -> str:
    """Fundort lesbar machen: Kennung oder Nummer des Eintrags anhängen („abbildungen[1.3]“)."""
    for schluessel in ("id", "nummer", "begriff", "name", "kapitel"):
        kennung = wert.get(schluessel)
        if isinstance(kennung, str | int) and not isinstance(kennung, bool):
            return f"{ort}[{kennung}]"
    return ort


def einheiten(daten: Any, unbekannt: list[str] | None = None) -> list[Einheit]:
    """Alle übersetzbaren Stellen einer Datei in Lesereihenfolge.

    Eingaben: geladene JSON-Daten (Kapitel, Glossar, Nachschlagen, Verzeichnis); optional eine
    Liste, in die Texte unbekannter Felder als Meldung kommen.
    Ausgabe: Einheiten; ``setze`` schreibt die Übersetzung an Ort und Stelle zurück.
    Beispiel (kap01.json): „abbildungen[1.2].unterschrift“ mit Vorlage „Nach {z1} – <b>Ziel 1</b>“.
    """
    gefunden: list[Einheit] = []
    _laufe(daten, "", gefunden, unbekannt if unbekannt is not None else [])
    return gefunden


def _laufe(wert: Any, ort: str, gefunden: list[Einheit], unbekannt: list[str]) -> None:
    if isinstance(wert, dict):
        ort_hier = _ortsname(ort, wert)
        for schluessel, inhalt in wert.items():
            _feld(wert, schluessel, inhalt, f"{ort_hier}.{schluessel}", gefunden, unbekannt)
    elif isinstance(wert, list):
        for eintrag in wert:
            _laufe(eintrag, ort, gefunden, unbekannt)


def _setzer(behaelter: dict[str, Any] | list[Any], stelle: str | int) -> Callable[[Any], None]:
    def setze(neu: Any) -> None:
        behaelter[stelle] = neu  # type: ignore[index]

    return setze


def _feld(
    behaelter: dict[str, Any],
    schluessel: str,
    inhalt: Any,
    ort: str,
    gefunden: list[Einheit],
    unbekannt: list[str],
) -> None:
    """Ordnet ein Feld zu: Teilliste, Text, Liste von Texten, Schlüssel oder tiefer suchen."""
    if ist_teilliste(inhalt):
        vorlage = vorlage_aus_teilen(inhalt)
        gefunden.append(Einheit(ort, vorlage, inhalt, _setzer(behaelter, schluessel)))
    elif isinstance(inhalt, str):
        if schluessel in TEXTFELDER and not _WERKZEUGKENNUNG.match(inhalt):
            gefunden.append(Einheit(ort, inhalt, None, _setzer(behaelter, schluessel)))
        elif schluessel not in SCHLUESSELFELDER and re.search(r"[A-Za-zÄÖÜäöüß]{3}", inhalt):
            unbekannt.append(f"{ort}: „{inhalt[:60]}“")
    elif schluessel in LISTENFELDER and isinstance(inhalt, list):
        for stelle, eintrag in enumerate(inhalt):
            if isinstance(eintrag, str):
                gefunden.append(Einheit(f"{ort}[{stelle}]", eintrag, None, _setzer(inhalt, stelle)))
    elif schluessel not in SCHLUESSELFELDER or isinstance(inhalt, dict | list):
        if schluessel in ("stellen", "verweise"):
            return
        _laufe(inhalt, ort, gefunden, unbekannt)


def alle_texte(daten: Any) -> Iterator[str]:
    """Jeder sichtbare Text einer übersetzten Datei (Textteile und Textfelder), für Prüfungen."""
    for einheit in einheiten(daten):
        if einheit.teile is None:
            yield einheit.vorlage
        else:
            for teil in einheit.teile:
                if teil["art"] in ("text", "begriff"):
                    yield teil["text"]
