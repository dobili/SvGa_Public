"""Brettbeispiele im Dialog: Wo erklärt eine Figur ein Schachkonzept, und zeigt sie es am Brett?

Warum (Wunsch des Autors, 22.11.2026, wörtlich): „Wenn im Spiel etwas zu Schach erklärt wird, ein
Konzept, eine Regel, ein Werkzeug, insbesondere wenn es Teil meines Buches ist, soll es vom
Erklärenden an einem Beispiel auf dem Brett erklärt werden, sofern es Sinn macht, dass die Figur
gerade ein Brett dabei hat.“

Vorgehen:
1. Fundstellen: Zeilen der Ink-Dialoge mit einem Begriff aus dem Glossar des Buches
   (``app/public/daten/de/a1/glossar.json``, damit die Begriffe des Buches getroffen werden) oder
   einem Erklärmuster (``ERKLAERMUSTER``: Angreifer und Verteidiger, Quadrat, Springerzug …).
   Allgemeine Wörter (``ALLGEMEIN``) und Begriffe mit Alltagsbedeutung (``MEHRDEUTIG``: Loch,
   Flügel, Batterie) zählen nicht.
2. Jede Fundstelle zeigt ein Brett (Marke ``#brett:<kennung>`` oder ``#brett:<kennung>.<bild>`` an
   der Zeile, Daten in ``inhalte/abenteuer/brettbeispiele.json``) oder steht in ``OHNE`` mit Grund
   (je Datei und Knoten): kein Brett zur Hand, nur ein Vergleich, Rätsel folgt …
3. Jede Marke verweist auf ein vorhandenes Beispiel und Bild; das Beispiel stimmt schachlich
   (``brettbeispiel_pruefung.py``).

Aufruf (Hauptordner): ``python -m pipeline.abenteuer.brettbeispiel [--liste] [--bericht DATEI]``.
Rückgabe 1 bei Befunden; Dauertest ``pipeline/tests/test_abenteuer_brettbeispiel.py``.
"""

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer.brettbeispiel_ohne import OHNE

HAUPT = Path(__file__).resolve().parents[2]
DIALOGE = HAUPT / "inhalte" / "abenteuer" / "dialoge" / "de"
BEISPIELE = HAUPT / "inhalte" / "abenteuer" / "brettbeispiele.json"
GLOSSAR = HAUPT / "app" / "public" / "daten" / "de" / "a1" / "glossar.json"
MARKE = re.compile(r"#brett:([a-z][a-zA-Z0-9]*)(?:\.(\d+))?")
# Glossarbegriffe, die im Dialog fast immer allgemein gemeint sind („die Zeit“, „ein Schach“).
ALLGEMEIN = {
    "Figur", "Material", "Zeit", "Linie", "Reihe", "Matt", "Schach", "Ruhe", "Raum", "Spannung",
    "Remis", "Motiv", "Engine", "Notation", "Blitz", "Studie", "Falle", "Opfer", "Drohung", "Tausch",
    "Halbzug", "Endspiel", "Mittelspiel", "Eröffnung", "FIDE", "Kandidat", "Scharf", "Haken", "Basis",
    "Qualität", "Aktivität", "Tempo", "Schwäche", "Initiative", "Kombination", "Elo-Zahl",
    "Wertungszahl", "Repertoire", "Partieformular", "Schachuhr", "Bedenkzeit", "Lange Partie",
    "Klassische Partie", "Freie Partie", "Schnellschach", "Kontrollieren", "Hängen", "Einstellen",
    "Zugrecht", "Kurze und lange Seite", "Lange Seite", "Mattbild",
}  # fmt: skip
# Begriffe mit Alltagsbedeutung, die im Spiel nur so vorkommen (Loch im Dach, Batterie im
# Leuchtfeuer, Flügel des Vogels, der Brückenbauer der Geschichte).
MEHRDEUTIG = {"Loch (Bauernloch)", "Loch", "Flügel", "Batterie", "Brückenbau"}
# Erklärungen ohne Glossarwort (Regeln und Werkzeuge in Alltagssprache).
ERKLAERMUSTER = re.compile(
    r"Angreifer|Verteidiger|Quadrat\b|springt immer|zieht wie|Schach960|en passant|rochier",
    re.I,
)


@dataclass(frozen=True)
class Fund:
    datei: str
    zeile: int
    knoten: str
    sprecher: str
    begriff: str
    text: str
    marke: str | None


