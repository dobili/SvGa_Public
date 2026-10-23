"""Aufgabe 2b: Aufgaben für „Falle oder Köder“ (Kapitel 4) → ``inhalte/de/trainer/falle.json``.

Wozu diese Datei da ist:
    Pflichtenheft 7: „Die Engine spielt den Fallensteller und bietet Material an. Der Leser
    entscheidet, ob er nimmt.“ Jede Aufgabe besteht aus dem Köder-Zug des Gegners (der Zug, der
    das Material anbietet; Kapitel 4: „Köder: Material, das absichtlich angeboten wird“), der
    Stellung danach und dem Schlag, um den es geht. Zwei Antworten (Verfahren seit P4, R50,
    23.10.2026, nach dem Befund des Autors zur Lichess-Aufgabe mit Wertung 753):
    - **Falle:** Nach dem Nehmen hat der Gegner eine Widerlegung, und der Leser steht schlechter
      als vor dem Nehmen: Der Wert nach dem Schlag liegt mindestens 1,5 Bauerneinheiten unter dem
      Wert vor dem Schlag (bester Zug) **und** klar im Minus (höchstens −0,8, wie die Remisgrenze
      des Endspieltrainers; das Blackburne-Shilling-Gambit, Abb. 4.41, misst −0,88). Dass ein anderer Zug
      besser gewesen wäre, macht allein noch keine Falle (Beispiel: Schwarz steht auf Gewinn, nimmt
      einen Bauern und steht danach nur noch ausgeglichen).
    - **Geschenk:** Nehmen ist der beste Zug oder höchstens 0,3 dahinter, und der Leser steht
      danach nicht schlecht.
    Dazwischen gibt es keine Aufgabe.
    Quellen: 1. Die Fallenchecks des Buches (Kapitel 4) und die Schläge mit Fragezeichen in den
    Zugfolgen der Kapitel 2 und 3 (falle_buch.py), die Widerlegung ist die Fortsetzung des Buches.
    2. Lichess-Puzzles (CC0): Dort ist der erste Zug der Datenbank der Köder-Zug. Geschenke haben
    das Thema „hangingPiece“ und eine Lösung, die mit dem Schlag beginnt; Fallen sind Stellungen,
    in denen ein Schlag Material zu gewinnen scheint, den die Engine aber widerlegt. In beiden
    Fällen muss der Köder-Zug das Angebot erst geschaffen haben (die Figur hingestellt, eine Linie
    geöffnet oder einen Verteidiger abgezogen). Die Lichess-Wertung gibt die Schwierigkeit.
    Alles prüft die Engine (Tiefe 18): der beste Zug und der Schlag mit seiner Hauptvariante.

Aufruf (im Hauptordner):
    python -m pipeline.trainer.falle --lichess buch/arbeit/lichess/passende.pkl --je-stufe 12
    python -m pipeline.trainer.falle --lichess … --teil 1/4   # nur ein Viertel der Gruppen rechnen
                                                              # (Zwischenstand nach buch/arbeit/falle/)
    python -m pipeline.trainer.falle --lichess … --zusammen   # Teile einsammeln und Datei schreiben
    python -m pipeline.trainer.falle --bisherige   # ohne Lichess-Datei: die Lichess-Aufgaben aus
                                                   # der vorhandenen falle.json behalten
"""

from __future__ import annotations

import argparse
import json
import pickle
import random
import sys
from dataclasses import dataclass
from datetime import date
from pathlib import Path

import chess
import chess.engine

from pipeline.trainer.daten import HAUPTORDNER, TRAINERORDNER, lies_json, schreibe_daten
from pipeline.trainer.engine import Engine, engine_vorhanden
from pipeline.trainer.falle_buch import (
    FORTSETZUNG_HALBZUEGE,
    angebote_der_eroeffnungen,
    angebote_der_fallenchecks,
)
from pipeline.trainer.lichess import GESCHENK_THEMA, Puzzle
from pipeline.trainer.schwierigkeit import HOECHSTTIEFE, Messung, klasse, stufe_von_wertung

