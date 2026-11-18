"""Gegenprobe in Zahlen: zwei Stellungsvorräte nebeneinander (alt Stockfish, neu App-Bots).

Warum: Der Autor wünscht (18.11.2026) menschliche Startstellungen für die kurzen Partieformen.
Ob die Stellungen aus Partien der App-Bots anders aussehen als die aus Stockfish mit Skill Level,
zeigen ein paar einfache Kennzahlen je Band (Bericht docs/spiel/auftraege/kurzformen_17-11.md):

- hängende Figuren: Figuren (ohne Bauern und Könige), die angegriffen und nicht gedeckt sind,
  Anteil der Stellungen mit mindestens einer (Regel: Kapitel 1, Zählen von Angreifern und
  Verteidigern, hier nur die einfachste Form „angegriffen und ungedeckt“);
- Material: Figurenmaterial beider Seiten (wie die Phase in stellungsvorrat.py) und
  Ungleichgewicht in Bauerneinheiten (Bauer 1, Springer und Läufer 3, Turm 5, Dame 9);
- Halbzug: wie weit die Partie war;
- Eröffnungen: verschiedene erste vier Halbzüge je Band und Anteil mit einem der vier häufigsten
  ersten Züge von Menschen (1. e4, 1. d4, 1. Sf3, 1. c4).

Aufruf: ``python -m pipeline.abenteuer.vorratsvergleich ALT.json NEU.json`` (Markdown-Tabelle).
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import chess

WERTE = {chess.PAWN: 1, chess.KNIGHT: 3, chess.BISHOP: 3, chess.ROOK: 5, chess.QUEEN: 9}
FIGUREN = (chess.KNIGHT, chess.BISHOP, chess.ROOK, chess.QUEEN)
EROEFFNUNG_HALBZUEGE = 4
HAUPTZUEGE = {"e4", "d4", "Nf3", "c4"}


def haengende(brett: chess.Board) -> int:
    """Zahl der Figuren beider Seiten, die angegriffen und nicht gedeckt sind.

    Beispiel: weißer Springer auf e5, von einem Turm angegriffen, ohne Deckung → 1.
    """
    zahl = 0
    for feld, figur in brett.piece_map().items():
        if figur.piece_type not in FIGUREN:
            continue
        angegriffen = brett.is_attacked_by(not figur.color, feld)
        gedeckt = brett.is_attacked_by(figur.color, feld)
        zahl += angegriffen and not gedeckt
    return zahl


def ungleichgewicht(brett: chess.Board) -> int:
    """Materialunterschied in Bauerneinheiten (Betrag). Beispiel: Grundstellung → 0."""
    summe = 0
    for figur in brett.piece_map().values():
        wert = WERTE.get(figur.piece_type, 0)
        summe += wert if figur.color == chess.WHITE else -wert
    return abs(summe)


def kennzahlen(eintraege: list[dict]) -> dict:
    """Kennzahlen einer Liste von Einträgen (eines Bandes oder des ganzen Vorrats)."""
    bretter = [chess.Board(e["fen"]) for e in eintraege]
    n = max(len(bretter), 1)
    eroeffnungen = {" ".join(e["zuege"][:EROEFFNUNG_HALBZUEGE]) for e in eintraege}
    figurenmaterial = [
        sum(WERTE[f.piece_type] for f in b.piece_map().values() if f.piece_type in FIGUREN) for b in bretter
    ]
    return {
        "stellungen": len(bretter),
        "haengendAnteil": sum(haengende(b) > 0 for b in bretter) / n,
        "haengendSchnitt": sum(haengende(b) for b in bretter) / n,
        "figurenmaterial": sum(figurenmaterial) / n,
        "ungleichgewicht": sum(ungleichgewicht(b) for b in bretter) / n,
        "halbzug": sum(len(e["zuege"]) for e in eintraege) / n,
        "eroeffnungen": len(eroeffnungen),
        "hauptzug": sum(bool(e["zuege"]) and e["zuege"][0] in HAUPTZUEGE for e in eintraege) / n,
    }


def je_band(vorrat: dict) -> dict[str, dict]:
    """Kennzahlen je Band und für alle Bänder zusammen („alle“)."""
    ergebnis = {}
    alle: list[dict] = []
    for band in vorrat["baender"]:
        eintraege = [e for liste in band["formate"].values() for e in liste]
        alle.extend(eintraege)
        ergebnis[band["kennung"]] = kennzahlen(eintraege)
    ergebnis["alle"] = kennzahlen(alle)
    return ergebnis


def tabelle(alt: dict, neu: dict) -> str:
    """Markdown-Tabelle: je Band alt und neu nebeneinander."""
    zeilen = [
        "| Band | Stellungen | mit hängender Figur | hängend je Stellung | Figurenmaterial "
        "| Ungleichgewicht | Halbzug | Eröffnungen (4 Halbzüge) | 1. e4, d4, Sf3, c4 |",
        "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ]
    a, n = je_band(alt), je_band(neu)
    for band in n:
        x, y = a.get(band), n[band]
        if x is None:
            continue
        zeilen.append(
            f"| {band} | {x['stellungen']} → {y['stellungen']} "
            f"| {x['haengendAnteil']:.0%} → {y['haengendAnteil']:.0%} "
            f"| {x['haengendSchnitt']:.2f} → {y['haengendSchnitt']:.2f} "
            f"| {x['figurenmaterial']:.1f} → {y['figurenmaterial']:.1f} "
            f"| {x['ungleichgewicht']:.1f} → {y['ungleichgewicht']:.1f} "
            f"| {x['halbzug']:.0f} → {y['halbzug']:.0f} "
            f"| {x['eroeffnungen']} → {y['eroeffnungen']} "
            f"| {x['hauptzug']:.0%} → {y['hauptzug']:.0%} |"
        )
    return "\n".join(zeilen)


def main() -> int:
    """Liest beide Vorräte und druckt die Tabelle."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("alt", type=Path)
    parser.add_argument("neu", type=Path)
    argumente = parser.parse_args()
    alt, neu = (json.loads(p.read_text(encoding="utf-8")) for p in (argumente.alt, argumente.neu))
    print(tabelle(alt, neu))
    return 0


if __name__ == "__main__":
    sys.exit(main())
