"""Ansprechziele: Ist das Ziel jedes Hauptquestschritts eine Figur, die der Held erreicht?

Warum: Wunsch des Autors (25.11.2026). Hauptfiguren, deren Gespräch die Geschichte gerade
voranbringt, sprechen den Helden an, wenn er vor ihnen vorbeigeht
(app/src/abenteuer/regeln/ansprechen.ts, oberwelt/ansprechziel.ts). Das wirkt nur, wenn das Ziel des
Schritts eine Figur ist, die auf ihrer Karte steht und die der Held zu Fuß erreicht. Dieses Werkzeug
geht alle Schritte aller Hauptquests durch, mit ``ziel``, jedem Umweg (``umwege``) und dem aus dem
Ereignis abgeleiteten Ziel wie die App (zielsuche.ts, ``zielangabe``), dazu die Ziele zwischen den
Quests („Was jetzt?“, wasjetzt.ts).

Befunde (Dauertest „0 Befunde“):
1. Das Ziel ist eine Figur des Orts (orte.json), steht aber auf keiner Szene ihrer Karte.
2. Die Figur steht auf der Karte, aber kein Feld neben ihr ist vom Eingang der Karte aus erreichbar.
3. Ein Schritt mit ``ansprechen: false`` hat keinen ``ansprechenGrund`` (das Schema verlangt ihn).

Hinweise (``--hinweise``, kein Befund): Ziele, die keine Figur sind (Brett, Tür: dort spricht
niemand an), und Figuren, vor denen kein erreichbares Feld im Kegel liegt (Blickrichtung zur Wand:
Sie sprechen nie von selbst an, der Held findet sie wie bisher).

Grenzen: Geprüft wird die Stelle aus der Szene; der Tagesablauf kann eine Figur verstellen (Ziele
laufender Schritte hält er fest, Regel 1). Bedingungen der Umwege werden nicht ausgewertet: Jeder
Umweg zählt als mögliches Ziel.

Aufruf: ``python -m pipeline.abenteuer.ansprechziel [--hinweise] [--liste]`` (``--liste`` druckt je
Schritt das Ziel). Rückgabe 1 bei Befunden. Dauertest: pipeline/tests/test_abenteuer_ansprechziel.py.
"""

import json
import sys
from dataclasses import dataclass

from pipeline.abenteuer.blickpunkte import ankunftsfelder
from pipeline.abenteuer.durchgang import gesperrte_felder
from pipeline.abenteuer.figurensperre import NACHBARN, erreichbar, figurenfelder, uebergangsnamen
from pipeline.abenteuer.kartenbau import INHALTE, platziere, raster
from pipeline.abenteuer.moebelliste import lade_moebel

Feld = tuple[int, int]

# Ziele zwischen den Quests, wie LUECKENZIELE in app/src/abenteuer/oberwelt/zielsuche.ts.
LUECKENZIELE = {
    "tagebuch.wasJetzt.ersteNacht": {"karte": "mapleFalls.zimmer", "objekt": "brettSchreibtisch"},
    "tagebuch.wasJetzt.juno": {"karte": "mapleFalls.aussen", "objekt": "juno"},
    "tagebuch.wasJetzt.club": {"karte": "mapleFalls.clubraum", "objekt": "coachDelgado"},
}
# Wie weit eine Figur sieht (ANSPRECHWEITE, ANSPRECHBREITE in regeln/ansprechen.ts).
WEITE, BREITE = 3, 1
VORWAERTS = {"unten": (0, 1), "oben": (0, -1), "rechts": (1, 0), "links": (-1, 0)}


@dataclass(frozen=True)
class Ziel:
    """Ein mögliches Ziel eines Schritts: wo (Karte oder Ort) und was (Objektname)."""

    stelle: str  # „quest#schritt“ oder der Textschlüssel der Lücke
    objekt: str
    karte: str | None = None
    ort: str | None = None


def lies(datei: str) -> dict:
    """Eine JSON-Datei aus inhalte/abenteuer."""
    return json.loads((INHALTE / datei).read_text(encoding="utf-8"))


