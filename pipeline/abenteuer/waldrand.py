"""Waldrand: Rasen, der ins Leere läuft, und Felder am Bildrand (AP8a, Gutachten des Autors, 24.11.2026).

Warum: Die Gutachter sahen Außenkarten, deren Rasen über lange Strecken bis an den Bildrand läuft. Am
Rand hört die Welt dann sichtbar auf, statt hinter Bäumen, Hecken, Feldern oder Wasser zu
verschwinden (KARTENREGELN 6.3: Ränder schließen mit Wald, Hecke, Feld oder Wasser ab). Felder
reichen bis an den Rand, dann wirken sie größer (KARTENREGELN 6.3; Gutachten Kürbishof K2: „Felder
reichen nicht bis zum Rand“). Ein Feld, das knapp davor aufhört, wirkt wie ein Beet.

Regeln (nur Außenkarten mit Grasboden):
- Rasenstrecke: Entlang jeder der vier Kanten zählt eine Stelle als offen, wenn in den äußersten
  ``TIEFE`` Feldern quer zur Kante nur Rasen liegt (Grundboden „.“ oder ein Boden der Art „gras“)
  und kein Baum, Busch, keine Hecke, kein Feld und kein Wasser darauf steht. Mehr als ``HOECHSTENS``
  offene Stellen hintereinander sind ein Befund.
- Feldrand: Ein Feld (Art ``feldfrucht`` oder Acker-Boden) endet 1 bis ``FELD_LUECKE`` Felder vor
  einem Bildrand, statt bis an ihn zu reichen. Weiter innen endende Felder zählen nicht.
Aufruf: ``python -m pipeline.abenteuer.waldrand [--alle]``. Dauertest mit Obergrenze in
``pipeline/tests/test_abenteuer_querschnitt.py`` (Ziel 0). Ausnahmen mit Grund in ``AUSNAHMEN``.
"""

import argparse
import json
import sys
from pathlib import Path

from pipeline.abenteuer.bodenraster import randnachbar
from pipeline.abenteuer.kartenbau import LEER, WAND, platziere, raster
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.zusammenhang_enden import _teile, felder_von

SZENEN = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer" / "szenen"
HOECHSTENS = 10  # so viele offene Randfelder hintereinander sind noch in Ordnung
TIEFE = 2  # so tief vom Rand aus muss ein Abschluss stehen
FELD_LUECKE = 2  # so knapp vor dem Rand endet ein Feld nicht (es reicht dann bis an den Rand)
ABSCHLUSS = {"baum", "busch", "hecke", "feldfrucht", "wasser", "pflanze"}
# (Szenenanfang, Kante) → Grund.
AUSNAHMEN: dict[tuple[str, str], str] = {
    ("summit-city-aussen", "Rand Nord"): "Gipfelwand: grauer Fels bis zum Bildrand, kein Rasen",
    ("summit-city-aussen", "Rand West ab (0, 0)"): "Nordwestecke: Seitenkante, Fels statt Rasen",
    ("ironwood-aussen", "Rand Süd bei (52, 55)"): "Kohl im kleinen Gartenbeet, kein Acker",
    ("ironwood-aussen", "Rand Süd bei (56, 55)"): "Kohl im kleinen Gartenbeet, kein Acker",
}

Feld = tuple[int, int]


def _ist_feld(name: str, angabe: dict) -> bool:
    return angabe.get("art") == "feldfrucht" or "Acker" in name


def _rasen(szene: dict, zeilen: list[str]) -> set[Feld]:
    """Felder, die als Rasen gezeichnet werden (wie kartenbild.py, ohne es zu ändern).

    Grundboden Gras („.“) oder ein Boden der Art Gras. „#“ zeigt draußen den Boden aus ``wandart``;
    am Kartenrand neben einem Weg den Weg dahinter (bodenraster.randnachbar). Beispiel: Landstraße
    mit ``wandart`` gras → die Randreihe „#“ ist Rasen, außer wo die Straße hinausführt.
    """
    gras = {z for z, art in szene.get("boeden", {}).items() if art == "gras"}
    if szene.get("boden") == "gras":
        gras.add(LEER)
    wand_ist_gras = szene.get("wandart") == "gras"
    rasen = set()
    for y, zeile in enumerate(zeilen):
        for x, c in enumerate(zeile):
            if c != WAND:
                if c in gras:
                    rasen.add((x, y))
            elif (innen := randnachbar(zeilen, x, y)) is not None:
                if zeilen[innen[1]][innen[0]] in gras:
                    rasen.add((x, y))
            elif wand_ist_gras:
                rasen.add((x, y))
    return rasen


