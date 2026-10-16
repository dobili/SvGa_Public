"""Aufgabe 2b: Aufgaben für „Falle oder Köder“ (Kapitel 4) → ``inhalte/de/trainer/falle.json``.

Wozu diese Datei da ist:
    Pflichtenheft 7: „Die Engine spielt den Fallensteller und bietet Material an. Der Leser
    entscheidet, ob er nimmt, und markiert vorher die Warnsignale.“ Jede Aufgabe ist eine
    Stellung, in der die Seite am Zug Material schlagen könnte; die Antwort sagt, ob das eine
    Falle ist (Nehmen verliert) oder ein Geschenk (Nehmen ist richtig). Zwei Quellen:
    1. Die Fallenchecks des Buches (Kapitel 4): Vom Stopp-Moment an die erste Zugfolge des Buches
       entlang bis zu dem Schlag mit Fragezeichen; die Widerlegung ist die Fortsetzung des Buches.
    2. Lichess-Puzzles (CC0): Geschenke sind Aufgaben mit dem Thema „hangingPiece“, deren
       Lösung mit dem Schlag beginnt; Fallen sind Stellungen, in denen ein Schlag Material zu
       gewinnen scheint (Faustwerte: mehr wert als der Schlagende, oder ungedeckt), die Engine
       ihn aber widerlegt. Die Lichess-Wertung gibt die Schwierigkeit.
    Alles prüft die Engine: Nehmen gegen den besten Zug, Tiefe 18.

Aufruf (im Hauptordner):
    python -m pipeline.trainer.falle --lichess buch/arbeit/lichess/passende.pkl --je-stufe 12
"""

from __future__ import annotations

import argparse
import pickle
import random
import sys
from datetime import date
from pathlib import Path

import chess
import chess.engine

from pipeline.trainer.daten import DATENORDNER, TRAINERORDNER, lies_json, schreibe_daten
from pipeline.trainer.engine import Engine, engine_vorhanden
from pipeline.trainer.lichess import GESCHENK_THEMA, Puzzle
from pipeline.trainer.schwierigkeit import HOECHSTTIEFE, Messung, klasse, stufe_von_wertung

SCHEMA = "trainer-falle.schema.json"
ZIELDATEI = TRAINERORDNER / "falle.json"
FALLE_AB = 2.0
GESCHENK_BIS = 0.3
TIEFE = 18
FORTSETZUNG_HALBZUEGE = 6
STARTWERT = 20261016
FAUSTWERTE = {chess.PAWN: 1, chess.KNIGHT: 3, chess.BISHOP: 3, chess.ROOK: 5, chess.QUEEN: 9, chess.KING: 0}


def scheinbarer_gewinn(brett: chess.Board, zug: chess.Move) -> bool:
    """Scheint der Schlag Material zu gewinnen (Faustwerte aus Kapitel 1)?

    Regel: Das Opfer ist mehr wert als der Schlagende, oder es ist ungedeckt. Beispiel:
    Klammerfalle, 5... cxb5: ein ungedeckter Bauer → scheinbar ein Gewinn.
    """
    opfer = brett.piece_at(zug.to_square)
    schlaeger = brett.piece_at(zug.from_square)
    if opfer is None or schlaeger is None:
        return False
    if FAUSTWERTE[opfer.piece_type] > FAUSTWERTE[schlaeger.piece_type]:
        return True
    return not brett.is_attacked_by(not brett.turn, zug.to_square)


