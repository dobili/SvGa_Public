"""Aufgabe 2a: Aufgaben für den Taktiktrainer (Kapitel 7) → ``inhalte/de/trainer/taktik.json``.

Wozu diese Datei da ist:
    Pflichtenheft 7: „Aufgaben nach Motiv oder gemischt, als Themenblock … Gestufte Hilfen:
    Warnsignal, Motiv, Schlüsselfigur, Lösung. Nach der Lösung benennt der Leser das Motiv.
    Quelle: Buchaufgaben und Zusatzaufgaben.“ Drei Quellen:
    1. Abbildungen aus Kapitel 7 mit freigegebener Zugfolge: Die Fortsetzung der Zugfolge ab der
       Abbildung ist die Lösung, das Motiv kommt aus dem Unterabschnitt des Buches. Nur Stellungen,
       in denen die Seite am Zug laut Engine wirklich einen klaren Gewinnzug hat (sonst zeigt die
       Abbildung nur ein Motiv, ohne Aufgabe zu sein).
    2. Übungen des Buches mit Lösungszug, deren Motivtext ein Grundmotiv oder Mattbild nennt.
    3. Zusatzaufgaben aus der Lichess-Puzzle-Datenbank (CC0, lichess.py), je Motiv und Stufe
       eine feste Zahl.
    Schwierigkeit: Lichess-Aufgaben nach ihrer Wertung; Buchaufgaben über die Engine-Messung
    (Tiefe bis zur Lösung, Länge), geeicht an den Lichess-Aufgaben (schwierigkeit.py).

Aufruf (im Hauptordner):
    python -m pipeline.trainer.taktik --lichess buch/arbeit/lichess/passende.pkl --je-gruppe 8
"""

from __future__ import annotations

import argparse
import math
import pickle
import re
import sys
from datetime import date
from pathlib import Path

import chess

from pipeline.trainer.daten import DATENORDNER, TRAINERORDNER, lies_json, schreibe_daten
from pipeline.trainer.engine import Engine, engine_vorhanden
from pipeline.trainer.lichess import Puzzle, stichprobe
from pipeline.trainer.notation import spiele_linie, zuege_aus_text
from pipeline.trainer.schwierigkeit import (
    HOECHSTTIEFE,
    Messung,
    eiche,
    klasse,
    stufe_von_messung,
    stufe_von_wertung,
)
from pipeline.trainer.uebungen import GLEICHWERTIG_BIS, lies_uebungen, zuege_genau

SCHEMA = "trainer-taktik.schema.json"
ZIELDATEI = TRAINERORDNER / "taktik.json"
# Eine Buchstellung ist eine Aufgabe, wenn der Lösungszug der beste ist, der zweitbeste
# mindestens so viel schlechter ist und die Lösung so viel bringt (oder matt setzt).
EINZIG_AB = 0.8
GEWINN_AB = 1.5
TIEFE_PRUEFUNG = 18
# Übungen dieser Kapitel bleiben dem Endspieltrainer (Kapitel 8 und 9) vorbehalten.
OHNE_KAPITEL = (8, 9)
# Grundmotive nach der Nummer des Unterabschnitts in Kapitel 7 („1. Doppelangriff und Gabel“).
MOTIV_JE_NUMMER = {
    1: "doppelangriff", 2: "fesselung", 3: "spiess", 4: "abzug", 5: "doppelschach",
    6: "hinlenkung", 7: "beseitigung", 8: "ueberlastung", 9: "zwischenzug", 10: "gefangen",
    11: "umwandlung", 12: "rettung",
}  # fmt: skip
# Stichwörter in Motivtexten der Übungen und Unterabschnitten → Grundmotiv.
MOTIV_JE_STICHWORT = [
    ("doppelangriff", ("gabel", "doppelangriff")),
    ("fesselung", ("fesselung", "gefesselt")),
    ("spiess", ("spieß",)),
    ("doppelschach", ("doppelschach",)),
    ("abzug", ("abzug",)),
    ("hinlenkung", ("hinlenkung", "räumung", "köder")),
    ("beseitigung", ("beseitigung",)),
    ("ueberlastung", ("überlastung", "ablenkung")),
    ("zwischenzug", ("zwischenzug",)),
    ("gefangen", ("gefangen", "rückzugsfeld")),
    ("umwandlung", ("umwandlung", "unterverwandlung")),
    ("rettung", ("patt", "dauerschach", "rasender")),
]
MATTBILD_JE_STICHWORT = [
    ("grundreihe", ("grundreihenmatt", "grundreihe")),
    ("anastasia", ("anastasia",)),
    ("arabisch", ("arabisch",)),
    ("erstickung", ("erstickungsmatt", "ersticktes")),
    ("boden", ("boden-matt", "bodenmatt")),
    ("damiano", ("damiano",)),
    ("lolli", ("lolli",)),
    ("treppe", ("treppenmatt",)),
]