SCHEMA = "trainer-falle.schema.json"
ZIELDATEI = TRAINERORDNER / "falle.json"
TEILORDNER = HAUPTORDNER / "buch" / "arbeit" / "falle"
# Falle: nach dem Nehmen mindestens so viel schlechter als vor dem Nehmen …
FALLE_ABFALL = 1.5
# … und mindestens so weit im Minus (sonst war das Nehmen nur nicht der beste Zug, keine Falle).
FALLE_SCHLECHTER = 0.8
GESCHENK_BIS = 0.3
TIEFE = 18
STARTWERT = 20261016
# Die Engine siebt: so viele Kandidaten je Gruppe wie gebraucht, mal diesen Faktor.
KANDIDATENFAKTOR = 6
STUFEN = (1, 2, 3, 4, 5)
ANTWORTEN = ("falle", "geschenk")
FAUSTWERTE = {chess.PAWN: 1, chess.KNIGHT: 3, chess.BISHOP: 3, chess.ROOK: 5, chess.QUEEN: 9, chess.KING: 0}


@dataclass(frozen=True)
class Angebot:
    """Stellung vor dem Köder-Zug, der Köder-Zug, die Stellung danach und der Schlag."""

    vorher: chess.Board
    vorzug: chess.Move
    brett: chess.Board
    schlag: chess.Move


@dataclass(frozen=True)
class Urteil:
    """Das Engine-Urteil über einen Schlag (Werte aus Sicht des Lesers, Bauerneinheiten)."""

    antwort: str  # „falle“ oder „geschenk“
    wert_vorher: float  # bester Zug: so steht der Leser vor dem Nehmen
    wert_nachher: float  # nach dem Schlag und der besten Antwort des Gegners
    bester: str
    fortsetzung: list[str]  # der Schlag und die Hauptvariante der Engine, englisch


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


def neues_angebot(a: Angebot) -> bool:
    """Hat erst der Köder-Zug das Angebot geschaffen?

    Ja, wenn der Schlag vor dem Köder-Zug nicht möglich war (die Figur stand noch nicht dort,
    eine Linie war zu: Abb. 4.18, 6. Sxe5 gibt die Dame d1 frei) oder der Köder-Zug einen
    Verteidiger des Opfers abgezogen hat. Nein, wenn das Material schon vorher genauso zu nehmen
    war: Dann hat der Gegner es nur stehen lassen, und die Aufgabe zeigt keinen Köder.
    """
    leser = a.brett.turn
    opfer_vorher = a.vorher.piece_at(a.schlag.to_square)
    schlaeger_vorher = a.vorher.piece_at(a.schlag.from_square)
    if opfer_vorher is None or opfer_vorher.color == leser or schlaeger_vorher is None:
        return True
    if a.schlag.to_square not in a.vorher.attacks(a.schlag.from_square):
        return True
    verteidiger_vorher = len(a.vorher.attackers(not leser, a.schlag.to_square))
    verteidiger_nachher = len(a.brett.attackers(not leser, a.schlag.to_square))
    return verteidiger_nachher < verteidiger_vorher


def _ist_matt_fuer_beide(bester, gespielt) -> bool:
    return bester.matt is not None and bester.matt > 0 and gespielt.matt is not None and gespielt.matt > 0


def urteil(engine: Engine, a: Angebot, buchlinie: list[str] | None = None) -> Urteil | None:
    """Beurteilt den Schlag; None, wenn er weder Falle noch Geschenk ist.

    Beispiel: Klammerfalle nach 5. axb5, Schlag cxb5 → Falle (vorher etwa 0, nachher etwa −2,4,
    bester Sf6, Fortsetzung cxb5 Df3 …). Die Fortsetzung ist die Buchlinie, wenn es eine gibt,
    sonst die Hauptvariante der Engine nach dem Schlag.
    """
    bester = engine.bester(a.brett, TIEFE)
    gespielt = next(iter(engine.alle_zuege(a.brett, TIEFE, nur=[a.schlag])), None)
    if bester is None or gespielt is None:
        return None
    verlust = 0.0 if _ist_matt_fuer_beide(bester, gespielt) else round(bester.wert - gespielt.wert, 2)
    if verlust >= FALLE_ABFALL and gespielt.wert <= -FALLE_SCHLECHTER:
        antwort = "falle"
    elif verlust <= GESCHENK_BIS and gespielt.wert > -FALLE_SCHLECHTER:
        antwort = "geschenk"
    else:
        return None
    linie = buchlinie if buchlinie else _linie_als_san(a.brett, gespielt.linie)
    return Urteil(antwort, round(bester.wert, 2), round(gespielt.wert, 2), bester.san, linie)


