"""Liste der Zustände je Karte: Bedingung, Datei, Bild und der „Zustand:“-Satz der Szene.

Warum: Runde 8. Der Autor will jede Fassung einer Karte sehen, die es in der Geschichte gibt, mit
der Beschreibung, wo das in der Geschichte ist, was sich geändert hat und warum. Der Haupt-Chat
baut aus dieser Liste die Seite für ihn.

Quelle: ``zustaende`` der Karten in ``orte.json`` (Bedingung → ``karten/<basis>-<zustand>.json``,
der letzte passende Zustand gilt) und die Szene je Datei (``beschreibung`` beginnt mit
„Zustand: …“). Bild: ``grafik/karten/<kennung>-<zustand>.png`` (kartenbild.py).

Aufruf: ``python -m pipeline.abenteuer.zustaende`` (Text) oder ``… --json`` (Liste als JSON).
Rückgabewert 1, wenn eine Bedingung fehlerhaft ist oder eine Szene fehlt.
"""

import json
import re
import sys
from pathlib import Path

from pipeline.abenteuer.bedingung import Bedingungsfehler, variablen

INHALTE = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"
SATZ = re.compile(r"Zustand:\s*(.*?[.!?])(?:\s|$)", re.S)


def zustandsname(datei: str, basis: str) -> str:
    """Teil des Dateinamens hinter der Grundkarte, wie in der App (oberwelt/kartenfassung.ts).

    Beispiel: karten/port-delacroix-musikhaus-neu.json zur Basis karten/port-delacroix-musikhaus.json
    → „neu“; passt die Datei nicht zur Basis, gilt ihr ganzer Stamm.
    """
    stamm = Path(datei).stem
    vorne = Path(basis).stem + "-"
    return stamm[len(vorne) :] if stamm.startswith(vorne) and len(stamm) > len(vorne) else stamm


def szenen_nach_datei() -> dict[str, dict]:
    """Datei der Tiled-Karte → Szene (nur Hauptfassungen, keine Varianten B und C)."""
    ergebnis = {}
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        if szene.get("datei"):
            ergebnis[szene["datei"]] = {**szene, "_pfad": pfad.name}
    return ergebnis


def zustandssatz(beschreibung: str) -> str | None:
    """Der erste Satz ab „Zustand:“ in der Beschreibung, sonst None."""
    treffer = SATZ.search(beschreibung or "")
    return treffer.group(1).strip() if treffer else None


def liste() -> tuple[list[dict], list[str]]:
    """Alle Zustände in der Reihenfolge von orte.json, dazu Befunde."""
    orte = json.loads((INHALTE / "orte.json").read_text(encoding="utf-8"))["orte"]
    szenen = szenen_nach_datei()
    eintraege, befunde = [], []
    for ort in orte:
        for karte in ort["karten"]:
            for bedingung, datei in karte.get("zustaende", {}).items():
                name = zustandsname(datei, karte["datei"])
                try:
                    fragt = sorted(variablen(bedingung))
                except Bedingungsfehler as f:
                    befunde.append(f"{karte['kennung']}: {f}")
                    fragt = []
                szene = szenen.get(datei)
                if not szene:
                    befunde.append(f"{karte['kennung']}: keine Szene für {datei}")
                satz = zustandssatz(szene.get("beschreibung", "")) if szene else None
                eintraege.append(
                    {
                        "karte": karte["kennung"],
                        "zustand": name,
                        "bedingung": bedingung,
                        "variablen": fragt,
                        "datei": datei,
                        "szene": szene["_pfad"] if szene else None,
                        "bild": f"grafik/karten/{karte['kennung']}-{name}.png",
                        "satz": satz,
                    }
                )
    return eintraege, befunde


def main() -> int:
    eintraege, befunde = liste()
    if "--json" in sys.argv[1:]:
        print(json.dumps(eintraege, ensure_ascii=False, indent=2))
    else:
        karte = None
        for e in eintraege:
            if e["karte"] != karte:
                karte = e["karte"]
                print(karte)
            print(f"  {e['zustand']}: wenn {e['bedingung']}")
            print(f"    {e['satz'] or '(kein „Zustand:“-Satz in der Beschreibung)'}")
    for b in befunde:
        print(f"Befund: {b}", file=sys.stderr)
    return 1 if befunde else 0


if __name__ == "__main__":
    sys.exit(main())
