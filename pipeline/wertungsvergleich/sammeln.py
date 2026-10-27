"""Sammelt öffentliche Lichess-Profile mit FIDE-Zahl oder Link zu chess.com (nur lokal).

Aufruf (im Hauptordner des Repositorys; eine Million Profile brauchen mehrere Stunden):

    python -m pipeline.wertungsvergleich.sammeln --schritt datenbank --namen 1000000
    python -m pipeline.wertungsvergleich.sammeln --schritt profile   # mehrere Stunden

Rolle im Gesamtbild: Die App zeigt die eigene Wertung (Lichess-Maßstab) als Bereich auf chess.com
und FIDE (Wunsch des Autors, 26.10.2026). Veröffentlichte Vergleiche (chessgoals.com, ChessMonitor)
nennen höchstens eine Streuung für die ganze Tabelle. Für Bereiche je Wertungsband braucht es die
Paare selbst: Lichess-Profile, in denen der Spieler seine FIDE-Zahl eingetragen hat (Feld
``profile.fideRating``) oder sein chess.com-Konto verlinkt (Feld ``profile.links``). Dasselbe
Verfahren nutzen ChessMonitor (2023, rund 70 000 Lichess-Profile mit FIDE-Angabe) und handsonml
(2022, rund 3800). Die Auswertung macht ``auswerten.py``.

Woher die Namen kommen: aus den Mitgliederlisten großer Lichess-Teams (öffentliche Schnittstelle
``/api/team/{id}/users``, etwa 50 Namen je Sekunde), ein Team nach dem anderen. Danach kommen die
Profile gebündelt (``POST /api/users``, 300 je Anfrage). Alles nacheinander, nie gleichzeitig: So
verlangt es Lichess, sonst kommt 429.
Gespeichert wird nur, was die Auswertung braucht (Wertungen, RD, Partien, FIDE-Zahl, chess.com-Name,
Land), kein Klarname. Die Rohdaten bleiben in ``buch/arbeit/`` (nie ins Repository, CLAUDE.md).
Bei Antwort 429 wartet das Skript eine Minute (Regel der Lichess-Schnittstelle).
"""

from __future__ import annotations

import argparse
import gzip
import io
import json
import queue
import re
import threading
import time
import urllib.error
import urllib.request
from pathlib import Path

LICHESS = "https://lichess.org"
#: Teams mit vielen Mitgliedern; FIDE- und Vereinsteams zuerst, weil dort mehr FIDE-Spieler sind.
TEAMS = (
    "fide-checkmate-coronavirus",
    "crestbook-chess-club",
    "lichess-swiss",
    "zhigalko_sergei-fan-club",
    "online-world-chess-lovers",
    "satranc-dunyam-youtube",
    "bengal-tiger",
    "the-house-discord-server",
    "masthanaiah-chess-world",
    "pawn-stars-2",
    "im-eric-rosen-fan-club",
)
BUENDEL = 300
WARTEN_BEI_429 = 60
PAUSE_ZWISCHEN_BUENDELN = 1.0
ZEITKLASSEN = ("blitz", "rapid", "classical")
#: Alle Wertungsarten eines Profils, die gespeichert werden (auch Bullet, Fernschach, Aufgaben).
ALLE_WERTUNGEN = ("ultraBullet", "bullet", "blitz", "rapid", "classical", "correspondence", "puzzle")
#: Eingetragene Wertungen anderer Verbände im Lichess-Profil.
VERBANDSZAHLEN = ("fideRating", "uscfRating", "ecfRating", "rcfRating", "cfcRating", "dsbRating")
#: Offene Partiendatenbank von Lichess (CC0), Quelle der Namen aktiver Spieler.
DATENBANK = "https://database.lichess.org/standard/lichess_db_standard_rated_{monat}.pgn.zst"
SPIELERZEILE = re.compile(rb'^\[(?:White|Black) "([^"]+)"\]')
CHESSCOM_LINK = re.compile(r"chess\.com/(?:member|players?|profile)/([A-Za-z0-9_-]{3,25})", re.I)
KOPF = {"User-Agent": "schach-von-grund-auf.com Wertungsvergleich (Kontakt im Impressum)"}


def chesscom_name(links: str) -> str | None:
    """Der chess.com-Name aus dem Linkfeld eines Profils, sonst None.

    Beispiel: "https://www.chess.com/member/Hikaru" → "hikaru".
    """
    treffer = CHESSCOM_LINK.search(links or "")
    return treffer.group(1).lower() if treffer else None