def _linie_als_san(brett: chess.Board, zuege: tuple[chess.Move, ...]) -> list[str]:
    kopie = brett.copy()
    linie = []
    for zug in zuege[:FORTSETZUNG_HALBZUEGE]:
        linie.append(kopie.san(zug))
        kopie.push(zug)
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


def _aufgabe(kennung: str, a: Angebot, u: Urteil, herkunft: dict, tiefe: int | None, stufe: int) -> dict:
    messung = Messung(tiefe, 1)
    return {
        "id": kennung,
        "fenVorher": a.vorher.fen(),
        "vorzug": a.vorher.san(a.vorzug),
        "fen": a.brett.fen(),
        "amZug": "w" if a.brett.turn else "b",
        "angebot": a.brett.san(a.schlag),
        "antwort": u.antwort,
        "wertVorher": u.wert_vorher,
        "wertNachher": u.wert_nachher,
        "verlustBeimNehmen": round(u.wert_vorher - u.wert_nachher, 2),
        "bester": u.bester,
        "fortsetzung": u.fortsetzung,
        "herkunft": herkunft,
        "messung": {"tiefe": messung.tiefe, "laenge": 1, "klasse": klasse(messung)},
        "schwierigkeit": stufe,
    }


def aus_buch(engine: Engine) -> list[dict]:
    """Aufgaben aus dem Buch: Fallenchecks (Kapitel 4) und Schläge mit „?“ (Kapitel 2 und 3).

    Nur Fallen, die die Engine nach dem neuen Maßstab bestätigt; gleiche Stellung und gleicher
    Schlag nur einmal (Fallencheck vor Zugfolge). Alles andere steht als Befund auf der Konsole.
    """
    aufgaben: list[dict] = []
    schon_da: set[tuple[str, str]] = set()
    for angebot in angebote_der_fallenchecks() + angebote_der_eroeffnungen():
        a = Angebot(angebot.vorher, angebot.vorzug, angebot.brett, angebot.schlag)
        schluessel = (a.brett.fen(), a.brett.san(a.schlag))
        if schluessel in schon_da:
            continue
        u = urteil(engine, a, angebot.buchlinie)
        name = angebot.fallencheck or f"{angebot.beispiel} {a.brett.fullmove_number}. {a.brett.san(a.schlag)}"
        if u is None or u.antwort != "falle":
            print(f"Buch „{name}“: Engine sieht keine Falle nach dem neuen Maßstab", file=sys.stderr)
            continue
        schon_da.add(schluessel)
        herkunft = {"quelle": "buch", "abbildung": angebot.abbildung, "beispiel": angebot.beispiel}
        if angebot.fallencheck:
            herkunft["fallencheck"] = angebot.fallencheck
            kennung = f"falle-b-{angebot.abbildung}"
        else:
            seite = "w" if a.brett.turn else "b"
            kennung = f"falle-b-{angebot.beispiel}-{a.brett.fullmove_number}{seite}"
        tiefe = tiefe_bis_urteil(engine, a.brett, a.schlag, u.antwort)
        aufgaben.append(_aufgabe(kennung, a, u, herkunft, tiefe, 0))
    return aufgaben


