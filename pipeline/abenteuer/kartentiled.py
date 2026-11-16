"""Tiled-Karte aus den gesetzten Möbeln einer Szene (ausgelagert aus ``kartenbau.py``).

Warum: ``kartenbau.py`` stieß an die Grenze von 400 Zeilen. Hier steht, was nur das Format der
Ausgabe betrifft: Kachelebenen (Boden, Wände), Objekte mit Eigenschaften (Tiefe, Kollision, Form,
eigene Maske), Eigenschaften der Karte. Die Konstanten der Rasterzeichen stehen hier, damit beide
Module sie ohne Kreisimport teilen; ``kartenbau`` gibt sie weiter.
"""

from pipeline.abenteuer.kollisionspinsel import eigenschaften as pinseleigenschaften
from pipeline.abenteuer.kollisionspinsel import pinselfelder
from pipeline.abenteuer.objektform import formeigenschaften
from pipeline.abenteuer.objektkollision import maskeneigenschaft

K = 16
WAND, WASSER, LEER = "#", "~", " "
GESPERRT = {WAND, WASSER, LEER}
# Gid im Raster des Platzhalters (Boden, Wand, Teppich) für Kollision und Ansicht ohne Grafik.
GID_BODEN, GID_WAND, GID_TEPPICH = 1, 2, 4


RICHTUNGEN = ("oben", "unten", "links", "rechts")


def sitzrichtung(eintrag: dict) -> str | None:
    """Blickrichtung einer sitzenden Figur: ``"sitzt": true`` heißt nach unten, sonst die
    angegebene Richtung (oben, unten, links, rechts); ohne Angabe None."""
    wert = eintrag.get("sitzt")
    if wert is True:
        return "unten"
    return wert if wert in RICHTUNGEN else None


def kachelebenen(zeilen: list[str], szene: dict) -> tuple[list[int], list[int]]:
    """Boden- und Wandebene: Wand, Wasser und Leere sperren, Buchstaben aus ``boeden`` sind Teppich.

    Kollisionspinsel (kollisionspinsel.py): ``sperren`` legt eine Wandkachel in die Ebene ``waende``,
    ``freigeben`` macht Wand, Wasser oder Leere zu Boden. So sperrt Phaser dieselben Kacheln.
    """
    teppiche = set(szene.get("boeden", {}))
    sperren, freigeben = pinselfelder(szene)
    boden, waende = [], []
    for y, zeile in enumerate(zeilen):
        for x, zeichen in enumerate(zeile):
            gesperrt = (zeichen in GESPERRT or (x, y) in sperren) and (x, y) not in freigeben
            if (x, y) in sperren - freigeben and zeichen not in GESPERRT:
                boden.append(GID_TEPPICH if zeichen in teppiche else GID_BODEN)
                waende.append(GID_WAND)
                continue
            boden.append(0 if gesperrt else GID_TEPPICH if zeichen in teppiche else GID_BODEN)
            waende.append(GID_WAND if gesperrt else 0)
    return boden, waende


# Felder der Szene, die als Eigenschaft in die Tiled-Karte gehen.
KARTENFELDER = ("toenung", "zustand_der_karte", "jahreszeit")
TOENUNGEN = ("nebel", "dunst", "nacht", "abend", "serverblau", "sepia", "dunkel")
# Winter färbt kartenbild um und lässt in der App Schnee fallen (Entscheidung 10.11.2026).
JAHRESZEITEN = ("winter",)


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
        # Sitzende Figur (Wunsch des Autors R020): Blickrichtung als Eigenschaft „sitzt“.
        sitzt = sitzrichtung(f)
        eig = [{"name": "sitzt", "type": "string", "value": sitzt}] if sitzt else None
        objekt(f["name"], "figur", f["feld"][0] * K, f["feld"][1] * K, eig=eig)
    # Statisten und Tiere (Belebung, Weltbeschreibung 4a) mit ihren Laufwegen.
    for b in szene.get("belebung", []):
        eig = [{"name": k, "type": "string", "value": v} for k, v in b.get("eigenschaften", {}).items()]
        objekt(b["name"], b["typ"], b["feld"][0] * K, b["feld"][1] * K, eig=eig)
    for s in gesetzt:
        eig = [
            {"name": "tiefe", "type": "int", "value": s["tiefe"]},
            {"name": "kollision", "type": "bool", "value": s["kollision"]},
        ] + formeigenschaften(s)
        if "objektmaske" in s:
            # Eigene Maske der Szene (objektkollision.py), schon geformt; nur dann, damit alte Karten
            # gleich bleiben. Die App liest sie in oberwelt/moebelform.ts (geformtAusObjekt).
            eig.append({"name": "maske", "type": "string", "value": maskeneigenschaft(s["objektmaske"])})
        if "deckkraft" in s:  # nur wenn gesetzt (alte Karten bleiben gleich); App: moebel.ts
            eig.append({"name": "deckkraft", "type": "int", "value": s["deckkraft"]})
        if "wenn" in s:
            eig.append({"name": "wenn", "type": "string", "value": s["wenn"]})
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
    # Tönung (nebel, dunst, nacht, abend, sepia, dunkel), Zustand und Jahreszeit liest die App aus den
    # Eigenschaften der Karte (oberwelt/toenung.ts, zustand_der_karte, oberwelt/winter.ts).
    eigenschaften += [
        {"name": k, "type": "string", "value": szene[k]}
        for k in KARTENFELDER
        if isinstance(szene.get(k), str)
    ]
    # Gemalte Sperren und Freigaben (kollisionspinsel.py); die App liest sie in oberwelt/begehbar.ts.
    eigenschaften += pinseleigenschaften(szene)
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
