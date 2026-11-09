"""Kartenbauer des Schach-Abenteuers: aus einer Szenenbeschreibung eine Tiled-Karte.

Warum: Von Hand gesetzte Karten wurden unlogisch (Wände als Blöcke, halbe Möbel, Dinge am Boden statt
auf dem Tisch; Rückmeldung des Autors, 9.11.2026). Der Kartenbauer kennt die Regeln einmal:
Wände aus Wandkrone und Wandfläche, Gegenstände „auf“ einem anderen oder „an der Wand“, nichts über
den Rand, keine Überlappung von Möbeln mit Kollision.

Eingabe: ``inhalte/abenteuer/szenen/<datei>.json`` (Format in ``inhalte/abenteuer/szenen/README.md``).
Ausgabe: die Tiled-Karte (``inhalte/abenteuer/karten/<datei>.json``) im Raster des Platzhalters
(Kollision), Möbel als Objekte; das Hintergrundbild zeichnet ``kartenbild.py`` aus der gekauften
Grafik. Aufruf: ``python -m pipeline.abenteuer.kartenbau inhalte/abenteuer/szenen/*.json``.
"""

import json
import sys
from pathlib import Path

from pipeline.abenteuer.kartenregeln import pruefe_regeln
from pipeline.abenteuer.moebelliste import lade_moebel

HAUPT = Path(__file__).resolve().parents[2]
INHALTE = HAUPT / "inhalte" / "abenteuer"
K = 16
WAND, WASSER, LEER = "#", "~", " "
GESPERRT = {WAND, WASSER, LEER}
# Gid im Raster des Platzhalters (Boden, Wand, Teppich) für Kollision und Ansicht ohne Grafik.
GID_BODEN, GID_WAND, GID_TEPPICH = 1, 2, 4
# Wörter in Dateinamen, die auf ein Bauteil statt eines ganzen Gegenstands deuten.
BAUTEIL = ("modular", "_left", "_right", "_top", "_bottom", "_part", "_half", "_layer")


def lade(pfad: Path) -> dict:
    return json.loads(pfad.read_text(encoding="utf-8"))


def raster(szene: dict) -> list[str]:
    zeilen = szene["raster"]
    breite = max(len(z) for z in zeilen)
    return [z.ljust(breite, LEER) for z in zeilen]


def kachelebenen(zeilen: list[str], szene: dict) -> tuple[list[int], list[int]]:
    """Boden- und Wandebene: Wand, Wasser und Leere sperren, Buchstaben aus ``boeden`` sind Teppich."""
    teppiche = set(szene.get("boeden", {}))
    boden, waende = [], []
    for zeile in zeilen:
        for zeichen in zeile:
            gesperrt = zeichen in GESPERRT
            boden.append(0 if gesperrt else GID_TEPPICH if zeichen in teppiche else GID_BODEN)
            waende.append(GID_WAND if gesperrt else 0)
    return boden, waende


