"""Zustand und Standbild an einer Stelle der Szene (Karteneditor 1.9, 23.11.2026)."""

import json
from pathlib import Path

from pipeline.abenteuer import editorrueck, figurzustand, kartentiled
from pipeline.abenteuer import figurzustand as fz

SZENEN = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer" / "szenen"


def test_alle_szenen_nur_bekannte_zustaende():
    befunde = []
    for datei in sorted(SZENEN.rglob("*.json")):
        szene = json.loads(datei.read_text(encoding="utf-8"))
        if isinstance(szene, dict):
            befunde += [f"{datei.name}: {b}" for b in fz.befunde(szene)]
    assert befunde == []


def test_eigenschaften_der_figur():
    eig = fz.figureigenschaften({"name": "abe", "zustand": "sitzboden", "standbild": "ohne-teleskop"})
    assert {e["name"]: e["value"] for e in eig} == {"zustand": "sitzboden", "standbild": "ohne-teleskop"}
    assert fz.figureigenschaften({"name": "abe", "zustand": "fliegen"}) == []


def test_befunde_fuer_tier_und_statist():
    szene = {
        "belebung": [
            {"name": "kuh", "typ": "tier", "feld": [1, 1], "eigenschaften": {"zustand": "grasen"}},
            {"name": "katze", "typ": "tier", "feld": [1, 1], "eigenschaften": {"zustand": "sitzstuhl"}},
            {"name": "gast", "typ": "statist", "feld": [1, 1], "eigenschaften": {"zustand": "sitzboden"}},
        ]
    }
    assert fz.befunde(szene) == ["tier katze: Zustand „sitzstuhl“ unbekannt"]


def test_kartentiled_schreibt_zustand():
    szene = {
        "karte": "probe.raum",
        "figuren": [{"name": "abe", "feld": [1, 1], "zustand": "liegt", "standbild": "idle"}],
    }
    karte = kartentiled.tiled(szene, ["...", "...", "..."], [], {"tilesets": []})
    objekte = next(e for e in karte["layers"] if e["name"] == "ausloeser")["objects"]
    abe = next(o for o in objekte if o["name"] == "abe")
    werte = {e["name"]: e["value"] for e in abe["properties"]}
    assert werte["zustand"] == "liegt"
    assert werte["standbild"] == "idle"


def test_bericht_und_bereinigen():
    vorher = {"figuren": [{"name": "abe", "feld": [1, 1]}]}
    nachher = {"figuren": [{"name": "abe", "feld": [1, 1], "zustand": "sitzboden", "standbild": "idle"}]}
    zeilen = editorrueck.markierungszeilen({"vorher": vorher, "nachher": nachher})
    assert "Zustand (figuren): abe Regel → sitzboden, Standbild idle" in zeilen
    szene = {"figuren": [{"name": "abe", "zustand": "fliegen", "standbild": "Mit Hut"}]}
    figurzustand.bereinige(szene)
    assert szene["figuren"][0] == {"name": "abe"}
