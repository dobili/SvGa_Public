"""Aufgaben für den Endspieltrainer (Kapitel 8 und 9) → ``inhalte/de/trainer/endspiel.json``.

Wozu diese Datei da ist:
    Pflichtenheft 7: „Buchstellungen gegen die Engine gewinnen oder Remis halten.“ Jede Stellung ist
    eine Abbildung aus Kapitel 8 oder 9 (Mattführung, Opposition, Schlüsselfelder, Quadrat,
    Bauernrennen, Durchbruch, Freibauern, Zugzwang, Turmendspiele mit Philidor, Lucena und Vancura,
    Dame gegen Bauer, Leichtfiguren). Die Engine prüft jede Stellung: Welche Seite steht auf
    Gewinn, welche hält Remis, wie viele Züge braucht ein Matt höchstens (eine Hauptvariante in
    Tiefe 18), und ist der erste Zug der einzige (alle Züge in Tiefe 12). Daraus folgen die Seite
    des Lesers, das Ziel und die Schwierigkeit. Stellungen, die
    die Engine weder als gewonnen noch als Remis einordnet, fallen weg (Bericht auf der Konsole).
    Kein Buchtext: Die Merksätze stehen in der App (de.json), hier nur Nummern, Stellungen, Themen.
    Seit P4 (R47) dazu freie Endspielaufgaben der Lichess-Datenbank (CC0, endspiel_lichess.py):
    Bauern-, Turm-, Damen- und Leichtfigurenendspiele mit höchstens acht Steinen, Gewinn- und
    Remisaufgaben, von der Engine bestätigt, Schwierigkeit nach der Lichess-Wertung.

Aufruf (im Hauptordner, Engine über ``cd app && npm ci``):
    python -m pipeline.trainer.endspiel                                   # nur Buch
    python -m pipeline.trainer.endspiel --lichess buch/arbeit/lichess/passende-endspiel.pkl
    python -m pipeline.trainer.endspiel --lichess … --teil 1/4            # Lichess-Gruppen eines Teils
    python -m pipeline.trainer.endspiel --zusammen                        # Buch rechnen, Teile einsammeln
"""

from __future__ import annotations

import sys
from dataclasses import dataclass
from datetime import date
from pathlib import Path

import chess

from pipeline.trainer.daten import DATENORDNER, TRAINERORDNER, lies_json, schreibe_daten
from pipeline.trainer.engine import Engine, Zugwert, engine_vorhanden

SCHEMA = "trainer-endspiel.schema.json"
ZIELDATEI = TRAINERORDNER / "endspiel.json"
TIEFE = 18
# Für die Frage „einziger Zug“ reichen alle Züge in geringerer Tiefe (sonst dauert eine Mattführung Minuten).
TIEFE_EINZIG = 12
GEWINN_AB = 2.0
REMIS_BIS = 0.8
FIGURENWERT = {chess.PAWN: 1, chess.KNIGHT: 3, chess.BISHOP: 3, chess.ROOK: 5, chess.QUEEN: 9}
HOECHSTSTUFE = 5

# Grundschwierigkeit je Thema; ein einziger Zug macht die Aufgabe eine Stufe schwerer.
GRUNDSTUFE = {
    "damenmatt": 1,
    "turmmatt": 2,
    "laeuferpaar": 3,
    "opposition": 2,
    "schluesselfelder": 3,
    "quadrat": 1,
    "bauernrennen": 2,
    "durchbruch": 3,
    "freibauer": 3,
    "zugzwang": 4,
    "randbauer": 2,
    "turmendspiel": 4,
    "dameGegenBauer": 4,
    "leichtfiguren": 4,
}


@dataclass(frozen=True)
class Kandidat:
    abbildung: str
    thema: str
    stichwort: str | None = None
    # Seite des Lesers bei Remis, wenn die Regel „die ärmere Seite hält“ nicht die Lehre trifft
    # (Abb. 9.40: Der Springer muss den Bauern aufhalten).
    leser: str | None = None
    # Urteil des Buches, falls die Engine in Tiefe 18 unklar bleibt (Regel 1: Das Buch ist die
    # Quelle). Abb. 9.41: falscher Läufer, das Buch sagt „remis“; Stockfish ohne Endspieldatenbank
    # sieht nur etwa +1, bleibt beim Ausspielen aber unter +1 (Prüfung 17.10.2026, Opus).
    buch: str | None = None


