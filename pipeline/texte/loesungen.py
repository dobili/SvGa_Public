"""Knappe Lösungserklärungen der Übungen (AP 6): lesen, gegen das Buch prüfen, Freigegebenes übernehmen.

Wozu diese Datei da ist:
    Zu jeder Übung gibt es eine knappe Erklärung in zwei bis drei Sätzen (Konzept 4.3): Lösungszug,
    Motiv, Kern der Idee. Sie steht in ``inhalte/de/texte/loesungen-kapNN.json`` mit Status
    „entwurf“ oder „freigegeben“ (Schema ``loesungstexte.schema.json``). Die Pipeline prüft jede
    Erklärung gegen das Buch und übernimmt nur freigegebene als ``uebung.erklaerung`` in die App.

Prüfungen (Befunde für den Autor, nie stille Korrekturen):
    - Übung unbekannt (Fehler) oder Nummer passt nicht (Warnung)
    - Lösungszüge oder akzeptierte Züge nicht spielbar ab der Übungsstellung (Warnung)
    - erster Lösungszug kommt in der Buchlösung nicht vor (Warnung)
    - Übung ohne Erklärung (Hinweis)
    Mit ``--zugzeichen`` prüft ``bewerte_loesungen`` zusätzlich mit der Engine, ob der erste
    Lösungszug höchstens 0,3 Bauerneinheiten schlechter ist als der beste.
"""

from __future__ import annotations

import json
from collections.abc import Callable, Iterator
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import chess

from pipeline.befunde import Befund, Schwere
from pipeline.lesen.zugfolgen import Zug, auf_deutsch, lies_zuege
from pipeline.zugfolgen.anschluss import spiele_zug
from pipeline.zugfolgen.baum import Knoten, neuer_knoten
from pipeline.zugfolgen.zugzeichen import NACHPRUEFTIEFE, RECHENTIEFE, VERLUST_UNGENAU, Zugzeichenpruefer

STATUS_FREIGEGEBEN = "freigegeben"
_FELDER_DER_APP = ("loesung", "akzeptiert", "motiv", "text")


@dataclass
class Loesungsstellung:
    """Was die Prüfung je Übung braucht: Stellung der Aufgabe und Züge der Buchlösung."""

    nummer: int
    fen: str | None  # erste Abbildung der Übung; None bei reinen Textübungen
    buchzuege: set[str]  # englische Kurznotation ohne Schachzeichen, aus allen Lösungs-Zugfolgen


def lies_loesungstexte(ordner: Path, kapitel: int) -> dict[str, Any] | None:
    """Liest ``loesungen-kapNN.json``; fehlt die Datei, gibt es (noch) keine Erklärungen."""
    pfad = ordner / f"loesungen-kap{kapitel:02d}.json"
    if not pfad.exists():
        return None
    inhalt: dict[str, Any] = json.loads(pfad.read_text(encoding="utf-8"))
    return inhalt


def stellungen_der_uebungen(kapiteldaten: dict[str, Any]) -> dict[str, Loesungsstellung]:
    """Je Übungslabel Nummer, Aufgabenstellung und die Züge der Buchlösung (aus ``kapNN.json``)."""
    fen = {a["id"]: a["fen"] for a in kapiteldaten["abbildungen"]}
    ergebnis = {}
    for uebung in kapiteldaten["uebungen"]:
        buchzuege: set[str] = set()
        for teil in uebung["loesung"]:
            if teil["art"] == "zug":
                buchzuege |= {_ohne_zeichen(z.san) for z in _zuege_oder_leer(teil["text"])}
        # Ohne eigenes Diagramm gilt das, auf das die Aufgabe verweist (Légal-Falle: Abb. 4.18).
        verweise = [teil["abbildung"] for teil in uebung["aufgabe"] if teil["art"] == "verweis"]
        nummern = uebung["abbildungen"] or verweise
        erste = fen.get(nummern[0]) if nummern else None
        ergebnis[uebung["id"]] = Loesungsstellung(uebung["nummer"], erste, buchzuege)
    return ergebnis


