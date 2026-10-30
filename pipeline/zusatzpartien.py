"""Zusatzpartien für den Trainer „Zug erraten“: berühmte Klassiker und aktuelle Turnierpartien.

Aufruf (im Hauptordner; die Monatsdateien vorher von https://database.lichess.org/ Abschnitt
„Broadcasts“ laden, etwa ``lichess_db_broadcast_2026-09.pgn.zst``, nur lokal, nie committen):

    python -m pipeline.zusatzpartien buch/arbeit/broadcast/lichess_db_broadcast_2026-08.pgn.zst \
        buch/arbeit/broadcast/lichess_db_broadcast_2026-09.pgn.zst

Rolle im Gesamtbild: Wunsch des Autors (30.10.2026, Pakete 6 und 7): Zum Raten gibt es neben den
Meisterpartien aus Kapitel 11 des Buches weitere Partien. Die Klassiker stehen von Hand gepflegt
in ``inhalte/zusatzpartien/klassiker.json`` (Partiezüge sind Tatsachen, je Partie gegen zwei
öffentliche Quellen geprüft). Die Turnierpartien wählt dieses Skript aus den Lichess-Übertragungen
(CC BY-SA 4.0): klassische Bedenkzeit, beide Spieler mindestens 2500, entschieden, mindestens 30
Halbzüge, je Eröffnung des Buches einige. Heraus kommt ``app/public/daten/zusatzpartien.json`` für
beide Sprachen (Texte je Sprache); jede Partie wird mit python-chess auf Legalität geprüft.
Ohne Monatsdateien schreibt das Skript die Klassiker neu und behält die Turnierpartien der Datei.
"""

from __future__ import annotations

import argparse
import io
import json
import re
from collections import Counter
from collections.abc import Iterable, Iterator
from pathlib import Path

import chess

HAUPTORDNER = Path(__file__).resolve().parent.parent
KLASSIKER = HAUPTORDNER / "inhalte" / "zusatzpartien" / "klassiker.json"
DATEN = HAUPTORDNER / "app" / "public" / "daten"
ZIEL = DATEN / "zusatzpartien.json"
BAENDER = DATEN / "eroeffnungsbaender.json"
SPRACHEN = ("de", "en")

MINDEST_ELO = 2500
MINDEST_HALBZUEGE = 30
HOECHSTENS_HALBZUEGE = 160
# Klassisch heißt: mindestens 50 Minuten auf der Uhr nach dem ersten Zug (Fischer-Bedenkzeit
# 90+30 zeigt dort 1:30:30, Schnellschach 15+10 nur 0:15:10).
MINDEST_MINUTEN = 50
SEKUNDEN_JE_MINUTE = 60
MINUTEN_JE_STUNDE = 60
# Ab diesem Wert ist die Grundzeit in TimeControl in Sekunden angegeben, darunter in Minuten.
SEKUNDEN_AB = 300
ZIEL_ANZAHL = 60
JE_BUCHEROEFFNUNG = 5
JE_SPIELER = 2
LIZENZ_TURNIER = "CC BY-SA 4.0 (Lichess-Übertragungen)"
LIZENZ_KLASSIKER = "Partiezüge als Tatsachen (nicht geschützt)"
# Engine-Turniere und schnelle Bedenkzeiten, auch wenn die Uhr fehlt.
AUSGESCHLOSSEN = re.compile(
    r"TCEC|engine|computer|rapid|blitz|bullet|armageddon|tiebreak|r[aá]pido|rel[aá]mpago",
    re.IGNORECASE,
)

KOPF = re.compile(r'^\[(\w+) "(.*)"\]$')
UHR = re.compile(r"\[%clk (\d+):(\d\d):(\d\d)")
KOMMENTAR = re.compile(r"\{[^}]*\}")
NUMMER = re.compile(r"^\d+\.(\.\.)?$")
ERGEBNISSE = {"1-0", "0-1", "1/2-1/2", "*"}
ENTSCHIEDEN = {"1-0", "0-1"}


def lies_partien(zeilen: Iterable[str]) -> Iterator[tuple[dict[str, str], str]]:
    """Kopf und Zugtext jeder Partie einer PGN-Datei (als Datenstrom, ohne alles zu laden)."""
    kopf: dict[str, str] = {}
    zugtext: list[str] = []
    for zeile in zeilen:
        treffer = KOPF.match(zeile.strip())
        if treffer:
            if zugtext:
                yield kopf, " ".join(zugtext)
                kopf, zugtext = {}, []
            kopf[treffer[1]] = treffer[2]
        elif zeile.strip():
            zugtext.append(zeile.strip())
    if zugtext:
        yield kopf, " ".join(zugtext)


def minuten_aus_zeitkontrolle(text: str) -> float | None:
    """Grundzeit in Minuten aus TimeControl. Beispiele: „90+30“ → 90, „5400+30“ → 90,
    „1:30:30“ → 90, „90' + 30''“ → 90; unlesbar → None."""
    stunden = re.match(r"^(\d+):(\d\d)", text)
    if stunden:
        return int(stunden[1]) * MINUTEN_JE_STUNDE + int(stunden[2])
    zahl = re.match(r"^(\d+)", text)
    if not zahl:
        return None
    wert = int(zahl[1])
    return wert / SEKUNDEN_JE_MINUTE if wert >= SEKUNDEN_AB else float(wert)


