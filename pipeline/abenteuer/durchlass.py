"""Pixelgenaue Durchlässe: Bereiche, die der Held nur durch eine Lücke genau seiner Breite erreicht.

Warum: Im Spieler-Durchlauf (Fable, 18.11.2026, Fund 4) kam der Held in der Bergstation von Summit
City in drei von vier Versuchen nicht vom Geländer zurück zur Seilbahn: Zwischen Spind und
Kabinenwand blieb genau eine Lücke von der Breite seines Körpers. Die Erreichbarkeitsprüfungen
(``engstelle.py``, ``figurensperre.py``) zählen so eine Lücke als offen, weil der Körper rechnerisch
hindurchpasst; mit Steuerkreuz oder Wischen trifft ein Spieler sie aber kaum. Auftrag des Hauptchats
(19.11.2026): überall mindestens die Breite der Figur frei, eine Prüfung über alle Szenen.

Regel (KARTENREGELN 10.92, Figur 11⅓ × 20 Kartenpixel; Körper in der App 12 × 12 Pixel,
``oberwelt/szene.ts``): Gerechnet wird wie in ``engstelle.py`` auf Zellen von 4 Pixeln mit
derselben Kollision wie die App (Raster, Möbel mit feinen Masken, feine Felder, Figuren und
stehende Statisten, das Feld über Sitzenden). Ein Körper von 3 Zellen (12 px) ist der Held; ein
Körper von 4 Zellen (16 px) ist der Held mit Spielraum. Jeder Bereich, in dem der Held mit
Spielraum stehen kann, muss vom Start aus auch mit Spielraum erreichbar sein. Ist er nur mit
12 px erreichbar, liegt dazwischen ein pixelgenauer Durchlass.
- Befund: Im abgeschnittenen Bereich liegt ein Ziel (Auslöser, Figur, Statist mit Satz).
- Hinweis: Der Bereich ist leer (eine Nische, in die man sich nur hineinzwängt).
Beispiel aus dem Spiel: Bergstation Summit City vor dem Umbau (Spind auf 11,16).

Aufruf: ``python -m pipeline.abenteuer.durchlass [--hinweise] [SZENE …]`` druckt die Befunde
(Rückgabe 1 bei Befund).
"""

import json
import sys
from collections import deque

from pipeline.abenteuer.engstelle import NACHBARN, mittenkachel, stellplaetze
from pipeline.abenteuer.figurensperre import figurenfelder, sitzkacheln
from pipeline.abenteuer.kartenbau import INHALTE, platziere, raster
from pipeline.abenteuer.kollisionfein import Z, kachelzellen, sperrzellen
from pipeline.abenteuer.moebelliste import lade_moebel

Feld = tuple[int, int]
HELD = 3  # Körper des Helden in Zellen (12 px)
SPIELRAUM = 4  # Körper mit Spielraum (16 px, eine Kachel)
NUR_ENG = "nur durch einen pixelgenauen Durchlass"


def gesperrte_zellen(szene: dict, moebel: dict) -> tuple[set[Feld], Feld]:
    """Gesperrte Zellen wie in der App und die Größe der Karte in Kacheln.

    Eingaben: Szene und Möbelkatalog. Ausgabe: (Zellen, (Breite, Höhe)). Figuren, stehende Statisten
    und das Feld über Sitzenden sperren ihre ganze Kachel (figurensperre.py, begehbar.ts).
    """
    zeilen = raster(szene)
    gesetzt, _ = platziere(szene, moebel)
    figuren = set(figurenfelder(szene)) | set(sitzkacheln(szene, gesetzt, moebel))
    zellen = sperrzellen(zeilen, gesetzt, szene) | {z for f in figuren for z in kachelzellen(f)}
    return zellen, (len(zeilen[0]), len(zeilen))


def bereiche(frei: bytearray, breite: int, hoehe: int) -> list[set[Feld]]:
    """Zusammenhängende Stellplätze (Ecken eines Körpers), je Bereich eine Menge von Zellen.

    Beispiel: zwei Räume, die nur eine Lücke von 12 px verbindet → mit Körper 4 zwei Bereiche.
    """
    gesehen: set[Feld] = set()
    alle = []
    for y in range(hoehe):
        for x in range(breite):
            if not frei[y * breite + x] or (x, y) in gesehen:
                continue
            bereich = {(x, y)}
            offen = deque([(x, y)])
            while offen:
                cx, cy = offen.popleft()
                for dx, dy in NACHBARN:
                    n = (cx + dx, cy + dy)
                    innen = 0 <= n[0] < breite and 0 <= n[1] < hoehe
                    if innen and frei[n[1] * breite + n[0]] and n not in bereich:
                        bereich.add(n)
                        offen.append(n)
            gesehen |= bereich
            alle.append(bereich)
    return alle


