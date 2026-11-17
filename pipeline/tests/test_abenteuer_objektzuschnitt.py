"""Tests für den Zuschnitt eines Objekts (``objektzuschnitt.py``, ``objektform.py``, Editor 1.5).

Warum: Der Autor beschneidet im Karteneditor Bilder, etwa einen Pfosten aus einem Zaunstück (Wunsch
des Autors, 16.11.2026). Kartenbau, Prüfungen, App und Editor müssen Größe, Maske und Tiefe gleich
rechnen. Kleine Kunstdaten, ohne private Bilder.
"""

import pytest

from pipeline.abenteuer.editorzuschnitt import deckkraftzeilen, zuschnittvorschlaege, zuschnittzeilen
from pipeline.abenteuer.kartenbau import platziere, sperrfelder, tiled
from pipeline.abenteuer.objektform import (
    formbefunde,
    formbild,
    formeigenschaften,
    geformt,
    hat_form,
    mit_deckkraft,
)
from pipeline.abenteuer.objektrichtung import ausgerichtet, forme_rechteck, formschluessel
from pipeline.abenteuer.objektzuschnitt import beschneide_maske, zuschnitt_von, zuschnittbefunde

ZAUN = {"quelle": "z.png", "breite": 64, "hoehe": 32, "kollision": True}
TOR = {"quelle": "t.png", "breite": 64, "hoehe": 48, "kollision": True, "maske": ["....", "#..#", "#..#"]}
POSTEN = [26, 0, 32, 0]


def test_zuschnitt_lesen_liste_text_tupel():
    assert zuschnitt_von({"zuschnitt": POSTEN}) == (26, 0, 32, 0)
    assert zuschnitt_von({"zuschnitt": "26,0,32,0"}) == (26, 0, 32, 0)
    assert zuschnitt_von({"zuschnitt": (1, 2, 3, 4)}) == (1, 2, 3, 4)
    assert zuschnitt_von({"zuschnitt": [0, 0, 0, 0]}) is None
    assert not hat_form({"zuschnitt": [0, 0, 0, 0]})
    assert hat_form({"zuschnitt": POSTEN})


def test_pfosten_aus_zaun_groesse_und_maske():
    pfosten = geformt(ZAUN, {"zuschnitt": POSTEN})
    assert (pfosten["breite"], pfosten["hoehe"]) == (6, 32)
    assert pfosten["maske"] == [".", "#"]  # Standardregel des Zauns, mitbeschnitten
    assert ZAUN.get("maske") is None  # Katalog unverändert


def test_maske_kacheln_fallen_weg_oder_bleiben_angeschnitten():
    # Tor ohne linken Pfosten: Spalte 0 fällt ganz weg.
    assert geformt(TOR, {"zuschnitt": [16, 0, 0, 0]})["maske"] == ["...", "..#", "..#"]
    # Nicht auf 16 px: Die angeschnittene Spalte 0 gilt, solange 6 px übrig sind.
    assert geformt(TOR, {"zuschnitt": [10, 0, 0, 0]})["maske"] == ["....", "#.##", "#.##"]
    # Oben 16 weg: Die freie oberste Reihe fällt weg, der Pfosten sperrt bis oben.
    assert geformt(TOR, {"zuschnitt": [0, 16, 0, 0]})["maske"] == ["#..#", "#..#"]
    assert beschneide_maske(["#"], (8, 0, 0, 0), 8, 16) == ["#"]


def test_eigene_maske_gilt_ueber_dem_ausschnitt():
    eintrag = {"zuschnitt": [0, 0, 24, 0], "maske": ["##", ".."]}
    angabe = geformt(ZAUN, eintrag)
    assert (angabe["breite"], angabe["hoehe"]) == (40, 32)
    assert angabe["maske"] == ["##.", "..."]  # Raster 3 × 2: angefangene Kacheln zählen


def test_zuschnitt_vor_drehung_und_spiegeln():
    gedreht = geformt(TOR, {"zuschnitt": [16, 0, 0, 0], "drehung": 90})
    assert (gedreht["breite"], gedreht["hoehe"]) == (48, 48)
    assert gedreht["maske"] == ["...", "...", "##."]
    gespiegelt = geformt(TOR, {"zuschnitt": [16, 0, 0, 0], "spiegeln": True})
    assert gespiegelt["maske"] == ["...", "#..", "#.."]
    skaliert = geformt(ZAUN, {"zuschnitt": POSTEN, "massstab": 2})
    assert (skaliert["breite"], skaliert["hoehe"]) == (12, 64)
    # Die beschnittene Katalogmaske [".", "#"] wächst mit (objektmassstab.py): oben 32 Pixel frei.
    assert skaliert["maske"] == [".", ".", "#", "#"]


def test_kartenbau_tiefe_folgt_der_unteren_kante_und_tiled_traegt_den_zuschnitt():
    szene = {"objekte": [{"moebel": "zaun", "feld": [2, 2], "zuschnitt": [0, 0, 0, 16]}]}
    gesetzt, befunde = platziere(szene, {"zaun": ZAUN})
    assert befunde == []
    stueck = gesetzt[0]
    assert (stueck["breite"], stueck["hoehe"], stueck["tiefe"]) == (64, 16, 32 + 16 - 8)
    assert sperrfelder(stueck) == set()  # nur die freie oberste Reihe ist übrig
    eigenschaften = formeigenschaften({"zuschnitt": POSTEN})
    assert eigenschaften == [{"name": "zuschnitt", "type": "string", "value": "26,0,32,0"}]
    szene = {"karte": "test.raum", "objekte": [{"moebel": "zaun", "feld": [1, 1], "zuschnitt": POSTEN}]}
    gesetzt, _ = platziere(szene, {"zaun": ZAUN})
    karte = tiled(szene, ["." * 8] * 6, gesetzt, {"tilesets": []})
    objekt = next(o for e in karte["layers"] for o in e.get("objects", []) if o.get("type") == "moebel")
    assert (objekt["width"], objekt["height"]) == (6, 32)
    assert {"name": "zuschnitt", "type": "string", "value": "26,0,32,0"} in objekt["properties"]