def urteil(
    engine: Engine, brett: chess.Board, schlag: chess.Move
) -> tuple[str | None, float, str, list[str]]:
    """Beurteilt einen Schlag: (Antwort, Verlust beim Nehmen, bester Zug, Fortsetzung).

    Antwort None, wenn der Schlag weder klar verliert noch (fast) der beste Zug ist.
    Beispiel: Klammerfalle nach 5. axb5, Schlag cxb5 → („falle“, etwa 3, „Sf6“, [cxb5, Df3, …]).
    """
    alle = engine.alle_zuege(brett, TIEFE)
    gespielt = next((z for z in alle if z.zug == schlag), None)
    if not alle or gespielt is None:
        return None, 0.0, "", []
    bester = alle[0]
    verlust = round(bester.wert - gespielt.wert, 2)
    if bester.matt is not None and bester.matt > 0 and gespielt.matt is not None and gespielt.matt > 0:
        verlust = 0.0
    if verlust >= FALLE_AB:
        antwort = "falle"
    elif verlust <= GESCHENK_BIS:
        antwort = "geschenk"
    else:
        return None, verlust, bester.san, []
    return antwort, verlust, bester.san, _fortsetzung(engine, brett, schlag)


def _fortsetzung(engine: Engine, brett: chess.Board, schlag: chess.Move) -> list[str]:
    """Der Schlag und die beste Fortsetzung beider Seiten (Hauptvariante der Engine)."""
    kopie = brett.copy()
    linie = [kopie.san(schlag)]
    kopie.push(schlag)
    for _ in range(FORTSETZUNG_HALBZUEGE - 1):
        if kopie.is_game_over():
            break
        bester = engine.bester(kopie, TIEFE)
        if bester is None:
            break
        linie.append(bester.san)
        kopie.push(bester.zug)
    return linie


def tiefe_bis_urteil(engine: Engine, brett: chess.Board, schlag: chess.Move, antwort: str) -> int | None:
    """Ab welcher Suchtiefe die Engine den Schlag so beurteilt wie am Ende.

    Geschenk: Der Schlag ist der beste Zug. Falle: Er ist es nicht. Ein Maß für die
    Schwierigkeit wie engine.tiefe_bis_loesung; None, wenn das Urteil bei der Höchsttiefe kippt.
    """
    bester_je_tiefe: dict[int, chess.Move] = {}
    grenze = chess.engine.Limit(depth=HOECHSTTIEFE)
    with engine.engine.analysis(brett, grenze, game=object()) as lauf:
        for info in lauf:
            pv, tiefe = info.get("pv"), info.get("depth")
            if pv and tiefe is not None and info.get("multipv", 1) == 1 and "score" in info:
                bester_je_tiefe[tiefe] = pv[0]
    if not bester_je_tiefe:
        return None
    passt = {t: (zug == schlag) == (antwort == "geschenk") for t, zug in bester_je_tiefe.items()}
    if not passt[max(passt)]:
        return None
    stabil = max(passt)
    for tiefe in sorted(passt, reverse=True):
        if not passt[tiefe]:
            break
        stabil = tiefe
    return stabil


def _aufgabe(
    brett: chess.Board,
    schlag: chess.Move,
    antwort: str,
    verlust: float,
    bester: str,
    linie: list[str],
    herkunft: dict,
    tiefe: int | None,
) -> dict:
    messung = Messung(tiefe, 1)
    return {
        "fen": brett.fen(),
        "amZug": "w" if brett.turn else "b",
        "angebot": brett.san(schlag),
        "antwort": antwort,
        "verlustBeimNehmen": verlust,
        "bester": bester,
        "fortsetzung": linie,
        "herkunft": herkunft,
        "messung": {"tiefe": messung.tiefe, "laenge": 1, "klasse": klasse(messung)},
    }


def _schlag_mit_fragezeichen(beispiel: dict, pfad: list[str], brett: chess.Board):
    """Folgt der Hauptvariante ab dem Stopp-Knoten bis zum ersten Schlag mit „?“.

    Ausgabe: (Brett vor dem Schlag, Schlag, Fortsetzung des Buches ab dem Schlag) oder None.
    """
    aktuell = beispiel["zuege"]
    for zug in pfad:
        naechster = next((k for k in aktuell if k["zug"] == zug), None)
        if naechster is None:
            return None
        aktuell = naechster["weiter"]
    kopie = brett.copy()
    while aktuell:
        knoten = aktuell[0]
        zug = kopie.parse_san(knoten["zug"])
        if "?" in knoten["zeichen"] and kopie.is_capture(zug):
            fortsetzung = [knoten["zug"]]
            weiter = knoten["weiter"]
            while weiter and len(fortsetzung) < FORTSETZUNG_HALBZUEGE:
                fortsetzung.append(weiter[0]["zug"])
                weiter = weiter[0]["weiter"]
            return kopie, zug, fortsetzung
        kopie.push(zug)
        aktuell = knoten["weiter"]
    return None