def kurzprofil(nutzer: dict) -> dict | None:
    """Das Nötige eines Profils, nur wenn es eine FIDE-Zahl oder einen chess.com-Link hat.

    Profile mit Regelverstoß (``tosViolation``) und gesperrte fallen weg.
    """
    if nutzer.get("tosViolation") or nutzer.get("disabled"):
        return None
    profil = nutzer.get("profile") or {}
    fide = profil.get("fideRating")
    chesscom = chesscom_name(profil.get("links", ""))
    if not fide and not chesscom:
        return None
    perfs = nutzer.get("perfs") or {}
    return {
        "id": nutzer["id"],
        "fide": fide,
        "chesscom": chesscom,
        "land": profil.get("flag"),
        "gesehen": nutzer.get("seenAt"),
        "perfs": {
            k: {f: perfs[k].get(f) for f in ("rating", "rd", "games", "prov")}
            for k in ZEITKLASSEN
            if k in perfs
        },
    }


def zahlenprofil(nutzer: dict) -> dict:
    """Alle eingetragenen Zahlen eines Profils für spätere Auswertungen (Wunsch des Autors, 27.10.2026).

    Gespeichert werden Kennung, Wertungen mit RD und Partien je Wertungsart, die Zahlen anderer
    Verbände, Land, Titel, Zeiten und Merkmale (Regelverstoß, gesperrt). Kein Klarname, keine
    Freitexte (Ort, Über mich); aus dem Linkfeld nur der chess.com-Name.
    """
    profil = nutzer.get("profile") or {}
    perfs = nutzer.get("perfs") or {}
    spielzeit = nutzer.get("playTime") or {}
    return {
        "id": nutzer["id"],
        "perfs": {
            k: {f: perfs[k].get(f) for f in ("rating", "rd", "games", "prog", "prov")}
            for k in ALLE_WERTUNGEN
            if k in perfs
        },
        "verbaende": {k: profil[k] for k in VERBANDSZAHLEN if profil.get(k)},
        "chesscom": chesscom_name(profil.get("links", "")),
        "land": profil.get("flag"),
        "titel": nutzer.get("title"),
        "erstellt": nutzer.get("createdAt"),
        "gesehen": nutzer.get("seenAt"),
        "spielzeit": spielzeit.get("total"),
        "regelverstoss": bool(nutzer.get("tosViolation")),
        "gesperrt": bool(nutzer.get("disabled")),
    }


def namen_aus_datenbank(ziel: Path, ziel_namen: int, monat: str) -> None:
    """Schritt 1 (seit 27.10.2026): Namen aktiver Spieler aus der Partiendatenbank eines Monats.

    Warum: Die Teamlisten fließen mit etwa 50 Namen je Sekunde, eine Million bräuchte über fünf
    Stunden. Die Datenbank (database.lichess.org, frei, CC0) liest sich mit etwa 30 MB je Sekunde
    und belastet die Schnittstelle nicht. Gelesen wird nur so weit, bis ``ziel_namen`` verschiedene
    Namen beisammen sind; die Spieler haben im Monat gewertet gespielt, sind also aktiv.
    """
    import zstandard

    ziel.mkdir(parents=True, exist_ok=True)
    datei = ziel / "namen.txt"
    bekannt = gesehene_namen(datei)
    anfrage = urllib.request.Request(DATENBANK.format(monat=monat), headers=KOPF)
    with (
        urllib.request.urlopen(anfrage, timeout=120) as antwort,
        datei.open("a", encoding="utf-8") as aus,
    ):
        leser = io.BufferedReader(zstandard.ZstdDecompressor().stream_reader(antwort))
        for zeile in leser:
            treffer = SPIELERZEILE.match(zeile)
            if not treffer:
                continue
            name = treffer.group(1).decode("utf-8", "replace").lower()
            if name not in bekannt:
                bekannt.add(name)
                aus.write(name + "\n")
                if len(bekannt) % 100_000 == 0:
                    print(f"{len(bekannt)} Namen", flush=True)
                if len(bekannt) >= ziel_namen:
                    return


def namen_streamen(team: str, ausgang: queue.Queue, stop: threading.Event) -> None:
    """Schiebt die Namen der Mitglieder eines Teams in die Schlange, bis ``stop`` gesetzt ist."""
    anfrage = urllib.request.Request(f"{LICHESS}/api/team/{team}/users", headers=KOPF)
    try:
        with urllib.request.urlopen(anfrage, timeout=120) as antwort:
            for zeile in antwort:
                if stop.is_set():
                    return
                if zeile.strip():
                    ausgang.put(json.loads(zeile)["id"])
    except (OSError, json.JSONDecodeError) as fehler:
        # OSError umfasst URLError, Zeitüberschreitung und abgebrochene Verbindung.
        print(f"Team {team}: Strom endet ({fehler})", flush=True)