def begriffe() -> list[tuple[str, re.Pattern]]:
    """Die Glossarbegriffe als Muster: Wortanfang, Beugungen erlaubt (Gabel, Gabeln, Fesselungen)."""
    eintraege = json.loads(GLOSSAR.read_text(encoding="utf-8"))["eintraege"]
    muster = []
    for e in eintraege:
        kurz = re.sub(r"\s*\(.*\)", "", e["begriff"])
        if kurz in ALLGEMEIN or e["begriff"] in MEHRDEUTIG or kurz in MEHRDEUTIG:
            continue
        stamm = kurz.rstrip("e") if len(kurz) > 5 else kurz
        muster.append((e["begriff"], re.compile(r"(?<![A-Za-zÄÖÜäöüß])" + re.escape(stamm), re.I)))
    return muster


def fundstellen(ordner: Path = DIALOGE) -> list[Fund]:
    """Alle Zeilen mit Sprecher, die einen Begriff oder ein Erklärmuster tragen."""
    muster = begriffe()
    funde = []
    for pfad in sorted(ordner.glob("*.ink")):
        knoten = "?"
        for nr, zeile in enumerate(pfad.read_text(encoding="utf-8").splitlines(), 1):
            kopf = re.match(r"\s*={2,3}\s*(\w+)", zeile)
            if kopf:
                knoten = kopf.group(1)
            sprecher = re.search(r"#sprecher:(\w+)", zeile)
            if not sprecher:
                continue
            text = zeile.split("#")[0].strip()
            marke = MARKE.search(zeile)
            gefunden = [b for b, m in muster if m.search(text)]
            if ERKLAERMUSTER.search(text):
                gefunden.append("Regel oder Werkzeug")
            for b in gefunden[:1]:
                funde.append(
                    Fund(pfad.name, nr, knoten, sprecher.group(1), b, text, marke and marke.group(0))
                )
    return funde


def marken(ordner: Path | None = None) -> list[tuple[str, int, str, int]]:
    """Alle Marken ``#brett`` in den Dialogen: (Datei, Zeile, Kennung, Bild)."""
    gefunden = []
    for pfad in sorted((ordner or DIALOGE).glob("*.ink")):
        for nr, zeile in enumerate(pfad.read_text(encoding="utf-8").splitlines(), 1):
            for m in MARKE.finditer(zeile):
                gefunden.append((pfad.name, nr, m.group(1), int(m.group(2) or 0)))
    return gefunden


def befunde(funde: list[Fund], daten: dict) -> list[str]:
    """Offene Fundstellen, falsche Marken und schachliche Fehler der Beispiele."""
    from pipeline.abenteuer.brettbeispiel_pruefung import pruefe_beispiel

    beispiele = {b["kennung"]: b for b in daten["beispiele"]}
    liste = []
    for f in funde:
        if not f.marke and (f.datei, f.knoten) not in OHNE:
            liste.append(f"{f.datei}:{f.zeile} [{f.knoten}] {f.begriff}: weder Brett noch Grund")
    for datei, nr, kennung, bild in marken():
        b = beispiele.get(kennung)
        if not b or bild >= len(b["bilder"]):
            liste.append(f"{datei}:{nr}: #brett:{kennung}.{bild} gibt es nicht")
    for b in daten["beispiele"]:
        liste += pruefe_beispiel(b)
    benutzt = {k for _, _, k, _ in marken()}
    liste += [f"Beispiel {k} wird nirgends gezeigt" for k in beispiele if k not in benutzt]
    return liste


def bericht(funde: list[Fund]) -> str:
    """Die Liste als Markdown: Stelle, Konzept, mit Brett oder ohne mit Grund."""
    zeilen = ["| Stelle | Sprecher | Konzept | Brett |", "| --- | --- | --- | --- |"]
    for f in funde:
        brett = f"`{f.marke}`" if f.marke else f"ohne: {OHNE.get((f.datei, f.knoten), '–')}"
        zeilen.append(f"| {f.datei}:{f.zeile} ({f.knoten}) | {f.sprecher} | {f.begriff} | {brett} |")
    return "\n".join(zeilen) + "\n"


def hauptprogramm(argv: list[str]) -> int:
    teiler = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    teiler.add_argument("--liste", action="store_true", help="alle Fundstellen mit Entscheidung")
    teiler.add_argument("--bericht", type=Path, help="Liste als Markdown-Tabelle in diese Datei")
    a = teiler.parse_args(argv)
    funde = fundstellen()
    daten = json.loads(BEISPIELE.read_text(encoding="utf-8"))
    if a.liste:
        for f in funde:
            print(f"{f.datei}:{f.zeile} [{f.knoten}] {f.sprecher} <{f.begriff}> {f.marke or 'ohne'}")
    if a.bericht:
        a.bericht.write_text(bericht(funde), encoding="utf-8")
    liste = befunde(funde, daten)
    for b in liste:
        print(b)
    mit = sum(1 for f in funde if f.marke)
    print(f"{len(funde)} Fundstellen, {mit} mit Brett, {len(liste)} Befunde")
    return 1 if liste else 0


if __name__ == "__main__":
    sys.exit(hauptprogramm(sys.argv[1:]))
