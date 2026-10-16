"""Vorbereitete Texte (AP 14): lesen, gegen Buch und Werkzeuge prüfen, Freigegebenes übernehmen.

Wozu diese Datei da ist:
    Für Buchstellungen gibt es kurze Einschätzungen je Werkzeug mit drei Hinweisstufen und
    Warum-Fragen mit Antwortauswahl (Pflichtenheft 3, „Vorbereitete Texte“; Konzept 4.5). Sie
    stehen in ``inhalte/de/texte/vorbereitet-kapNN.json`` mit Status „entwurf“ oder „freigegeben“
    (Schema ``vorbereitet.schema.json``). Claude schreibt die Entwürfe, die Pipeline prüft sie,
    der Autor gibt sie frei. Nur Freigegebenes (mit ``--mit-entwuerfen`` auch Entwürfe, in der App
    gekennzeichnet) kommt als ``abbildung.vorbereitet`` in die App.
    Seit 0.2.27 nur noch die Warum-Fragen: Die Einschätzungen entfallen in der App, damit sie
    nichts aus dem Buch vorwegnehmen (Entscheidung des Autors vom 15.10.2026). Sie bleiben in den
    Dateien und werden weiter geprüft, falls der Autor sie später anders einsetzen möchte.

Prüfungen (Befunde für den Autor, nie stille Korrekturen):
    - Abbildung gibt es im Kapitel nicht (Fehler), Abbildung doppelt (Warnung)
    - Werkzeug unbekannt (Fehler) oder erst in einem späteren Kapitel freigeschaltet (Warnung)
    - Zug einer Warum-Frage (falls angegeben) ab der Stellung der Abbildung nicht spielbar (Warnung)
    - richtige Antwort zeigt auf keine Antwort (Fehler)
    Mit ``--zugzeichen`` prüft ``bewerte_fragen`` mit der Engine, ob der erfragte Zug höchstens
    0,3 Bauerneinheiten schlechter ist als der beste (sonst Hinweis: Fragt die Frage nach einem
    guten Zug, sollte er auch gut sein).
"""

from __future__ import annotations

import json
import re
from collections.abc import Callable, Iterator
from pathlib import Path
from typing import Any

import chess

from pipeline.befunde import Befund, Schwere
from pipeline.lesen.zugfolgen import auf_deutsch, lies_zuege
from pipeline.zugfolgen.anschluss import spiele_zug
from pipeline.zugfolgen.baum import Knoten, neuer_knoten
from pipeline.zugfolgen.zugzeichen import NACHPRUEFTIEFE, RECHENTIEFE, VERLUST_UNGENAU, Zugzeichenpruefer

STATUS_FREIGEGEBEN = "freigegeben"
SCHEMA = "vorbereitet.schema.json"
# Werkzeugkennungen kommen aus den Oberflächentexten der App: Jedes Werkzeug hat dort seinen Namen.
_WERKZEUGNAME = re.compile(r'^\s*"werkzeug\.(k(\d+)-[a-z0-9-]+)\.name"\s*:', re.MULTILINE)

Schemapruefung = Callable[[object, str], list[str]]


def dateiname(kapitel: int) -> str:
    return f"vorbereitet-kap{kapitel:02d}.json"


def lies_vorbereitet(ordner: Path, kapitel: int) -> dict[str, Any] | None:
    """Liest ``vorbereitet-kapNN.json``; fehlt die Datei, gibt es (noch) keine Texte."""
    pfad = ordner / dateiname(kapitel)
    if not pfad.exists():
        return None
    inhalt: dict[str, Any] = json.loads(pfad.read_text(encoding="utf-8"))
    return inhalt


def lies_werkzeuge(oberflaechentexte: Path) -> dict[str, int]:
    """Alle Werkzeuge der App mit dem Kapitel, ab dem sie freigeschaltet sind.

    Beispiel: ``"werkzeug.k1-zaehlen.name"`` in ``app/src/i18n/de.json`` → {"k1-zaehlen": 1}.
    """
    text = oberflaechentexte.read_text(encoding="utf-8")
    return {m.group(1): int(m.group(2)) for m in _WERKZEUGNAME.finditer(text)}


