"""Datenlauf: liest die Buchkapitel, prüft sie und schreibt die Daten der App.

Aufruf (im Hauptordner des Repositorys):

    python -m pipeline.bauen --buch buch/a1 --ziel app/public/daten/de/a1            # alle Kapitel
    python -m pipeline.bauen --buch buch/a1 --ziel app/public/daten/de/a1 --kapitel 1

Ablauf:
    1. Jede gewählte Kapiteldatei lesen (``pipeline.lesen.diagramme``).
    2. Abbildungen bauen und prüfen (``pipeline.bauen.kapitel``).
    3. Zugfolgen nachspielen (``pipeline.zugfolgen``): Beispiele als PGN-Entwürfe nach
       ``inhalte/de/zugfolgen/kapNN/`` schreiben (freigegebene Dateien bleiben unberührt),
       freigegebene Beispiele in die Kapiteldaten übernehmen und ihre Abbildungen verknüpfen.
       Dazu je Kapitel die Prüfhilfe für die Freigabe ``buch/arbeit/freigabe/kapNN.md`` (AP 4).
    2a. Lösungserklärungen aus ``inhalte/de/texte/`` prüfen, freigegebene übernehmen (AP 6).
    3a. Buchweite Prüfungen aus ``pruefe_buch.py`` (``pipeline.pruefen.buch``), immer über
       alle Kapitel und Anhänge, weil Verweise und Glossar kapitelübergreifend sind.
    4. Jede Datei gegen ihr Schema prüfen (``schemas/``). Passt eine nicht, bricht
       der Lauf ab und schreibt nichts.
    5. ``kapNN.json`` (mit Übungen, Steckbriefen, Bilanzen), ``glossar.json``, ``nachschlagen.json``
       (Denkroutine, Gesamt-Checkliste) und ``index.json``
       schreiben, dazu den Bericht für den Autor.

Rückgabewert: 0 ohne Fehler, 1 wenn mindestens ein Befund der Schwere FEHLER vorliegt.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import sys
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator
from referencing import Registry, Resource

from pipeline.bauen.bericht import schreibe_bericht
from pipeline.bauen.inhalte import baue_glossar, baue_kapitelinhalte
from pipeline.bauen.kapitel import baue_kapitel
from pipeline.befunde import Befund, Schwere
from pipeline.lesen.diagramme import lies_kapitel
from pipeline.lesen.nachschlagen import baue_nachschlagen
from pipeline.lesen.quellen import Quelldatei, lies_quellen
from pipeline.lesen.verzeichnis import Verweisverzeichnis, baue_verzeichnis
from pipeline.pruefen.buch import pruefe_buch
from pipeline.texte.loesungen import uebernimm_erklaerungen
from pipeline.texte.vorbereitet import schreibe_uebersicht as schreibe_vorbereitet
from pipeline.texte.vorbereitet import uebernimm_vorbereitete
from pipeline.zugfolgen.baum import Beispiel
from pipeline.zugfolgen.empfehlungen import lies_empfehlungen
from pipeline.zugfolgen.freigabe import (
    Kapitelpruefhilfe,
    lies_einschaetzungen,
    schreibe_freigabeuebersicht,
    schreibe_pruefhilfe,
)
from pipeline.zugfolgen.kapitel import spiele_kapitel
from pipeline.zugfolgen.nachspielen import Statistik
from pipeline.zugfolgen.pgn import (
    STATUS_ENTWURF,
    abweichung_von_der_datei,
    lies_freigegebene,
    raeume_entwuerfe_auf,
    schreibe_entwurf,
)
from pipeline.zugfolgen.zugzeichen import Zugzeichenpruefer

HAUPTORDNER = Path(__file__).resolve().parents[2]
# Prüfhilfen und Berichte zitieren Buchtext; sie bleiben lokal wie die Buchquellen (CLAUDE.md, Regel 2).
ARBEITSORDNER = HAUPTORDNER / "buch" / "arbeit"
SCHEMAORDNER = HAUPTORDNER / "schemas"


def _schemaregister() -> Registry:
    """Lädt alle Schemas, damit Verweise wie ``abbildung.schema.json#/$defs/...`` auflösen."""
    register = Registry()
    for datei in SCHEMAORDNER.glob("*.schema.json"):
        inhalt = json.loads(datei.read_text(encoding="utf-8"))
        register = register.with_resource(inhalt["$id"], Resource.from_contents(inhalt))
        register = register.with_resource(datei.name, Resource.from_contents(inhalt))
    return register


