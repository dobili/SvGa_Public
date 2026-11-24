"""Uferart: Welchen Rand bekommt das Wasser an welchem Nachbarboden? (ohne Pillow) Dazu die Prüfung.

Warum: Das Ufer war je Karte genau eine Art (Szene „ufer“, sonst Grasrand). Zwischen Sandstrand,
Watt, Schotter oder Holzsteg und dem Wasser lag deshalb immer ein grüner Grasstreifen, Stege trugen
grüne Kappen (Kartenblick 24.11.2026, Muster M03: 27 Karten, 69 Funde). Jetzt entscheidet der
Nachbarboden jedes einzelnen Felds:

- Holz (Steg, Brücke, Dielen): kein Rand, das Wasser läuft darunter weiter („ohne“).
- Stein, Pflaster, Platten, Asphalt: Kaimauer aus dem Bogen ``wasser_stein`` („stein“).
- Sand, Strand, Watt, Schotter, Fels, Sumpfboden: Der Boden selbst reicht ans Wasser, mit feuchtem
  Saum und Schaumlinie („boden“).
- Gras, Hecke und Erdwege: Ufer mit Erdkante („gras“); ein Erdweg endet am Wasser als Erdkante,
  eine Schaumlinie wie am Strand sähe dort falsch aus.

Regel: KARTENREGELN 10.6 (Ufer), 10.1.6 (Wasserloch im Steinbruch: Stein statt Rasenkranz).

Szenen mit einem gebauten oder eigens gemalten Ufer behalten es für die ganze Karte
(``EIGENES_UFER`` mit Grund): Dort ist die Mauer oder der Fels die Aussage der Karte.

Rolle im Gesamtbild: ``kartenbild.hintergrund`` fragt je Wasserfeld ``uferbogen`` (welcher
Kachelbogen) und ``weichrand.py`` ``weich`` (ob das Feld statt Kacheln den geglätteten Rand
bekommt). ``befunde`` ist die Dauerprüfung (pipeline/tests): „0 Befunde“.

Ablauf (im Hauptordner): python -m pipeline.abenteuer.uferart [--alle] [--muster MUSTER]
"""

import argparse
from pathlib import Path

from pipeline.abenteuer.bodenraster import HOLZ_BOEDEN, bodenfeld, brueckenzeichen, randergaenzt
from pipeline.abenteuer.kartenbau import INHALTE, LEER, WAND, WASSER, lade, raster
from pipeline.abenteuer.randspur import hat_rand

# Befestigte Böden: Das Wasser bekommt an ihnen eine Kaimauer.
STEINBODEN = frozenset(
    {"stein", "pflaster", "pflasterWeich", "pflasterNass", "platten", "asphalt", "landstrasse"}
    | {"asphaltMitte", "asphaltMitteSenkrecht"}
)
# Lose Böden: Sie reichen selbst bis ans Wasser (nasser Saum statt Grasrand).
LOSER_BODEN = frozenset(
    {"sand", "sandplatz", "strand", "sandRot", "sandRotRand", "schotter", "felsboden"}
    | {"felsbodenRot", "felsbodenRotDunkel", "sinter", "sumpfboden", "nadelstreu", "wasser_watt"}
)
# Szene „ufer“ → Grund, warum die ganze Karte dieses Ufer aus Kacheln behält.
EIGENES_UFER = {
    "stein": "Kaimauer und Kanal: gebaute, gerade Ufer (Hafen, Schleuse, Treidelpfad); von Gutachtern gelobt",
    "rumpf": "Schiffsrumpf der Fähre: Das „Ufer“ ist die Bordwand",
    "rot": "roter Fels im Canyon: eigener Bogen mit Schrägkacheln",
    "sinter": "Sinterterrassen am Geysir: eigener Bogen, der Rand ist der Sinter selbst",
}
RICHTUNGEN = ((0, -1), (1, 0), (0, 1), (-1, 0))
DIAGONALEN = ((1, 1), (-1, 1), (1, -1), (-1, -1))
# (Szene, Feld) → Grund für ein Wasserfeld, das die Prüfung melden würde.
GEPRUEFT: dict[tuple[str, tuple[int, int]], str] = {}

Feld = tuple[int, int]