# Die Abbildungen der Kapitel 8 und 9, die sich ausspielen lassen (Lehrbilder mit Pfeilen, die
# nur eine Regel zeigen, und Zwischenstellungen einer Zugfolge sind ausgelassen).
KANDIDATEN: list[Kandidat] = [
    Kandidat("8.4", "damenmatt", "kasten"),
    Kandidat("8.55", "damenmatt", "patt"),
    Kandidat("8.56", "damenmatt"),
    Kandidat("8.9", "turmmatt", "kasten"),
    Kandidat("8.11", "turmmatt"),
    Kandidat("8.13", "turmmatt"),
    Kandidat("8.57", "turmmatt", "patt"),
    Kandidat("8.16", "laeuferpaar"),
    Kandidat("8.19", "opposition"),
    Kandidat("8.23", "opposition", "fernopposition"),
    Kandidat("8.24", "opposition", "diagonalopposition"),
    Kandidat("8.25", "schluesselfelder"),
    Kandidat("8.26", "schluesselfelder"),
    Kandidat("8.27", "schluesselfelder"),
    Kandidat("8.28", "schluesselfelder"),
    Kandidat("8.29", "schluesselfelder"),
    Kandidat("8.30", "schluesselfelder", "patt"),
    # 8.31 (Randbauer, Weiß am Zug mit Ka6 patt oder Bauernverlust): Die Engine zieht zuerst und
    # macht sofort Remis, der Leser käme nie an den Zug (Befund des Autors, P4 R47). Bleibt
    # Lehrbild; der Randbauer wird an 8.61 und 8.63 geübt.
    Kandidat("8.32", "schluesselfelder"),
    Kandidat("8.34", "schluesselfelder"),
    Kandidat("8.35", "quadrat"),
    Kandidat("8.36", "quadrat"),
    Kandidat("8.38", "bauernrennen"),
    Kandidat("8.40", "bauernrennen"),
    Kandidat("8.42", "freibauer", "mehrheit"),
    Kandidat("8.45", "durchbruch"),
    Kandidat("8.47", "freibauer", "entfernterFreibauer"),
    Kandidat("8.50", "freibauer", "verbundene"),
    Kandidat("8.51", "zugzwang", "dreieck"),
    Kandidat("8.53", "zugzwang"),
    Kandidat("8.58", "opposition"),
    Kandidat("8.59", "opposition"),
    Kandidat("8.60", "schluesselfelder"),
    Kandidat("8.61", "randbauer"),
    Kandidat("8.62", "schluesselfelder"),
    Kandidat("8.63", "randbauer"),
    Kandidat("8.64", "bauernrennen"),
    Kandidat("8.65", "freibauer"),
    Kandidat("8.66", "freibauer", "entfernterFreibauer"),
    Kandidat("8.67", "zugzwang", "dreieck"),
    Kandidat("8.68", "freibauer"),
    Kandidat("9.1", "turmendspiel", "abschneiden"),
    Kandidat("9.2", "turmendspiel", "kurzeSeite"),
    Kandidat("9.3", "turmendspiel", "philidor"),
    Kandidat("9.5", "turmendspiel", "kurzeSeite"),
    Kandidat("9.8", "turmendspiel", "lucena"),
    Kandidat("9.15", "turmendspiel", "vancura"),
    Kandidat("9.16", "turmendspiel"),
    Kandidat("9.18", "turmendspiel", "abschneiden"),
    Kandidat("9.19", "turmendspiel", "abschneiden"),
    Kandidat("9.20", "turmendspiel", "abschneiden"),
    Kandidat("9.21", "turmendspiel", "unterverwandlung"),
    Kandidat("9.22", "turmendspiel", "verbundene"),
    # 9.23: Das Buch sagt nur, dass Weiß mit Txa7 den Bauern zurückgewinnt (Schwarz hat vorher einen
    # Bauern mehr), keinen Gewinn; die Engine sieht Remis. Also eine Remisaufgabe für Weiß (X1).
    Kandidat("9.23", "turmendspiel", "siebteReihe"),
    Kandidat("9.24", "turmendspiel"),
    Kandidat("9.25", "turmendspiel", "turmHinterFreibauer"),
    Kandidat("9.26", "turmendspiel", "entfernterFreibauer"),
    Kandidat("9.28", "dameGegenBauer"),
    Kandidat("9.31", "dameGegenBauer", "laeuferbauer"),
    Kandidat("9.32", "dameGegenBauer", "patt"),
    Kandidat("9.34", "dameGegenBauer", "patt"),
    Kandidat("9.35", "leichtfiguren", "ungleich"),
    Kandidat("9.36", "leichtfiguren", "ungleich"),
    Kandidat("9.37", "leichtfiguren", "ungleich"),
    Kandidat("9.38", "leichtfiguren"),
    Kandidat("9.39", "leichtfiguren", "springer"),
    Kandidat("9.40", "leichtfiguren", "springer", leser="b"),
    Kandidat("9.41", "leichtfiguren", "falscherLaeufer", buch="remis"),
    # 9.42: Das Buch nennt den weißen Läufer „im Vorteil“; die Engine sieht Remis. Halten muss also
    # Schwarz mit dem Springer, nicht Weiß (X2, nachgelesen 17.10.2026).
    Kandidat("9.42", "leichtfiguren", leser="b"),
    Kandidat("9.43", "leichtfiguren", "falscherLaeufer"),
    Kandidat("9.44", "leichtfiguren", "falscherLaeufer"),
    Kandidat("9.45", "turmendspiel", "philidor"),
    Kandidat("9.46", "turmendspiel", "kurzeSeite"),
    Kandidat("9.47", "turmendspiel", "lucena"),
    Kandidat("9.48", "turmendspiel", "vancura"),
    Kandidat("9.49", "turmendspiel", "abschneiden"),
    Kandidat("9.50", "turmendspiel", "abschneiden"),
    Kandidat("9.51", "turmendspiel", "verbundene"),
    Kandidat("9.52", "dameGegenBauer"),
    Kandidat("9.53", "leichtfiguren", "falscherLaeufer"),
]


