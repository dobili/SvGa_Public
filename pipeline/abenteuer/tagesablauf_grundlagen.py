"""Tagesabläufe, Grundlagen des Entwurfs: Rollen, Personen, Sitzplätze, Betten.

Warum: Ausgelagert aus tagesablauf_entwurf.py (Dateien unter 400 Zeilen). Siehe dort den Kopf.
"""

import re
import zlib
from collections import defaultdict
from functools import lru_cache
from pathlib import Path

from pipeline.abenteuer.kartenbau import INHALTE, platziere
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.sitzplatz import K, ist_sitzmoebel

PROMPTS = INHALTE.parents[1] / "docs" / "spiel" / "25_Figurenprompts.md"
EIGENE_ZEIT = ("erinnerung",)  # Orte mit eigener Zeit (Erinnerungen)
# Innenräume, in denen man nachts sitzt (Wunsch des Hauptchats, 22.11.2026: Diner, Kantine, Wohnzimmer)
NACHTKARTEN = {
    "diner",
    "kantine",
    "wohnzimmer",
    "gasthaus",
    "saloon",
    "raststaette",
    "bahnhofshalle",
    "hinterzimmer",
    "ubahnhof",
    "mamasZimmer",
    "wohnwagen",
}
LATERNENNAEHE = 2  # Felder


def rollen() -> dict[str, dict]:
    """Kennung → Rolle, Größe (Kind oder jugendlich) und Alter aus docs/spiel/25_Figurenprompts.md."""
    text = PROMPTS.read_text(encoding="utf-8")
    ergebnis = {}
    for kennung, block in re.findall(r"### `([^`]+)` – [^\n]+\n(.*?)(?=\n### |\n## |\Z)", text, re.S):
        rolle = re.search(r"\*\*Rolle:\*\* ([^\n]+)", block)
        groesse = re.search(r"\*\*Größe:\*\* ([^\n]+)", block)
        alter = re.search(r"\b(\d{1,2})[- ]?(?:Jahre|jährig|year)", block)
        ergebnis[kennung] = {
            "rolle": rolle.group(1).strip() if rolle else "",
            "kind": bool(groesse and "Kind" in groesse.group(1)),
            "alter": int(alter.group(1)) if alter else None,
        }
    return ergebnis


def streu(name: str, werte: tuple) -> object:
    """Fester, gleichmäßig gestreuter Wert je Name (gleiche Datei bei jedem Lauf)."""
    return werte[zlib.crc32(name.encode()) % len(werte)]


def personennamen(orte: list[dict], bekannt: set[str]) -> dict[str, str]:
    """Bild → Name der Person: die Kennung aus Dokument 25, sonst die kürzeste Kennung.

    Beispiel: figuren/skater-jo.png mit skaterJo → „skaterJo“; mutter.png (mutter, mutterAussen,
    mama) → „mutter“.
    """
    kandidaten: dict[str, set[str]] = defaultdict(set)
    for ort in orte:
        for f in ort["figuren"]:
            kandidaten[Path(f["sprite"]).stem].add(f["kennung"].split(".")[1])
    return {
        bild: next(
            (n for n in sorted(namen, key=lambda n: (len(n), n)) if n in bekannt),
            min(namen, key=lambda n: (len(n), n)),
        )
        for bild, namen in kandidaten.items()
    }


def personen(orte: list[dict], karten: dict[str, dict], bekannt: set[str]) -> dict[str, dict]:
    """Person → Orte, Kennungen und Plätze (Karte, Feld, wenn, sitzt)."""
    personen: dict[str, dict] = defaultdict(lambda: {"orte": set(), "plaetze": [], "geist": False})
    name_von = personennamen(orte, bekannt)
    for ort in orte:
        if ort["kennung"].startswith(EIGENE_ZEIT):
            continue
        namen = {f["kennung"].split(".")[1]: f for f in ort["figuren"]}
        for figur in ort["figuren"]:
            person = name_von[Path(figur["sprite"]).stem]
            personen[person]["orte"].add(ort["kennung"])
            personen[person]["geist"] |= bool(figur.get("geist"))
        for k in ort["karten"]:
            for f in karten.get(k["kennung"], {}).get("figuren", []):
                if f["name"] in namen:
                    person = name_von[Path(namen[f["name"]]["sprite"]).stem]
                    personen[person]["plaetze"].append(
                        {
                            "karte": k["kennung"],
                            "feld": f["feld"],
                            "wenn": namen[f["name"]].get("wenn"),
                            "kennung": f"{ort['kennung']}.{f['name']}",
                            "sitzt": sitzart(f, karten[k["kennung"]]),
                        }
                    )
    return personen


