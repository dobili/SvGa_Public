"""Eröffnungen nach Elo-Band aus den Zählungen des Lichess-Monats (Eröffnungspaket, Stufe 1).

Rolle im Gesamtbild: Ideensammlung des Autors (26.10.2026, „Nur notiert“ Nr. 2 bis 4):
Eröffnungen über das Buch hinaus nach Elo-Band (je Band die häufigsten für Weiß und Schwarz),
Variantenbaum nach Häufigkeit, Gambits markiert. Die Daten sind dieselben wie beim Praxisbuch
(0.2.128): ein ganzer Monat der Lichess-Datenbank (September 2026, gewertete Partien, CC0),
gezählt je Zugfolge der ersten 20 Halbzüge und je Zelle (Zeitklasse, 200er-Band der ziehenden
Seite). Die Zählungen liegen nur lokal in buch/arbeit/praxisbuch/; die Namen kommen aus der
freien Lichess-Liste (inhalte/lichess, CC0).

Begriffe:
- Familie: der Name vor dem Doppelpunkt („Sicilian Defense“). Sammelnamen wie „Queen's Pawn
  Game“ sagen nichts über die Wahl; dort zählt der erste Teil danach („London System“).
- Seite: Verteidigungen (Defense, Declined, Accepted, Countergambit) wählt Schwarz, sonst die
  Seite des letzten Zuges der kürzesten benannten Zugfolge.
- Häufigkeit: wie oft die Familie erstmals erreicht wird, je Band der ziehenden Seite (Weiß und
  Schwarz spielen meist im selben Band, die Abweichung ist klein).
- Gambit: Name mit „Gambit“, außer dem Damengambit (kein echtes Opfer).

Aufruf: python -m pipeline.praxisbuch.baender ZIEL.json voll.tsv [voll2.tsv …]
"""

from __future__ import annotations

import csv
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

from pipeline.praxisbuch.baue import BAENDER, ZEITKLASSEN, lies, zugfolgen

LISTE = Path(__file__).resolve().parents[2] / "inhalte" / "lichess"
FAMILIEN_DE = Path(__file__).resolve().parents[2] / "inhalte" / "de" / "eroeffnungsfamilien.json"

#: Namen, die nur den ersten Zug beschreiben; dort zählt der erste Teil nach dem Doppelpunkt.
SAMMELNAMEN = frozenset(
    {
        "King's Pawn Game",
        "Queen's Pawn Game",
        "King's Knight Opening",
        "Indian Defense",
        "Zukertort Opening",
        "Horwitz Defense",
        "Van't Kruijs Opening",
        "Mieses Opening",
        "Hungarian Opening",
        "Queen's Knight Attack",
    }
)
#: Familien, die für den Leser dieselbe Eröffnung sind (London mit 2. Lf4, Buch 2.8).
GLEICH = {"Accelerated London System": "London System"}
#: Wörter im Namen, die eine Wahl von Schwarz bezeichnen.
SCHWARZE_WOERTER = ("Defense", "Declined", "Accepted", "Countergambit")
#: Gambits im Namen, die keine echten Opfer sind.
KEIN_GAMBIT = frozenset({"Queen's Gambit", "Queen's Gambit Declined", "Queen's Gambit Accepted"})
#: Eröffnungen des Buches (Kapitel 2) mit ihrem Abschnitt, nach Lichess-Familie.
BUCH = {
    "Ruy Lopez": "2.2",
    "Italian Game": "2.3",
    "Scotch Game": "2.4",
    "Petrov's Defense": "2.5",
    "Sicilian Defense": "2.6",
    "Queen's Gambit": "2.7",
    "Queen's Gambit Declined": "2.7",
    "London System": "2.8",
    "Trompowsky Attack": "2.9",
    "French Defense": "2.10",
    "Caro-Kann Defense": "2.10",
    "King's Indian Defense": "2.10",
    "Bishop's Opening": "2.10",
    "Nimzo-Indian Defense": "2.11",
}
#: So viele Familien je Band und Seite kommen in die Liste.
JE_BAND = 12
#: So viele Varianten je Familie (die häufigsten über alle Bänder).
VARIANTEN = 20
#: So viele Gambits (volle Namen) in der eigenen Liste.
GAMBITS = 40
#: Anteile in Prozent mit so vielen Nachkommastellen.
STELLEN = 2


