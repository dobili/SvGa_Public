"""Tests für die Übersteuerung der Kollision je Objekt (``objektkollision``), die Bodenkacheln
(``bodenkacheln``, ``bodenteile``) und ihren Weg durch Kartenbau, Prüfungen und Rücklauf.

Warum: Der Autor legt im Karteneditor fest, ob man an einer Stelle durch ein Bild gehen kann, und
baut Treppenabgänge aus Treppenbild und Bodenkacheln (Wunsch des Autors, 16.11.2026). Kartenbau,
Prüfungen und App müssen die Übersteuerung gleich lesen; ohne sie bleibt jede Karte gleich.
Kleine Kunstdaten, ohne private Bilder.
"""

import json

from pipeline.abenteuer import bodenkacheln, editorrueck, karten
from pipeline.abenteuer.anordnung import pruefe_loecher
from pipeline.abenteuer.kartenbau import platziere, sperrfelder, tiled
from pipeline.abenteuer.objektkollision import durchgehbar, kollision_an, kollisionsbefunde, kollisionszeile

SOFA = {"quelle": "s.png", "breite": 64, "hoehe": 32, "kollision": True, "art": "sofa"}
TEPPICH = {"quelle": "t.png", "breite": 32, "hoehe": 32, "kollision": False, "art": "teppich"}
TREPPE = {
    "quelle": "a.png",
    "breite": 48,
    "hoehe": 48,
    "kollision": True,
    "art": "treppe",
    "richtung": "runter",
}
DIELE = {"quelle": "b.png", "ausschnitt": [0, 0, 16, 16], "breite": 16, "hoehe": 16, "art": "boden_teil"}
MOEBEL = {"sofa": SOFA, "teppich": TEPPICH, "treppe": TREPPE, "diele": DIELE}


def _gesetzt(*objekte: dict) -> list[dict]:
    return platziere({"objekte": list(objekte)}, MOEBEL)[0]


def test_kollision_am_objekt_uebersteuert_den_katalog():
    (offen,) = _gesetzt({"moebel": "sofa", "feld": [1, 1], "kollision": False, "begehbar_grund": "Polster"})
    assert not offen["kollision"] and sperrfelder(offen) == set()
    (sperrt,) = _gesetzt({"moebel": "teppich", "feld": [1, 1], "kollision": True})
    assert sperrt["kollision"] and sperrt["tiefe"] == 1  # Tiefe folgt weiter dem Katalog (flach)
    (an_wand,) = _gesetzt({"moebel": "teppich", "feld": [1, 1], "kollision": True, "an_wand": True})
    assert not an_wand["kollision"]
    assert kollision_an(SOFA, {}) and not kollision_an(SOFA, {"kollision": False})


def test_objektmaske_gilt_und_dreht_mit_der_form():
    (ungedreht,) = _gesetzt({"moebel": "sofa", "feld": [0, 0], "maske": ["#...", "...#"]})
    assert sperrfelder(ungedreht) == {(0, 0), (3, 1)}
    # Gedreht um 90 Grad: 2 × 4 Kacheln, die Ecke oben links wandert nach oben rechts.
    (gedreht,) = _gesetzt({"moebel": "sofa", "feld": [0, 0], "maske": ["#...", "...."], "drehung": 90})
    assert (gedreht["breite"], gedreht["hoehe"]) == (32, 64)
    assert sperrfelder(gedreht) == {(1, 0)}
    # Anders als die Katalogmaske bleibt die eigene Maske mit Maßstab erhalten (Raster 8 × 4).
    (gross,) = _gesetzt({"moebel": "sofa", "feld": [0, 0], "maske": ["", "", "", "#"], "massstab": 2})
    assert sperrfelder(gross) == {(0, 3)}


def test_befund_ohne_grund_und_bei_kaputter_maske():
    szene = {
        "objekte": [
            {"moebel": "sofa", "feld": [1, 1], "kollision": False},
            {"moebel": "sofa", "feld": [5, 1], "kollision": False, "begehbar_grund": "nur ein Schatten"},
            {"moebel": "sofa", "feld": [9, 1], "maske": ["....", "...."]},
            {"moebel": "teppich", "feld": [1, 5], "kollision": False},
            {"moebel": "sofa", "feld": [1, 8], "maske": ["#####"]},
            {"moebel": "sofa", "feld": [1, 9], "maske": ["#x"]},
        ]
    }
    befunde = kollisionsbefunde(szene, MOEBEL)
    assert befunde[0] == "sofa (1, 1): durchgehbar ohne begehbar_grund (Regel 10.69)"
    assert "sofa (9, 1): durchgehbar ohne begehbar_grund (Regel 10.69)" in befunde
    assert any("größer als das Bild" in b for b in befunde)
    assert any("nur „#“" in b for b in befunde)
    assert len(befunde) == 4
    assert durchgehbar(SOFA, {"maske": [".."]}) and not durchgehbar(SOFA, {"maske": ["#."]})