def figurangabe(stelle: str, kennung: str | None) -> list[Ziel]:
    """„mapleFalls.sam“ → Ziel „sam“ im Ort mapleFalls; ohne Kennung nichts."""
    if not kennung:
        return []
    ort, _, name = kennung.partition(".")
    return [Ziel(stelle, name, ort=ort)]


def dialogangabe(stelle: str, knoten: str, orte: list[dict]) -> list[Ziel]:
    """Auslöser oder Figur mit genau diesem Dialogknoten (wie dialogangabe in zielsuche.ts)."""
    datei = knoten.split(".")[0]
    for ort in orte:
        karte = next((k["kennung"] for k in ort["karten"] if k["datei"].endswith(f"/{datei}.json")), None)
        ausloeser = next((a for a in ort.get("ausloeser", []) if a.get("dialog") == knoten), None)
        if ausloeser:
            return [Ziel(stelle, ausloeser["name"], karte=ausloeser.get("karte", karte), ort=ort["kennung"])]
        figur = next((f for f in ort["figuren"] if f.get("dialog") == knoten), None)
        if figur:
            return [Ziel(stelle, figur["kennung"].partition(".")[2], karte=karte, ort=ort["kennung"])]
    return []


def schrittziele(stelle: str, schritt: dict, daten: dict) -> list[Ziel]:
    """Alle möglichen Ziele eines Schritts: jeder Umweg und das Ziel (oder das abgeleitete)."""
    ziele = [Ziel(stelle, u["ziel"]["objekt"], karte=u["ziel"]["karte"]) for u in schritt.get("umwege", [])]
    if "ziel" in schritt:
        return [*ziele, Ziel(stelle, schritt["ziel"]["objekt"], karte=schritt["ziel"]["karte"])]
    e = schritt["ereignis"]
    if e["art"] == "ort":
        return [*ziele, *([Ziel(stelle, e["ausloeser"], karte=e["karte"])] if e.get("ausloeser") else [])]
    if e["art"] == "aufgaben":
        steller = next((r.get("steller") for r in daten["runden"] if r["kennung"] == e["runde"]), None)
        return [*ziele, *figurangabe(stelle, steller)]
    if e["art"] == "partie":
        gegner = next((b.get("gegner") for b in daten["begegnungen"] if b["kennung"] == e["begegnung"]), None)
        return [*ziele, *figurangabe(stelle, gegner)]
    return [*ziele, *dialogangabe(stelle, e["knoten"], daten["orte"])]


def alle_ziele(daten: dict) -> tuple[list[Ziel], list[str]]:
    """Ziele aller Hauptquestschritte und der Lücken; dazu Befunde zu ``ansprechen: false``."""
    ziele, befunde = [], []
    for q in daten["quests"]:
        if not q.get("haupt"):
            continue
        for i, schritt in enumerate(q["schritte"]):
            stelle = f"{q['kennung']}#{i}"
            if schritt.get("ansprechen") is False:
                if not schritt.get("ansprechenGrund"):
                    befunde.append(f"{stelle}: ansprechen: false ohne ansprechenGrund")
                continue
            ziele += schrittziele(stelle, schritt, daten)
    ziele += [Ziel(luecke, z["objekt"], karte=z["karte"]) for luecke, z in LUECKENZIELE.items()]
    return ziele, befunde


def szenen_je_karte() -> dict[str, list[dict]]:
    """Alle Szenen (Grundfassung und Zustände) je Kartenkennung."""
    szenen: dict[str, list[dict]] = {}
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        if "karte" in szene:
            szenen.setdefault(szene["karte"], []).append(szene)
    return szenen


def kegel(figur: dict) -> list[Feld]:
    """Die Felder vor einer Figur (1 bis 3 nach vorn, 1 seitlich), nach ihrer Blickrichtung."""
    blick = figur.get("blick") or figur.get("sitzt") or "unten"
    vx, vy = VORWAERTS.get(blick, VORWAERTS["unten"])
    x, y = figur["feld"]
    return [
        (x + vx * v + vy * s, y + vy * v + vx * s)
        for v in range(1, WEITE + 1)
        for s in range(-BREITE, BREITE + 1)
    ]