def familie(name: str) -> str | None:
    """
    Familie eines Lichess-Namens. Beispiel: „Queen's Pawn Game: London System“ → „London System“.
    Sonderfälle: ein Sammelname allein („King's Pawn Game“) oder mit bloßer Variante („King's
    Knight Opening: Normal Variation“) ist keine Wahl → None.
    """
    teile = [t.strip() for t in name.split(":", 1)]
    if teile[0] not in SAMMELNAMEN:
        return GLEICH.get(teile[0], teile[0])
    if len(teile) == 1:
        return None
    teil = teile[1].split(",")[0].strip()
    return None if teil.endswith(("Variation", "Variations")) else GLEICH.get(teil, teil)


def ist_gambit(name: str) -> bool:
    """Gambit nach dem Namen; das Damengambit zählt nicht (Buch, Kapitel 2.7)."""
    return "Gambit" in name and familie(name) not in KEIN_GAMBIT


def seite_der_familie(name: str, kuerzeste_folge: int) -> str:
    """„w“ oder „s“: Verteidigungen wählt Schwarz, sonst die Seite des letzten Zuges."""
    if any(wort in name for wort in SCHWARZE_WOERTER):
        return "s"
    return "w" if kuerzeste_folge % 2 == 1 else "s"


def lies_namen() -> dict[tuple[str, ...], str]:
    """Zugfolge (SAN) → Lichess-Name aus inhalte/lichess."""
    aus: dict[tuple[str, ...], str] = {}
    for datei in sorted(LISTE.glob("*.tsv")):
        with open(datei, encoding="utf-8") as f:
            for zeile in csv.DictReader(f, delimiter="\t"):
                zuege = tuple(t for t in zeile["pgn"].split() if not re.match(r"^\d+\.", t))
                aus[zuege] = zeile["name"]
    return aus


def erstmals(folge: tuple[str, ...], namen: dict, schluessel) -> bool:
    """Erreicht die Folge den Schlüssel (Familie oder Name) zum ersten Mal?"""
    ziel = schluessel(namen[folge])
    return not any(folge[:i] in namen and schluessel(namen[folge[:i]]) == ziel for i in range(1, len(folge)))


def zaehle(eintraege, finde, namen):
    """Je Familie und je Variante (voller Name) die Anzahl je Zelle, nur beim ersten Erreichen."""
    je_familie: dict[str, dict[int, int]] = defaultdict(lambda: defaultdict(int))
    je_name: dict[str, dict[int, int]] = defaultdict(lambda: defaultdict(int))
    folge_des_namens: dict[str, tuple[str, ...]] = {}
    for zelle, _, nachher, _, anzahl in eintraege:
        f = finde(nachher)
        if f is None or tuple(f) not in namen:
            continue
        f = tuple(f)
        name = namen[f]
        if familie(name) is not None and erstmals(f, namen, familie):
            je_familie[familie(name)][zelle] += anzahl
        if erstmals(f, namen, lambda n: n):
            je_name[name][zelle] += anzahl
            alt = folge_des_namens.get(name)
            if alt is None or len(f) < len(alt):
                folge_des_namens[name] = f
    return je_familie, je_name, folge_des_namens


def je_band(zellen: dict[int, int]) -> list[int]:
    """Anzahl je Band über alle Zeitklassen."""
    nb = len(BAENDER)
    return [sum(zellen.get(k * nb + b, 0) for k in range(len(ZEITKLASSEN))) for b in range(nb)]


def deutsch(name: str, familien_de: dict[str, str]) -> str:
    """Deutscher Name der Familie, falls bekannt (inhalte/de/eroeffnungsfamilien.json)."""
    return familien_de.get(name, name)


