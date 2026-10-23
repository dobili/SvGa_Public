"""Wendet eine Übersetzungstabelle auf eine deutsche Datendatei an.

Wozu diese Datei da ist:
    Aus ``app/public/daten/de/a1/kapNN.json`` und ``inhalte/en/a1/kapNN.json`` entsteht
    ``app/public/daten/en/a1/kapNN.json``: dieselben Daten, jeder Buchtext englisch. Was noch
    nicht übersetzt ist, bleibt deutsch (die App zeigt dann den deutschen Satz, nichts fehlt) und
    steht im Bericht als offen. Eine Übersetzung, die nicht zur deutschen Vorlage passt, wird
    nicht übernommen und als Fehler gemeldet.

    Glossar: Querverweise (``verweise``, Textteile „begriff“) zeigen auf den englischen Namen des
    Eintrags, und die Einträge stehen nach dem englischen Alphabet, weil die App die Reihenfolge
    der Daten für die Buchstabenleiste nimmt (``ui/bildschirme/Glossar.tsx``).

Rolle im Gesamtbild: Teil der Übersetzungsschicht ``pipeline/uebersetzen``.
"""

from __future__ import annotations

import copy
import unicodedata
from collections.abc import Callable
from dataclasses import dataclass, field
from typing import Any

from pipeline.uebersetzen.felder import Einheit, einheiten
from pipeline.uebersetzen.pruefen import deutsche_zuege, restdeutsch
from pipeline.uebersetzen.tabellen import kennung
from pipeline.uebersetzen.vorlage import VorlagenFehler, teile_aus_vorlage, zug_auf_englisch

ZIELSPRACHE = "en"


@dataclass
class Bericht:
    """Ergebnis einer Datei: wie viel übersetzt ist, was offen ist, was nicht passt."""

    datei: str
    gesamt: int = 0
    uebersetzt: int = 0
    offen: list[Einheit] = field(default_factory=list)
    fehler: list[str] = field(default_factory=list)
    warnungen: list[str] = field(default_factory=list)
    reihenfolge: list[str] = field(default_factory=list)
    # Kennungen, deren Übersetzung nicht zur Vorlage passt.
    abgelehnt: set[str] = field(default_factory=set)
    # Für die Prüfhilfe: Ort, deutsche Vorlage, englische Vorlage (None = offen oder abgelehnt).
    zeilen: list[tuple[str, str, str | None]] = field(default_factory=list)


def begriffsuebersetzer(glossar_de: dict[str, Any], tabelle: dict[str, str]) -> Callable[[str], str]:
    """Deutscher Glossarbegriff → englischer Name des Eintrags (unübersetzt: der deutsche).

    Beispiel: „Zugzwang“ → „Zugzwang“, „Bauernkette“ → „Pawn chain“ (wenn übersetzt).
    """
    namen = {
        eintrag["begriff"]: tabelle.get(kennung(eintrag["begriff"]), eintrag["begriff"])
        for eintrag in glossar_de.get("eintraege", [])
    }
    return lambda begriff: namen.get(begriff, begriff)


def _uebertrage(einheit: Einheit, englisch: str, begriffe: Callable[[str], str], bericht: Bericht) -> None:
    """Schreibt eine Übersetzung zurück, wenn sie passt; sonst Fehler im Bericht."""
    try:
        if einheit.teile is None:
            if any(zeichen in englisch for zeichen in "<>{}"):
                raise VorlagenFehler("Steuerzeichen in einem einfachen Text")
            neu: Any = englisch
            texte = [englisch]
        else:
            neu = teile_aus_vorlage(englisch, einheit.teile, begriffe)
            texte = [teil["text"] for teil in neu if teil["art"] in ("text", "begriff")]
    except VorlagenFehler as fehler:
        _lehne_ab(einheit, str(fehler), bericht)
        return
    falsch = [zug for text in texte for zug in deutsche_zuege(text)]
    if falsch:
        _lehne_ab(einheit, f"deutsche Züge {', '.join(falsch)}", bericht)
        return
    einheit.setze(neu)
    bericht.uebersetzt += 1
    rest = [wort for text in texte for wort in restdeutsch(text)]
    if rest:
        bericht.warnungen.append(f"{einheit.ort}: {', '.join(rest)} – „{englisch[:70]}“")