def pruefe_loesungstexte(
    texte: dict[str, Any], stellungen: dict[str, Loesungsstellung], datei: str
) -> list[Befund]:
    """Prüft alle Erklärungen eines Kapitels gegen die Übungen des Buches.

    Beispiel: „1. Sc7+!“ zu Übung 4 (Abb. 1.40) ist ab der Stellung spielbar und steht in der
    Buchlösung; kein Befund. Stünde dort „1. Sd6+“, gäbe es die Warnung ``erklaerung-buch``.
    """
    befunde: list[Befund] = []
    erklaert = set()
    for eintrag in texte["erklaerungen"]:
        label = eintrag["uebung"]
        erklaert.add(label)
        stelle = f"{datei}: {label}"
        stellung = stellungen.get(label)
        if stellung is None:
            befunde.append(
                Befund(Schwere.FEHLER, "erklaerung-uebung", f"Übung {label} gibt es nicht", stelle)
            )
            continue
        if eintrag["nummer"] != stellung.nummer:
            text = f"Nummer {eintrag['nummer']} statt Übung {stellung.nummer}"
            befunde.append(Befund(Schwere.WARNUNG, "erklaerung-nummer", text, stelle))
        befunde.extend(_pruefe_zuege(eintrag, stellung, stelle))
    for label, stellung in stellungen.items():
        if label not in erklaert:
            text = f"Übung {stellung.nummer} ({label}) hat noch keine Erklärung"
            befunde.append(Befund(Schwere.HINWEIS, "erklaerung-fehlt", text, datei))
    return befunde


def _pruefe_zuege(eintrag: dict[str, Any], stellung: Loesungsstellung, stelle: str) -> Iterator[Befund]:
    """Lösung und akzeptierte Züge spielbar? Erster Lösungszug in der Buchlösung?"""
    for text in [eintrag["loesung"], *eintrag["akzeptiert"]]:
        if text is None:
            continue
        zuege = _zuege_oder_leer(text)
        if not zuege or startbrett(stellung.fen, zuege) is None:
            yield Befund(
                Schwere.WARNUNG, "erklaerung-zug", f"„{text}“ ist ab der Übung nicht spielbar", stelle
            )
            continue
        if text == eintrag["loesung"] and _ohne_zeichen(zuege[0].san) not in stellung.buchzuege:
            meldung = f"„{zuege[0].buchtext}“ steht nicht in der Buchlösung"
            yield Befund(Schwere.WARNUNG, "erklaerung-buch", meldung, stelle)


def startbrett(fen: str | None, zuege: list[Zug]) -> chess.Board | None:
    """Die Stellung, ab der die Züge spielbar sind: die Übung, sonst die Grundstellung, sonst None.

    Warum die Grundstellung: Textübungen (Übung 3) und Lösungen, die eine Eröffnung ab dem ersten
    Zug aufschreiben, beginnen dort.
    """
    for kandidat in [fen, chess.STARTING_FEN]:
        if kandidat is None:
            continue
        brett = chess.Board(kandidat)
        probe = brett.copy()
        if all(_spiele(probe, zug) for zug in zuege):
            return brett
    return None


def _spiele(brett: chess.Board, zug: Zug) -> bool:
    bewegung = spiele_zug(brett, zug)
    if isinstance(bewegung, str):
        return False
    brett.push(bewegung)
    return True


def bewerte_loesungen(
    pruefer: Zugzeichenpruefer, texte: dict[str, Any], stellungen: dict[str, Loesungsstellung], datei: str
) -> Iterator[Befund]:
    """Engine-Prüfung: Ist der erste Lösungszug höchstens 0,3 schlechter als der beste?

    Wie bei den Zugzeichen erst Tiefe 14, eine Abweichung wird mit Tiefe 22 bestätigt. Führen beide
    Züge in ein Matt derselben Seite, gilt der Verlust als 0 (Matt in drei statt in zwei ist kein
    Fehler der Lösung).
    """
    for eintrag in texte["erklaerungen"]:
        stellung = stellungen.get(eintrag["uebung"])
        zuege = _zuege_oder_leer(eintrag["loesung"] or "")
        brett = startbrett(stellung.fen, zuege) if stellung and zuege else None
        if brett is None:
            continue
        knoten = neuer_knoten(
            Knoten(brett, None, "", "", "", ""), brett.parse_san(zuege[0].san), "", "", datei
        )
        urteil = pruefer.beurteile(knoten, RECHENTIEFE)
        if urteil.verlust > VERLUST_UNGENAU:
            urteil = pruefer.beurteile(knoten, NACHPRUEFTIEFE)
        if urteil.verlust > VERLUST_UNGENAU:
            text = (
                f"„{zuege[0].buchtext}“: Verlust {urteil.verlust:.1f} gegenüber dem besten Zug "
                f"{auf_deutsch(urteil.bester)} (Tiefe {NACHPRUEFTIEFE})"
            )
            yield Befund(Schwere.HINWEIS, "erklaerung-engine", text, f"{datei}: {eintrag['uebung']}")


