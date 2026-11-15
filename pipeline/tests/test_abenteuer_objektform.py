"""Tests für ``pipeline.abenteuer.objektform`` und die neuen Objektfelder im Kartenbau.

Warum: Der Karteneditor speichert ``drehung``, ``spiegeln``, ``massstab`` und ``ebene``; Kartenbau,
App und Editor müssen sie gleich verstehen. Bestehende Szenen ohne diese Felder dürfen sich nicht
ändern. Kleine Kunstdaten, ohne private Bilder.
"""

import pytest

from pipeline.abenteuer.kartenbau import platziere, sperrfelder, tiled
from pipeline.abenteuer.objektform import (
    drehe_maske,
    formbefunde,
    formeigenschaften,
    geformt,
    hat_form,
    wirksame_groesse,
)

SOFA = {"quelle": "x.png", "breite": 64, "hoehe": 32, "kollision": True}
TOR = {"quelle": "t.png", "breite": 32, "hoehe": 48, "kollision": True, "maske": ["..", "#.", "#."]}
TISCH = {"quelle": "t.png", "breite": 48, "hoehe": 32, "kollision": True}
VASE = {"quelle": "v.png", "breite": 16, "hoehe": 16, "kollision": False}
MOEBEL = {"sofa": SOFA, "tor": TOR, "tisch": TISCH, "vase": VASE}


def test_ohne_form_bleibt_die_angabe_gleich():
    assert geformt(SOFA, {"moebel": "sofa", "feld": [1, 1]}) is SOFA
    assert not hat_form({"drehung": 0, "spiegeln": False, "massstab": 1})


def test_drehung_tauscht_breite_und_hoehe():
    assert wirksame_groesse(64, 32, {"drehung": 90}) == (32, 64)
    assert wirksame_groesse(64, 32, {"drehung": 180}) == (64, 32)
    assert wirksame_groesse(64, 32, {"massstab": 1.5, "drehung": 270}) == (48, 96)


def test_maske_dreht_im_uhrzeigersinn_und_spiegelt():
    assert drehe_maske(["#.", ".."], 2, 2, 90, False) == [".#", ".."]
    assert drehe_maske(["#.", ".."], 2, 2, 180, False) == ["..", ".#"]
    assert drehe_maske(["#.", ".."], 2, 2, 0, True) == [".#", ".."]
    # Kurze Maske wird aufgefüllt (fehlende Stellen frei, wie maske.py).
    assert drehe_maske(["#"], 2, 2, 90, False) == [".#", ".."]


def test_geformt_dreht_maske_und_laesst_sie_bei_massstab_weg():
    gedreht = geformt(TOR, {"drehung": 90})
    assert (gedreht["breite"], gedreht["hoehe"]) == (48, 32)
    assert gedreht["maske"] == ["##.", "..."]
    assert "maske" not in geformt(TOR, {"massstab": 2})


def test_kartenbau_rechnet_mit_gedrehter_groesse_und_ebene():
    szene = {
        "objekte": [
            {"moebel": "sofa", "feld": [2, 2], "drehung": 90, "ebene": 5},
            {"moebel": "sofa", "feld": [6, 2]},
        ]
    }
    gesetzt, befunde = platziere(szene, MOEBEL)
    assert befunde == []
    gedreht, normal = gesetzt
    assert (gedreht["breite"], gedreht["hoehe"]) == (32, 64)
    assert gedreht["tiefe"] == 32 + 64 - 8 + 5
    assert gedreht["drehung"] == 90 and "drehung" not in normal
    # Kollision nach Drehung: 2 Spalten, 4 Reihen ohne die oberste.
    assert sperrfelder(gedreht) == {(x, y) for x in (2, 3) for y in (3, 4, 5)}


def test_gegenstand_auf_dem_tisch_folgt_der_ebene_des_tisches():
    szene = {
        "objekte": [
            {"moebel": "tisch", "feld": [1, 1], "id": "t", "ebene": -3},
            {"moebel": "vase", "auf": "t"},
        ]
    }
    tisch, vase = platziere(szene, MOEBEL)[0]
    assert vase["tiefe"] == tisch["tiefe"] + 1


def test_tiled_traegt_die_form_als_eigenschaften():
    szene = {"karte": "test.raum", "objekte": [{"moebel": "sofa", "feld": [1, 1], "spiegeln": True}]}
    zeilen = ["." * 8] * 6
    gesetzt, _ = platziere(szene, MOEBEL)
    vorlage = {"tilesets": []}
    karte = tiled(szene, zeilen, gesetzt, vorlage)
    objekt = karte["layers"][3]["objects"][0]
    assert {"name": "spiegeln", "type": "bool", "value": True} in objekt["properties"]
    ohne = tiled(
        {**szene, "objekte": [{"moebel": "sofa", "feld": [1, 1]}]},
        zeilen,
        platziere({"objekte": [{"moebel": "sofa", "feld": [1, 1]}]}, MOEBEL)[0],
        vorlage,
    )
    namen = {e["name"] for e in ohne["layers"][3]["objects"][0]["properties"]}
    assert namen == {"tiefe", "kollision"}


def test_formeigenschaften_und_befunde():
    assert formeigenschaften({"drehung": 90, "massstab": 2}) == [
        {"name": "drehung", "type": "int", "value": 90},
        {"name": "massstab", "type": "float", "value": 2.0},
    ]
    befunde = formbefunde(
        {"objekte": [{"moebel": "sofa", "feld": [1, 2], "drehung": 45, "massstab": 5, "ebene": 1.5}]}
    )
    assert len(befunde) == 3
    assert formbefunde({"objekte": [{"moebel": "sofa", "feld": [1, 2], "drehung": 270}]}) == []


def test_formbild_dreht_spiegelt_und_skaliert():
    image = pytest.importorskip("PIL.Image")
    from pipeline.abenteuer.objektform import formbild

    bild = image.new("RGBA", (4, 2))
    bild.putpixel((0, 0), (255, 0, 0, 255))
    gedreht = formbild(bild, {"drehung": 90})
    assert gedreht.size == (2, 4)
    assert gedreht.getpixel((1, 0)) == (255, 0, 0, 255)  # oben links → oben rechts
    assert formbild(bild, {"spiegeln": True}).getpixel((3, 0)) == (255, 0, 0, 255)
    assert formbild(bild, {"massstab": 2}).size == (8, 4)
