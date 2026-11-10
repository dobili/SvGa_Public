"""Vorführungen: Statisten spielen einen brillanten Zug mit Fortsetzung auf einem kleinen Brett vor.

Warum: Wunsch des Autors (10.11.2026): „Brillante Züge und ihre Fortsetzung könnten von dem
Statisten, der die Geschichte erzählt, vorgespielt werden.“ Daten in
``inhalte/abenteuer/vorfuehrungen.json`` (Schema ``abenteuer-vorfuehrungen.schema.json``), Statisten
verweisen mit ``eigenschaften.zeigt`` darauf (``docs/spiel/16_Statisten_und_Tiere.md``, 3.4).

Geprüft wird, was ein Mensch beim Abschreiben falsch machen kann: Die Partie muss nach ``ab``
Halbzügen genau ``fen`` ergeben (Brett, Zugrecht, Rochaderechte), jeder vorgeführte Zug muss legal
sein, und Titel sowie Satz zum letzten Zug stehen in den Texten. Regel: Kapitel 0, Notation.

Aufruf: ``python -m pipeline.abenteuer.vorfuehrungen`` (Befunde, Rückgabe 1 bei Fehlern).
"""

import io
import json
import sys
from pathlib import Path

import chess
import chess.pgn

INHALTE = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"


def _stellungsteil(fen: str) -> str:
    """Brett, Zugrecht, Rochade und en passant, ohne Zugzähler (die zählen Quellen verschieden)."""
    return " ".join(fen.split()[:4])


def pruefe_vorfuehrung(v: dict, texte: dict) -> list[str]:
    """Befunde zu einer Vorführung.

    Eingaben: ein Eintrag aus ``vorfuehrungen.json``, die Texte.
    Ausgabe: Befundliste, leer wenn alles stimmt.
    Beispiel: Opernpartie Morphy 1858, ``ab`` 24, Züge ``Txd7 … Td8#``.
    Sonderfall: Ein unlesbarer Zug in ``pgn`` oder ``zuege`` bricht die Prüfung dieser Vorführung ab.
    """
    name = v["kennung"]
    partie = chess.pgn.read_game(io.StringIO(v["pgn"]))
    if partie is None or partie.errors:
        return [f"{name}: pgn nicht lesbar"]
    zuege = list(partie.mainline_moves())
    if v["ab"] > len(zuege):
        return [f"{name}: ab {v['ab']} ist länger als die Partie ({len(zuege)} Halbzüge)"]
    brett = partie.board()
    for zug in zuege[: v["ab"]]:
        brett.push(zug)
    befunde = []
    if _stellungsteil(brett.fen()) != _stellungsteil(v["fen"]):
        befunde.append(f"{name}: fen passt nicht zur Partie nach {v['ab']} Halbzügen ({brett.fen()})")
    brett = chess.Board(v["fen"])
    for i, san in enumerate(v["zuege"], start=1):
        try:
            brett.push_san(san)
        except ValueError:
            befunde.append(f"{name}: Zug {i} „{san}“ ist in der Stellung nicht legal")
            break
    for schluessel in (f"vorfuehrung.{name}.titel", f"vorfuehrung.{name}.{len(v['zuege'])}"):
        if schluessel not in texte:
            befunde.append(f"{name}: Text {schluessel} fehlt in texte/de.json")
    return befunde


def pruefe_verweise(szenen: list[dict], kennungen: set[str]) -> list[str]:
    """Jedes ``zeigt`` eines Statisten nennt eine vorhandene Vorführung."""
    befunde = []
    for szene in szenen:
        for b in szene.get("belebung", []):
            ziel = b.get("eigenschaften", {}).get("zeigt")
            if ziel and ziel not in kennungen:
                befunde.append(f"{szene['karte']}: {b['name']} zeigt „{ziel}“, die Vorführung fehlt")
    return befunde


def pruefe_alles(inhalte: Path = INHALTE) -> list[str]:
    """Alle Vorführungen und alle Verweise aus den Szenen (A und Varianten)."""
    daten = json.loads((inhalte / "vorfuehrungen.json").read_text(encoding="utf-8"))
    texte = json.loads((inhalte / "texte" / "de.json").read_text(encoding="utf-8"))
    befunde = [b for v in daten["vorfuehrungen"] for b in pruefe_vorfuehrung(v, texte)]
    szenen = [json.loads(p.read_text(encoding="utf-8")) for p in sorted((inhalte / "szenen").rglob("*.json"))]
    return befunde + pruefe_verweise(szenen, {v["kennung"] for v in daten["vorfuehrungen"]})


def main() -> int:
    befunde = pruefe_alles()
    for b in befunde:
        print(f"  - {b}")
    print("Vorführungen in Ordnung" if not befunde else f"{len(befunde)} Befunde")
    return 1 if befunde else 0


if __name__ == "__main__":
    sys.exit(main())
