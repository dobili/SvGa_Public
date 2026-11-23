"""Tiere der Belebung stehen dort, wo sie hingehören (Szenen, inhalte/abenteuer/szenen/*.json).

Warum: Prüfung der PixelLab-Tiere im Spiel (Nachtauftrag des Hauptchats, 23.11.2026). Ein Tier am
Boden auf einer gesperrten Kachel (Möbel, Wand) oder im Wasser steht im Spiel in der Wand oder
schwimmt auf dem Wasser; ein Schwimmer an Land zeigt seine Wasserfläche auf dem Gras. Gefunden und
behoben: Hund in Cedar Creek (17, 19, gesperrt). Fliegende Tiere dürfen über allem stehen.
"""

import glob
import json
from pathlib import Path

from pipeline.abenteuer.kartenbau import WASSER, platziere, raster
from pipeline.abenteuer.kollisionfein import kachelzellen, sperrzellen
from pipeline.abenteuer.moebelliste import lade_moebel

SZENEN = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer" / "szenen"


def _befunde(pfad: Path, moebel: dict) -> list[str]:
    szene = json.loads(pfad.read_text(encoding="utf-8"))
    tiere = [b for b in szene.get("belebung", []) if b.get("typ") == "tier"]
    if not tiere:
        return []
    zeilen = raster(szene)
    gesetzt, _ = platziere(szene, moebel)
    gesperrt = sperrzellen(zeilen, gesetzt, szene)
    befunde = []
    for b in tiere:
        verhalten = b.get("eigenschaften", {}).get("verhalten", "sitzen")
        x, y = b["feld"]
        im_wasser = zeilen[y][x] == WASSER
        if verhalten == "fliegen":
            continue
        if verhalten == "schwimmen":
            if not im_wasser:
                befunde.append(f"{pfad.name}: {b['name']} {x},{y} schwimmt an Land")
        elif im_wasser:
            befunde.append(f"{pfad.name}: {b['name']} {x},{y} steht im Wasser")
        elif any(z in gesperrt for z in kachelzellen((x, y))):
            befunde.append(f"{pfad.name}: {b['name']} {x},{y} steht auf einer gesperrten Kachel")
    return befunde


def test_tiere_stehen_frei():
    moebel = lade_moebel()
    befunde = [f for p in sorted(glob.glob(str(SZENEN / "*.json"))) for f in _befunde(Path(p), moebel)]
    assert befunde == [], "\n".join(befunde)
