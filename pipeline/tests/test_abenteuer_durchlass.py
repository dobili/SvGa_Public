"""Prüfung auf pixelgenaue Durchlässe (durchlass.py).

Warum: Im Spieler-Durchlauf vom 18.11.2026 (Fable, Fund 4) kam der Held in der Bergstation von
Summit City kaum vom Geländer zurück zur Seilbahn: Zwischen Spind und Kabinenwand blieb nur eine
Lücke von genau seiner Körperbreite.
"""

import copy
import json

from pipeline.abenteuer.durchlass import pruefe, pruefe_szene
from pipeline.abenteuer.kartenbau import INHALTE
from pipeline.abenteuer.moebelliste import lade_moebel


def _szene(datei: str) -> dict:
    return copy.deepcopy(json.loads((INHALTE / "szenen" / f"{datei}.json").read_text(encoding="utf-8")))


def test_keine_szene_hat_einen_pixelgenauen_durchlass_zu_einem_ziel():
    """Alle Szenen: Jedes Ziel ist mit Spielraum (16 px) erreichbar."""
    befunde, _ = pruefe()
    assert befunde == []


def test_bergstation_vor_dem_umbau_wird_gemeldet():
    """Spind auf (11, 16), Geländer 4 px tiefer, ohne Sperre über Victor: Seilbahn, Victor abgeschnitten."""
    szene = _szene("summit-city-bergstation")
    szene.pop("sperren_fein")
    for stueck in szene["objekte"]:
        if stueck["moebel"] == "iwSpind":
            stueck["feld"] = [11, 16]
        if stueck["moebel"] == "sc16Gelaender":
            stueck["versatz"] = [4, 4]
    befunde, _ = pruefe_szene(szene, lade_moebel())
    assert any("fahrplan" in b for b in befunde)
    assert any("Figur victor" in b for b in befunde)


def test_bergstation_nach_dem_umbau_ist_frei():
    """Spind auf (10, 16), Geländer auf Höhe der Ecken, Sperre über Victor: kein Befund, kein Hinweis."""
    assert pruefe_szene(_szene("summit-city-bergstation"), lade_moebel()) == ([], [])
