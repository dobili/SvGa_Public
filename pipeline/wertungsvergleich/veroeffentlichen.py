"""Schreibt die gesammelten Profile pseudonymisiert nach ``Research/wertungsvergleich/`` (öffentlich).

Aufruf (nach ``sammeln.py``, ``abgleich.py`` und ``chesscom.py``, im Hauptordner):

    python -m pipeline.wertungsvergleich.veroeffentlichen

Rolle im Gesamtbild: Der Autor möchte alle eingetragenen Zahlen aufheben, damit später weitere
Auswertungen möglich sind (Wunsch vom 27.10.2026), und zwar im Repository der App, Ordner
``Research``. Das Repository ist öffentlich. Deshalb gilt hier:

- Statt der Lichess-Kennung steht ein Pseudonym: die ersten 16 Zeichen von SHA-256 aus einem
  geheimen Salz und der Kennung. Das Salz liegt nur lokal (``buch/arbeit/wertungsvergleich/salz.txt``),
  so bleiben die Pseudonyme über spätere Läufe gleich, ohne dass jemand von außen zurückrechnen kann.
- Keine FIDE-ID, kein chess.com-Name, kein Klarname, kein Freitext: Sonst wäre öffentlich, welche
  Person hinter welchem Lichess-Konto steht.
- Zeitpunkte (Konto erstellt, zuletzt gesehen) nur als Monat.
- Alle Zahlen bleiben: Wertung, RD, Partien und Fortschritt je Wertungsart, Verbandszahlen
  (FIDE, USCF, ECF, RCF, CFC, DSB) wie eingetragen, Land, Titel, Spielzeit, und je Pseudonym die
  offiziellen FIDE-Wertungen (abgeglichen) und die Wertungen des verlinkten chess.com-Kontos.

Die Dateien sind in Teile zu höchstens TEILGROESSE Profilen geteilt, damit keine Datei zu groß für
GitHub wird (Grenze 50 MB je Datei für Warnungen).
"""

from __future__ import annotations

import argparse
import datetime
import gzip
import hashlib
import json
import secrets
from pathlib import Path

QUELLE = Path("buch/arbeit/wertungsvergleich")
ZIEL = Path("Research/wertungsvergleich")
TEILGROESSE = 250_000
PSEUDONYMLAENGE = 16


def salz_lesen(quelle: Path) -> str:
    """Das geheime Salz; beim ersten Mal zufällig erzeugt und lokal gespeichert."""
    datei = quelle / "salz.txt"
    if not datei.exists():
        datei.write_text(secrets.token_hex(32), encoding="utf-8")
    return datei.read_text(encoding="utf-8").strip()


def pseudonym(salz: str, kennung: str) -> str:
    """Pseudonym einer Lichess-Kennung. Beispiel: pseudonym("s", "abc") → 16 Hexzeichen."""
    return hashlib.sha256(f"{salz}:{kennung}".encode()).hexdigest()[:PSEUDONYMLAENGE]


def monat(zeitpunkt_ms: int | None) -> str | None:
    """Zeitpunkt in Millisekunden als „JJJJ-MM“, sonst None."""
    if not zeitpunkt_ms:
        return None
    return datetime.datetime.fromtimestamp(zeitpunkt_ms / 1000, tz=datetime.UTC).strftime("%Y-%m")


def oeffentlich(profil: dict, salz: str, fide: dict | None, chesscom: dict | None) -> dict:
    """Ein Profil aus ``alle.ndjson.gz`` in der öffentlichen Form (siehe Dateikopf)."""
    eintrag = {
        "p": pseudonym(salz, profil["id"]),
        "perfs": profil.get("perfs") or {},
        "verbaende": profil.get("verbaende") or {},
        "land": profil.get("land"),
        "titel": profil.get("titel"),
        "erstellt": monat(profil.get("erstellt")),
        "gesehen": monat(profil.get("gesehen")),
        "spielzeit": profil.get("spielzeit"),
        "regelverstoss": profil.get("regelverstoss"),
        "gesperrt": profil.get("gesperrt"),
        "hat_chesscom_link": bool(profil.get("chesscom")),
    }
    if fide:
        eintrag["fide_offiziell"] = {k: fide.get(k) for k in ("standard", "schnell", "blitz", "aktiv")}
    if chesscom:
        eintrag["chesscom"] = {
            zeit: {k: werte.get(k) for k in ("rating", "rd", "games")}
            for zeit, werte in (chesscom.get("perfs") or {}).items()
        }
    return eintrag


def zeilen(datei: Path):
    """Die JSON-Zeilen einer (gz-)Datei; fehlt sie, keine."""
    if not datei.exists():
        return
    oeffnen = gzip.open if datei.suffix == ".gz" else open
    with oeffnen(datei, "rt", encoding="utf-8") as ein:
        for zeile in ein:
            if zeile.strip():
                yield json.loads(zeile)


def schreiben(quelle: Path, ziel: Path) -> int:
    """Schreibt alle Profile in Teilen; Ausgabe: Zahl der Profile."""
    salz = salz_lesen(quelle)
    fide = {f["id"]: f for f in zeilen(quelle / "abgleich.ndjson")}
    konten = {k["chesscom"]: k for k in zeilen(quelle / "chesscom.ndjson") if k.get("gefunden")}
    ziel.mkdir(parents=True, exist_ok=True)
    for alt in ziel.glob("profile-*.ndjson.gz"):
        alt.unlink()
    gesehen: set[str] = set()
    anzahl, aus = 0, None
    for profil in zeilen(quelle / "alle.ndjson.gz"):
        if profil["id"] in gesehen:
            continue
        gesehen.add(profil["id"])
        if anzahl % TEILGROESSE == 0:
            if aus:
                aus.close()
            aus = gzip.open(ziel / f"profile-{anzahl // TEILGROESSE + 1:02d}.ndjson.gz", "wt", 9)
        konto = konten.get(profil.get("chesscom") or "")
        aus.write(json.dumps(oeffentlich(profil, salz, fide.get(profil["id"]), konto)) + "\n")
        anzahl += 1
    if aus:
        aus.close()
    return anzahl


def main() -> None:
    """Befehlszeile: Quelle und Ziel."""
    teiler = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teiler.add_argument("--quelle", type=Path, default=QUELLE)
    teiler.add_argument("--ziel", type=Path, default=ZIEL)
    argumente = teiler.parse_args()
    print(f"{schreiben(argumente.quelle, argumente.ziel)} Profile geschrieben")


if __name__ == "__main__":
    main()
