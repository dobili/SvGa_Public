"""Sammelt gewertete Lichess-Partien mit Uhrzeit je Zug, gleichmäßig über Wertungsbänder.

Wozu: Schritt 1 des Plans „menschlichere Bots und Uhr der Bots“ (20.10.2026). Quelle ist die
offene Partiedatenbank von Lichess (database.lichess.org, CC0, also frei nutzbar). Gelesen wird
nur der Anfang einer Monatsdatei als Datenstrom, bis jedes Band genug Partien hat. Für jedes
Wertungsband (400 bis 2599, je 200) und jedes Tempo (Blitz, Schnellschach, klassisch) entstehen so
Partien; danach wertet die Engine der App jede Stellung aus (app/src/engine/menschenprofil.messung.ts).
Gespeichert werden nur Züge, Uhrzeiten, Wertungen, Bedenkzeit und Ergebnis, keine Spielernamen.

Aufruf (im Hauptordner):

    python -m pipeline.menschenprofil.sammeln --ziel buch/arbeit/menschenprofil --je-band 100

Ein zweiter Aufruf hängt neue Partien an (schon gespeicherte Kennungen werden übersprungen).
"""

from __future__ import annotations

import argparse
import io
import json
import re
import sys
import time
import urllib.request
from collections.abc import Iterable, Iterator
from pathlib import Path

QUELLE = "https://database.lichess.org/standard/lichess_db_standard_rated_{monat}.pgn.zst"
KENNUNG = "schach-von-grund-auf.com"
TEMPI = {"Blitz": "blitz", "Rapid": "rapid", "Classical": "classical"}
UNTERSTE = 400
OBERSTE = 2600
BANDBREITE = 200
BAENDER = tuple(range(UNTERSTE, OBERSTE, BANDBREITE))
MINDEST_HALBZUEGE = 20
# Klassische Partien sind auf Lichess selten: weniger je Band, damit der Lauf endet.
ANTEIL_KLASSISCH = 0.4
SEKUNDEN_JE_MINUTE = 60
HUNDERTSTEL = 100
UNTAUGLICHE_ENDEN = {"Abandoned", "Rules infraction", "Unterminated"}

KOPF = re.compile(r'^\[(\w+) "(.*)"\]$')
UHR = re.compile(r"\[%clk (\d+):(\d\d):(\d\d)(?:\.(\d))?\]")
KOMMENTAR = re.compile(r"\{[^}]*\}")
NUMMER = re.compile(r"^\d+\.(\.\.)?$")
ERGEBNISSE = {"1-0", "0-1", "1/2-1/2", "*"}


def band_von(wertung: int) -> int | None:
    """Untergrenze des Bandes, oder None außerhalb von 400 bis 2599. Beispiel: 1234 → 1200."""
    if wertung < UNTERSTE or wertung >= OBERSTE:
        return None
    return UNTERSTE + (wertung - UNTERSTE) // BANDBREITE * BANDBREITE


def zuege_und_uhren(zugtext: str) -> tuple[list[str], list[int]]:
    """Züge (Kurznotation) und Restzeit nach jedem Halbzug in Hundertstelsekunden.

    Beispiel: ``1. e4 { [%clk 0:05:00] } 1... e5 { [%clk 0:04:58] }`` → (["e4", "e5"], [30000, 29800]).
    Sonderfall: Fehlt eine Uhrzeit, ist die Liste der Uhren kürzer als die der Züge.
    """
    uhren = [
        (int(h) * 3600 + int(m) * 60 + int(s)) * HUNDERTSTEL + int(z or 0) * 10
        for h, m, s, z in UHR.findall(zugtext)
    ]
    ohne = KOMMENTAR.sub(" ", zugtext)
    zuege = [
        t.rstrip("?!")
        for t in ohne.split()
        if not NUMMER.match(t) and t not in ERGEBNISSE and not t.startswith("$")
    ]
    return zuege, uhren


def partie_aus(kopf: dict[str, str], zugtext: str) -> dict | None:
    """Die Partie als Datensatz, oder None, wenn sie nicht taugt (ohne Uhr, zu kurz, Abbruch)."""
    art = next((t for name, t in TEMPI.items() if f"Rated {name} game" in kopf.get("Event", "")), None)
    zeit = kopf.get("TimeControl", "-")
    if art is None or "+" not in zeit or kopf.get("Termination") in UNTAUGLICHE_ENDEN:
        return None
    if "FEN" in kopf or kopf.get("WhiteRatingDiff") is None:
        return None
    try:
        weiss, schwarz = int(kopf["WhiteElo"]), int(kopf["BlackElo"])
        start, zuschlag = (int(x) for x in zeit.split("+"))
    except (KeyError, ValueError):
        return None
    zuege, uhren = zuege_und_uhren(zugtext)
    if len(zuege) < MINDEST_HALBZUEGE or len(uhren) != len(zuege):
        return None
    return {
        "kennung": kopf.get("Site", "").rsplit("/", 1)[-1],
        "tempo": art,
        "start": start,
        "zuschlag": zuschlag,
        "weiss": weiss,
        "schwarz": schwarz,
        "zuege": zuege,
        "uhren": uhren,
        "eco": kopf.get("ECO", ""),
        "ergebnis": kopf.get("Result", "*"),
        "ende": kopf.get("Termination", ""),
    }