def motiv_aus_text(text: str | None) -> tuple[str | None, str | None]:
    """(Grundmotiv, Mattbild) aus einem Motivtext; beides None, wenn nichts passt.

    Beispiel: „Hinlenkung und Gabel“ → („hinlenkung“, None), das zuerst genannte Motiv zählt;
    „Grundreihenmatt“ → (None, „grundreihe“).
    """
    klein = (text or "").lower()
    return _erstes_stichwort(klein, MOTIV_JE_STICHWORT), _erstes_stichwort(klein, MATTBILD_JE_STICHWORT)


def _erstes_stichwort(klein: str, tabelle: list[tuple[str, tuple[str, ...]]]) -> str | None:
    """Der Eintrag, dessen Stichwort im Text zuerst steht („Hinlenkung und Gabel“ → Hinlenkung)."""
    treffer = [(klein.index(w), kennung) for kennung, woerter in tabelle for w in woerter if w in klein]
    return min(treffer)[1] if treffer else None


def motiv_aus_unterabschnitt(titel: str | None) -> tuple[str | None, str | None]:
    """Motiv aus „4. Batterie und Abzug“ (Nummer) oder Mattbild aus dem Titel; mehrdeutige Titel ohne Bild."""
    treffer = re.match(r"^(\d+)\.\s", titel or "")
    if treffer:
        return MOTIV_JE_NUMMER.get(int(treffer.group(1))), None
    bilder = [b for b, woerter in MATTBILD_JE_STICHWORT if any(w in (titel or "").lower() for w in woerter)]
    return None, bilder[0] if len(bilder) == 1 else None


def hauptlinie(knoten: list[dict], pfad: list[str]) -> list[str]:
    """Die Hauptvariante einer Zugfolge ab dem Knoten am Ende des Pfads (Züge in SAN)."""
    aktuell = knoten
    for zug in pfad:
        naechster = next((k for k in aktuell if k["zug"] == zug), None)
        if naechster is None:
            return []
        aktuell = naechster["weiter"]
    linie: list[str] = []
    while aktuell:
        linie.append(aktuell[0]["zug"])
        aktuell = aktuell[0]["weiter"]
    return linie


def ziel_der_loesung(brett: chess.Board, loesung: list[str], bestwert: float, zweitwert: float | None) -> str:
    """matt, gewinn oder rettung (Remis aus verlorener Lage: bester Zug etwa gleich, Rest klar schlechter)."""
    ende = brett.copy()
    for san in loesung:
        ende.push_san(san)
    if ende.is_checkmate() or bestwert > 50:
        return "matt"
    if abs(bestwert) <= 0.5 and zweitwert is not None and zweitwert <= -2:
        return "rettung"
    return "gewinn"


def _messung(engine: Engine, brett: chess.Board, loesung: list[str]) -> Messung:
    zug = brett.parse_san(loesung[0])
    return Messung(engine.tiefe_bis_loesung(brett, zug, HOECHSTTIEFE), math.ceil(len(loesung) / 2))


def _pruefe_buchaufgabe(
    engine: Engine, brett: chess.Board, loesung: list[str]
) -> tuple[list[str], str] | None:
    """Gleich gute erste Züge und das Ziel; None, wenn die Stellung keine klare Aufgabe ist."""
    erster = brett.parse_san(loesung[0])
    alle = zuege_genau(engine, brett, [erster])
    if (
        not alle
        or alle[0].zug != erster
        and alle[0].wert - next(z.wert for z in alle if z.zug == erster) > GLEICHWERTIG_BIS
    ):
        return None
    best = next(z for z in alle if z.zug == erster)
    andere = [z for z in alle if z.zug != erster]
    zweit = andere[0].wert if andere else None
    matt = best.matt is not None and best.matt > 0
    if (
        not matt
        and best.wert < GEWINN_AB
        and not (abs(best.wert) <= 0.5 and zweit is not None and zweit <= -2)
    ):
        return None
    if zweit is not None and best.wert - zweit < EINZIG_AB and not (matt and andere[0].matt is None):
        akzeptiert = [
            z.san for z in andere if best.wert - z.wert <= GLEICHWERTIG_BIS and (not matt or z.matt)
        ]
        if len(akzeptiert) > 2:
            return None
    else:
        akzeptiert = []
    return akzeptiert, ziel_der_loesung(brett, loesung, best.wert, zweit)


