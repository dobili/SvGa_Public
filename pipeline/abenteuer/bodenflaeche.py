"""Prüfung Bodenfläche: Kein Boden zeigt das Kachelraster (Kartenblick M01, Welle 1, AP1).

Warum: Der Autor ließ alle Karten aus menschlicher Sicht prüfen (24.11.2026). Häufigster Fund:
Holzdielen als Kästchen, Büschel und Steinchen in Reih und Glied, Erde und Sand als glatte
Farbfläche. Die Bodenvariation (bodenvariation.py) behebt das; diese Prüfung hält es fest.

Gemessen wird am gezeichneten Hintergrund (wie ihn das Spiel bekommt, ohne Winterschleier):
- „gleiche Fläche“: zusammenhängende Fläche von mehr als ``GLEICHE_FELDER`` Feldern eines Bodens,
  in der jedes Feld pixelgleich ist.
- „Stoßfugen übereinander“: Holzboden, dessen Stoßfugen in ``STAPEL`` Brettreihen genau
  übereinander liegen (das Kästchenmuster der Dielen).
Ausnahmen stehen mit Grund in ``AUSNAHMEN`` (Boden) und ``GEPRUEFT`` (Karte und Boden).

Aufruf: ``python -m pipeline.abenteuer.bodenflaeche [--privat PRIVAT] [--alle] [SZENE …]``
(``SZENE`` ist ein Dateiname aus inhalte/abenteuer/szenen ohne Endung; ohne Angabe alle Szenen;
``--alle`` nennt auch die Szenen ohne Befund; das Paket kommt sonst aus ``SVGA_PRIVAT``).
Braucht Pillow und das private Bildpaket; der Dauertest verlangt „0 Befunde“.
"""

import argparse
import functools
import os
import sys
from dataclasses import dataclass
from pathlib import Path
from unittest import mock

from PIL import Image

from pipeline.abenteuer import kartenbild
from pipeline.abenteuer.bodenraster import randergaenzt
from pipeline.abenteuer.bodenvariation import lade_kachel, variiere
from pipeline.abenteuer.bretterverband import gemessene_stoesse, gestapelt
from pipeline.abenteuer.kartenbau import INHALTE, K, lade, raster
from pipeline.abenteuer.strasse import markiere

# Größer darf eine Fläche aus lauter pixelgleichen Feldern nicht sein (Arbeitspaket AP1).
GLEICHE_FELDER = 24
# So viele Stoßfugen genau übereinander sind das Kästchenmuster.
STAPEL = 3
UMGEBUNG = "SVGA_PRIVAT"

# Böden, die diese Prüfung nicht misst, mit Grund.
AUSNAHMEN = {
    "wasser": "Wasser ist kein Boden: Farbe und Wellen der Gewässer gehören zu Muster M19",
}
# Einzelne Flächen (Karte, Boden), die so bleiben dürfen, mit Grund.
GEPRUEFT: dict[tuple[str, str], str] = {}

Feld = tuple[int, int]


@dataclass(frozen=True)
class Befund:
    """Ein Befund: Szene (Dateiname), Karte, Boden, Feld (Spalte, Reihe) und was dort ist."""

    szene: str
    karte: str
    boden: str
    feld: Feld
    was: str

    def text(self) -> str:
        """Eine Zeile für Bericht und Test."""
        return f"{self.szene}: {self.boden} bei {self.feld[0]},{self.feld[1]}: {self.was}"


def ausgenommen(boden: str) -> bool:
    """Ob der Boden nicht gemessen wird (``AUSNAHMEN``; Wasser auch mit Uferart, „wasser_stein“)."""
    return boden.split("_")[0] in AUSNAHMEN


def gleiche_flaechen(bild: Image.Image, gezeichnet: dict, mehr_als: int = GLEICHE_FELDER) -> list[tuple]:
    """Zusammenhängende Flächen pixelgleicher Felder eines Bodens, größer als ``mehr_als``.

    Warum: Eine solche Fläche ist entweder kariert (Kachel mit Zeichnung) oder leer (Kachel in
    einer Farbe). Eingaben: Hintergrund, ``gezeichnet`` (Feld → (Boden, Kachel)). Ausgabe:
    (Boden, Größe, oberstes linkes Feld) je Fläche. Beispiel: Jahrmarkt ohne Variation: Erde, 1400
    Felder ab 9,9. Sonderfall: Nachbarn zählen nur über die Kante, nicht über die Ecke.
    """
    inhalt = {
        ort: (name, bild.crop((ort[0] * K, ort[1] * K, (ort[0] + 1) * K, (ort[1] + 1) * K)).tobytes())
        for ort, (name, _) in gezeichnet.items()
        if not ausgenommen(name)
    }
    funde, offen = [], set(inhalt)
    while offen:
        start = offen.pop()
        flaeche, rand = [start], [start]
        while rand:
            x, y = rand.pop()
            for nachbar in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if nachbar in offen and inhalt[nachbar] == inhalt[start]:
                    offen.remove(nachbar)
                    flaeche.append(nachbar)
                    rand.append(nachbar)
        if len(flaeche) > mehr_als:
            funde.append((inhalt[start][0], len(flaeche), min(flaeche, key=lambda f: (f[1], f[0]))))
    return sorted(funde)


