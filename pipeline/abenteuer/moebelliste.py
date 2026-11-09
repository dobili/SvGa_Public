"""Möbelliste des Schach-Abenteuers: alle Dateien in ``inhalte/abenteuer/moebel/`` zusammengeführt.

Warum: Bis Runde 4 standen alle Möbel in einer einzigen ``moebel.json``; jeder Helfer schrieb in
dieselbe Datei, und jeder Merge gab Konflikte (Auftrag des Haupt-Chats, 9.11.2026). Jetzt hat jeder
Ort seine eigene Datei (``maple-falls.json``, ``cedar-creek.json``, ``weg-maple-cedar.json`` …),
gemeinsame alte Einträge stehen in ``allgemein.json``. Format jeder Datei wie früher:
``{"moebel": {"<name>": {"quelle": …, "breite": …, "hoehe": …, …}}}``.

Die Namen bleiben über alle Dateien eindeutig, weil Szenen und Karten ein Möbel nur über seinen
Namen kennen. Ein doppelter Name ist ein Fehler (``lade_moebel`` bricht ab, der Test
``test_moebel_namen_eindeutig`` meldet ihn).
"""

import json
from pathlib import Path

ORDNER = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer" / "moebel"


def moebeldateien(ordner: Path = ORDNER) -> list[Path]:
    """Alle Möbeldateien, nach Namen sortiert (damit Fehlermeldungen immer gleich lauten)."""
    return sorted(ordner.glob("*.json"))


def doppelte_namen(ordner: Path = ORDNER) -> list[str]:
    """Namen, die in mehr als einer Datei stehen, mit beiden Dateien.

    Beispiel: ``["cc4Tresen (cedar-creek.json, allgemein.json)"]``; leer, wenn alles eindeutig ist.
    """
    herkunft: dict[str, str] = {}
    doppelt = []
    for datei in moebeldateien(ordner):
        for name in json.loads(datei.read_text(encoding="utf-8"))["moebel"]:
            if name in herkunft:
                doppelt.append(f"{name} ({herkunft[name]}, {datei.name})")
            herkunft.setdefault(name, datei.name)
    return doppelt


def lade_moebel(ordner: Path = ORDNER) -> dict[str, dict]:
    """Alle Möbel aller Orte in einem Wörterbuch Name → Angabe.

    Eingabe: der Ordner mit den Möbeldateien (Vorgabe ``inhalte/abenteuer/moebel``).
    Ausgabe: ``{"mf4Sofa": {"quelle": …, "breite": 32, …}, …}``.
    Sonderfall: Ein doppelter Name bricht mit ``ValueError`` ab, statt still einen zu überschreiben.
    """
    doppelt = doppelte_namen(ordner)
    if doppelt:
        raise ValueError("Möbelname doppelt: " + "; ".join(doppelt))
    alle: dict[str, dict] = {}
    for datei in moebeldateien(ordner):
        alle.update(json.loads(datei.read_text(encoding="utf-8"))["moebel"])
    return alle
