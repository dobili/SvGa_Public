"""Holt zu den gesammelten Lichess-Profilen mit chess.com-Link die Wertungen auf chess.com (nur lokal).

Aufruf (nach ``sammeln.py``, im Hauptordner):

    python -m pipeline.wertungsvergleich.chesscom --ziel buch/arbeit/wertungsvergleich

Rolle im Gesamtbild: Ein Spieler, der in seinem Lichess-Profil sein chess.com-Konto verlinkt, ist ein
direktes Paar Lichess ↔ chess.com, ohne Umweg über eine dritte Liste. ``auswerten.py`` misst daraus
die Bereiche auf chess.com je Wertungsband. Die öffentliche Schnittstelle von chess.com
(``/pub/player/{name}/stats``) verlangt Anfragen nacheinander, nicht gleichzeitig; daran hält
sich das Skript. Gespeichert werden nur Wertung, RD und Zahl der Partien je Zeitklasse und die
FIDE-Angabe auf chess.com.
"""

from __future__ import annotations

import argparse
import json
import time
import urllib.error
import urllib.request
from pathlib import Path

CHESSCOM = "https://api.chess.com/pub/player"
KOPF = {"User-Agent": "schach-von-grund-auf.com Wertungsvergleich (Kontakt im Impressum)"}
ZEITKLASSEN = {"chess_blitz": "blitz", "chess_rapid": "rapid"}
WARTEN_BEI_429 = 60


def wertungen(stats: dict) -> dict:
    """Wertung, RD und Partien je Zeitklasse aus der Antwort von chess.com."""
    ergebnis: dict = {}
    for schluessel, name in ZEITKLASSEN.items():
        teil = stats.get(schluessel) or {}
        letzte = teil.get("last") or {}
        bilanz = teil.get("record") or {}
        if "rating" in letzte:
            partien = sum(bilanz.get(k, 0) for k in ("win", "loss", "draw"))
            ergebnis[name] = {
                "rating": letzte["rating"],
                "rd": letzte.get("rd"),
                "games": partien,
                "datum": letzte.get("date"),
            }
    return ergebnis


def stats_holen(name: str) -> dict | None:
    """Die Statistik eines chess.com-Kontos; None, wenn es das Konto nicht gibt."""
    for _versuch in range(3):
        anfrage = urllib.request.Request(f"{CHESSCOM}/{name}/stats", headers=KOPF)
        try:
            with urllib.request.urlopen(anfrage, timeout=30) as antwort:
                return json.load(antwort)
        except urllib.error.HTTPError as fehler:
            if fehler.code in (404, 410):
                return None
            if fehler.code == 429:
                time.sleep(WARTEN_BEI_429)
                continue
            raise
        except OSError:
            # URLError, Zeitüberschreitung, abgebrochene Verbindung: kurz warten, neu versuchen.
            time.sleep(5)
    return None


def main() -> None:
    """Liest profile.ndjson und schreibt chesscom.ndjson (fortsetzbar)."""
    teiler = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teiler.add_argument("--ziel", type=Path, default=Path("buch/arbeit/wertungsvergleich"))
    ziel = teiler.parse_args().ziel
    ausgabe = ziel / "chesscom.ndjson"
    erledigt = set()
    if ausgabe.exists():
        erledigt = {json.loads(z)["chesscom"] for z in ausgabe.open(encoding="utf-8")}
    profile = [json.loads(z) for z in (ziel / "profile.ndjson").open(encoding="utf-8")]
    offen = {p["chesscom"]: p["id"] for p in profile if p.get("chesscom")}
    with ausgabe.open("a", encoding="utf-8") as aus:
        for nummer, (name, lichess) in enumerate(sorted(offen.items())):
            if name in erledigt:
                continue
            stats = stats_holen(name)
            eintrag = {"chesscom": name, "lichess": lichess, "gefunden": stats is not None}
            if stats is not None:
                eintrag["perfs"] = wertungen(stats)
                eintrag["fide"] = stats.get("fide")
            aus.write(json.dumps(eintrag) + "\n")
            aus.flush()
            if nummer % 100 == 0:
                print(f"{nummer} von {len(offen)}", flush=True)


if __name__ == "__main__":
    main()
