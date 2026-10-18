"""Konstruierte Partien bauen und als PGN ablegen (Werkzeug, nicht Teil des Datenlaufs).

Wozu diese Datei da ist:
    Für jede Abbildung, die ``inhalte/de/konstruktion.json`` als realistisch einordnet und die noch
    keine Zugfolge hat, sucht ``konstruktion.suche`` eine Partie ab einer gängigen Eröffnung.
    Gelingt es, entsteht ``inhalte/de/zugfolgen/kapNN/kNN-aMM-k.pgn`` mit ``[Status "konstruiert"]``;
    das Protokoll (alle Versuche) geht nach ``buch/arbeit/zugfolgen-konstruiert/`` (nur lokal).
    Die Engine ist eine schnelle UCI-Engine für die Suche (etwa Stockfish nativ); die endgültige
    Genauigkeit prüft der Messlauf der App mit ihrer eigenen Engine.

Aufruf (im Hauptordner):
    python -m pipeline.zugfolgen.konstruieren --engine PFAD [--abbildung 8.25 …]
    python -m pipeline.zugfolgen.konstruieren --fuer-bewertung buch/arbeit/zugfolgen-konstruiert/bewertung
"""

from __future__ import annotations

import argparse
import csv
import json
import time
from dataclasses import dataclass
from pathlib import Path

import chess
import chess.engine
import chess.pgn

from pipeline.zugfolgen.konstruktion import Einstellung, Ergebnis, Pruefer, suche
from pipeline.zugfolgen.pgn import STATUS_KONSTRUIERT

HAUPTORDNER = Path(__file__).resolve().parents[2]
DATEN = HAUPTORDNER / "app" / "public" / "daten" / "de" / "a1"
ZUGFOLGEN = HAUPTORDNER / "inhalte" / "de" / "zugfolgen"
EINORDNUNG = HAUPTORDNER / "inhalte" / "de" / "konstruktion.json"
ERÖFFNUNGSLISTE = HAUPTORDNER / "inhalte" / "lichess"
PROTOKOLL = HAUPTORDNER / "buch" / "arbeit" / "zugfolgen-konstruiert" / "protokoll.jsonl"
# Gängige Eröffnungen als Anfang der Suche (Namen der Lichess-Liste), der Reihe nach probiert.
STANDARD_ERÖFFNUNGEN = (
    "Ruy Lopez: Exchange Variation",
    "Italian Game: Giuoco Piano",
    "Queen's Gambit Declined: Exchange Variation",
    "Sicilian Defense: Open",
)


@dataclass(frozen=True)
class Abbildung:
    """Eine Abbildung, zu der eine Partie gebaut werden soll."""

    nummer: str
    kapitel: int
    abschnitt: str | None
    fen: str
    eroeffnungen: tuple[str, ...]


def eroeffnungszuege(name: str) -> list[str]:
    """Die Züge einer Eröffnung in SAN: aus der Lichess-Liste oder ein eigener Vorlauf „Name|Züge“.

    Beispiel: „Ruy Lopez: Exchange Variation“ → e4 e5 Nf3 Nc6 Bb5 a6 Bxc6;
    „Semi-Tarrasch|d4 d5 c4 e6 Nc3 Nf6“ → die genannten Züge (für Mittelspielstellungen).
    """
    if "|" in name:
        return name.split("|", 1)[1].split()
    for datei in sorted(ERÖFFNUNGSLISTE.glob("*.tsv")):
        with datei.open(encoding="utf-8") as tsv:
            for zeile in csv.DictReader(tsv, delimiter="\t"):
                if zeile["name"] == name:
                    return [t for t in zeile["pgn"].split() if not t.endswith(".")]
    raise ValueError(f"Eröffnung „{name}“ steht nicht in der Lichess-Liste")


def offene_abbildungen(gewuenscht: list[str]) -> list[Abbildung]:
    """Realistische Abbildungen ohne Zugfolge (oder die gewünschten) mit FEN und Eröffnungen."""
    einordnung = json.loads(EINORDNUNG.read_text(encoding="utf-8"))["abbildungen"]
    eintraege = {e["nummer"]: e for e in einordnung if e["realistisch"]}
    ergebnis = []
    for datei in sorted(DATEN.glob("kap*.json")):
        kapitel = json.loads(datei.read_text(encoding="utf-8"))
        for abbildung in kapitel["abbildungen"]:
            eintrag = eintraege.get(abbildung["id"])
            if not eintrag or (gewuenscht and abbildung["id"] not in gewuenscht):
                continue
            if not gewuenscht and abbildung.get("beispiel"):
                continue
            eroeffnungen = tuple(eintrag.get("eroeffnungen") or STANDARD_ERÖFFNUNGEN)
            abschnitt = (abbildung.get("abschnitt") or {}).get("nummer")
            ergebnis.append(
                Abbildung(abbildung["id"], kapitel["kapitel"], abschnitt, abbildung["fen"], eroeffnungen)
            )
    return ergebnis


def kennung(abbildung: Abbildung) -> str:
    """Kennung der konstruierten Partie. Beispiel: Abb. 8.25 → „k08-a25-k“."""
    return f"k{abbildung.kapitel:02d}-a{abbildung.nummer.split('.')[1]}-k"