def sitzart(figur: dict, szene: dict) -> str | None:
    """None (steht), „moebel“ (auf einem Sitzmöbel) oder „boden“ (Lily auf dem Bordstein)."""
    if not figur.get("sitzt"):
        return None
    return (
        "moebel"
        if tuple(figur["feld"]) in set(sitzplaetze("", szene | {"figuren": []}, katalog_einmal()))
        else "boden"
    )


@lru_cache(maxsize=1)
def katalog_einmal() -> dict:
    """Möbelkatalog, einmal geladen."""
    return lade_moebel()


def sitzplaetze(karte: str, szene: dict, katalog: dict) -> list[tuple[int, int]]:
    """Felder auf echten Sitzmöbeln einer Karte (Mitte der Kachel im Möbel), ohne Figuren darauf."""
    belegt = {tuple(f["feld"]) for f in szene.get("figuren", [])}
    belegt |= {tuple(b["feld"]) for b in szene.get("belebung", [])}
    felder = []
    for s in platziere(szene, katalog)[0]:
        if not ist_sitzmoebel(s["name"], katalog.get(s["name"], {}).get("art")) or s.get("auf"):
            continue
        for x in range(s["x"] // K, (s["x"] + s["breite"] - 1) // K + 1):
            for y in range(s["y"] // K, (s["y"] + s["hoehe"] - 1) // K + 1):
                mitte = (x * K + K / 2, y * K + K / 2)
                if s["x"] <= mitte[0] < s["x"] + s["breite"] and s["y"] <= mitte[1] < s["y"] + s["hoehe"]:
                    if (x, y) not in belegt:
                        felder.append((x, y))
    return sorted(set(felder))


def betten(szene: dict, katalog: dict) -> list[tuple[int, int]]:
    """Liegeplätze: erste Kachel jedes Betts einer Karte."""
    return [
        tuple(o["feld"])
        for o in szene.get("objekte", [])
        if o.get("feld")
        and (katalog.get(o["moebel"], {}).get("art") == "bett" or re.search(r"[Bb]ett(?!s)", o["moebel"]))
        and "brett" not in o["moebel"].lower()
    ]


def erreichbare_felder(szene: dict, katalog: dict) -> set[tuple[int, int]]:
    """Felder, die der Held vom Start aus erreicht (Wände und Möbel, ohne Figuren)."""
    from pipeline.abenteuer.durchgang import gesperrte_felder
    from pipeline.abenteuer.figurensperre import erreichbar
    from pipeline.abenteuer.kartenbau import raster

    zeilen = raster(szene)
    grund = gesperrte_felder(zeilen, platziere(szene, katalog)[0], szene)
    start = {tuple(a["feld"]) for a in szene.get("ausloeser", []) if a["name"] == "start"}
    start = start or {tuple(a["feld"]) for a in szene.get("ausloeser", [])[:1]}
    return erreichbar(start, grund, len(zeilen[0]), len(zeilen))


def umgebung_des_orts(ort: dict, karten: dict, katalog: dict, ausgeschlossen: set) -> dict:
    """Erreichbare Sitzplätze und Betten des Orts (ohne ausgeschlossene, die einen Weg sperrten)."""
    from pipeline.abenteuer.figurensperre import nah

    sitze, liegen = [], []
    for k in ort["karten"]:
        szene = karten.get(k["kennung"])
        if not szene:
            continue
        frei = erreichbare_felder(szene, katalog)
        sitze += [
            (k["kennung"], f)
            for f in sitzplaetze(k["kennung"], szene, katalog)
            if nah(f, frei) and (k["kennung"], f) not in ausgeschlossen
        ]
        liegen += [(k["kennung"], f) for f in betten(szene, katalog) if nah(f, frei)]
    nachts = [
        s
        for s in sitze
        if s[0].split(".")[1] in NACHTKARTEN
        or (karten[s[0]].get("art") == "aussen" and unter_laterne(karten[s[0]], s[1]))
    ]
    return {"sitze": sitze, "betten": liegen, "nachtsitze": nachts}


def unter_laterne(szene: dict, feld: tuple[int, int]) -> bool:
    """Steht eine Laterne höchstens zwei Felder neben dem Sitz? Beispiel: Bank am Uferweg im Park.
    Nur draußen: Eine Stehlampe im Zimmer des Helden ist keine Straßenlaterne."""
    return any(
        re.search(r"[Ll]atern|[Ll]amp", o["moebel"])
        and o.get("feld")
        and abs(o["feld"][0] - feld[0]) <= LATERNENNAEHE
        and abs(o["feld"][1] - feld[1]) <= LATERNENNAEHE
        for o in szene.get("objekte", [])
    )