def bisherige_lichess() -> list[dict]:
    """Die Lichess-Aufgaben aus der vorhandenen Datei (ohne Lichess-Stichprobe bleiben sie)."""
    if not ZIELDATEI.exists():
        return []
    return [a for a in lies_json(ZIELDATEI)["aufgaben"] if a["herkunft"]["quelle"] == "lichess"]


def fen_der_abbildung(nummer: str) -> str:
    kapitel = nummer.split(".")[0].zfill(2)
    daten = lies_json(DATENORDNER / f"kap{kapitel}.json")
    for abb in daten["abbildungen"]:
        if abb["id"] == nummer:
            return abb["fen"]
    raise KeyError(f"Abbildung {nummer} nicht gefunden")


def material(brett: chess.Board, farbe: chess.Color) -> int:
    return sum(FIGURENWERT[stein] * len(brett.pieces(stein, farbe)) for stein in FIGURENWERT)


def urteil(wert: float) -> str | None:
    """gewinn, remis oder verlust aus Sicht der Seite, deren Wert das ist; None bei unklar."""
    if wert >= GEWINN_AB:
        return "gewinn"
    if wert <= -GEWINN_AB:
        return "verlust"
    if abs(wert) <= REMIS_BIS:
        return "remis"
    return None


def seite_und_ziel(brett: chess.Board, wert_am_zug: float) -> tuple[chess.Color, str] | None:
    """Die Seite des Lesers und sein Ziel aus dem Wert der Seite am Zug.

    Gewinn: der Leser ist die gewinnende Seite. Remis: der Leser hält mit der ärmeren Seite
    (bei gleichem Material mit der Seite am Zug), denn das Halten ist die Lehre.
    """
    lage = urteil(wert_am_zug)
    if lage == "gewinn":
        return brett.turn, "gewinn"
    if lage == "verlust":
        return not brett.turn, "gewinn"
    if lage == "remis":
        weiss, schwarz = material(brett, chess.WHITE), material(brett, chess.BLACK)
        if weiss == schwarz:
            return brett.turn, "remis"
        return (chess.WHITE if weiss < schwarz else chess.BLACK), "remis"
    return None


def einziger_zug(zuege: list[Zugwert], bester: Zugwert, ziel: str) -> bool:
    """Verfehlt jeder andere Zug das Ziel? (Züge aus Sicht des Lesers am Zug, beste zuerst.)"""
    andere = [z for z in zuege if z.zug != bester.zug]
    if not andere:
        return True
    return urteil(andere[0].wert) != ziel


