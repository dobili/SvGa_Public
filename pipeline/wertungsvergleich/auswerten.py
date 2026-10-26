"""Misst aus den gesammelten Paaren die Bereiche Lichess → FIDE und Lichess → chess.com je Band.

Aufruf (nach ``sammeln.py`` und ``chesscom.py``, im Hauptordner):

    python -m pipeline.wertungsvergleich.auswerten --ziel buch/arbeit/wertungsvergleich \
        --ts app/src/spiel/plattformvergleich-daten.ts

Rolle im Gesamtbild: Liefert der App (``app/src/spiel/plattformvergleich.ts``) je Zeitklasse und
Liste eine Tabelle [Lichess, von, Mitte, bis, Zahl der Spieler]. Statistisches Fundament:
bedingte Quantile. Für Spieler mit (fast) derselben Lichess-Zahl werden das untere und obere
Viertel (25 %, 75 %) und der Median der Zielwertung gemessen; dazwischen liegt die Hälfte der
Spieler (wie das „±“ von chessgoals.com). Quantile sind robust: Ausreißer (veraltete oder falsche
Selbstangaben) verschieben sie kaum, deshalb wird nichts „bereinigt“, was die Streuung künstlich
verkleinern würde.

Schritte:
1. Filter je Zeitklasse: Lichess mit mindestens 20 Partien, RD unter 150 (wie chessgoals.com), im
   letzten Jahr gesehen. FIDE: nur Spieler, die ``abgleich.py`` eindeutig in der offiziellen
   FIDE-Liste gefunden hat und die dort aktiv sind, mit ihrer offiziellen Standard-Wertung (so
   veraltet keine Selbstangabe die Messung). chess.com mit mindestens 20 Partien, RD unter 150,
   Partie im letzten Jahr. Die Funktion ``fide_paare`` (Selbstangaben, ohne Abgleich) bleibt zum
   Vergleich.
2. Mediankurve m(x) aus Bändern zu 100 Punkten, monoton gemacht (Pool Adjacent Violators).
3. Je Stützstelle c (alle 50 Punkte) die Spieler mit |x − c| ≤ 100; ihre Abweichungen y − m(x)
   plus m(c), damit die Steigung innerhalb des Fensters die Streuung nicht aufbläht.
4. Quantile 25, 50, 75 % und ihre Unsicherheit (Bootstrap, 300 Ziehungen). Die Ränder werden um
   eine Standardabweichung der Messung nach außen geschoben: Wo wenige Spieler sind, wird der
   Bereich dadurch breiter, wo viele sind, bleibt er bei der gemessenen Streuung.
5. Nur Stützstellen mit mindestens MINDESTZAHL (25) Spielern, und nur Tabellen mit mindestens
   MINDESTBAENDER Stützstellen; außerhalb liefert die App null, ohne Tabelle nimmt sie den Umweg
   über chessgoals.com. 25 reicht für Viertel: deren Messfehler (Bootstrap) liegt dann bei etwa
   einem Viertel der Streuung und wird in Schritt 4 dazugerechnet.
"""

from __future__ import annotations

import argparse
import json
import random
import statistics
import time
from pathlib import Path

ZEITKLASSEN = ("blitz", "rapid", "classical")
#: chess.com hat keine Wertung für Klassisch und wertet Partien ab zehn Minuten als Schnellschach.
CHESSCOM_ZEITKLASSE = {"blitz": "blitz", "rapid": "rapid", "classical": "rapid"}
MINDESTPARTIEN = 20
HOECHST_RD = 150
EIN_JAHR_MS = 365 * 24 * 3600 * 1000
FIDE_GRENZEN = (1000, 2850)
FENSTER = 100
SCHRITT = 50
MINDESTZAHL = 25
#: Weniger Bänder als hier sind keine brauchbare Tabelle; die App nimmt dann chessgoals.com.
MINDESTBAENDER = 6
ZIEHUNGEN = 300
RUNDUNG = 5


def gefestigt(perf: dict | None) -> bool:
    """Lichess-Wertung mit genug Partien und RD unter 150 (wie chessgoals.com).

    Warum nicht „nicht vorläufig“ (RD unter 110): Wer klassisch spielt, spielt selten, die RD steigt
    dann schnell über 110; mit dieser Grenze blieben für Klassisch nur rund 100 Paare.
    """
    return bool(
        perf
        and perf.get("rating")
        and (perf.get("games") or 0) >= MINDESTPARTIEN
        and (perf.get("rd") or 999) < HOECHST_RD
    )