def als_pgn(abbildung: Abbildung, ergebnis: Ergebnis) -> chess.pgn.Game:
    """Die Partie mit Kopfzeilen; die Abbildung steht am letzten Zug."""
    spiel = chess.pgn.Game()
    spiel.headers["Event"] = f"Kapitel {abbildung.kapitel}: Konstruierte Partie zu Abb. {abbildung.nummer}"
    spiel.headers["Site"] = "Schach von Grund auf"
    spiel.headers["Beispiel"] = kennung(abbildung)
    spiel.headers["Kapitel"] = str(abbildung.kapitel)
    spiel.headers["Abschnitt"] = abbildung.abschnitt or ""
    spiel.headers["Status"] = STATUS_KONSTRUIERT
    spiel.headers["Abbildungen"] = abbildung.nummer
    spiel.headers["Opening"] = ergebnis.eroeffnung
    spiel.headers["Annotator"] = "Claude (konstruiert, nicht aus dem Buch)"
    knoten: chess.pgn.GameNode = spiel
    for zug in ergebnis.zuege:
        knoten = knoten.add_variation(zug)
    knoten.comment = f"Abb. {abbildung.nummer}"
    return spiel


def baue(abbildung: Abbildung, pruefer: Pruefer) -> Ergebnis | None:
    """Probiert die Eröffnungen der Reihe nach und protokolliert jeden Versuch."""
    for name in abbildung.eroeffnungen:
        beginn = time.time()
        ergebnis = suche(abbildung.fen, name.split("|", 1)[0], eroeffnungszuege(name), pruefer)
        _protokolliere(abbildung, name, ergebnis, time.time() - beginn)
        if ergebnis:
            return ergebnis
    return None


def _protokolliere(abbildung: Abbildung, name: str, ergebnis: Ergebnis | None, sekunden: float) -> None:
    satz: dict[str, object] = {"abbildung": abbildung.nummer, "eroeffnung": name.split("|", 1)[0]}
    satz["sekunden"] = round(sekunden)
    if ergebnis:
        satz |= {"halbzuege": len(ergebnis.zuege), "verlust": round(sum(ergebnis.verluste), 1)}
        satz |= {"hoechster": round(max(ergebnis.verluste, default=0.0), 1)}
    PROTOKOLL.parent.mkdir(parents=True, exist_ok=True)
    with PROTOKOLL.open("a", encoding="utf-8") as datei:
        datei.write(json.dumps(satz, ensure_ascii=False) + "\n")


def fuer_bewertung(ordner: Path) -> int:
    """Schreibt alle konstruierten Partien als ``konstruiert.jsonl`` für skripte/eichung-rechnen.mjs.

    Warum: Die Genauigkeit rechnet die App mit ihrer eigenen Engine und Formel nach
    (app/src/spiel/konstruiert.messung.ts). Ausgabe: Zahl der Partien.
    """
    ordner.mkdir(parents=True, exist_ok=True)
    zeilen = []
    for pfad in sorted(ZUGFOLGEN.glob("kap*/*-k.pgn")):
        with pfad.open(encoding="utf-8") as datei:
            spiel = chess.pgn.read_game(datei)
        if spiel is None:
            continue
        brett = spiel.board()
        zuege = []
        for zug in spiel.mainline_moves():
            zuege.append(brett.san(zug))
            brett.push(zug)
        zeilen.append(json.dumps({"plattform": "konstruiert", "kennung": pfad.stem, "zuege": zuege}))
    (ordner / "konstruiert.jsonl").write_text("\n".join(zeilen) + "\n", encoding="utf-8")
    return len(zeilen)


def main() -> None:
    teiler = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teiler.add_argument("--engine", type=Path)
    teiler.add_argument("--abbildung", action="append", default=[])
    teiler.add_argument(
        "--fuer-bewertung", type=Path, help="nur konstruiert.jsonl in diesen Ordner schreiben"
    )
    argumente = teiler.parse_args()
    if argumente.fuer_bewertung:
        print(f"{fuer_bewertung(argumente.fuer_bewertung)} Partien für die Bewertung")
        return
    if argumente.engine is None:
        teiler.error("--engine fehlt")
    motor = chess.engine.SimpleEngine.popen_uci(str(argumente.engine))
    motor.configure({"Threads": 1, "Hash": 64})
    pruefer = Pruefer(motor, Einstellung())
    try:
        for abbildung in offene_abbildungen(argumente.abbildung):
            ergebnis = baue(abbildung, pruefer)
            if ergebnis is None:
                print(f"Abb. {abbildung.nummer}: keine Partie gefunden")
                continue
            pfad = ZUGFOLGEN / f"kap{abbildung.kapitel:02d}" / f"{kennung(abbildung)}.pgn"
            pfad.parent.mkdir(parents=True, exist_ok=True)
            pfad.write_text(str(als_pgn(abbildung, ergebnis)) + "\n", encoding="utf-8")
            print(f"Abb. {abbildung.nummer}: {len(ergebnis.zuege)} Halbzüge → {pfad.name}")
    finally:
        motor.quit()


if __name__ == "__main__":
    main()
