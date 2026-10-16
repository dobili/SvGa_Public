"""Schwierigkeit 1 bis 5 für Trainer-Aufgaben: aus der Lichess-Wertung und aus einer Engine-Messung.

Wozu diese Datei da ist:
    Die Trainer sortieren Aufgaben nach Schwierigkeit (Pflichtenheft 7). Zwei Maße:
    1. Lichess-Wertung (Elo-artig, aus Millionen Lösungsversuchen echter Spieler): das ehrlichste
       Maß, aber nur für Aufgaben aus der Lichess-Datenbank.
    2. Engine-Messung für jede Aufgabe, auch die aus dem Buch: die Suchtiefe, ab der Stockfish den
       Lösungszug für den besten hält und dabei bleibt (engine.tiefe_bis_loesung), und die Länge
       der Lösung in eigenen Zügen. Beides wird an den Lichess-Aufgaben geeicht: Für jede
       Messklasse (Tiefe, Länge) der mittlere Lichess-Wert ihrer Aufgaben → Stufe. So bekommen
       Buchaufgaben eine Stufe, die zu den Lichess-Aufgaben passt.

Stufen nach Wertung (Leser des Buchs: Einsteiger bis etwa 2000 Elo):
    1 bis 999, 2 bis 1299, 3 bis 1599, 4 bis 1899, 5 ab 1900.
"""

from __future__ import annotations

from dataclasses import dataclass
from statistics import median

STUFENGRENZEN = (1000, 1300, 1600, 1900)
# Messklassen der Tiefe: flach (hängende Figur, Matt in 1), mittel, tief, sehr tief.
TIEFENKLASSEN = (2, 5, 9)
LAENGENKLASSEN = (1, 2)
# Höchste gemessene Tiefe; wer den Zug bis dahin nicht findet, bekommt diese Klasse.
HOECHSTTIEFE = 16


def stufe_von_wertung(wertung: int) -> int:
    """1 bis 5 aus der Lichess-Wertung. Beispiel: 1450 → 3."""
    return 1 + sum(1 for grenze in STUFENGRENZEN if wertung >= grenze)


@dataclass(frozen=True)
class Messung:
    """Die Engine-Messung einer Aufgabe."""

    tiefe: int | None  # Suchtiefe, ab der die Engine beim Lösungszug bleibt; None: nie
    laenge: int  # eigene Züge der Lösung


def klasse(m: Messung) -> str:
    """Messklasse „tN-lM“: Tiefenklasse 0 bis 3, Längenklasse 0 bis 2."""
    tiefe = HOECHSTTIEFE if m.tiefe is None else m.tiefe
    t = sum(1 for grenze in TIEFENKLASSEN if tiefe > grenze)
    ln = sum(1 for grenze in LAENGENKLASSEN if m.laenge > grenze)
    return f"t{t}-l{ln}"


def eiche(messungen: list[tuple[Messung, int]]) -> dict[str, int]:
    """Je Messklasse die Stufe aus dem Median der Lichess-Wertungen ihrer Aufgaben.

    Eingaben: (Messung, Wertung) der Lichess-Aufgaben. Ausgabe: Klasse → Stufe. Klassen ohne
    Aufgaben fehlen; ``stufe_von_messung`` greift dann auf die nächste Nachbarklasse zurück.
    """
    werte: dict[str, list[int]] = {}
    for m, wertung in messungen:
        werte.setdefault(klasse(m), []).append(wertung)
    return {k: stufe_von_wertung(round(median(v))) for k, v in werte.items()}


def stufe_von_messung(m: Messung, eichung: dict[str, int]) -> int:
    """Stufe einer Aufgabe aus ihrer Messklasse; ohne Eichwert die Nachbarklasse, sonst 3."""
    k = klasse(m)
    if k in eichung:
        return eichung[k]
    t, ln = int(k[1]), int(k[4])
    for abstand in (1, 2, 3):
        for kandidat in (
            f"t{t - abstand}-l{ln}",
            f"t{t + abstand}-l{ln}",
            f"t{t}-l{ln - abstand}",
            f"t{t}-l{ln + abstand}",
        ):
            if kandidat in eichung:
                return eichung[kandidat]
    return 3