def fide_paare(profile: list[dict], tempo: str, jetzt_ms: int) -> list[tuple[int, int]]:
    """(Lichess, FIDE) je Spieler, nach den Filtern aus Schritt 1."""
    paare = []
    for p in profile:
        fide = p.get("fide")
        perf = p["perfs"].get(tempo)
        if not fide or not gefestigt(perf) or (p.get("gesehen") or 0) < jetzt_ms - EIN_JAHR_MS:
            continue
        if not FIDE_GRENZEN[0] <= fide <= FIDE_GRENZEN[1] or fide % 100 == 0:
            continue
        paare.append((perf["rating"], fide))
    return paare


def abgeglichene_paare(
    profile: dict[str, dict], abgleich: list[dict], tempo: str, jetzt_ms: int
) -> list[tuple[int, int]]:
    """(Lichess, offizielle FIDE-Standardwertung) für abgeglichene, bei der FIDE aktive Spieler."""
    paare = []
    for eintrag in abgleich:
        p = profile.get(eintrag["id"])
        if not p or not eintrag.get("aktiv") or not eintrag.get("standard"):
            continue
        perf = p["perfs"].get(tempo)
        if not gefestigt(perf) or (p.get("gesehen") or 0) < jetzt_ms - EIN_JAHR_MS:
            continue
        paare.append((perf["rating"], eintrag["standard"]))
    return paare


def chesscom_paare(
    profile: list[dict], chesscom: dict[str, dict], tempo: str, jetzt_s: int
) -> list[tuple[int, int]]:
    """(Lichess, chess.com) je Spieler mit verlinktem Konto, nach den Filtern aus Schritt 1."""
    paare = []
    for p in profile:
        konto = chesscom.get(p.get("chesscom") or "")
        perf = p["perfs"].get(tempo)
        if not konto or not gefestigt(perf):
            continue
        ziel = (konto.get("perfs") or {}).get(CHESSCOM_ZEITKLASSE[tempo])
        if not ziel or (ziel.get("games") or 0) < MINDESTPARTIEN:
            continue
        if (ziel.get("rd") or 999) >= HOECHST_RD or (ziel.get("datum") or 0) < jetzt_s - 365 * 86400:
            continue
        paare.append((perf["rating"], ziel["rating"]))
    return paare


def quantil(werte: list[float], anteil: float) -> float:
    """Quantil mit linearer Zwischenrechnung (wie numpy, Methode „linear“)."""
    sortiert = sorted(werte)
    stelle = anteil * (len(sortiert) - 1)
    unten = int(stelle)
    oben = min(unten + 1, len(sortiert) - 1)
    return sortiert[unten] + (stelle - unten) * (sortiert[oben] - sortiert[unten])


def monoton(werte: list[float]) -> list[float]:
    """Pool Adjacent Violators: die nächste nicht fallende Folge (kleinste Quadrate)."""
    bloecke: list[list[float]] = []
    for w in werte:
        bloecke.append([w, 1])
        while len(bloecke) > 1 and bloecke[-2][0] > bloecke[-1][0]:
            w2, n2 = bloecke.pop()
            w1, n1 = bloecke.pop()
            bloecke.append([(w1 * n1 + w2 * n2) / (n1 + n2), n1 + n2])
    return [w for w, n in bloecke for _ in range(int(n))]