def stossbefunde(bild: Image.Image, gezeichnet: dict, boeden: dict) -> list[tuple]:
    """Holzböden mit Stoßfugen in ``STAPEL`` Reihen übereinander: (Boden, Zahl, erstes Feld).

    Eingaben wie ``gleiche_flaechen``, dazu die Böden aus materialien.json (Holz ist, was dort
    einen ``verband`` hat). Beispiel: Dielen ohne Verband: Fuge in jeder Reihe bei 15, 31, 47 …
    """
    funde = []
    for name in sorted({name for name, _ in gezeichnet.values()}):
        verband = boeden.get(name, {}).get("variation", {}).get("verband")
        if not verband:
            continue
        felder = {ort for ort, (art, _) in gezeichnet.items() if art == name}
        stapel = gestapelt(gemessene_stoesse(bild, felder, verband), STAPEL)
        if stapel:
            reihe, stelle = stapel[0]
            ort = (reihe * verband["brett"] // K, stelle // K)
            feld = ort if verband.get("richtung") == "laengs" else ort[::-1]
            funde.append((name, len(stapel), feld))
    return funde


@functools.cache
def _bogen(pfad: Path) -> Image.Image:
    """Ein Kachelbogen, nur einmal geladen."""
    return Image.open(pfad).convert("RGBA")


def _kachel(privat: Path, boegen: dict, angabe: dict, feld: list[int]) -> Image.Image:
    """Wie ``kartenbild.kachel``, aber mit Zwischenspeicher (sonst dauert der Lauf über alle
    Szenen eine halbe Stunde: Jede Kachel öffnete ihren Bogen neu)."""
    bogen = _bogen(privat / boegen[angabe["bogen"]])
    return bogen.crop((feld[0] * K, feld[1] * K, (feld[0] + 1) * K, (feld[1] + 1) * K))


def bodenbild(szene: dict, privat: Path, materialien: dict) -> tuple[Image.Image, dict]:
    """Der Hintergrund der Szene wie im Spiel (Böden, Variation, Säume, Linien) und seine Felder.

    Wie ``kartenbild.zeichne`` ohne Vorschau und ohne Winterschleier (der färbt nur um).
    """
    gezeichnet: dict = {}
    with mock.patch.object(kartenbild, "kachel", _kachel):
        grund = kartenbild.hintergrund(szene, privat, gezeichnet)
    grund = variiere(szene, grund, gezeichnet, materialien, lade_kachel(privat, materialien["boegen"]))
    markiere(grund, randergaenzt(raster(szene), "wandart" in szene), szene, gezeichnet, materialien["boeden"])
    return grund, gezeichnet


def pruefe_szene(name: str, szene: dict, privat: Path, materialien: dict) -> list[Befund]:
    """Die Befunde einer Szene (Dateiname ``name``), ohne die Ausnahmen in ``GEPRUEFT``."""
    bild, gezeichnet = bodenbild(szene, privat, materialien)
    funde = [
        (boden, feld, f"{groesse} gleiche Felder am Stück (höchstens {GLEICHE_FELDER})")
        for boden, groesse, feld in gleiche_flaechen(bild, gezeichnet)
    ] + [
        (boden, feld, f"Stoßfugen an {zahl} Stellen in {STAPEL} Reihen übereinander")
        for boden, zahl, feld in stossbefunde(bild, gezeichnet, materialien["boeden"])
    ]
    return [
        Befund(name, szene["karte"], boden, feld, was)
        for boden, feld, was in funde
        if (szene["karte"], boden) not in GEPRUEFT
    ]


def szenendateien(namen: list[str] | None = None) -> list[Path]:
    """Alle Szenen (auch Varianten), oder nur die genannten (Dateiname ohne Endung)."""
    alle = sorted((INHALTE / "szenen").glob("**/*.json"))
    return [p for p in alle if p.stem in namen] if namen else alle


def alle_befunde(privat: Path, namen: list[str] | None = None) -> dict[str, list[Befund]]:
    """Befunde je Szene (Dateiname → Liste, auch leere), für alle oder die genannten Szenen."""
    materialien = lade(INHALTE / "materialien.json")
    return {
        pfad.stem: pruefe_szene(pfad.stem, lade(pfad), privat, materialien) for pfad in szenendateien(namen)
    }


def main() -> None:
    """Prüft die Szenen und meldet die Befunde; Aufruf im Dateikopf."""
    teiler = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teiler.add_argument("szenen", nargs="*", help="Dateinamen ohne Endung (ohne Angabe: alle)")
    teiler.add_argument("--privat", type=Path, default=os.environ.get(UMGEBUNG), help="privates Paket")
    teiler.add_argument("--alle", action="store_true", help="auch Szenen ohne Befund nennen")
    a = teiler.parse_args()
    if not a.privat:
        sys.exit(f"Das private Paket fehlt: --privat PRIVAT oder {UMGEBUNG} setzen.")
    je_szene = alle_befunde(Path(a.privat), a.szenen)
    for name, befunde in je_szene.items():
        if a.alle and not befunde:
            print(f"{name}: in Ordnung")
        for befund in befunde:
            print(befund.text())
    print(f"{sum(map(len, je_szene.values()))} Befunde in {len(je_szene)} Szenen")


if __name__ == "__main__":
    main()