def platziere(szene: dict, moebel: dict) -> tuple[list[dict], list[str]]:
    """Die Möbel der Szene in Pixeln, mit Tiefe und Kollision; dazu Befunde der Prüfung.

    ``feld`` = linke obere Kachel; ``auf`` = Kennung eines anderen Möbels (mittig auf dessen
    Oberseite, gezeichnet davor, ohne Kollision); ``an_wand`` = hängt an der Wandfläche (hinter
    allem, ohne Kollision); ``vorn`` = nach dem Fuß gezeichnet, ohne Kollision (Fahnenmast vor einer
    Fassade); ``versatz`` = Feinschub in Pixeln.
    """
    befunde: list[str] = []
    nach_id: dict[str, dict] = {}
    gesetzt: list[dict] = []
    for nummer, eintrag in enumerate(szene.get("objekte", [])):
        angabe = moebel.get(eintrag["moebel"])
        if not angabe:
            befunde.append(f"Möbel {eintrag['moebel']} fehlt in inhalte/abenteuer/moebel/")
            continue
        if any(w in angabe["quelle"].lower() for w in BAUTEIL) and not eintrag.get("bauteil_ok"):
            befunde.append(f"{eintrag['moebel']} ist ein Bauteil ({angabe['quelle'].split('/')[-1]})")
        dx, dy = eintrag.get("versatz", [0, 0])
        if "auf" in eintrag:
            basis = nach_id.get(eintrag["auf"])
            if not basis:
                befunde.append(f"{eintrag['moebel']}: Unterlage {eintrag['auf']} fehlt (vorher nennen)")
                continue
            # Mit „sichtbar_breite“ (Möbelangabe, deckende Pixel) zählt die sichtbare Breite; sonst
            # die Bildbreite mit 4 Pixeln Spiel für den durchsichtigen Rand der Unterlage.
            unterlage = moebel[basis["name"]]
            spiel = 0 if "sichtbar_breite" in unterlage else 4
            sichtbar = angabe.get("sichtbar_breite", angabe["breite"])
            if sichtbar > unterlage.get("sichtbar_breite", unterlage["breite"]) - spiel:
                befunde.append(f"{eintrag['moebel']} ist breiter als die Platte von {eintrag['auf']}")
            x = basis["x"] + (basis["breite"] - angabe["breite"]) // 2 + dx
            # Fuß des Gegenstands auf der Tischplatte: gut die Hälfte der Unterlage von oben.
            y = basis["y"] + basis["hoehe"] * 3 // 5 - angabe["hoehe"] + dy
            tiefe, kollision = basis["tiefe"] + 1, False
        else:
            x, y = eintrag["feld"][0] * K + dx, eintrag["feld"][1] * K + dy
            an_wand = eintrag.get("an_wand", False)
            # „vorn“: nach dem Fuß gezeichnet, aber ohne Kollision und Überlappungsprüfung (Fahnenmast
            # oder Laterne vor einer Fassade, deren Bild bis zur Treppe Kollisionsfläche ist).
            vorn = eintrag.get("vorn", False)
            # Ohne Kollision (Teppich, flache Dinge am Boden) liegt das Möbel unter allem.
            flach = not angabe.get("kollision") and not an_wand and not vorn
            tiefe = 0 if an_wand else 1 if flach else y + angabe["hoehe"] - K // 2
            kollision = bool(angabe.get("kollision")) and not an_wand and not vorn
        stueck = {
            "name": eintrag["moebel"],
            "x": x,
            "y": y,
            "breite": angabe["breite"],
            "hoehe": angabe["hoehe"],
            "tiefe": tiefe,
            "kollision": kollision,
            "id": eintrag.get("id", f"{eintrag['moebel']}@{nummer}"),
        }
        nach_id[stueck["id"]] = stueck
        gesetzt.append(stueck)
    return gesetzt, befunde


