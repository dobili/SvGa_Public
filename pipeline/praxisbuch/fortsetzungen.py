"""Fortsetzungen der Eröffnungen aus der Praxis: die häufigsten Folgezüge je Wertungsband.

Rolle im Gesamtbild: Wunsch des Autors (1.11.2026, Entscheidung zu N2538): Die Varianten „Aus der
Praxis (Lichess)“ im Repertoire-Trainer enden am namengebenden Zug und sind deshalb kurz. Diese
Datei hängt an jede Zugfolge der Eröffnungen nach Spielstärke (eroeffnungsbaender.json, Familien,
Varianten, Gambits) die häufigsten Folgezüge echter Spieler an, getrennt je 200er-Band. Die Daten
sind dieselben Zählungen des Lichess-Monats wie beim Praxisbuch (September 2026, CC0, die ersten
20 Halbzüge, nur lokal in buch/arbeit/praxisbuch/). Das Praxisbuch der Bots (praxisbuch.json)
reicht dafür nicht: Es behält in großen Zellen nur sehr häufige Stellungen (Größenbudget), und
mehr Tiefe dort würde die geeichten Bots verändern. Deshalb eine eigene, kleine Datei.

Regeln (Empfehlung im Bericht rv, Wunsch des Autors):
- In jeder Stellung zählt der häufigste Zug im Band, für beide Seiten (der Leser und seine Gegner
  spielen im selben Band); die Zeitklassen werden zusammengezählt (mehr Partien, dieselbe Theorie).
- Weiter nur, solange die Stellung im Band mindestens MINDEST_PARTIEN Partien hat und der
  häufigste Zug mindestens MINDEST_ANTEIL der Partien ausmacht (sonst ist er Zufall).
- Höchstens HOECHSTENS Halbzüge über den Namen hinaus, und die Zählung endet nach 20 Halbzügen.
- Weniger als MINDEST_LAENGE angehängte Halbzüge: keine Verlängerung (Daten zu dünn).

Ausgabe (app/public/daten/praxisfortsetzungen.json): {"quelle", "baender", "regeln",
"fortsetzungen": {Zugfolge: [Fortsetzung je Band, "" ohne]}}; gleiche Nachbarn fasst gzip.

Aufruf: python -m pipeline.praxisbuch.fortsetzungen BAENDER.json ZIEL.json voll.tsv [voll2.tsv …]
"""

from __future__ import annotations

import json
import sys
from collections import defaultdict
from pathlib import Path

from pipeline.praxisbuch.baue import BAENDER, HALBZUEGE, ZEITKLASSEN, lies

#: So viele Partien braucht eine Stellung im Band, damit ihr häufigster Zug zählt.
MINDEST_PARTIEN = 100
#: So groß muss der Anteil des häufigsten Zuges sein (Bruchteil der Partien der Stellung).
MINDEST_ANTEIL = 0.2
#: Höchstens so viele Halbzüge über den Namen hinaus (Wunsch: etwa 8 bis 12).
HOECHSTENS = 10
#: Kürzere Fortsetzungen fallen weg (ein einzelner Halbzug lohnt die Abfrage nicht).
MINDEST_LAENGE = 2

#: (Zelle, Hash davor) → [(Zug, Hash danach, Anzahl)]
Kinder = dict[tuple[int, int], list[tuple[str, int, int]]]


def kinder_nach_stellung(eintraege) -> tuple[Kinder, dict[tuple[int, str], int]]:
    """Die Züge je Zelle und Stellung, dazu (Hash, Zug) → Hash danach (für den Weg zur Folge)."""
    kinder: Kinder = defaultdict(list)
    kante: dict[tuple[int, str], int] = {}
    for zelle, vorher, nachher, zug, anzahl in eintraege:
        kinder[(zelle, vorher)].append((zug, nachher, anzahl))
        kante.setdefault((vorher, zug), nachher)
    return kinder, kante


def hash_der_folge(folge: list[str], kante: dict[tuple[int, str], int]) -> int | None:
    """Der Hash nach der Zugfolge ab der Grundstellung (0), None, wenn sie nicht gezählt ist."""
    h = 0
    for zug in folge:
        naechster = kante.get((h, zug))
        if naechster is None:
            return None
        h = naechster
    return h


