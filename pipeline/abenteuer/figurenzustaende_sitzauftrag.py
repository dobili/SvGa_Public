"""Sitzauftrag für die Bildmappe des Autors: je Figurenbild ohne Stuhlzustand die Sitzrichtungen.

Warum: Der Autor erzeugt die fehlenden Stuhlzustände in PixelLab (Wunsch des Hauptchats, 24.11.2026,
nach dem Rückbau von RO51). PixelLab braucht je Zustand die Richtung, in die die Figur sitzt. Die
App setzt Sitzende aus den Tagesabläufen mit dem Blick ihres Sitzmöbels hin (Katalog ``blick``,
ohne Angabe „unten“; app/src/abenteuer/oberwelt/sitzplatz.ts, blickDesSitzes); Figuren der Szenen
tragen ihre Richtung selbst (``sitzt``). Links und rechts sind ein Bild, das die App spiegelt.

Ausgabe (``--sitzauftrag DATEI`` von figurenzustaende.py, nur lokal unter buch/arbeit): je Bild die
Personen, die Richtungen, was zu zeichnen ist, wie oft jede Richtung vorkommt und alle Stellen.
Beispiel: ada sitzt abends auf der Bank am Landweg (wg4Bank, Blick unten) → zu_zeichnen ["unten"].
Abhängigkeiten: figurenzustaende.py, figurenzustaende_ablauf.py.
"""

import json
from pathlib import Path

from pipeline.abenteuer import figurenzustaende_ablauf as A

UNTEN = "unten"
SEITLICH = "seitlich (links, rechts gespiegelt)"
SPIEGELBAR = {"links", "rechts"}


def sitzmoebel_auf(
    feld: list[int], objekte: list[dict], katalog: dict, kachel: int
) -> tuple[str, dict] | None:
    """Das Sitzmöbel, in dessen Bild die Mitte der Kachel liegt (wie figurenzustaende.sitzart), oder
    None. Ausgabe: (Möbelname, Katalogangabe)."""
    from pipeline.abenteuer.figurenzustaende import ist_sitzmoebel

    mx, my = (feld[0] + 0.5) * kachel, (feld[1] + 0.5) * kachel
    for objekt in objekte:
        angabe = katalog.get(objekt.get("moebel", ""))
        if not angabe or "feld" not in objekt or not ist_sitzmoebel(objekt["moebel"], angabe):
            continue
        dx, dy = objekt.get("versatz", [0, 0])
        x, y = objekt["feld"][0] * kachel + dx, objekt["feld"][1] * kachel + dy
        massstab = objekt.get("massstab", 1)
        if x <= mx < x + angabe["breite"] * massstab and y <= my < y + angabe["hoehe"] * massstab:
            return objekt["moebel"], angabe
    return None


class Auftrag:
    """Sammelt je Bild Personen, Richtungen und Stellen."""

    def __init__(self) -> None:
        self.bilder: dict[str, dict] = {}

    def merke(self, bild: str, person: str, richtung: str, stelle: str, moebel: str) -> None:
        """Eine Sitzstelle des Bildes."""
        e = self.bilder.setdefault(bild, {"personen": set(), "haeufigkeit": {}, "stellen": []})
        e["personen"].add(person)
        e["haeufigkeit"][richtung] = e["haeufigkeit"].get(richtung, 0) + 1
        e["stellen"].append({"stelle": stelle, "moebel": moebel, "richtung": richtung})

    def als_daten(self, fehlend: set[str]) -> dict:
        """Ergebnis wie in sitzauftrag.json; ``ohne_sitzstelle``: fehlende Bilder ohne gefundene Stelle."""
        bilder = {}
        for bild in sorted(self.bilder):
            e = self.bilder[bild]
            richtungen = sorted(e["haeufigkeit"])
            bilder[bild] = {
                "personen": sorted(e["personen"]),
                "richtungen": richtungen,
                "zu_zeichnen": sorted({SEITLICH if r in SPIEGELBAR else r for r in richtungen}),
                "haeufigkeit": e["haeufigkeit"],
                "stellen": e["stellen"],
            }
        return {
            "erklaerung": (
                "Sitzrichtungen je Figurenbild ohne Stuhlzustand (WARTET_AUF_BILD), aus dem Blick des "
                "Sitzmöbels (Katalog blick, ohne Angabe unten) oder der Richtung der Szene. Links und "
                "rechts sind ein Bild, das die App spiegelt."
            ),
            "bilder": bilder,
            "ohne_sitzstelle": sorted(fehlend - set(bilder)),
        }


def _aus_ablaeufen(
    daten: Path, auftrag: Auftrag, fehlend: set[str], bilder: dict, katalog: dict, kachel: int
) -> None:
    """Sitzblöcke der Tagesabläufe auf einem Sitzmöbel."""
    karten = A.szenen_je_karte(json.loads((daten / "orte.json").read_text(encoding="utf-8"))["orte"])
    for person, ort, block in A.bloecke(daten):
        bild = A.bild_der_person(person, ort, bilder)
        szene = karten.get(block.get("karte", ""))
        if bild not in fehlend or block.get("tut") != "sitzt" or not szene:
            continue
        objekte = json.loads((daten / "szenen" / f"{szene}.json").read_text(encoding="utf-8")).get(
            "objekte", []
        )
        if sitz := sitzmoebel_auf(block["feld"], objekte, katalog, kachel):
            stelle = f"Tagesablauf {block['karte']} {block['feld']} {block['von']}-{block['bis']} Uhr"
            auftrag.merke(bild, person, sitz[1].get("blick") or UNTEN, stelle, sitz[0])


def _aus_szenen(
    daten: Path, auftrag: Auftrag, fehlend: set[str], bilder: dict, katalog: dict, kachel: int
) -> None:
    """Sitzende Figuren der Szenen auf einem Sitzmöbel (Richtung aus ``sitzt``)."""
    for pfad in sorted((daten / "szenen").glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        ort = str(szene.get("karte", "")).split(".")[0]
        for figur in szene.get("figuren", []):
            bild = bilder.get(f"{ort}.{figur['name']}")
            sitz = sitzmoebel_auf(figur["feld"], szene.get("objekte", []), katalog, kachel)
            if bild in fehlend and figur.get("sitzt") and sitz:
                richtung = (
                    figur["sitzt"] if isinstance(figur["sitzt"], str) else sitz[1].get("blick") or UNTEN
                )
                auftrag.merke(bild, figur["name"], richtung, f"Szene {pfad.stem} {figur['feld']}", sitz[0])


def sitzauftrag(daten: Path, bilder: dict[str, str], katalog: dict, kachel: int) -> dict:
    """Der Sitzauftrag für alle Bilder, die laut WARTET_AUF_BILD noch keinen Stuhlzustand haben."""
    fehlend = {bild for bild, zustand in A.WARTET_AUF_BILD if zustand == "stuhl"}
    auftrag = Auftrag()
    _aus_ablaeufen(daten, auftrag, fehlend, bilder, katalog, kachel)
    _aus_szenen(daten, auftrag, fehlend, bilder, katalog, kachel)
    return auftrag.als_daten(fehlend)