def aus_fallenchecks(engine: Engine, datenordner: Path = DATENORDNER) -> list[dict]:
    """Aufgaben aus den Fallenchecks in Kapitel 4 (nur solche mit einem Schlag als Fehlzug)."""
    daten = lies_json(datenordner / "kap04.json")
    abbildungen = {a["id"]: a for a in daten["abbildungen"]}
    beispiele = {b["id"]: b for b in daten["beispiele"]}
    aufgaben = []
    for check in daten["fallenchecks"]:
        abbildung = abbildungen.get(check["stopp"])
        verweis = (abbildung or {}).get("beispiel")
        if not abbildung or not verweis or verweis["id"] not in beispiele:
            continue
        gefunden = _schlag_mit_fragezeichen(
            beispiele[verweis["id"]], verweis["pfad"], chess.Board(abbildung["fen"])
        )
        if gefunden is None:
            print(
                f"Fallencheck „{check['name']}“: kein Schlag mit Fragezeichen in der Zugfolge",
                file=sys.stderr,
            )
            continue
        brett, schlag, buchlinie = gefunden
        antwort, verlust, bester, _ = urteil(engine, brett, schlag)
        if antwort != "falle":
            print(
                f"Fallencheck „{check['name']}“: Engine sieht keine Falle (Verlust {verlust})",
                file=sys.stderr,
            )
            continue
        herkunft = {
            "quelle": "buch",
            "abbildung": abbildung["id"],
            "beispiel": verweis["id"],
            "fallencheck": check["name"],
        }
        tiefe = tiefe_bis_urteil(engine, brett, schlag, antwort)
        aufgaben.append(
            {
                "id": f"falle-b-{abbildung['id']}",
                **_aufgabe(brett, schlag, antwort, verlust, bester, buchlinie, herkunft, tiefe),
                "schwierigkeit": 0,
            }
        )
    return aufgaben


def _kandidaten_lichess(
    puzzles: list[Puzzle], je_stufe: int, startwert: int
) -> list[tuple[Puzzle, chess.Move, str]]:
    """Kandidaten je Stufe und Antwort, dreimal so viele wie gebraucht (die Engine siebt).

    Geschenk: Thema „hangingPiece“ und die Lösung beginnt mit dem Schlag. Falle: ein Schlag,
    der Material zu gewinnen scheint, aber nicht die Lösung ist.
    """
    zufall = random.Random(startwert)
    gruppen: dict[tuple[int, str], list[tuple[Puzzle, chess.Move, str]]] = {}
    for p in sorted(puzzles, key=lambda p: p.kennung):
        brett = chess.Board(p.fen)
        loesung = brett.parse_san(p.loesung[0])
        if GESCHENK_THEMA in p.themen and brett.is_capture(loesung):
            gruppen.setdefault((stufe_von_wertung(p.wertung), "geschenk"), []).append(
                (p, loesung, "geschenk")
            )
            continue
        schlaege = [
            z
            for z in brett.legal_moves
            if brett.is_capture(z) and z != loesung and scheinbarer_gewinn(brett, z)
        ]
        if schlaege and not brett.is_check():
            gruppen.setdefault((stufe_von_wertung(p.wertung), "falle"), []).append(
                (p, max(schlaege, key=lambda z: FAUSTWERTE[brett.piece_at(z.to_square).piece_type]), "falle")
            )
    auswahl = []
    for schluessel in sorted(gruppen):
        kandidaten = gruppen[schluessel]
        zufall.shuffle(kandidaten)
        auswahl.extend(kandidaten[: je_stufe * 3])
    return auswahl


