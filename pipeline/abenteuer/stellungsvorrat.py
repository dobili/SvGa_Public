"""Vorrat an Startstellungen für die kurzen Partieformen, aus Partien Bot gegen Bot.

Warum: Der Autor wünscht (17.11.2026), dass kurze Formate nicht immer dieselbe Stellung zeigen.
Zwei Bots ähnlicher Stärke spielen gegeneinander; an einer passenden Stelle (nach der Eröffnung,
im Mittelspiel oder im Endspiel) übernimmt der Leser. Regelwerk R13 nennt „Bot-gegen-Bot-Stellungen
passend zur Stärke“ als Quelle. Die App wählt zur Laufzeit aus diesem Vorrat
(app/src/abenteuer/regeln/vorrat.ts); auf dem Handy wird nichts erzeugt, weil eine Partie mit
Prüfung dort deutlich länger als ein paar Sekunden dauert (Bericht docs/spiel/auftraege/
kurzformen_17-11.md).

Ablauf je Stärkeband: Stockfish 19 lite (dieselbe Engine wie die App) spielt mit der Stufe des
Bandes („Skill Level“) gegen sich selbst. Ab Halbzug ERSTER_HALBZUG wird jede Stellung mit der
Auswertungstiefe von R13 bewertet. Passt sie in das Fenster eines Formats (Bewertung aus Sicht der
Seite am Zug, Phase nach Material, kein Matt in drei), kommt sie mit der Zugfolge bis dahin in den
Vorrat; je Partie höchstens eine Stellung je Format, damit der Vorrat abwechslungsreich bleibt.

Formate (Fenster aus Sicht des Lesers, der die Seite am Zug übernimmt):
- ``stellungsduell``: Mittelspiel, +0,8 bis +2,5 (R13)
- ``vorteil``: Mittelspiel, −0,5 bis +0,5 (R13b)
- ``endspielSieg``: Endspiel, +1,5 bis +8 (R13a, gewinnen)
- ``endspielRemis``: Endspiel, −1,5 bis +0,3 (R13a, Remis halten)

Phase nach Material (ohne Könige und Bauern, beide Seiten zusammen; Springer und Läufer 3, Turm 5,
Dame 9): Endspiel bis ENDSPIEL_BIS, sonst Mittelspiel.

Aufruf:
    python -m pipeline.abenteuer.stellungsvorrat --erzeugen [--je-format 8] [--hoechstens 30]
    python -m pipeline.abenteuer.stellungsvorrat --pruefen
"""

from __future__ import annotations

import argparse
import json
import random
import sys
from dataclasses import dataclass
from pathlib import Path

import chess

HAUPTORDNER = Path(__file__).resolve().parents[2]
VORRAT = HAUPTORDNER / "inhalte" / "abenteuer" / "stellungsvorrat.json"
TIEFE = 12
ZUGZEIT_S = 0.03
ERSTER_HALBZUG = 16
LETZTER_HALBZUG = 160
KURZES_MATT = 3
TOLERANZ = 0.1
ENDSPIEL_BIS = 26
WERTE = {chess.KNIGHT: 3, chess.BISHOP: 3, chess.ROOK: 5, chess.QUEEN: 9}
ZUFALLSZUEGE = 4

# Stärkebänder: Kennung, Elo von, Elo bis, Stufe der Engine (Skill Level 0 bis 20).
BAENDER = (
    ("band1", 0, 900, 0),
    ("band2", 900, 1200, 3),
    ("band3", 1200, 1500, 6),
    ("band4", 1500, 1800, 10),
    ("band5", 1800, 3000, 15),
)


@dataclass(frozen=True)
class Format:
    """Ein Format des Vorrats: Phase und Fenster der Bewertung."""

    phase: str
    unten: float
    oben: float


FORMATE = {
    "stellungsduell": Format("mittelspiel", 0.8, 2.5),
    "vorteil": Format("mittelspiel", -0.5, 0.5),
    "endspielSieg": Format("endspiel", 1.5, 8.0),
    "endspielRemis": Format("endspiel", -1.5, 0.3),
}


def material(brett: chess.Board) -> int:
    """Figurenmaterial beider Seiten ohne Könige und Bauern. Beispiel: Grundstellung → 62."""
    return sum(WERTE.get(f.piece_type, 0) for f in brett.piece_map().values())


def phase(brett: chess.Board) -> str:
    """„endspiel“ bis ENDSPIEL_BIS Punkte Material, sonst „mittelspiel“."""
    return "endspiel" if material(brett) <= ENDSPIEL_BIS else "mittelspiel"


def passende_formate(brett: chess.Board, wert: float, matt: int | None) -> list[str]:
    """Formate, deren Fenster und Phase die Stellung erfüllt (Wert aus Sicht der Seite am Zug)."""
    if matt is not None and abs(matt) <= KURZES_MATT:
        return []
    p = phase(brett)
    return [k for k, f in FORMATE.items() if f.phase == p and f.unten <= wert <= f.oben]


def band_von(elo: float) -> str:
    """Kennung des Stärkebands. Beispiel: 1300 → „band3“."""
    for kennung, von, bis, _ in BAENDER:
        if von <= elo < bis:
            return kennung
    return BAENDER[-1][0]


def eintrag(band: str, format_: str, nummer: int, brett: chess.Board, wert: float) -> dict:
    """Ein Eintrag des Vorrats mit Zugfolge (SAN, englisch) ab der Grundstellung."""
    zuege = chess.Board().variation_san(brett.move_stack)
    san = [z for z in zuege.split() if not z.endswith(".")]
    return {
        "kennung": f"{band}.{format_}{nummer}",
        "fen": brett.fen(),
        "zuege": san,
        "bewertung": round(wert, 2),
    }


