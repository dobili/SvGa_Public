"""Jahreszeit der Karten: passt sie zum Ort, und springt sie nicht an der Kartengrenze (RO53.5).

Warum: Die Gutachter des Kartenblicks (24.11.2026) fanden die Raststätte an der Glasbrücke im Schnee,
die Nachbarkarte im Sommer; im Süden lag Sommergrün mitten im Winter von Akt 3. Die Weltbeschreibung
(docs/spiel/09_Weltbeschreibung.md, Abschnitt 2) legt die Jahreszeit je Akt fest: Akt 3 spielt im
Winter, Silicon Bay ohne Jahreszeit, Port Delacroix im nassen Winter ohne Schnee (RO21). Der Autor hat
entschieden (RO53.5): Winter ohne Schnee im Süden, Schnee nur im Norden und in den Bergen.

Werte der Szeneneigenschaft ``jahreszeit`` (winter.py): ``winter`` (Schnee), ``winter_mild`` (Winter
ohne Schnee: fahles Gras, kahle Laubbäume), keine (so, wie die Bilder der Pakete sind: Sommer, Herbst).

Regeln (nur Außenkarten):
1. Pflicht: Die Karten in ``PFLICHT`` haben genau diese Jahreszeit (Entscheidung des Autors).
2. Ort: ``winter`` nur in ``SCHNEE_ORTE`` (Norden, Berge), ``winter_mild`` nur in ``SUED_ORTE``.
3. Nachbarn: Zwei Grundkarten, die über einen Ausgang am Kartenrand aneinanderstoßen (zu Fuß, keine
   Bus- oder Fährfahrt), dürfen nicht Schnee und keine Jahreszeit haben (Sprung vom Schnee in den
   Sommer). Winter ohne Schnee liegt dazwischen und darf an beide grenzen.
Aufruf: ``python -m pipeline.abenteuer.jahreszeit``. Dauertest ``test_abenteuer_jahreszeit.py`` (0).
"""

import json
import sys
from pathlib import Path

from pipeline.abenteuer.kartenbau import raster

INHALTE = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"
SZENEN = INHALTE / "szenen"
# Karte → Jahreszeit (RO53.5: Süden im Winter von Akt 3, ohne Schnee; Raststätte an der Küste).
PFLICHT = {
    "siliconBay.altstadt": "winter_mild",
    "pelikaninsel.dorf": "winter_mild",
    "wegSiliconDelacroix.deich": "winter_mild",
    "wegIronwoodSilicon.glasbruecke": "winter_mild",
    "wegIronwoodSilicon.raststaette": "winter_mild",
}
# Norden (Akt 2, erster Schnee am Ende) und Berge.
SCHNEE_ORTE = {
    "riverton", "ironwood", "lockport", "steinbruch", "sternwarte", "goldmine", "wegCedarRiverton",
    "wegRivertonIronwood", "summitCity", "hochebene", "wegDesertSummit",
}  # fmt: skip
# Süden im Winter von Akt 3 (Weltbeschreibung Abschnitt 2, RO21, RO53.5).
SUED_ORTE = {
    "siliconBay", "pelikaninsel", "wegSiliconDelacroix", "wegIronwoodSilicon", "portDelacroix", "bayou",
}  # fmt: skip
GEGENSATZ = {"winter", None}  # Schnee neben Sommer ist ein Sprung
# (Karte, Nachbar) → Grund.
AUSNAHMEN: dict[tuple[str, str], str] = {}


def lade_szenen() -> dict[str, dict]:
    """Alle Szenen nach Dateiname (ohne .json)."""
    return {p.stem: json.loads(p.read_text(encoding="utf-8")) for p in sorted(SZENEN.glob("*.json"))}


def grundkarten(orte: dict) -> dict[str, str]:
    """Karte (z. B. ``wegIronwoodSilicon.glasbruecke``) → Dateiname ihrer Grundszene."""
    return {k["kennung"]: Path(k["datei"]).stem for o in orte["orte"] for k in o["karten"]}


def _am_rand(szene: dict, name: str) -> bool:
    """Ob ein Auslöser dieses Namens am Kartenrand liegt (Ausgang zu Fuß)."""
    zeilen = raster(szene)
    hoehe, breite = len(zeilen), len(zeilen[0])
    for a in szene.get("ausloeser", []):
        x, y = a["feld"]
        if a["name"] == name and (x in (0, breite - 1) or y in (0, hoehe - 1)):
            return True
    return False


def nachbarn(orte: dict, szenen: dict[str, dict]) -> set[tuple[str, str]]:
    """Paare von Karten (sortiert), die über einen Ausgang am Kartenrand aneinanderstoßen."""
    grund = grundkarten(orte)
    paare = set()
    for ort in orte["orte"]:
        for a in ort.get("ausloeser", []):
            karte, ziel = a.get("karte"), (a.get("ziel") or {}).get("karte")
            szene = szenen.get(grund.get(karte, ""))
            if a.get("art") == "uebergang" and ziel in grund and szene and _am_rand(szene, a["name"]):
                paare.add(tuple(sorted((karte, ziel))))
    return paare


def pruefe() -> list[str]:
    """Alle Befunde, je Zeile „Karte: Befund“."""
    orte = json.loads((INHALTE / "orte.json").read_text(encoding="utf-8"))
    szenen, befunde = lade_szenen(), []
    for name, szene in szenen.items():
        if szene.get("art") != "aussen" or "karte" not in szene:
            continue
        karte, wert = szene["karte"], szene.get("jahreszeit")
        ort = karte.split(".")[0]
        if karte in PFLICHT and wert != PFLICHT[karte]:
            befunde.append(f"{name}: Jahreszeit {wert!r}, entschieden ist {PFLICHT[karte]!r} (RO53.5)")
        if wert == "winter" and ort not in SCHNEE_ORTE:
            befunde.append(f"{name}: Schnee, aber {ort} liegt nicht im Norden oder in den Bergen")
        if wert == "winter_mild" and ort not in SUED_ORTE:
            befunde.append(f"{name}: Winter ohne Schnee, aber {ort} liegt nicht im Süden von Akt 3")
    grund = grundkarten(orte)
    for a, b in sorted(nachbarn(orte, szenen)):
        werte = {szenen[grund[a]].get("jahreszeit"), szenen[grund[b]].get("jahreszeit")}
        if werte == GEGENSATZ and (a, b) not in AUSNAHMEN:
            befunde.append(f"{a}: grenzt an {b}, Schnee neben Sommer (Sprung an der Kartengrenze)")
    return befunde


def main() -> int:
    """Befunde drucken."""
    befunde = pruefe()
    for b in befunde:
        print(b)
    print(f"{len(befunde)} Befunde")
    return 0


if __name__ == "__main__":
    sys.exit(main())