def _aufgabe(
    brett: chess.Board, loesung: list[str], akzeptiert: list[str], motiv, bild, ziel, herkunft, messung
) -> dict:
    return {
        "fen": brett.fen(),
        "amZug": "w" if brett.turn else "b",
        "loesung": loesung,
        "akzeptiert": akzeptiert,
        "motiv": motiv,
        "mattbild": bild,
        "schluesselfeld": chess.square_name(brett.parse_san(loesung[0]).from_square),
        "ziel": ziel,
        "herkunft": herkunft,
        "messung": {"tiefe": messung.tiefe, "laenge": messung.laenge, "klasse": klasse(messung)},
    }


def aus_abbildungen(engine: Engine, datenordner: Path = DATENORDNER) -> list[dict]:
    """Aufgaben aus den Abbildungen in Kapitel 7 mit freigegebener Zugfolge.

    Übungsabbildungen (7.44 bis 7.61) haben keinen Unterabschnitt; ihr Motiv kommt aus dem
    Motivtext der Übung (`motiv_aus_text`).
    """
    daten = lies_json(datenordner / "kap07.json")
    # Konstruierte Partien (0.2.96) enden an ihrer Abbildung und sind keine Buchzüge: nie Aufgaben.
    beispiele = {b["id"]: b for b in daten["beispiele"] if b.get("status") != "konstruiert"}
    uebungen = {u.abbildung: u for u in lies_uebungen() if u.abbildung}
    aufgaben = []
    for a in daten["abbildungen"]:
        verweis = a.get("beispiel")
        if not verweis or verweis["id"] not in beispiele:
            continue
        linie = hauptlinie(beispiele[verweis["id"]]["zuege"], verweis["pfad"])
        brett = chess.Board(a["fen"])
        if not linie or spiele_linie(brett, linie) is None:
            continue
        print(f"Abb. {a['id']}", file=sys.stderr)
        geprueft = _pruefe_buchaufgabe(engine, brett, linie)
        if geprueft is None:
            continue
        akzeptiert, ziel = geprueft
        motiv, bild = motiv_aus_unterabschnitt(a.get("unterabschnitt"))
        herkunft = {"quelle": "buch", "abbildung": a["id"], "beispiel": verweis["id"]}
        uebung = uebungen.get(a["id"])
        if uebung is not None:
            herkunft["uebung"] = uebung.kennung
            if motiv is None and bild is None:
                motiv, bild = motiv_aus_text(uebung.motiv)
        motiv = _motiv_zum_ziel(motiv, ziel)
        aufgaben.append(
            {
                "id": f"taktik-b-{a['id']}",
                **_aufgabe(
                    brett, linie, akzeptiert, motiv, bild, ziel, herkunft, _messung(engine, brett, linie)
                ),
            }
        )
    return aufgaben


def _motiv_zum_ziel(motiv: str | None, ziel: str) -> str | None:
    """„Rettung“ heißt ein Motiv nur, wenn die Aufgabe wirklich rettet (Remis aus verlorener Lage).

    Warum: Motivtexte wie „Turmmatt ohne Patt“ nennen das Patt als Gefahr, nicht als Rettung.
    """
    return None if motiv == "rettung" and ziel != "rettung" else motiv