def partien(zeilen: Iterable[str]) -> Iterator[dict]:
    """Liest PGN-Zeilen und liefert die tauglichen Partien."""
    kopf: dict[str, str] = {}
    for zeile in zeilen:
        zeile = zeile.strip()
        treffer = KOPF.match(zeile)
        if treffer:
            kopf[treffer.group(1)] = treffer.group(2)
        elif zeile and kopf:
            partie = partie_aus(kopf, zeile)
            kopf = {}
            if partie is not None:
                yield partie


class Bestand:
    """Gesammelte Partien je (Tempo, Band) samt Datei."""

    def __init__(self, ziel: Path, je_band: int) -> None:
        ziel.mkdir(parents=True, exist_ok=True)
        self.datei = ziel / "partien.jsonl"
        klassisch = int(je_band * ANTEIL_KLASSISCH)
        self.soll = {t: klassisch if t == "classical" else je_band for t in TEMPI.values()}
        self.zahl = {(t, b): 0 for t in TEMPI.values() for b in BAENDER}
        self.kennungen: set[str] = set()
        if self.datei.exists():
            for zeile in self.datei.read_text(encoding="utf-8").splitlines():
                self._zaehle(json.loads(zeile))

    def _baender(self, partie: dict) -> list[int]:
        return [b for b in (band_von(partie["weiss"]), band_von(partie["schwarz"])) if b is not None]

    def _zaehle(self, partie: dict) -> None:
        self.kennungen.add(partie["kennung"])
        for band in self._baender(partie):
            self.zahl[(partie["tempo"], band)] += 1

    def nimm(self, partie: dict) -> bool:
        """Legt die Partie ab, wenn eine ihrer Seiten in einem Band liegt, dem noch Partien fehlen."""
        if partie["kennung"] in self.kennungen:
            return False
        soll = self.soll[partie["tempo"]]
        if not any(self.zahl[(partie["tempo"], b)] < soll for b in self._baender(partie)):
            return False
        with self.datei.open("a", encoding="utf-8") as datei:
            datei.write(json.dumps(partie, ensure_ascii=False) + "\n")
        self._zaehle(partie)
        return True

    def fertig(self) -> bool:
        return all(n >= self.soll[t] for (t, _), n in self.zahl.items())

    def tabelle(self) -> str:
        return "\n".join(
            f"{t}: " + " · ".join(f"{b}: {self.zahl[(t, b)]}" for b in BAENDER) for t in TEMPI.values()
        )


def zeilen_aus_datenbank(monat: str) -> Iterator[str]:
    """Die PGN-Zeilen der Monatsdatei als Datenstrom (nur so weit gelesen, wie gebraucht)."""
    import zstandard  # nur für diesen Lauf nötig (pipeline/requirements.txt)

    anfrage = urllib.request.Request(QUELLE.format(monat=monat), headers={"User-Agent": KENNUNG})
    with urllib.request.urlopen(anfrage) as antwort:
        leser = zstandard.ZstdDecompressor().stream_reader(antwort)
        yield from io.TextIOWrapper(leser, encoding="utf-8", errors="replace")


def main(argumente: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--ziel", type=Path, default=Path("buch/arbeit/menschenprofil"))
    parser.add_argument("--je-band", type=int, default=100)
    parser.add_argument("--monat", default="2026-09")
    parser.add_argument("--minuten", type=float, default=110)
    args = parser.parse_args(argumente)
    bestand = Bestand(args.ziel, args.je_band)
    ende = time.monotonic() + args.minuten * SEKUNDEN_JE_MINUTE
    gelesen = 0
    for partie in partien(zeilen_aus_datenbank(args.monat)):
        gelesen += 1
        bestand.nimm(partie)
        if gelesen % 100_000 == 0:
            print(f"{gelesen} Partien gelesen\n{bestand.tabelle()}", flush=True)
        if bestand.fertig() or time.monotonic() > ende:
            break
    print(bestand.tabelle())
    print("FERTIG")
    return 0


if __name__ == "__main__":
    sys.exit(main())
