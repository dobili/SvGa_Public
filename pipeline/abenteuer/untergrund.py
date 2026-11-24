"""Untergrund: Steht ein Teil mit sichtbarem Fuß auf dem passenden Boden? (AP8a, 24.11.2026)

Warum: Viele LimeZu-Teile bringen ihren Boden mit: Bäume, Steine und Wegweiser stehen auf einem
Grasfleck, Seerosen und Treibholz auf einem Stück Wasser. Auf Pflaster oder Sand sieht man dann
einen grünen Fleck, im Gras einen blauen (Gutachten des Autors, 24.11.2026). Der Katalog sagt deshalb
im Feld ``untergrund``, worauf der Fuß gezeichnet ist (``gras``, ``wasser``; später ``erde``,
``stein``, ``innen``), und diese Prüfung vergleicht es mit dem Boden unter dem Fuß.

Regel (Außenkarten): Unter der unteren Kachelreihe des deckenden Teils (deckrahmen.py) liegt
mehrheitlich der Boden aus ``untergrund``. Boden je Kachel wie im Kartenbild: Zeichen über ``boeden``,
„.“ der Grundboden, „#“ am Rand der Boden dahinter, sonst ``wandart``. Teile mit ``auf`` (stehen auf
einem anderen Teil) zählen nicht, ebenso Teile, deren Fuß ein ``zuschnitt`` unten abschneidet.
Messen: ``python -m pipeline.abenteuer.untergrund --messen PRIVAT`` setzt ``untergrund`` im Katalog
aus der Farbe der unteren zwei Bildreihen (mindestens ``ANTEIL`` der Bildpunkte grün oder blau, über
mindestens ``BREIT`` der Bildbreite); Fehlgriffe stehen mit Grund in ``KEIN_FUSS``.
Aufruf: ``python -m pipeline.abenteuer.untergrund [--alle]``. Dauertest mit Obergrenze in
``pipeline/tests/test_abenteuer_querschnitt.py`` (Ziel 0). Ausnahmen mit Grund in ``AUSNAHMEN``.
"""

import argparse
import colorsys
import json
import sys
from collections import Counter
from pathlib import Path

from pipeline.abenteuer.bodenraster import randnachbar
from pipeline.abenteuer.deckrahmen import lade as lade_rahmen
from pipeline.abenteuer.deckrahmen import rahmen_von
from pipeline.abenteuer.kartenbau import LEER, WAND, WASSER, K, platziere, raster
from pipeline.abenteuer.moebelliste import ORDNER, lade_moebel

SZENEN = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer" / "szenen"
ANTEIL, BREIT = 0.6, 0.5
FUSS_ABGESCHNITTEN = 3  # so viele Pixel unten weg nehmen den Grasfuß von Schildern und Tafeln
DECKEND_AB = 40
DUNKEL, GRAU, WASSER_SATT = 0.22, 0.15, 0.3  # Hellwert und Sättigung (0 bis 1)
# Arten ohne eigenen Fuß (Boden, Bauwerke, Fahrzeuge, Reihen) werden nicht gemessen.
OHNE_FUSS_ARTEN = {
    "bordstein", "markierung", "gebaeude", "haus", "fahrzeug", "steg", "bruecke", "gleis", "boden",
    "boot", "boden_teil", "feldfrucht", "zaun", "gebaeude_teil",
}  # fmt: skip
KEIN_FUSS: dict[str, str] = {
    "sb9SchildComingSoon": "blaues Schild, kein Wasser",
    "sb9SchildHarborMaster": "blaues Schild, kein Wasser",
    "tier12SchimmelGrast": "Schimmel mit bläulichem Fell, kein Wasser",
    "pdPfuetze3": "Pfütze ist selbst Boden",
    "rv9PfuetzeKlein": "Pfütze ist selbst Boden",
    "st5PfuetzeKlein": "Pfütze ist selbst Boden",
    "pg7Staubteufel": "Staubwirbel in der Luft",
}
# Boden → Untergrund. Nicht genannte Böden (Holz, Dielen) passen zu nichts außer ``innen``.
KLASSE = {
    "gras": "gras", "sumpfboden": "gras", "nadelstreu": "gras",
    "wasser": "wasser", "wasser_watt": "wasser",
    "erde": "erde", "erdeRot": "erde", "sand": "erde", "sandRot": "erde", "sandRotRand": "erde",
    "strand": "erde", "sandplatz": "erde", "schotter": "erde", "pisteRot": "erde",
    "pflaster": "stein", "pflasterWeich": "stein", "pflasterNass": "stein", "asphalt": "stein",
    "asphaltMitte": "stein", "asphaltMitteSenkrecht": "stein", "platten": "stein", "stein": "stein",
    "felsboden": "stein", "felsbodenRot": "stein", "felsbodenRotDunkel": "stein", "sinter": "stein",
}  # fmt: skip
# (Szenenanfang, Möbel) → Grund.
AUSNAHMEN: dict[tuple[str, str], str] = {}