def _angebot_aus_puzzle(p: Puzzle) -> tuple[Angebot | None, str]:
    """Der Kandidat eines Puzzles: (Angebot, erwartete Antwort) oder (None, „“).

    Geschenk: Thema „hangingPiece“ und die Lösung beginnt mit dem Schlag. Falle: ein Schlag,
    der Material zu gewinnen scheint, aber nicht die Lösung ist (das wertvollste Opfer); nur aus
    Aufgaben ohne „crushing“ und ohne Mattthema, sonst wäre die Lehre „Matt statt Schlag“ und
    nicht „Köder erkennen“ (vor dem Nehmen steht der Leser dann höchstens klar besser, nicht
    schon auf Gewinn). Beides nur, wenn der Köder-Zug das Angebot geschaffen hat und der Leser
    nicht im Schach steht.
    """
    if not p.fen_vorher or not p.vorzug:
        return None, ""
    brett = chess.Board(p.fen)
    vorher = chess.Board(p.fen_vorher)
    vorzug = vorher.parse_san(p.vorzug)
    loesung = brett.parse_san(p.loesung[0])
    if brett.is_check():
        return None, ""
    if GESCHENK_THEMA in p.themen and brett.is_capture(loesung):
        a = Angebot(vorher, vorzug, brett, loesung)
        return (a, "geschenk") if neues_angebot(a) else (None, "")
    if "crushing" in p.themen or any(thema.startswith("mate") for thema in p.themen):
        return None, ""
    schlaege = [
        z for z in brett.legal_moves if brett.is_capture(z) and z != loesung and scheinbarer_gewinn(brett, z)
    ]
    kandidaten = [Angebot(vorher, vorzug, brett, z) for z in schlaege]
    kandidaten = [a for a in kandidaten if neues_angebot(a)]
    if not kandidaten:
        return None, ""
    bestes = max(kandidaten, key=lambda a: FAUSTWERTE[brett.piece_at(a.schlag.to_square).piece_type])
    return bestes, "falle"


def kandidaten_lichess(
    puzzles: list[Puzzle], je_stufe: int, startwert: int = STARTWERT
) -> dict[tuple[int, str], list[tuple[Puzzle, Angebot]]]:
    """Kandidaten je (Stufe, Antwort), zufällig mit festem Startwert, mehrfach so viele wie gebraucht."""
    zufall = random.Random(startwert)
    gruppen: dict[tuple[int, str], list[tuple[Puzzle, Angebot]]] = {}
    for p in sorted(puzzles, key=lambda p: p.kennung):
        a, erwartet = _angebot_aus_puzzle(p)
        if a is not None:
            gruppen.setdefault((stufe_von_wertung(p.wertung), erwartet), []).append((p, a))
    for schluessel in sorted(gruppen):
        zufall.shuffle(gruppen[schluessel])
        gruppen[schluessel] = gruppen[schluessel][: je_stufe * KANDIDATENFAKTOR]
    return gruppen


def aus_lichess_gruppe(
    engine: Engine, gruppe: tuple[int, str], kandidaten: list[tuple[Puzzle, Angebot]], je_stufe: int
) -> list[dict]:
    """Aufgaben einer Gruppe (Stufe, Antwort) aus Lichess-Puzzles, von der Engine bestätigt."""
    aufgaben: list[dict] = []
    stufe, erwartet = gruppe
    for p, a in kandidaten:
        if len(aufgaben) >= je_stufe:
            break
        u = urteil(engine, a)
        if u is None or u.antwort != erwartet:
            continue
        print(f"Lichess {p.kennung} {u.antwort} Stufe {stufe}", file=sys.stderr)
        herkunft = {
            "quelle": "lichess",
            "puzzle": p.kennung,
            "wertung": p.wertung,
            "partie": p.partie,
            "themen": list(p.themen),
        }
        tiefe = tiefe_bis_urteil(engine, a.brett, a.schlag, u.antwort)
        aufgaben.append(_aufgabe(f"falle-l-{p.kennung}", a, u, herkunft, tiefe, stufe))
    return aufgaben


def alle_gruppen() -> list[tuple[int, str]]:
    return [(stufe, antwort) for stufe in STUFEN for antwort in ANTWORTEN]


def _teil(gruppen: list[tuple[int, str]], teil: str | None) -> list[tuple[int, str]]:
    """Die Gruppen eines Teils „i/n“ (1-basiert), ohne Angabe alle."""
    if teil is None:
        return gruppen
    nummer, anzahl = (int(x) for x in teil.split("/"))
    return [g for i, g in enumerate(gruppen) if i % anzahl == nummer - 1]


def _teildatei(gruppe: tuple[int, str]) -> Path:
    return TEILORDNER / f"stufe{gruppe[0]}-{gruppe[1]}.json"