def _lehne_ab(einheit: Einheit, grund: str, bericht: Bericht) -> None:
    bericht.fehler.append(f"{einheit.ort}: {grund}")
    bericht.abgelehnt.add(kennung(einheit.vorlage))
    # Wieder offen, damit die Arbeitsdatei die Stelle zur neuen Übersetzung enthält.
    bericht.offen.append(einheit)


def uebersetze(
    daten_de: dict[str, Any], datei: str, tabelle: dict[str, str], begriffe: Callable[[str], str]
) -> tuple[dict[str, Any], Bericht]:
    """Englische Fassung einer Datendatei und der Bericht dazu.

    Eingaben: deutsche Daten, Dateiname („kap01.json“), Tabelle Kennung → englische Vorlage,
    Umrechnung der Glossarbegriffe. Ausgabe: neue Daten (die deutschen bleiben unverändert).
    Beispiel: kap01.json mit vollständiger Tabelle → jede Unterschrift englisch, Bericht ohne Offenes.
    """
    daten = copy.deepcopy(daten_de)
    bericht = Bericht(datei)
    for einheit in einheiten(daten):
        bericht.gesamt += 1
        schluessel = kennung(einheit.vorlage)
        bericht.reihenfolge.append(schluessel)
        englisch = tabelle.get(schluessel)
        if englisch is None:
            bericht.offen.append(einheit)
        else:
            _uebertrage(einheit, englisch, begriffe, bericht)
        angenommen = englisch is not None and schluessel not in bericht.abgelehnt
        bericht.zeilen.append((einheit.ort, einheit.vorlage, englisch if angenommen else None))
    zuege_auf_englisch(daten)
    if "sprache" in daten:
        daten["sprache"] = ZIELSPRACHE
    if datei == "glossar.json":
        _ordne_glossar(daten, begriffe)
    return daten, bericht


def zuege_auf_englisch(wert: Any) -> None:
    """Schreibt die Züge, die die App liest und zeigt, mit englischen Figurenbuchstaben.

    Warum: Die Lösung einer Übung (``erklaerung.loesung``, ``akzeptiert``) und der erfragte Zug
    einer Warum-Frage (``fragen[].zug``) erscheinen in der App so, wie sie in den Daten stehen.
    Die App liest beide Schreibweisen (``zuegeAusText`` in ``training/uebungsaufgabe.ts``), also
    stehen sie in den englischen Daten englisch. Beispiel: „1. Sc7+!“ → „1. Nc7+!“.
    """
    if isinstance(wert, list):
        for eintrag in wert:
            zuege_auf_englisch(eintrag)
        return
    if not isinstance(wert, dict):
        return
    if isinstance(wert.get("loesung"), str):
        wert["loesung"] = zug_auf_englisch(wert["loesung"])
    if isinstance(wert.get("akzeptiert"), list):
        wert["akzeptiert"] = [zug_auf_englisch(zug) for zug in wert["akzeptiert"]]
    for frage in wert.get("fragen", []) if isinstance(wert.get("fragen"), list) else []:
        if isinstance(frage, dict) and isinstance(frage.get("zug"), str):
            frage["zug"] = zug_auf_englisch(frage["zug"])
    for inhalt in wert.values():
        if isinstance(inhalt, dict | list):
            zuege_auf_englisch(inhalt)


def _sortierschluessel(begriff: str) -> tuple[int, str]:
    """Ziffern vorn (wie „#“ in der Buchstabenleiste), sonst alphabetisch ohne Akzente."""
    grund = unicodedata.normalize("NFD", begriff)
    grund = "".join(zeichen for zeichen in grund if not unicodedata.combining(zeichen)).casefold()
    return (0 if grund[:1].isdigit() else 1, grund)


def _ordne_glossar(daten: dict[str, Any], begriffe: Callable[[str], str]) -> None:
    """Querverweise auf die englischen Namen, Einträge nach dem englischen Alphabet."""
    for eintrag in daten["eintraege"]:
        eintrag["verweise"] = [begriffe(verweis) for verweis in eintrag["verweise"]]
    daten["eintraege"].sort(key=lambda eintrag: _sortierschluessel(eintrag["begriff"]))