def haeufigster(kinder: Kinder, h: int, band: int) -> tuple[str, int] | None:
    """
    Der häufigste Zug im Band nach dem Hash, über alle Zeitklassen, oder None (zu selten, unklar).
    Beispiel: nach 1. e4 c5 2. Sf3 Sc6 im Band 1200 → („d4“, Hash danach).
    """
    je_zug: dict[str, list[int]] = {}
    for k in range(len(ZEITKLASSEN)):
        for zug, nachher, anzahl in kinder.get((k * len(BAENDER) + band, h), []):
            eintrag = je_zug.setdefault(zug, [nachher, 0])
            eintrag[1] += anzahl
    summe = sum(a for _, a in je_zug.values())
    if summe < MINDEST_PARTIEN:
        return None
    zug, (nachher, anzahl) = max(je_zug.items(), key=lambda x: (x[1][1], x[0]))
    return (zug, nachher) if anzahl >= MINDEST_ANTEIL * summe else None


def fortsetzung(folge: list[str], band: int, kinder: Kinder, kante) -> list[str]:
    """
    Die häufigsten Folgezüge nach der Zugfolge im Band, leer bei zu dünnen Daten.
    Beispiel: „Old Sicilian“ (e4 c5 Nf3 Nc6), Band 1200 → d4 cxd4 Nxd4 … (bis zu zehn Halbzüge).
    """
    h = hash_der_folge(folge, kante)
    aus: list[str] = []
    while h is not None and len(aus) < HOECHSTENS and len(folge) + len(aus) < HALBZUEGE:
        zug = haeufigster(kinder, h, band)
        if zug is None:
            break
        aus.append(zug[0])
        h = zug[1]
    return aus if len(aus) >= MINDEST_LAENGE else []


def zugfolgen_der_baender(baender: dict) -> list[str]:
    """Alle Zugfolgen der Eröffnungen nach Spielstärke: Familien, Varianten, Gambits."""
    folgen = [f["folge"] for f in baender["familien"]]
    folgen += [v["folge"] for f in baender["familien"] for v in f["varianten"]]
    folgen += [g["folge"] for g in baender["gambits"]]
    return sorted(set(folgen))


def baue_fortsetzungen(baender: dict, eintraege) -> dict[str, list[str]]:
    """Je Zugfolge die Fortsetzung je Band; Folgen ganz ohne Fortsetzung fallen weg."""
    kinder, kante = kinder_nach_stellung(eintraege)
    aus: dict[str, list[str]] = {}
    for folge in zugfolgen_der_baender(baender):
        zuege = folge.split(" ")
        je_band = [" ".join(fortsetzung(zuege, b, kinder, kante)) for b in range(len(BAENDER))]
        if any(je_band):
            aus[folge] = je_band
    return aus


def daten_der_datei(fortsetzungen: dict[str, list[str]]) -> dict:
    """Der Inhalt der Datei: Quelle, Bänder, Regeln und die Fortsetzungen."""
    return {
        "quelle": "Lichess-Datenbank 2026-09, gewertete Partien Blitz, Schnellschach, Klassisch (CC0)",
        "baender": BAENDER,
        "regeln": {
            "mindestPartien": MINDEST_PARTIEN,
            "mindestAnteil": MINDEST_ANTEIL,
            "hoechstens": HOECHSTENS,
        },
        "fortsetzungen": fortsetzungen,
    }


def baue(baender_datei: Path, ziel: Path, dateien: list[Path]) -> None:
    """Liest Zählungen und Eröffnungen, schreibt die Fortsetzungen als JSON."""
    _, eintraege = lies(dateien)
    baender = json.loads(baender_datei.read_text(encoding="utf-8"))
    daten = daten_der_datei(baue_fortsetzungen(baender, eintraege))
    ziel.write_text(json.dumps(daten, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


if __name__ == "__main__":
    baue(Path(sys.argv[1]), Path(sys.argv[2]), [Path(a) for a in sys.argv[3:]])
