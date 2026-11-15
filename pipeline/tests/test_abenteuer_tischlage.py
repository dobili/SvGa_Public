"""Tests der Prüfung „Lage am Tisch“ (pipeline/abenteuer/tischlage.py, KARTENREGELN 10.79).

Kleine Beispielräume nach den Rückmeldungen des Autors (15.11.2026): Bretter mittig auf dem Tisch
(Summit-Hütte, Pavillon Riverton), Hocker direkt am Tresen (Raststätte Crossroads), Stühle mittig vor
den Bildschirmen (Akademie Silicon Bay), Schachuhr seitlich neben dem Brett. Ohne Grafikpaket misst
die Prüfung die ganzen Bilder.
"""

import pytest

from pipeline.abenteuer import tischlage_teile
from pipeline.abenteuer.tischlage import plaetze, pruefe_szene

RAUM = ["#" * 12] * 3 + ["#" + "." * 10 + "#"] * 6 + ["#" * 12]


def _m(quelle: str, breite: int, hoehe: int, **angaben) -> dict:
    return {"quelle": quelle, "breite": breite, "hoehe": hoehe, "kollision": True, **angaben}


MOEBEL = {
    "tisch": _m("tisch.png", 32, 32, art="tisch", platte=[7, 10, 25, 24]),
    "langtisch": _m("lang.png", 64, 32, art="tisch", platte=[0, 8, 64, 24]),
    "tischOhnePlatte": _m("tisch2.png", 32, 32, art="tisch"),
    "brett": _m("x/schachbrett_klein.png", 12, 9, art="deko"),
    "uhr": _m("x/schachuhr_klein.png", 8, 6, art="deko"),
    "theke": _m("theke.png", 64, 32, art="theke", blick="unten"),
    "hocker": _m("hocker.png", 16, 32, art="stuhl", blick="oben"),
    "stuhlRechts": _m("stuhlR.png", 16, 32, art="stuhl", blick="rechts"),
    "stuhlLinks": _m("stuhlL.png", 16, 32, art="stuhl", blick="links"),
    "stuhlOben": _m("stuhlO.png", 16, 32, art="stuhl", blick="oben"),
}


@pytest.fixture(autouse=True)
def _ohne_grafikpaket():
    """Die Beispielbilder gibt es nicht: ohne Grafikpaket, danach den alten Wert zurück."""
    alt = tischlage_teile.BESTAND[0]
    tischlage_teile.BESTAND[0] = None
    yield
    tischlage_teile.BESTAND[0] = alt


def _szene(objekte: list[dict]) -> dict:
    return {"karte": "test.raum", "art": "innen", "raster": RAUM, "objekte": objekte}


def test_brett_mit_der_regel_des_kartenbauers_liegt_zu_hoch():
    """„auf“ setzt den Fuß auf drei Fünftel der Bildhöhe; auf einem Rundtisch ist das zu weit oben."""
    befunde = pruefe_szene(
        _szene([{"moebel": "tisch", "feld": [4, 4], "id": "t"}, {"moebel": "brett", "auf": "t"}]), MOEBEL
    )
    assert len(befunde) == 1
    assert "nicht mittig" in befunde[0].text
    assert befunde[0].vorschlag == "versatz [0, 2]"


def test_brett_mittig_mit_versatz_ist_in_ordnung():
    objekte = [
        {"moebel": "tisch", "feld": [4, 4], "id": "t"},
        {"moebel": "brett", "auf": "t", "versatz": [0, 3]},
    ]
    assert pruefe_szene(_szene(objekte), MOEBEL) == []


def test_brett_ueber_dem_rand_der_platte():
    objekte = [
        {"moebel": "tisch", "feld": [4, 4], "id": "t"},
        {"moebel": "brett", "auf": "t", "versatz": [9, 3]},
    ]
    texte = [b.text for b in pruefe_szene(_szene(objekte), MOEBEL)]
    assert "liegt nicht ganz auf der Tischplatte" in texte


def test_zwei_bretter_teilen_den_langtisch():
    """Pavillon Riverton: zwei Bretter auf einem langen Tisch liegen je mittig auf ihrer Hälfte."""
    assert plaetze((0, 8, 64, 24), 2) == [(16.0, 16.0), (48.0, 16.0)]
    objekte = [{"moebel": "langtisch", "feld": [3, 4], "id": "t"}]
    objekte += [{"moebel": "brett", "auf": "t", "versatz": [dx, 1]} for dx in (-16, 16)]
    assert pruefe_szene(_szene(objekte), MOEBEL) == []
    objekte[1]["versatz"] = [-10, 1]
    befunde = pruefe_szene(_szene(objekte), MOEBEL)
    assert [b.vorschlag for b in befunde] == ["versatz [-16, 1]"]