def test_tiled_und_pruefung_lesen_die_eigene_maske():
    szene = {"karte": "test.raum", "objekte": [{"moebel": "sofa", "feld": [1, 1], "maske": ["#..."]}]}
    gesetzt = platziere(szene, MOEBEL)[0]
    karte = tiled(szene, ["." * 8] * 6, gesetzt, {"tilesets": []})
    objekt = karte["layers"][3]["objects"][0]
    assert {"name": "maske", "type": "string", "value": "#..."} in objekt["properties"]
    # Die Erreichbarkeitsprüfung (karten.moebelfelder) liest dieselbe Maske aus der Karte.
    alt = dict(karten.MOEBEL)
    karten.MOEBEL["sofa"] = SOFA
    try:
        assert karten.moebelfelder(karte) == {(1, 1)}
    finally:
        karten.MOEBEL.clear()
        karten.MOEBEL.update(alt)
    ohne = tiled(szene, ["." * 8] * 6, _gesetzt({"moebel": "sofa", "feld": [1, 1]}), {"tilesets": []})
    assert "maske" not in {e["name"] for e in ohne["layers"][3]["objects"][0]["properties"]}


def test_bodenteil_liegt_ueber_dem_abgang_und_macht_ihn_zum_loch():
    treppe, diele = _gesetzt({"moebel": "treppe", "feld": [2, 2]}, {"moebel": "diele", "feld": [2, 2]})
    assert treppe["tiefe"] == 1 and treppe["abgedeckt"]
    assert diele["tiefe"] == 2
    szene = {"karte": "mapleFalls.obergeschoss"}
    assert pruefe_loecher(szene, [treppe, diele], MOEBEL) == []
    (ohne,) = _gesetzt({"moebel": "treppe", "feld": [2, 2]})
    assert ohne["tiefe"] == 32 + 48 - 8 and "abgedeckt" not in ohne
    assert len(pruefe_loecher(szene, [ohne], MOEBEL)) == 1
    # Ein Bodenteil ohne Abgang darunter bleibt flach.
    _, frei = _gesetzt({"moebel": "sofa", "feld": [2, 2]}, {"moebel": "diele", "feld": [2, 2]})
    assert frei["tiefe"] == 1


def test_bodenkacheln_katalog_ist_aktuell():
    materialien = json.loads(bodenkacheln.MATERIALIEN.read_text(encoding="utf-8"))
    assert bodenkacheln.ZIEL.read_text(encoding="utf-8") == bodenkacheln.katalogtext(materialien)
    eintraege = bodenkacheln.katalog(materialien)
    for name in ("bkDielen", "bkFliesenWeiss", "bkTeppichRot", "bkStein", "bkGras", "bkErde", "bkErdeRandN"):
        assert eintraege[name]["art"] == "boden_teil" and not eintraege[name]["kollision"]
    assert eintraege["bkDielen"]["ausschnitt"] == [80, 208, 96, 224]
    assert "bkWandHolzOben" in eintraege and "bkWasserMoor" in eintraege


def test_ruecklauf_nennt_kollision_und_auslöser():
    vorher = {
        "karte": "t.raum",
        "objekte": [{"moebel": "sofa", "feld": [1, 1]}],
        "ausloeser": [{"name": "treppe", "feld": [2, 2]}, {"name": "alt", "feld": [5, 5]}],
    }
    nachher = {
        "karte": "t.raum",
        "objekte": [{"moebel": "sofa", "feld": [1, 1], "kollision": False}],
        "ausloeser": [{"name": "treppe", "feld": [2, 2]}, {"name": "treppe", "feld": [3, 2]}],
    }
    eintrag = {
        "datei": "raum.json",
        "vorher": vorher,
        "nachher": nachher,
        "zuordnung": [0],
        "markierungen": {"ausloeser": [0, None]},
    }
    text = "\n".join(editorrueck.berichte(eintrag, MOEBEL))
    assert "Kollision: sofa (1, 1): kollision false (Katalog: sperrt), OHNE GRUND" in text
    assert "hinzugefügt (ausloeser): treppe (3, 2)" in text
    assert "gelöscht (ausloeser): alt (5, 5)" in text
    mit_grund = {**nachher["objekte"][0], "maske": ["#."], "kollision": True, "begehbar_grund": "Loch"}
    zeile = kollisionszeile({}, mit_grund, SOFA, "(1, 1)")
    assert zeile == "Kollision: sofa (1, 1): kollision true, maske #. (Katalog: sperrt), Grund: Loch"
    assert kollisionszeile(vorher["objekte"][0], vorher["objekte"][0], SOFA, "(1, 1)") is None