@dataclass
class Lage:
    """Was eine Szene über eine Figur sagt: erreichbar daneben, erreichbar im Kegel."""

    nah: bool
    im_kegel: bool


def lage_in(szene: dict, name: str, moebel: dict, uebergaenge: set[str]) -> Lage | None:
    """Die Lage der Figur ``name`` in einer Szene, oder None, wenn sie dort nicht steht."""
    figur = next((f for f in szene.get("figuren", []) if f["name"] == name), None)
    if figur is None:
        return None
    zeilen = raster(szene)
    gesetzt, _ = platziere(szene, moebel)
    gesperrt = gesperrte_felder(zeilen, gesetzt, szene) | figurenfelder(szene).keys()
    begehbar = erreichbar(ankunftsfelder(szene, uebergaenge, gesperrt), gesperrt, len(zeilen[0]), len(zeilen))
    x, y = figur["feld"]
    nah = any((x + dx, y + dy) in begehbar for dx, dy in NACHBARN)
    return Lage(nah=nah, im_kegel=any(f in begehbar for f in kegel(figur)))


def karten_des_ziels(ziel: Ziel, szenen: dict[str, list[dict]]) -> list[str]:
    """Die Karten, auf denen ein Ziel liegen kann: angegeben, sonst alle des Orts."""
    if ziel.karte:
        return [ziel.karte]
    return sorted(k for k in szenen if ziel.ort and k.startswith(f"{ziel.ort}."))


def ist_figur(ziel: Ziel, orte: list[dict]) -> bool:
    """Ist das Objekt eine Figur eines Orts (orte.json, Kennung „ort.name“)?"""
    return any(f["kennung"].partition(".")[2] == ziel.objekt for o in orte for f in o["figuren"])


def pruefe(liste: bool = False) -> tuple[list[str], list[str]]:
    """Befunde und Hinweise zu allen Zielen; mit ``liste`` je Ziel eine Zeile unter den Hinweisen."""
    daten = {n: lies(f"{n}.json")[n] for n in ("quests", "orte", "runden", "begegnungen")}
    ziele, befunde = alle_ziele(daten)
    hinweise: list[str] = []
    szenen, moebel, namen = szenen_je_karte(), lade_moebel(), uebergangsnamen()
    for ziel in ziele:
        wo = ziel.karte or ziel.ort
        if not ist_figur(ziel, daten["orte"]):
            hinweise.append(f"{ziel.stelle}: {wo}.{ziel.objekt} ist keine Figur (dort spricht niemand an)")
            continue
        lagen = [
            lage
            for karte in karten_des_ziels(ziel, szenen)
            for szene in szenen.get(karte, [])
            if (lage := lage_in(szene, ziel.objekt, moebel, namen.get(karte, set()))) is not None
        ]
        if not lagen:
            befunde.append(f"{ziel.stelle}: Figur {ziel.objekt} steht auf keiner Szene von {wo}")
        elif not any(lage.nah for lage in lagen):
            befunde.append(
                f"{ziel.stelle}: Figur {ziel.objekt} auf {wo} ist vom Eingang aus nicht erreichbar"
            )
        elif not any(lage.im_kegel for lage in lagen):
            hinweise.append(f"{ziel.stelle}: {ziel.objekt} auf {wo}: kein erreichbares Feld im Kegel")
        elif liste:
            hinweise.append(f"{ziel.stelle}: {ziel.objekt} auf {wo} spricht an")
    return befunde, hinweise


def main(argumente: list[str] | None = None) -> int:
    """Druckt Befunde (und mit ``--hinweise`` oder ``--liste`` die Hinweise); Rückgabe 1 bei Befunden."""
    argumente = sys.argv[1:] if argumente is None else argumente
    befunde, hinweise = pruefe(liste="--liste" in argumente)
    if "--hinweise" in argumente or "--liste" in argumente:
        for h in hinweise:
            print(f"Hinweis  {h}")
    for b in befunde:
        print(f"Befund   {b}")
    print(f"{len(befunde)} Befunde, {len(hinweise)} Hinweise")
    return 1 if befunde else 0


if __name__ == "__main__":
    sys.exit(main())
