"""Befehl: Wirken die Felskanten aller Karten wie Gelände? (Kartenblick M02, 24.11.2026)

Warum: Der Autor ließ alle Karten mit Menschenaugen prüfen. Zu den Höhen hieß es: schnurgerade
Streifen quer durch die Karte, Bänder enden frei, sodass man um den „Berg“ herumgehen kann, der
Deckstreifen wechselt mitten in der Wand, neben Treppen passen die Kacheln nicht. Der Zeichner
(``klippe``, ``klippenbild``) kann vieles davon selbst; was am Raster der Szene liegt, findet diese
Prüfung.

Geprüft wird je Szene mit ``"kante": "klippe"``, Band für Band (``klippenrolle.baender``):
- „gerade“: Der Wandfuß läuft über mehr als ``GERADE_HOECHSTENS`` Felder in einer Reihe, ohne Vor-
  oder Rücksprung. Abhilfe in der Szene: alle 3 bis 6 Felder um eine Reihe versetzen. Gebaute
  Höhen (Böschung eines Deichs, Stützmauer) dürfen gerade sein und zählen hier nicht.
- „ende“: Ein Band endet frei im Gelände, statt am Kartenrand, an einem anderen Band oder mit
  Seitenkante (Regel 10.74, ``hoehen.hoehenhinweise``).
- „deckstreifen“: Gras und Erde wechseln innerhalb eines Bands.
- „treppe“: Links und rechts einer Treppe steht die Wand in verschiedenen Reihen; die Randkacheln
  passen dann nicht zu den Tritten.

Ausnahmen mit Grund stehen in ``OFFEN``: Die Vor- und Rücksprünge kommen erst in Welle 2 in die
Szenen (Regionspakete AP5 bis AP8); bis dahin ist das die offene Liste je Paket. Der Dauertest
(pipeline/tests) verlangt „0 Befunde“ außerhalb der Liste und meldet Einträge, die erledigt sind.

Ablauf (im Hauptordner): python -m pipeline.abenteuer.klippenband [--alle] [--muster MUSTER]
"""

import argparse
import json
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer.bodenraster import randnachbar
from pipeline.abenteuer.hoehen import hoehenhinweise, schleusenfelder
from pipeline.abenteuer.kartenbau import INHALTE, platziere, raster
from pipeline.abenteuer.klippe import (
    SPALTEN,
    grasboden,
    klippenart,
    klippenfeld,
    strassenzeichen,
    treppenfelder,
)
from pipeline.abenteuer.klippenrolle import BREITE_RAMPE, HOEHE_STANDARD, Stapel, baender, rolle
from pipeline.abenteuer.moebelliste import lade_moebel

# Länger darf ein Wandfuß nicht in einer Reihe laufen (Abnahme AP3 im Kartenblick).
GERADE_HOECHSTENS = 20
# (Szene, Art) → Regionspaket der Welle 2 und was dort zu tun ist. Alle Einträge liegen am Raster der
# Szene, das Welle 1 nicht anfasst (Stand 24.11.2026, erzeugt aus den Funden dieses Werkzeugs).
OFFEN: dict[tuple[str, str], str] = {
    ("weg-delacroix-desert-canyonpfad", "gerade"): "AP7 Wegkarten: Vor- und Rücksprünge alle 3 bis 6 Felder",
    ("weg-delacroix-desert-felsbogen", "gerade"): "AP7 Wegkarten: Vor- und Rücksprünge alle 3 bis 6 Felder",
    (
        "weg-delacroix-desert-felsbogen",
        "ende",
    ): "AP7 Wegkarten: Band nach der Verbreiterung der Schlucht an Rand oder Seitenkante anschließen",
    ("weg-desert-summit-bergstrasse", "gerade"): "AP7 Wegkarten: Vor- und Rücksprünge alle 3 bis 6 Felder",
    ("weg-desert-summit-diner", "gerade"): "AP7 Wegkarten: Vor- und Rücksprünge alle 3 bis 6 Felder",
    ("weg-desert-summit-diner-neon", "gerade"): "AP7 Wegkarten: Vor- und Rücksprünge alle 3 bis 6 Felder",
    ("weg-maple-cedar-zedernpfad", "gerade"): "AP7 Wegkarten: Vor- und Rücksprünge alle 3 bis 6 Felder",
    ("weg-pinewood-ghost-canyonrand", "gerade"): "AP7 Wegkarten: Vor- und Rücksprünge alle 3 bis 6 Felder",
    ("weg-riverton-ironwood-2", "gerade"): "AP7 Wegkarten: Vor- und Rücksprünge alle 3 bis 6 Felder",
    (
        "weg-riverton-ironwood-2-ohne-tische",
        "gerade",
    ): "AP7 Wegkarten: Vor- und Rücksprünge alle 3 bis 6 Felder",
}


