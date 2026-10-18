"""Auswahl der Eichpartien: Wertungsbänder, Prüfung einer Partie, Zählstand und Ablage.

Wozu diese Datei da ist:
    Die Eichung soll alle Spielstärken gleich gut abdecken (Entscheidung 6 vom 18.10.2026):
    gewertete Schnellschach-Partien, gleich viele je 200-Punkte-Band von 400 bis 2400. Diese Datei
    rechnet nur, sie fragt nichts im Netz ab; ``chesscom.py`` und ``lichess.py`` holen die Partien,
    ``sammeln.py`` steuert den Lauf.

Ablage: je Plattform eine Datei mit einer Partie je Zeile (JSON), damit ein abgebrochener Lauf an
derselben Stelle weitermacht. Spielernamen stehen nicht in den Partien, nur in der Liste der schon
besuchten Spieler (beides bleibt lokal unter ``buch/arbeit/eichung/``).
"""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from pathlib import Path

UNTERSTE_WERTUNG = 400
OBERSTE_WERTUNG = 2400
BANDBREITE = 200
BAENDER: tuple[int, ...] = tuple(range(UNTERSTE_WERTUNG, OBERSTE_WERTUNG, BANDBREITE))
"""Untergrenzen der Bänder: 400, 600, …, 2200 (zehn Bänder)."""

MINDEST_EIGENE_ZUEGE = 10
"""Wie MINDESTENS_ZUEGE in app/src/spiel/genauigkeit.ts: darunter keine Schätzung der Spielstärke."""

HOECHSTE_ABWEICHUNG = 100
"""Größte Wertungsabweichung (RD); darüber ist die Wertung noch unsicher (neues Konto)."""

JE_SPIELER = 3
"""Höchstens so viele Partien je Spieler, damit kein einzelner Spieler ein Band prägt."""


@dataclass(frozen=True)
class Seite:
    """Eine Seite einer Partie: Wertungszahl nach der Partie und Genauigkeit der Plattform."""

    wertung: int
    genauigkeit: float | None


@dataclass(frozen=True)
class Eichpartie:
    """Eine Partie für die Eichung, ohne Spielernamen.

    ``band`` ist das Band des ausgewählten Spielers, ``seite`` seine Farbe („white“, „black“).
    ``zuege`` sind die Züge in Kurznotation ab der Grundstellung.
    """

    plattform: str
    kennung: str
    bedenkzeit: str
    weiss: Seite
    schwarz: Seite
    zuege: tuple[str, ...]
    ergebnis: str
    band: int
    seite: str


def band_von(wertung: int) -> int | None:
    """Untergrenze des Bandes einer Wertungszahl, oder None außerhalb von 400 bis 2399.

    Beispiel: 1234 → 1200; 2400 → None (gehört nicht mehr dazu); 399 → None.
    """
    if wertung < UNTERSTE_WERTUNG or wertung >= OBERSTE_WERTUNG:
        return None
    return UNTERSTE_WERTUNG + (wertung - UNTERSTE_WERTUNG) // BANDBREITE * BANDBREITE


def genug_zuege(halbzuege: int) -> bool:
    """Hat jede Seite mindestens zehn eigene Züge gemacht? Kürzere Partien taugen nicht."""
    return halbzuege >= 2 * MINDEST_EIGENE_ZUEGE


class Zaehlstand:
    """Wie viele Partien je Band noch fehlen.

    Eingaben: Partien je Plattform insgesamt (gleichmäßig auf die zehn Bänder verteilt, aufgerundet)
    und die schon gesammelten Partien (für einen fortgesetzten Lauf).
    """

    def __init__(self, gesamt: int, vorhanden: list[Eichpartie]) -> None:
        self.soll = -(-gesamt // len(BAENDER))
        self.ist: dict[int, int] = {band: 0 for band in BAENDER}
        for partie in vorhanden:
            self.ist[partie.band] = self.ist.get(partie.band, 0) + 1

    def braucht(self, band: int | None) -> bool:
        return band is not None and self.ist.get(band, self.soll) < self.soll

    def zaehle(self, band: int) -> None:
        self.ist[band] = self.ist.get(band, 0) + 1

    def fertig(self) -> bool:
        return all(self.ist[band] >= self.soll for band in BAENDER)

    def tabelle(self) -> str:
        """Eine Zeile je Band, etwa „1200–1399: 30/30“."""
        return "\n".join(f"{band}–{band + BANDBREITE - 1}: {self.ist[band]}/{self.soll}" for band in BAENDER)


def als_zeile(partie: Eichpartie) -> str:
    return json.dumps(asdict(partie), ensure_ascii=False)


def aus_zeile(zeile: str) -> Eichpartie:
    roh = json.loads(zeile)
    return Eichpartie(
        plattform=roh["plattform"],
        kennung=roh["kennung"],
        bedenkzeit=roh["bedenkzeit"],
        weiss=Seite(**roh["weiss"]),
        schwarz=Seite(**roh["schwarz"]),
        zuege=tuple(roh["zuege"]),
        ergebnis=roh["ergebnis"],
        band=roh["band"],
        seite=roh["seite"],
    )


def lies_partien(pfad: Path) -> list[Eichpartie]:
    """Die schon gesammelten Partien einer Plattform; fehlt die Datei, keine."""
    if not pfad.exists():
        return []
    return [aus_zeile(z) for z in pfad.read_text(encoding="utf-8").splitlines() if z.strip()]


def haenge_an(pfad: Path, partie: Eichpartie) -> None:
    """Hängt eine Partie an; jede Zeile ist sofort gespeichert (Abbruch verliert nichts)."""
    with pfad.open("a", encoding="utf-8") as datei:
        datei.write(als_zeile(partie) + "\n")