def klassisch(kopf: dict[str, str], zugtext: str) -> bool:
    """Klassische Bedenkzeit: nach der Uhr des ersten Zuges, sonst nach TimeControl."""
    if AUSGESCHLOSSEN.search(kopf.get("Event", "") + " " + kopf.get("BroadcastName", "")):
        return False
    uhr = UHR.search(zugtext)
    if uhr:
        minuten = int(uhr[1]) * MINUTEN_JE_STUNDE + int(uhr[2])
    else:
        minuten = minuten_aus_zeitkontrolle(kopf.get("TimeControl", "")) or 0
    return minuten >= MINDEST_MINUTEN


def zuege_aus(zugtext: str) -> list[str]:
    """Die Züge in Kurznotation ohne Kommentare, Nummern und Ergebnis."""
    ohne = KOMMENTAR.sub(" ", zugtext)
    return [
        t.rstrip("?!")
        for t in ohne.split()
        if not NUMMER.match(t) and t not in ERGEBNISSE and not t.startswith("$")
    ]


def geprueft(zuege: Iterable[str]) -> list[str] | None:
    """Spielt die Züge nach und schreibt sie neu (Kurznotation wie chessops); illegal → None."""
    brett = chess.Board()
    sauber: list[str] = []
    try:
        for zug in zuege:
            bewegung = brett.parse_san(zug)
            sauber.append(brett.san(bewegung))
            brett.push(bewegung)
    except ValueError:
        return None
    return sauber


def elo(kopf: dict[str, str], feld: str) -> int:
    """Wertung aus dem Kopf; fehlt sie, 0."""
    wert = kopf.get(feld, "")
    return int(wert) if wert.isdigit() else 0


def taugt(kopf: dict[str, str], zugtext: str) -> list[str] | None:
    """Die geprüften Züge einer Turnierpartie, oder None, wenn sie nicht in die Auswahl passt."""
    if kopf.get("Result") not in ENTSCHIEDEN or "FEN" in kopf:
        return None
    if kopf.get("Variant", "Standard") != "Standard" or "GameURL" not in kopf:
        return None
    if min(elo(kopf, "WhiteElo"), elo(kopf, "BlackElo")) < MINDEST_ELO:
        return None
    if not klassisch(kopf, zugtext):
        return None
    zuege = geprueft(zuege_aus(zugtext))
    if zuege is None or not MINDEST_HALBZUEGE <= len(zuege) <= HOECHSTENS_HALBZUEGE:
        return None
    return zuege


def lies_zst(pfad: Path) -> Iterator[str]:
    """Zeilen einer zstd-gepackten PGN-Datei als Datenstrom."""
    import zstandard

    with pfad.open("rb") as roh:
        strom = zstandard.ZstdDecompressor().stream_reader(roh)
        yield from io.TextIOWrapper(strom, encoding="utf-8")


def kandidaten(dateien: Iterable[Path]) -> list[tuple[dict[str, str], list[str]]]:
    """Alle passenden Turnierpartien der Monatsdateien, je Partie nur einmal."""
    gesehen: set[str] = set()
    liste: list[tuple[dict[str, str], list[str]]] = []
    for datei in dateien:
        zeilen = lies_zst(datei) if datei.suffix == ".zst" else datei.open(encoding="utf-8")
        for kopf, zugtext in lies_partien(zeilen):
            zuege = taugt(kopf, zugtext)
            if zuege is not None and kopf["GameURL"] not in gesehen:
                gesehen.add(kopf["GameURL"])
                liste.append((kopf, zuege))
    return liste


def buchfamilie(zuege: list[str], familien: list[dict]) -> str | None:
    """Die Eröffnung des Buches mit der längsten passenden Zugfolge (Abschnitt), sonst None."""
    passend = [
        f for f in familien if f.get("buch") and zuege[: len(f["folge"].split())] == f["folge"].split()
    ]
    return max(passend, key=lambda f: len(f["folge"].split()))["name"] if passend else None


def staerke(partie: tuple[dict[str, str], list[str]]) -> tuple[int, str]:
    """Sortierschlüssel: stärkere Partien (Summe der Wertungen) zuerst, dann nach Adresse."""
    kopf = partie[0]
    return -(elo(kopf, "WhiteElo") + elo(kopf, "BlackElo")), kopf["GameURL"]


def auswahl(liste: list[tuple[dict[str, str], list[str]]], familien: list[dict]) -> list[tuple]:
    """Etwa ZIEL_ANZAHL Partien: stärkste zuerst, je Buch-Eröffnung höchstens einige, je Spieler
    höchstens zwei. Erst die Eröffnungen des Buches, dann die übrigen."""
    sortiert = sorted(liste, key=staerke)
    je_familie: Counter[str] = Counter()
    je_spieler: Counter[str] = Counter()
    gewaehlt: list[tuple] = []
    for nur_buch in (True, False):
        for kopf, zuege in sortiert:
            familie = buchfamilie(zuege, familien)
            if len(gewaehlt) >= ZIEL_ANZAHL or (familie is None) == nur_buch:
                continue
            spieler = (kopf.get("White", ""), kopf.get("Black", ""))
            if familie and je_familie[familie] >= JE_BUCHEROEFFNUNG:
                continue
            if max(je_spieler[s] for s in spieler) >= JE_SPIELER:
                continue
            je_familie[familie or ""] += 1
            je_spieler.update(spieler)
            gewaehlt.append((kopf, zuege))
    return gewaehlt