def pruefe_vorbereitet(
    texte: dict[str, Any], kapiteldaten: dict[str, Any], werkzeuge: dict[str, int], datei: str
) -> list[Befund]:
    """Prüft alle vorbereiteten Texte eines Kapitels gegen Abbildungen und Werkzeuge.

    Beispiel: Ein Eintrag zu Abb. 1.26 mit k1-zaehlen und der Frage nach „6. Ld3“ ist in Ordnung;
    k5-bauern an Abb. 1.26 wäre eine Warnung (erst ab Kapitel 5 freigeschaltet).
    """
    fen = {a["id"]: a["fen"] for a in kapiteldaten["abbildungen"]}
    befunde: list[Befund] = []
    gesehen: set[str] = set()
    for eintrag in texte["texte"]:
        nummer = eintrag["abbildung"]
        stelle = f"{datei}: Abb. {nummer}"
        if nummer not in fen:
            befunde.append(
                Befund(Schwere.FEHLER, "vorbereitet-abbildung", f"Abb. {nummer} gibt es nicht", stelle)
            )
            continue
        if nummer in gesehen:
            befunde.append(
                Befund(Schwere.WARNUNG, "vorbereitet-doppelt", f"Abb. {nummer} steht doppelt", stelle)
            )
        gesehen.add(nummer)
        befunde.extend(_pruefe_werkzeuge(eintrag, kapiteldaten["kapitel"], werkzeuge, stelle))
        befunde.extend(_pruefe_fragen(eintrag, fen[nummer], stelle))
    return befunde


def _pruefe_werkzeuge(
    eintrag: dict[str, Any], kapitel: int, werkzeuge: dict[str, int], stelle: str
) -> Iterator[Befund]:
    for einschaetzung in eintrag["einschaetzungen"]:
        kennung = einschaetzung["werkzeug"]
        if kennung not in werkzeuge:
            yield Befund(Schwere.FEHLER, "vorbereitet-werkzeug", f"Werkzeug {kennung} gibt es nicht", stelle)
        elif werkzeuge[kennung] > kapitel:
            text = f"{kennung} ist erst ab Kapitel {werkzeuge[kennung]} freigeschaltet"
            yield Befund(Schwere.WARNUNG, "vorbereitet-freischaltung", text, stelle)


def _pruefe_fragen(eintrag: dict[str, Any], fen: str, stelle: str) -> Iterator[Befund]:
    for frage in eintrag["fragen"]:
        if frage["richtig"] >= len(frage["antworten"]):
            text = f"„{frage['frage']}“: richtige Antwort {frage['richtig']} fehlt"
            yield Befund(Schwere.FEHLER, "vorbereitet-antwort", text, stelle)
        if "zug" in frage and erfragter_zug(fen, frage["zug"]) is None:
            text = f"„{frage['zug']}“ ist ab der Stellung der Abbildung nicht spielbar"
            yield Befund(Schwere.WARNUNG, "vorbereitet-zug", text, stelle)


def erfragter_zug(fen: str, text: str) -> chess.Move | None:
    """Der erste Zug aus ``text`` (deutsch, etwa „6. Ld3“) ab der Stellung, oder None."""
    try:
        zuege = lies_zuege(text) or []
    except ValueError:
        return None
    if not zuege:
        return None
    bewegung = spiele_zug(chess.Board(fen), zuege[0])
    return None if isinstance(bewegung, str) else bewegung


def bewerte_fragen(
    pruefer: Zugzeichenpruefer, texte: dict[str, Any], kapiteldaten: dict[str, Any], datei: str
) -> Iterator[Befund]:
    """Engine-Prüfung der erfragten Züge (wie bei den Lösungserklärungen, Tiefe 14, dann 22)."""
    fen = {a["id"]: a["fen"] for a in kapiteldaten["abbildungen"]}
    for eintrag in texte["texte"]:
        for frage in eintrag["fragen"]:
            stellung = fen.get(eintrag["abbildung"])
            bewegung = erfragter_zug(stellung, frage["zug"]) if stellung and "zug" in frage else None
            if stellung is None or bewegung is None:
                continue
            brett = chess.Board(stellung)
            knoten = neuer_knoten(Knoten(brett, None, "", "", "", ""), bewegung, "", "", datei)
            urteil = pruefer.beurteile(knoten, RECHENTIEFE)
            if urteil.verlust > VERLUST_UNGENAU:
                urteil = pruefer.beurteile(knoten, NACHPRUEFTIEFE)
            if urteil.verlust > VERLUST_UNGENAU:
                text = (
                    f"„{frage['zug']}“: Verlust {urteil.verlust:.1f} gegenüber dem besten Zug "
                    f"{auf_deutsch(urteil.bester)} (Tiefe {NACHPRUEFTIEFE})"
                )
                yield Befund(
                    Schwere.HINWEIS, "vorbereitet-engine", text, f"{datei}: Abb. {eintrag['abbildung']}"
                )


def texte_fuer_app(texte: dict[str, Any] | None, mit_entwuerfen: bool) -> dict[str, dict[str, Any]]:
    """Je Abbildung, was die App zeigt: die Warum-Fragen, nur Freigegebenes (mit
    ``mit_entwuerfen`` auch Entwürfe). Abbildungen ohne Warum-Frage bekommen nichts.

    Beispiel: Abb. 1.26 mit einer Frage zu 6. Ld3 → ``{"1.26": {"status": …, "fragen": [...]}}``.
    """
    if texte is None:
        return {}
    return {
        e["abbildung"]: {"status": e["status"], "fragen": e["fragen"]}
        for e in texte["texte"]
        if (e["status"] == STATUS_FREIGEGEBEN or mit_entwuerfen) and e["fragen"]
    }