def mediankurve(paare: list[tuple[int, int]]) -> list[tuple[float, float]]:
    """Schritt 2: Median der Zielwertung je Band zu 100 Punkten, monoton, als Stützstellen."""
    baender: dict[int, list[int]] = {}
    for x, y in paare:
        baender.setdefault(x // 100 * 100 + 50, []).append(y)
    mitten = sorted(c for c, ys in baender.items() if len(ys) >= MINDESTZAHL // 4)
    medianwerte = monoton([statistics.median(baender[c]) for c in mitten])
    return list(zip(mitten, medianwerte, strict=True))


def kurvenwert(kurve: list[tuple[float, float]], x: float) -> float:
    """Linear zwischen den Stützstellen, außerhalb mit der Steigung des Randstücks."""
    if len(kurve) == 1:
        return kurve[0][1]
    for i in range(1, len(kurve)):
        (x0, y0), (x1, y1) = kurve[i - 1], kurve[i]
        if x <= x1 or i == len(kurve) - 1:
            return y0 + (x - x0) / (x1 - x0) * (y1 - y0)
    return kurve[-1][1]


def stuetzstelle(fenster: list[float], zufall: random.Random) -> tuple[float, float, float]:
    """Schritt 4: Quantile 25/50/75 und die nach außen geschobenen Ränder."""
    q25, q50, q75 = (quantil(fenster, a) for a in (0.25, 0.5, 0.75))
    ziehungen = [[zufall.choice(fenster) for _ in fenster] for _ in range(ZIEHUNGEN)]
    se25 = statistics.stdev(quantil(z, 0.25) for z in ziehungen)
    se75 = statistics.stdev(quantil(z, 0.75) for z in ziehungen)
    return q25 - se25, q50, q75 + se75


def tabelle(paare: list[tuple[int, int]]) -> list[list[int]]:
    """Schritte 2 bis 5: [Lichess, von, Mitte, bis, Zahl] je Stützstelle, Ränder monoton."""
    if len(paare) < MINDESTZAHL:
        return []
    kurve = mediankurve(paare)
    if not kurve:
        return []
    zufall = random.Random(1)
    zeilen = []
    for c in range(600, 3000, SCHRITT):
        fenster = [y - kurvenwert(kurve, x) + kurvenwert(kurve, c) for x, y in paare if abs(x - c) <= FENSTER]
        if len(fenster) >= MINDESTZAHL:
            von, mitte, bis = stuetzstelle(fenster, zufall)
            zeilen.append([c, von, mitte, bis, len(fenster)])
    if len(zeilen) < MINDESTBAENDER:
        return []
    spalten = [monoton([z[i] for z in zeilen]) for i in (1, 2, 3)]
    return [[z[0], *(round(s[k] / RUNDUNG) * RUNDUNG for s in spalten), z[4]] for k, z in enumerate(zeilen)]


def lesen(datei: Path) -> list[dict]:
    """Eine ndjson-Datei als Liste; fehlt sie, leer."""
    if not datei.exists():
        return []
    return [json.loads(z) for z in datei.open(encoding="utf-8") if z.strip()]


def auswerten(ziel: Path) -> dict:
    """Alle Tabellen und die Zahl der Paare je Zeitklasse und Liste."""
    profile = {p["id"]: p for p in lesen(ziel / "profile.ndjson")}
    chesscom = {k["chesscom"]: k for k in lesen(ziel / "chesscom.ndjson") if k.get("gefunden")}
    abgleich = lesen(ziel / "abgleich.ndjson")
    jetzt_ms = int(time.time() * 1000)
    ergebnis: dict = {"fide": {}, "chesscom": {}, "paare": {"fide": {}, "chesscom": {}}}
    for tempo in ZEITKLASSEN:
        werte = list(profile.values())
        for liste, paare in (
            ("fide", abgeglichene_paare(profile, abgleich, tempo, jetzt_ms)),
            ("chesscom", chesscom_paare(werte, chesscom, tempo, jetzt_ms // 1000)),
        ):
            ergebnis[liste][tempo] = tabelle(paare)
            ergebnis["paare"][liste][tempo] = len(paare)
    ergebnis["profile"] = len(profile)
    return ergebnis


def main() -> None:
    """Befehlszeile: schreibt ergebnis.json in den Zielordner und auf Wunsch die TS-Datei."""
    teiler = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teiler.add_argument("--ziel", type=Path, default=Path("buch/arbeit/wertungsvergleich"))
    teiler.add_argument("--ts", type=Path)
    argumente = teiler.parse_args()
    ergebnis = auswerten(argumente.ziel)
    (argumente.ziel / "ergebnis.json").write_text(json.dumps(ergebnis, indent=1), encoding="utf-8")
    print(json.dumps(ergebnis["paare"]), ergebnis["profile"])
    if argumente.ts:
        from pipeline.wertungsvergleich.ts_schreiben import schreiben

        schreiben(ergebnis, argumente.ts)


if __name__ == "__main__":
    main()