def _kanten(breite: int, hoehe: int):
    """Je Kante ihr Name und die Stellen, jede mit den Feldern bis TIEFE nach innen."""
    yield "Nord", [[(x, y) for y in range(TIEFE)] for x in range(breite)]
    yield "Süd", [[(x, hoehe - 1 - y) for y in range(TIEFE)] for x in range(breite)]
    yield "West", [[(x, y) for x in range(TIEFE)] for y in range(hoehe)]
    yield "Ost", [[(breite - 1 - x, y) for x in range(TIEFE)] for y in range(hoehe)]


def offene_strecken(rasen: set[Feld], bedeckt: set[Feld], breite: int, hoehe: int) -> list[str]:
    """Rasenstrecken über HOECHSTENS Felder an den Kanten, als Text mit Kante und Anfang."""
    befunde = []
    for kante, stellen in _kanten(breite, hoehe):
        lauf: list[Feld] = []
        for tiefe in stellen + [[]]:  # leere Stelle am Ende schließt den letzten Lauf ab
            if tiefe and all(f in rasen and f not in bedeckt for f in tiefe):
                lauf.append(tiefe[0])
                continue
            if len(lauf) > HOECHSTENS:
                befunde.append(f"Rasen {len(lauf)} Felder offen am Rand {kante} ab {lauf[0]}")
            lauf = []
    return befunde


def feldluecken(feld: set[Feld], breite: int, hoehe: int) -> list[str]:
    """Kanten, vor denen das Feld 1 bis ``FELD_LUECKE`` Felder zu früh endet.

    Beispiel: Maisfeld bis Spalte 47 auf einer Karte mit 50 Spalten → „endet 2 Felder vor dem Rand
    Ost“. Ein Feld weit im Inneren (Abstand über ``FELD_LUECKE``) ist kein Befund.
    """
    xs, ys = [x for x, _ in feld], [y for _, y in feld]
    abstaende = {
        "West": min(xs),
        "Ost": breite - 1 - max(xs),
        "Nord": min(ys),
        "Süd": hoehe - 1 - max(ys),
    }
    return [
        f"Feld endet {d} Felder vor dem Rand {kante} bei {min(feld)} (soll bis an den Rand reichen)"
        for kante, d in abstaende.items()
        if 1 <= d <= FELD_LUECKE
    ]


def pruefe_szene(name: str, szene: dict, katalog: dict) -> list[str]:
    """Befunde einer Außenkarte mit Grasboden (andere Karten: keine)."""
    if szene.get("art") != "aussen":
        return []
    zeilen = raster(szene)
    hoehe, breite = len(zeilen), len(zeilen[0])
    gesetzt, _ = platziere(szene, katalog)
    bedeckt: set[Feld] = set()
    feldstuecke: set[Feld] = set()
    for stueck in gesetzt:
        angabe = katalog[stueck["name"]]
        if angabe.get("art") in ABSCHLUSS or "Acker" in stueck["name"]:
            bedeckt |= felder_von(stueck)
        if _ist_feld(stueck["name"], angabe):
            feldstuecke |= felder_von(stueck)
    befunde = offene_strecken(_rasen(szene, zeilen), bedeckt, breite, hoehe)
    for feld in _teile(feldstuecke):
        befunde += feldluecken(feld, breite, hoehe)
    return [b for b in befunde if not any(name.startswith(s) and k in b for s, k in AUSNAHMEN)]


def pruefe() -> list[str]:
    """Alle Befunde über alle Szenen, je Zeile „Szene: Befund“."""
    katalog, befunde = lade_moebel(), []
    for pfad in sorted(SZENEN.glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        befunde += [f"{pfad.stem}: {b}" for b in pruefe_szene(pfad.stem, szene, katalog)]
    return befunde


def main() -> int:
    """Befunde drucken (``--alle``: ohne Kürzung)."""
    teile = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teile.add_argument("--alle", action="store_true", help="alle Befunde drucken")
    befunde = pruefe()
    for b in befunde if teile.parse_args().alle else befunde[:40]:
        print(b)
    print(f"{len(befunde)} Befunde")
    return 0


if __name__ == "__main__":
    sys.exit(main())