@dataclass(frozen=True)
class Befund:
    """Ein Fund: Szene (Dateiname ohne Endung), Art („gerade“, „ende“, „deckstreifen“, „treppe“), Text."""

    szene: str
    art: str
    stelle: str

    def text(self) -> str:
        """Eine Zeile für die Ausgabe."""
        return f"{self.szene} [{self.art}]: {self.stelle}"


def gerade_stuecke(band: tuple[Stapel, ...]) -> list[tuple[int, int, int]]:
    """Zu lange gerade Stücke eines Bands als (erste Spalte, letzte Spalte, Reihe des Wandfußes).

    Beispiel: Band am Nordrand von Summit City, 80 Felder in Reihe 5 → ``[(0, 79, 5)]``.
    Sonderfall: Spalten mit zwei Stapeln desselben Bands (Überhang) zählen mit dem ersten.
    """
    stuecke, anfang, letzter = [], None, None
    for s in [*band, None]:
        folgt = s is not None and letzter is not None and s.x == letzter.x + 1 and s.unten == letzter.unten
        if not folgt:
            if anfang is not None and letzter.x - anfang.x + 1 > GERADE_HOECHSTENS:
                stuecke.append((anfang.x, letzter.x, anfang.unten))
            anfang = s
        letzter = s
    return stuecke


def sichtbar(szene: dict, zeilen: list[str], band: tuple[Stapel, ...]) -> tuple[Stapel, ...]:
    """Die Stapel des Bands, die als Fels gezeichnet werden.

    Draußen zeigen Randwände neben Boden den Boden (Regel 10.2, ``kartenbild.hintergrund``); solche
    Stapel sind nur Kollision. Beispiel: Zedernpfad, Reihe 0 über 240 Felder → kein Band.
    """
    if not szene.get("wandart"):
        return band
    return tuple(
        s for s in band if any(randnachbar(zeilen, s.x, y) is None for y in range(s.oben, s.unten + 1))
    )


def _deckstreifen(zeilen: list[str], band: tuple[Stapel, ...], gras: set[str], hoehe: int) -> set[str]:
    """Die Deckstreifen („gras“, „erde“), die ``klippenfeld`` für die Kantenfelder des Bands wählt."""
    arten = set()
    for s in band:
        feld = klippenfeld(zeilen, s.x, s.oben, gras, hoehe)
        if feld is not None:
            arten.add("gras" if feld[0] in SPALTEN["gras"] else "erde")
    return arten


def _treppenbefunde(zeilen: list[str], strasse: set[str]) -> list[str]:
    """Treppen, neben denen die Wand links und rechts in verschiedenen Reihen steht (eine je Reihe)."""

    def naechste(x: int, y: int, dx: int) -> str | None:
        return next((r for d in range(1, BREITE_RAMPE + 1) if (r := rolle(zeilen, x + dx * d, y))), None)

    funde: dict[int, str] = {}
    for x, y, _ in treppenfelder(zeilen, strasse):
        links, rechts = naechste(x, y, -1), naechste(x, y, 1)
        if links != rechts and y not in funde:
            funde[y] = f"Treppe bei ({x}, {y}): links „{links}“, rechts „{rechts}“"
    return list(funde.values())