def sperrfelder(stueck: dict) -> set[tuple[int, int]]:
    """Felder, die ein Möbel mit Kollision sperrt (alles außer der obersten Kachelreihe)."""
    if not stueck["kollision"]:
        return set()
    x0, y0 = stueck["x"] // K, stueck["y"] // K
    spalten, reihen = max(1, stueck["breite"] // K), max(1, stueck["hoehe"] // K)
    oben = 1 if reihen > 1 else 0
    return {(x0 + a, y0 + b) for a in range(spalten) for b in range(oben, reihen)}


def pruefe(zeilen: list[str], gesetzt: list[dict], punkte: list[dict]) -> list[str]:
    """Rand, Wände, Überlappungen und zugestellte Auslöser."""
    befunde = []
    breite, hoehe = len(zeilen[0]) * K, len(zeilen) * K
    belegt: dict[tuple[int, int], str] = {}
    for s in gesetzt:
        if s["x"] < 0 or s["y"] < 0 or s["x"] + s["breite"] > breite or s["y"] + s["hoehe"] > hoehe:
            befunde.append(f"{s['name']} ragt über den Kartenrand")
        unten = (s["y"] + s["hoehe"] - 1) // K
        for feld in sperrfelder(s):
            # Hohe Möbel an der Nordwand überdecken die Wandfläche; nur der Fuß muss auf Boden stehen.
            auf_wand = (
                0 <= feld[1] < len(zeilen)
                and 0 <= feld[0] < len(zeilen[0])
                and zeilen[feld[1]][feld[0]] in GESPERRT
            )
            if auf_wand and feld[1] == unten:
                befunde.append(f"{s['name']} steht auf Wand oder Wasser bei {feld}")
            if feld in belegt:
                befunde.append(f"{s['name']} überlappt {belegt[feld]} bei {feld}")
            belegt[feld] = s["name"]
    for p in punkte:
        feld = tuple(p["feld"])
        # Gegenstände zum Ansehen dürfen auf einem Möbel liegen (man steht davor, wie beim Brett).
        if feld in belegt and not p.get("auf_moebel"):
            befunde.append(f"{p['name']} ist von {belegt[feld]} zugestellt")
    return befunde


def tiled(szene: dict, zeilen: list[str], gesetzt: list[dict], vorlage: dict) -> dict:
    """Die Tiled-Karte (Format der übrigen Karten, Kachelsatz des Platzhalters)."""
    boden, waende = kachelebenen(zeilen, szene)
    breite, hoehe = len(zeilen[0]), len(zeilen)
    objekte = []

    def objekt(name: str, typ: str, x: int, y: int, b: int = K, h: int = K, eig: list | None = None) -> None:
        o = {
            "id": len(objekte) + 1,
            "name": name,
            "type": typ,
            "x": x,
            "y": y,
            "width": b,
            "height": h,
            "rotation": 0,
            "visible": True,
        }
        if eig:
            o["properties"] = eig
        objekte.append(o)

    for a in szene.get("ausloeser", []):
        eig = [{"name": k, "type": "string", "value": v} for k, v in a.get("eigenschaften", {}).items()]
        objekt(a["name"], "ausloeser", a["feld"][0] * K, a["feld"][1] * K, eig=eig)
    for f in szene.get("figuren", []):
        objekt(f["name"], "figur", f["feld"][0] * K, f["feld"][1] * K)
    # Statisten und Tiere (Belebung, Weltbeschreibung 4a) mit ihren Laufwegen.
    for b in szene.get("belebung", []):
        eig = [{"name": k, "type": "string", "value": v} for k, v in b.get("eigenschaften", {}).items()]
        objekt(b["name"], b["typ"], b["feld"][0] * K, b["feld"][1] * K, eig=eig)
    for s in gesetzt:
        eig = [
            {"name": "tiefe", "type": "int", "value": s["tiefe"]},
            {"name": "kollision", "type": "bool", "value": s["kollision"]},
        ]
        objekt(s["name"], "moebel", s["x"], s["y"], s["breite"], s["hoehe"], eig)
    leer = [0] * (breite * hoehe)
    ebenen = [("boden", boden), ("waende", waende), ("objekte", leer)]
    layers = [
        {
            "id": i + 1,
            "name": n,
            "type": "tilelayer",
            "width": breite,
            "height": hoehe,
            "x": 0,
            "y": 0,
            "opacity": 1,
            "visible": True,
            "data": d,
        }
        for i, (n, d) in enumerate(ebenen)
    ]
    layers.append(
        {
            "id": 4,
            "name": "ausloeser",
            "type": "objectgroup",
            "draworder": "topdown",
            "x": 0,
            "y": 0,
            "opacity": 1,
            "visible": True,
            "objects": objekte,
        }
    )
    eigenschaften = [{"name": "kennung", "type": "string", "value": szene["karte"]}]
    eigenschaften += [
        {"name": k, "type": "string", "value": v} for k, v in szene.get("eigenschaften", {}).items()
    ]
    return {
        **{
            k: vorlage[k]
            for k in (
                "compressionlevel",
                "orientation",
                "renderorder",
                "tiledversion",
                "type",
                "version",
                "infinite",
            )
            if k in vorlage
        },
        "width": breite,
        "height": hoehe,
        "tilewidth": K,
        "tileheight": K,
        "nextlayerid": 5,
        "nextobjectid": len(objekte) + 1,
        "layers": layers,
        "tilesets": vorlage["tilesets"],
        "properties": eigenschaften,
    }


def baue(pfad: Path) -> list[str]:
    """Baut eine Szene; gibt die Befunde zurück (leer = in Ordnung) und schreibt die Karte."""
    szene = lade(pfad)
    moebel = lade_moebel()
    zeilen = raster(szene)
    gesetzt, befunde = platziere(szene, moebel)
    punkte = szene.get("ausloeser", []) + szene.get("figuren", [])
    befunde += pruefe(zeilen, gesetzt, punkte)
    befunde += pruefe_regeln(szene, zeilen, gesetzt, moebel)
    ziel = INHALTE / szene["datei"]
    vorlage = lade(INHALTE / "karten" / "maple-falls-dachboden.json")
    ziel.write_text(
        json.dumps(tiled(szene, zeilen, gesetzt, vorlage), ensure_ascii=False, indent=1) + "\n",
        encoding="utf-8",
    )
    return befunde


def main() -> int:
    fehler = 0
    for name in sys.argv[1:]:
        befunde = baue(Path(name))
        print(f"{name}: {'in Ordnung' if not befunde else ''}")
        for b in befunde:
            print(f"  - {b}")
        fehler += len(befunde)
    return 1 if fehler else 0


if __name__ == "__main__":
    sys.exit(main())