def erklaerungen_fuer_app(texte: dict[str, Any] | None) -> dict[str, dict[str, Any]]:
    """Nur freigegebene Erklärungen, je Übungslabel mit den Feldern, die die App zeigt."""
    if texte is None:
        return {}
    return {
        eintrag["uebung"]: {feld: eintrag[feld] for feld in _FELDER_DER_APP}
        for eintrag in texte["erklaerungen"]
        if eintrag["status"] == STATUS_FREIGEGEBEN
    }


def schreibe_uebersicht(alle: list[dict[str, Any]], ziel: Path, datum: str) -> Path:
    """Schreibt ``buch/arbeit/freigabe/erklaerungen.md``: alle Erklärungen zum Durchlesen, nach Kapitel.

    Warum: Der Autor liest die Entwürfe lieber als Text als im JSON. Freigeben bleibt in der
    JSON-Datei („status“: „freigegeben“).
    """
    zeilen = [
        "# Lösungserklärungen (AP 6)",
        "",
        f"Stand: Datenlauf vom {datum}. Bearbeiten und freigeben in `inhalte/de/texte/loesungen-kapNN.json`"
        ' (`"status": "freigegeben"`); diese Übersicht schreibt jeder Datenlauf neu.',
    ]
    for texte in alle:
        zeilen += ["", f"## Kapitel {texte['kapitel']}", ""]
        for e in texte["erklaerungen"]:
            loesung = f" · Lösung: {e['loesung']}" if e["loesung"] else ""
            akzeptiert = f" (auch {', '.join(e['akzeptiert'])})" if e["akzeptiert"] else ""
            zeilen.append(f"- **Übung {e['nummer']}** ({e['status']}) · {e['motiv']}{loesung}{akzeptiert}  ")
            zeilen.append(f"  {e['text']}")
    ziel.mkdir(parents=True, exist_ok=True)
    pfad = ziel / "erklaerungen.md"
    pfad.write_text("\n".join(zeilen) + "\n", encoding="utf-8")
    return pfad


def uebernimm_erklaerungen(
    kapiteldaten: list[dict[str, Any]],
    einstellungen: Any,
    pruefe_schema: Callable[[object, str], list[str]],
    befunde: list[Befund],
) -> None:
    """AP 6 im Datenlauf: Erklärungen prüfen, freigegebene als ``uebung.erklaerung`` übernehmen.

    Eingaben aus den Einstellungen der Pipeline: ``texte`` (Ordner), ``zugzeichen`` (Engine),
    ``kapitel`` (nur bei allen Kapiteln wird die Übersicht geschrieben), ``freigabe``, ``datum``.
    """
    pruefer = Zugzeichenpruefer() if einstellungen.zugzeichen else None
    alle: list[dict[str, Any]] = []
    try:
        for daten in kapiteldaten:
            texte = lies_loesungstexte(einstellungen.texte, daten["kapitel"])
            if texte is None:
                continue
            alle.append(texte)
            datei = f"loesungen-kap{daten['kapitel']:02d}.json"
            meldungen = pruefe_schema(texte, "loesungstexte.schema.json")
            befunde.extend(Befund(Schwere.FEHLER, "schema", m, datei) for m in meldungen)
            if meldungen:
                continue
            stellungen = stellungen_der_uebungen(daten)
            befunde.extend(pruefe_loesungstexte(texte, stellungen, datei))
            if pruefer is not None:
                befunde.extend(bewerte_loesungen(pruefer, texte, stellungen, datei))
            freigegeben = erklaerungen_fuer_app(texte)
            for uebung in daten["uebungen"]:
                if uebung["id"] in freigegeben:
                    uebung["erklaerung"] = freigegeben[uebung["id"]]
    finally:
        if pruefer is not None:
            pruefer.schliesse()
    if alle and einstellungen.kapitel is None:
        schreibe_uebersicht(alle, einstellungen.freigabe, einstellungen.datum)


def _zuege_oder_leer(text: str) -> list[Zug]:
    try:
        return lies_zuege(text) or []
    except ValueError:
        return []


def _ohne_zeichen(san: str) -> str:
    return san.rstrip("+#")


__all__ = [
    "Loesungsstellung",
    "bewerte_loesungen",
    "erklaerungen_fuer_app",
    "lies_loesungstexte",
    "pruefe_loesungstexte",
    "schreibe_uebersicht",
    "startbrett",
    "stellungen_der_uebungen",
    "uebernimm_erklaerungen",
]