def rechne_lichess(lichess_pfad: Path, je_stufe: int, teil: str | None) -> None:
    """Rechnet die Lichess-Gruppen eines Teils und legt je Gruppe eine Zwischendatei ab."""
    puzzles: list[Puzzle] = pickle.load(lichess_pfad.open("rb"))
    kandidaten = kandidaten_lichess(puzzles, je_stufe)
    TEILORDNER.mkdir(parents=True, exist_ok=True)
    with Engine() as engine:
        for gruppe in _teil(alle_gruppen(), teil):
            aufgaben = aus_lichess_gruppe(engine, gruppe, kandidaten.get(gruppe, []), je_stufe)
            text = json.dumps(aufgaben, ensure_ascii=False, indent=1)
            _teildatei(gruppe).write_text(text, encoding="utf-8")
            print(f"Gruppe {gruppe}: {len(aufgaben)} Aufgaben", file=sys.stderr)


def lichess_aus_teilen() -> list[dict]:
    """Die Lichess-Aufgaben aller Zwischendateien (fehlende Gruppen bleiben leer)."""
    aufgaben: list[dict] = []
    for gruppe in alle_gruppen():
        pfad = _teildatei(gruppe)
        if pfad.exists():
            aufgaben.extend(json.loads(pfad.read_text(encoding="utf-8")))
    return aufgaben


def bisherige_lichess(ziel: Path = ZIELDATEI) -> list[dict]:
    """Die Lichess-Aufgaben aus der vorhandenen Datei (wenn die Lichess-Datei lokal fehlt)."""
    if not ziel.exists():
        return []
    return [a for a in lies_json(ziel)["aufgaben"] if a["herkunft"]["quelle"] == "lichess"]


def schreibe(buch: list[dict], lichess: list[dict], ziel: Path = ZIELDATEI) -> dict:
    """Eicht die Buchaufgaben an den Lichess-Aufgaben und schreibt die Datei."""
    from pipeline.trainer.schwierigkeit import eiche, stufe_von_messung

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
                "name": "Schach von Grund auf, Kapitel 2 bis 4 (Fallenchecks und Zugfolgen der Eröffnungen)",
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
        "massstab": {
            "falleAbVerlust": FALLE_ABFALL,
            "falleSchlechterAb": FALLE_SCHLECHTER,
            "geschenkBisVerlust": GESCHENK_BIS,
            "tiefe": TIEFE,
        },
        "eichung": dict(sorted(eichung.items())),
        "aufgaben": buch + lichess,
    }
    schreibe_daten(ziel, daten, SCHEMA)
    return daten


def baue(lichess_pfad: Path | None, je_stufe: int, ziel: Path = ZIELDATEI, bisherige: bool = False) -> dict:
    """Alles in einem Lauf: Buch, Lichess (oder die bisherigen Lichess-Aufgaben), Datei."""
    if lichess_pfad and not bisherige:
        rechne_lichess(lichess_pfad, je_stufe, None)
    with Engine() as engine:
        buch = aus_buch(engine)
    lichess = bisherige_lichess(ziel) if bisherige or not lichess_pfad else lichess_aus_teilen()
    return schreibe(buch, lichess, ziel)


if __name__ == "__main__":
    if not engine_vorhanden():
        sys.exit("Engine fehlt: cd app && npm ci")
    parser = argparse.ArgumentParser(description="Aufgaben für „Falle oder Köder“ bauen")
    parser.add_argument("--lichess", type=Path)
    parser.add_argument("--je-stufe", type=int, default=12)
    parser.add_argument("--bisherige", action="store_true")
    parser.add_argument("--teil", help="nur die Lichess-Gruppen i/n rechnen, Zwischenstand ablegen")
    parser.add_argument(
        "--zusammen", action="store_true", help="Zwischenstände einsammeln, Buch rechnen, schreiben"
    )
    args = parser.parse_args()
    if args.teil:
        if not args.lichess:
            sys.exit("--teil braucht --lichess")
        rechne_lichess(args.lichess, args.je_stufe, args.teil)
    elif args.zusammen:
        with Engine() as engine:
            ergebnis = schreibe(aus_buch(engine), lichess_aus_teilen())
        print(f"{len(ergebnis['aufgaben'])} Aufgaben")
    else:
        ergebnis = baue(args.lichess, args.je_stufe, bisherige=args.bisherige)
        print(f"{len(ergebnis['aufgaben'])} Aufgaben")
