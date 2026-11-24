"""Reicht ein Objekt in Innenräumen in die weiße Mauerkrone? (AP8a, Gutachten des Autors, 24.11.2026)

Warum: Innenwände im Stil von LimeZu sind von oben gesehen eine weiße Krone mit dunklem Rand,
darunter zwei Reihen Wandfläche (kartenbild.py, ``flaechen``). Möbel vor der Wandfläche sind gewollt;
ragt aber ein Bild, Ofenrohr oder Schalter in die Krone, sieht es aus, als stecke es in der Decke. Die
Gutachter fanden acht solche Stellen (Fahrkartenschalter Riverton, Kamin der Hütte in Summit City,
zwei Graffiti im U-Bahnhof, Bild im Gasthaus Lockport, Ofenrohr in Siedlungshütte und Laden Ghost
Town, Pokal in der Kantine Ironwood); sie sind seit dem 24.11.2026 tiefer gesetzt (``versatz``).

Regel: Krone ist jede Wandkachel über der Wandfläche einer Nordwand (dieselbe Spalte, bis zur
nächsten Nicht-Wand). Befund, wenn der deckende Teil eines Objekts (deckrahmen.py) mindestens
``MIN_PIXEL`` Pixel in eine solche Kachel ragt (seitlich mindestens ``MIN_BREITE`` Pixel). Türen und
Matten in Südwänden zählen nicht: Unter ihnen liegt keine Wandfläche.
Aufruf: ``python -m pipeline.abenteuer.kronenhoehe [--alle]``. Dauertest: obergrenzen in
``pipeline/tests/test_abenteuer_querschnitt.py`` (Ziel 0). Ausnahmen mit Grund in ``AUSNAHMEN``.
"""

import argparse
import json
import sys
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer.deckrahmen import lade as lade_rahmen
from pipeline.abenteuer.deckrahmen import rahmen_von
from pipeline.abenteuer.kartenbau import WAND, K, platziere, raster
from pipeline.abenteuer.kartenbild import flaechen
from pipeline.abenteuer.moebelliste import lade_moebel

SZENEN = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer" / "szenen"
MIN_PIXEL = 1  # so tief muss ein Objekt in die Krone ragen
MIN_BREITE = 4  # und so breit (ein Pixel Kante am Rand zählt nicht)
# (Szenenanfang, Möbel) → Grund.
AUSNAHMEN: dict[tuple[str, str], str] = {
    ("riverton-pavillon", "rv18SchraegzaunObenLinks"): (
        "Offener Pavillon: Die „Wand“ oben ist das Geländer unter dem Dach, die Schrägzäune bilden "
        "die Ecken des Geländers (Gutachten Runde 7)."
    ),
    ("riverton-pavillon", "rv18SchraegzaunObenRechts"): "wie rv18SchraegzaunObenLinks",
}

Feld = tuple[int, int]


@dataclass
class Befund:
    """Ein Objekt, das in die Mauerkrone ragt."""

    szene: str
    moebel: str
    feld: list | None
    pixel: int

    def text(self) -> str:
        return f"{self.szene}: {self.moebel} {self.feld} ragt {self.pixel} px in die Mauerkrone"


def kronenfelder(zeilen: list[str]) -> set[Feld]:
    """Krone über den Wandflächen: von der oberen Flächenreihe aufwärts, solange Wand ohne Fläche."""
    flaeche = flaechen(zeilen, True)
    krone: set[Feld] = set()
    for (x, y), lage in flaeche.items():
        if lage != "oben":
            continue
        yy = y - 1
        while yy >= 0 and zeilen[yy][x] == WAND and (x, yy) not in flaeche:
            krone.add((x, yy))
            yy -= 1
    return krone


def ragt_hinein(stueck: dict, angabe: dict, rahmen: tuple, krone: set[Feld]) -> int:
    """Wie viele Pixel der deckende Teil des Stücks höchstens in eine Kronenkachel ragt."""
    links, oben, rechts, unten = rahmen
    sx, sy = stueck["breite"] / angabe["breite"], stueck["hoehe"] / angabe["hoehe"]
    x0, x1 = stueck["x"] + links * sx, stueck["x"] + rechts * sx
    y0, y1 = stueck["y"] + oben * sy, stueck["y"] + unten * sy
    tiefste = 0.0
    for kx, ky in krone:
        breit = min(x1, (kx + 1) * K) - max(x0, kx * K)
        hoch = min(y1, (ky + 1) * K) - max(y0, ky * K)
        if breit >= MIN_BREITE and hoch > tiefste:
            tiefste = hoch
    return round(tiefste)


def ausgenommen(szene: str, moebel: str) -> bool:
    """Steht die Stelle mit Grund in AUSNAHMEN?"""
    return any(szene.startswith(a) and moebel == m for a, m in AUSNAHMEN)


def pruefe_szene(name: str, szene: dict, katalog: dict, rahmen: dict) -> list[Befund]:
    """Die Befunde einer Innenszene (außen: keine)."""
    if szene.get("art") != "innen":
        return []
    krone = kronenfelder(raster(szene))
    gesetzt, _ = platziere(szene, katalog)
    felder = {
        o.get("id", f"{o['moebel']}@{i}"): o.get("feld") for i, o in enumerate(szene.get("objekte", []))
    }
    befunde = []
    for stueck in gesetzt:
        angabe = katalog[stueck["name"]]
        pixel = ragt_hinein(stueck, angabe, rahmen_von(stueck["name"], angabe, rahmen), krone)
        if pixel >= MIN_PIXEL and not ausgenommen(name, stueck["name"]):
            befunde.append(Befund(name, stueck["name"], felder.get(stueck["id"]), pixel))
    return befunde


def pruefe() -> list[Befund]:
    """Alle Befunde über alle Szenen."""
    katalog, rahmen = lade_moebel(), lade_rahmen()
    befunde: list[Befund] = []
    for pfad in sorted(SZENEN.glob("*.json")):
        befunde += pruefe_szene(pfad.stem, json.loads(pfad.read_text(encoding="utf-8")), katalog, rahmen)
    return befunde


def main() -> int:
    """Befunde drucken (``--alle``: ohne Kürzung)."""
    teile = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teile.add_argument("--alle", action="store_true", help="alle Befunde drucken")
    args = teile.parse_args()
    befunde = pruefe()
    for b in befunde if args.alle else befunde[:40]:
        print(b.text())
    print(f"{len(befunde)} Befunde")
    return 0


if __name__ == "__main__":
    sys.exit(main())
