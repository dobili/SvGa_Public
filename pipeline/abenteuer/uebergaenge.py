"""Prüfung der Übergänge zwischen Karten: Gegenstücke, Ränder und Türen passen zusammen.

Warum: Karten sahen einzeln ordentlich aus, passten aber nicht zueinander (Rückmeldung des Autors,
9.11.2026): Türen außen an anderer Stelle als innen, Ausgänge am falschen Rand. Diese Prüfung liest
die Übergänge aus ``orte.json`` und die Felder aus den Szenen (``inhalte/abenteuer/szenen``).

Regeln (``docs/spiel/orte/README.md``, Ortsplan):
- Jeder Übergang hat auf der Zielkarte einen Auslöser dieses Namens, der zurückführt.
- Liegt ein Übergang am Kartenrand, liegt sein Gegenstück am gegenüberliegenden Rand (Ost ↔ West,
  Nord ↔ Süd); Wege laufen über den Rand weiter, also gleich viele Felder auf beiden Seiten.
- Eine Tür auf der Südwand einer Innenkarte führt nach draußen zu einer Tür, nicht an einen Rand.

Aufruf: ``python -m pipeline.abenteuer.uebergaenge`` (Befunde, Rückgabewert 1 bei Befunden).
"""

import json
import sys
from pathlib import Path

HAUPT = Path(__file__).resolve().parents[2]
INHALTE = HAUPT / "inhalte" / "abenteuer"
GEGENUEBER = {"west": "ost", "ost": "west", "nord": "sued", "sued": "nord"}


def szenen() -> dict[str, dict]:
    """Kennung der Karte → Szene der Grundkarte (Zustände wie „-neu“ zählen nicht, Runde 8)."""
    orte = json.loads((INHALTE / "orte.json").read_text(encoding="utf-8"))["orte"]
    zustandsdateien = {d for o in orte for k in o["karten"] for d in k.get("zustaende", {}).values()}
    ergebnis = {}
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        if szene.get("datei") not in zustandsdateien:
            ergebnis[szene["karte"]] = szene
    return ergebnis


def uebergaenge() -> list[dict]:
    """Alle Übergänge und Dialog-Auslöser aus orte.json, je mit Ort (für Auslöser ohne
    Kartenangabe). Dialoge gehören dazu, weil Reisen mit Bus oder Fähre als Dialog beginnen."""
    orte = json.loads((INHALTE / "orte.json").read_text(encoding="utf-8"))["orte"]
    return [
        {**a, "ort": o["kennung"]}
        for o in orte
        for a in o.get("ausloeser", [])
        if a.get("art") in ("uebergang", "dialog")
    ]


def regel_fuer(liste: list[dict], karte: str, name: str) -> dict | None:
    """Der Übergang, der für einen Auslöser auf einer Karte gilt: mit passender Kartenangabe, sonst
    der ohne Kartenangabe aus demselben Ort."""
    ort = karte.split(".")[0]
    genau = [a for a in liste if a["name"] == name and a.get("karte") == karte]
    allgemein = [a for a in liste if a["name"] == name and "karte" not in a and a["ort"] == ort]
    return (genau or allgemein or [None])[0]


def felder(szene: dict, name: str) -> list[tuple[int, int]]:
    return [tuple(a["feld"]) for a in szene.get("ausloeser", []) if a["name"] == name]


def rand(szene: dict, feld: tuple[int, int]) -> str | None:
    """Rand, auf dem ein Feld liegt (west, ost, nord, sued), sonst None."""
    breite = max(len(z) for z in szene["raster"])
    hoehe = len(szene["raster"])
    x, y = feld
    if x == 0:
        return "west"
    if x == breite - 1:
        return "ost"
    if y == 0:
        return "nord"
    if y == hoehe - 1:
        return "sued"
    return None


def pruefe(alle: dict[str, dict], liste: list[dict]) -> list[str]:
    befunde = []
    for karte, szene in alle.items():
        namen = {a["name"] for a in szene.get("ausloeser", [])}
        for name in sorted(namen):
            regel = regel_fuer(liste, karte, name)
            if not regel or regel.get("art") != "uebergang":
                continue
            if "ziel" not in regel:
                # Übergang ohne Ziel: der Nachbarort ist noch nicht eingetragen (Steinbruch, Nacht
                # 9./10.11.2026). Melden statt abbrechen, damit die übrigen Prüfungen laufen.
                befunde.append(f"{karte} {name}: Übergang ohne Ziel in orte.json")
                continue
            ziel_karte, ziel_name = regel["ziel"]["karte"], regel["ziel"]["ausloeser"]
            ziel = alle.get(ziel_karte)
            if ziel is None:
                continue  # Zielkarte noch ohne Szene (etwa der Flussweg).
            if not felder(ziel, ziel_name):
                befunde.append(f"{karte} {name}: Ziel {ziel_karte} hat keinen Auslöser {ziel_name}")
                continue
            zurueck = regel_fuer(liste, ziel_karte, ziel_name)
            if zurueck and zurueck.get("art") == "dialog":
                # Reise mit Bus oder Fähre: Hin- und Rückfahrt sind Dialoge, kein Weg über den Rand;
                # der Ankunftspunkt muss nur existieren (Raststätte ↔ Ironwood, 9./10.11.2026).
                continue
            if not zurueck or zurueck.get("ziel", {}).get("karte") != karte:
                befunde.append(f"{karte} {name}: {ziel_karte} {ziel_name} führt nicht zurück")
            hier = {rand(szene, f) for f in felder(szene, name)}
            dort = {rand(ziel, f) for f in felder(ziel, ziel_name)}
            innen = szene.get("art") == "innen"
            ziel_innen = ziel.get("art") == "innen"
            if not innen and not ziel_innen and hier != {None}:
                erwartet = {GEGENUEBER[r] for r in hier if r}
                if dort != erwartet:
                    befunde.append(
                        f"{karte} {name}: Gegenstück auf {ziel_karte} am Rand "
                        f"{sorted(dort, key=str)} statt {sorted(erwartet)}"
                    )
                elif len(felder(szene, name)) != len(felder(ziel, ziel_name)):
                    befunde.append(
                        f"{karte} {name}: Weg über den Rand ungleich breit "
                        f"({len(felder(szene, name))} ↔ {len(felder(ziel, ziel_name))} Felder)"
                    )
            if innen and not ziel_innen and hier == {"sued"} and dort != {None}:
                befunde.append(f"{karte} {name}: Tür in der Südwand führt an den Rand von {ziel_karte}")
    return befunde


def main() -> int:
    befunde = pruefe(szenen(), uebergaenge())
    for b in befunde:
        print(f"- {b}")
    print("Übergänge in Ordnung" if not befunde else f"{len(befunde)} Befunde")
    return 1 if befunde else 0


if __name__ == "__main__":
    sys.exit(main())