def namensliste(sprache: str) -> dict[str, str]:
    """Schlüssel der Stellung → Eröffnungsname aus der Eröffnungsliste der App (Lichess, CC0)."""
    datei = DATEN / sprache / "eroeffnungen-lichess.json"
    stellungen = json.loads(datei.read_text(encoding="utf-8"))["stellungen"]
    return {s[0]: s[2] for s in stellungen}


def eroeffnungsname(zuege: list[str], namen: dict[str, dict[str, str]]) -> dict[str, str]:
    """Der Name der letzten benannten Stellung der Partie je Sprache; ohne Treffer leer."""
    brett = chess.Board()
    gefunden = {sprache: "" for sprache in SPRACHEN}
    for zug in zuege:
        brett.push_san(zug)
        schluessel = " ".join(brett.fen().split()[:3])
        for sprache in SPRACHEN:
            gefunden[sprache] = namen[sprache].get(schluessel, gefunden[sprache])
    return gefunden


def turnierpartie(kopf: dict[str, str], zuege: list[str], namen: dict) -> dict:
    """Eine Turnierpartie im Format der App, mit Quelle und Lizenz."""
    ereignis = kopf.get("BroadcastName") or kopf.get("Event", "")
    return {
        "id": "turnier-" + kopf["GameURL"].rstrip("/").rsplit("/", 1)[-1],
        "art": "turnier",
        "weiss": kopf.get("White", "?"),
        "schwarz": kopf.get("Black", "?"),
        "elo": [elo(kopf, "WhiteElo"), elo(kopf, "BlackElo")],
        "ereignis": {sprache: ereignis for sprache in SPRACHEN},
        "runde": kopf.get("Round", ""),
        "datum": kopf.get("Date", "").replace(".", "-"),
        "ergebnis": kopf["Result"],
        "eroeffnung": eroeffnungsname(zuege, namen),
        "zuege": " ".join(zuege),
        "quelle": [kopf["GameURL"]],
        "lizenz": LIZENZ_TURNIER,
    }


def klassiker(namen: dict) -> list[dict]:
    """Die gepflegten Klassiker, geprüft und im Format der App (die Datei bleibt die Quelle)."""
    partien = json.loads(KLASSIKER.read_text(encoding="utf-8"))
    ergebnis: list[dict] = []
    for p in partien:
        zuege = geprueft(p["zuege"].split())
        if zuege is None or len(zuege) < MINDEST_HALBZUEGE:
            raise ValueError(f"Klassiker {p['id']}: Züge illegal oder zu kurz")
        ergebnis.append(
            {
                "id": p["id"],
                "art": "klassiker",
                "weiss": p["weiss"],
                "schwarz": p["schwarz"],
                "ereignis": p["ereignis"],
                "datum": str(p["jahr"]),
                "ergebnis": p["ergebnis"],
                "eroeffnung": eroeffnungsname(zuege, namen),
                "zuege": " ".join(zuege),
                "text": p["text"],
                "quelle": p["quellen"],
                "lizenz": LIZENZ_KLASSIKER,
            }
        )
    return ergebnis


def bisherige_turnierpartien() -> list[dict]:
    """Die Turnierpartien der vorhandenen Datei (wenn keine Monatsdateien angegeben sind)."""
    if not ZIEL.exists():
        return []
    return [p for p in json.loads(ZIEL.read_text(encoding="utf-8"))["partien"] if p["art"] == "turnier"]


def baue(dateien: list[Path]) -> dict:
    """Die ganze Datei: Klassiker und Turnierpartien."""
    namen = {sprache: namensliste(sprache) for sprache in SPRACHEN}
    if dateien:
        familien = json.loads(BAENDER.read_text(encoding="utf-8"))["familien"]
        turniere = [turnierpartie(k, z, namen) for k, z in auswahl(kandidaten(dateien), familien)]
    else:
        turniere = bisherige_turnierpartien()
    return {
        "schemaVersion": 1,
        "hinweis": "Zusatzinhalt, nicht aus dem Buch. Erzeugt von pipeline/zusatzpartien.py.",
        "partien": klassiker(namen) + turniere,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("monate", nargs="*", type=Path, help="Monatsdateien der Lichess-Übertragungen")
    argumente = parser.parse_args()
    daten = baue(argumente.monate)
    text = json.dumps(daten, ensure_ascii=False, separators=(",", ":"))
    ZIEL.write_text(text + "\n", encoding="utf-8")
    arten = Counter(p["art"] for p in daten["partien"])
    print(f"{ZIEL}: {arten['klassiker']} Klassiker, {arten['turnier']} Turnierpartien.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