def baue_familien(je_familie, je_name, folge_des_namens, partien_je_band, familien_de):
    """Die Familien, die in einem Band unter den häufigsten ihrer Seite sind, mit Varianten."""
    kuerzeste: dict[str, tuple[str, ...]] = {}
    for name, folge in folge_des_namens.items():
        fam = familie(name)
        if fam is None:
            continue
        if fam not in kuerzeste or len(folge) < len(kuerzeste[fam]):
            kuerzeste[fam] = folge
    zahlen = {fam: je_band(z) for fam, z in je_familie.items() if fam in kuerzeste}
    seite = {fam: seite_der_familie(fam, len(kuerzeste[fam])) for fam in zahlen}
    gewaehlt: set[str] = set()
    for b in range(len(BAENDER)):
        for s in ("w", "s"):
            reihe = sorted((f for f in zahlen if seite[f] == s), key=lambda f: -zahlen[f][b])
            gewaehlt.update(f for f in reihe[:JE_BAND] if zahlen[f][b] > 0)
    aus = []
    for fam in sorted(gewaehlt, key=lambda f: -sum(zahlen[f])):
        varianten = sorted(
            (n for n in je_name if familie(n) == fam and n != fam),
            key=lambda n: -sum(je_band(je_name[n])),
        )[:VARIANTEN]
        aus.append(
            {
                "name": fam,
                "nameDe": deutsch(fam, familien_de),
                "seite": seite[fam],
                "folge": " ".join(kuerzeste[fam]),
                "gambit": ist_gambit(fam),
                "buch": BUCH.get(fam),
                "anteil": [
                    round(100 * n / p, STELLEN) if p else 0
                    for n, p in zip(zahlen[fam], partien_je_band, strict=False)
                ],
                "varianten": [
                    {
                        "name": n,
                        "folge": " ".join(folge_des_namens[n]),
                        "gambit": ist_gambit(n),
                        "anzahl": sum(je_band(je_name[n])),
                    }
                    for n in varianten
                ],
            }
        )
    return aus


def baue_gambits(je_name, folge_des_namens, partien_je_band, familien_de):
    """Die häufigsten Gambits (volle Namen, auch Varianten) mit Anteil je Band und Familie."""
    namen = sorted(
        (n for n in je_name if ist_gambit(n) and n in folge_des_namens),
        key=lambda n: -sum(je_band(je_name[n])),
    )[:GAMBITS]
    return [
        {
            "name": n,
            "familie": familie(n),
            "familieDe": deutsch(familie(n) or "", familien_de),
            "folge": " ".join(folge_des_namens[n]),
            "seite": "w" if len(folge_des_namens[n]) % 2 == 1 else "s",
            "anteil": [
                round(100 * a / p, STELLEN) if p else 0
                for a, p in zip(je_band(je_name[n]), partien_je_band, strict=False)
            ],
        }
        for n in namen
    ]


def baue(ziel: Path, dateien: list[Path]) -> None:
    """Liest die Zählungen, baut die Liste und schreibt sie als JSON."""
    partien, eintraege = lies(dateien)
    finde = zugfolgen(eintraege)
    namen = lies_namen()
    je_familie, je_name, folge_des_namens = zaehle(eintraege, finde, namen)
    familien_de = json.loads(FAMILIEN_DE.read_text(encoding="utf-8"))["familien"]
    partien_je_band = je_band(partien)
    daten = {
        "quelle": "Lichess-Datenbank 2026-09, gewertete Partien Blitz, Schnellschach, Klassisch (CC0); "
        "Namen: lichess-org/chess-openings (CC0)",
        "baender": BAENDER,
        "partienJeBand": partien_je_band,
        "familien": baue_familien(je_familie, je_name, folge_des_namens, partien_je_band, familien_de),
        "gambits": baue_gambits(je_name, folge_des_namens, partien_je_band, familien_de),
    }
    ziel.write_text(json.dumps(daten, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


if __name__ == "__main__":
    baue(Path(sys.argv[1]), [Path(a) for a in sys.argv[2:]])