def test_tisch_ohne_platte_wird_gemeldet():
    objekte = [{"moebel": "tischOhnePlatte", "feld": [4, 4], "id": "t"}, {"moebel": "brett", "auf": "t"}]
    assert "ohne Katalogangabe platte" in pruefe_szene(_szene(objekte), MOEBEL)[0].text


def test_uhr_seitlich_neben_dem_brett():
    objekte = [
        {"moebel": "langtisch", "feld": [3, 4], "id": "t"},
        {"moebel": "brett", "auf": "t", "versatz": [0, 1]},
        {"moebel": "uhr", "auf": "t", "versatz": [11, -1]},
    ]
    assert pruefe_szene(_szene(objekte), MOEBEL) == []
    objekte[2]["versatz"] = [0, -6]
    befunde = pruefe_szene(_szene(objekte), MOEBEL)
    assert len(befunde) == 1
    assert "seitlich neben dem Brett" in befunde[0].text


def test_hocker_zu_weit_vor_der_theke():
    """Raststätte Crossroads: Hocker mit Lücke vor dem Tresen; direkt davor ist in Ordnung."""
    objekte = [
        {"moebel": "theke", "feld": [3, 3]},
        {"moebel": "hocker", "feld": [4, 5], "vorn": True, "versatz": [0, 4]},
    ]
    befunde = pruefe_szene(_szene(objekte), MOEBEL)
    assert len(befunde) == 1
    assert befunde[0].vorschlag == "versatz [0, 0]"
    objekte[1]["versatz"] = [0, -6]
    assert pruefe_szene(_szene(objekte), MOEBEL) == []


def test_stuehle_links_und_rechts_gleich_weit_weg():
    objekte = [
        {"moebel": "tisch", "feld": [4, 4], "id": "t"},
        {"moebel": "stuhlRechts", "feld": [3, 4], "zu": "t"},
        {"moebel": "stuhlLinks", "feld": [6, 4], "zu": "t"},
    ]
    assert pruefe_szene(_szene(objekte), MOEBEL) == []
    objekte[2]["versatz"] = [4, 0]
    befunde = pruefe_szene(_szene(objekte), MOEBEL)
    assert len(befunde) == 1
    assert "nicht mittig zwischen seinen Stühlen" in befunde[0].text


def test_stuhl_zu_weit_weg_vom_tisch():
    objekte = [
        {"moebel": "tisch", "feld": [4, 4], "id": "t"},
        {"moebel": "stuhlRechts", "feld": [2, 4], "zu": "t"},
    ]
    befunde = pruefe_szene(_szene(objekte), MOEBEL)
    assert len(befunde) == 1
    assert befunde[0].vorschlag == "versatz [13, 0]"


def test_stuehle_mittig_vor_ihren_plaetzen():
    """Akademie: zwei Stühle vor einem langen Tisch stehen je vor einer Hälfte (Bildschirm)."""
    objekte = [
        {"moebel": "langtisch", "feld": [3, 4], "id": "t"},
        {"moebel": "stuhlOben", "feld": [3, 5], "zu": "t", "versatz": [8, 0]},
        {"moebel": "stuhlOben", "feld": [5, 5], "zu": "t", "versatz": [8, 0]},
    ]
    assert pruefe_szene(_szene(objekte), MOEBEL) == []
    objekte[2]["versatz"] = [0, 0]
    befunde = pruefe_szene(_szene(objekte), MOEBEL)
    assert [b.vorschlag for b in befunde] == ["versatz [8, 0]"]


def test_echter_katalog_hat_platten_fuer_alle_tische_mit_brettern():
    """Jeder Tisch, auf dem in einer Szene ein Brett oder eine Uhr liegt, hat die Angabe platte."""
    from pipeline.abenteuer.kartenbau import INHALTE, lade
    from pipeline.abenteuer.moebelliste import lade_moebel

    moebel = lade_moebel()
    fehlend = set()
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        for b in pruefe_szene(lade(pfad), moebel):
            if "ohne Katalogangabe platte" in b.text:
                fehlend.add(b.moebel)
    assert fehlend == set()