def pruefe_schema(daten: object, schemaname: str) -> list[str]:
    """Prüft Daten gegen ein Schema und liefert lesbare Fehlermeldungen (leer = gültig)."""
    schema = json.loads((SCHEMAORDNER / schemaname).read_text(encoding="utf-8"))
    pruefer = Draft202012Validator(schema, registry=_schemaregister())
    return [
        f"{'/'.join(str(teil) for teil in fehler.absolute_path) or '(Wurzel)'}: {fehler.message}"
        for fehler in sorted(pruefer.iter_errors(daten), key=lambda f: list(f.absolute_path))
    ]


def _kapiteldateien(buchordner: Path, kapitel: list[int] | None) -> list[Path]:
    """Kapiteldateien in Buchreihenfolge; ohne Auswahl alle kap*.tex."""
    if kapitel is None:
        return sorted((buchordner / "chapters").glob("kap[0-9][0-9]_*.tex"))
    dateien = []
    for nummer in kapitel:
        treffer = sorted((buchordner / "chapters").glob(f"kap{nummer:02d}_*.tex"))
        if not treffer:
            raise SystemExit(f"Keine Kapiteldatei für Kapitel {nummer} in {buchordner}/chapters")
        dateien.append(treffer[0])
    return dateien


def _einstellungen(argumente: list[str] | None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Datenlauf für die Companion-App")
    parser.add_argument("--buch", type=Path, required=True, help="Ordner mit main.tex und chapters/")
    parser.add_argument("--ziel", type=Path, required=True, help="Zielordner, etwa app/public/daten/de/a1")
    parser.add_argument("--kapitel", type=int, nargs="+", help="Kapitelnummern (Standard: alle)")
    parser.add_argument("--auflage", type=int, default=1)
    parser.add_argument("--sprache", default="de")
    parser.add_argument("--datum", default=dt.date.today().isoformat(), help="Datenstand, Standard heute")
    parser.add_argument("--bericht", type=Path, default=ARBEITSORDNER / "berichte", help="nur lokal")
    parser.add_argument(
        "--zugfolgen",
        type=Path,
        default=HAUPTORDNER / "inhalte" / "de" / "zugfolgen",
        help="Ordner der PGN-Dateien (Entwürfe und freigegebene)",
    )
    parser.add_argument("--ohne-zugfolgen", action="store_true", help="Zugfolgen nicht nachspielen")
    parser.add_argument(
        "--mit-entwuerfen",
        action="store_true",
        help="Auch Entwürfe (PGN, vorbereitete Texte) in die App, als „Entwurf“ markiert",
    )
    parser.add_argument(
        "--text-entwuerfe",
        action="store_true",
        help="Nur die Entwürfe der vorbereiteten Texte (AP 14) in die App, zur Durchsicht durch den Autor",
    )
    parser.add_argument(
        "--freigabe", type=Path, default=ARBEITSORDNER / "freigabe", help="Ordner der Prüfhilfe, nur lokal"
    )
    parser.add_argument(
        "--texte",
        type=Path,
        default=HAUPTORDNER / "inhalte" / "de" / "texte",
        help="Ordner der Lösungserklärungen (AP 6) und vorbereiteten Texte (AP 14)",
    )
    parser.add_argument(
        "--oberflaechentexte",
        type=Path,
        default=HAUPTORDNER / "app" / "src" / "i18n" / "de.json",
        help="Oberflächentexte der App; daraus die Kennungen der Werkzeuge (AP 14)",
    )
    parser.add_argument(
        "--einschaetzungen",
        type=Path,
        default=HAUPTORDNER / "inhalte" / "de" / "einschaetzungen.json",
        help="Von Hand gepflegte Einschätzungen zu Befunden",
    )
    parser.add_argument(
        "--zugzeichen", action="store_true", help="Zugzeichen mit Stockfish prüfen (langsam, Schritt 5)"
    )
    return parser.parse_args(argumente)


def main(argumente: list[str] | None = None) -> int:
    einstellungen = _einstellungen(argumente)
    quellen = lies_quellen(einstellungen.buch)
    verweise = baue_verzeichnis(quellen)
    befunde: list[Befund] = []
    kapiteldaten = [
        _baue_kapiteldatei(datei, quellen, verweise, einstellungen.auflage, befunde)
        for datei in _kapiteldateien(einstellungen.buch, einstellungen.kapitel)
    ]
    uebernimm_erklaerungen(kapiteldaten, einstellungen, pruefe_schema, befunde)
    vorbereitet = uebernimm_vorbereitete(kapiteldaten, einstellungen, pruefe_schema, befunde)
    if vorbereitet and einstellungen.kapitel is None:
        schreibe_vorbereitet(vorbereitet, einstellungen.freigabe, einstellungen.datum)
    zugfolgen_statistik: dict[int, Statistik] = {}
    if not einstellungen.ohne_zugfolgen:
        zugfolgen_statistik = _spiele_zugfolgen(kapiteldaten, quellen, verweise, einstellungen, befunde)
    glossar = _baue_glossardatei(quellen, verweise, befunde)
    nachschlagen, nachschlagebefunde = baue_nachschlagen(quellen)
    befunde.extend(nachschlagebefunde)
    for meldung in pruefe_schema(nachschlagen, "nachschlagen.schema.json"):
        befunde.append(Befund(Schwere.FEHLER, "schema", meldung, "nachschlagen.json"))
    verzeichnis = _verzeichnis(kapiteldaten, einstellungen)
    for meldung in pruefe_schema(verzeichnis, "index.schema.json"):
        befunde.append(Befund(Schwere.FEHLER, "schema", meldung, "index.json"))
    befunde.extend(pruefe_buch(quellen))

    berichtsdatei = schreibe_bericht(
        befunde, kapiteldaten, einstellungen.datum, einstellungen.bericht, zugfolgen_statistik
    )
    fehler = [b for b in befunde if b.schwere == Schwere.FEHLER]
    if fehler:
        print(f"{len(fehler)} Fehler, nichts geschrieben. Bericht: {berichtsdatei}", file=sys.stderr)
        return 1
    einstellungen.ziel.mkdir(parents=True, exist_ok=True)
    for daten in kapiteldaten:
        _schreibe_json(einstellungen.ziel / f"kap{daten['kapitel']:02d}.json", daten)
    _schreibe_json(einstellungen.ziel / "glossar.json", glossar)
    _schreibe_json(einstellungen.ziel / "nachschlagen.json", nachschlagen)
    _schreibe_json(einstellungen.ziel / "index.json", verzeichnis)
    anzahl = sum(len(d["abbildungen"]) for d in kapiteldaten)
    uebungen = sum(len(d["uebungen"]) for d in kapiteldaten)
    print(
        f"{anzahl} Abbildungen, {uebungen} Übungen, {len(glossar['eintraege'])} Glossareinträge "
        f"geschrieben nach {einstellungen.ziel}. Bericht: {berichtsdatei}"
    )
    return 0


def _baue_kapiteldatei(
    datei: Path, quellen: list[Quelldatei], verweise: Verweisverzeichnis, auflage: int, befunde: list[Befund]
) -> dict[str, Any]:
    """Abbildungen, Übungen, Steckbriefe und Bilanzen eines Kapitels, gegen das Schema geprüft."""
    ergebnis = baue_kapitel(lies_kapitel(datei), auflage)
    befunde.extend(ergebnis.befunde)
    quelle = next(q for q in quellen if q.name == datei.name)
    inhalte, inhaltsbefunde = baue_kapitelinhalte(quelle, verweise)
    ergebnis.daten.update(inhalte)
    befunde.extend(inhaltsbefunde)
    for meldung in pruefe_schema(ergebnis.daten, "kapitel.schema.json"):
        befunde.append(Befund(Schwere.FEHLER, "schema", meldung, datei.name))
    return ergebnis.daten


def _spiele_zugfolgen(
    kapiteldaten: list[dict[str, Any]],
    quellen: list[Quelldatei],
    verweise: Verweisverzeichnis,
    einstellungen: argparse.Namespace,
    befunde: list[Befund],
) -> dict[int, Statistik]:
    """Spielt die Zugfolgen aller gewählten Kapitel nach, schreibt Entwürfe, übernimmt Freigegebenes.

    Die Beispiele früherer Kapitel bleiben verfügbar, weil spätere Kapitel sie fortsetzen.
    Freigegebene PGN kommen in ``kapNN.json`` (``beispiele``) und verknüpfen ihre Abbildungen
    (``abbildung.beispiel``); Entwürfe bleiben außerhalb der App.
    """
    statistik: dict[int, Statistik] = {}
    fruehere: list[Beispiel] = []
    hilfen: list[Kapitelpruefhilfe] = []
    for daten in kapiteldaten:
        kapitel = daten["kapitel"]
        quelle = next(q for q in quellen if q.kapitel == kapitel)
        ergebnis = spiele_kapitel(
            quelle, lies_kapitel(einstellungen.buch / "chapters" / quelle.name), verweise, fruehere
        )
        befunde.extend(ergebnis.befunde)
        statistik[kapitel] = ergebnis.statistik
        fruehere.extend(ergebnis.beispiele)
        hilfen.append(Kapitelpruefhilfe(kapitel, daten["titel"], quelle.name, ergebnis.beispiele, []))
        geschrieben = _schreibe_entwuerfe(ergebnis.beispiele, quelle.name, einstellungen.zugfolgen, befunde)
        raeume_entwuerfe_auf(einstellungen.zugfolgen, kapitel, geschrieben)
        _uebernimm_freigegebene(daten, einstellungen.zugfolgen, einstellungen.mit_entwuerfen, befunde)
    if einstellungen.zugzeichen:
        pruefer = Zugzeichenpruefer()
        try:
            befunde.extend(pruefer.pruefe(fruehere))
        finally:
            pruefer.schliesse()
    _schreibe_pruefhilfen(hilfen, befunde, einstellungen)
    return statistik


def _schreibe_entwuerfe(
    beispiele: list[Beispiel], quelldatei: str, ordner: Path, befunde: list[Befund]
) -> set[Path]:
    """PGN-Entwürfe schreiben; weicht eine vom Autor bearbeitete Datei ab, gibt es einen Hinweis."""
    geschrieben = set()
    for beispiel in beispiele:
        if beispiel.anzahl_zuege() == 0:
            continue
        pfad, neu = schreibe_entwurf(beispiel, ordner)
        geschrieben.add(pfad)
        abweichung = None if neu else abweichung_von_der_datei(pfad, beispiel)
        if abweichung is not None:
            erste = next(iter(beispiel.abbildungen()), None)
            befunde.append(Befund(Schwere.HINWEIS, "entwurf-abweichend", abweichung, quelldatei, erste))
    return geschrieben


def _schreibe_pruefhilfen(
    hilfen: list[Kapitelpruefhilfe], befunde: list[Befund], einstellungen: argparse.Namespace
) -> None:
    """AP 4: ``buch/arbeit/freigabe/kapNN.md`` je Kapitel, ``README.md`` nur bei allen Kapiteln."""
    einschaetzungen = lies_einschaetzungen(einstellungen.einschaetzungen)
    empfehlungen = lies_empfehlungen(einstellungen.einschaetzungen.with_name("empfehlungen.json"))
    for hilfe in hilfen:
        hilfe.ohne_zugfolge = [
            b.abbildung
            for b in befunde
            if b.kennung == "abbildung-ohne-zugfolge"
            and b.abbildung
            and b.fundstelle.partition(":")[0] == hilfe.quelldatei
        ]
        schreibe_pruefhilfe(
            hilfe,
            befunde,
            einschaetzungen,
            einstellungen.zugfolgen,
            einstellungen.freigabe,
            einstellungen.datum,
            empfehlungen,
        )
    if einstellungen.kapitel is None:
        schreibe_freigabeuebersicht(
            hilfen, befunde, einschaetzungen, einstellungen.freigabe, einstellungen.datum
        )


def _uebernimm_freigegebene(
    daten: dict[str, Any], ordner: Path, mit_entwuerfen: bool, befunde: list[Befund]
) -> None:
    """Schritt 4 „Zugfolgen abgleichen“: freigegebene PGN in die Kapiteldaten, Abbildungen verknüpfen.

    Mit ``mit_entwuerfen`` auch Entwürfe; eine Abbildung behält die erste Verknüpfung (freigegebene
    kommen zuerst). Befunde zu Entwürfen meldet schon der Bericht über die Zugfolgen.
    """
    abbildungen = {a["id"]: a for a in daten["abbildungen"]}
    daten["beispiele"] = []
    for freigegeben in lies_freigegebene(
        ordner, daten["kapitel"], {n: a["fen"] for n, a in abbildungen.items()}, mit_entwuerfen
    ):
        if freigegeben.daten.get("status") != STATUS_ENTWURF:
            befunde.extend(freigegeben.befunde)
        if not freigegeben.daten:
            continue
        daten["beispiele"].append(freigegeben.daten)
        for nummer, pfad in freigegeben.verknuepfungen.items():
            if abbildungen[nummer].get("beispiel") is None:
                abbildungen[nummer]["beispiel"] = {"id": freigegeben.daten["id"], "pfad": pfad}
    for meldung in pruefe_schema(daten, "kapitel.schema.json"):
        befunde.append(Befund(Schwere.FEHLER, "schema", meldung, f"kap{daten['kapitel']:02d}.json"))


def _baue_glossardatei(
    quellen: list[Quelldatei], verweise: Verweisverzeichnis, befunde: list[Befund]
) -> dict[str, Any]:
    """Das Glossar aus anhang_glossar.tex; fehlt der Anhang (Testbuch), ist es leer."""
    quelle = next((q for q in quellen if q.name == "anhang_glossar.tex"), None)
    if quelle is None:
        return {"schemaVersion": 1, "eintraege": []}
    glossar, glossarbefunde = baue_glossar(quelle, verweise)
    befunde.extend(glossarbefunde)
    for meldung in pruefe_schema(glossar, "glossar.schema.json"):
        befunde.append(Befund(Schwere.FEHLER, "schema", meldung, quelle.name))
    return glossar


def _verzeichnis(kapiteldaten: list[dict[str, Any]], einstellungen: argparse.Namespace) -> dict[str, Any]:
    """index.json: Sprache, Auflage, Datenstand, Kapitel mit ihren Abbildungen, Glossar."""
    return {
        "schemaVersion": 1,
        "sprache": einstellungen.sprache,
        "auflage": einstellungen.auflage,
        "datenstand": einstellungen.datum,
        "kapitel": [
            {
                "kapitel": daten["kapitel"],
                "titel": daten["titel"],
                "datei": f"kap{daten['kapitel']:02d}.json",
                "abbildungen": [a["id"] for a in daten["abbildungen"]],
            }
            for daten in kapiteldaten
        ],
        "glossar": "glossar.json",
        "nachschlagen": "nachschlagen.json",
    }


def _schreibe_json(pfad: Path, daten: object) -> None:
    # Eingerückt und mit Umlauten im Klartext: Änderungen sind im Versionsverlauf lesbar.
    pfad.write_text(json.dumps(daten, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    raise SystemExit(main())