def pruefe(engine: Engine, kandidat: Kandidat) -> dict | None:
    fen = fen_der_abbildung(kandidat.abbildung)
    brett = chess.Board(fen)
    bester = engine.bester(brett, TIEFE)
    if bester is None:
        print(f"  {kandidat.abbildung}: kein legaler Zug, ausgelassen", file=sys.stderr)
        return None
    entscheidung = seite_und_ziel(brett, bester.wert)
    if entscheidung is None and kandidat.buch == "remis":
        entscheidung = seite_und_ziel(brett, 0.0)
    if entscheidung is None:
        print(f"  {kandidat.abbildung}: unklar ({bester.wert:+.2f}), ausgelassen", file=sys.stderr)
        return None
    leser, ziel = entscheidung
    if ziel == "remis" and kandidat.leser is not None:
        leser = chess.WHITE if kandidat.leser == "w" else chess.BLACK
    leser_am_zug = leser == brett.turn
    wert_leser = bester.wert if leser_am_zug else -bester.wert
    matt_in = bester.matt if leser_am_zug else (-bester.matt if bester.matt is not None else None)
    einziger = leser_am_zug and einziger_zug(engine.alle_zuege(brett, TIEFE_EINZIG), bester, ziel)
    stufe = min(HOECHSTSTUFE, GRUNDSTUFE[kandidat.thema] + (1 if einziger else 0))
    return {
        "id": f"endspiel-b-{kandidat.abbildung}",
        "fen": fen,
        "leser": "w" if leser == chess.WHITE else "b",
        "ziel": ziel,
        "thema": kandidat.thema,
        "stichwort": kandidat.stichwort,
        "schwierigkeit": stufe,
        "herkunft": {"quelle": "buch", "abbildung": kandidat.abbildung},
        "pruefung": {
            "wert": round(wert_leser, 2),
            "mattIn": matt_in if matt_in is None or matt_in > 0 else None,
            "bester": bester.san,
            "einzigerZug": einziger,
            "tiefe": TIEFE,
        },
    }


def baue(lichess: list[dict] | None = None) -> dict:
    """Die Datei: Buchaufgaben (Engine) und, falls übergeben, die Lichess-Aufgaben dahinter."""
    aufgaben = []
    with Engine() as engine:
        for kandidat in KANDIDATEN:
            aufgabe = pruefe(engine, kandidat)
            if aufgabe:
                aufgaben.append(aufgabe)
                p = aufgabe["pruefung"]
                print(
                    f"  {kandidat.abbildung:6} {aufgabe['leser']} {aufgabe['ziel']:6} "
                    f"{p['wert']:+7.2f} matt={p['mattIn']} bester={p['bester']} "
                    f"einzig={p['einzigerZug']} stufe={aufgabe['schwierigkeit']}"
                )
    return {
        "schemaVersion": 1,
        "trainer": "endspiel",
        "erzeugt": {
            "datum": date.today().isoformat(),
            "engine": "Stockfish 19 lite (ein Kern)",
            "skript": "pipeline/trainer/endspiel.py",
        },
        "quellen": [
            {
                "kennung": "buch",
                "name": "Schach von Grund auf, Kapitel 8 und 9 (Endspiele)",
                "lizenz": "Alle Rechte vorbehalten (nur Stellungen und Züge)",
                "anzahl": len(aufgaben),
            },
            {
                "kennung": "lichess",
                "name": "Lichess-Puzzle-Datenbank (Endspielaufgaben)",
                "lizenz": "CC0 1.0",
                "adresse": "https://database.lichess.org/#puzzles",
                "anzahl": len(lichess or []),
            },
        ],
        "massstab": {"gewinnAb": GEWINN_AB, "remisBis": REMIS_BIS, "tiefe": TIEFE},
        "aufgaben": aufgaben + (lichess or []),
    }


def main() -> int:
    import argparse

    from pipeline.trainer import endspiel_lichess

    if not engine_vorhanden():
        print("Engine fehlt: cd app && npm ci", file=sys.stderr)
        return 1
    parser = argparse.ArgumentParser(description="Aufgaben für den Endspieltrainer bauen")
    parser.add_argument("--lichess", type=Path, help="Stichprobe der Endspiel-Puzzles (pickle)")
    parser.add_argument("--je-gruppe", type=int, default=endspiel_lichess.JE_GRUPPE)
    parser.add_argument("--teil", help="nur die Lichess-Gruppen i/n rechnen, Zwischenstand ablegen")
    parser.add_argument("--zusammen", action="store_true", help="Zwischenstände einsammeln und schreiben")
    args = parser.parse_args()
    if args.teil:
        if not args.lichess:
            print("--teil braucht --lichess", file=sys.stderr)
            return 1
        endspiel_lichess.rechne(args.lichess, args.je_gruppe, args.teil)
        return 0
    if args.lichess and not args.zusammen:
        endspiel_lichess.rechne(args.lichess, args.je_gruppe, None)
    lichess = endspiel_lichess.aus_teilen() if (args.lichess or args.zusammen) else bisherige_lichess()
    daten = baue(lichess)
    schreibe_daten(ZIELDATEI, daten, SCHEMA)
    print(f"{len(daten['aufgaben'])} Aufgaben nach {ZIELDATEI.relative_to(TRAINERORDNER.parents[2])}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
