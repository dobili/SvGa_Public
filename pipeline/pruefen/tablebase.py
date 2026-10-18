"""Endspielabbildungen mit der Tablebase prüfen (Lichess, bis sieben Steine).

Wozu diese Datei da ist:
    Wunsch des Autors (18.10.2026): Die Engine schwankt bei manchen Endspielen (Abb. 9.41 zeigte
    in Tiefe 18 +1,05, obwohl die Stellung theoretisch remis ist). Eine Tablebase kennt das
    Ergebnis jeder Stellung mit wenigen Steinen genau. Dieses Werkzeug fragt die Endspiel-
    abbildungen der Kapitel 8 bis 10 mit höchstens sieben Steinen bei der Lichess-Tablebase ab
    (sparsam: Zwischenspeicher, höchstens eine Abfrage je Sekunde, Kennung
    „schach-von-grund-auf.com“) und vergleicht die Aufgaben des Endspieltrainers damit.
    Ergebnis: Bericht ``buch/arbeit/berichte/tablebase.md`` (nur lokal) und Befunde auf der Konsole.
    Ein Widerspruch zum Buch ist ein Buchbefund für den Autor (nur er ändert das Buch).

Aufruf (im Hauptordner, mit Netz):
    python -m pipeline.pruefen.tablebase
"""

from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import chess

HAUPTORDNER = Path(__file__).resolve().parents[2]
DATEN = HAUPTORDNER / "app" / "public" / "daten" / "de" / "a1"
ENDSPIELAUFGABEN = HAUPTORDNER / "inhalte" / "de" / "trainer" / "endspiel.json"
ZWISCHENSPEICHER = HAUPTORDNER / "buch" / "arbeit" / "tablebase" / "abfragen.json"
BERICHT = HAUPTORDNER / "buch" / "arbeit" / "berichte" / "tablebase.md"
ADRESSE = "https://tablebase.lichess.ovh/standard"
KENNUNG = "schach-von-grund-auf.com"
HOECHSTENS_STEINE = 7
PAUSE_SEKUNDEN = 1.0
FRIST_SEKUNDEN = 15
ENDSPIELKAPITEL = (8, 9, 10)
# Kategorien der Lichess-Tablebase aus Sicht der Seite am Zug; „cursed“ und „blessed“ sind wegen
# der 50-Züge-Regel remis, praktisch aber Gewinn oder Verlust ohne Regel.
GEWINN = ("win",)
VERLUST = ("loss",)


@dataclass(frozen=True)
class Urteil:
    """Ergebnis der Tablebase: Kategorie für die Seite am Zug und die besten Züge (SAN)."""

    kategorie: str
    beste: tuple[str, ...]

    def fuer(self, seite: chess.Color, am_zug: chess.Color) -> str:
        """„gewinn“, „verlust“ oder „remis“ aus Sicht von ``seite``.

        Beispiel: Kategorie „loss“, Weiß am Zug, Sicht Schwarz → „gewinn“.
        """
        if self.kategorie in GEWINN:
            return "gewinn" if seite == am_zug else "verlust"
        if self.kategorie in VERLUST:
            return "verlust" if seite == am_zug else "gewinn"
        return "remis"


Abfrage = Callable[[str], dict[str, Any]]


def lichess_abfrage(fen: str) -> dict[str, Any]:
    """Eine Abfrage bei der Lichess-Tablebase mit unserer Kennung; Fehler werden nicht verschluckt."""
    anfrage = urllib.request.Request(
        f"{ADRESSE}?{urllib.parse.urlencode({'fen': fen})}", headers={"User-Agent": KENNUNG}
    )
    with urllib.request.urlopen(anfrage, timeout=FRIST_SEKUNDEN) as antwort:
        return json.loads(antwort.read().decode("utf-8"))