def aus_lichess(
    engine: Engine, puzzles: list[Puzzle], je_stufe: int, startwert: int = STARTWERT
) -> list[dict]:
    """Aufgaben aus Lichess-Puzzles, von der Engine bestätigt; je Stufe und Antwort höchstens ``je_stufe``."""
    aufgaben = []
    zaehler: dict[tuple[int, str], int] = {}
    for p, schlag, erwartet in _kandidaten_lichess(puzzles, je_stufe, startwert):
        schluessel = (stufe_von_wertung(p.wertung), erwartet)
        if zaehler.get(schluessel, 0) >= je_stufe:
            continue
        brett = chess.Board(p.fen)
        antwort, verlust, bester, linie = urteil(engine, brett, schlag)
        if antwort != erwartet:
            continue
        zaehler[schluessel] = zaehler.get(schluessel, 0) + 1
        print(f"Lichess {p.kennung} {antwort} Stufe {schluessel[0]}", file=sys.stderr)
        herkunft = {
            "quelle": "lichess",
            "puzzle": p.kennung,
            "wertung": p.wertung,
            "partie": p.partie,
            "themen": list(p.themen),
        }
        tiefe = tiefe_bis_urteil(engine, brett, schlag, antwort)
        aufgaben.append(
            {
                "id": f"falle-l-{p.kennung}",
                **_aufgabe(brett, schlag, antwort, verlust, bester, linie, herkunft, tiefe),
                "schwierigkeit": schluessel[0],
            }
        )
    return aufgaben


def baue(lichess_pfad: Path | None, je_stufe: int, ziel: Path = ZIELDATEI) -> dict:
    from pipeline.trainer.schwierigkeit import eiche, stufe_von_messung

    puzzles: list[Puzzle] = pickle.load(lichess_pfad.open("rb")) if lichess_pfad else []
    with Engine() as engine:
        buch = aus_fallenchecks(engine)
        lichess = aus_lichess(engine, puzzles, je_stufe)
    eichung = eiche([(Messung(a["messung"]["tiefe"], 1), a["herkunft"]["wertung"]) for a in lichess])
    for a in buch:
        a["schwierigkeit"] = stufe_von_messung(Messung(a["messung"]["tiefe"], 1), eichung)
    daten = {
        "schemaVersion": 1,
        "trainer": "falle",
        "erzeugt": {
            "datum": date.today().isoformat(),
            "engine": "Stockfish 19 lite (ein Kern)",
            "skript": "pipeline/trainer/falle.py",
        },
        "quellen": [
            {
                "kennung": "buch",
                "name": "Schach von Grund auf, Kapitel 4 (Fallenchecks)",
                "lizenz": "Alle Rechte vorbehalten (nur Stellungen und Züge)",
                "anzahl": len(buch),
            },
            {
                "kennung": "lichess",
                "name": "Lichess-Puzzle-Datenbank",
                "lizenz": "CC0 1.0",
                "adresse": "https://database.lichess.org/#puzzles",
                "anzahl": len(lichess),
            },
        ],
        "massstab": {"falleAbVerlust": FALLE_AB, "geschenkBisVerlust": GESCHENK_BIS, "tiefe": TIEFE},
        "aufgaben": buch + lichess,
    }
    schreibe_daten(ziel, daten, SCHEMA)
    return daten


if __name__ == "__main__":
    if not engine_vorhanden():
        sys.exit("Engine fehlt: cd app && npm ci")
    parser = argparse.ArgumentParser(description="Aufgaben für „Falle oder Köder“ bauen")
    parser.add_argument("--lichess", type=Path)
    parser.add_argument("--je-stufe", type=int, default=12)
    args = parser.parse_args()
    ergebnis = baue(args.lichess, args.je_stufe)
    print(f"{len(ergebnis['aufgaben'])} Aufgaben")