def startkacheln(szene: dict) -> set[Feld]:
    """Die Kacheln des Auslösers ``start``, sonst des ersten Auslösers nach Namen."""
    namen = sorted({a["name"] for a in szene.get("ausloeser", [])})
    if not namen:
        return set()
    name = "start" if "start" in namen else namen[0]
    return {tuple(a["feld"]) for a in szene["ausloeser"] if a["name"] == name}


def ziele(szene: dict) -> dict[Feld, str]:
    """Kachel → Name aller Ziele: Auslöser, Figuren und Statisten mit Satz."""
    felder = {tuple(a["feld"]): a["name"] for a in szene.get("ausloeser", []) if a["name"] != "start"}
    for f in szene.get("figuren", []):
        felder[tuple(f["feld"])] = f"Figur {f['name']}"
    for b in szene.get("belebung", []):
        if b.get("eigenschaften", {}).get("sagt"):
            felder[tuple(b["feld"])] = f"Statist {b['name']}"
    return felder


def kacheln_des_bereichs(bereich: set[Feld], koerper: int) -> set[Feld]:
    """Die Kacheln, auf denen die Mitte des Körpers in diesem Bereich stehen kann."""
    return {mittenkachel(x, y, koerper) for x, y in bereich}


def abgeschnittene(szene: dict, moebel: dict) -> list[tuple[set[Feld], list[str]]]:
    """Bereiche, die nur durch einen pixelgenauen Durchlass zu erreichen sind, mit ihren Zielen.

    Ausgabe: je Bereich (Kacheln, Namen der Ziele darin oder daneben). Leer, wenn der Start selbst
    keinen Spielraum hat (dann zählt die Engstellenprüfung).
    """
    gesperrt, (kb, kh) = gesperrte_zellen(szene, moebel)
    breite, hoehe = kb * Z, kh * Z
    start = startkacheln(szene)
    eng = bereiche(stellplaetze(gesperrt, breite, hoehe, HELD), breite, hoehe)
    weit = bereiche(stellplaetze(gesperrt, breite, hoehe, SPIELRAUM), breite, hoehe)
    held_erreicht = next((b for b in eng if kacheln_des_bereichs(b, HELD) & start), set())
    weit_kacheln = [(b, kacheln_des_bereichs(b, SPIELRAUM)) for b in weit]
    haupt = {k for _, kacheln in weit_kacheln if kacheln & start for k in kacheln}
    if not haupt:
        return []
    # Ziele, die man vom Hauptbereich aus ansprechen kann, zählen nicht als abgeschnitten
    # (Busfahrerin an der Schule: neben ihr eine Nische, sie selbst steht frei).
    hauptnah = _nahe(haupt)
    offen = {f: n for f, n in ziele(szene).items() if f not in hauptnah}
    ergebnis = []
    for bereich, kacheln in weit_kacheln:
        if kacheln & start or not bereich & held_erreicht:
            continue
        nah = _nahe(kacheln)
        ergebnis.append((kacheln, sorted({n for f, n in offen.items() if f in nah})))
    return ergebnis


def _nahe(kacheln: set[Feld]) -> set[Feld]:
    """Die Kacheln und ihre vier Nachbarn (von dort spricht oder schaut man an)."""
    return kacheln | {(x + dx, y + dy) for x, y in kacheln for dx, dy in NACHBARN}


def pruefe_szene(szene: dict, moebel: dict) -> tuple[list[str], list[str]]:
    """(Befunde, Hinweise) einer Szene, Text je abgeschnittenem Bereich."""
    befunde, hinweise = [], []
    for kacheln, namen in abgeschnittene(szene, moebel):
        xs, ys = [k[0] for k in kacheln], [k[1] for k in kacheln]
        lage = f"Kacheln {min(xs)}..{max(xs)}, {min(ys)}..{max(ys)}"
        if namen:
            befunde.append(f"{szene['karte']}: {', '.join(namen)} ({lage}) {NUR_ENG}")
        else:
            hinweise.append(f"{szene['karte']}: leere Nische ({lage}) {NUR_ENG}")
    return befunde, hinweise


def pruefe(namen: list[str] | None = None) -> tuple[list[str], list[str]]:
    """Alle Szenen (oder die genannten, Dateiname ohne Endung) prüfen."""
    moebel = lade_moebel()
    befunde, hinweise = [], []
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        if namen and pfad.stem not in namen:
            continue
        b, h = pruefe_szene(json.loads(pfad.read_text(encoding="utf-8")), moebel)
        befunde += [f"{pfad.stem}: {t}" for t in b]
        hinweise += [f"{pfad.stem}: {t}" for t in h]
    return befunde, hinweise


if __name__ == "__main__":
    argumente = [a for a in sys.argv[1:] if not a.startswith("--")]
    befunde, hinweise = pruefe(argumente or None)
    for zeile in befunde + (hinweise if "--hinweise" in sys.argv else []):
        print(zeile)
    print(f"{len(befunde)} Befunde, {len(hinweise)} Hinweise zu pixelgenauen Durchlässen")
    sys.exit(1 if befunde else 0)