def uebernimm_vorbereitete(
    kapiteldaten: list[dict[str, Any]],
    einstellungen: Any,
    pruefe_schema: Schemapruefung,
    befunde: list[Befund],
) -> list[dict[str, Any]]:
    """AP 14 für alle gewählten Kapitel: prüfen, übernehmen; gibt die gelesenen Dateien zurück.

    Eingaben aus den Einstellungen der Pipeline: ``texte`` (Ordner), ``oberflaechentexte``
    (de.json der App), ``mit_entwuerfen`` oder ``text_entwuerfe`` (Entwürfe in die App, nur die
    Texte), ``zugzeichen`` (Engine-Prüfung).
    """
    werkzeuge = lies_werkzeuge(einstellungen.oberflaechentexte)
    pruefer = Zugzeichenpruefer() if einstellungen.zugzeichen else None
    alle: list[dict[str, Any]] = []
    try:
        for daten in kapiteldaten:
            texte = lies_vorbereitet(einstellungen.texte, daten["kapitel"])
            if texte is None:
                continue
            datei = dateiname(daten["kapitel"])
            meldungen = pruefe_schema(texte, SCHEMA)
            befunde.extend(Befund(Schwere.FEHLER, "schema", m, datei) for m in meldungen)
            if meldungen:
                continue
            alle.append(texte)
            befunde.extend(pruefe_vorbereitet(texte, daten, werkzeuge, datei))
            if pruefer is not None:
                befunde.extend(bewerte_fragen(pruefer, texte, daten, datei))
            entwuerfe = einstellungen.mit_entwuerfen or einstellungen.text_entwuerfe
            fuer_app = texte_fuer_app(texte, entwuerfe)
            for abbildung in daten["abbildungen"]:
                if abbildung["id"] in fuer_app:
                    abbildung["vorbereitet"] = fuer_app[abbildung["id"]]
    finally:
        if pruefer is not None:
            pruefer.schliesse()
    return alle


def schreibe_uebersicht(alle: list[dict[str, Any]], ziel: Path, datum: str) -> Path:
    """Schreibt ``buch/arbeit/freigabe/vorbereitet.md``: alle vorbereiteten Texte zum Durchlesen.

    Warum: Der Autor liest Entwürfe lieber als Text als im JSON (wie bei AP 6). Freigeben bleibt
    in der JSON-Datei (``"status": "freigegeben"``); die Übersicht schreibt jeder Datenlauf neu.
    """
    zeilen = [
        "# Vorbereitete Texte (AP 14)",
        "",
        f"Stand: Datenlauf vom {datum}. Bearbeiten und freigeben in "
        '`inhalte/de/texte/vorbereitet-kapNN.json` (`"status": "freigegeben"`).',
    ]
    for texte in alle:
        zeilen += ["", f"## Kapitel {texte['kapitel']}"]
        for eintrag in texte["texte"]:
            zeilen += ["", f"### Abb. {eintrag['abbildung']} ({eintrag['status']})", ""]
            zeilen += _einschaetzungszeilen(eintrag) + _fragezeilen(eintrag)
    ziel.mkdir(parents=True, exist_ok=True)
    pfad = ziel / "vorbereitet.md"
    pfad.write_text("\n".join(zeilen) + "\n", encoding="utf-8")
    return pfad


def _einschaetzungszeilen(eintrag: dict[str, Any]) -> list[str]:
    zeilen = []
    for e in eintrag["einschaetzungen"]:
        zeilen.append(f"- **{e['werkzeug']}:** {e['text']}")
        zeilen += [f"  - Hinweis {stufe}: {text}" for stufe, text in enumerate(e["hinweise"], start=1)]
    return zeilen


def _fragezeilen(eintrag: dict[str, Any]) -> list[str]:
    zeilen = []
    for f in eintrag["fragen"]:
        bezug = f" zu {f['zug']}" if "zug" in f else ""
        zeilen.append(f"- **Warum-Frage{bezug}:** {f['frage']}")
        for stelle, antwort in enumerate(f["antworten"]):
            zeichen = "✓" if stelle == f["richtig"] else "–"
            zeilen.append(f"  - {zeichen} {antwort}")
        zeilen.append(f"  - Erklärung: {f['erklaerung']}")
    return zeilen


__all__ = [
    "bewerte_fragen",
    "dateiname",
    "erfragter_zug",
    "lies_vorbereitet",
    "lies_werkzeuge",
    "pruefe_vorbereitet",
    "schreibe_uebersicht",
    "texte_fuer_app",
    "uebernimm_vorbereitete",
]
