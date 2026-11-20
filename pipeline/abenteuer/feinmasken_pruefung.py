"""Gegenprobe der feinen Katalogmasken: Öffnet eine feinere Maske etwas, das zu sein soll?

Warum: Feine Masken (``feinmasken.py``, KARTENREGELN 10.88) sperren nur noch die Standfläche. Weil sie
nur verfeinern, wird kein Weg enger; aber eine Lücke kann aufgehen, die vorher zu war: zwischen zwei
Baumstämmen am Waldrand, zwischen Theke und Wand, durch eine Zaunecke. Diese Prüfung vergleicht je
Szene, welche Kacheln der Held vorher und nachher erreicht (Raster von 4 Pixeln, Körper 12 Pixel wie
``engstelle.py``). Neu erreichbare Kacheln, die vorher frei, aber abgeschlossen waren, sind ein
Befund; neu erreichbare Kacheln unter einem Möbel (hinter einer Lehne) sind gewollt.
Für jeden Befund sucht sie die Möbel, deren grobe Maske die Öffnung wieder schließt.

Aufruf: ``python -m pipeline.abenteuer.feinmasken_pruefung [SZENE …]`` (ohne: alle Szenen).
"""

import sys
from pathlib import Path

from pipeline.abenteuer.engstelle import HELD, erreichte_kacheln
from pipeline.abenteuer.kollisionfein import kacheln_aus, kachelzellen, sperrzellen

Feld = tuple[int, int]
SZENEN = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer" / "szenen"


def ohne_fein(moebel: dict, namen: set[str] | None = None) -> dict:
    """Der Katalog ohne feine Masken (alle oder nur ``namen``)."""
    return {
        n: ({k: v for k, v in a.items() if k != "maske_fein"} if namen is None or n in namen else a)
        for n, a in moebel.items()
    }


def _erreicht(szene: dict, zeilen: list[str], moebel: dict, figuren: set) -> tuple[set[Feld], set]:
    """(erreichbare Kacheln, gesperrte Zellen) ab allen Auslösern der Szene."""
    from pipeline.abenteuer.kartenbau import platziere

    zellen = sperrzellen(zeilen, platziere(szene, moebel)[0], szene) | figuren
    start = {tuple(a["feld"]) for a in szene.get("ausloeser", [])}
    groesse = (len(zeilen[0]), len(zeilen))
    return erreichte_kacheln(zellen, groesse, HELD, start), zellen


def oeffnungen(szene: dict, moebel: dict, alt: dict | None = None) -> set[Feld]:
    """Kacheln, die mit den feinen Masken neu erreichbar sind, obwohl sie vorher frei waren.

    ``alt``: der Vergleichskatalog (Vorgabe: ohne alle feinen Masken).
    Beispiel: Zwei Bäume am Kartenrand, dahinter ein Streifen Wiese → die Wiese.
    """
    from pipeline.abenteuer.figurensperre import figurenfelder
    from pipeline.abenteuer.kartenbau import raster

    zeilen = raster(szene)
    figuren = {z for f in figurenfelder(szene) for z in kachelzellen(f)}
    neu, _ = _erreicht(szene, zeilen, moebel, figuren)
    vorher, zellen = _erreicht(szene, zeilen, ohne_fein(moebel) if alt is None else alt, figuren)
    return neu - vorher - kacheln_aus(zellen)


def schuldige(szene: dict, moebel: dict, offen: set[Feld]) -> list[str]:
    """Die Möbel mit feiner Maske in der Szene, deren grobe Maske die Öffnung verkleinert."""
    namen = {e["moebel"] for e in szene.get("objekte", []) if "maske_fein" in moebel.get(e["moebel"], {})}
    return sorted(n for n in namen if len(oeffnungen(szene, ohne_fein(moebel, {n}))) < len(offen))


def pruefe(pfade: list[Path]) -> dict[str, tuple[set[Feld], list[str]]]:
    """Szene → (Öffnungen, schuldige Möbel), nur Szenen mit Öffnungen."""
    from pipeline.abenteuer.kartenbau import lade
    from pipeline.abenteuer.moebelliste import lade_moebel

    moebel = lade_moebel()
    ergebnis = {}
    for pfad in pfade:
        szene = lade(pfad)
        if offen := oeffnungen(szene, moebel):
            ergebnis[pfad.name] = (offen, schuldige(szene, moebel, offen))
    return ergebnis


def main(argv: list[str]) -> int:
    """Befehlszeile; Aufruf und Zweck im Dateikopf."""
    pfade = [Path(a) for a in argv] or sorted(SZENEN.glob("*.json"))
    ergebnis = pruefe(pfade)
    for name, (offen, wer) in sorted(ergebnis.items()):
        beispiel = sorted(offen)[:6]
        print(f"{name}: {len(offen)} Kacheln neu offen, etwa {beispiel}; Möbel: {', '.join(wer) or '?'}")
    print(f"{len(ergebnis)} Szenen mit Öffnungen")
    return 1 if ergebnis else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