def profile_holen(namen: list[str]) -> list[dict]:
    """Holt bis zu 300 Profile in einer Anfrage; wartet bei 429 und versucht es erneut."""
    daten = ",".join(namen).encode()
    for _versuch in range(5):
        anfrage = urllib.request.Request(
            f"{LICHESS}/api/users", data=daten, headers={**KOPF, "Content-Type": "text/plain"}
        )
        try:
            with urllib.request.urlopen(anfrage, timeout=60) as antwort:
                return json.load(antwort)
        except urllib.error.HTTPError as fehler:
            if fehler.code != 429:
                raise
            print("429: warte eine Minute", flush=True)
            time.sleep(WARTEN_BEI_429)
        except OSError as fehler:
            print(f"Netzfehler ({fehler}), neuer Versuch", flush=True)
            time.sleep(5)
    return []


def gesehene_namen(datei: Path) -> set[str]:
    """Namen, die ein früherer Lauf schon abgefragt hat (zum Fortsetzen)."""
    if not datei.exists():
        return set()
    return {z.strip() for z in datei.read_text(encoding="utf-8").splitlines() if z.strip()}


def namen_sammeln(ziel: Path, ziel_namen: int) -> None:
    """Schritt 1: Namen der Teammitglieder nach namen.txt, ein Team nach dem anderen.

    Nacheinander statt gleichzeitig, weil Lichess sonst mit 429 antwortet (eine Anfrage zur Zeit).
    """
    ziel.mkdir(parents=True, exist_ok=True)
    datei = ziel / "namen.txt"
    bekannt = gesehene_namen(datei) | gesehene_namen(ziel / "abgefragt.txt")
    with datei.open("a", encoding="utf-8") as aus:
        for team in TEAMS:
            schlange: queue.Queue = queue.Queue()
            stop = threading.Event()
            strom = threading.Thread(target=namen_streamen, args=(team, schlange, stop), daemon=True)
            strom.start()
            while strom.is_alive() or not schlange.empty():
                try:
                    name = schlange.get(timeout=5)
                except queue.Empty:
                    continue
                if name not in bekannt:
                    bekannt.add(name)
                    aus.write(name + "\n")
                if len(bekannt) >= ziel_namen:
                    stop.set()
                    return
            aus.flush()
            print(f"Team {team} fertig, {len(bekannt)} Namen", flush=True)


def profile_sammeln(ziel: Path) -> None:
    """Schritt 2: Profile zu allen Namen aus namen.txt, die noch nicht abgefragt sind.

    Jedes Profil kommt mit allen Zahlen nach ``alle.ndjson.gz`` (``zahlenprofil``); Profile mit
    FIDE-Zahl oder chess.com-Link zusätzlich als Kurzprofil nach ``profile.ndjson`` (für Abgleich
    und Auswertung). Erledigte Namen stehen in ``alle_abgefragt.txt`` (fortsetzbar).
    """
    abgefragt = gesehene_namen(ziel / "alle_abgefragt.txt")
    offen = [n for n in sorted(gesehene_namen(ziel / "namen.txt")) if n not in abgefragt]
    treffer = 0
    with (
        (ziel / "alle_abgefragt.txt").open("a", encoding="utf-8") as namen_aus,
        (ziel / "profile.ndjson").open("a", encoding="utf-8") as profile_aus,
        gzip.open(ziel / "alle.ndjson.gz", "at", encoding="utf-8") as alle_aus,
    ):
        for start in range(0, len(offen), BUENDEL):
            buendel = offen[start : start + BUENDEL]
            for nutzer in profile_holen(buendel):
                alle_aus.write(json.dumps(zahlenprofil(nutzer)) + "\n")
                kurz = kurzprofil(nutzer)
                if kurz:
                    profile_aus.write(json.dumps(kurz) + "\n")
                    treffer += 1
            namen_aus.write("\n".join(buendel) + "\n")
            namen_aus.flush()
            profile_aus.flush()
            alle_aus.flush()
            print(f"{start + len(buendel)} von {len(offen)}, {treffer} Treffer", flush=True)
            time.sleep(PAUSE_ZWISCHEN_BUENDELN)


def main() -> None:
    """Befehlszeile: Zielordner und Zahl der Namen."""
    teiler = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teiler.add_argument("--ziel", type=Path, default=Path("buch/arbeit/wertungsvergleich"))
    teiler.add_argument("--namen", type=int, default=1_000_000)
    teiler.add_argument("--monat", default="2026-09", help="Monat der Partiendatenbank, JJJJ-MM")
    teiler.add_argument("--schritt", choices=("datenbank", "namen", "profile"), required=True)
    argumente = teiler.parse_args()
    if argumente.schritt == "datenbank":
        namen_aus_datenbank(argumente.ziel, argumente.namen, argumente.monat)
    elif argumente.schritt == "namen":
        namen_sammeln(argumente.ziel, argumente.namen)
    else:
        profile_sammeln(argumente.ziel)


if __name__ == "__main__":
    main()
