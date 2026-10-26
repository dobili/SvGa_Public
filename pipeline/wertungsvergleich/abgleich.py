"""Gleicht Lichess-Profile mit FIDE-Angabe gegen die offizielle FIDE-Liste ab (nur lokal).

Aufruf (nach ``sammeln.py``, im Hauptordner; die FIDE-Liste vorher laden):

    curl -L -o buch/arbeit/fide/players_list.zip https://ratings.fide.com/download/players_list.zip
    (cd buch/arbeit/fide && unzip players_list.zip)
    python -m pipeline.wertungsvergleich.abgleich --ziel buch/arbeit/wertungsvergleich

Rolle im Gesamtbild: Eine selbst eingetragene FIDE-Zahl auf Lichess ist oft veraltet (einmal
eingetragen, nie geändert). chessgoals.com fragt deshalb die FIDE-ID ab, ChessMonitor (2023) gleicht
Namen mit der FIDE-Liste ab. Dieses Skript macht es wie ChessMonitor: Klarname des Lichess-Profils
gegen den Namen in der FIDE-Liste, und die eingetragene Zahl darf höchstens 150 von der offiziellen
abweichen (eine von Standard, Schnell oder Blitz). Nur eindeutige Treffer zählen. Danach gilt die
offizielle Standard-Wertung, und es gibt das Merkmal „aktiv“ der FIDE.
Datenschutz: Die Klarnamen werden nur im Speicher verglichen und nicht geschrieben; gespeichert
werden Lichess-Kennung, FIDE-Wertungen und „aktiv“.
"""

from __future__ import annotations

import argparse
import json
import time
import unicodedata
from pathlib import Path

from pipeline.wertungsvergleich.sammeln import BUENDEL, PAUSE_ZWISCHEN_BUENDELN, profile_holen

FIDE_LISTE = Path("buch/arbeit/fide/players_list_foa.txt")
HOECHSTE_ABWEICHUNG = 150


def woerter(name: str) -> frozenset[str]:
    """Kleingeschriebene Namensteile ohne Akzente und Satzzeichen.

    Beispiel: "Carlsen, Magnus" und "Magnus Carlsen" → {"carlsen", "magnus"}.
    """
    ohne = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode().lower()
    teile = "".join(z if z.isalnum() else " " for z in ohne).split()
    return frozenset(t for t in teile if len(t) > 1)


def zahl(text: str) -> int:
    """Eine Zahl aus einer Spalte der FIDE-Liste, leer → 0."""
    text = text.strip()
    return int(text) if text.isdigit() else 0


def fide_liste_lesen(datei: Path) -> dict[frozenset[str], list[dict]]:
    """Die FIDE-Liste (feste Spalten laut Kopfzeile) als Index Namensteile → Spieler."""
    index: dict[frozenset[str], list[dict]] = {}
    with datei.open(encoding="utf-8", errors="replace") as liste:
        kopf = next(liste)
        stellen = {n: kopf.index(n) for n in ("Name", "Fed", "SRtng", "RRtng", "BRtng", "Flag")}
        for zeile in liste:
            spieler = {
                "fide_id": zahl(zeile[: stellen["Name"]]),
                "standard": zahl(zeile[stellen["SRtng"] : stellen["SRtng"] + 6]),
                "schnell": zahl(zeile[stellen["RRtng"] : stellen["RRtng"] + 6]),
                "blitz": zahl(zeile[stellen["BRtng"] : stellen["BRtng"] + 6]),
                "aktiv": "i" not in zeile[stellen["Flag"] :],
            }
            name = zeile[stellen["Name"] : stellen["Fed"]]
            index.setdefault(woerter(name), []).append(spieler)
    return index


def treffer(index: dict, realname: str, angabe: int) -> dict | None:
    """Der eindeutige FIDE-Spieler zu Klarname und eingetragener Zahl, sonst None."""
    kandidaten = [
        s
        for s in index.get(woerter(realname), [])
        if any(s[k] and abs(s[k] - angabe) <= HOECHSTE_ABWEICHUNG for k in ("standard", "schnell", "blitz"))
    ]
    return kandidaten[0] if len(kandidaten) == 1 else None


def main() -> None:
    """Liest profile.ndjson, holt die Klarnamen neu und schreibt abgleich.ndjson."""
    teiler = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teiler.add_argument("--ziel", type=Path, default=Path("buch/arbeit/wertungsvergleich"))
    ziel = teiler.parse_args().ziel
    index = fide_liste_lesen(FIDE_LISTE)
    angaben = {}
    for zeile in (ziel / "profile.ndjson").open(encoding="utf-8"):
        p = json.loads(zeile)
        if p.get("fide"):
            angaben[p["id"]] = p["fide"]
    namen = sorted(angaben)
    gefunden = 0
    with (ziel / "abgleich.ndjson").open("w", encoding="utf-8") as aus:
        for start in range(0, len(namen), BUENDEL):
            for nutzer in profile_holen(namen[start : start + BUENDEL]):
                realname = (nutzer.get("profile") or {}).get("realName") or ""
                spieler = treffer(index, realname, angaben.get(nutzer["id"], 0)) if realname else None
                if spieler:
                    aus.write(json.dumps({"id": nutzer["id"], **spieler}) + "\n")
                    gefunden += 1
            print(f"{start + BUENDEL} von {len(namen)}, {gefunden} abgeglichen", flush=True)
            time.sleep(PAUSE_ZWISCHEN_BUENDELN)


if __name__ == "__main__":
    main()
