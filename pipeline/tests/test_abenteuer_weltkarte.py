"""Datenteil der Weltkarte (pipeline/abenteuer/weltkarte.py): Fassungen, Ausgänge, Reisen, Seite.

Warum: Die Weltkarte zeigt, wie die Karten zusammenhängen. Falsche Ausgänge oder fehlende Reisen
fielen auf der Seite nur beim genauen Hinsehen auf; hier wird der Datenteil ohne Grafik geprüft.
"""

import json

from pipeline.abenteuer.weltkarte import PLATZHALTER, erreichbar, html, kartendaten, knotentext

SZENEN = {
    "ort.a": {
        "raster": ["####", "#..#"],
        "ausloeser": [{"name": "tuer", "feld": [1, 1]}, {"name": "bus", "feld": [2, 1]}],
    },
    "ort.b": {"raster": ["###", "#.#"], "ausloeser": [{"name": "zurueck", "feld": [1, 1]}]},
    "weg.c": {"raster": ["##", ".."], "ausloeser": [{"name": "ankunft", "feld": [0, 1]}]},
}
REGELN = [
    {"name": "tuer", "art": "uebergang", "ort": "ort", "ziel": {"karte": "ort.b", "ausloeser": "zurueck"}},
    {"name": "bus", "art": "dialog", "ort": "ort", "dialog": "halle.bus"},
]
INK = {"halle": '=== bus ===\nFahren?\n-> fahrt\n=== fahrt ===\n~ reise("weg.c", "ankunft")\n-> END\n'}
ZUSTAENDE = [{"karte": "ort.a", "zustand": "nacht", "satz": "nachts ist es dunkel"}]
GROESSEN = {"ort.a": (64, 32), "ort.a-nacht": (64, 32), "ort.b": (48, 32), "weg.c": (32, 32)}
TEXTE = {"ort.ort.a": "Halle", "ort.ort.name": "Ort"}


def _daten() -> dict:
    return {k["id"]: k for k in kartendaten(SZENEN, ZUSTAENDE, GROESSEN, REGELN, TEXTE, INK)}


def test_fassungen_namen_und_kachelgroesse():
    a = _daten()["ort.a"]
    assert a["name"] == "Halle" and a["ort"] == "Ort"
    assert a["k"] == 16 and (a["tb"], a["th"]) == (4, 2)
    assert [f["n"] for f in a["f"]] == ["Grundzustand", "nacht"]
    assert a["f"][1]["t"] == "Nachts ist es dunkel"


def test_uebergang_und_reise_aus_dem_dialog():
    ausgaenge = {x["n"]: x for x in _daten()["ort.a"]["a"]}
    assert ausgaenge["tuer"]["art"] == "weg" and ausgaenge["tuer"]["z"] == "ort.b"
    assert ausgaenge["tuer"]["zm"] == [1.5, 1.5]
    assert ausgaenge["bus"]["art"] == "reise" and ausgaenge["bus"]["z"] == "weg.c"


def test_ohne_bild_keine_karte_und_kein_ausgang_dorthin():
    groessen = {k: v for k, v in GROESSEN.items() if k != "weg.c"}
    daten = {k["id"]: k for k in kartendaten(SZENEN, ZUSTAENDE, groessen, REGELN, TEXTE, INK)}
    assert "weg.c" not in daten
    assert [x["n"] for x in daten["ort.a"]["a"]] == ["tuer"]


def test_knotentext_folgt_spruengen():
    assert "reise(" in knotentext(INK, "halle", "bus")
    assert knotentext(INK, "fehlt", "bus") == ""


def test_erreichbar_und_seite_mit_daten():
    karten = list(_daten().values())
    assert erreichbar(karten, "ort.a") == {"ort.a", "ort.b", "weg.c"}
    seite = html(karten)
    assert PLATZHALTER not in seite
    assert json.dumps("Halle", ensure_ascii=False) in seite