def uferart(szenenufer: str | None, nachbar: str | None) -> str:
    """Die Uferart eines Wasserfelds zu einem Nachbarboden.

    Eingaben: ``szenenufer`` (Szene „ufer“ oder None), ``nachbar`` (Bodenart des Nachbarfelds;
    None für Fels, Wand oder Leere). Ausgabe: „ohne“, „stein“, „boden“, „gras“ oder der Name eines
    eigenen Ufers aus ``EIGENES_UFER``.
    Beispiel: Seeufer (kein „ufer“), Nachbar „strand“ → „boden“; Nachbar „holzDunkel“ → „ohne“;
    Hafen Port Delacroix („ufer“: „stein“), Nachbar „gras“ → „stein“.
    Sonderfälle: Holz geht jedem Ufer vor, auch der Kaimauer. Szenen mit „strand“, „moor“ oder
    einer anderen Wasserfarbe richten sich wie Szenen ohne „ufer“ nach dem Nachbarn: Der Eintrag
    bestimmt dort nur noch die Farbe des Wassers.
    """
    if nachbar in HOLZ_BOEDEN:
        return "ohne"
    if szenenufer in EIGENES_UFER:
        return szenenufer
    if nachbar in STEINBODEN:
        return "stein"
    if nachbar in LOSER_BODEN:
        return "boden"
    return "gras"


def gezeichnetes_raster(szene: dict) -> list[str]:
    """Das Raster, wie der Hintergrund es sieht: Brückenfelder sind Wasser, Randwände draußen
    zeigen das Feld dahinter (``bodenraster.randergaenzt``)."""
    bruecken = set(szene.get("bruecken", []))
    zeilen = ["".join(WASSER if z in bruecken else z for z in zeile) for zeile in raster(szene)]
    return randergaenzt(zeilen, "wandart" in szene)


def bodenart(szene: dict, zeilen: list[str], x: int, y: int) -> str | None:
    """Die Bodenart des Felds (x, y) oder None (außerhalb, Leere, Wand ohne ``wandart``).

    Beispiel: Seeufer, „s“ = „strand“ → „strand“; „#“ mit ``wandart`` „hecke“ → „hecke“.
    """
    if not (0 <= y < len(zeilen) and 0 <= x < len(zeilen[0])):
        return None
    zeichen = zeilen[y][x]
    if zeichen == LEER:
        return None
    if zeichen == WAND:
        return szene.get("wandart")
    if zeichen == WASSER:
        return "wasser"
    return szene.get("boeden", {}).get(zeichen, szene.get("boden", "gras"))


def nachbarufer(szene: dict, zeilen: list[str], x: int, y: int) -> dict[Feld, str]:
    """Für das Wasserfeld (x, y): Richtung → Uferart zu jedem Landnachbarn (auch über Eck).

    Beispiel: Wasser mit Strand oben und Steg rechts → {(0, −1): „boden“, (1, 0): „ohne“}.
    Sonderfall: Nachbarn außerhalb der Karte fehlen (der See läuft aus dem Bild).
    """
    arten = {}
    for dx, dy in RICHTUNGEN + DIAGONALEN:
        nx, ny = x + dx, y + dy
        if not (0 <= ny < len(zeilen) and 0 <= nx < len(zeilen[0])) or zeilen[ny][nx] == WASSER:
            continue
        arten[(dx, dy)] = uferart(szene.get("ufer"), bodenart(szene, zeilen, nx, ny))
    return arten


def weich(szene: dict, zeilen: list[str], x: int, y: int) -> bool:
    """Ob das Wasserfeld (x, y) den geglätteten Rand bekommt (weichrand.py) statt Uferkacheln.

    Weich sind Felder, deren Ufer an allen vier Seiten Gras, loser Boden oder Holz ist. Kaimauern
    und eigene Ufer bleiben Kacheln: Eine Mauer ist gerade. Pflaster nur über Eck macht ein Feld
    nicht hart, sonst stünden an jedem Brückenkopf einzelne Mauerstücke im Grasufer.
    Beispiel: Bach im Zedernwald → True; Kanal in Ironwood („ufer“: „stein“) → False.
    """
    arten = nachbarufer(szene, zeilen, x, y)
    eigen = szene.get("ufer") in EIGENES_UFER and any(art != "ohne" for art in arten.values())
    return not eigen and all(arten.get(r, "ohne") in ("gras", "boden", "ohne") for r in RICHTUNGEN)


def uferbogen(szene: dict, zeilen: list[str], x: int, y: int) -> str:
    """Die Bodenart (materialien.json), aus deren Bogen das Wasserfeld (x, y) gezeichnet wird.

    Beispiel: Port Delacroix → „wasser_stein“; Bayou („ufer“: „moor“) → „wasser_moor“ (dunkles
    Wasser; den Rand malt dort ``weichrand``); Teich im Park neben Pflaster → „wasser_stein“.
    """
    arten = nachbarufer(szene, zeilen, x, y)
    if "stein" in {arten.get(r) for r in RICHTUNGEN} and szene.get("ufer") not in EIGENES_UFER:
        return "wasser_stein"
    return f"wasser_{szene['ufer']}" if szene.get("ufer") else "wasser"