class Tablebase:
    """Fragt Stellungen ab und merkt sich die Antworten in einer lokalen Datei."""

    def __init__(self, abfrage: Abfrage = lichess_abfrage, speicher: Path = ZWISCHENSPEICHER) -> None:
        self.abfrage = abfrage
        self.speicher = speicher
        self.gemerkt: dict[str, dict[str, Any]] = (
            json.loads(speicher.read_text(encoding="utf-8")) if speicher.exists() else {}
        )
        self._zuletzt = 0.0

    def urteil(self, fen: str) -> Urteil | None:
        """Das Urteil der Tablebase; None bei mehr als sieben Steinen."""
        brett = chess.Board(fen)
        if len(brett.piece_map()) > HOECHSTENS_STEINE:
            return None
        schluessel = " ".join(brett.fen().split()[:4])
        if schluessel not in self.gemerkt:
            self._warte()
            self.gemerkt[schluessel] = self.abfrage(schluessel + " 0 1")
            self._speichere()
        daten = self.gemerkt[schluessel]
        beste = tuple(z["san"] for z in daten.get("moves", []) if z.get("category") == _gegenteil(daten))
        return Urteil(str(daten.get("category", "unknown")), beste)

    def _warte(self) -> None:
        pause = PAUSE_SEKUNDEN - (time.monotonic() - self._zuletzt)
        if pause > 0:
            time.sleep(pause)
        self._zuletzt = time.monotonic()

    def _speichere(self) -> None:
        self.speicher.parent.mkdir(parents=True, exist_ok=True)
        self.speicher.write_text(json.dumps(self.gemerkt, indent=1, sort_keys=True), encoding="utf-8")


def _gegenteil(daten: dict[str, Any]) -> str:
    """Die Kategorie der besten Züge: Ein Zug, nach dem der Gegner verliert, gewinnt."""
    return {"win": "loss", "loss": "win"}.get(str(daten.get("category")), str(daten.get("category")))


@dataclass(frozen=True)
class Widerspruch:
    """Eine Endspielaufgabe, deren Ziel die Tablebase nicht bestätigt."""

    abbildung: str
    ziel: str
    tablebase: str


def pruefe_aufgaben(aufgaben: list[dict[str, Any]], tablebase: Tablebase) -> list[Widerspruch]:
    """Vergleicht das Ziel jeder Endspielaufgabe (Gewinn oder Remis für den Leser) mit der Tablebase.

    Beispiel: Aufgabe „Remis halten“ für Schwarz in Abb. 8.25, Tablebase remis → kein Widerspruch.
    """
    ergebnis = []
    for aufgabe in aufgaben:
        urteil = tablebase.urteil(aufgabe["fen"])
        if urteil is None:
            continue
        brett = chess.Board(aufgabe["fen"])
        leser = chess.WHITE if aufgabe["leser"] == "w" else chess.BLACK
        sicht = urteil.fuer(leser, brett.turn)
        passt = sicht == "gewinn" if aufgabe["ziel"] == "gewinn" else sicht != "verlust"
        if not passt:
            nummer = aufgabe.get("herkunft", {}).get("abbildung", aufgabe["id"])
            ergebnis.append(Widerspruch(nummer, aufgabe["ziel"], sicht))
    return ergebnis


def endspielabbildungen() -> list[tuple[str, str]]:
    """(Nummer, FEN) der Abbildungen aus Kapitel 8 bis 10 mit beiden Königen und bis zu sieben Steinen."""
    ergebnis = []
    for kapitel in ENDSPIELKAPITEL:
        daten = json.loads((DATEN / f"kap{kapitel:02d}.json").read_text(encoding="utf-8"))
        for abbildung in daten["abbildungen"]:
            brett = chess.Board(abbildung["fen"])
            if brett.is_valid() and len(brett.piece_map()) <= HOECHSTENS_STEINE:
                ergebnis.append((abbildung["id"], abbildung["fen"]))
    return ergebnis


def bericht(tablebase: Tablebase) -> str:
    """Tabelle: je Endspielabbildung das Urteil für die Seite am Zug und die besten Züge."""
    zeilen = ["| Abb. | am Zug | Tablebase | beste Züge |", "|---|---|---|---|"]
    for nummer, fen in endspielabbildungen():
        urteil = tablebase.urteil(fen)
        if urteil is None:
            continue
        am_zug = "Weiß" if chess.Board(fen).turn == chess.WHITE else "Schwarz"
        zeilen.append(f"| {nummer} | {am_zug} | {urteil.kategorie} | {' '.join(urteil.beste[:4]) or '–'} |")
    return "\n".join(zeilen) + "\n"


def main() -> None:
    tablebase = Tablebase()
    BERICHT.parent.mkdir(parents=True, exist_ok=True)
    BERICHT.write_text(bericht(tablebase), encoding="utf-8")
    aufgaben = json.loads(ENDSPIELAUFGABEN.read_text(encoding="utf-8"))["aufgaben"]
    widersprueche = pruefe_aufgaben(aufgaben, tablebase)
    for w in widersprueche:
        print(f"Abb. {w.abbildung}: Aufgabe „{w.ziel}“, Tablebase für den Leser „{w.tablebase}“")
    print(f"Bericht: {BERICHT}; {len(widersprueche)} Widersprüche")


if __name__ == "__main__":
    main()
