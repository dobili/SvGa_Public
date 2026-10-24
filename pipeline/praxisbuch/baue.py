"""Baut public/daten/praxisbuch.json aus den Zählungen des Lichess-Monats (zaehler.cpp).

Teil des Praxisbuchs 0.2.127 (pipeline/praxisbuch; die Zählungen liegen nur lokal in
buch/arbeit/praxisbuch). Je Zugfolge und Zelle (Zeitklasse,
200er-Band der ziehenden Seite) die Summe aller gezählten Antworten und die häufigen Züge.
Seltene Züge bleiben weg, ihr Anteil ist das Buchende (engine/praxisbuch.ts). Dazu die häufigsten
benannten Eröffnungen der Lichess-Liste mit ihrer Zugfolge (für „Eröffnung festlegen“).

Aufruf: python3 baue.py ../../../app/public/daten/praxisbuch.json voll.tsv [voll2.tsv …] [--groesse 3000000]
"""

import argparse
import csv
import json
import re
from collections import defaultdict
from pathlib import Path

ZEITKLASSEN = ["blitz", "rapid", "classical"]
BAENDER = list(range(400, 2801, 200))
HALBZUEGE = 20
ANTEIL_ZUG = 0.02  # Züge unter 2 % einer Stelle zählen als seltene Abweichung
MINDEST_ZUG = 5
MINDEST_ABSOLUT = 30  # Stellen unter 30 gezählten Antworten sind zu dünn
LISTE = Path(__file__).resolve().parents[2] / "inhalte" / "lichess"
BENANNTE = 120


def lies(dateien):
    """Liest eine oder mehrere Zählungen (Teile des Monats) und zählt sie zusammen."""
    partien = defaultdict(int)
    summe = defaultdict(int)
    for datei in dateien:
        with open(datei) as f:
            for zeile in f:
                teile = zeile.rstrip("\n").split("\t")
                if teile[0] == "#partien":
                    partien[int(teile[1])] += int(teile[2])
                    continue
                zelle, vorher, nachher, zug, anzahl = teile
                summe[(int(zelle), int(vorher), int(nachher), zug)] += int(anzahl)
    eintraege = [(z, v, n, zug, a) for (z, v, n, zug), a in summe.items()]
    return partien, eintraege


def zugfolgen(eintraege):
    """Hash nach dem Zug → (Hash davor, Zug); daraus die SAN-Folge jedes Hashes (0: Grundstellung)."""
    kante = {}
    for _, vorher, nachher, zug, _ in eintraege:
        kante.setdefault(nachher, (vorher, zug))
    folge = {0: ()}

    def finde(h):
        weg = []
        while h not in folge:
            if h not in kante:
                return None
            weg.append(h)
            h = kante[h][0]
        basis = folge[h]
        for k in reversed(weg):
            basis = basis + (kante[k][1],)
            folge[k] = basis
        return folge[weg[0]] if weg else basis

    return finde


def knoten_bauen(eintraege, finde, faktor, partien):
    """Je Zelle die Stellen ab einer Mindestsumme, die mit der Größe der Zelle wächst."""
    kinder = defaultdict(list)  # (zelle, vorher) → [(zug, anzahl)]
    for zelle, vorher, _, zug, anzahl in eintraege:
        kinder[(zelle, vorher)].append((zug, anzahl))
    knoten = defaultdict(dict)
    for (zelle, vorher), liste in kinder.items():
        summe = sum(a for _, a in liste)
        if summe < max(MINDEST_ABSOLUT, faktor * partien.get(zelle, 0)):
            continue
        folge = finde(vorher)
        if folge is None or len(folge) >= HALBZUEGE:
            continue
        behalten = sorted(
            [(z, a) for z, a in liste if a >= MINDEST_ZUG and a >= ANTEIL_ZUG * summe],
            key=lambda x: -x[1],
        )
        if not behalten:
            continue
        flach = [summe]
        for z, a in behalten:
            flach += [z, a]
        knoten[folge][str(zelle)] = flach
    return knoten


def kompakt(knoten):
    """Zugfolgen als Baum: Liste [Elter, Zug] (Index 0 = Grundstellung), Daten je Index."""
    index = {(): 0}
    folgen = [[-1, ""]]

    def nummer(folge):
        if folge not in index:
            elter = nummer(folge[:-1])
            index[folge] = len(folgen)
            folgen.append([elter, folge[-1]])
        return index[folge]

    daten = {}
    for folge in sorted(knoten, key=len):
        daten[str(nummer(folge))] = knoten[folge]
    return folgen, daten


def benannte_eroeffnungen(eintraege, finde):
    """Die häufigsten benannten Eröffnungen der Lichess-Liste: [Name, Zugfolge, Anzahl]."""
    gesamt = defaultdict(int)
    for _, _, nachher, _, anzahl in eintraege:
        gesamt[nachher] += anzahl
    nach_folge = {}
    for h, n in gesamt.items():
        f = finde(h)
        if f is not None:
            nach_folge[" ".join(f)] = nach_folge.get(" ".join(f), 0) + n
    funde = []
    for datei in sorted(LISTE.glob("*.tsv")):
        with open(datei) as f:
            for zeile in csv.DictReader(f, delimiter="\t"):
                zuege = [t for t in zeile["pgn"].split() if not re.match(r"^\d+\.", t)]
                if len(zuege) > HALBZUEGE:
                    continue
                n = nach_folge.get(" ".join(zuege), 0)
                if n > 0:
                    funde.append([zeile["name"], " ".join(zuege), n])
    funde.sort(key=lambda x: -x[2])
    # Je Name nur die häufigste Zugfolge, und erst ab zwei Halbzügen (1. e4 allein ist keine Wahl)
    gesehen, aus = set(), []
    for name, folge, n in funde:
        if name in gesehen or len(folge.split()) < 2:
            continue
        gesehen.add(name)
        aus.append([name, folge, n])
    return aus[:BENANNTE]


def main():
    a = argparse.ArgumentParser()
    a.add_argument("ziel")
    a.add_argument("quellen", nargs="+")
    a.add_argument("--groesse", type=int, default=3_000_000)
    a.add_argument("--monat", default="2026-09")
    args = a.parse_args()
    partien, eintraege = lies(args.quellen)
    finde = zugfolgen(eintraege)
    benannt = benannte_eroeffnungen(eintraege, finde)
    faktor = 2e-5
    while True:
        knoten = knoten_bauen(eintraege, finde, faktor, partien)
        folgen, daten = kompakt(knoten)
        buch = {
            "quelle": f"Lichess-Datenbank {args.monat}, gewertete Partien Blitz, Schnellschach, "
            "Klassisch (CC0)",
            "zeitklassen": ZEITKLASSEN,
            "baender": BAENDER,
            "anteilJeZelle": faktor,
            "partienJeZelle": [partien.get(i, 0) for i in range(len(ZEITKLASSEN) * len(BAENDER))],
            "eroeffnungen": benannt,
            "folgen": folgen,
            "daten": daten,
        }
        text = json.dumps(buch, ensure_ascii=False, separators=(",", ":"))
        print(f"Faktor {faktor:.2e}: {len(daten)} Zugfolgen, {len(text)} Bytes", flush=True)
        if len(text) <= args.groesse:
            break
        faktor *= 1.25
    Path(args.ziel).write_text(text)


if __name__ == "__main__":
    main()