def _kachelluecken(szene: dict, zeilen: list[str], x: int, y: int) -> list[str]:
    """Seiten eines Kachel-Wasserfelds, an denen Land liegt, die Kachel aber keinen Rand zeigt.

    Die Kacheln von LimeZu kennen kein Stück mit Rand auf zwei gegenüberliegenden Seiten: Ein eine
    Kachel breiter Kanal bleibt ohne Rand. Über Eck fehlt nichts mehr: Dort legt der Zeichner das
    Viertel der Innenecke dazu (``bodenraster.eckzusaetze``).
    """
    holz = brueckenzeichen(szene)
    versatz = tuple(bodenfeld({"rand": [0, 0]}, zeilen, x, y, holz))
    arten = nachbarufer(szene, zeilen, x, y)
    return [str(r) for r in RICHTUNGEN if arten.get(r, "ohne") != "ohne" and not hat_rand(versatz, *r)]


def befunde(name: str, szene: dict) -> list[str]:
    """Befunde einer Szene: Grasrand am falschen Boden, Landnachbar ohne Randkachel.

    Eingaben: Name der Szenendatei (ohne Endung), Szene. Ausgabe: Texte, leer wenn alles stimmt.
    Beispiel: Ein Wasserfeld, das wegen einer Felswand Kacheln aus dem Grasbogen bekommt und
    zugleich an Sand grenzt → „…: Grasrand neben sand“.
    Sonderfälle: Nur Außenkarten; weiche Felder haben ihren Rand vom geglätteten Umriss, bei ihnen
    kann kein Rand fehlen. Ausnahmen stehen mit Grund in ``GEPRUEFT``.
    """
    if szene.get("art") != "aussen":
        return []
    zeilen, meldungen = gezeichnetes_raster(szene), []
    for y, zeile in enumerate(zeilen):
        for x, zeichen in enumerate(zeile):
            if zeichen != WASSER or weich(szene, zeilen, x, y) or (name, (x, y)) in GEPRUEFT:
                continue
            if uferbogen(szene, zeilen, x, y) == "wasser":
                falsch = sorted(
                    {
                        str(bodenart(szene, zeilen, x + dx, y + dy))
                        for (dx, dy), art in nachbarufer(szene, zeilen, x, y).items()
                        if art in ("boden", "stein")
                    }
                )
                if falsch:
                    meldungen.append(f"{name} ({x}, {y}): Grasrand neben {', '.join(falsch)}")
            if fehlt := _kachelluecken(szene, zeilen, x, y):
                meldungen.append(f"{name} ({x}, {y}): Landnachbar ohne Randkachel nach {', '.join(fehlt)}")
    return meldungen


def alle_befunde(muster: str = "*.json") -> list[str]:
    """Die Befunde aller Szenen, deren Dateiname auf ``muster`` passt (jede Fassung für sich)."""
    meldungen = []
    for pfad in sorted((INHALTE / "szenen").glob(muster)):
        meldungen += befunde(pfad.stem, lade(pfad))
    return meldungen


def uebersicht(muster: str = "*.json") -> dict[str, int]:
    """Wie viele Uferkanten es je Uferart gibt (für die Ausgabe mit ``--alle``)."""
    zahl: dict[str, int] = {}
    for pfad in sorted((INHALTE / "szenen").glob(muster)):
        szene = lade(pfad)
        if szene.get("art") != "aussen":
            continue
        zeilen = gezeichnetes_raster(szene)
        for y, zeile in enumerate(zeilen):
            for x, zeichen in enumerate(zeile):
                if zeichen == WASSER:
                    for richtung, art in nachbarufer(szene, zeilen, x, y).items():
                        if richtung in RICHTUNGEN:
                            zahl[art] = zahl.get(art, 0) + 1
    return zahl


def main() -> None:
    eingabe = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    eingabe.add_argument("--alle", action="store_true", help="auch die Zahl der Kanten je Uferart nennen")
    eingabe.add_argument("--muster", default="*.json", help="Dateimuster der Szenen")
    wahl = eingabe.parse_args()
    meldungen = alle_befunde(wahl.muster)
    for meldung in meldungen:
        print(f"- {meldung}")
    if wahl.alle:
        for art, zahl in sorted(uebersicht(wahl.muster).items()):
            print(f"Uferart {art}: {zahl} Kanten")
        for ufer, grund in sorted(EIGENES_UFER.items()):
            print(f"Eigenes Ufer „{ufer}“ bleibt Kachelufer: {grund}")
    print(f"{len(meldungen)} Befunde in {len(list(Path(INHALTE / 'szenen').glob(wahl.muster)))} Szenen")


if __name__ == "__main__":
    main()
