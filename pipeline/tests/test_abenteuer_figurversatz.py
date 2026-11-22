"""Tests des feinen Figurversatzes (Editor 1.8, Wunsch des Autors 22.11.2026).

Eine Figur trägt optional ``versatz: [dx, dy]`` in Kartenpixeln (nur Darstellung, höchstens ±8).
Geprüft: Lesen und Begrenzen (kartentiled.figurversatz), die Eigenschaft der Tiled-Karte, der
Rücklauf aus dem Editor (editorrueck: Bericht und Bereinigen) und als Dauertest alle Szenen.
"""

import json
from pathlib import Path

from pipeline.abenteuer import editorrueck
from pipeline.abenteuer.kartentiled import VERSATZ_GRENZE, figurversatz, tiled

SZENEN = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer" / "szenen"


def test_versatz_lesen_und_begrenzen():
    assert figurversatz({"versatz": [0, -3]}) == (0, -3)
    assert figurversatz({"versatz": [12, -20]}) == (VERSATZ_GRENZE, -VERSATZ_GRENZE)
    assert figurversatz({"versatz": [0, 0]}) is None
    assert figurversatz({"versatz": "kaputt"}) is None
    assert figurversatz({}) is None


def test_tiled_fuehrt_versatz_als_eigenschaft():
    szene = {
        "karte": "ort.raum",
        "figuren": [{"name": "sam", "feld": [5, 8], "sitzt": "rechts", "versatz": [0, -3]}],
    }
    karte = tiled(szene, ["....."] * 10, [], {"tilesets": []})
    figur = next(
        o for e in karte["layers"] if e.get("objects") for o in e["objects"] if o.get("name") == "sam"
    )
    eigenschaften = {p["name"]: p["value"] for p in figur["properties"]}
    assert eigenschaften == {"sitzt": "rechts", "versatz": "0,-3"}
    assert (figur["x"], figur["y"]) == (5 * 16, 8 * 16)  # die Fußkachel bleibt das Feld


def _aenderung(vorher: dict, nachher: dict) -> dict:
    return {
        "format": "karteneditor-aenderungen",
        "fassung": 1,
        "editor_version": "1.8.0",
        "zeitstempel": "2026-11-22T12:00:00Z",
        "szenen": [
            {"datei": "raum.json", "karte": "ort.raum", "vorher": vorher, "nachher": nachher, "zuordnung": []}
        ],
    }


def test_ruecklauf_berichtet_und_begrenzt_den_versatz(tmp_path):
    vorher = {"karte": "ort.raum", "objekte": [], "figuren": [{"name": "sam", "feld": [5, 8]}]}
    nachher = {
        "karte": "ort.raum",
        "objekte": [],
        "figuren": [{"name": "sam", "feld": [5, 8], "versatz": [1, -12]}],
    }
    zeilen = editorrueck.berichte(_aenderung(vorher, nachher)["szenen"][0])
    assert "Versatz (figuren): sam (0, 0) px → (1, -8) px" in zeilen
    szenen = tmp_path / "szenen"
    szenen.mkdir()
    (szenen / "raum.json").write_text(editorrueck.als_text(vorher), encoding="utf-8")
    datei = tmp_path / "aenderung.json"
    datei.write_text(json.dumps(_aenderung(vorher, nachher)), encoding="utf-8")
    assert editorrueck.main([str(datei), "--szenen", str(szenen), "--bericht", str(tmp_path / "b")]) == 0
    geschrieben = json.loads((szenen / "raum.json").read_text(encoding="utf-8"))
    assert geschrieben["figuren"][0]["versatz"] == [1, -8]


def test_ruecklauf_laesst_leeren_versatz_weg():
    szene = {"figuren": [{"name": "sam", "feld": [5, 8], "versatz": [0, 0]}]}
    editorrueck.bereinige_figurversatz(szene)
    assert "versatz" not in szene["figuren"][0]


def test_alle_szenen_haben_gueltige_figurversaetze():
    """Dauertest: Jeder Versatz einer Figur ist ein Paar ganzer Zahlen innerhalb ±8."""
    fehler = []
    for datei in sorted(SZENEN.rglob("*.json")):
        for f in json.loads(datei.read_text(encoding="utf-8")).get("figuren", []):
            if "versatz" not in f:
                continue
            wert = f["versatz"]
            gueltig = isinstance(wert, list) and len(wert) == 2 and all(isinstance(v, int) for v in wert)
            if not gueltig or figurversatz(f) != tuple(wert):
                fehler.append(f"{datei.name}: {f['name']} {wert}")
    assert fehler == []