def aus_uebungen(engine: Engine, schon: set[str]) -> list[dict]:
    """Aufgaben aus Übungen mit Lösungszug und taktischem Motivtext (Abbildungen ohne Doppel).

    Ohne die Endspielkapitel 8 und 9: Deren Übungen (Opposition, Umwandlung, Turmendspiel) gehören
    zum Endspieltrainer, auch wenn ein Motivwort passt.
    """
    aufgaben = []
    for u in lies_uebungen():
        motiv, bild = motiv_aus_text(u.motiv)
        if u.kapitel in OHNE_KAPITEL or u.fen is None or not u.loesung or u.abbildung in schon:
            continue
        if motiv is None and bild is None:
            continue
        linie = zuege_aus_text(u.loesung)
        brett = chess.Board(u.fen)
        if not linie or spiele_linie(brett, linie) is None:
            continue
        print(f"Übung {u.nummer}", file=sys.stderr)
        geprueft = _pruefe_buchaufgabe(engine, brett, linie)
        if geprueft is None:
            continue
        akzeptiert, ziel = geprueft
        motiv = _motiv_zum_ziel(motiv, ziel)
        herkunft = {"quelle": "buch", "abbildung": u.abbildung, "uebung": u.kennung}
        aufgaben.append(
            {
                "id": f"taktik-b-{u.abbildung}",
                **_aufgabe(
                    brett, linie, akzeptiert, motiv, bild, ziel, herkunft, _messung(engine, brett, linie)
                ),
            }
        )
    return aufgaben


def aus_lichess(engine: Engine, puzzles: list[Puzzle]) -> list[dict]:
    """Aufgaben aus der Lichess-Stichprobe; Lösungen sind dort eindeutig (nur Matts haben Alternativen)."""
    aufgaben = []
    for n, p in enumerate(puzzles):
        if p.motiv is None and p.mattbild is None:
            continue
        brett = chess.Board(p.fen)
        if n % 50 == 0:
            print(f"Lichess {n}/{len(puzzles)}", file=sys.stderr)
        messung = _messung(engine, brett, p.loesung)
        ende = brett.copy()
        for san in p.loesung:
            ende.push_san(san)
        ziel = "matt" if ende.is_checkmate() or "mate" in p.themen else "gewinn"
        herkunft = {
            "quelle": "lichess",
            "puzzle": p.kennung,
            "wertung": p.wertung,
            "partie": p.partie,
            "themen": list(p.themen),
        }
        aufgaben.append(
            {
                "id": f"taktik-l-{p.kennung}",
                **_aufgabe(brett, p.loesung, [], p.motiv, p.mattbild, ziel, herkunft, messung),
                "schwierigkeit": stufe_von_wertung(p.wertung),
            }
        )
    return aufgaben


def baue(lichess_pfad: Path | None, je_gruppe: int, ziel: Path = ZIELDATEI) -> dict:
    puzzles: list[Puzzle] = []
    if lichess_pfad is not None:
        alle = pickle.load(lichess_pfad.open("rb"))
        puzzles = stichprobe([p for p in alle if p.motiv or p.mattbild], je_gruppe, stufe_von_wertung)
    with Engine() as engine:
        buch = aus_abbildungen(engine)
        buch += aus_uebungen(engine, {a["herkunft"]["abbildung"] for a in buch})
        lichess = aus_lichess(engine, puzzles)
    eichung = eiche(
        [(Messung(a["messung"]["tiefe"], a["messung"]["laenge"]), a["herkunft"]["wertung"]) for a in lichess]
    )
    for a in buch:
        a["schwierigkeit"] = stufe_von_messung(
            Messung(a["messung"]["tiefe"], a["messung"]["laenge"]), eichung
        )
    daten = {
        "schemaVersion": 1,
        "trainer": "taktik",
        "erzeugt": {
            "datum": date.today().isoformat(),
            "engine": "Stockfish 19 lite (ein Kern)",
            "skript": "pipeline/trainer/taktik.py",
        },
        "quellen": [
            {
                "kennung": "buch",
                "name": "Schach von Grund auf, Kapitel 7 (Abbildungen und Übungen)",
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
        "eichung": dict(sorted(eichung.items())),
        "aufgaben": buch + lichess,
    }
    schreibe_daten(ziel, daten, SCHEMA)
    return daten


if __name__ == "__main__":
    if not engine_vorhanden():
        sys.exit("Engine fehlt: cd app && npm ci")
    parser = argparse.ArgumentParser(description="Aufgaben für den Taktiktrainer bauen")
    parser.add_argument("--lichess", type=Path, help="Gespeicherte Stichprobe (pickle) aus lichess.py")
    parser.add_argument("--je-gruppe", type=int, default=8, help="Lichess-Aufgaben je Motiv und Stufe")
    args = parser.parse_args()
    ergebnis = baue(args.lichess, args.je_gruppe)
    print(f"{len(ergebnis['aufgaben'])} Aufgaben")
