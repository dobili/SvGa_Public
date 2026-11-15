"""Tests der Ausrichtungsprüfung (pipeline/abenteuer/ausrichtung.py, KARTENREGELN 10.78).

Kleine Beispielräume nach dem Vorbild des Gasthauses Lockport (Kegelbahn von West nach Ost), dazu
die Katalogangaben des echten Möbelkatalogs.
"""

from pipeline.abenteuer.ausrichtung import pruefe_szene
from pipeline.abenteuer.katalogausrichtung import (
    namenshinweis,
    pruefe_eintrag,
    pruefe_katalog,
    varianten_im_bestand,
)

RAUM = [
    "##########",
    "##########",
    "#........#",
    "#........#",
    "#........#",
    "#........#",
    "##########",
]


def _m(quelle: str, breite: int = 16, hoehe: int = 16, kollision: bool = True, **angaben) -> dict:
    return {"quelle": quelle, "breite": breite, "hoehe": hoehe, "kollision": kollision, **angaben}


MOEBEL = {
    "bande": _m("bande.png", lauf="waagrecht", verbund="kegelbahn"),
    "kegel": _m("kegel.png", kollision=False, verbund="kegelbahn", stelle="ende"),
    "fang": _m("fang.png", lauf="senkrecht", ende="nord", verbund="kegelbahn", varianten={"ost": "ende.png"}),
    "ende": _m("ende.png", lauf="waagrecht", ende="ost", verbund="kegelbahn"),
    "tisch": _m("tisch.png", 32, 32, art="tisch"),
    "stuhlRechts": _m("s.png", 16, 32, art="stuhl", blick="rechts"),
    "stuhlLinks": _m("s2.png", 16, 32, art="stuhl", blick="links"),
    "hocker": _m("h.png", 16, 32, art="stuhl", blick="oben"),
    "theke": _m("t.png", 48, 32, art="theke", blick="unten"),
    "bett": _m("b.png", 48, 48, art="bett", lauf="waagrecht", ende="ost", varianten={"west": "b2.png"}),
    "bild": _m("bild.png", 16, 16, kollision=False, art="bild"),
}


def _szene(objekte: list[dict], raster: list[str] = RAUM) -> dict:
    return {"karte": "test.raum", "art": "innen", "raster": raster, "objekte": objekte}


def _bahn(endstueck: str, x_ende: int) -> list[dict]:
    """Bande von Spalte 2 bis 6 in Reihe 3, Kegel und Endstück an Spalte x_ende in Reihe 2."""
    bande = [{"moebel": "bande", "feld": [x, 3]} for x in range(2, 7)]
    return bande + [{"moebel": "kegel", "feld": [x_ende - 1, 2]}, {"moebel": endstueck, "feld": [x_ende, 2]}]


def test_kugelfang_nach_unten_an_waagrechter_bahn():
    """Der Befund des Autors: Endstück mit Schacht nach Norden an einer Bahn von West nach Ost."""
    befunde = pruefe_szene(_szene(_bahn("fang", 7)), MOEBEL)
    assert len(befunde) == 1
    assert "läuft senkrecht" in befunde[0].text
    assert "ende.png" in befunde[0].vorschlag


def test_waagrechtes_endstueck_am_richtigen_und_falschen_ende():
    assert pruefe_szene(_szene(_bahn("ende", 7)), MOEBEL) == []
    falsch = _bahn("ende", 7)
    falsch[-1]["feld"] = [1, 3]  # Endstück nach Osten am Westende der Bande
    assert any("schließt nach ost ab" in b.text for b in pruefe_szene(_szene(falsch), MOEBEL))


def test_stuhl_schaut_zum_tisch():
    gut = [{"moebel": "tisch", "feld": [4, 3]}, {"moebel": "stuhlRechts", "feld": [3, 3]}]
    assert pruefe_szene(_szene(gut), MOEBEL) == []
    schlecht = [{"moebel": "tisch", "feld": [4, 3]}, {"moebel": "stuhlLinks", "feld": [3, 3]}]
    assert any("nicht zu tisch" in b.text for b in pruefe_szene(_szene(schlecht), MOEBEL))


def test_hocker_hinter_der_theke():
    vorn = [{"moebel": "theke", "feld": [3, 2]}, {"moebel": "hocker", "feld": [4, 3]}]
    assert pruefe_szene(_szene(vorn), MOEBEL) == []
    raster = ["##########", "#........#", *RAUM[2:]]
    hinten = [{"moebel": "theke", "feld": [3, 3]}, {"moebel": "hocker", "feld": [4, 2]}]
    assert any("sitzt hinter theke" in b.text for b in pruefe_szene(_szene(hinten, raster), MOEBEL))


def test_kopfende_an_der_wand():
    an_wand = [{"moebel": "bett", "feld": [6, 2]}]  # Kopfende Ost, rechts Wand
    assert pruefe_szene(_szene(an_wand), MOEBEL) == []
    frei = [{"moebel": "bett", "feld": [1, 2]}]  # Kopfende Ost mitten im Raum
    befunde = pruefe_szene(_szene(frei), MOEBEL)
    assert "Kopfende (ost)" in befunde[0].text and "b2.png" in befunde[0].vorschlag


def test_frontales_wandbild_an_der_seitenwand():
    raster = ["#####", "#...#", "#...#", "#...#", "#####"]
    nord = [{"moebel": "bild", "feld": [2, 0], "an_wand": True}]
    assert pruefe_szene(_szene(nord, raster), MOEBEL) == []
    seite = [{"moebel": "bild", "feld": [0, 2], "an_wand": True}]
    assert any("Seitenwand" in b.text for b in pruefe_szene(_szene(seite, raster), MOEBEL))


def test_katalogangaben_werden_geprueft():
    assert pruefe_eintrag("x", {"lauf": "schraeg"})
    assert pruefe_eintrag("x", {"lauf": "waagrecht", "ende": "nord"})
    assert pruefe_eintrag("x", {"stelle": "ende"})
    assert pruefe_eintrag("x", {"lauf": "waagrecht", "ende": "ost", "verbund": "a", "stelle": "ende"}) == []
    assert namenshinweis({"quelle": "a/leitplanke_laengs_5.png", "lauf": "waagrecht"})
    assert namenshinweis({"quelle": "a/feldbahn_laengs.png", "lauf": "senkrecht"}) is None


def test_echter_katalog_ohne_widersprueche():
    """Dasselbe Bild hat überall dieselbe Richtung; alle Werte sind bekannt."""
    from pipeline.abenteuer.moebelliste import lade_moebel

    assert pruefe_katalog(lade_moebel()) == []


def test_varianten_im_bestand(tmp_path):
    (tmp_path / "spiel" / "eigene").mkdir(parents=True)
    for name in ("feldbahn_laengs.png", "feldbahn_quer.png"):
        (tmp_path / "spiel" / "eigene" / name).write_bytes(b"")
    assert varianten_im_bestand("spiel/eigene/feldbahn_laengs.png", tmp_path) == [
        "spiel/eigene/feldbahn_quer.png"
    ]
    assert varianten_im_bestand("spiel/eigene/feldbahn_laengs.png", None) == []