def pruefe_szene(name: str, szene: dict, moebel: dict) -> list[Befund]:
    """Alle Befunde einer Szene.

    Eingaben: Dateiname ohne Endung, Szene, Möbelkatalog (für Schleusentore an Wandenden).
    Ausgabe: Befunde; leer für Szenen ohne ``"kante": "klippe"``.
    Beispiel: Nordwand von Summit City → „gerade“ über 80 Felder.
    """
    if szene.get("kante") != "klippe":
        return []
    zeilen, gras = raster(szene), grasboden(szene)
    hoehe = int(szene.get("klippenhoehe", HOEHE_STANDARD))
    befunde = []
    gewachsen = klippenart(szene) == "fels"  # Deich und Mauer sind gebaut und dürfen gerade sein
    for band in (sichtbar(szene, zeilen, b) for b in baender(tuple(zeilen), hoehe)):
        for von, bis, reihe in gerade_stuecke(band) if gewachsen else []:
            stelle = f"Wandfuß gerade über {bis - von + 1} Felder (Spalten {von}–{bis}, Reihe {reihe})"
            befunde.append(Befund(name, "gerade", stelle))
        if band and len(_deckstreifen(zeilen, band, gras, hoehe)) > 1:
            stelle = f"Gras und Erde wechseln im Band ab Spalte {band[0].x}"
            befunde.append(Befund(name, "deckstreifen", stelle))
    gesetzt, _ = platziere(szene, moebel)
    befunde += [Befund(name, "ende", h) for h in hoehenhinweise(szene, zeilen, schleusenfelder(gesetzt))]
    befunde += [Befund(name, "treppe", t) for t in _treppenbefunde(zeilen, strassenzeichen(szene))]
    return befunde


def szenen(muster: str = "*.json") -> list[Path]:
    """Die Szenendateien nach Muster (auch Fassungen wie -ohne-tische)."""
    return sorted((INHALTE / "szenen").glob(muster))


def alle_funde(muster: str = "*.json") -> list[Befund]:
    """Alle Funde der passenden Szenen, auch die in ``OFFEN`` vermerkten."""
    moebel = lade_moebel()
    return [b for p in szenen(muster) for b in pruefe_szene(p.stem, json.loads(p.read_text("utf-8")), moebel)]


def alle_befunde(muster: str = "*.json") -> list[Befund]:
    """Befunde aller passenden Szenen ohne die Ausnahmen aus ``OFFEN`` (Dauertest: leer)."""
    return [b for b in alle_funde(muster) if (b.szene, b.art) not in OFFEN]


def erledigte_ausnahmen() -> list[tuple[str, str]]:
    """Einträge in ``OFFEN``, zu denen es keinen Fund mehr gibt: bitte streichen."""
    vorhanden = {(b.szene, b.art) for b in alle_funde()}
    return sorted(set(OFFEN) - vorhanden)


def main() -> None:
    """Prüft und druckt; ``--alle`` zeigt auch die offene Liste. Aufruf im Dateikopf."""
    teiler = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teiler.add_argument("--alle", action="store_true", help="auch die Ausnahmen aus OFFEN zeigen")
    teiler.add_argument("--muster", default="*.json")
    a = teiler.parse_args()
    funde = alle_funde(a.muster)
    befunde = [b for b in funde if (b.szene, b.art) not in OFFEN]
    for b in funde if a.alle else befunde:
        offen = OFFEN.get((b.szene, b.art))
        print(f"  {b.text()}" + (f"  (offen: {offen})" if offen else ""))
    print(f"{len(befunde)} Befunde, {len(funde) - len(befunde)} in der offenen Liste")


if __name__ == "__main__":
    main()