def test_zuschnitt_befunde():
    szene = {"objekte": [{"moebel": "zaun", "feld": [1, 1], "zuschnitt": [40, 0, 30, 0]}]}
    assert "nichts übrig" in zuschnittbefunde(szene, {"zaun": ZAUN})[0]
    szene = {"objekte": [{"moebel": "zaun", "feld": [1, 1], "zuschnitt": [1, 2]}]}
    assert "vier ganze Zahlen" in zuschnittbefunde(szene, {"zaun": ZAUN})[0]


def test_rechteck_und_formschluessel_mit_zuschnitt():
    assert forme_rechteck((0, 0, 32, 8), 32, 16, {"zuschnitt": (8, 0, 0, 0)}) == (0, 0, 24, 8)
    assert formschluessel({"zuschnitt": [1, 0, 0, 0]}) == (("zuschnitt", (1, 0, 0, 0)),)
    hash(formschluessel({"zuschnitt": [1, 0, 0, 0], "drehung": 90}))
    tisch = {"breite": 32, "hoehe": 16, "platte": [0, 0, 32, 8]}
    assert ausgerichtet(tisch, {"zuschnitt": [8, 0, 0, 0]})["platte"] == [0, 0, 24, 8]


def test_bericht_nennt_zuschnitt_und_schlaegt_eintrag_vor():
    zeilen = zuschnittzeilen({}, {"moebel": "zaun", "zuschnitt": POSTEN}, ZAUN, "(4, 6)")
    assert zeilen == [
        "Zuschnitt: zaun (4, 6) beschnitten auf 6 × 32: links 26, oben 0, rechts 32, unten 0"
        " (Katalog 64 × 32)"
    ]
    weg = zuschnittzeilen({"moebel": "zaun", "zuschnitt": POSTEN}, {"moebel": "zaun"}, ZAUN, "(4, 6)")
    assert "aufgehoben" in weg[0]
    szenen = [
        {"datei": f"{n}.json", "nachher": {"objekte": [{"moebel": "zaun", "zuschnitt": POSTEN}]}}
        for n in ("a", "b")
    ]
    vorschlag = zuschnittvorschlaege(szenen, {"zaun": ZAUN})
    assert len(vorschlag) == 1 and "2 Karten" in vorschlag[0]
    assert "ausschnitt [26, 0, 32, 32]" in vorschlag[0] and "maske ./#" in vorschlag[0]
    assert zuschnittvorschlaege(szenen[:1], {"zaun": ZAUN}) == []


def test_formbild_schneidet_vor_drehung():
    image = pytest.importorskip("PIL.Image")
    bild = image.new("RGBA", (64, 32), (0, 0, 0, 0))
    for y in range(32):
        for x in range(26, 32):
            bild.putpixel((x, y), (200, 100, 0, 255))
    bild.putpixel((26, 0), (255, 0, 0, 255))  # Ecke oben links des Pfostens
    pfosten = formbild(bild, {"zuschnitt": POSTEN})
    assert pfosten.size == (6, 32)
    assert pfosten.getpixel((0, 0)) == (255, 0, 0, 255)
    assert all(pfosten.getpixel((x, 5))[3] == 255 for x in range(6))
    gedreht = formbild(bild, {"zuschnitt": POSTEN, "drehung": 90, "spiegeln": True})
    assert gedreht.size == (32, 6)
    # Gespiegelt liegt die rote Ecke oben rechts, nach 90 Grad unten rechts.
    assert gedreht.getpixel((31, 5)) == (255, 0, 0, 255)


def test_deckkraft_im_kartenbau_tiled_bericht_und_bild():
    szene = {"karte": "test.raum", "objekte": [{"moebel": "zaun", "feld": [1, 1], "deckkraft": 50}]}
    gesetzt, befunde = platziere(szene, {"zaun": ZAUN})
    assert befunde == [] and gesetzt[0]["deckkraft"] == 50
    assert sperrfelder(gesetzt[0]) == {(1, 2), (2, 2), (3, 2), (4, 2)}  # Kollision bleibt
    karte = tiled(szene, ["." * 8] * 6, gesetzt, {"tilesets": []})
    objekt = next(o for e in karte["layers"] for o in e.get("objects", []) if o.get("type") == "moebel")
    assert {"name": "deckkraft", "type": "int", "value": 50} in objekt["properties"]
    ohne, _ = platziere({"objekte": [{"moebel": "zaun", "feld": [1, 1], "deckkraft": 100}]}, {"zaun": ZAUN})
    assert "deckkraft" not in ohne[0]
    assert "nicht 25, 50, 75 oder 100" in formbefunde({"objekte": [{"moebel": "z", "deckkraft": 40}]})[0]
    assert deckkraftzeilen({"moebel": "zaun"}, {"moebel": "zaun", "deckkraft": 25}, "(1, 1)") == [
        "Deckkraft: zaun (1, 1) 100 → 25 %"
    ]
    image = pytest.importorskip("PIL.Image")
    bild = image.new("RGBA", (2, 2), (10, 20, 30, 255))
    assert mit_deckkraft(bild, {"deckkraft": 50}).getpixel((0, 0)) == (10, 20, 30, 128)
    assert mit_deckkraft(bild, {}) is bild
