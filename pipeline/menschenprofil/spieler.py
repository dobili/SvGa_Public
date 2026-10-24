"""Sammelt je Spieler 20 bis 30 Partien eines Monats aus der offenen Lichess-Datenbank (CC0).

Wozu: Plan „Bots, zweite Runde“ (Freigabe des Autors, 22.10.2026): Fehlerraten nicht nur als
Mittelwert, sondern als Bereich, in dem 90 % aller Spieler einer Zelle liegen (Beta-Binomial-Modell,
Streuung zwischen Spielern und zwischen Partien eines Spielers). Dafür braucht es viele Partien je
Spieler. Die Lichess-Schnittstelle gibt Partien je Spieler nur noch angemeldet heraus; deshalb liest
das Skript den Monatsstrom der Datenbank in zwei Abschnitten:

1. Auswahl: Die ersten Partien des Monats (Vorgabe 4 Millionen) zählen je Spieler und Tempo die
   Partien und mitteln die Wertung. Je Tempo und Kategorie werden die aktivsten Spieler Kandidaten.
2. Sammeln: Der weitere Strom liefert die Partien der Kandidaten, bis je Spieler das Soll erreicht
   ist (Blitz und Schnellschach 25, klassisch 12) oder die Zeit abläuft.

Kategorien wie in der Auswertung: 400, 800, 1200, 1600, 2000, 2200, 2400 (je bis zur nächsten).
Bullet wird nicht gesammelt (nur ausgewertet, nicht angeboten). Ausgabe nur lokal:
`kandidaten.json` und `spielerpartien.jsonl` (Partie wie sammeln.py, dazu „spieler“ und „farbe“).
Benutzernamen bleiben lokal (buch/arbeit), sie gehören nicht ins Repository.

Aufruf (im Hauptordner):

    python -m pipeline.menschenprofil.spieler --ziel buch/arbeit/spielerprofil --monat 2026-09
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from collections import defaultdict
from pathlib import Path

from pipeline.menschenprofil.sammeln import KOPF, partie_aus, zeilen_aus_datenbank

KATEGORIEN = (400, 800, 1200, 1600, 2000, 2200, 2400)
OBERGRENZE = 2600
TEMPI = {"Blitz": "blitz", "Rapid": "rapid", "Classical": "classical"}
SOLL = {"blitz": 25, "rapid": 25, "classical": 12}
# So viele Kandidaten je Zelle: mehr als die 100 Zielspieler, weil nicht alle genug spielen
KANDIDATEN_JE_ZELLE = 220
MINDEST_IN_AUSWAHL = 2
SEKUNDEN_JE_MINUTE = 60
MELDUNG_ALLE = 1_000_000
# So oft verbindet der Sammler nach einem Abriss des Stroms neu
VERSUCHE = 30


def kategorie(wertung: float) -> int | None:
    """Kategorie (Untergrenze) einer Wertung, oder None außerhalb von 400 bis 2599. 1234 → 1200."""
    if wertung >= OBERGRENZE:
        return None
    passend = [k for k in KATEGORIEN if wertung >= k]
    return passend[-1] if passend else None


def tempo_von(kopf: dict[str, str]) -> str | None:
    """Das Tempo einer gewerteten Partie (ohne Bullet), sonst None."""
    ereignis = kopf.get("Event", "")
    return next((t for name, t in TEMPI.items() if f"Rated {name} game" in ereignis), None)


def koepfe(zeilen):
    """Liefert (Kopf, Zugtext) je Partie, ohne die Züge zu zerlegen."""
    kopf: dict[str, str] = {}
    for zeile in zeilen:
        zeile = zeile.strip()
        treffer = KOPF.match(zeile)
        if treffer:
            kopf[treffer.group(1)] = treffer.group(2)
        elif zeile and kopf:
            yield kopf, zeile
            kopf = {}


def robuste_koepfe(monat: str, versuche: int = VERSUCHE):
    """Wie koepfe über den Monatsstrom, aber robust gegen Abrisse: Endet der Strom oder bricht er
    ab, verbindet die Funktion neu und überspringt die schon gelieferten Partien. Liefert ein neuer
    Versuch keine neue Partie mehr, ist die Datei zu Ende."""
    geliefert = 0
    for versuch in range(versuche):
        vorher = geliefert
        gelesen = 0
        try:
            for kopf, zugtext in koepfe(zeilen_aus_datenbank(monat)):
                gelesen += 1
                if gelesen <= geliefert:
                    continue
                geliefert += 1
                yield kopf, zugtext
        except (OSError, EOFError) as fehler:
            print(f"Abriss nach {geliefert} Partien ({fehler})", flush=True)
            continue
        if geliefert == vorher and versuch > 0:
            return
        print(f"Strom endete nach {geliefert} Partien, Versuch {versuch + 1}", flush=True)
    print(f"Aufgegeben nach {versuche} Versuchen", flush=True)


def waehle(zaehler: dict, summe: dict) -> dict[str, dict]:
    """Je Tempo und Kategorie die aktivsten Spieler: {"tempo|name": {"tempo", "kategorie"}}."""
    zellen: dict[tuple, list] = defaultdict(list)
    for (tempo, name), anzahl in zaehler.items():
        k = kategorie(summe[(tempo, name)] / anzahl)
        if k is not None and anzahl >= MINDEST_IN_AUSWAHL:
            zellen[(tempo, k)].append((anzahl, name))
    gewaehlt = {}
    for (tempo, k), liste in zellen.items():
        for _, name in sorted(liste, reverse=True)[:KANDIDATEN_JE_ZELLE]:
            gewaehlt[f"{tempo}|{name}"] = {"tempo": tempo, "kategorie": k}
    return gewaehlt


def main(argumente: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--ziel", type=Path, default=Path("buch/arbeit/spielerprofil"))
    parser.add_argument("--monat", default="2026-09")
    parser.add_argument("--auswahl", type=int, default=4_000_000, help="Partien für die Auswahl")
    parser.add_argument("--minuten", type=float, default=600)
    args = parser.parse_args(argumente)
    args.ziel.mkdir(parents=True, exist_ok=True)
    ende = time.monotonic() + args.minuten * SEKUNDEN_JE_MINUTE
    zaehler: dict = defaultdict(int)
    summe: dict = defaultdict(float)
    kandidaten: dict | None = None
    gesammelt: dict = defaultdict(int)
    ausgabe = (args.ziel / "spielerpartien.jsonl").open("a", encoding="utf-8")
    for nummer, (kopf, zugtext) in enumerate(robuste_koepfe(args.monat), 1):
        tempo = tempo_von(kopf)
        if kandidaten is None:
            if tempo:
                for farbe, elo in (("White", "WhiteElo"), ("Black", "BlackElo")):
                    if kopf.get(elo, "").isdigit():
                        zaehler[(tempo, kopf.get(farbe, ""))] += 1
                        summe[(tempo, kopf.get(farbe, ""))] += int(kopf[elo])
            if nummer >= args.auswahl:
                kandidaten = waehle(zaehler, summe)
                (args.ziel / "kandidaten.json").write_text(json.dumps(kandidaten), encoding="utf-8")
                print(f"{len(kandidaten)} Kandidaten", flush=True)
            continue
        if tempo:
            for farbe, name in (("weiss", kopf.get("White", "")), ("schwarz", kopf.get("Black", ""))):
                schluessel = f"{tempo}|{name}"
                if schluessel in kandidaten and gesammelt[schluessel] < SOLL[tempo]:
                    partie = partie_aus(kopf, zugtext)
                    if partie:
                        partie.update(
                            spieler=name, farbe=farbe, kategorie=kandidaten[schluessel]["kategorie"]
                        )
                        ausgabe.write(json.dumps(partie) + "\n")
                        gesammelt[schluessel] += 1
        if nummer % MELDUNG_ALLE == 0:
            ausgabe.flush()
            voll = sum(1 for s, n in gesammelt.items() if n >= SOLL[s.split("|")[0]])
            print(f"{nummer} Partien, {voll} Spieler mit vollem Soll", flush=True)
        if time.monotonic() > ende:
            break
    ausgabe.close()
    print("FERTIG", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
