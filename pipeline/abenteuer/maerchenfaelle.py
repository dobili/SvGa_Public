"""Testfälle für die Märchenfiguren-Varianten aus Fairy-Stockfish (pyffish), für die App.

Warum: Falke und Bison (L9, Fairy-Stockfish „seirawan“) und Drache (L10, eigene Variante „drache“
nach Seirawan-Art) spielt die App über ffish mit derselben variants.ini wie die Engine (Schnittstelle
von mittel-3, 26.11.2026). Damit App und Engine gleich rechnen, braucht die Regelschicht feste
Testfälle: Stellungen mit allen legalen Zügen, dazu je ein Zug mit SAN und neuer FEN. Erzeugt
werden sie hier einmal mit pyffish; die App prüft ihre Regelschicht gegen die Datei.

Aufruf: ``python -m pipeline.abenteuer.maerchenfaelle ZIEL.json [--partien 6] [--zuege 40]``
(braucht pyffish: ``pip install pyffish``; nur zum Erzeugen, nicht für die Tests).
Inhalt (legale Züge als eine Zeile, durch Leerzeichen getrennt): je Variante die Startstellung,
Stellungen aus festen Zufallspartien (Startwert je Partie) und gezielte Sonderfälle: Einsetzen
beim Springerzug und bei der Rochade, Turmzug ohne Einsetzen. Die Datei im Repository
(app/src/abenteuer/regeln/maerchenfaelle.json) entstand mit ``--partien 3``, danach prettier.
"""

import argparse
import json
import random
import sys
from pathlib import Path

# Drache (Szene 90, Entscheidung 26.11.2026): ein Drache (Dame + Springer) je Seite, eingesetzt wie
# im S-Chess; dieselbe Zeile steht in der variants.ini der Engine.
DRACHE_INI = """[drache:seirawan]
archbishop = -
chancellor = -
amazon = d
startFen = rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR[Dd] w KQBCDFGkqbcdfg - 0 1
promotionPieceTypes = nbrq
"""
VARIANTEN = ("seirawan", "drache")
# Feste Zugfolgen für Sonderfälle (aus der Startstellung, UCI wie Fairy-Stockfish).
SONDERFAELLE = {
    "seirawan": [
        ["g1f3h", "b8c6e"],  # Einsetzen beim Springerzug (Falke, Bison)
        ["e2e4", "e7e5", "g1f3", "g8f6", "f1e2", "f8e7", "e1g1e"],  # Rochade, Bison auf e1
        ["e2e4", "e7e5", "g1f3", "g8f6", "f1e2", "f8e7", "h1g1"],  # Turmzug ohne Einsetzen
    ],
    "drache": [
        ["b1c3d", "g8f6d"],  # Drache beim Springerzug
        ["e2e4", "e7e5", "g1f3", "g8f6", "f1c4", "f8c5", "e1g1d"],  # Rochade, Drache auf e1
    ],
}


def _faelle_einer_partie(sf, variante: str, zufall: random.Random, zuege: int) -> list[dict]:
    """Stellungen einer Zufallspartie; je Stellung alle legalen Züge und ein gespielter Zug."""
    start = sf.start_fen(variante)
    gespielt: list[str] = []
    faelle = []
    for _ in range(zuege):
        legal = sorted(sf.legal_moves(variante, start, gespielt))
        if not legal:
            break
        # Einsetzzüge und Schläge bevorzugen, damit die Fälle die Märchenfiguren oft enthalten.
        besondere = [z for z in legal if z[-1] in "hed" and len(z) == 5]
        zug = zufall.choice(besondere if besondere and zufall.random() < 0.5 else legal)
        fen = sf.get_fen(variante, start, gespielt)
        faelle.append(
            {
                "fen": fen,
                "legal": " ".join(legal),
                "zug": zug,
                "san": sf.get_san(variante, fen, zug),
                "danach": sf.get_fen(variante, fen, [zug]),
            }
        )
        gespielt.append(zug)
    return faelle


def _sonderfall(sf, variante: str, folge: list[str]) -> dict:
    """Die Stellung vor dem letzten Zug der Folge, mit allen Zügen und dem letzten Zug."""
    start = sf.start_fen(variante)
    fen = sf.get_fen(variante, start, folge[:-1])
    zug = folge[-1]
    legal = sorted(sf.legal_moves(variante, fen, []))
    if zug not in legal:
        raise ValueError(f"{variante}: {zug} ist nach {folge[:-1]} nicht legal")
    return {"fen": fen, "legal": " ".join(legal), "zug": zug, "san": sf.get_san(variante, fen, zug),
            "danach": sf.get_fen(variante, fen, [zug])}  # fmt: skip


def erzeuge(partien: int, zuege: int) -> dict:
    """Alle Testfälle als Wörterbuch (Variante → Startstellung, Fälle)."""
    import pyffish as sf  # nur hier: die Tests der Pipeline brauchen pyffish nicht

    sf.load_variant_config(DRACHE_INI)
    ergebnis = {"erklaerung": __doc__.splitlines()[0], "engine": ".".join(map(str, sf.version())),
                "ini": DRACHE_INI, "varianten": {}}  # fmt: skip
    for variante in VARIANTEN:
        faelle = [_sonderfall(sf, variante, f) for f in SONDERFAELLE[variante]]
        for nummer in range(partien):
            faelle += _faelle_einer_partie(sf, variante, random.Random(nummer + 1), zuege)
        ergebnis["varianten"][variante] = {"start": sf.start_fen(variante), "faelle": faelle}
    return ergebnis


def main() -> int:
    """Testfälle erzeugen und schreiben."""
    teile = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teile.add_argument("ziel", type=Path)
    teile.add_argument("--partien", type=int, default=6)
    teile.add_argument("--zuege", type=int, default=40)
    args = teile.parse_args()
    daten = erzeuge(args.partien, args.zuege)
    args.ziel.write_text(json.dumps(daten, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    anzahl = {v: len(d["faelle"]) for v, d in daten["varianten"].items()}
    print(f"{args.ziel}: {anzahl}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