def spiele_und_sammle(
    spieler, bewerter, stufe: int, zufall: random.Random, gesucht: set[str]
) -> dict[str, chess.Board]:
    """Eine Partie Bot gegen Bot; je gesuchtem Format die erste passende Stellung (Kopie des Bretts).

    Bewertet wird nur, wenn die Phase der Stellung zu einem noch gesuchten Format passt; sind alle
    gesuchten Formate gefunden, endet die Partie früh (spart Rechenzeit).
    """
    import chess.engine

    brett = chess.Board()
    funde: dict[str, chess.Board] = {}
    spieler.configure({"Skill Level": stufe})
    while not brett.is_game_over() and brett.ply() < LETZTER_HALBZUG:
        offen = gesucht - funde.keys()
        if not offen:
            break
        if brett.ply() < ZUFALLSZUEGE:
            brett.push(zufall.choice(list(brett.legal_moves)))
            continue
        if brett.ply() >= ERSTER_HALBZUG and phase(brett) in {FORMATE[f].phase for f in offen}:
            zug = bewerter.bester(brett, TIEFE)
            if zug:
                for f in passende_formate(brett, zug.wert, zug.matt):
                    if f in offen:
                        funde.setdefault(f, brett.copy())
        ergebnis = spieler.play(brett, chess.engine.Limit(time=ZUGZEIT_S), game=object())
        if ergebnis.move is None:
            break
        brett.push(ergebnis.move)
    return funde


def erzeuge(je_format: int, hoechstens: int, startwert: int) -> dict:
    """Der ganze Vorrat: je Band Partien, bis jedes Format genug Stellungen hat."""
    import chess.engine

    from pipeline.trainer.engine import ENGINE_DATEI, Engine

    zufall = random.Random(startwert)
    baender = []
    with Engine() as bewerter:
        spieler = chess.engine.SimpleEngine.popen_uci(["node", str(ENGINE_DATEI)])
        try:
            for kennung, von, bis, stufe in BAENDER:
                sammlung: dict[str, list[dict]] = {f: [] for f in FORMATE}
                gesehen: set[str] = set()
                for _ in range(hoechstens):
                    if all(len(v) >= je_format for v in sammlung.values()):
                        break
                    gesucht = {f for f, v in sammlung.items() if len(v) < je_format}
                    for f, brett in spiele_und_sammle(spieler, bewerter, stufe, zufall, gesucht).items():
                        if len(sammlung[f]) < je_format and brett.board_fen() not in gesehen:
                            gesehen.add(brett.board_fen())
                            wert = bewerter.bester(brett, TIEFE).wert
                            sammlung[f].append(eintrag(kennung, f, len(sammlung[f]) + 1, brett, wert))
                print(kennung, {f: len(v) for f, v in sammlung.items()}, file=sys.stderr)
                baender.append({"kennung": kennung, "eloVon": von, "eloBis": bis, "formate": sammlung})
        finally:
            spieler.quit()
    return {"schemaVersion": 1, "baender": baender}


def pruefe(vorrat: dict, bewerte) -> list[str]:
    """Funde: Zugfolge passt nicht zur FEN, Phase falsch oder Bewertung außerhalb des Fensters."""
    funde = []
    for band in vorrat["baender"]:
        for format_, eintraege in band["formate"].items():
            f = FORMATE[format_]
            for e in eintraege:
                brett = chess.Board()
                for san in e["zuege"]:
                    brett.push_san(san)
                if brett.board_fen() != chess.Board(e["fen"]).board_fen():
                    funde.append(f"{e['kennung']}: Zugfolge führt nicht zur FEN")
                    continue
                if phase(brett) != f.phase:
                    funde.append(f"{e['kennung']}: Phase {phase(brett)} statt {f.phase}")
                wert, matt = bewerte(brett)
                if matt is not None and abs(matt) <= KURZES_MATT:
                    funde.append(f"{e['kennung']}: Matt in {matt}")
                elif not f.unten - TOLERANZ <= wert <= f.oben + TOLERANZ:
                    funde.append(f"{e['kennung']}: Bewertung {wert:+.2f} außerhalb des Fensters")
    return funde


def main() -> int:
    """Erzeugt oder prüft den Vorrat; Rückgabe 1 bei Funden."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--erzeugen", action="store_true")
    parser.add_argument("--pruefen", action="store_true")
    parser.add_argument("--je-format", type=int, default=8)
    parser.add_argument("--hoechstens", type=int, default=30, help="höchstens so viele Partien je Band")
    parser.add_argument("--startwert", type=int, default=1)
    argumente = parser.parse_args()
    if argumente.erzeugen:
        vorrat = erzeuge(argumente.je_format, argumente.hoechstens, argumente.startwert)
        VORRAT.write_text(json.dumps(vorrat, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if argumente.pruefen:
        from pipeline.trainer.engine import Engine

        with Engine() as engine:

            def bewerte(brett: chess.Board) -> tuple[float, int | None]:
                zug = engine.bester(brett, TIEFE)
                return (zug.wert, zug.matt) if zug else (0.0, None)

            funde = pruefe(json.loads(VORRAT.read_text(encoding="utf-8")), bewerte)
        for fund in funde:
            print(fund)
        print(f"{len(funde)} Funde")
        return 1 if funde else 0
    return 0


if __name__ == "__main__":
    sys.exit(main())