def boden_an(szene: dict, zeilen: list[str], x: int, y: int) -> str | None:
    """Der gezeichnete Boden einer Kachel (Name aus materialien), oder None für Wand ohne Boden."""
    zeichen = zeilen[y][x]
    if zeichen == WASSER:
        return "wasser"
    if zeichen == WAND:
        if (innen := randnachbar(zeilen, x, y)) is not None:
            return boden_an(szene, zeilen, *innen)
        return szene.get("wandart")
    if zeichen == LEER:
        return szene.get("boden")
    return szene.get("boeden", {}).get(zeichen, szene.get("boden"))


def fusskacheln(stueck: dict, angabe: dict, rahmen: tuple) -> list[tuple[int, int]]:
    """Kacheln unter der unteren Kante des deckenden Teils."""
    links, _, rechts, unten = rahmen
    sx, sy = stueck["breite"] / angabe["breite"], stueck["hoehe"] / angabe["hoehe"]
    x0 = int((stueck["x"] + links * sx) // K)
    x1 = int((stueck["x"] + rechts * sx - 1) // K)
    y = int((stueck["y"] + unten * sy - 1) // K)
    return [(x, y) for x in range(x0, x1 + 1)]


def ohne_fuss(objekt: dict) -> bool:
    """Steht das Objekt auf einem anderen (``auf``) oder ist sein Fuß weggeschnitten?

    Beispiel: Wegweiser mit ``zuschnitt`` [0, 0, 0, 3] → True (das Gras liegt in den unteren drei
    Reihen; objektzuschnitt.py, ``versatz`` [0, 3] setzt den Pfosten wieder auf den Boden).
    """
    zuschnitt = objekt.get("zuschnitt") or [0, 0, 0, 0]
    return bool(objekt.get("auf")) or zuschnitt[3] >= FUSS_ABGESCHNITTEN


def pruefe_szene(name: str, szene: dict, katalog: dict, rahmen: dict) -> list[str]:
    """Teile mit ``untergrund``, deren Fuß mehrheitlich auf anderem Boden steht (nur außen)."""
    if szene.get("art") != "aussen":
        return []
    zeilen, befunde = raster(szene), []
    gesetzt, _ = platziere(szene, katalog)
    auf = {o.get("id", f"{o['moebel']}@{i}") for i, o in enumerate(szene.get("objekte", [])) if ohne_fuss(o)}
    for s in gesetzt:
        soll = katalog[s["name"]].get("untergrund")
        if not soll or s["id"] in auf or any(name.startswith(a) and s["name"] == m for a, m in AUSNAHMEN):
            continue
        felder = [
            (x, y)
            for x, y in fusskacheln(s, katalog[s["name"]], rahmen_von(s["name"], katalog[s["name"]], rahmen))
            if 0 <= y < len(zeilen) and 0 <= x < len(zeilen[0])
        ]
        klassen = Counter(KLASSE.get(boden_an(szene, zeilen, x, y) or "", "anders") for x, y in felder)
        if felder and klassen[soll] * 2 <= len(felder):
            ist = klassen.most_common(1)[0][0]
            befunde.append(f"{s['name']} (Fuß {soll}) steht auf {ist} bei {felder[0]}")
    return befunde


def pruefe() -> list[str]:
    """Alle Befunde, je Zeile „Szene: Befund“."""
    katalog, rahmen, befunde = lade_moebel(), lade_rahmen(), []
    for pfad in sorted(SZENEN.glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        befunde += [f"{pfad.stem}: {b}" for b in pruefe_szene(pfad.stem, szene, katalog, rahmen)]
    return befunde


def fussfarbe(bild) -> str | None:
    """„gras“ oder „wasser“, wenn die unteren zwei Bildreihen so gefärbt sind, sonst None."""
    box = bild.getchannel("A").point(lambda a: 255 if a > DECKEND_AB else 0).getbbox()
    if not box:
        return None
    punkte, zaehler, breite = bild.load(), Counter(), 0
    for y in range(box[3] - 2, box[3]):
        reihe = [punkte[x, y] for x in range(bild.width) if punkte[x, y][3] > DECKEND_AB]
        breite = max(breite, len(reihe))
        for r, g, b, _ in reihe:
            h, sat, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if v < DUNKEL:
                continue  # Umriss und Schatten
            if sat < GRAU:
                zaehler["x"] += 1
            elif 65 <= h * 360 <= 170:
                zaehler["gras"] += 1
            elif 180 <= h * 360 <= 250 and sat > WASSER_SATT:
                zaehler["wasser"] += 1
            else:
                zaehler["x"] += 1
    gesamt = sum(zaehler.values())
    if not gesamt or breite < BREIT * bild.width:
        return None
    farbe, anzahl = zaehler.most_common(1)[0]
    return farbe if farbe != "x" and anzahl >= ANTEIL * gesamt else None


def setze_untergrund(privat: Path) -> int:
    """Misst alle Teile, die draußen stehen (ohne Arten ohne Fuß); schreibt ``untergrund`` in den Katalog."""
    from pipeline.abenteuer.deckrahmen import _bild
    from pipeline.abenteuer.katalogfeld import setze

    katalog, gesetzt = lade_moebel(), 0
    draussen = {
        o["moebel"]
        for p in SZENEN.glob("*.json")
        if (szene := json.loads(p.read_text(encoding="utf-8"))).get("art") == "aussen"
        for o in szene.get("objekte", [])
    }
    for datei in sorted(ORDNER.glob("*.json")):
        text = datei.read_text(encoding="utf-8")
        for name in json.loads(text).get("moebel", {}):
            angabe = katalog[name]
            if name not in draussen or angabe.get("art") in OHNE_FUSS_ARTEN or name in KEIN_FUSS:
                continue
            bild = _bild(privat, angabe)
            farbe = fussfarbe(bild) if bild is not None else None
            if farbe != angabe.get("untergrund"):
                text, gesetzt = setze(text, name, "untergrund", farbe), gesetzt + 1
        datei.write_text(text, encoding="utf-8")
    return gesetzt


def main() -> int:
    """Befunde drucken (``--alle`` ohne Kürzung); mit ``--messen PRIVAT`` erst den Katalog setzen."""
    teile = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teile.add_argument("--alle", action="store_true", help="alle Befunde drucken")
    teile.add_argument("--messen", type=Path, help="privates Paket: untergrund im Katalog setzen")
    args = teile.parse_args()
    if args.messen:
        print(f"{setze_untergrund(args.messen)} Katalogeinträge geändert")
    befunde = pruefe()
    for b in befunde if args.alle else befunde[:40]:
        print(b)
    print(f"{len(befunde)} Befunde")
    return 0


if __name__ == "__main__":
    sys.exit(main())
